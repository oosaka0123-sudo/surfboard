import { ACTIVE_BOARD_MODELS, type BoardModel } from '../data/boards';
import type { DiagnosisInput } from './diagnosis';

export interface MatchReason {
  ruleId: string;
  text: string;
  points: number;
}

export interface BoardMatch {
  board: BoardModel;
  score: number;
  reasons: MatchReason[];
  warnings: string[];
}

function addReason(reasons: MatchReason[], ruleId: string, text: string, points: number) {
  reasons.push({ ruleId, text, points });
}

export function recommendBoards(input: DiagnosisInput): BoardMatch[] {
  const matches = ACTIVE_BOARD_MODELS.map((board) => {
    const reasons: MatchReason[] = [];
    const warnings = [...board.cautions];

    const hardExcluded =
      board.category === 'twin' &&
      (input.skill === 'takeoff' || input.takeoffRate === '0-2');

    if (hardExcluded) {
      return { board, score: -1, reasons: [], warnings: ['テイクオフ安定前のため、Twin系はMVPでは安全側に除外します。'] };
    }

    if ((input.issue === 'paddle-hard' || input.issue === 'miss-wave') && board.verifiedClaims.easyWaveCatching) {
      addReason(reasons, 'MATCH_EASY_WAVE_CATCH', '波をつかみやすい設計としてメーカーが説明しています。', 22);
    }
    if ((input.issue === 'paddle-hard' || input.issue === 'miss-wave') && board.verifiedClaims.extraPaddlePower) {
      addReason(reasons, 'MATCH_PADDLE_POWER', 'パドルパワーを補いやすい設計説明があります。', 20);
    }
    if ((input.goal === 'more-waves' || input.goal === 'easy-takeoff') && board.verifiedClaims.smallWaveFocus) {
      addReason(reasons, 'MATCH_SMALL_WAVE', '小波・平均以下のコンディションを主用途に含むモデルです。', 18);
    }
    if (input.goal === 'speed' && board.verifiedClaims.speedFocus) {
      addReason(reasons, 'MATCH_SPEED', 'スピード特性をメーカーが明示しています。', 18);
    }
    if (input.goal === 'new-feel' && board.category === 'twin') {
      addReason(reasons, 'MATCH_TWIN_FEEL', 'ツイン特有のスピードとラインを試したい目的に一致します。', 18);
    }
    if ((input.waveSize === 'shoulder-head' || input.waveSize === 'overhead') && (board.verifiedClaims.allConditions || board.verifiedClaims.strongHold)) {
      addReason(reasons, 'MATCH_RANGE_HOLD', 'サイズのある波まで対応する説明またはホールド性の説明があります。', 16);
    }
    if ((input.waveSize === 'knee-thigh' || input.waveSize === 'waist-chest') && board.verifiedClaims.allRounder) {
      addReason(reasons, 'MATCH_EVERYDAY_RANGE', '日常的なコンディションを含むオールラウンド用途です。', 12);
    }

    if (typeof input.currentBoard.volumeL === 'number') {
      warnings.push('表示中の寸法は代表SKUです。現板との差分判定は、全サイズSKU登録後にサイズ単位で行います。');
    }

    if (input.takeoffRate === '3-5' && board.category === 'twin') {
      warnings.push('テイクオフ成功率がまだ安定していないため、Twin系は試乗・ショップ相談を優先してください。');
    }

    const score = reasons.reduce((sum, reason) => sum + reason.points, 0);
    return { board, score, reasons, warnings };
  });

  return matches
    .filter((match) => match.score >= 12)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
