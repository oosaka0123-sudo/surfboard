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

    const hardExcluded =
      board.category === 'twin' &&
      (input.skill === 'takeoff' || input.skill === 'trim' || input.takeoffRate === '0-2' || input.takeoffRate === '3-5');

    if (hardExcluded) {
      return { board, score: -1, reasons: [], warnings: ['テイクオフ安定前のため、Twin系はMVPでは安全側に除外します。'] };
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
    if (input.goal === 'new-feel' && board.category === 'twin') {
      addReason(reasons, 'MATCH_TWIN_FEEL', 'ツイン特有のスピードとラインを試したい目的に一致します。');
    }
    if ((input.waveSize === 'shoulder-head' || input.waveSize === 'overhead') && board.verifiedClaims.allConditions) {
      addReason(reasons, 'MATCH_ALL_CONDITIONS', 'メーカーが幅広いコンディションへの対応を明示しています。');
    }
    if ((input.waveSize === 'shoulder-head' || input.waveSize === 'overhead') && board.verifiedClaims.holdProjectionClaim) {
      addReason(reasons, 'MATCH_HOLD_PROJECTION', 'メーカーがホールドとプロジェクションを設計意図として説明しています。');
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
  accepts: (board: BoardModel) => boolean;
}> = [
  {
    route: 'easy',
    label: '楽に乗る',
    description: '波数・パドル・テイクオフの余裕を優先。',
    accepts: (board) =>
      Boolean(board.verifiedClaims.easyWaveCatching ||
        board.verifiedClaims.extraPaddlePower ||
        board.verifiedClaims.smallWaveFocus),
  },
  {
    route: 'progress',
    label: '上達する',
    description: '日常の波で扱いやすさを残しながら、次の動きを狙う。',
    accepts: (board) =>
      board.category === 'hybrid' &&
      Boolean(board.verifiedClaims.allRounder || board.verifiedClaims.allConditions),
  },
  {
    route: 'alternative',
    label: '新しい楽しみ',
    description: 'ツインなど、今までと違うラインやスピード感を試す。',
    accepts: (board) => board.category === 'twin',
  },
];

export function recommendBoardRoutes(input: DiagnosisInput): RoutedBoardMatch[] {
  const matches = recommendBoards(input);

  return ROUTES.flatMap((route) => {
    const match = matches.find((candidate) => route.accepts(candidate.board));
    if (!match) return [];
    return [{
      ...match,
      route: route.route,
      routeLabel: route.label,
      routeDescription: route.description,
    }];
  });
}
