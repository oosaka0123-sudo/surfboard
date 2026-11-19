// Presentation data for the BOARD TYPES illustrations (not verified board data).
// Dimensions are illustrative category proportions, not any manufacturer's model.
// width/height must match the generated SVG viewBox (scripts/generate-board-svgs.mjs).

export interface BoardType {
  slug: 'small-wave' | 'hybrid' | 'fish-twin' | 'midlength' | 'step-up';
  title: string;
  text: string;
  trait: string;
  href: string;
  image: string;
  width: number;
  height: number;
  lengthIn: number;
  size: string;
}

export const BOARD_TYPES: BoardType[] = [
  { slug: 'small-wave', title: 'SMALL WAVE', text: '小波で速く、楽に。', trait: '短め・幅広・フルノーズ', href: '/shortboard/', image: '/media/boards/small-wave.svg', width: 670, height: 222, lengthIn: 66, size: `5'6" 前後` },
  { slug: 'hybrid', title: 'HYBRID', text: '波数と動きのちょうど真ん中。', trait: '標準的なショートボード形状', href: '/shortboard/', image: '/media/boards/hybrid.svg', width: 710, height: 202, lengthIn: 70, size: `5'10" 前後` },
  { slug: 'fish-twin', title: 'FISH / TWIN', text: '速さと抜け感を楽しむ。', trait: '幅広・スワローテール・ツイン', href: '/retro-fish/', image: '/media/boards/fish-twin.svg', width: 690, height: 225, lengthIn: 68, size: `5'8" 前後` },
  { slug: 'midlength', title: 'MIDLENGTH', text: '余裕を残して、まだ動ける。', trait: '長め・なめらかなアウトライン', href: '/midlength/', image: '/media/boards/midlength.svg', width: 850, height: 225, lengthIn: 84, size: `7'0" 前後` },
  { slug: 'step-up', title: 'STEP-UP', text: 'サイズが上がった日の安心感。', trait: '長め・細め・シャープなノーズ', href: '/boards/', image: '/media/boards/step-up.svg', width: 770, height: 194, lengthIn: 76, size: `6'4" 前後` },
];

export const LONGEST_BOARD_IN = Math.max(...BOARD_TYPES.map((b) => b.lengthIn));

/** Illustration to use for a verified-board category / diagnosis family. */
export const BOARD_TYPE_BY_CATEGORY: Record<string, BoardType['slug']> = {
  groveler: 'small-wave',
  hybrid: 'hybrid',
  performance: 'hybrid',
  fish: 'fish-twin',
  twin: 'fish-twin',
  midlength: 'midlength',
};

export const boardTypeBySlug = (slug: BoardType['slug']) => BOARD_TYPES.find((b) => b.slug === slug)!;
