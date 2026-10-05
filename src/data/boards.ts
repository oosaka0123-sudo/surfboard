export type SourceTier = 'manufacturer' | 'retailer' | 'historical';

export interface BoardSku {
  length: string;
  widthIn: number;
  thicknessIn: number;
  volumeL: number;
}

export interface BoardSource {
  tier: SourceTier;
  url: string;
  checkedAt: string;
  note?: string;
}

export interface BoardModel {
  id: string;
  brand: string;
  model: string;
  status: 'active' | 'research';
  category: 'groveler' | 'hybrid' | 'fish' | 'twin' | 'midlength' | 'performance';
  fins: string[];
  representativeSku: BoardSku;
  verifiedClaims: {
    easyWaveCatching?: boolean;
    extraPaddlePower?: boolean;
    smallWaveFocus?: boolean;
    speedFocus?: boolean;
    speedContext?: 'small-wave-glide' | 'carry-speed' | 'general' | 'high-performance';
    stabilityFocus?: boolean;
    allConditions?: boolean;
    allRounder?: boolean;
    holdProjectionClaim?: boolean;
    highPerformance?: boolean;
  };
  source: BoardSource;
  cautions: string[];
}

export const BOARD_MODELS: BoardModel[] = [
  {
    id: 'lost-puddle-jumper-25',
    brand: 'Lost',
    model: "Original Puddle Jumper '25",
    status: 'active',
    category: 'groveler',
    fins: ['manufacturer-options'],
    representativeSku: { length: "5'5", widthIn: 20.25, thicknessIn: 2.5, volumeL: 31.0 },
    verifiedClaims: {
      easyWaveCatching: true,
      smallWaveFocus: true,
      speedFocus: true,
      speedContext: 'small-wave-glide',
      stabilityFocus: true,
    },
    source: {
      tier: 'manufacturer',
      url: 'https://lostsurfboards.net/surfboards/original-puddle-jumper-25/',
      checkedAt: '2026-09-26',
    },
    cautions: [],
  },
  {
    id: 'ci-rocket-wide',
    brand: 'Channel Islands',
    model: 'Rocket Wide',
    status: 'active',
    category: 'hybrid',
    fins: ['3-fin', '5-fin'],
    representativeSku: { length: "5'8", widthIn: 19.5, thicknessIn: 2.5, volumeL: 30.3 },
    verifiedClaims: {
      extraPaddlePower: true,
      speedFocus: true,
      speedContext: 'carry-speed',
      smallWaveFocus: true,
      allRounder: true,
    },
    source: {
      tier: 'manufacturer',
      url: 'https://cisurfboards.com/products/rocket-wide',
      checkedAt: '2026-09-26',
    },
    cautions: ['CIは上級者向けの目安として、身長より2〜4インチ短く乗る例を示しています。'],
  },
  {
    id: 'hs-hypto-krypto',
    brand: 'Haydenshapes',
    model: 'Hypto Krypto',
    status: 'active',
    category: 'hybrid',
    fins: ['configurable'],
    representativeSku: { length: "5'8", widthIn: 20.0, thicknessIn: 2.5, volumeL: 31.03 },
    verifiedClaims: {
      easyWaveCatching: true,
      speedFocus: true,
      speedContext: 'general',
      allConditions: true,
      allRounder: true,
    },
    source: {
      tier: 'manufacturer',
      url: 'https://www.haydenshapes.com/products/hypto-krypto',
      checkedAt: '2026-09-26',
      note: "代表5'8サイズの寸法はHaydenshapes HSSTUDiOの製品記録を参照しています。",
    },
    cautions: [],
  },
  {
    id: 'ci-twin-pin',
    brand: 'Channel Islands',
    model: 'Twin Pin',
    status: 'active',
    category: 'twin',
    fins: ['twin'],
    representativeSku: { length: "5'9", widthIn: 19.125, thicknessIn: 2.5625, volumeL: 30.6 },
    verifiedClaims: {
      allRounder: true,
      holdProjectionClaim: true,
      speedFocus: true,
      speedContext: 'general',
    },
    source: {
      tier: 'manufacturer',
      url: 'https://shop-au.cisurfboards.com/products/twin-pin',
      checkedAt: '2026-09-26',
    },
    cautions: ['CIは低めのレール設計を説明しており、普段のショートより約1/8インチ厚めを選ぶ例を示しています。'],
  },
  {
    id: 'firewire-dominator-2',
    brand: 'Firewire',
    model: 'Dominator 2.0',
    status: 'active',
    category: 'hybrid',
    fins: ['manufacturer-options'],
    representativeSku: { length: "5'8", widthIn: 20.0, thicknessIn: 2.375, volumeL: 30.1 },
    verifiedClaims: {
      speedFocus: true,
      speedContext: 'general',
      allConditions: true,
    },
    source: {
      tier: 'manufacturer',
      url: 'https://www.firewiresurfboards.com/products/dominator-2-0-2026',
      checkedAt: '2026-09-26',
      note: 'FirewireはDominator 2.0を、幅広いコンディションに対応する扱いやすいパフォーマンス系として説明しています。',
    },
    cautions: ['最終サイズは全SKU表から選ぶ必要があります。表示寸法は代表サイズです。'],
  },
  {
    id: 'firewire-mashup',
    brand: 'Firewire',
    model: 'Mashup',
    status: 'active',
    category: 'hybrid',
    fins: ['5-fin'],
    representativeSku: { length: "5'6", widthIn: 19.625, thicknessIn: 2.5625, volumeL: 30.1 },
    verifiedClaims: {
      extraPaddlePower: true,
      smallWaveFocus: true,
      speedFocus: true,
      speedContext: 'small-wave-glide',
      allRounder: true,
    },
    source: {
      tier: 'manufacturer',
      url: 'https://www.firewiresurfboards.com/products/mashup-2026',
      checkedAt: '2026-09-26',
      note: 'Firewireは1〜5ft向けの日常的なハイブリッドとして、前方のボリュームとパドル面積を特徴に挙げています。',
    },
    cautions: ['最終サイズは全SKU表から選ぶ必要があります。表示寸法は代表サイズです。'],
  },
  {
    id: 'firewire-seaside',
    brand: 'Firewire',
    model: 'Seaside',
    status: 'active',
    category: 'fish',
    fins: ['quad'],
    representativeSku: { length: "5'5", widthIn: 20.9375, thicknessIn: 2.5, volumeL: 31.5 },
    verifiedClaims: {
      extraPaddlePower: true,
      smallWaveFocus: true,
    },
    source: {
      tier: 'manufacturer',
      url: 'https://www.firewiresurfboards.com/products/seaside',
      checkedAt: '2026-09-26',
      note: 'FirewireはSeasideを1〜5ftの小さく弱い波向けとし、十分なパドル力を特徴に挙げています。',
    },
    cautions: ['フィッシュ／クアッド特有の乗り味は、一般的なスラスターとは別物として考えてください。'],
  },
  {
    id: 'firewire-seaside-beyond',
    brand: 'Firewire',
    model: 'Seaside & Beyond',
    status: 'active',
    category: 'midlength',
    fins: ['manufacturer-options'],
    representativeSku: { length: "6'8", widthIn: 20.75, thicknessIn: 2.625, volumeL: 40.9 },
    verifiedClaims: {
      smallWaveFocus: true,
      allConditions: true,
    },
    source: {
      tier: 'manufacturer',
      url: 'https://www.firewiresurfboards.com/products/prestige-seaside-beyond',
      checkedAt: '2026-09-26',
      note: 'Firewireは1〜5ftを推奨範囲とし、ごく小さい日からサイズのある波まで使える汎用性を説明しています。',
    },
    cautions: ['これはミッドレングスのフィッシュ系です。ロングボード推奨として扱いません。'],
  },
  {
    id: 'ci-happy-everyday',
    brand: 'Channel Islands',
    model: 'Happy Everyday',
    status: 'active',
    category: 'performance',
    fins: ['thruster'],
    representativeSku: { length: "5'10", widthIn: 19.75, thicknessIn: 2.5, volumeL: 30.9 },
    verifiedClaims: {
      allConditions: true,
      allRounder: true,
      highPerformance: true,
    },
    source: {
      tier: 'manufacturer',
      url: 'https://shop-au.cisurfboards.com/products/happy-everyday',
      checkedAt: '2026-09-26',
      note: 'CIは日常使い向けに、ハイパフォーマンスショートとグロベラーの中間的な位置づけとしています。',
    },
    cautions: ['パフォーマンス寄りのモデルです。目標だけを理由に初期段階のサーファーへ優先表示しません。'],
  },
  {
    id: 'js-black-baron-21',
    brand: 'JS Industries',
    model: 'Black Baron 2.1',
    status: 'active',
    category: 'twin',
    fins: ['2+1'],
    representativeSku: { length: "5'9", widthIn: 19.5, thicknessIn: 2.6875, volumeL: 31.0 },
    verifiedClaims: {
      extraPaddlePower: true,
      smallWaveFocus: true,
      speedFocus: true,
      speedContext: 'general',
      allConditions: true,
      allRounder: true,
    },
    source: {
      tier: 'manufacturer',
      url: 'https://jsindustries.com/products/black-baron-2-1',
      checkedAt: '2026-09-26',
      note: 'JSは約2〜5ft向けの2+1オールラウンドツインとして、低めのロッカーと追加のパドル力を説明しています。',
    },
    cautions: ['JSは初代Black Baronより約2インチ長く、約1/8インチ厚めを目安として推奨しています。'],
  },
  {
    id: 'ci-better-everyday',
    brand: 'Channel Islands',
    model: 'Better Everyday',
    status: 'active',
    category: 'performance',
    fins: ['5-fin'],
    representativeSku: { length: "5'10", widthIn: 19.75, thicknessIn: 2.5, volumeL: 30.8 },
    verifiedClaims: {
      speedFocus: true,
      speedContext: 'high-performance',
      allRounder: true,
      highPerformance: true,
      holdProjectionClaim: true,
    },
    source: {
      tier: 'manufacturer',
      url: 'https://cisurfboards.com/products/better-everyday',
      checkedAt: '2026-10-05',
      note: 'CIはHappy Everydayの性能系ステップダウンを発展させ、より大きめの波域まで広げたオールラウンドな高性能モデルとして説明しています。',
    },
    cautions: ['高性能寄りのため、初期段階のサーファーには優先表示しません。'],
  },
  {
    id: 'ci-two-happy',
    brand: 'Channel Islands',
    model: 'Two Happy',
    status: 'active',
    category: 'performance',
    fins: ['thruster'],
    representativeSku: { length: "6'1", widthIn: 19.25, thicknessIn: 2.5, volumeL: 31.1 },
    verifiedClaims: {
      extraPaddlePower: true,
      speedFocus: true,
      speedContext: 'high-performance',
      highPerformance: true,
    },
    source: {
      tier: 'manufacturer',
      url: 'https://cisurfboards.com/products/two-happy',
      checkedAt: '2026-10-05',
      note: 'CIはTwo Happyを、ハイパフォーマンス特性を保ちながら幅広いサーファーとコンディションに乗りやすくしたモデルとして説明しています。',
    },
    cautions: ['高性能ショートのため、目標だけを理由に初期段階のサーファーへ優先表示しません。'],
  },
  {
    id: 'ci-mid',
    brand: 'Channel Islands',
    model: 'CI Mid',
    status: 'active',
    category: 'midlength',
    fins: ['2+1'],
    representativeSku: { length: "6'8", widthIn: 20.75, thicknessIn: 2.625, volumeL: 40.2 },
    verifiedClaims: {
      easyWaveCatching: true,
      speedFocus: true,
      speedContext: 'general',
      allRounder: true,
      holdProjectionClaim: true,
    },
    source: {
      tier: 'manufacturer',
      url: 'https://cisurfboards.com/products/68-ci-mid-3',
      checkedAt: '2026-10-05',
      note: 'CIはCI Midを、パドルしやすい前寄りフォームとトリムスピードを持つオールラウンダーとし、肩〜ほぼダブルオーバーヘッドのポイント波でのコントロールも説明しています。',
    },
    cautions: ['ミッドレングスとしての長いレールと2+1特性を前提に選んでください。'],
  },
  {
    id: 'firewire-tj-pro-mid',
    brand: 'Firewire',
    model: 'Taylor Jensen Pro Mid',
    status: 'active',
    category: 'midlength',
    fins: ['5-fin'],
    representativeSku: { length: "7'4", widthIn: 21.875, thicknessIn: 2.625, volumeL: 48.0 },
    verifiedClaims: {
      easyWaveCatching: true,
      extraPaddlePower: true,
      speedFocus: true,
      speedContext: 'general',
      stabilityFocus: true,
      allConditions: true,
      allRounder: true,
      holdProjectionClaim: true,
    },
    source: {
      tier: 'manufacturer',
      url: 'https://www.firewiresurfboards.com/products/taylor-jensen-pro-mid',
      checkedAt: '2026-10-05',
      note: 'Firewireは高速パドル、乗りやすさ、安定性とコントロールを備えた全レベル向けパフォーマンスミッドとして説明し、スネ程度からダブルオーバーヘッドまでの汎用性を示しています。',
    },
    cautions: ['7ft超のパフォーマンスミッドです。ショートボードの操作感をそのまま想定しないでください。'],
  },
  {
    id: 'slater-cymatic',
    brand: 'Slater Designs',
    model: 'Cymatic',
    status: 'research',
    category: 'performance',
    fins: ['tri', 'quad'],
    representativeSku: { length: "5'3", widthIn: 18.625, thicknessIn: 2.3125, volumeL: 25.4 },
    verifiedClaims: {
      highPerformance: true,
      speedFocus: true,
      speedContext: 'high-performance',
    },
    source: {
      tier: 'retailer',
      url: 'https://www.realwatersports.com/collections/slater-designs-cymatic',
      checkedAt: '2026-09-26',
      note: '現行販売店情報では25.4L、過去のKelly Slater関連資料では25.5L表記もあります。正規スペックを確定できるまでライブ診断から除外します。',
    },
    cautions: ['出典間でVolume表記が一致していないため、まだ診断の正本データとして使用しません。'],
  },
];

export const ACTIVE_BOARD_MODELS = BOARD_MODELS.filter((board) => board.status === 'active');
