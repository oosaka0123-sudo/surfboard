// Generates the five BOARD TYPES plan-view silhouettes.
//
//   node scripts/generate-board-svgs.mjs public/media/boards
//
// Design rules (see public/media/README.md):
// - Every SVG is transparent and has a TIGHT viewBox: the board outline plus a small
//   stroke margin, nothing else. There is no reserved empty space to crop or scale around.
// - Boards are drawn horizontally, tail on the left, nose on the right, 1 inch = 10 units,
//   so the SVG's own aspect ratio is the board's real length:width ratio.
// - Relative length between boards is restored in CSS (width = length / longest length),
//   never by padding the SVG.
// - Outlines are illustrative category shapes, NOT any manufacturer's model outline.

import fs from 'node:fs';
import path from 'node:path';

const U = 10; // units per inch
const PAD = 5; // stroke margin (units) so the outline is never clipped by the viewBox

// [distance from tail (in), half-width (in)] from tail centre to nose tip.
const BOARDS = {
  'small-wave': {
    lengthIn: 66,
    tail: 'squash',
    outline: [[0, 0], [0.5, 3.4], [1.8, 5.3], [4, 6.5], [12, 8.5], [21, 10.1], [30, 10.6], [40, 10.1], [49, 8.8], [55, 7.5], [60, 5.9], [63.2, 4.2], [65.2, 2.3], [65.9, 1.0], [66, 0]],
    fins: { kind: 'quad' },
  },
  hybrid: {
    lengthIn: 70,
    tail: 'round',
    outline: [[0, 0], [0.7, 2.0], [2.2, 3.7], [4.5, 4.9], [12, 7.1], [22, 8.9], [32, 9.6], [42, 9.3], [52, 8.0], [60, 5.8], [65, 3.5], [68.4, 1.5], [69.7, 0.6], [70, 0]],
    fins: { kind: 'thruster' },
  },
  'fish-twin': {
    lengthIn: 68,
    tail: 'swallow',
    // first point is the tail tip; the swallow notch apex is added by `notch`
    outline: [[0, 4.4], [0.7, 5.9], [2.8, 7.7], [7, 9.4], [15, 10.4], [26, 10.75], [37, 10.4], [47, 9.1], [55, 7.2], [60.5, 5.3], [64.2, 3.1], [66.6, 1.4], [67.7, 0.5], [68, 0]],
    notch: 7.6,
    fins: { kind: 'twin' },
  },
  midlength: {
    lengthIn: 84,
    tail: 'round',
    outline: [[0, 0], [0.9, 2.4], [2.8, 4.5], [5.5, 6.1], [14, 8.5], [26, 10.1], [38, 10.75], [50, 10.4], [61, 9.2], [70, 7.0], [76, 4.7], [80.6, 2.4], [83.1, 0.8], [84, 0]],
    fins: { kind: 'single-sides' },
  },
  'step-up': {
    lengthIn: 76,
    tail: 'pin',
    outline: [[0, 0], [0.8, 1.3], [2.6, 2.5], [5.5, 3.8], [14, 6.3], [26, 8.3], [36, 9.15], [45, 9.2], [54, 8.5], [62, 7.0], [68, 4.9], [72.2, 2.8], [75, 1.1], [76, 0]],
    fins: { kind: 'thruster' },
  },
};

const f = (n) => Number(n.toFixed(1));

/** Piecewise-linear half-width lookup (used to seat fins inside the outline). */
function halfWidth(points, x) {
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    if (x >= x0 && x <= x1) return x1 === x0 ? y1 : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return points.at(-1)[1];
}

/** Catmull-Rom through points -> cubic Bezier segments ("C ..." strings). */
function smooth(pts) {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

function build(spec) {
  const { lengthIn, outline, notch } = spec;
  const W = lengthIn * U + PAD * 2;
  const maxHw = Math.max(...outline.map((p) => p[1]));
  const H = Math.round(maxHw * 2 * U + PAD * 2);
  const cy = H / 2;

  // outline (inches) -> svg units for the top and bottom edges
  const top = (scale = 1) => outline.map(([x, hw]) => [PAD + x * U, cy - hw * scale * U]);
  const bottom = (scale = 1) => outline.map(([x, hw]) => [PAD + x * U, cy + hw * scale * U]).reverse();

  const closed = (scale) => {
    const t = top(scale);
    const b = bottom(scale);
    const tailCentre = [PAD + (notch ?? 0) * U, cy];
    // swallow: start at notch apex, straight edge out to the tail tip; others start on the centreline
    let d = `M${f(tailCentre[0])} ${f(tailCentre[1])}`;
    if (notch) d += ` L${f(t[0][0])} ${f(t[0][1])}`;
    else d = `M${f(t[0][0])} ${f(t[0][1])}`;
    d += smooth(t);
    d += smooth([t.at(-1), ...b.slice(1)]);
    if (notch) d += ` L${f(tailCentre[0])} ${f(tailCentre[1])}`;
    return `${d} Z`;
  };

  // fins -------------------------------------------------------------
  // A fin is drawn as its side profile laid on the deck at its real position:
  // base on a line parallel to the stringer, tip swept toward the tail and out toward the rail.
  const fin = (backIn, baseIn, yIn, dir, depthIn, sweepIn) => {
    const xb = PAD + backIn * U;
    const xf = PAD + (backIn + baseIn) * U;
    const y0 = cy + yIn * U;
    const d = dir * depthIn * U;
    const tipX = xb - sweepIn * U;
    return `M${f(xf)} ${f(y0)} Q${f(xf - baseIn * U * 0.2)} ${f(y0 + d * 0.75)} ${f(tipX)} ${f(y0 + d)} Q${f(xb + baseIn * U * 0.3)} ${f(y0 + d * 0.3)} ${f(xb)} ${f(y0)} Z`;
  };
  const sideAt = (backIn, baseIn, inset, depth, sweep) => {
    const hw = halfWidth(outline, backIn + baseIn / 2);
    const y = Math.max(hw - inset, 1.2);
    return [fin(backIn, baseIn, -y, -1, depth, sweep), fin(backIn, baseIn, y, 1, depth, sweep)];
  };
  const finPaths = [];
  const kind = spec.fins.kind;
  if (kind === 'thruster') {
    finPaths.push(...sideAt(8.5, 4.6, 2.9, 1.9, 1.0));
    finPaths.push(fin(4.2, 5.2, 0, 1, 2.6, 1.4));
  } else if (kind === 'quad') {
    finPaths.push(...sideAt(9, 4.6, 2.9, 1.9, 1.0));
    finPaths.push(...sideAt(3.8, 4.0, 2.4, 1.6, 0.9));
  } else if (kind === 'twin') {
    finPaths.push(...sideAt(8, 5.4, 3.3, 2.6, 1.3));
  } else if (kind === 'single-sides') {
    finPaths.push(fin(5.5, 7.6, 0, 1, 3.6, 2.2));
    finPaths.push(...sideAt(13.5, 4.4, 2.6, 1.7, 0.9));
  }

  const stringerFrom = (notch ?? 0) + 3;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none">
  <path d="${closed(1)}" fill="#fbf8f1" stroke="#16323c" stroke-width="1.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
  <path d="${closed(0.9)}" stroke="#16323c" stroke-opacity=".22" stroke-width="1" vector-effect="non-scaling-stroke"/>
  <path d="M${f(PAD + stringerFrom * U)} ${f(cy)} H${f(PAD + (lengthIn - 3) * U)}" stroke="#a9794a" stroke-opacity=".55" stroke-width="1.4" vector-effect="non-scaling-stroke"/>
${finPaths.map((p) => `  <path d="${p}" fill="#2f6f68" fill-opacity=".78" stroke="#16323c" stroke-width="1" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`).join('\n')}
</svg>
`;
  return { svg, W, H };
}

const outDir = process.argv[2] ?? 'public/media/boards';
fs.mkdirSync(outDir, { recursive: true });
const manifest = {};
for (const [slug, spec] of Object.entries(BOARDS)) {
  const { svg, W, H } = build(spec);
  fs.writeFileSync(path.join(outDir, `${slug}.svg`), svg);
  manifest[slug] = { width: W, height: H, lengthIn: spec.lengthIn };
}
console.log(JSON.stringify(manifest, null, 2));
