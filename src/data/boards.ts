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
  category: 'groveler' | 'hybrid' | 'twin' | 'performance';
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
    cautions: ['Advanced surfers are described by CI as riding it 2–4 inches shorter than their height.'],
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
      note: "Representative 5'8 dimensions are from a Haydenshapes HSSTUDiO product record.",
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
    cautions: ['CI states the rails are low and many riders choose about 1/8 inch more thickness than their shortboard.'],
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
      note: 'Current retailer spec lists 25.4L; historical Kelly Slater material has also been published as 25.5L. Excluded from live matching until canonical spec is resolved.',
    },
    cautions: ['Volume conflict exists across sources; do not use as canonical matcher data yet.'],
  },
];

export const ACTIVE_BOARD_MODELS = BOARD_MODELS.filter((board) => board.status === 'active');
