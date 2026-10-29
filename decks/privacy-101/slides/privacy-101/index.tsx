// Privacy 101 — From 0 to 1. Hands-on workshop, Bitmela (Jaipur), 30–31 Oct 2026. Cake Wallet × Opt Out.
// Visual system: "Sprinkle Network" — Cake Wallet media kit v1.2 (Icing / Fondant / Cake blue, Wix Madefor Text;
// IBM Plex Mono, the Cake app's mono, for labels and UI paths) with Opt Out's shatter-into-network motif redrawn in Cake sprinkles.
// Teaching slides sit on Icing; every "do it now" slide flips to a full Cake-blue field.
// Content follows sethforprivacy.com/posts/privacy-first-steps; sources for every claim live in `notes`.
import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { Step, Steps, useSlidePageNumber } from '@open-slide/core';

import cakeLogo from './assets/brand/cake-horizontal-fondant.svg';
import cakeLogoMono from './assets/brand/cake-horizontal-mono-fondant.svg';
import cakeMark from './assets/brand/cake-mark-fondant.svg';
import sethPhoto from './assets/people/seth.png';
import qrFirstSteps from './assets/qr/first-steps.svg';
import qrProton from './assets/qr/proton.svg';
import qrPass from './assets/qr/pass.svg';
import qrBitwarden from './assets/qr/bitwarden.svg';
import qrRadar from './assets/qr/radar.svg';
import qrOptOut from './assets/qr/optout.svg';
import qrSignalGroup from './assets/qr/signal-group.svg';
import groupLogo from './assets/signal/signal-group-logo-512.png';
import qrCake from './assets/qr/cake.svg';

/* ───────────────────────── Fonts (Wix Madefor Text + IBM Plex Mono, as in the Cake Wallet app) ───────────────────────── */

const WIX_URL = new URL('./assets/fonts/WixMadeforText.ttf', import.meta.url).href;
const WIX_ITALIC_URL = new URL('./assets/fonts/WixMadeforText-Italic.ttf', import.meta.url).href;
const PLEX_URL = new URL('./assets/fonts/IBMPlexMono-Regular.ttf', import.meta.url).href;
const PLEX_MEDIUM_URL = new URL('./assets/fonts/IBMPlexMono-Medium.ttf', import.meta.url).href;
const FONT_STYLE_ID = 'osd-webfont-privacy-101';
const FONT_CSS = `@font-face{font-family:'Wix Madefor Text';src:url('${WIX_URL}') format('truetype');font-weight:400 800;font-style:normal;font-display:block;}
@font-face{font-family:'Wix Madefor Text';src:url('${WIX_ITALIC_URL}') format('truetype');font-weight:400 800;font-style:italic;font-display:block;}
@font-face{font-family:'IBM Plex Mono';src:url('${PLEX_URL}') format('truetype');font-weight:400;font-style:normal;font-display:block;}
@font-face{font-family:'IBM Plex Mono';src:url('${PLEX_MEDIUM_URL}') format('truetype');font-weight:500;font-style:normal;font-display:block;}`;
if (typeof document !== 'undefined') {
  let style = document.getElementById(FONT_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = FONT_STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== FONT_CSS) style.textContent = FONT_CSS;
}

/* ───────────────────────── Design tokens ───────────────────────── */

export const design: DesignSystem = {
  palette: { bg: '#EFEFF8', text: '#312938', accent: '#61C5FF' },
  fonts: {
    display: "'Wix Madefor Text', system-ui, -apple-system, sans-serif",
    body: "'Wix Madefor Text', system-ui, -apple-system, sans-serif",
  },
  typeScale: { hero: 180, body: 36 },
  radius: 24,
};

// Media kit v1.2 palette. Cake blue is a fill, never text on Icing (1.68:1).
const FONDANT = '#312938';
const ICING = '#EFEFF8';
const BLUE = '#61C5FF';
const YELLOW = '#FFC414';
const ORANGE = '#FF630F';
const LAVENDER = '#CBCBE5';
const WHITE = '#FFFFFF';
const MUTED = '#67606E'; // 5.3:1 on Icing
const ORANGE_TEXT = '#B8470C'; // orange that reads as text on Icing
const RED_TEXT = '#C93235'; // Opt Out red, darkened for text on light
const RULE = 'rgba(49, 41, 56, 0.16)';
const EDGE = 'rgba(49, 41, 56, 0.30)';
const MONO = "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace";

const PAD_X = 120;

const root: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
};
const GRADIENT_BG = `linear-gradient(180deg, ${ICING} 0%, ${ICING} 45%, ${LAVENDER} 100%)`;

const HEAD: CSSProperties = {
  fontFamily: 'var(--osd-font-display)',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 1.08,
  margin: 0,
};

// House transition — DISSOLVE (same as Seth's other Cake decks): outgoing holds, incoming fades in.
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
export const transition: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: { duration: 240, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
};

/* ───────────────────────── Type helpers ───────────────────────── */

// The one flavor word per title: Wix Madefor Text italic on a marker stroke (blue on Icing, yellow on blue).
const Em = ({ children, on = 'icing', size = '1em' }: { children: ReactNode; on?: 'icing' | 'blue'; size?: string }) => (
  <span
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontStyle: 'italic',
      fontWeight: 'inherit',
      fontSize: size,
      letterSpacing: '-0.02em',
      padding: '0 0.08em',
      background: `linear-gradient(transparent 60%, ${on === 'blue' ? YELLOW : BLUE} 60%, ${on === 'blue' ? YELLOW : BLUE} 92%, transparent 92%)`,
    }}
  >
    {children}
  </span>
);

const Eyebrow = ({ children, color = MUTED, top = 96 }: { children: ReactNode; color?: string; top?: number }) => (
  <div
    style={{
      position: 'absolute',
      left: PAD_X,
      top,
      fontFamily: MONO,
      fontSize: 26,
      fontWeight: 500,
      color,
      letterSpacing: '0.01em',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}
  >
    {children}
  </div>
);

const Title = ({ children, top = 150, size = 80, width = 1680 }: { children: ReactNode; top?: number; size?: number; width?: number }) => (
  <h1 style={{ ...HEAD, position: 'absolute', left: PAD_X, top, width, fontSize: size }}>{children}</h1>
);

/* ───────────────────────── Brand shapes ───────────────────────── */

// Sprinkles from the media kit (sprinkle-01…04), with their native viewBoxes.
const SPRINKLES = {
  a: { vw: 380, vh: 427, d: 'M316.69 13.4541C311.517 2.14234 298.174 -2.86126 286.838 2.25959L13.6877 125.655C2.27771 130.81 -2.76591 144.259 2.44129 155.645L65.9059 294.416C67.0682 296.958 68.692 299.262 70.6948 301.211C111.388 340.817 152.096 380.409 192.793 420.011C203.265 430.202 220.511 427.924 227.977 415.364L375.95 166.438C379.739 160.064 380.16 152.237 377.076 145.494L316.69 13.4541Z' },
  b: { vw: 446, vh: 359, d: 'M277.925 0C277.927 0 277.927 0.00277864 277.925 0.00320605L17.7148 58.9152C4.90804 61.8147 -2.73864 74.9823 1.0904 87.5425C17.1852 140.337 33.2799 193.132 49.3747 245.927C50.98 251.192 54.4523 255.691 59.1397 258.578L215.811 355.063C225.144 360.811 237.257 359.031 244.542 350.842L440.091 131.032C449.433 120.532 447.025 104.143 435.058 96.7733L277.924 0.00300767C277.923 0.00214964 277.923 0 277.925 0V0Z' },
  c: { vw: 368, vh: 437, d: 'M273.433 123.086C273.433 123.088 273.43 123.09 273.428 123.088L119.227 4.86356C106.698 -4.74243 88.4307 1.13446 83.8532 16.244L1.53495 287.959C-1.19342 296.965 1.945 306.719 9.41312 312.444L165.617 432.187C172.624 437.558 182.116 438.357 189.922 434.232C245.228 405.005 300.534 375.779 355.841 346.553C366.549 340.894 370.892 327.798 365.686 316.862L273.439 123.084C273.437 123.081 273.433 123.082 273.433 123.086V123.086Z' },
  d: { vw: 406, vh: 348, d: 'M178.353 47.994C178.343 47.994 178.334 47.9965 178.326 48.0013L11.2129 149.235C-0.523711 156.344 -3.2658 172.189 5.39892 182.829C47.7301 234.813 90.0628 286.795 132.408 338.765C139.526 347.501 151.993 349.656 161.631 343.817L327.074 243.596C331.649 240.825 335.093 236.519 336.792 231.447L404.125 30.4347C409.747 13.6533 394.768 -2.78355 377.538 1.25923L178.364 47.9926C178.361 47.9935 178.357 47.994 178.353 47.994V47.994Z' },
};

// One sprinkle as an SVG node, centered on (x, y), `size` px wide.
const Shard = ({ k, x, y, size, rot, color }: { k: keyof typeof SPRINKLES; x: number; y: number; size: number; rot: number; color: string }) => {
  const s = SPRINKLES[k];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${size / s.vw}) translate(${-s.vw / 2} ${-s.vh / 2})`}>
      <path d={s.d} fill={color} />
    </g>
  );
};
const Dot = ({ x, y, r, color = FONDANT }: { x: number; y: number; r: number; color?: string }) => <circle cx={x} cy={y} r={r} fill={color} />;
const Edge = ({ x1, y1, x2, y2, color = EDGE }: { x1: number; y1: number; x2: number; y2: number; color?: string }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={3} strokeLinecap="round" />
);

// Opt Out's "monolith shatters into a network", drawn with Cake sprinkles. 960×1080 art box.
const ShatterNet = ({ style, edge = EDGE, scale = 1 }: { style?: CSSProperties; edge?: string; scale?: number }) => (
  <svg viewBox="0 0 960 1080" width={960 * scale} height={1080 * scale} style={{ position: 'absolute', ...style }} aria-hidden>
    <Edge x1={330} y1={470} x2={520} y2={400} color={edge} />
    <Edge x1={520} y1={400} x2={620} y2={210} color={edge} />
    <Edge x1={520} y1={400} x2={690} y2={330} color={edge} />
    <Edge x1={330} y1={470} x2={600} y2={520} color={edge} />
    <Edge x1={600} y1={520} x2={690} y2={330} color={edge} />
    <Edge x1={600} y1={520} x2={760} y2={570} color={edge} />
    <Edge x1={470} y1={630} x2={760} y2={570} color={edge} />
    <Edge x1={470} y1={630} x2={360} y2={730} color={edge} />
    <Edge x1={690} y1={330} x2={850} y2={420} color={edge} />
    <Edge x1={760} y1={570} x2={850} y2={420} color={edge} />
    <Edge x1={760} y1={570} x2={880} y2={710} color={edge} />
    <Edge x1={700} y1={790} x2={880} y2={710} color={edge} />
    <Edge x1={360} y1={730} x2={700} y2={790} color={edge} />
    <Edge x1={850} y1={420} x2={880} y2={710} color={edge} />
    <Edge x1={180} y1={620} x2={470} y2={630} color={edge} />
    <Edge x1={620} y1={210} x2={850} y2={420} color={edge} />
    <Shard k="b" x={180} y={620} size={250} rot={-12} color={FONDANT} />
    <Shard k="a" x={330} y={470} size={160} rot={20} color={ORANGE} />
    <Shard k="c" x={250} y={300} size={110} rot={-30} color={BLUE} />
    <Shard k="d" x={360} y={730} size={130} rot={15} color={YELLOW} />
    <Shard k="c" x={470} y={630} size={86} rot={40} color={BLUE} />
    <Shard k="b" x={520} y={400} size={76} rot={60} color={FONDANT} />
    <Shard k="d" x={600} y={520} size={60} rot={-20} color={YELLOW} />
    <Shard k="a" x={240} y={860} size={70} rot={-50} color={ORANGE} />
    <Dot x={690} y={330} r={15} />
    <Dot x={760} y={570} r={13} />
    <Dot x={850} y={420} r={24} />
    <Dot x={700} y={790} r={11} />
    <Dot x={880} y={710} r={18} />
    <Dot x={620} y={210} r={10} />
  </svg>
);

// Meringue numeral badge used on action cards and agenda rows.
const Badge = ({ n, bg = FONDANT, fg = ICING, size = 60 }: { n: ReactNode; bg?: string; fg?: string; size?: number }) => (
  <div
    style={{
      flex: 'none',
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
      color: fg,
      fontFamily: MONO,
      fontSize: size * 0.52,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {n}
  </div>
);

// Bitmela 2026 (sampled from the official speaker poster): event nod on cover + close only.
const BM_RED = '#E23A2F';
const BM_YELLOW = '#F2C23A';
const BM_CREAM = '#F4E7C7';

// The poster's stepped pixel border, redrawn: a yellow zigzag through red, cream to its left.
const BITMELA_ZIGZAG = [0, 1, 2, 3, 2, 1];
const BitmelaBand = ({ style }: { style?: CSSProperties }) => {
  const cell = 36;
  const rows = Math.ceil(1080 / cell);
  return (
    <svg width={cell * 4} height={1080} viewBox={`0 0 ${cell * 4} 1080`} style={{ position: 'absolute', top: 0, ...style }} aria-hidden>
      <rect x={0} y={0} width={cell * 4} height={1080} fill={BM_RED} />
      {Array.from({ length: rows }, (_, r) => {
        const z = BITMELA_ZIGZAG[r % BITMELA_ZIGZAG.length];
        return (
          <g key={r}>
            {z > 0 && <rect x={0} y={r * cell} width={z * cell} height={cell} fill={BM_CREAM} />}
            <rect x={z * cell} y={r * cell} width={cell} height={cell} fill={BM_YELLOW} />
            {r % 2 === 0 && z < 3 && <rect x={cell * 3 + cell / 4} y={r * cell + cell / 4} width={cell / 2} height={cell / 2} fill={BM_CREAM} />}
          </g>
        );
      })}
    </svg>
  );
};

const BitmelaChip = () => (
  <span style={{ background: BM_RED, color: BM_YELLOW, borderRadius: 8, padding: '8px 18px', fontSize: 26, fontWeight: 800, letterSpacing: '0.08em', fontStyle: 'italic' }}>
    BITMELA
  </span>
);

/* ───────────────────────── Frame ───────────────────────── */

const Footer = ({ onBlue = false }: { onBlue?: boolean }) => {
  const { current, total } = useSlidePageNumber();
  const ink = onBlue ? FONDANT : MUTED;
  return (
    <div
      style={{
        position: 'absolute',
        left: PAD_X,
        right: PAD_X,
        bottom: 44,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 22,
        fontWeight: 500,
        color: ink,
      }}
    >
      <img src={onBlue ? cakeLogoMono : cakeLogo} alt="Cake Wallet" style={{ height: 34, display: 'block' }} />
      <span>Privacy 101 · Bitmela 2026 · @sethforprivacy</span>
      <span style={{ fontFamily: MONO, fontSize: 26 }}>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

const Chip = ({ children, bg = YELLOW, fg = FONDANT }: { children: ReactNode; bg?: string; fg?: string }) => (
  <span
    style={{
      background: bg,
      color: fg,
      borderRadius: 999,
      padding: '10px 26px',
      fontSize: 24,
      fontWeight: 800,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      lineHeight: 1,
    }}
  >
    {children}
  </span>
);

const QrCard = ({ src, label, size = 260 }: { src: string; label: string; size?: number }) => (
  <div
    style={{
      background: WHITE,
      borderRadius: 'var(--osd-radius)',
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18,
      boxShadow: '0 1px 0 rgba(49,41,56,0.08)',
    }}
  >
    <img src={src} alt="" style={{ width: size, height: size, display: 'block' }} />
    <span style={{ fontFamily: MONO, fontSize: 26, color: FONDANT }}>{label}</span>
  </div>
);

// The workshop's own group (on Signal's network, so it opens in Radar or Signal): logo + join QR.
// Used on Community, Track C's finish line and Resources.
const GroupCard = ({ size = 400 }: { size?: number }) => (
  <div style={{ background: WHITE, borderRadius: 'var(--osd-radius)', padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, alignSelf: 'stretch' }}>
      <img src={groupLogo} alt="" style={{ width: 72, height: 72, borderRadius: '50%', display: 'block' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.01em' }}>Privacy 101</span>
        <span style={{ fontFamily: MONO, fontSize: 22, color: MUTED }}>Radar or Signal · scan to join</span>
      </div>
    </div>
    <img src={qrSignalGroup} alt="Privacy 101 group invite QR" style={{ width: size, height: size, display: 'block' }} />
  </div>
);

/* ───────────────────────── Teaching ("step") pages ───────────────────────── */

const StepEyebrow = ({ n, label, color = BLUE }: { n: string; label: string; color?: string }) => (
  <Eyebrow>
    <svg width={26} height={26} viewBox="0 0 50 50" aria-hidden>
      <rect x={0} y={0} width={50} height={50} fill={color} />
    </svg>
    <span>
      Step {n} · {label}
    </span>
  </Eyebrow>
);

// How hard a tool is to adopt: filled dots out of three.
const LEVELS = { easy: ['Easy', 1], medium: ['Medium', 2], advanced: ['Advanced', 3] } as const;
const Level = ({ level }: { level: keyof typeof LEVELS }) => {
  const [label, n] = LEVELS[level];
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 22, color: MUTED }}>
      <span style={{ display: 'flex', gap: 5 }}>
        {[1, 2, 3].map((i) => (
          <span key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i <= n ? FONDANT : 'transparent', border: `2px solid ${FONDANT}`, boxSizing: 'border-box' }} />
        ))}
      </span>
      {label}
    </span>
  );
};

// `highlight` marks Seth's own pick on a step page (thick Fondant border + offset shadow, yellow tag).
const ToolCard = ({
  name,
  tag,
  children,
  tagColor = BLUE,
  highlight = false,
  level,
}: {
  name: string;
  tag: string;
  children: ReactNode;
  tagColor?: string;
  highlight?: boolean;
  level?: keyof typeof LEVELS;
}) => (
  <div
    style={{
      flex: 1,
      background: WHITE,
      borderRadius: 'var(--osd-radius)',
      padding: highlight ? '34px 36px 36px' : '38px 40px 40px',
      border: highlight ? `4px solid ${FONDANT}` : 'none',
      boxShadow: highlight ? `8px 8px 0 ${FONDANT}` : 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ background: highlight ? YELLOW : tagColor, borderRadius: 999, padding: '6px 18px', fontFamily: MONO, fontSize: 24 }}>{tag}</span>
      {level && <Level level={level} />}
    </div>
    <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{name}</div>
    <div style={{ fontSize: 31, lineHeight: 1.42, color: MUTED }}>{children}</div>
  </div>
);

const CardRow = ({ children, top = 430 }: { children: ReactNode; top?: number }) => (
  <div style={{ position: 'absolute', left: PAD_X, right: PAD_X, top, display: 'flex', gap: 36 }}>{children}</div>
);

// The bottom line on a step page: what to do with it today.
const Takeaway = ({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'yellow' | 'plain' }) => (
  <div
    style={{
      position: 'absolute',
      left: PAD_X,
      right: PAD_X,
      top: 838,
      minHeight: 96,
      borderRadius: 'var(--osd-radius)',
      background: tone === 'blue' ? BLUE : tone === 'yellow' ? YELLOW : 'transparent',
      border: tone === 'plain' ? `2px solid ${RULE}` : 'none',
      padding: '0 40px',
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      fontSize: 34,
      fontWeight: 600,
    }}
  >
    {children}
  </div>
);

/* ───────────────────────── "Do it now" pages (full Cake-blue field) ───────────────────────── */

const Action = ({ n, children }: { n: number; children: ReactNode }) => (
  <div
    style={{
      background: WHITE,
      borderRadius: 'var(--osd-radius)',
      padding: '28px 34px',
      display: 'flex',
      alignItems: 'center',
      gap: 28,
      fontSize: 34,
      lineHeight: 1.36,
      minHeight: 150,
      boxSizing: 'border-box',
    }}
  >
    <Badge n={n} />
    <div>{children}</div>
  </div>
);

// Inline UI path, e.g. Settings › Privacy › Phone number.
const Tap = ({ children }: { children: ReactNode }) => (
  <span style={{ fontFamily: MONO, fontSize: '0.8em', fontWeight: 500, background: ICING, borderRadius: 10, padding: '3px 12px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', lineHeight: 1.7 }}>
    {children}
  </span>
);

const Aside = ({ label, children, tone = 'dark' }: { label: string; children: ReactNode; tone?: 'dark' | 'yellow' | 'white' }) => (
  <div
    style={{
      background: tone === 'dark' ? FONDANT : tone === 'yellow' ? YELLOW : WHITE,
      color: tone === 'dark' ? ICING : FONDANT,
      borderRadius: 'var(--osd-radius)',
      padding: '34px 38px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}
  >
    <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.8 }}>{label}</span>
    <div style={{ fontSize: 32, lineHeight: 1.4, fontWeight: 500 }}>{children}</div>
  </div>
);

const DoIt = ({
  track,
  step,
  total,
  title,
  actions,
  aside,
}: {
  track: string;
  step?: number;
  total?: number;
  title: ReactNode;
  actions: ReactNode;
  aside: ReactNode;
}) => (
  <div style={{ ...root, background: BLUE, color: FONDANT }}>
    <div style={{ position: 'absolute', left: PAD_X, right: PAD_X, top: 84, display: 'flex', alignItems: 'center', gap: 24 }}>
      <Chip>Do it now</Chip>
      <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 500 }}>{track}</span>
      <span style={{ flex: 1 }} />
      {step !== undefined && (
        <span style={{ fontFamily: MONO, fontSize: 44 }}>
          {step}
          <span style={{ opacity: 0.55 }}> / {total}</span>
        </span>
      )}
    </div>
    <Title top={170} size={76} width={1680}>
      {title}
    </Title>
    <div style={{ position: 'absolute', left: PAD_X, top: 330, width: 1020, display: 'flex', flexDirection: 'column', gap: 24 }}>{actions}</div>
    <div style={{ position: 'absolute', left: 1180, right: PAD_X, top: 330, display: 'flex', flexDirection: 'column', gap: 24 }}>{aside}</div>
    <Footer onBlue />
  </div>
);

// Track opener: what you'll do, what you need, what you leave with.
const Fact = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 28, alignItems: 'baseline', borderTop: `2px solid rgba(49,41,56,0.25)`, paddingTop: 22 }}>
    <span style={{ width: 230, flex: 'none', fontSize: 22, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
    <span style={{ fontSize: 34, lineHeight: 1.4 }}>{children}</span>
  </div>
);

const TrackIntro = ({ letter, name, facts, qr }: { letter: string; name: ReactNode; facts: ReactNode; qr: ReactNode }) => (
  <div style={{ ...root, background: BLUE, color: FONDANT }}>
    <div style={{ position: 'absolute', left: PAD_X, top: 84, display: 'flex', alignItems: 'center', gap: 24 }}>
      <Chip bg={FONDANT} fg={ICING}>
        Track {letter}
      </Chip>
      <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 500 }}>You picked this one</span>
    </div>
    <Title top={170} size={104} width={1060}>
      {name}
    </Title>
    <div style={{ position: 'absolute', left: PAD_X, top: 520, width: 1020, display: 'flex', flexDirection: 'column', gap: 26 }}>{facts}</div>
    <div style={{ position: 'absolute', right: PAD_X, top: 170, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-end' }}>{qr}</div>
    <Footer onBlue />
  </div>
);

/* ═════════════════════════ PAGES ═════════════════════════ */

/* ── Open ─────────────────────────────────────────────── */

const Cover: Page = () => (
  <div style={{ ...root, background: GRADIENT_BG }}>
    <ShatterNet scale={0.84} style={{ right: 150, top: 90 }} />
    <BitmelaBand style={{ right: 0 }} />
    <Eyebrow top={204}>
      <BitmelaChip />
      <span>Jaipur · 30–31 October 2026</span>
    </Eyebrow>
    <h1 style={{ ...HEAD, position: 'absolute', left: PAD_X, top: 270, fontSize: 'var(--osd-size-hero)', lineHeight: 1 }}>Privacy 101</h1>
    <p style={{ position: 'absolute', left: PAD_X, top: 500, width: 900, margin: 0, fontSize: 40, lineHeight: 1.45, color: MUTED }}>
      A hands-on workshop. Phone out, battery charged, mobile data on.
    </p>
    <div style={{ position: 'absolute', left: PAD_X, bottom: 96, display: 'flex', alignItems: 'center', gap: 32 }}>
      <img src={cakeLogo} alt="Cake Wallet" style={{ height: 52, display: 'block' }} />
      <span style={{ width: 2, height: 44, background: RULE }} />
      <img src={sethPhoto} alt="" style={{ height: 64, width: 64, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
      <span style={{ fontSize: 30, fontWeight: 600 }}>Seth For Privacy</span>
    </div>
  </div>
);

const Hello: Page = () => (
  <div style={root}>
    <div style={{ position: 'absolute', left: PAD_X, top: 200, width: 600, height: 600, borderRadius: '50%', overflow: 'hidden', border: `4px solid ${FONDANT}` }}>
      <img src={sethPhoto} alt="Seth" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
    <Eyebrow top={160} color={MUTED}>
      <span style={{ marginLeft: 680 }}>Who's up here</span>
    </Eyebrow>
    <h1 style={{ ...HEAD, position: 'absolute', left: 800, top: 214, fontSize: 104 }}>
      Hi, I'm <Em>Seth</Em>.
    </h1>
    <div style={{ position: 'absolute', left: 800, top: 400, width: 1000, display: 'flex', flexDirection: 'column', gap: 34 }}>
      <HelloRow k="Opt Out">Host of the Opt Out podcast: years of conversations with the people building privacy tools.</HelloRow>
      <HelloRow k="Cake Wallet">COO. Building privacy and self-custody that normal people can actually use.</HelloRow>
      <HelloRow k="The guide">Wrote “Privacy first steps”, the 0 → 1 path we'll walk today.</HelloRow>
    </div>
    <Footer />
  </div>
);

const HelloRow = ({ k, children }: { k: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 30, alignItems: 'baseline', borderTop: `2px solid ${RULE}`, paddingTop: 22 }}>
    <span style={{ width: 210, flex: 'none', fontFamily: MONO, fontSize: 26, color: MUTED }}>{k}</span>
    <span style={{ fontSize: 36, lineHeight: 1.42 }}>{children}</span>
  </div>
);

const AgendaRow = ({ n, label, mins, accent = BLUE }: { n: string; label: ReactNode; mins: string; accent?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 32, height: 104, borderBottom: `2px solid ${RULE}` }}>
    <Badge n={n} bg={accent} fg={FONDANT} size={64} />
    <span style={{ flex: 1, fontSize: 44, fontWeight: 600, letterSpacing: '-0.01em' }}>{label}</span>
    <span style={{ fontFamily: MONO, fontSize: 32, color: MUTED }}>{mins}</span>
  </div>
);

const Plan: Page = () => (
  <div style={root}>
    <Eyebrow>55 minutes</Eyebrow>
    <Title>
      The <Em>plan</Em>
    </Title>
    <div style={{ position: 'absolute', left: PAD_X, top: 330, width: 1680 }}>
      <AgendaRow n="1" label="Why privacy" mins="10 min" />
      <AgendaRow n="2" label="The 11 steps" mins="12 min" />
      <AgendaRow n="3" label="Warm-up: search engine" mins="3 min" accent={YELLOW} />
      <AgendaRow n="4" label="Hands-on: one step, your pick" mins="20 min" accent={YELLOW} />
      <AgendaRow n="5" label="Next 30 days + Q&A" mins="10 min" />
    </div>
    <Footer />
  </div>
);

/* ── Why ──────────────────────────────────────────────── */

const Icebreaker: Page = () => (
  <div style={root}>
    <Eyebrow>Quick show of hands</Eyebrow>
    <Steps>
      <h1 style={{ ...HEAD, position: 'absolute', left: PAD_X, top: 230, width: 1560, fontSize: 104, lineHeight: 1.12 }}>
        Who here is willing to email me all of your <Em>passwords</Em> and your home address?
      </h1>
      <Step>
        <p style={{ position: 'absolute', left: PAD_X, top: 720, margin: 0, fontSize: 48, fontWeight: 600, color: MUTED }}>
          Nobody? Then you already care about privacy.
        </p>
      </Step>
    </Steps>
    <Footer />
  </div>
);

const Choice: Page = () => (
  <div style={root}>
    <Eyebrow>What privacy actually is</Eyebrow>
    <h1 style={{ ...HEAD, position: 'absolute', left: PAD_X, top: 230, fontSize: 132, lineHeight: 1.08 }}>
      Privacy isn't secrecy.
      <br />
      It's <Em>choice</Em>.
    </h1>
    <p style={{ position: 'absolute', left: PAD_X, top: 590, width: 1300, margin: 0, fontSize: 42, lineHeight: 1.45, color: MUTED }}>
      Choosing who gets to know what about you, and being able to change your mind later.
    </p>
    <div style={{ position: 'absolute', left: PAD_X, top: 790, width: 1300, borderLeft: `4px solid ${FONDANT}`, paddingLeft: 32 }}>
      <div style={{ fontSize: 32, lineHeight: 1.45, fontStyle: 'italic' }}>
        “Privacy is not having nothing known about you. Privacy is that you get to choose.”
      </div>
    </div>
    <Footer />
  </div>
);

const BreachCard = ({ when, what, children }: { when: string; what: string; children: ReactNode }) => (
  <div style={{ flex: 1, background: WHITE, borderRadius: 'var(--osd-radius)', padding: '30px 36px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 196, boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
      <span style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.01em' }}>{what}</span>
      <span style={{ fontFamily: MONO, fontSize: 26, color: RED_TEXT }}>{when}</span>
    </div>
    <div style={{ fontSize: 30, lineHeight: 1.4, color: MUTED }}>{children}</div>
  </div>
);

const AlreadyOut: Page = () => (
  <div style={root}>
    <Eyebrow>Closer to home</Eyebrow>
    <Title>
      Your data is <Em>already</Em> out there.
    </Title>
    <div style={{ position: 'absolute', left: PAD_X, right: PAD_X, top: 300, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', gap: 28 }}>
        <BreachCard what="CoWIN bot" when="2023">
          Type in a phone number, get back Aadhaar, passport and date of birth.
        </BreachCard>
        <BreachCard what="Star Health" when="2024">
          31 million customers' medical and ID records (the hacker's claim), served through Telegram bots.
        </BreachCard>
      </div>
      <div style={{ display: 'flex', gap: 28 }}>
        <BreachCard what="boAt" when="2024">
          7.5 million customers' names, addresses, phone numbers and emails.
        </BreachCard>
        <BreachCard what="“ICMR” records" when="2023">
          81.5 crore Aadhaar and passport records offered for sale (the seller's claim).
        </BreachCard>
      </div>
    </div>
    <Takeaway tone="yellow">
      India's data protection rules mostly kick in from May 2027. Your habits can start today.
    </Takeaway>
    <Footer />
  </div>
);

const ThreatQ = ({ n, q, children }: { n: string; q: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start', borderTop: `2px solid ${RULE}`, paddingTop: 26 }}>
    <Badge n={n} bg={BLUE} fg={FONDANT} size={60} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.01em' }}>{q}</span>
      <span style={{ fontSize: 31, lineHeight: 1.4, color: MUTED }}>{children}</span>
    </div>
  </div>
);

const Journey: Page = () => (
  <div style={root}>
    <Eyebrow>Before we start</Eyebrow>
    <Title>
      A journey, not a <Em>destination</Em>.
    </Title>
    <div style={{ position: 'absolute', left: PAD_X, top: 330, width: 1000, display: 'flex', flexDirection: 'column', gap: 30 }}>
      <ThreatQ n="1" q="What am I protecting?">Messages, money, location, health, your family's photos…</ThreatQ>
      <ThreatQ n="2" q="From whom?">Advertisers, scammers, data leaks, a nosy employer, the state.</ThreatQ>
      <ThreatQ n="3" q="How far will I go?">That decides your order. Nobody switches overnight.</ThreatQ>
    </div>
    <div style={{ position: 'absolute', left: 1220, right: PAD_X, top: 330, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Aside label="Your model, your order" tone="dark">
        My order is a suggestion. Yours can be different, and that's fine.
      </Aside>
      <Aside label="Don't freeze" tone="yellow">
        “The most important thing is that people take that first step.”
      </Aside>
    </div>
    <Footer />
  </div>
);

const CommunityCard = ({ name, children }: { name: string; children: ReactNode }) => (
  <div style={{ background: WHITE, borderRadius: 'var(--osd-radius)', padding: '22px 36px', display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.01em' }}>{name}</span>
    <span style={{ fontSize: 30, lineHeight: 1.4, color: MUTED }}>{children}</span>
  </div>
);

const Community: Page = () => (
  <div style={root}>
    <StepEyebrow n="01" label="Community" />
    <Title>
      Don't do this <Em>alone</Em>.
    </Title>
    <p style={{ position: 'absolute', left: PAD_X, top: 280, width: 1080, margin: 0, fontSize: 36, lineHeight: 1.45, color: MUTED }}>
      The most important step isn't technical. Find people who'll answer the “dumb” questions and keep you going.
    </p>
    <div style={{ position: 'absolute', left: PAD_X, top: 420, width: 1080, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CommunityCard name="Our Privacy 101 group">Made for today, in Radar or Signal. Keep asking, keep helping each other after Bitmela.</CommunityCard>
      <CommunityCard name="Internet Freedom Foundation · FOSS United">India's digital-rights and free-software communities.</CommunityCard>
      <CommunityCard name="The people in this room">Swap usernames before you leave. That's your first privacy circle.</CommunityCard>
    </div>
    <div style={{ position: 'absolute', right: PAD_X, top: 280 }}>
      <GroupCard size={470} />
    </div>
    <Footer />
  </div>
);

/* ── The map ──────────────────────────────────────────── */

const MapDivider: Page = () => (
  <div style={{ ...root, background: GRADIENT_BG }}>
    <ShatterNet style={{ right: -40, top: 0 }} />
    <Eyebrow top={300}>Part two</Eyebrow>
    <h1 style={{ ...HEAD, position: 'absolute', left: PAD_X, top: 360, fontSize: 'var(--osd-size-hero)', lineHeight: 1 }}>
      The <Em>map</Em>.
    </h1>
    <p style={{ position: 'absolute', left: PAD_X, top: 600, width: 860, margin: 0, fontSize: 42, lineHeight: 1.45, color: MUTED }}>
      Eleven steps, in the order I'd take them if I were starting over today.
    </p>
    <Footer />
  </div>
);

// One node on the 0 → 1 map. `mark` flags what we'll do live today.
const MapNode = ({ n, x, y, label, color, mark }: { n: number; x: number; y: number; label: string; color: string; mark?: 'ballot' | 'warmup' }) => (
  <g>
    {mark && <circle cx={x} cy={y} r={58} fill="none" stroke={mark === 'ballot' ? FONDANT : ORANGE} strokeWidth={4} strokeDasharray={mark === 'ballot' ? '0' : '10 8'} />}
    <circle cx={x} cy={y} r={44} fill={color} />
    <text x={x} y={y + 13} textAnchor="middle" style={{ fontFamily: MONO, fontSize: 38, fill: FONDANT }}>
      {n}
    </text>
    <text x={x} y={y + (y < 520 ? -80 : 112)} textAnchor="middle" style={{ fontFamily: "'Wix Madefor Text'", fontSize: 28, fontWeight: 600, fill: FONDANT }}>
      {label}
    </text>
  </g>
);

const TierLabel = ({ x, w, label, color }: { x: number; w: number; label: string; color: string }) => (
  <g>
    <rect x={x} y={760} width={w} height={8} rx={4} fill={color} />
    <text x={x} y={812} style={{ fontFamily: MONO, fontSize: 30, fill: FONDANT }}>
      {label}
    </text>
  </g>
);

const TheMap: Page = () => (
  <div style={root}>
    <Eyebrow>Privacy first steps</Eyebrow>
    <Title>
      From 0 to 1, in <Em>eleven</Em> steps.
    </Title>
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
      <polyline
        points="190,600 340,470 490,600 640,470 790,600 940,470 1100,600 1250,470 1420,600 1570,470 1720,600"
        fill="none"
        stroke={EDGE}
        strokeWidth={4}
      />
      <MapNode n={1} x={190} y={600} label="Community" color={BLUE} />
      <MapNode n={2} x={340} y={470} label="Browser" color={BLUE} />
      <MapNode n={3} x={490} y={600} label="Passwords" color={BLUE} mark="ballot" />
      <MapNode n={4} x={640} y={470} label="Email" color={BLUE} mark="ballot" />
      <MapNode n={5} x={790} y={600} label="Aliases" color={BLUE} />
      <MapNode n={6} x={940} y={470} label="Search" color={BLUE} mark="warmup" />
      <MapNode n={7} x={1100} y={600} label="Messaging" color={YELLOW} mark="ballot" />
      <MapNode n={8} x={1250} y={470} label="Money" color={YELLOW} />
      <MapNode n={9} x={1420} y={600} label="VPN" color={ORANGE} />
      <MapNode n={10} x={1570} y={470} label="Phone OS" color={ORANGE} />
      <MapNode n={11} x={1720} y={600} label="Computer OS" color={ORANGE} />
      <TierLabel x={146} w={838} label="Start this week" color={BLUE} />
      <TierLabel x={1056} w={238} label="This month" color={YELLOW} />
      <TierLabel x={1376} w={388} label="When you're ready" color={ORANGE} />
    </svg>
    <div style={{ position: 'absolute', left: PAD_X, top: 868, display: 'flex', gap: 48, fontSize: 28, color: MUTED, alignItems: 'center' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 30, height: 30, borderRadius: '50%', border: `4px solid ${FONDANT}` }} /> On today's ballot
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 30, height: 30, borderRadius: '50%', border: `4px dashed ${ORANGE}` }} /> Today's warm-up
      </span>
    </div>
    <Footer />
  </div>
);

const Browser: Page = () => (
  <div style={root}>
    <StepEyebrow n="02" label="Browser" />
    <Title>
      Browse without being <Em>followed</Em>.
    </Title>
    <CardRow top={330}>
      <ToolCard name="Brave" tag="Every device" highlight level="easy">
        What I use. Blocks ads and trackers out of the box. Import from Chrome and get on with life.
      </ToolCard>
      <ToolCard name="LibreWolf" tag="Computer" level="medium">
        A pre-hardened Firefox. Strong defaults, uBlock Origin included, no tuning needed.
      </ToolCard>
      <ToolCard name="Mullvad Browser" tag="Computer" level="advanced">
        The hardcore option. Use it unchanged so you look like everyone else.
      </ToolCard>
    </CardRow>
    <Takeaway tone="plain">
      <span style={{ fontFamily: MONO, fontWeight: 400 }}>tip</span>
      Elsewhere, add uBlock Origin. Chrome pulled it from its store in August 2026.
    </Takeaway>
    <Footer />
  </div>
);

const Passwords: Page = () => (
  <div style={root}>
    <StepEyebrow n="03" label="Passwords" />
    <Title>
      Remember <Em>one</Em>. Make the rest unique.
    </Title>
    <CardRow top={330}>
      <ToolCard name="Proton Pass" tag="What I use" highlight>
        Clean, free plan with unlimited passwords, plus email aliases built in.
      </ToolCard>
      <ToolCard name="Bitwarden" tag="Open-source classic">
        What my family used for years. Audited, cross-platform, can be self-hosted.
      </ToolCard>
      <ToolCard name="KeePassXC" tag="Power users only">
        Respected, free and offline. No built-in sync, which is a deal-breaker for me.
      </ToolCard>
    </CardRow>
    <Takeaway>
      <Chip bg={FONDANT} fg={ICING}>Ballot B</Chip>
      One leaked password shouldn't unlock ten accounts.
    </Takeaway>
    <Footer />
  </div>
);

const Email: Page = () => (
  <div style={root}>
    <StepEyebrow n="04 + 05" label="Email & aliases" />
    <Title>
      An inbox that isn't <Em>reading</Em> you.
    </Title>
    <CardRow top={330}>
      <ToolCard name="Proton Mail" tag="What I use" highlight>
        What I use for all my email. Free plan, no phone number, encrypted end to end between Proton users.
      </ToolCard>
      <ToolCard name="Tuta" tag="Also great">
        Encrypted email from Germany. People I trust swear by it.
      </ToolCard>
      <ToolCard name="Aliases" tag="Step 05" tagColor={YELLOW}>
        A different address for every account. Leaked or spammy? Switch that one off. I have 653.
      </ToolCard>
    </CardRow>
    <Takeaway>
      <Chip bg={FONDANT} fg={ICING}>Ballot A</Chip>
      Switching email is slow. Pair it with your password manager.
    </Takeaway>
    <Footer />
  </div>
);

const Search: Page = () => (
  <div style={root}>
    <StepEyebrow n="06" label="Search" />
    <Title>
      Your searches say <Em>everything</Em>.
    </Title>
    <CardRow top={330}>
      <ToolCard name="Kagi" tag="What I use" tagColor={YELLOW} highlight>
        For everything. Pay with money, not data. Privacy Pass (Professional plan) unlinks searches from you.
      </ToolCard>
      <ToolCard name="Brave Search" tag="Best free">
        Its own index, not a Google or Bing wrapper. Default in Brave.
      </ToolCard>
      <ToolCard name="DuckDuckGo" tag="iPhone fallback">
        Mostly Bing results without the profile. Not my pick, but the best Safari offers.
      </ToolCard>
    </CardRow>
    <Takeaway tone="yellow">
      <Chip bg={FONDANT} fg={ICING}>Warm-up</Chip>
      Everyone switches this one in a few minutes.
    </Takeaway>
    <Footer />
  </div>
);

const Messaging: Page = () => (
  <div style={root}>
    <StepEyebrow n="07" label="Messaging" color={YELLOW} />
    <Title>
      Talk <Em>freely</Em>.
    </Title>
    <CardRow top={330}>
      <ToolCard name="Radar" tag="What I use" highlight>
        Signal's network and encryption, plus Bitcoin payments. Made by the Cake team. Plain Signal works too.
      </ToolCard>
      <ToolCard name="WhatsApp & Telegram" tag="Keep for groups" tagColor={YELLOW}>
        Fine for big public groups. Move one-to-one and family chats to Radar. Don't fight about it.
      </ToolCard>
      <ToolCard name="Your people" tag="The hard part" tagColor={YELLOW}>
        “A messenger app with no people to message is just pointless.” Bring two of yours over.
      </ToolCard>
    </CardRow>
    <Takeaway>
      <Chip bg={FONDANT} fg={ICING}>Ballot C</Chip>
      Radar from scratch, number hidden, in about 12 minutes.
    </Takeaway>
    <Footer />
  </div>
);

const Money: Page = () => (
  <div style={root}>
    <StepEyebrow n="08" label="Money" color={YELLOW} />
    <Title>
      Your money <Em>talks</Em> too.
    </Title>
    <CardRow top={330}>
      <ToolCard name="Monero" tag="My pick" highlight>
        Hides sender, receiver and amount for everyone, whichever wallet you use. Digital cash as it should be.
      </ToolCard>
      <ToolCard name="Bitcoin, privately" tag="Mind the trail" tagColor={YELLOW}>
        Keep your ID away from your coins. Silent Payments give you one reusable, private address.
      </ToolCard>
      <ToolCard name="Self-custody" tag="Your keys" tagColor={YELLOW}>
        Exchanges get hacked and freeze accounts. Hold your own keys, back up your seed.
      </ToolCard>
    </CardRow>
    <Takeaway>
      <img src={cakeMark} alt="" style={{ height: 52, display: 'block' }} />
      Try it today at the Cake Wallet station here. Full disclosure: I'm Cake's COO.
    </Takeaway>
    <Footer />
  </div>
);

const Vpn: Page = () => (
  <div style={root}>
    <StepEyebrow n="09" label="VPN" color={ORANGE} />
    <Title>
      Choose who sees your <Em>traffic</Em>.
    </Title>
    <CardRow top={330}>
      <ToolCard name="Obscura" tag="My pick" tagColor={YELLOW} highlight>
        Obscura knows who you are, Mullvad sees where you go. Neither sees both. Pay in Lightning or Monero.
      </ToolCard>
      <ToolCard name="Mullvad" tag="No email" tagColor={ORANGE}>
        Account number only. Flat €5 a month, payable in cash or Monero.
      </ToolCard>
      <ToolCard name="Proton VPN" tag="Free tier" tagColor={ORANGE}>
        A real free plan with no data cap. Bundled with Proton paid plans.
      </ToolCard>
    </CardRow>
    <Takeaway tone="plain">
      <span style={{ fontFamily: MONO, fontWeight: 400 }}>India</span>
      Proton and others pulled their India servers in 2022 rather than log you.
    </Takeaway>
    <Footer />
  </div>
);

const Os: Page = () => (
  <div style={root}>
    <StepEyebrow n="10 + 11" label="Phone & computer" color={ORANGE} />
    <Title>
      The <Em>foundation</Em>, when you're ready.
    </Title>
    <CardRow top={330}>
      <ToolCard name="GrapheneOS" tag="Best phone OS" highlight>
        Hardened Android without Google watching. Pixel-only for now; Pixel 8 or newer is best.
      </ToolCard>
      <ToolCard name="On an iPhone?" tag="Phone" tagColor={ORANGE}>
        What I use day to day. Turn on Advanced Data Protection: the best privacy of any phone out of the box.
      </ToolCard>
      <ToolCard name="Linux" tag="Computer" tagColor={ORANGE}>
        Pop!_OS or Zorin OS. Switch slowly, one app at a time. The hard part is your accounts, not Linux.
      </ToolCard>
    </CardRow>
    <Takeaway tone="plain">
      <span style={{ fontFamily: MONO, fontWeight: 400 }}>later</span>
      These make every other step stronger. They're not where you start.
    </Takeaway>
    <Footer />
  </div>
);

/* ── Do it: warm-up + vote ────────────────────────────── */

const WarmUp: Page = () => (
  <DoIt
    track="Warm-up · everyone · 2 min"
    title={
      <>
        Change your default <Em on="blue">search engine</Em>.
      </>
    }
    actions={
      <>
        <Action n={1}>
          <b>Android, Chrome:</b> <Tap>⋮ › Settings › Search engine</Tap> and pick Brave
        </Action>
        <Action n={2}>
          <b>iPhone, Safari:</b> <Tap>Settings › Search › Search Engine</Tap> and pick DuckDuckGo
        </Action>
        <Action n={3}>
          <b>Already on Brave?</b> Check <Tap>Settings › Search engines</Tap> says Brave. Give yourself a point.
        </Action>
      </>
    }
    aside={
      <>
        <Aside label="Not listed?" tone="dark">
          Android: search once on search.brave.com. Older iPhone: <span style={{ fontFamily: MONO }}>Settings › Safari</span>.
        </Aside>
        <Aside label="That's step 06" tone="yellow">
          Done. You're already on the map.
        </Aside>
      </>
    }
  />
);

const BallotCard = ({ letter, name, leave, mins }: { letter: string; name: string; leave: string; mins: string }) => (
  <div style={{ flex: 1, background: WHITE, borderRadius: 'var(--osd-radius)', padding: '40px 40px 36px', display: 'flex', flexDirection: 'column', gap: 22, minHeight: 0, boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Badge n={letter} size={96} />
      <span style={{ fontFamily: MONO, fontSize: 32, color: MUTED }}>{mins}</span>
    </div>
    <div style={{ fontSize: 50, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{name}</div>
    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginTop: 'auto' }}>You leave with</div>
    <div style={{ fontSize: 32, lineHeight: 1.4 }}>{leave}</div>
  </div>
);

const Vote: Page = () => (
  <div style={{ ...root, background: BLUE }}>
    <div style={{ position: 'absolute', left: PAD_X, top: 84, display: 'flex', alignItems: 'center', gap: 24 }}>
      <Chip>Your call</Chip>
      <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 500 }}>Hands up · majority wins</span>
    </div>
    <Title top={170} size={88}>
      You <Em on="blue">pick</Em>. We do it together.
    </Title>
    <div style={{ position: 'absolute', left: PAD_X, right: PAD_X, top: 340, display: 'flex', gap: 36 }}>
      <BallotCard letter="A" name="Proton Mail + your first alias" leave="A private inbox, a saved recovery phrase, and one alias." mins="~15 min" />
      <BallotCard letter="B" name="A password manager" leave="A vault with autofill on, 2FA, and a plan for your top three logins." mins="~15 min" />
      <BallotCard letter="C" name="Radar, from scratch" leave="Radar set up, number hidden, a username to share." mins="~12 min" />
    </div>
    <p style={{ position: 'absolute', left: PAD_X, top: 896, margin: 0, fontSize: 32, fontWeight: 500 }}>
      Finish early? Every track's QR code is in the deck. Start another.
    </p>
    <Footer onBlue />
  </div>
);

/* ── Track A: Proton Mail + first alias ───────────────── */

const TrackA: Page = () => (
  <TrackIntro
    letter="A"
    name={
      <>
        Proton Mail + your first <Em on="blue">alias</Em>
      </>
    }
    facts={
      <>
        <Fact label="Time">About 15 minutes</Fact>
        <Fact label="You need">Phone or laptop, pen and paper. Mobile data helps.</Fact>
        <Fact label="You leave with">A private inbox, a saved recovery phrase, one alias.</Fact>
      </>
    }
    qr={<QrCard src={qrProton} label="proton.me/mail" size={330} />}
  />
);

const A1: Page = () => (
  <DoIt
    track="Track A · Proton Mail"
    step={1}
    total={6}
    title="Create your free account."
    actions={
      <>
        <Action n={1}>Go to proton.me/mail, or install the Proton Mail app.</Action>
        <Action n={2}>Choose the Free plan. Pick a username; it doesn't need to be your real name.</Action>
        <Action n={3}>Set a long passphrase. A password manager can make one for you.</Action>
      </>
    }
    aside={
      <>
        <Aside label="Where" tone="dark">
          <span style={{ fontFamily: MONO }}>account.proton.me/signup</span>
        </Aside>
        <Aside label="Good news" tone="white">
          No phone number needed. Pick @proton.me or @protonmail.com.
        </Aside>
      </>
    }
  />
);

const A2: Page = () => (
  <DoIt
    track="Track A · Proton Mail"
    step={2}
    total={6}
    title="Prove you're human."
    actions={
      <>
        <Action n={1}>Choose the CAPTCHA, or have a code sent to another email.</Action>
        <Action n={2}>Stuck or blocked? Many sign-ups from one Wi‑Fi look odd. Switch to mobile data and retry.</Action>
        <Action n={3}>Still nothing? Try the app instead of the browser, or the other way round.</Action>
      </>
    }
    aside={
      <>
        <Aside label="Why this happens" tone="dark">
          Proton fights spam accounts. Fifty sign-ups from one room trips the alarm.
        </Aside>
        <Aside label="Privacy note" tone="white">
          The verification email is only kept as a hash. A recovery email is kept as-is and has gone to police before.
        </Aside>
      </>
    }
  />
);

const A3: Page = () => (
  <DoIt
    track="Track A · Proton Mail"
    step={3}
    total={6}
    title={
      <>
        Save your <Em on="blue">recovery phrase</Em>.
      </>
    }
    actions={
      <>
        <Action n={1}>When asked, download the Recovery Kit. It holds 12 words.</Action>
        <Action n={2}>Write the 12 words on paper. Keep it at home, somewhere safe.</Action>
        <Action n={3}>Don't keep it inside Proton. Locked out means you can't reach it.</Action>
      </>
    }
    aside={
      <>
        <Aside label="Heads up" tone="yellow">
          A recovery email only resets your password. The phrase also brings back your old encrypted mail.
        </Aside>
        <Aside label="Later" tone="dark">
          <span style={{ fontFamily: MONO }}>Settings › Recovery</span>
        </Aside>
      </>
    }
  />
);

const A4: Page = () => (
  <DoIt
    track="Track A · Proton Mail"
    step={4}
    total={6}
    title="Get the app. Double your storage."
    actions={
      <>
        <Action n={1}>Install Proton Mail from the Play Store or App Store and sign in.</Action>
        <Action n={2}>
          In the web inbox at mail.proton.me, open <Tap>Get more storage</Tap> in the left sidebar.
        </Action>
        <Action n={3}>Tick off its three tasks, getting the app included. Free storage goes from 500 MB to 1 GB.</Action>
      </>
    }
    aside={
      <>
        <Aside label="Deadline" tone="yellow">
          The checklist bonus only counts in your first 18 days. Today works.
        </Aside>
        <Aside label="Free plan" tone="white">
          1 address · 150 emails a day · 10 aliases
        </Aside>
      </>
    }
  />
);

const A5: Page = () => (
  <DoIt
    track="Track A · Proton Mail"
    step={5}
    total={6}
    title={
      <>
        Make your first <Em on="blue">alias</Em>.
      </>
    }
    actions={
      <>
        <Action n={1}>
          Install Proton Pass, sign in with the same account, tap <Tap>+ › Alias</Tap>.
        </Action>
        <Action n={2}>Use the alias for your next shop, app or newsletter sign-up.</Action>
        <Action n={3}>Leaked or spammed? Switch that one alias off. Nothing else changes.</Action>
      </>
    }
    aside={
      <>
        <Aside label="Why bother" tone="dark">
          One address everywhere links all your accounts together. Aliases break the chain.
        </Aside>
        <Aside label="Free plan" tone="white">
          10 aliases. I have 653 across my accounts.
        </Aside>
      </>
    }
  />
);

const A6: Page = () => (
  <DoIt
    track="Track A · Proton Mail"
    step={6}
    total={6}
    title="Move in, one account at a time."
    actions={
      <>
        <Action n={1}>Each time you log in somewhere, switch its email to Proton or an alias.</Action>
        <Action n={2}>Start with the accounts that matter most: your bank, UPI and phone carrier.</Action>
        <Action n={3}>Leave Gmail running while you move. Less lands there every week.</Action>
      </>
    }
    aside={
      <>
        <Aside label="Done ✓" tone="yellow">
          Steps 04 and 05 on the map. That's your 0 → 1.
        </Aside>
        <Aside label="Keep it alive" tone="dark">
          Free accounts are deleted after 12 months with no sign-in.
        </Aside>
      </>
    }
  />
);

/* ── Track B: password manager ────────────────────────── */

const TrackB: Page = () => (
  <TrackIntro
    letter="B"
    name={
      <>
        A password <Em on="blue">manager</Em>
      </>
    }
    facts={
      <>
        <Fact label="Time">About 15 minutes</Fact>
        <Fact label="Pick one">Proton Pass (easiest) or Bitwarden (open source)</Fact>
        <Fact label="You leave with">A vault with autofill and 2FA on, and a plan for your top three logins.</Fact>
      </>
    }
    qr={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <QrCard src={qrPass} label="Proton Pass" size={240} />
        <QrCard src={qrBitwarden} label="Bitwarden" size={240} />
      </div>
    }
  />
);

const B1: Page = () => (
  <DoIt
    track="Track B · Passwords"
    step={1}
    total={5}
    title={
      <>
        Create your vault and <Em on="blue">master</Em> password.
      </>
    }
    actions={
      <>
        <Action n={1}>Proton Pass: sign in with Proton or any email. Bitwarden: verify your email first.</Action>
        <Action n={2}>Make a passphrase: four to six random words you'd never put together.</Action>
        <Action n={3}>Write it down once. Keep that paper at home.</Action>
      </>
    }
    aside={
      <>
        <Aside label="Like this" tone="white">
          <span style={{ fontFamily: MONO }}>tiger kettle monsoon ladder</span>
          <br />
          (Just don't use this one.)
        </Aside>
        <Aside label="Heads up" tone="yellow">
          Bitwarden can't reset it for you. Forget it and the vault is gone.
        </Aside>
      </>
    }
  />
);

const B2: Page = () => (
  <DoIt
    track="Track B · Passwords"
    step={2}
    total={5}
    title="Install it everywhere you log in."
    actions={
      <>
        <Action n={1}>Phone: install the app and sign in.</Action>
        <Action n={2}>Android: say yes when the app offers autofill. Missed it? Find Autofill in the app's own settings.</Action>
        <Action n={3}>
          iPhone: <Tap>Settings › General › AutoFill & Passwords</Tap>, switch it on, pick your manager.
        </Action>
      </>
    }
    aside={
      <>
        <Aside label="On your computer" tone="dark">
          Add the browser extension and pin it to the toolbar.
        </Aside>
        <Aside label="Try it" tone="white">
          Log out of any site, then log back in with autofill.
        </Aside>
      </>
    }
  />
);

const B3: Page = () => (
  <DoIt
    track="Track B · Passwords"
    step={3}
    total={5}
    title={
      <>
        Lock the vault with <Em on="blue">2FA</Em>.
      </>
    }
    actions={
      <>
        <Action n={1}>Install an authenticator app: Proton Authenticator or Ente Auth.</Action>
        <Action n={2}>
          Log in on the web. Bitwarden: <Tap>Settings › Security › Two-step login</Tap>. Proton: <Tap>Account and password › 2FA</Tap>.
        </Action>
        <Action n={3}>Add it to the authenticator. Save the recovery codes on paper, with your master password.</Action>
      </>
    }
    aside={
      <>
        <Aside label="Why" tone="dark">
          Even if your master password leaks, nobody gets in without your phone.
        </Aside>
        <Aside label="Bitwarden bonus" tone="white">
          With 2FA on, no more email codes on every new device.
        </Aside>
      </>
    }
  />
);

const B4: Page = () => (
  <DoIt
    track="Track B · Passwords"
    step={4}
    total={5}
    title="Bring your old passwords. At home."
    actions={
      <>
        <Action n={1}>
          On a computer, Chrome: <Tap>⋮ › Passwords and autofill › Google Password Manager › Settings › Export</Tap>
        </Action>
        <Action n={2}>
          Import: Proton Pass extension <Tap>Settings › Import</Tap>, Bitwarden web <Tap>Tools › Import</Tap>
        </Action>
        <Action n={3}>Delete the exported file straight away. Empty the trash too.</Action>
      </>
    }
    aside={
      <>
        <Aside label="Heads up" tone="yellow">
          That file is every password in plain text. Not on venue Wi‑Fi, not in a crowd.
        </Aside>
        <Aside label="Only once" tone="dark">
          Bitwarden doesn't de-duplicate imports. Run it a single time.
        </Aside>
      </>
    }
  />
);

const B5: Page = () => (
  <DoIt
    track="Track B · Passwords"
    step={5}
    total={5}
    title={
      <>
        Fix your top <Em on="blue">three</Em> today.
      </>
    }
    actions={
      <>
        <Action n={1}>Your email account. It can reset everything else.</Action>
        <Action n={2}>Your bank and UPI apps.</Action>
        <Action n={3}>Your Google or Apple account and your mobile carrier.</Action>
      </>
    }
    aside={
      <>
        <Aside label="How" tone="white">
          Change password → let the manager generate it → save.
        </Aside>
        <Aside label="Done ✓" tone="yellow">
          Step 03 on the map. That's your 0 → 1.
        </Aside>
      </>
    }
  />
);

/* ── Track C: Radar from scratch (Signal's network; plain Signal works too) ── */

const TrackC: Page = () => (
  <TrackIntro
    letter="C"
    name={
      <>
        Radar, from <Em on="blue">scratch</Em>
      </>
    }
    facts={
      <>
        <Fact label="Time">About 12 minutes</Fact>
        <Fact label="Have Signal?">Keep it today and skip to step 3. Move into Radar at home, from a Signal backup.</Fact>
        <Fact label="You leave with">Radar set up, your number hidden, a username to share.</Fact>
      </>
    }
    qr={<QrCard src={qrRadar} label="radar.chat/install" size={330} />}
  />
);

const C1: Page = () => (
  <DoIt
    track="Track C · Radar"
    step={1}
    total={6}
    title="Install and verify."
    actions={
      <>
        <Action n={1}>Get Radar from radar.chat/install or your app store. Watch for lookalikes.</Action>
        <Action n={2}>Enter your phone number, then the 6-digit code from the SMS.</Action>
        <Action n={3}>
          No SMS once the timer runs out? Tap <Tap>Call me</Tap>.
        </Action>
      </>
    }
    aside={
      <>
        <Aside label="Heads up" tone="yellow">
          Never share that code with anyone. Not a friend, not “Radar support”.
        </Aside>
        <Aside label="Still stuck?" tone="dark">
          Turn off any VPN, and let unknown callers ring so “Call me” gets through.
        </Aside>
      </>
    }
  />
);

const C2: Page = () => (
  <DoIt
    track="Track C · Radar"
    step={2}
    total={6}
    title={
      <>
        Set your <Em on="blue">PIN</Em> and profile.
      </>
    }
    actions={
      <>
        <Action n={1}>Create a PIN when asked. Longer is better. Write it down.</Action>
        <Action n={2}>Add a name. A first name or nickname is fine; the photo is optional.</Action>
        <Action n={3}>
          Turn on <Tap>Settings › Account › Registration Lock</Tap>
        </Action>
      </>
    }
    aside={
      <>
        <Aside label="Why the lock" tone="dark">
          Someone who steals your SIM can't take over your account without the PIN.
        </Aside>
        <Aside label="Heads up" tone="yellow">
          Forget the PIN with the lock on, and you wait up to 7 days.
        </Aside>
      </>
    }
  />
);

const C3: Page = () => (
  <DoIt
    track="Track C · Radar"
    step={3}
    total={6}
    title={
      <>
        Create a <Em on="blue">username</Em>.
      </>
    }
    actions={
      <>
        <Action n={1}>
          Tap your <Tap>profile photo › your name › @</Tap>
        </Action>
        <Action n={2}>Pick a name plus at least two digits, like chai.42</Action>
        <Action n={3}>Share the username, link or QR instead of your phone number.</Action>
      </>
    }
    aside={
      <>
        <Aside label="Already on Signal?" tone="white">
          Start here, in Signal. At home: <span style={{ fontFamily: MONO }}>Settings › Backups</span>, save the key, then restore it in Radar.
        </Aside>
        <Aside label="Flexible" tone="dark">
          Change or delete it any time. Old links stop working.
        </Aside>
      </>
    }
  />
);

const C4: Page = () => (
  <DoIt
    track="Track C · Radar"
    step={4}
    total={6}
    title={
      <>
        Hide your <Em on="blue">phone number</Em>.
      </>
    }
    actions={
      <>
        <Action n={1}>
          Open <Tap>Settings › Privacy › Phone number</Tap>
        </Action>
        <Action n={2}>
          <b>Who can see my number:</b> check it says Nobody.
        </Action>
        <Action n={3}>
          <b>Who can find me by number:</b> Everybody helps friends find you. Nobody means username only.
        </Action>
      </>
    }
    aside={
      <>
        <Aside label="Order matters" tone="yellow">
          Set this before you block anyone. Blocking doesn't hide a number they've already seen.
        </Aside>
        <Aside label="Your call" tone="dark">
          Just joined and bringing family? Leave “find me” on for now.
        </Aside>
      </>
    }
  />
);

const C5: Page = () => (
  <DoIt
    track="Track C · Radar"
    step={5}
    total={6}
    title={
      <>
        Make messages <Em on="blue">disappear</Em>.
      </>
    }
    actions={
      <>
        <Action n={1}>
          Open <Tap>Settings › Privacy › Default timer for new chats</Tap>
        </Action>
        <Action n={2}>Pick 4 weeks, or 1 week if you're braver.</Action>
        <Action n={3}>Need a chat kept? Change the timer in that chat's settings.</Action>
      </>
    }
    aside={
      <>
        <Aside label="Why" tone="dark">
          Less stored history means less to lose if a phone is lost, stolen or seized.
        </Aside>
        <Aside label="Good habit" tone="white">
          Old messages you never reread are pure risk.
        </Aside>
      </>
    }
  />
);

const C6: Page = () => (
  <DoIt
    track="Track C · Radar"
    step={6}
    total={6}
    title={
      <>
        Say <Em on="blue">hi</Em>.
      </>
    }
    actions={
      <>
        <Action n={1}>Scan the QR to join our Privacy 101 group. Say hi!</Action>
        <Action n={2}>Swap usernames with your neighbour: new chat, then “Find by username”.</Action>
        <Action n={3}>Tonight: invite the two people you message most.</Action>
      </>
    }
    aside={
      <>
        <GroupCard size={480} />
      </>
    }
  />
);

/* ── Wrap ─────────────────────────────────────────────── */

const Done: Page = () => (
  <div style={{ ...root, background: GRADIENT_BG }}>
    <ShatterNet style={{ right: -40, top: 0 }} />
    <Eyebrow top={300}>Look at that</Eyebrow>
    <h1 style={{ ...HEAD, position: 'absolute', left: PAD_X, top: 360, width: 960, fontSize: 132, lineHeight: 1.05 }}>
      You just went from <Em>0 to 1</Em>.
    </h1>
    <p style={{ position: 'absolute', left: PAD_X, top: 680, width: 820, margin: 0, fontSize: 40, lineHeight: 1.45, color: MUTED }}>
      One step, done for real. Every privacy journey starts exactly like this.
    </p>
    <Footer />
  </div>
);

const WeekCard = ({ wk, title, children, color }: { wk: string; title: string; children: ReactNode; color: string }) => (
  <div style={{ flex: 1, background: WHITE, borderRadius: 'var(--osd-radius)', padding: '36px 36px 40px', display: 'flex', flexDirection: 'column', gap: 18, minHeight: 420, boxSizing: 'border-box' }}>
    <span style={{ alignSelf: 'flex-start', background: color, borderRadius: 999, padding: '6px 18px', fontFamily: MONO, fontSize: 26 }}>{wk}</span>
    <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.12 }}>{title}</div>
    <div style={{ fontSize: 30, lineHeight: 1.42, color: MUTED }}>{children}</div>
  </div>
);

const Next30: Page = () => (
  <div style={root}>
    <Eyebrow>After today</Eyebrow>
    <Title>
      Your next <Em>30 days</Em>.
    </Title>
    <CardRow top={330}>
      <WeekCard wk="Week 1" title="Finish today's track" color={BLUE}>
        Then show one person what you did.
      </WeekCard>
      <WeekCard wk="Week 2" title="Do another track" color={BLUE}>
        A, B or C. The slides are online; follow along at home.
      </WeekCard>
      <WeekCard wk="Week 3" title="Browser + aliases" color={BLUE}>
        Brave on your phone. An alias for every new sign-up.
      </WeekCard>
      <WeekCard wk="Week 4" title="Money" color={YELLOW}>
        Try Monero in Cake Wallet. Small amounts first.
      </WeekCard>
    </CardRow>
    <Takeaway tone="plain">
      <span style={{ fontFamily: MONO, fontWeight: 400 }}>then</span>
      VPN, then your phone's OS. When you're ready, not before.
    </Takeaway>
    <Footer />
  </div>
);

const RememberRow = ({ n, title, children }: { n: string; title: ReactNode; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', borderTop: `2px solid ${RULE}`, paddingTop: 30 }}>
    <Badge n={n} bg={YELLOW} fg={FONDANT} size={72} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ fontSize: 50, fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</span>
      <span style={{ fontSize: 33, lineHeight: 1.42, color: MUTED }}>{children}</span>
    </div>
  </div>
);

const Remember: Page = () => (
  <div style={root}>
    <Eyebrow>If you forget everything else</Eyebrow>
    <Title>
      Three things to <Em>remember</Em>.
    </Title>
    <div style={{ position: 'absolute', left: PAD_X, top: 320, width: 1500, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <RememberRow n="1" title="Progress, not perfection.">
        One step at a time. Don't let analysis paralysis stop you acting.
      </RememberRow>
      <RememberRow n="2" title="Skip the privacy nihilism.">
        “It's all tracked anyway” is how they win. Every step counts.
      </RememberRow>
      <RememberRow n="3" title="Bring people with you.">
        Model it, don't preach it. Share one tool with one person this week.
      </RememberRow>
    </div>
    <Footer />
  </div>
);

const ResourceCard = ({ src, name, url }: { src: string; name: string; url: string }) => (
  <div style={{ flex: 1, background: WHITE, borderRadius: 'var(--osd-radius)', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
    <img src={src} alt="" style={{ width: 280, height: 280, display: 'block' }} />
    <div style={{ fontSize: 34, fontWeight: 700, textAlign: 'center', letterSpacing: '-0.01em' }}>{name}</div>
    <div style={{ fontFamily: MONO, fontSize: 24, color: MUTED, textAlign: 'center' }}>{url}</div>
  </div>
);

const Resources: Page = () => (
  <div style={root}>
    <Eyebrow>Take these home</Eyebrow>
    <Title>
      Keep <Em>going</Em>.
    </Title>
    <CardRow top={300}>
      <ResourceCard src={qrFirstSteps} name="Privacy first steps" url="sethforprivacy.com" />
      <ResourceCard src={qrOptOut} name="Opt Out podcast" url="optoutpod.com" />
      <ResourceCard src={qrSignalGroup} name="Privacy 101 group" url="Radar or Signal" />
      <ResourceCard src={qrCake} name="Cake Wallet" url="cakewallet.com" />
    </CardRow>
    <Footer />
  </div>
);

const Close: Page = () => (
  <div style={{ ...root, background: GRADIENT_BG }}>
    <BitmelaBand style={{ right: 0 }} />
    <Eyebrow top={214}>
      <BitmelaChip />
      <span>Thank you · questions?</span>
    </Eyebrow>
    <h1 style={{ ...HEAD, position: 'absolute', left: PAD_X, top: 290, width: 1480, fontSize: 132, fontWeight: 700, lineHeight: 1.08 }}>
      Now get out there and <Em>opt out</Em> this week.
    </h1>
    <div style={{ position: 'absolute', left: PAD_X, top: 720, display: 'flex', alignItems: 'center', gap: 32 }}>
      <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${FONDANT}` }}>
        <img src={sethPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 40, fontWeight: 700 }}>Seth For Privacy</span>
        <span style={{ fontFamily: MONO, fontSize: 26, color: MUTED }}>sethforprivacy.com · @sethforprivacy</span>
      </div>
    </div>
    <Footer />
  </div>
);

/* ═════════════════════════ Speaker notes ═════════════════════════ */
// Index-aligned with the page array below. Quotes marked [OO …] are Seth on Opt Out; [guest …] are his
// interviews elsewhere; [blog] is sethforprivacy.com. Facts carry their source so they can be re-checked.

export const notes: (string | undefined)[] = [
  // 1 Cover
  `[0:00] Welcome. Get phones out now, and ask people to switch to mobile data if the Wi-Fi is slow.
Frame the title: "A lot of privacy content pushes people from zero to 100, and they never take a good first step." [OO s1e05 Justin] Then, in your own framing: today is zero to one.
Honest hook for a Bitcoin crowd: "I got into crypto, which led to personal privacy, just to make money." [guest Priv8 2022]`,
  // 2 Hello
  `[0:01] 30 seconds. Opt Out since 2021; COO at Cake Wallet (disclose it: Cake comes up on the money slide). If someone quotes your Nostr bio ("VP of Operations"): it's stale, you don't use Nostr.
Own your lens (paraphrase): a lot of the people you talk to are in the Western world, with less government oppression to actively fight. [OO s1e01] Then, paraphrasing your s1e07 point: it matters to hear from people who grew up with different experiences. The people who care most about privacy are "a lot of the global South… places where people have faced oppression." [guest bitcoin-rails 2026-10]
Origin story if time: you worked in cybersecurity at Cisco. Cisco built surveillance tech used against the Uyghurs; you didn't work on it and didn't know until it came out. Once you knew, you left. "It really shook me." [guest Expat Money 2024; you confirmed 2026-10-19] Never say you built those tools.`,
  // 3 Plan
  `[0:02] Set expectations: this is a workshop, not a lecture. Phones stay out the whole time; nearly half the hour is hands-on.
The warm-up comes at about 0:25 and the vote at about 0:27. Everyone leaves having done at least one real step.`,
  // 4 Icebreaker
  `[0:03] Ask for a show of hands, let the silence land, then reveal.
"Who reading this is willing to email me all of your passwords and home address?" [blog: comparing-private-spends]
Follow-up: "It's natural to close the bathroom door and the curtains. That isn't hiding anything." [OO s1e03]`,
  // 5 Choice
  `[0:04] Your definition: "Privacy is not having nothing known about you. Privacy is that you get to choose." [guest Expat Money 2024]
Cypherpunk root: privacy is "the power to selectively reveal oneself to the world" (Hughes, 1993) [OO s1e04]
Why it matters: "A lot of ideas, a lot of art gets shut down before it even could exist, because we self-censor when we know we're being watched." [OO s1e06, citing Glenn Greenwald's TED talk]
"If you're not paying with your money, you're paying with your data." [OO Kagi ep] Or: "Whatever you use online, you're paying with something: your time, your data, your eyeballs, or your money." [FTF 20, 2025-11]`,
  // 6 Already out
  `[0:06] Keep it factual. Pick one or two to talk through.
- CoWIN Telegram bot, June 2023: phone number in, Aadhaar/passport/PAN/DOB out (Newslaundry; govt said CoWIN itself wasn't breached).
- Star Health, Sep–Oct 2024: 31M customers, 7.24 TB, served via Telegram bots. Both figures are the HACKER'S CLAIM (xenZen); Reuters couldn't verify them and Star Health disputed a "widespread compromise" (SC World).
- boAt, Apr 2024: 7.5M customers (TechCrunch).
- "ICMR"/COVID data, Oct 2023: 81.5 crore records offered for $80k. That figure is the SELLER'S CLAIM; a sample had valid Aadhaar IDs (Business Today).
Fresher hooks if you want one from this month: SBI, Oct 2026 (CERT-In flagged it 16 Oct; 3,897 customers' records in ~3.75 lakh dark-web rows; IFF says customers weren't told). Bank of Baroda, Jul 2026 (700 GB–1 TB claimed, incl. Aadhaar; bank confirmed one employee mailbox was compromised).
DPDP Rules notified 13 Nov 2025; core obligations only from 13 May 2027. The Data Protection Board still had no Chairperson or Members as of mid-Oct 2026. Consent Manager rules start 13 Nov 2026 (PIB, LiveLaw).
Line: "You may not be targeted right now, but that doesn't mean dragnet surveillance isn't effective." [OO s1e08]`,
  // 7 Journey
  `[0:08] Your triad: "What do you want to protect, who do you want to protect it from, and what lengths are you willing to go to?" [guest Litecoin Underground 2022]
Two simple camps for most people: avoid dragnet surveillance, and avoid breaches leaking your data. [OO s1e03]
Say gently: if your politics or religion is persecuted where you live, your threat model is different and can be life and death. [OO s1e04] Name no groups.
Anti-overwhelm: "They see a monumental shift to a wholly different life, get lost, and give up. You can take it a step at a time." [guest Expat Money]
Honest moment: you've struggled with burnout and feeling it's futile too. [OO s1e01]`,
  // 8 Community
  `[0:10] Step 01 in the guide, and the most important one. [blog: privacy-first-steps]
"If nothing else you get from this, find a good community. Get plugged in." [OO s1e06]
"Find some community around you that can give you sane tips and sane feedback." [OO s1e12] If a community treats beginners like they're stupid, "you need to find new communities." [OO s1e01, your reply to Henry]
Crowdsourced verification: you can't audit code, but people you trust can. [OO s1e02]
Local: Internet Freedom Foundation (digital-rights litigation; IFF has tracked the Proton block case) and FOSS United. Have people scan the Privacy 101 group QR now: it's the room's community after today. It's a Signal group, so it opens in Radar or Signal.`,
  // 9 Map divider
  `[0:12] Transition. Eleven steps, from privacy-first-steps, in the order you'd take them starting over today.`,
  // 10 Map
  `[0:12] Walk the three bands quickly. Solid rings are today's ballot (passwords, email, messaging); the dashed one is the warm-up (search).
"For most people, they don't need to just disappear. They need tools that slot into their life, then slowly expand the toolkit." [OO s1e08]
Starting with browser and password manager works because they barely change daily life. [OO s1e02]`,
  // 11 Browser
  `[0:13] "On desktop, it's your browser, because most of what you do is in a browser." [guest Litecoin Underground]
"Just install Brave, import everything, and live your life." [guest Expat Money] "Anything Chrome-compatible works on Brave." [guest Litecoin]
Brave settings to switch off: brave://settings/web3 (Wallet), brave://settings/leo-ai (Leo), Rewards. Hiding isn't the same as disabling.
Full uBlock Origin (MV2) stopped running in stable Chrome with Chrome 138 (Jul 2025), and Google pulled it from the Chrome Web Store on 31 Aug 2026. Brave hosts uBO itself at brave://settings/extensions/v2.
Firefox: since the Feb 2025 terms change, LibreWolf is the only Firefox you recommend. Advanced: Mullvad Browser on a computer; Tor Browser when you need anonymity, never for your bank. The Brave settings above are optional, only if asked; your beginner advice is "no extensions, no settings changes".`,
  // 12 Passwords
  `[0:15] Proton Pass is your current tool; your family used Bitwarden for years. [blog] Say "my family" on stage (your call, 2026-10-27). You switched Enpass → Bitwarden (2021) and Bitwarden → Proton Pass (2024), and it was fine. [OO s1e04; FTF 13] "Bitwarden and Proton Pass, pick either one." [FTF 13, 2025-09] Paraphrase: there aren't many privacy tools that make your life easier, and a password manager is one of them. [guest Litecoin Underground 2022]
Free tiers: Proton Pass has unlimited logins and devices, 10 aliases and 2 vaults; built-in 2FA codes now need Pass Plus (proton.me/pass/pricing, Oct 2026). Bitwarden is free and open source, but has no master-password recovery.
"It can start with something as simple as moving your passwords out of browser sync." [OO s1e03]
Track B on the ballot.`,
  // 13 Email
  `[0:16] "I'm a Proton Mail user, huge fan. Same vein as Brave and Signal: you can start without too much headache." [guest Expat Money]
"With Proton Mail you're not paying with your data. On the free option, you're piggybacking off the people who pay." [OO s1e05]
Aliases: "Normal practice is one email address for literally every account." [OO s2e01] Proton/SimpleLogin aliases fix that. Use them for accounts and newsletters, not for people you talk to.
Story: Trezor's newsletter list leaked and a convincing phish hit that alias. You never clicked, and you switched the alias off the next morning. Lesson: switch an alias off right after you sign up, and turn it back on when you need it. [FTF 22, 2025-12; X 2022-04-03] Don't imply you were compromised.
India: Karnataka HC ordered a Proton Mail block (29 Apr 2025); a Division Bench STAYED it 16 Mar 2026 "till further orders", and the stay still holds. On 14 Jul 2026 the bench asked the Centre to say on affidavit whether foreign firms can insist on MLAT; the case was listed for 8 Oct 2026 with no reported outcome (LiveLaw). Proton Mail still works and is on the India App Store (Oct 2026).`,
  // 14 Search
  `[0:18] "If everyone's using Google, guess who has a monopoly on the flow of information on the internet?" [OO Kagi ep]
Brave Search runs its own index. DuckDuckGo is mostly Bing results, without the profile. Kagi is $5–25/mo, USD only.
DuckDuckGo: you dropped it in 2022 (its down-ranking, then the Microsoft tracker deal) and still call it "reasonably good" but prefer Brave Search [FTF 20]. It's on the slide only because Safari doesn't offer Brave Search; iPhone users who want better can install the Brave app.
Kagi is what you use for everything now (you confirmed 2026-10-27), on the Ultimate tier [FTF 20]. Plans: free trial of 100 searches, then Starter $5 (300 searches), Professional $10, Ultimate $25 (kagi.com/pricing). Setup is more than a two-minute job: Android Chrome needs a few searches on kagi.com first, then Settings › Search engine; iPhone Safari needs the "Kagi for Safari" extension. That's why the room's warm-up uses a free engine. You were in the beta from Mar 2022, backed away in Nov 2024 because an account ties searches together [OO Kagi ep], and came back across your devices late 2024. Privacy Pass (Feb 2025) fixes the linking, but needs the Professional plan or higher. You're a paying customer only, no sponsorship (you confirmed 2026-10-23).
Why pay: ad-funded engines are "incentivized to serve you the results that they're paid to serve rather than the results that you actually need" [OO Kagi ep]; with Kagi "the actual benefit here is that it's paid. So the incentives are aligned." Even good free engines "just do their own ads." [FTF 20] Re-listen before quoting on stage.
Tee up the warm-up.`,
  // 15 Messaging
  `[0:19] "I have all my friends and family on Signal. I was able to get everyone off of text messages." [guest Expat Money]
"A messenger app with no people to message is just pointless." [guest Expat Money]
"Don't fight everyone who doesn't use the messaging app you prefer." [OO s1e08] WhatsApp is everywhere here, so add Radar, don't wage war.
"Public groups anyone can join? Encryption doesn't matter there." [guest Expat Money] One-to-one and family chats are what to move.
If asked about SimpleX: you loved the protocol but gave up on it about a year ago (groups, lost messages, notifications). Signal, Telegram for work, and email is all you keep up with now. [FTF 58, 2026-09]
Radar is the pick on stage (your call, 2026-10-29), with plain Signal as the alternative. Since Jul 2026 your own Signal account runs in Radar. DISCLOSE: it's built by the Cake Wallet team. Pitch: Signal's network and encryption, so Signal contacts come with you, plus self-custodial Bitcoin (Lightning) payments in the chat. Free, no ads, open source (AGPLv3). On the India App Store and Play Store; Android also via GitHub APK or Obtainium (radar.chat/install).
If asked: a phone number is still needed (Signal's network). Radar and Signal users chat with each other normally. Radar isn't affiliated with Signal Messenger LLC. The wallet seed backup is prompted once you hold a balance.
Family story (cleared 2026-10-19): you were the weirdo who pushed your own family onto Signal. What you'd tell them instead: model it.
India context (presenter only): DoT SIM-binding directions (Nov 2025) take effect 1 Jan 2027 and may force messaging apps to stay bound to the SIM. WhatsApp is testing it in an Android beta; Signal hasn't said anything publicly. MeitY sent WhatsApp, Signal and Telegram notices about username features on 2 Jul 2026; still no public outcome, and IFF and SFLC have asked MeitY to withdraw them. Telegram was blocked nationwide 16–22 Jun 2026 (s.69A, NEET re-exam), and the Delhi HC upheld the block. Apple pulled Bitchat from the India App Store on 3 Oct 2026. New SIMs need a biometric check from about late Nov 2026 (Telecom User Identification Rules, 21 Aug 2026).`,
  // 16 Money
  `[0:21] Disclose: you work at Cake. "Monero is the closest thing we have to digital cash." [OO s1e05] "I didn't understand how valuable cash was until I got into Monero." [OO s1e05]
"I pay in the most privacy-preserving way, whether it's a sandwich or a coffee." [OO Proton Wallet ep]
"It protects you and the people you transact with." [OO s1e09]
Tax question: "I can use Monero for my business, and at tax time reveal transaction details as needed." [OO s1e09] India taxes crypto gains at 30% plus 1% TDS; this isn't tax advice.
KYC: "The discount you're getting when you're going to that central exchange… is that you're giving them over all of your personally identifiable information." [OO s1e07]
For Bitcoiners: "Spend Monero, save Bitcoin." Honest caveat (you confirmed 2026-10-23): Monero isn't much use to people who can't spend it directly or convert it to fiat locally. Cold storage on a budget: Cupcake on an old offline phone.
Bitcoin's 2026 "good enough" bar: no-KYC coins, receive with Silent Payments, send with Payjoin (both in Cake). WazirX lost ~$230M in July 2024: custody risk in one line.
FIU-IND sent notices to 15 platforms (9 Sep 2026), including the swaps ChangeNOW, SimpleSwap, FixedFloat and Guardarian, plus WhiteBIT, Pionex, XT.com and WOO X (PMLA s.13 plus IT Act takedowns). Mention only if asked.
Expect "where do I buy Monero here?": in Jan 2026 the Economic Times reported that FIU told Indian exchanges to stop XMR/ZEC/DASH deposits, withdrawals and trading. There's no official FIU text and the current status is unclear. Point to P2P and to the Cake station; don't promise an on-ramp.
Point to the Cake onboarding station at Bitmela for hands-on help.`,
  // 17 VPN
  `[0:23] "VPNs were never about anonymity." [OO s1e12] "You're not removing trust, you're shifting trust" from your ISP, mobile carrier, hotel or café Wi-Fi to a provider you chose. [guest Expat Money, OO s1e12]
Obscura is your pick. It's Carl Dong's VPN (Opt Out, Mar 2025) with a two-party relay: Obscura is the first hop and knows who paid, Mullvad is the exit hop and sees the traffic, and neither sees both. "We literally can't see anything about your internet traffic." (Carl, OO ep). $8/mo, 5 connections, account number with no email, card/Lightning/Monero. iOS, macOS, Android, Windows, and Linux since Sep 2026, when it also went open source under GPLv3 (obscura.com/pricing).
You're not paid by Obscura (confirmed 2026-10-23). Why not Proton VPN when you use Proton Mail: "I keep my VPN at a different company from my email." [X 2024-04-10]
Mullvad is €5/mo flat, no email, cash or XMR. Proton VPN Free has no data cap but random servers.
India: CERT-In's 2022 directions require VPN providers to keep user identity and IP logs for 5 years. Proton pulled its India servers; "India" now routes via Singapore. Mullvad has no India servers at all. VPN apps have been pulled from Indian stores on MHA/I4C orders (2024–25).`,
  // 18 OS
  `[0:24] "I was a huge Google fanboy, testing every Android version before release." [guest Litecoin]
GrapheneOS: Pixel 8 or newer (7 years of updates) is what it strongly recommends. The Pixel 6/6 Pro reached end of life this month (Oct 2026); the 6a lasts until Jul 2027 and the 7 until Oct 2027 (grapheneos.org/faq). Motorola announced a GrapheneOS partnership at MWC (Mar 2026), with phones expected around 2027. The Pixel 10a is ₹55,999 on the Google Store India after a ₹6,000 price rise in early Oct 2026 (it launched at ₹49,999, and Flipkart sales go lower), so be honest that this is a later step for most of the room.
"I definitely used to be a hardcore anti-Apple person… primarily it's an iPhone now and a Mac." ADP is the only reason you're OK with that; everyone on an iPhone should turn it on. [FTF 28, 2026-02] You still keep a GrapheneOS phone. Pop!_OS and Zorin are recommendations; don't imply you run Linux daily now.
Linux: "The one I've settled on and recommend to a lot of people is Pop!_OS." [OO s1e10] Zorin OS is the easiest-looking switch.
Free tip for budget phones: "The cheaper the hardware, the more preinstalled crap." Uninstall what you don't use. [OO s1e01]`,
  // 19 Warm-up
  `[0:25] Everyone, 2 minutes. Walk the room. Chrome's built-in list for India is Google, Brave, Bing, Yahoo India, DuckDuckGo, so Brave shows up without visiting it (Chromium regional_settings.json). On an older Chrome that doesn't list it, run one search on search.brave.com, then reopen the setting.
iOS 18.2 through 27: Settings › Search › Search Engine. iOS 17 and earlier: Settings › Safari › Search Engine. Brave Search isn't offered in Safari, so DuckDuckGo is the easy pick there.
Brave only documents Brave Search as its default in the US, Canada, UK, France and Germany, so Brave users should check, not assume.
Say while they tap: "I use Kagi for everything. It's paid, so it's not today's warm-up, but you get 100 free searches to try at home."
Celebrate: "That's step 06. You're on the map."`,
  // 20 Vote
  `[0:27] Show of hands for A, B or C. Count quickly, majority wins. In a tie, pick C: Radar is the most social and the fastest win.
Jump straight to the winning track: A is page 21, B is page 28, C is page 34. Tell early finishers the other tracks' QR codes are on their intro slides.`,
  // 21 Track A intro
  `TRACK A, ~15 min. Ask people to put pen and paper out for the recovery phrase.
Big caveat: many signups from one IP may trigger extra verification, so mobile data is the fix.
Test beforehand: open proton.me on venue Wi-Fi AND on Jio/Airtel.`,
  // 22 A1
  `No phone number needed: CAPTCHA or an email code is enough. Free domains are @proton.me or @protonmail.com; @pm.me is paid-only now.
Username: suggest something not tied to their legal name if they want separation.`,
  // 23 A2
  `Human verification options are CAPTCHA, an email code, or SMS. Proton keeps only a hash of the verification email or number.
The RECOVERY email is different: it's stored as-is. In 2024 Proton gave a user's recovery email (an iCloud address) to Swiss authorities in a Spanish terrorism case, and Apple's records then identified a Catalan activist (TechCrunch, 8 May 2024). Proton's line: privacy by default, not anonymity by default. If someone needs separation, use the recovery phrase and skip the recovery email, or use an alias.
Tor or many accounts from one IP may get only email/SMS options. If it's stuck, switch networks or try the app.`,
  // 24 A3
  `The recovery phrase is 12 words. It resets the password AND decrypts old mail.
A recovery email or SMS only resets the password, so old mail stays unreadable. (A recovery file or a device data backup can also recover data; the phrase is the one everyone can do on paper today.)
Don't store the phrase in Proton Drive or Pass.`,
  // 25 A4
  `Free storage starts at 500 MB and becomes 1 GB once the get-started checklist is done within 18 days. Do it now.
"Get more storage" is documented in the WEB inbox's left sidebar only; it may not be in the mobile app, so send phone users to mail.proton.me in their browser. The three tasks: "Discover privacy features", "Review import options", "Download the app" (proton.me/support/get-started-mail).
Free plan: 1 address, 150 sends/day, 3 folders + 3 labels, 10 hide-my-email aliases. The desktop app is a trial only on Free; use the web app plus the mobile app.`,
  // 26 A5
  `Aliases come from Proton Pass (free: 10). Free can reply from an alias.
If "+ › Alias" isn't there in someone's app: create a new login, tap Username, then "Hide my email" (that's the route Proton documents for Android and iOS).
Your story: 653 aliases (your count, 2026-10-27; the guide still says "over 200"). And the Trezor leak: a phish hit an alias you'd left on (you didn't click), so switch aliases off right after signing up.
"I treat aliases as a way to manage email from accounts I don't directly communicate with." [OO s2e01]`,
  // 27 A6
  `The slide is about moving accounts over as you log in; the Gmail import is a mention only, if asked.
Easy Switch is web only: account.proton.me › Settings › All settings › Import via Easy Switch › Google › Connect to Gmail. No mobile-app path, so phone users do it in a browser. "Gmail connection": Free can connect 1 Gmail account. The import can use up to 80% of storage, so maybe import only recent mail.
Inactive free accounts are deleted after 12 months with no sign-in.
Wrap: "That's your 0 → 1." Point early finishers to Track B or C.`,
  // 28 Track B intro
  `TRACK B, ~15 min. Proton Pass is easiest if someone just did Track A; Bitwarden is open source.
Warn now: the password export happens AT HOME, not in this room.`,
  // 29 B1
  `Bitwarden verifies email BEFORE you set the master password, and needs 12+ characters. There is no recovery.
Proton Pass can use an existing Proton account, or any email.
Passphrase: 4–6 random words. Never reuse a password from anywhere else.`,
  // 30 B2
  `Android system paths vary by brand (Android 14+ calls it "Passwords, passkeys & accounts › Preferred service"; Samsung, Xiaomi, vivo and Oppo all differ), so go through the app: Bitwarden Settings › Autofill › Autofill services; Proton Pass asks "Autofill with Proton Pass" at first launch, or Profile › Autofill.
iPhone (iOS 18 through 27): Settings › General › AutoFill & Passwords, turn on AutoFill Passwords and Passkeys, pick the manager under "AutoFill From".
Verify by logging out of one site and logging back in with autofill.`,
  // 31 B3
  `Authenticators: Proton Authenticator or Ente Auth. Keep 2FA codes separate from the password manager, and never use SMS 2FA. [FTF 13, 2025-09]
Neither app turns on 2FA in-app; it's on the web. Bitwarden web vault: Settings › Security › Two-step login › Authenticator app › Manage. Proton: account.proton.me › Settings › All settings › Account and password › Two-factor authentication › Authenticator app.
On a single phone you can't scan your own screen: use "enter key manually" / copy the setup key into the authenticator.
Bitwarden detail: without 2FA it emails a code on every new device (since Mar 2025), so 2FA also removes that friction.`,
  // 32 B4
  `Google export, computer: Chrome ⋮ › Passwords and autofill › Google Password Manager › Settings › Export. Android: ⋮ › Settings › Autofill and passwords › Google Password Manager › Settings › Export passwords & passkeys › Download file (needs a screen lock). The CSV holds passwords only; passkeys move app to app.
Imports: Proton Pass extension ☰ › Settings › Import (iOS: Profile › Import to Proton Pass › Import from Chrome). Bitwarden web Tools › Import; on Android 14+ / iOS 26+ it can also import straight from another app (Settings › Vault › Import items).
Import once only: Bitwarden says it doesn't check for duplicates (Proton Pass undocumented). Delete the CSV and empty the trash.`,
  // 33 B5
  `Order: email first (it resets everything else), then banking/UPI, then Google/Apple ID and the mobile carrier account.
Line: reused passwords are how one leak becomes ten.`,
  // 34 Track C intro
  `TRACK C, ~12 min. New people install Radar (QR goes to radar.chat/install, which picks the right store). Prefer plain Signal? Same steps, same network.
Ask who already has Signal: they keep it TODAY and jump to step 3 (username). Don't move accounts in the room: registering the same number in Radar takes the account off their Signal app.
Moving to Radar, at home: in Signal, Settings › Backups › Set up › Enable Backups; save the 64-character recovery key (password manager or paper); free plan = all text + last 45 days of media; let one backup finish. Then install Radar, and at "Restore or transfer" pick "From Signal Backups" and enter the key. View-once messages and anything due to disappear within 24 hours aren't backed up. (support.signal.org "Signal Secure Backups", updated 14 Oct 2026.) Linked-device mode exists but is for power users; you recommend moving the account.
Pair new users with existing users for step 6.`,
  // 35 C1
  `If the SMS doesn't come, tap "Call me" after the countdown. TRAI DND doesn't block OTPs, so skip that. Signal's own checklist: turn off any VPN; iPhone: check Messages › Unknown Senders and turn off Silence Unknown Callers; check you haven't opted out of transactional texts; after too many attempts, wait before retrying. No 2026 reports of codes failing on Jio or Airtel.
Radar uses Signal's registration, so the same SMS / "Call me" flow and the same troubleshooting apply (checked against Radar's Android source, not on a device).
Signal's Android beta (8.28+) can register without a phone number for a $2.99 one-time fee. Not in stable, so it doesn't change today's flow.
Never share the code. Account-takeover scams ask for exactly this.`,
  // 36 C2
  `PIN + Registration Lock: Settings › Account. If they forget the PIN with the lock on, they wait up to 7 days. Nobody can reset it, not Radar and not Signal.
Profile name can be a first name or nickname.`,
  // 37 C3
  `Path: Android, tap the profile icon top left (opens Settings); iPhone, profile icon › Settings. Then tap your name › tap @.
Usernames: 3–32 characters, a–z, 0–9 and _, plus at least 2 digits at the end (chai.42 works). Shareable as a link or QR. Changing it kills the old username, link and QR. Since Feb 2024 (support.signal.org, updated 30 Jul 2026).
Presenter context: MeitY sent username notices to WhatsApp (1 Jul) and to Signal and Telegram (2 Jul 2026); still no public outcome. Don't dramatise it.`,
  // 38 C4
  `"Who can see my number" defaults to Nobody. "Who can find me by number" defaults to Everybody; Nobody needs see=Nobody first.
Set these before blocking anyone. For family onboarding, leaving "find me" on is fine.`,
  // 39 C5
  `Settings › Privacy › Default timer for new chats. It applies to new chats only; existing chats are set individually.
Line: less history stored means less to lose.`,
  // 40 C6
  `Join the Privacy 101 group first (QR on screen; it opens in Radar or Signal), then swap usernames with neighbours. Fun moment. Then: "That's step 07 on the map, your 0 → 1."
"I don't think people realize how easy it is to use Signal calls to replace phone calls." [OO s1e09] Try a quick call too.`,
  // 41 Done
  `[0:47] Celebrate. "The most important thing is that people take that first step, and then figure out if there's a further step." [guest Expat Money]`,
  // 42 Next 30
  `[0:48] Homework from every Opt Out outro: "Share it with one friend or family member this week." [OO outro]
The slides stay online for the other tracks. Week 4: Cake onboarding station or docs.cakewallet.com; start with small amounts.`,
  // 43 Remember
  `[0:50] 1: "It's not something that in a week you're just going to be totally private." [OO s1e12]
2: Burnout leads to cynicism; resist it. [OO s1e12]
3: "Modeling can prompt people to want to learn more. Conversation is often not how we change minds." [OO s1e12] And: "Familiar conversations with people who trust you pull them down the rabbit hole, not some privacy advocate." [OO s1e01]`,
  // 44 Resources
  `[0:51] Leave this up during Q&A so people can scan. Privacy first steps, Opt Out, the Privacy 101 group (Radar or Signal), Cake Wallet.`,
  // 45 Close
  `[0:52] Close on your Opt Out sign-off: "Now get out there and opt out this week." [every Opt Out outro]
If you want the identity line: "I very intentionally call myself a freedom tech maximalist, not a Bitcoin maximalist… not a Monero maximalist." [EthCC 2026-03; re-listen before quoting]
"Get comfortable with these tools before they become a necessity." [OO s1e09] Then Q&A.
Q&A prep: the tax question (Monero view keys / tx keys let you disclose when needed); "is a VPN illegal in India?" (no; the CERT-In rules bind providers, not users); "WhatsApp is encrypted, isn't it?" (the content is, but Meta sees the metadata, and SIM-binding is coming).`,
];

/* ═════════════════════════ Export ═════════════════════════ */

export const meta: SlideMeta = {
  title: 'Privacy 101 — From 0 to 1',
  createdAt: '2026-10-19T09:10:21.939Z',
};

export default [
  Cover,
  Hello,
  Plan,
  Icebreaker,
  Choice,
  AlreadyOut,
  Journey,
  Community,
  MapDivider,
  TheMap,
  Browser,
  Passwords,
  Email,
  Search,
  Messaging,
  Money,
  Vpn,
  Os,
  WarmUp,
  Vote,
  TrackA,
  A1,
  A2,
  A3,
  A4,
  A5,
  A6,
  TrackB,
  B1,
  B2,
  B3,
  B4,
  B5,
  TrackC,
  C1,
  C2,
  C3,
  C4,
  C5,
  C6,
  Done,
  Next30,
  Remember,
  Resources,
  Close,
] satisfies Page[];
