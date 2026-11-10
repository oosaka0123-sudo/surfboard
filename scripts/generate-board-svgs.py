"""Generate the five BOARD TYPES silhouettes on ONE shared scale.

All files share the same viewBox, so when each <img> is shown with
height:100% + object-fit:contain, the relative LENGTH of each board is
preserved (midlength / step-up look longer than small wave).
Widths are exaggerated by the same factor for every board so outlines
read clearly at phone size without becoming needle-thin.
"""
import sys
from pathlib import Path

PX_PER_IN = 7.0          # length scale (shared)
WIDTH_EXAG = 1.3        # same visual exaggeration for every board
VB_W, VB_H = 220, 640
CX = VB_W / 2


def pchip(xs, ys, x):
    """Monotone cubic interpolation (Fritsch-Carlson)."""
    n = len(xs)
    h = [xs[i + 1] - xs[i] for i in range(n - 1)]
    d = [(ys[i + 1] - ys[i]) / h[i] for i in range(n - 1)]
    m = [0.0] * n
    m[0], m[-1] = d[0], d[-1]
    for i in range(1, n - 1):
        if d[i - 1] * d[i] <= 0:
            m[i] = 0.0
        else:
            w1, w2 = 2 * h[i] + h[i - 1], h[i] + 2 * h[i - 1]
            m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i])
    for i in range(n - 1):
        if xs[i] <= x <= xs[i + 1]:
            t = (x - xs[i]) / h[i]
            h00 = 2 * t**3 - 3 * t**2 + 1
            h10 = t**3 - 2 * t**2 + t
            h01 = -2 * t**3 + 3 * t**2
            h11 = t**3 - t**2
            return h00 * ys[i] + h10 * h[i] * m[i] + h01 * ys[i + 1] + h11 * h[i] * m[i + 1]
    return ys[-1]


# key points: (inches from nose, full width in inches)
BOARDS = {
    # 5'2 groveler: short, wide, wide round nose, wide squash tail
    'small-wave': dict(length=62, pts=[(0, 0), (0.6, 7.5), (3, 13.2), (12, 18.6), (31, 21.2), (50, 18.2), (59, 13.6), (62, 11.0)],
                       tail='squash', fins='thruster'),
    # 5'10 hybrid: between performance and groveler
    'hybrid': dict(length=70, pts=[(0, 0), (0.6, 5.5), (3, 10.6), (12, 15.8), (34, 19.6), (58, 15.6), (67, 10.2), (70, 7.4)],
                   tail='squash', fins='thruster'),
    # 5'6 fish: very wide, full nose, deep swallow tail, twin keels
    'fish-twin': dict(length=66, pts=[(0, 0), (0.6, 8.0), (3, 14.0), (12, 19.4), (30, 22.0), (52, 19.6), (62, 15.6), (66, 14.6)],
                      tail='swallow', fins='twin'),
    # 7'2 midlength: long, natural width, rounded-but-not-sharp nose, round pin
    'midlength': dict(length=86, pts=[(0, 0), (0.8, 6.0), (4, 11.6), (12, 16.6), (40, 20.8), (72, 15.4), (82, 9.4), (86, 4.8)],
                      tail='round', fins='single'),
    # 6'6 step-up: long-ish, narrow, pointed nose, narrow pin tail
    'step-up': dict(length=78, pts=[(0, 0), (1.5, 2.6), (5, 7.0), (12, 11.8), (36, 18.4), (64, 13.0), (74, 6.4), (78, 2.0)],
                    tail='pin', fins='thruster'),
}


def half_width_px(pts, y_in):
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return pchip(xs, ys, y_in) / 2 * PX_PER_IN * WIDTH_EXAG


def build(slug, spec):
    L = spec['length']
    top = (VB_H - L * PX_PER_IN) / 2
    def Y(y_in):
        return top + y_in * PX_PER_IN

    # sample nose more densely (sqrt spacing) for a smooth tip
    n = 90
    samples = [L * (i / n) ** 1.6 for i in range(n + 1)]
    right = [(CX + half_width_px(spec['pts'], y), Y(y)) for y in samples]
    tail_y = Y(L)
    tail_half = right[-1][0] - CX

    d = [f"M{CX:.1f} {Y(0):.1f}"]
    d += [f"L{x:.1f} {y:.1f}" for x, y in right[1:]]
    tail = spec['tail']
    if tail == 'swallow':
        notch = 6.5 * PX_PER_IN
        d.append(f"Q{CX + tail_half * 0.55:.1f} {tail_y - notch * 0.35:.1f} {CX:.1f} {tail_y - notch:.1f}")
        d.append(f"Q{CX - tail_half * 0.55:.1f} {tail_y - notch * 0.35:.1f} {CX - tail_half:.1f} {tail_y:.1f}")
    elif tail == 'squash':
        r = tail_half * 0.35
        d.append(f"Q{CX + tail_half:.1f} {tail_y + 3:.1f} {CX + tail_half - r:.1f} {tail_y + 3:.1f}")
        d.append(f"L{CX - tail_half + r:.1f} {tail_y + 3:.1f}")
        d.append(f"Q{CX - tail_half:.1f} {tail_y + 3:.1f} {CX - tail_half:.1f} {tail_y:.1f}")
    else:  # round / pin
        bulge = 6 if tail == 'round' else 4
        d.append(f"C{CX + tail_half:.1f} {tail_y + bulge:.1f} {CX - tail_half:.1f} {tail_y + bulge:.1f} {CX - tail_half:.1f} {tail_y:.1f}")
    d += [f"L{2 * CX - x:.1f} {y:.1f}" for x, y in reversed(right[1:-1])]
    d.append('Z')
    outline = ' '.join(d)

    def fin(cx, base_y, length, w, lean=0.0):
        # simple rounded fin shape pointing toward the tail
        return (f'<path d="M{cx - w / 2:.1f} {base_y:.1f} Q{cx + lean:.1f} {base_y + length * 1.15:.1f} '
                f'{cx + w / 2:.1f} {base_y + length * 0.15:.1f} Z" class="f"/>')

    fins = []
    if spec['fins'] == 'thruster':
        side_y = Y(L - 12)
        off = half_width_px(spec['pts'], L - 12) - 13
        fins += [fin(CX - off, side_y, 40, 14, -4), fin(CX + off, side_y, 40, 14, 4), fin(CX, Y(L - 5.6), 34, 12)]
    elif spec['fins'] == 'twin':
        side_y = Y(L - 17)
        off = half_width_px(spec['pts'], L - 15) - 18
        fins += [fin(CX - off, side_y, 64, 30, -5), fin(CX + off, side_y, 64, 30, 5)]
    elif spec['fins'] == 'single':
        fins += [fin(CX, Y(L - 15), 72, 22)]

    stringer = f'<path d="M{CX:.1f} {Y(1.5):.1f}V{tail_y - (6.5 * PX_PER_IN if tail == "swallow" else 2):.1f}" class="s"/>'

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VB_W} {VB_H}" role="img" aria-hidden="true">'
        '<defs><linearGradient id="g" x1="0" x2="1">'
        '<stop stop-color="#d9d2c5"/><stop offset=".22" stop-color="#f6f1e7"/>'
        '<stop offset=".5" stop-color="#fffdf8"/><stop offset=".8" stop-color="#efe8db"/>'
        '<stop offset="1" stop-color="#cbc2b4"/></linearGradient>'
        '<style>.f{fill:#6f6a63;stroke:#3f3b36;stroke-width:1.5;stroke-linejoin:round}'
        '.s{stroke:#b38458;stroke-width:2;opacity:.6;fill:none}</style></defs>'
        f'<path d="{outline}" fill="url(#g)" stroke="#8a8174" stroke-width="2.5" stroke-linejoin="round"/>'
        f'{stringer}{"".join(fins)}</svg>\n'
    )
    return svg


if __name__ == '__main__':
    out = Path(sys.argv[1])
    for slug, spec in BOARDS.items():
        (out / f'board-{slug}-final.svg').write_text(build(slug, spec))
        print(slug, 'len', spec['length'], 'max half px', round(max(half_width_px(spec['pts'], y / 2) for y in range(spec['length'] * 2)), 1))
