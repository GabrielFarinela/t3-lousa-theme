// Builds lousa.json from theme.css, art.js and board.jpg. No dependencies: `node build.js`.
const fs = require('fs');
const path = require('path');
const { left, right } = require('./art');

const ROOT = __dirname;
const THEME_ID = 'lousa';
const THEME_NAME = 'Lousa';
const CSS_LIMIT = 100_000;

const BG = '#0d0f0e', SURF = '#161917', SURF2 = '#1b1f1c', TEXT = '#e5e2d8', TEXT2 = '#85877f';
const MUS = '#d9a52e', MUS_L = '#e4b444';

const COLORS = {
  canvas: BG, chrome: BG, toolbar: BG, toolbarForeground: TEXT, toolbarBorder: '#222a25',
  toolbarControl: '#00000000', toolbarControlForeground: '#b9b8ae', toolbarControlHover: '#d9a52e1a',
  sidebar: BG, sidebarForeground: TEXT, sidebarMutedForeground: TEXT2, sidebarBorder: '#1f2722', sidebarControlSurface: SURF,
  sidebarRowHover: '#d9a52e0f', sidebarRowActive: '#d9a52e1f', sidebarRowSelected: '#d9a52e1a',
  surface: SURF, surfaceRaised: SURF2, surfaceOverlay: SURF, text: TEXT, textMuted: TEXT2,
  border: '#262e29', input: '#2c352f', focus: MUS,
  accent: MUS, accentForeground: BG, accentSurface: '#2a2412', accentSurfaceForeground: MUS_L,
  secondary: SURF2, secondaryForeground: TEXT, muted: SURF, mutedForeground: TEXT2,
  placeholder: '#6b6e66', secondaryLabel: TEXT2, iconMuted: '#8f9188',
  error: '#e08a7a', warning: MUS, warningSurface: '#2a2412', update: MUS, updateForeground: MUS_L, updateSurface: '#2a2412',
  messageSurface: SURF, messageForeground: TEXT, messageAction: MUS, messageActionForeground: BG, messageActionHover: MUS_L,
  codeBackground: '#0c120f', codeForeground: '#d6d4ca',
  searchMatchBackground: '#5c4614', searchMatchForeground: '#ffffff', searchMatchActiveBackground: MUS, searchMatchActiveForeground: BG,
  terminalBackground: '#0c120f', terminalForeground: TEXT, terminalCursor: MUS, terminalSelection: '#3a3016',
  terminalScrollbar: '#262e29', terminalScrollbarHover: '#a8791966',
};

function minify(css) {
  const strings = [];
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  css = css.replace(/"[^"]*"/g, (m) => { strings.push(m); return `\x00${strings.length - 1}\x00`; });
  css = css.replace(/\s+/g, ' ');
  css = css.replace(/\s*([{};,>])\s*/g, '$1');
  css = css.replace(/;}/g, '}');
  css = css.replace(/\x00(\d+)\x00/g, (m, i) => strings[Number(i)]);
  return css.trim();
}

const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

function build() {
  const board = fs.readFileSync(path.join(ROOT, 'board.jpg')).toString('base64');
  let css = minify(fs.readFileSync(path.join(ROOT, 'theme.css'), 'utf8'));
  css = css
    .replace('__BOARD__', `url(data:image/jpeg;base64,${board})`)
    .replace('__LEFT__', svgUrl(left))
    .replace('__RIGHT__', svgUrl(right));
  if (/__[A-Z]+__/.test(css)) throw new Error('unreplaced placeholder in theme.css');
  if (css.length > CSS_LIMIT) {
    console.error(`theme css is ${css.length} characters; T3 accepts at most ${CSS_LIMIT}`);
    process.exit(1);
  }
  return { version: 1, name: THEME_NAME, appearance: 'dark', canvas: BG, accent: MUS, colors: COLORS, css };
}

const theme = build();
const out = path.join(ROOT, `${THEME_ID}.json`);
fs.writeFileSync(out, JSON.stringify(theme, null, 2) + '\n');
console.log(`${path.basename(out)}: ${theme.css.length} css characters`);
