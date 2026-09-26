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

    const currentVolume = input.currentBoard.volumeL;
    if (typeof currentVolume === 'number' && currentVolume > 0) {
      const diffPct = Math.abs(board.representativeSku.volumeL - currentVolume) / currentVolume;
      if (diffPct <= 0.08) {
        addReason(reasons, 'MATCH_VOLUME_TRANSITION', '代表サイズのL数が現板から±8%以内で、急激な容量変化を避けやすい候補です。', 10);
      } else if (diffPct >= 0.2) {
        warnings.push('代表サイズは現板からL数差が大きいため、別サイズSKUを優先して確認する必要があります。');
      }
    }

    if (input.skill === 'takeoff' && board.category === 'twin') {
      warnings.push('ツインは最初の1本候補として自動優先せず、安定したテイクオフを先に確認します。');
    }

    const score = reasons.reduce((sum, reason) => sum + reason.points, 0);
    return { board, score, reasons, warnings };
  });

  return matches
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
