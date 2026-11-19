// Chalk drawings for the Lousa theme, as inline SVG.
// Each export is a standalone <svg> string. build.js inlines them into theme.css.

// Chalk colors: off-white and mustard.
const CHALK = '#d9d8cd';
const MUS = '#d9a52e';

// ---- svg helpers ----
const FONT = "Segoe Print,Ink Free,Comic Sans MS,cursive";
const svg = (w, h, body) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' width='${w}' height='${h}'>` +
  // chalk: low-freq wobble (hand-drawn) -> high-freq grain mask (broken stroke) -> faint dusty halo
  `<defs><filter id='c' x='-5%' y='-5%' width='110%' height='110%' color-interpolation-filters='sRGB'>` +
  `<feTurbulence type='fractalNoise' baseFrequency='0.045' numOctaves='2' seed='3' result='w'/>` +
  `<feDisplacementMap in='SourceGraphic' in2='w' scale='3.2' xChannelSelector='R' yChannelSelector='G' result='wob'/>` +
  `<feTurbulence type='fractalNoise' baseFrequency='1.35' numOctaves='2' seed='9' result='n'/>` +
  `<feDisplacementMap in='wob' in2='n' scale='1.8' result='rough'/>` +
  `<feColorMatrix in='n' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2.6 0 0 0 -0.75' result='holes'/>` +
  `<feComposite in='rough' in2='holes' operator='in' result='chalk'/>` +
  `<feGaussianBlur in='rough' stdDeviation='1.6' result='blur'/>` +
  `<feComponentTransfer in='blur' result='dust'><feFuncA type='linear' slope='0.22'/></feComponentTransfer>` +
  `<feMerge><feMergeNode in='dust'/><feMergeNode in='chalk'/></feMerge></filter>` +
  `<marker id='a' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto'><path d='M1 1L9 5L1 9' fill='none' stroke='${CHALK}' stroke-width='1.6' stroke-linecap='round'/></marker></defs>` +
  `<g filter='url(#c)' fill='none' stroke='${CHALK}' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round' font-family='${FONT}'>${body}</g></svg>`;
// every chalk annotation gets a small deterministic tilt so nothing looks typeset
const tilt = (x, y) => (((x * 37 + y * 91) % 13) / 13 * 5 - 2.5).toFixed(1);
const T = (x, y, s, size = 16, col = CHALK, extra = '') => `<text x='${x}' y='${y}' font-size='${size}' fill='${col}' stroke='none' xml:space='preserve' transform='rotate(${tilt(x, y)} ${x} ${y})' ${extra}>${s}</text>`;
const L = (x1, y1, x2, y2, col = CHALK, extra = '') => `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='${col}' ${extra}/>`;
const C = (cx, cy, r, col = CHALK) => `<circle cx='${cx}' cy='${cy}' r='${r}' stroke='${col}'/>`;
const sup = s => `<tspan font-size='70%' dy='-0.55em'>${s}</tspan><tspan dy='0.38em'>​</tspan>`;
const sub = s => `<tspan font-size='70%' dy='0.3em'>${s}</tspan><tspan dy='-0.21em'>​</tspan>`;

// ---- left gutter: few formulas + a couple of loose sketches, staggered ----
const G = (deg, cx, cy, inner) => `<g transform='rotate(${deg} ${cx} ${cy})'>${inner}</g>`;
const left = (() => {
  let b = '';
  b += T(18, 70, `iℏ ∂ψ/∂t = Ĥψ`, 22);
  b += `<path d='M20 86 Q100 81 186 85' stroke='${MUS}' stroke-width='1.8'/>`;
  // small trig circle, pushed right and tilted
  { const cx = 196, cy = 230, r = 40, a = 38 * Math.PI / 180, px = (cx + r * Math.cos(a)).toFixed(1), py = (cy - r * Math.sin(a)).toFixed(1);
    let g = C(cx, cy, r) + L(cx - 54, cy, cx + 56, cy, CHALK, "marker-end='url(#a)' stroke-opacity='.7'") + L(cx, cy + 50, cx, cy - 56, CHALK, "marker-end='url(#a)' stroke-opacity='.7'");
    g += L(cx, cy, px, py, MUS, "stroke-width='1.8'") + `<path d='M${cx + 15} ${cy} A15 15 0 0 0 ${(cx + 15 * Math.cos(a)).toFixed(1)} ${(cy - 15 * Math.sin(a)).toFixed(1)}' stroke='${MUS}'/>` + T(cx + 19, cy - 5, 'θ', 12, MUS);
    b += G(-6, cx, cy, g); }
  b += T(44, 420, `R${sub('μν')} − ½R g${sub('μν')} = 8πG T${sub('μν')}`, 16);
  b += T(70, 452, `(Einstein, 1915)`, 12, CHALK, "fill-opacity='.7'");
  // vectors / force diagram, left side
  { let g = `<path d='M30 610 L150 610 L150 548 Z' stroke-opacity='.85'/>` + `<rect x='86' y='556' width='26' height='18' transform='rotate(-27 99 565)'/>`;
    g += L(99, 565, 99, 610, MUS, "marker-end='url(#a)' stroke-width='1.5'") + T(104, 604, 'mg', 11, MUS);
    g += L(99, 565, 76, 520, CHALK, "marker-end='url(#a)' stroke-width='1.3'") + T(60, 518, 'N', 12);
    b += G(4, 90, 580, g); }
  // bell curve + gaussian integral, slightly right
  let d = 'M100 770'; for (let i = 1; i <= 50; i++) { const x = 100 + i * 3, u = (i - 25) / 9; d += ` L${x} ${(770 - 40 * Math.exp(-u * u)).toFixed(1)}`; }
  b += `<path d='${d}' stroke-width='1.4' stroke-opacity='.85'/>`;
  b += T(84, 812, `∫ e${sup('−x²')} dx = √π`, 18, MUS);
  return svg(280, 880, b);
})();

// ---- right gutter: small notes + two light sketches, staggered ----
const right = (() => {
  let b = '';
  b += T(110, 66, 'O(n log n)', 18);
  b += `<path d='M112 76 Q170 72 220 75' stroke='${MUS}' stroke-width='1.6'/>`;
  // AND gate, left-ish and tilted
  { let g = T(14, 168, 'A', 13) + T(14, 196, 'B', 13) + L(28, 164, 62, 164) + L(28, 192, 62, 192);
    g += `<path d='M62 150 H88 A28 28 0 0 1 88 206 H62 Z'/>` + L(116, 178, 146, 178) + T(152, 183, 'A ∧ B', 13);
    b += G(-5, 80, 178, g); }
  b += T(150, 330, 'λx. x + 1', 16);
  b += T(158, 356, 'map(f, xs)', 13, CHALK, "fill-opacity='.8'");
  // small binary tree, centered-left
  { const N = [[92, 470, 8], [56, 520, 3], [128, 520, 10], [36, 570, 1], [76, 570, 6]]; let g = '';
    [[0, 1], [0, 2], [1, 3], [1, 4]].forEach(([p, c]) => { const [x1, y1] = N[p], [x2, y2] = N[c], dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy);
      g += L((x1 + dx / l * 12).toFixed(1), (y1 + dy / l * 12).toFixed(1), (x2 - dx / l * 12).toFixed(1), (y2 - dy / l * 12).toFixed(1)); });
    N.forEach(([x, y, v], i) => { g += C(x, y, 12, i === 0 ? MUS : CHALK) + T(x - (v > 9 ? 7 : 4), y + 4, v, 11, i === 0 ? MUS : CHALK); });
    b += G(3, 82, 520, g); }
  b += T(130, 660, '0x2A = 0010 1010', 14);
  b += T(60, 790, 'P = NP', 16) + T(124, 790, '?', 18, MUS);
  return svg(280, 880, b);
})();

module.exports = { left, right };
