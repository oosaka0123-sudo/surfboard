import { ACTIVE_BOARD_MODELS, type BoardModel } from '../data/boards';
import type { DiagnosisInput } from './diagnosis';

export interface MatchReason {
  ruleId: string;
  text: string;
}

export interface BoardMatch {
  board: BoardModel;
  score: number;
  reasons: MatchReason[];
  warnings: string[];
}

function addReason(reasons: MatchReason[], ruleId: string, text: string) {
  reasons.push({ ruleId, text });
}

export function recommendBoards(input: DiagnosisInput): BoardMatch[] {
  const matches = ACTIVE_BOARD_MODELS.map((board) => {
    const reasons: MatchReason[] = [];
    const warnings = [...board.cautions];

    const earlyStage =
      input.skill === 'takeoff' ||
      input.skill === 'trim' ||
      input.takeoffRate === '0-2' ||
      input.takeoffRate === '3-5';

    const hardExcluded =
      earlyStage && (board.category === 'twin' || board.category === 'performance');

    if (hardExcluded) {
      const typeLabel = board.category === 'twin' ? 'Twin系' : 'パフォーマンス系';
      return {
        board,
        score: -1,
        reasons: [],
        warnings: [`テイクオフ安定前のため、${typeLabel}はMVPでは安全側に除外します。`],
      };
    }

    if ((input.issue === 'paddle-hard' || input.issue === 'miss-wave') && board.verifiedClaims.easyWaveCatching) {
      addReason(reasons, 'MATCH_EASY_WAVE_CATCH', '波をつかみやすい設計としてメーカーが説明しています。');
    }
    if ((input.issue === 'paddle-hard' || input.issue === 'miss-wave') && board.verifiedClaims.extraPaddlePower) {
      addReason(reasons, 'MATCH_PADDLE_POWER', 'パドルパワーを補いやすい設計説明があります。');
    }
    if ((input.goal === 'more-waves' || input.goal === 'easy-takeoff') && board.verifiedClaims.smallWaveFocus) {
      addReason(reasons, 'MATCH_SMALL_WAVE', '小波・平均以下のコンディションを主用途に含むモデルです。');
    }
    if (input.goal === 'speed' && board.verifiedClaims.speedFocus) {
      const contextText = {
        'small-wave-glide': '小波での滑走・グライド方向のスピード特性が説明されています。',
        'carry-speed': 'ライド中にスピードを維持しやすい設計意図が説明されています。',
        general: '幅広いコンディションでのスピード特性が説明されています。',
        'high-performance': '高性能サーフィン向けのスピード特性が説明されています。',
      }[board.verifiedClaims.speedContext ?? 'general'];
      addReason(reasons, 'MATCH_SPEED', contextText);
    }
    if (input.goal === 'new-feel' && ['twin', 'fish', 'midlength'].includes(board.category)) {
      const feelText =
        board.category === 'twin'
          ? 'ツイン特有のスピードとラインを試したい目的に一致します。'
          : board.category === 'fish'
            ? 'フィッシュ系の滑走感と異なるラインを試したい目的に一致します。'
            : 'ミッドレングスの余裕ある滑走感を試したい目的に一致します。';
      addReason(reasons, 'MATCH_ALTERNATIVE_FEEL', feelText);
    }
    if (input.waveSize === 'shoulder-head' && board.verifiedClaims.allConditions) {
      addReason(reasons, 'MATCH_ALL_CONDITIONS', 'メーカーが幅広いコンディションへの対応を明示しています。');
    }
    if (
      (input.waveSize === 'shoulder-head' || input.waveSize === 'overhead') &&
      board.verifiedClaims.holdProjectionClaim
    ) {
      addReason(reasons, 'MATCH_HOLD_PROJECTION', 'メーカーがホールドとプロジェクションを設計意図として説明しています。');
    }
    if (input.waveSize === 'overhead' && !board.verifiedClaims.holdProjectionClaim) {
      warnings.push('頭オーバーではメーカー根拠が十分でないため、この候補だけで判断しないでください。');
    }
    if ((input.waveSize === 'knee-thigh' || input.waveSize === 'waist-chest') && board.verifiedClaims.allRounder) {
      addReason(reasons, 'MATCH_EVERYDAY_RANGE', '日常的なコンディションを含むオールラウンド用途です。');
    }

    if (typeof input.currentBoard.volumeL === 'number') {
      warnings.push('表示中の寸法は代表SKUです。現板との差分判定は、全サイズSKU登録後にサイズ単位で行います。');
    }

    if (input.takeoffRate === '3-5' && board.category === 'twin') {
      warnings.push('テイクオフ成功率がまだ安定していないため、Twin系は試乗・ショップ相談を優先してください。');
    }

    const score = reasons.length;
    return { board, score, reasons, warnings };
  });

  return matches
    .filter((match) => match.score >= 1)
    .sort((a, b) => b.score - a.score || a.board.model.localeCompare(b.board.model));
}


export type MatchRoute = 'easy' | 'progress' | 'alternative';

export interface RoutedBoardMatch extends BoardMatch {
  route: MatchRoute;
  routeLabel: string;
  routeDescription: string;
}

const ROUTES: Array<{
  route: MatchRoute;
  label: string;
  description: string;
  accepts: (match: BoardMatch) => boolean;
}> = [
  {
    route: 'easy',
    label: '楽に乗る',
    description: '波数・パドル・テイクオフの余裕を優先。',
    accepts: (match) =>
      match.reasons.some((reason) =>
        ['MATCH_EASY_WAVE_CATCH', 'MATCH_PADDLE_POWER', 'MATCH_SMALL_WAVE'].includes(reason.ruleId),
      ),
  },
  {
    route: 'progress',
    label: '上達する',
    description: '日常の波で扱いやすさを残しながら、次の動きを狙う。',
    accepts: (match) =>
      ['hybrid', 'performance'].includes(match.board.category) &&
      match.reasons.some((reason) =>
        ['MATCH_EVERYDAY_RANGE', 'MATCH_ALL_CONDITIONS', 'MATCH_SPEED'].includes(reason.ruleId),
      ),
  },
  {
    route: 'alternative',
    label: '新しい楽しみ',
    description: 'フィッシュ・ツイン・ミッドなど、今までと違うラインや滑走感を試す。',
    accepts: (match) =>
      match.reasons.some((reason) => reason.ruleId === 'MATCH_ALTERNATIVE_FEEL'),
  },
];

export function recommendBoardRoutes(input: DiagnosisInput): RoutedBoardMatch[] {
  const matches = recommendBoards(input);
  const usedBoardIds = new Set<string>();
  const routed: RoutedBoardMatch[] = [];

  for (const route of ROUTES) {
    const match = matches.find(
      (candidate) => !usedBoardIds.has(candidate.board.id) && route.accepts(candidate),
    );
    if (!match) continue;

    usedBoardIds.add(match.board.id);
    routed.push({
      ...match,
      route: route.route,
      routeLabel: route.label,
      routeDescription: route.description,
    });
  }

  return routed;
}
