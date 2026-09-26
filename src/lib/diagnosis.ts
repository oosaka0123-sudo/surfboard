export type SurfSkill =
  | 'takeoff'
  | 'trim'
  | 'ups-downs'
  | 'cutback'
  | 'top-action';

export type TakeoffRate = '0-2' | '3-5' | '6-8' | '9-10';
export type SurfFrequency = '0-1' | '2-4' | '5-8' | '9-plus';
export type WaveSize = 'knee-thigh' | 'waist-chest' | 'shoulder-head' | 'overhead';
export type BoardIssue =
  | 'paddle-hard'
  | 'miss-wave'
  | 'pearling'
  | 'no-speed'
  | 'hard-turn'
  | 'unstable'
  | 'none';
export type Goal =
  | 'more-waves'
  | 'easy-takeoff'
  | 'speed'
  | 'carving'
  | 'action'
  | 'new-feel';

export interface CurrentBoard {
  lengthFt?: number;
  lengthIn?: number;
  widthIn?: number;
  thicknessIn?: number;
  volumeL?: number;
}

export interface DiagnosisInput {
  heightCm: number;
  weightKg: number;
  frequency: SurfFrequency;
  skill: SurfSkill;
  takeoffRate: TakeoffRate;
  currentBoard: CurrentBoard;
  waveSize: WaveSize;
  issue: BoardIssue;
  goal: Goal;
}

export interface FiredRule {
  id: string;
  message: string;
  severity: 'info' | 'important' | 'guardrail';
}

export interface DiagnosisProfile {
  rules: FiredRule[];
  notes: string[];
}

// MVPでは「診断理由を説明できること」を先に作る。
// 実在モデル推薦は公式スペックDBが揃うまで追加しない。
export function buildProfile(input: DiagnosisInput): DiagnosisProfile {
  const rules: FiredRule[] = [];
  const notes: string[] = [];

  if (input.frequency === '0-1' || input.frequency === '2-4') {
    rules.push({
      id: 'FREQUENCY_KEEP_MARGIN',
      message: '入水頻度を考慮し、極端なダウンサイジングを避けます。',
      severity: 'important',
    });
  }

  if (input.issue === 'paddle-hard' || input.issue === 'miss-wave') {
    rules.push({
      id: 'PADDLE_PLANING_PRIORITY',
      message: 'パドルと波のキャッチを改善しやすい設計を優先します。',
      severity: 'important',
    });
  }

  if (input.issue === 'pearling') {
    rules.push({
      id: 'ENTRY_CONTROL',
      message: 'テイクオフ時の刺さりやすさを考慮し、ノーズ側の設計適合を重視します。',
      severity: 'important',
    });
  }

  if (input.skill === 'takeoff' && input.goal === 'action') {
    rules.push({
      id: 'SKILL_GOAL_GUARDRAIL',
      message: '現在の技術と目標の差が大きいため、ハイパフォーマンス系への急な移行を避けます。',
      severity: 'guardrail',
    });
  }

  if (typeof input.currentBoard.volumeL === 'number') {
    notes.push(`現板 ${input.currentBoard.volumeL}L を基準に、急激な容量変化を避けて比較します。`);
  } else {
    notes.push('現板のL数は未入力のため、長さ・幅・厚みと体感を優先して比較します。');
  }

  return { rules, notes };
}
