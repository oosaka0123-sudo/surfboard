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
      note: 'Firewire describes the Dominator 2.0 as a performance-accessible design with a wider range of conditions.',
    },
    cautions: ['Final sizing must be chosen from the full SKU table; the displayed size is representative only.'],
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
      note: 'Firewire describes it as an everyday hybrid for 1–5 ft surf with extra volume and paddle area up front.',
    },
    cautions: ['Final sizing must be chosen from the full SKU table; the displayed size is representative only.'],
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
      note: 'Firewire positions the Seaside for small and weak waves, 1–5 ft, with plenty of paddle power.',
    },
    cautions: ['Fish/quad characteristics should be treated as a different feel from a conventional thruster.'],
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
      note: 'Firewire recommends it in 1–5 ft surf and describes it as versatile from micro days to more solid surf.',
    },
    cautions: ['This is a midlength fish shape; it should not be interpreted as a longboard recommendation.'],
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
      note: 'CI positions it between a high-performance shortboard and a groveler for everyday surfing.',
    },
    cautions: ['Performance-oriented option; early-stage surfers should not be pushed toward it by goal preference alone.'],
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
      note: 'JS describes it as a 2+1 all-round twin for roughly 2–5 ft surf, with a low rocker and extra paddle power.',
    },
    cautions: ['JS recommends riding it about 2 inches longer than the original Black Baron and around 1/8 inch thicker.'],
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
