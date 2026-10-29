// AI That Never Leaves Your Laptop — why local AI matters. Bitmela (Jaipur), 30–31 Oct 2026. 15–20 minute talk.
// Re-cut of the GFTS 2026 deck (slides/local-ai-matters) for an Indian audience: three open-weight models as
// small / mid / big tiers, each tied to the hardware that runs it, with India prices in rupees.
// Visual system borrowed from the Privacy 101 workshop deck (same event): Cake Wallet media kit v1.2 (Icing / Fondant /
// Cake blue, Wix Madefor Text + IBM Plex Mono), Opt Out's shatter-into-network motif in Cake sprinkles, and the
// Bitmela poster band on cover + close only. Sources for every figure live in `notes`.
import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { Step, Steps, useIsActivePage, useSlidePageNumber } from '@open-slide/core';

import cakeLogo from './assets/brand/cake-horizontal-fondant.svg';
import cakeLogoMono from './assets/brand/cake-horizontal-mono-fondant.svg';
import sethPhoto from './assets/people/seth-ai.png';

/* ───────────────────────── Fonts (Wix Madefor Text + IBM Plex Mono, as in the Cake Wallet app) ───────────────────────── */

const WIX_URL = new URL('./assets/fonts/WixMadeforText.ttf', import.meta.url).href;
const WIX_ITALIC_URL = new URL('./assets/fonts/WixMadeforText-Italic.ttf', import.meta.url).href;
const PLEX_URL = new URL('./assets/fonts/IBMPlexMono-Regular.ttf', import.meta.url).href;
const PLEX_MEDIUM_URL = new URL('./assets/fonts/IBMPlexMono-Medium.ttf', import.meta.url).href;
const FONT_STYLE_ID = 'osd-webfont-local-ai-bitmela';
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
  typeScale: { hero: 168, body: 36 },
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
const ICING_MUTED = '#B7B1C0'; // secondary text on Fondant
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

// House transition — DISSOLVE (same as the Privacy 101 deck): outgoing holds, incoming fades in.
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
export const transition: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: { duration: 240, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
};

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* ───────────────────────── Data (every figure is sourced in `notes`) ───────────────────────── */

type TierKey = 'small' | 'mid' | 'big';
const TIER_COLOR: Record<TierKey, string> = { small: BLUE, mid: YELLOW, big: ORANGE };
const TIER_NAME: Record<TierKey, string> = { small: 'Small', mid: 'Medium', big: 'Large' };

// Open-weight releases on the timeline, oldest → newest. `ours` rings the three models this talk is built on.
const RELEASES: { date: string; model: string; ours?: boolean }[] = [
  { date: 'JUL 27', model: 'Kimi K3' },
  { date: 'JUL 31', model: 'DeepSeek V4 Flash' },
  { date: 'AUG 14', model: 'Qwen 3.8 27B', ours: true },
  { date: 'AUG 26', model: 'GLM 5.3 Flash' },
  { date: 'AUG 26', model: 'Qwen 3.8 Flash Next', ours: true },
  { date: 'AUG 28', model: 'GLM 5.3' },
  { date: 'SEP 10', model: 'DeepSeek V4.1 Flash' },
  { date: 'SEP 21', model: 'MiMo V2.6 Flash' },
  { date: 'OCT 17', model: 'DeepSeek V4.1 Flash 1017', ours: true },
];
const RELEASE_COUNT = 'A dozen-plus frontier-class open releases in three months.';

const MODELS: { tier: TierKey; name: string; shape: string; memory: string; fits: string; good: string; licence: string }[] = [
  {
    tier: 'small',
    name: 'Qwen 3.8-27B',
    shape: '27B dense',
    memory: '≈ 17 GB at 4-bit',
    fits: '24 GB GPU · 48 GB Mac',
    good: 'Coding, chat and vision. Where everyone should start.',
    licence: 'Apache-2.0',
  },
  {
    tier: 'mid',
    name: 'Qwen 3.8 Flash Next',
    shape: '125B MoE · 6B active',
    memory: '≈ 100 GB at 4-bit',
    fits: 'one 128 GB box or Mac',
    good: 'A fast all-rounder for agents and everyday work.',
    licence: 'Qwen Community',
  },
  {
    tier: 'big',
    name: 'DeepSeek V4.1 Flash 1017',
    shape: '552B MoE · 16B active',
    memory: '≈ 200 GB at 3-bit',
    fits: 'two 128 GB boxes',
    good: 'Frontier-class agents, coding and security work.',
    licence: 'MIT',
  },
];

// Hardware ladder, cheapest first. `tps` is single-user decode speed (prose where the source splits it);
// `inr` is the India price, rounded. Full sourcing is in the notes for each page.
const MACHINES: {
  tier: TierKey;
  machine: string;
  model: string;
  tps: number;
  inr: string;
  inrNote: string;
  note: string;
  source: string;
}[] = [
  {
    tier: 'small',
    machine: 'RTX 3090 · 24 GB, used',
    model: 'Qwen 3.8-27B',
    tps: 122,
    inr: '₹1 lakh',
    inrNote: 'used card · was ₹50–60k a year ago',
    note: 'A six-year-old gaming card, and still the community’s favourite way in. If you already game on a PC, start here.',
    source: 'github.com/syv-ai/HyperQwen · 121.8 tok/s, 1 user, default sampling, speculative decoding, 250 W · used price: TechEnclave, Oct 2026',
  },
  {
    tier: 'small',
    machine: 'MacBook Pro · M5 Pro, 48 GB',
    model: 'Qwen 3.8-27B',
    tps: 74,
    inr: '₹3.7 lakh',
    inrNote: 'new · Apple India MRP, incl. GST',
    note: 'A laptop you might buy anyway, with the memory bumped. No GPU, no server, no cloud.',
    source: 'hf.co/incoai/Qwen3.8-27B-Splash · 74 tok/s, short prompt, speculative drafts (2026-09-18) · apple.com/in ₹3,71,900',
  },
  {
    tier: 'mid',
    machine: 'DGX Spark · 128 GB',
    model: 'Qwen 3.8 Flash Next',
    tps: 55,
    inr: '₹7.5 lakh',
    inrNote: 'new · street price, Oct 2026',
    note: 'One quiet box the size of a hardback. Slower per answer, but built to serve a whole household at once.',
    source: 'github.com/MiaAI-Lab/Qwen3.8-Flash-Next-Single-DGX-Spark-TensorFold · 55.6 tok/s prose, 1 user (2026-10-27) · primeabgb.com ₹7,47,999',
  },
  {
    tier: 'mid',
    machine: 'Mac Studio · M5 Ultra, 256 GB',
    model: 'Qwen 3.8 Flash Next',
    tps: 118,
    inr: '₹12.7 lakh',
    inrNote: 'new · Apple India MRP, incl. GST',
    note: 'The box on my desk. Twice the Spark’s speed on the same model, because its memory is faster.',
    source: 'github.com/sethforprivacy/Qwen3.8-Flash-Next-M5-Ultra-oMLX · 118 tok/s prose, 6-bit (2026-09-28) · apple.com/in ₹12,65,900 (80-core GPU)',
  },
  {
    tier: 'big',
    machine: '2× DGX Spark · 256 GB',
    model: 'DeepSeek V4.1 Flash 1017',
    tps: 75,
    inr: '₹15 lakh',
    inrNote: 'two boxes · street price, Oct 2026',
    note: 'Two boxes, one cable between them. Cake runs this model on four of them for its security scanning, on-prem.',
    source: 'github.com/MiaAI-Lab/DeepSeek-v4.1-Flash-1017-2x-DGX-Sparks · 74.9 tok/s prose, greedy, 2.9-bit (2026-10-19) · 2 × ₹7,47,999',
  },
];

/* ───────────────────────── Type helpers ───────────────────────── */

// The one flavor word per title: Wix Madefor Text italic on a marker stroke (blue on Icing, yellow on blue).
const Em = ({ children, on = 'icing' }: { children: ReactNode; on?: 'icing' | 'blue' }) => (
  <span
    style={{
      fontStyle: 'italic',
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
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

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

/* ───────────────────────── Brand shapes ───────────────────────── */

// Sprinkles from the media kit (sprinkle-01…04), with their native viewBoxes.
const SPRINKLES = {
  a: { vw: 380, vh: 427, d: 'M316.69 13.4541C311.517 2.14234 298.174 -2.86126 286.838 2.25959L13.6877 125.655C2.27771 130.81 -2.76591 144.259 2.44129 155.645L65.9059 294.416C67.0682 296.958 68.692 299.262 70.6948 301.211C111.388 340.817 152.096 380.409 192.793 420.011C203.265 430.202 220.511 427.924 227.977 415.364L375.95 166.438C379.739 160.064 380.16 152.237 377.076 145.494L316.69 13.4541Z' },
  b: { vw: 446, vh: 359, d: 'M277.925 0C277.927 0 277.927 0.00277864 277.925 0.00320605L17.7148 58.9152C4.90804 61.8147 -2.73864 74.9823 1.0904 87.5425C17.1852 140.337 33.2799 193.132 49.3747 245.927C50.98 251.192 54.4523 255.691 59.1397 258.578L215.811 355.063C225.144 360.811 237.257 359.031 244.542 350.842L440.091 131.032C449.433 120.532 447.025 104.143 435.058 96.7733L277.924 0.00300767C277.923 0.00214964 277.923 0 277.925 0V0Z' },
  c: { vw: 368, vh: 437, d: 'M273.433 123.086C273.433 123.088 273.43 123.09 273.428 123.088L119.227 4.86356C106.698 -4.74243 88.4307 1.13446 83.8532 16.244L1.53495 287.959C-1.19342 296.965 1.945 306.719 9.41312 312.444L165.617 432.187C172.624 437.558 182.116 438.357 189.922 434.232C245.228 405.005 300.534 375.779 355.841 346.553C366.549 340.894 370.892 327.798 365.686 316.862L273.439 123.084C273.437 123.081 273.433 123.082 273.433 123.086V123.086Z' },
  d: { vw: 406, vh: 348, d: 'M178.353 47.994C178.343 47.994 178.334 47.9965 178.326 48.0013L11.2129 149.235C-0.523711 156.344 -3.2658 172.189 5.39892 182.829C47.7301 234.813 90.0628 286.795 132.408 338.765C139.526 347.501 151.993 349.656 161.631 343.817L327.074 243.596C331.649 240.825 335.093 236.519 336.792 231.447L404.125 30.4347C409.747 13.6533 394.768 -2.78355 377.538 1.25923L178.364 47.9926C178.361 47.9935 178.357 47.994 178.353 47.994V47.994Z' },
};

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
// Here it reads as one model's weights spreading out to many machines.
const ShatterNet = ({ style, scale = 1 }: { style?: CSSProperties; scale?: number }) => (
  <svg viewBox="0 0 960 1080" width={960 * scale} height={1080 * scale} style={{ position: 'absolute', ...style }} aria-hidden>
    <Edge x1={330} y1={470} x2={520} y2={400} />
    <Edge x1={520} y1={400} x2={620} y2={210} />
    <Edge x1={520} y1={400} x2={690} y2={330} />
    <Edge x1={330} y1={470} x2={600} y2={520} />
    <Edge x1={600} y1={520} x2={690} y2={330} />
    <Edge x1={600} y1={520} x2={760} y2={570} />
    <Edge x1={470} y1={630} x2={760} y2={570} />
    <Edge x1={470} y1={630} x2={360} y2={730} />
    <Edge x1={690} y1={330} x2={850} y2={420} />
    <Edge x1={760} y1={570} x2={850} y2={420} />
    <Edge x1={760} y1={570} x2={880} y2={710} />
    <Edge x1={700} y1={790} x2={880} y2={710} />
    <Edge x1={360} y1={730} x2={700} y2={790} />
    <Edge x1={850} y1={420} x2={880} y2={710} />
    <Edge x1={180} y1={620} x2={470} y2={630} />
    <Edge x1={620} y1={210} x2={850} y2={420} />
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
        color: onBlue ? FONDANT : MUTED,
      }}
    >
      <img src={onBlue ? cakeLogoMono : cakeLogo} alt="Cake Wallet" style={{ height: 34, display: 'block' }} />
      <span>AI That Never Leaves Your Laptop · Bitmela 2026 · @sethforprivacy</span>
      <span style={{ fontFamily: MONO, fontSize: 26 }}>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// Small print above the footer: where a figure came from.
const Source = ({ children }: { children: ReactNode }) => (
  <div style={{ position: 'absolute', left: PAD_X, right: PAD_X, bottom: 100, fontFamily: MONO, fontSize: 19, color: MUTED }}>{children}</div>
);

const Card = ({ tag, tagColor = BLUE, name, children }: { tag: string; tagColor?: string; name: ReactNode; children: ReactNode }) => (
  <div style={{ flex: 1, background: WHITE, borderRadius: 'var(--osd-radius)', padding: '38px 40px 40px', display: 'flex', flexDirection: 'column', gap: 18 }}>
    <span style={{ alignSelf: 'flex-start', background: tagColor, borderRadius: 999, padding: '6px 18px', fontFamily: MONO, fontSize: 24 }}>{tag}</span>
    <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{name}</div>
    <div style={{ fontSize: 31, lineHeight: 1.42, color: MUTED }}>{children}</div>
  </div>
);

const CardRow = ({ children, top = 330 }: { children: ReactNode; top?: number }) => (
  <div style={{ position: 'absolute', left: PAD_X, right: PAD_X, top, display: 'flex', gap: 36 }}>{children}</div>
);

// The bottom line on a content page.
const Takeaway = ({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'yellow' | 'plain' }) => (
  <div
    style={{
      position: 'absolute',
      left: PAD_X,
      right: PAD_X,
      top: 838,
      minHeight: 96,
      boxSizing: 'border-box',
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

/* ───────────────────────── Motion ───────────────────────── */

const Cursor = ({ color = BLUE }: { color?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const animate = useIsActivePage();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !animate) return;
    const anim = el.animate(
      [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: 0.5 },
        { opacity: 0, offset: 0.5 },
        { opacity: 0, offset: 1 },
      ],
      { duration: 1100, iterations: Infinity },
    );
    return () => anim.cancel();
  }, [animate]);
  return (
    <span ref={ref} style={{ color }}>
      ▮
    </span>
  );
};

const CountUp = ({ value, decimals = 0, style }: { value: number; decimals?: number; style?: CSSProperties }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const animate = useIsActivePage();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!animate || reduced()) {
      el.textContent = value.toFixed(decimals);
      return;
    }
    const dur = 950;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = (value * e).toFixed(decimals);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, decimals, animate]);
  return (
    <span ref={ref} style={style}>
      0
    </span>
  );
};

const SAMPLE =
  'no queue. no quota meter. no midnight reset. just weights, silence, and a model that answers to you. it reads the repo, drafts the patch, reviews its own diff, and asks for nothing between the first token and the last. past midnight it is still warm, still consistent, still yours. no usage email, no terms of service in the loop. every token local, every token yours.';

// Streams SAMPLE at `tps` characters per second, so the room can feel each tier's speed.
const Stream = ({ tps, height = 300 }: { tps: number; height?: number }) => {
  const out = useRef<HTMLSpanElement>(null);
  const animate = useIsActivePage();
  useEffect(() => {
    const el = out.current;
    if (!el) return;
    const text = SAMPLE;
    if (!animate || reduced()) {
      el.textContent = text;
      return;
    }
    // Derive the visible character count from elapsed time, never from accumulated per-step delays:
    // setTimeout(1000 / tps) fires late and the lateness compounds, so a chain drifts to ~50 tok/s whatever
    // the tier claims. Past 60 tok/s several characters land per frame, so it's the average rate that holds.
    const total = text.length;
    const typeMs = (total / tps) * 1000;
    const cycleMs = typeMs + 2800;
    let shown = -1;
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      const phase = (now - start) % cycleMs;
      const next = phase >= typeMs ? total : Math.min(total, Math.floor((phase * tps) / 1000));
      if (next !== shown) {
        shown = next;
        el.textContent = text.slice(0, next);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [tps, animate]);
  return (
    <div style={{ background: FONDANT, color: ICING, borderRadius: 'var(--osd-radius)', padding: '26px 34px', boxSizing: 'border-box', height }}>
      <div style={{ fontFamily: MONO, fontSize: 20, color: ICING_MUTED, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: BLUE, display: 'inline-block' }} />
        live · streamed at this machine’s measured speed
      </div>
      <div style={{ fontFamily: MONO, fontSize: 24, lineHeight: 1.5 }}>
        <span ref={out} style={{ whiteSpace: 'pre-wrap' }} />
        <Cursor />
      </div>
    </div>
  );
};

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
    <div style={{ position: 'absolute', left: PAD_X, top: 270, width: 1100, display: 'flex', flexDirection: 'column', gap: 44 }}>
      <h1 style={{ ...HEAD, fontSize: 136, lineHeight: 1.02 }}>
        AI That Never
        <br />
        Leaves Your <Em>Laptop</Em>
      </h1>
      <p style={{ width: 940, margin: 0, fontSize: 40, lineHeight: 1.45, color: MUTED }}>
        Why local AI matters, and which machine to start with.
      </p>
    </div>
    <div style={{ position: 'absolute', left: PAD_X, bottom: 96, display: 'flex', alignItems: 'center', gap: 32 }}>
      <img src={cakeLogo} alt="Cake Wallet" style={{ height: 52, display: 'block' }} />
      <span style={{ width: 2, height: 44, background: RULE }} />
      <span style={{ fontSize: 30, fontWeight: 600 }}>Seth For Privacy</span>
      <span style={{ fontFamily: MONO, fontSize: 24, color: MUTED }}>COO, Cake Wallet</span>
    </div>
  </div>
);

/* ── Why ──────────────────────────────────────────────── */

const Renting: Page = () => (
  <div style={root}>
    <Eyebrow>The problem</Eyebrow>
    <Title>
      Right now, you <Em>rent</Em> your intelligence.
    </Title>
    <CardRow top={320}>
      <Card tag="Privacy" name="Your prompts leave">
        A chat log is a map of how you think, stored on someone else’s servers, in someone else’s country.
      </Card>
      <Card tag="Cost" name="The free year is over">
        The free ChatGPT Go and Perplexity Pro offers closed in January. Plans are subsidised now; they won’t stay that way.
      </Card>
      <Card tag="Access" name="Someone else decides">
        Limits change by email: Claude Code’s weekly cap fell 17% in September. Which model, which user: their call.
      </Card>
    </CardRow>
    <Takeaway tone="plain">
      <span style={{ fontFamily: MONO, fontWeight: 400 }}>hosted</span>
      “We don’t log” is a promise. It isn’t a guarantee.
    </Takeaway>
    <Footer />
  </div>
);

const PointRow = ({ n, title, children }: { n: string; title: ReactNode; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', borderTop: `2px solid ${RULE}`, paddingTop: 30 }}>
    <Badge n={n} bg={BLUE} fg={FONDANT} size={72} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</span>
      <span style={{ fontSize: 33, lineHeight: 1.42, color: MUTED }}>{children}</span>
    </div>
  </div>
);

const Thesis: Page = () => (
  <div style={root}>
    <Eyebrow>The point</Eyebrow>
    <Title>
      Self-custody, for your <Em>intelligence</Em>.
    </Title>
    <div style={{ position: 'absolute', left: PAD_X, top: 320, width: 1040, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <PointRow n="1" title="Private.">
        The prompt, the files, the answer: none of it leaves your room.
      </PointRow>
      <PointRow n="2" title="Unlimited.">
        No meter, no weekly cap, no reset. Leave it working all night.
      </PointRow>
      <PointRow n="3" title="Yours.">
        Nobody can switch it off, swap the model or change the rules.
      </PointRow>
    </div>
    <div style={{ position: 'absolute', left: 1260, right: PAD_X, top: 320, background: FONDANT, color: ICING, borderRadius: 'var(--osd-radius)', padding: '40px 44px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: ICING_MUTED }}>Same lesson, new asset</span>
      <span style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.3, color: ICING_MUTED }}>Not your keys, not your coins.</span>
      <span style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
        Not your weights, not your <span style={{ color: BLUE, fontStyle: 'italic' }}>intelligence</span>.
      </span>
    </div>
    <Footer />
  </div>
);

/* ── The pace ─────────────────────────────────────────── */

const Divider = ({ kicker, children, note }: { kicker: string; children: ReactNode; note: ReactNode }) => (
  <div style={{ ...root, background: GRADIENT_BG }}>
    <ShatterNet style={{ right: -40, top: 0 }} />
    <Eyebrow top={300}>{kicker}</Eyebrow>
    {/* Headline and note flow together, so a two-line headline pushes the note down instead of under it. */}
    <div style={{ position: 'absolute', left: PAD_X, top: 360, width: 1000, display: 'flex', flexDirection: 'column', gap: 56 }}>
      <h1 style={{ ...HEAD, fontSize: 'var(--osd-size-hero)', lineHeight: 1 }}>{children}</h1>
      <p style={{ width: 860, margin: 0, fontSize: 42, lineHeight: 1.45, color: MUTED }}>{note}</p>
    </div>
    <Footer />
  </div>
);

const DividerPace: Page = () => (
  <Divider kicker="Part one" note="The open models caught up. Nobody had to ask permission.">
    The <Em>pace</Em>.
  </Divider>
);

// One release on the timeline: fades in left to right, alternating above and below the rail.
const TNode = ({ i, x, date, model, ours }: { i: number; x: number; date: string; model: string; ours?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const animate = useIsActivePage();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!animate || reduced()) {
      el.style.opacity = '1';
      return;
    }
    const anim = el.animate(
      [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 420, delay: 200 + i * 260, easing: EASE_OUT, fill: 'both' },
    );
    return () => anim.cancel();
  }, [animate, i]);
  const up = i % 2 === 0;
  return (
    <div ref={ref} style={{ position: 'absolute', left: x, top: 0, height: '100%', width: 0 }}>
      {ours && <div style={{ position: 'absolute', left: -32, top: 'calc(50% - 32px)', width: 64, height: 64, borderRadius: '50%', border: `4px solid ${FONDANT}`, boxSizing: 'border-box' }} />}
      <div style={{ position: 'absolute', left: -20, top: 'calc(50% - 20px)', width: 40, height: 40, borderRadius: '50%', background: ours ? BLUE : LAVENDER }} />
      <div style={{ position: 'absolute', left: -110, width: 220, textAlign: 'center', [up ? 'bottom' : 'top']: 'calc(50% + 52px)' }}>
        <div style={{ fontFamily: MONO, fontSize: 24, color: MUTED, marginBottom: 8 }}>{date}</div>
        <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{model}</div>
      </div>
    </div>
  );
};

const Timeline: Page = () => {
  const x0 = 130;
  const step = (1680 - 2 * x0) / (RELEASES.length - 1);
  return (
    <div style={root}>
      <Eyebrow>Open-weight releases · July → October 2026</Eyebrow>
      <Title>
        2026, the year of local <Em>AI</Em>.
      </Title>
      <div style={{ position: 'absolute', left: PAD_X, top: 300, width: 1680, height: 480 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 4, marginTop: -2, background: EDGE, borderRadius: 2 }} />
        {RELEASES.map((r, i) => (
          <TNode key={r.model} i={i} x={x0 + i * step} {...r} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: PAD_X, top: 820, display: 'flex', gap: 48, fontSize: 28, color: MUTED, alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 30, height: 30, borderRadius: '50%', border: `4px solid ${FONDANT}`, background: BLUE, boxSizing: 'border-box' }} /> The three models in this talk
        </span>
        <span style={{ fontWeight: 600, color: FONDANT }}>{RELEASE_COUNT}</span>
      </div>
      <Source>Public weight dates from Hugging Face: moonshotai · deepseek-ai · Qwen · zai-org · XiaomiMiMo · retrieved 2026-10-29</Source>
      <Footer />
    </div>
  );
};

const Perk = ({ mark, children }: { mark: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 20, fontSize: 31, lineHeight: 1.4, color: FONDANT }}>
    <span style={{ fontFamily: MONO, width: 28, flex: 'none' }}>{mark}</span>
    <span>{children}</span>
  </div>
);

const Licensing: Page = () => (
  <div style={root}>
    <Eyebrow>Read the licence</Eyebrow>
    <Title>
      Open weights ≠ open <Em>source</Em>.
    </Title>
    <Steps>
      <CardRow top={300}>
        <Card tag="Open weights give you" name="Run it">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
            <Perk mark="✓">Download it. No account, no key, no approval.</Perk>
            <Perk mark="✓">Run it offline, air-gapped, forever.</Perk>
            <Perk mark="✓">No rate limits and no terms of service in the loop.</Perk>
          </div>
        </Card>
        <Step>
          <Card tag="Open source adds" tagColor={YELLOW} name="Own it">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
              <Perk mark="+">An OSI licence: commercial use, no strings.</Perk>
              <Perk mark="+">The right to copy, ship and sell it.</Perk>
              <Perk mark="+">Fine-tune, fork and publish your own.</Perk>
            </div>
          </Card>
        </Step>
      </CardRow>
    </Steps>
    <Takeaway tone="yellow">
      <Chip bg={FONDANT} fg={ICING}>Today’s three</Chip>
      Two are MIT and Apache-2.0. Flash Next uses Qwen’s own licence: read it.
    </Takeaway>
    <Footer />
  </div>
);

/* ── The tiers ────────────────────────────────────────── */

const DividerTiers: Page = () => (
  <Divider kicker="Part two" note="Pick the model your memory can hold, then the machine that runs it fast enough.">
    Start from your <Em>RAM</Em>.
  </Divider>
);

const Spec = ({ k, children }: { k: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 18, alignItems: 'baseline', borderTop: `2px solid ${RULE}`, paddingTop: 14 }}>
    <span style={{ width: 120, flex: 'none', fontFamily: MONO, fontSize: 22, color: MUTED }}>{k}</span>
    <span style={{ fontSize: 30, lineHeight: 1.35 }}>{children}</span>
  </div>
);

const Models: Page = () => (
  <div style={root}>
    <Eyebrow>Three models, three tiers</Eyebrow>
    <Title>
      Small, medium, <Em>large</Em>.
    </Title>
    <div style={{ position: 'absolute', left: PAD_X, right: PAD_X, top: 290, display: 'flex', gap: 36 }}>
      {MODELS.map((m) => (
        <div key={m.name} style={{ flex: 1, background: WHITE, borderRadius: 'var(--osd-radius)', padding: '34px 38px 38px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip bg={TIER_COLOR[m.tier]}>{TIER_NAME[m.tier]}</Chip>
            <span style={{ fontFamily: MONO, fontSize: 22, color: MUTED }}>{m.licence}</span>
          </div>
          <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, minHeight: 92 }}>{m.name}</div>
          <Spec k="shape">{m.shape}</Spec>
          <Spec k="memory">{m.memory}</Spec>
          <Spec k="fits">{m.fits}</Spec>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: MUTED, marginTop: 6 }}>{m.good}</div>
        </div>
      ))}
    </div>
    <p style={{ position: 'absolute', left: PAD_X, top: 900, margin: 0, fontSize: 32, fontWeight: 600 }}>
      <span style={{ fontFamily: MONO, fontWeight: 400, color: MUTED, marginRight: 24 }}>rule</span>
      More memory, smarter model. Faster memory, faster answers.
    </p>
    <Footer />
  </div>
);

// One machine on the ladder: the model it runs, its measured speed streamed live, and what it costs in India.
const Machine = ({ i }: { i: number }) => {
  const m = MACHINES[i];
  return (
    <div style={root}>
      <div style={{ position: 'absolute', left: PAD_X, right: PAD_X, top: 84, display: 'flex', alignItems: 'center', gap: 24 }}>
        <Chip bg={TIER_COLOR[m.tier]}>{TIER_NAME[m.tier]} model</Chip>
        <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 500 }}>{m.model}</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: MONO, fontSize: 44 }}>
          {i + 1}
          <span style={{ opacity: 0.45 }}> / {MACHINES.length}</span>
        </span>
      </div>
      <Title top={170} size={84}>
        {m.machine}
      </Title>
      <div style={{ position: 'absolute', left: PAD_X, top: 330, width: 680, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
          <CountUp value={m.tps} style={{ fontSize: 200, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }} />
          <span style={{ fontSize: 48, fontWeight: 700 }}>tok/s</span>
        </div>
        <div style={{ background: WHITE, borderRadius: 'var(--osd-radius)', padding: '28px 34px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>In India, today</span>
          <span style={{ fontSize: 64, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>≈ {m.inr}</span>
          <span style={{ fontFamily: MONO, fontSize: 22, color: MUTED }}>{m.inrNote}</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 880, right: PAD_X, top: 340, display: 'flex', flexDirection: 'column', gap: 30 }}>
        <Stream tps={m.tps} height={380} />
        <div style={{ fontSize: 32, lineHeight: 1.45 }}>{m.note}</div>
      </div>
      <Source>{m.source}</Source>
      <Footer />
    </div>
  );
};

const TIER_FADE: SlideTransition = {
  duration: 280,
  exit: { duration: 224, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 0 }] },
  enter: { duration: 308, delay: 112, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
};

const Machine1: Page = () => <Machine i={0} />;
const Machine2: Page = () => <Machine i={1} />;
const Machine3: Page = () => <Machine i={2} />;
const Machine4: Page = () => <Machine i={3} />;
const Machine5: Page = () => <Machine i={4} />;
Machine1.transition = TIER_FADE;
Machine2.transition = TIER_FADE;
Machine3.transition = TIER_FADE;
Machine4.transition = TIER_FADE;
Machine5.transition = TIER_FADE;

const LadderRow = ({ tier, machine, model, tps, inr }: { tier: TierKey; machine: string; model: string; tps: number; inr: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 28, height: 88, borderBottom: `2px solid ${RULE}` }}>
    <span style={{ width: 210, flex: 'none' }}>
      <Chip bg={TIER_COLOR[tier]}>{TIER_NAME[tier]}</Chip>
    </span>
    <span style={{ flex: 1.3, fontSize: 36, fontWeight: 700, letterSpacing: '-0.01em' }}>{machine}</span>
    <span style={{ flex: 1, fontSize: 30, color: MUTED }}>{model}</span>
    <span style={{ width: 190, flex: 'none', fontFamily: MONO, fontSize: 32, textAlign: 'right' }}>{tps}</span>

    <span style={{ width: 230, flex: 'none', fontSize: 36, fontWeight: 700, textAlign: 'right' }}>{inr}</span>
  </div>
);

const Ladder: Page = () => (
  <div style={root}>
    <Eyebrow>The whole ladder</Eyebrow>
    <Title>
      Pick your <Em>rung</Em>.
    </Title>
    <div style={{ position: 'absolute', left: PAD_X, right: PAD_X, top: 280 }}>
      <div style={{ display: 'flex', gap: 28, fontFamily: MONO, fontSize: 22, color: MUTED, paddingBottom: 12, borderBottom: `2px solid ${FONDANT}` }}>
        <span style={{ width: 210, flex: 'none' }}>tier</span>
        <span style={{ flex: 1.3 }}>machine</span>
        <span style={{ flex: 1 }}>model</span>
        <span style={{ width: 190, flex: 'none', textAlign: 'right' }}>tok/s</span>
        <span style={{ width: 230, flex: 'none', textAlign: 'right' }}>India price</span>
      </div>
      {MACHINES.map((m) => (
        <LadderRow key={m.machine} tier={m.tier} machine={m.machine} model={m.model} tps={m.tps} inr={`≈ ${m.inr}`} />
      ))}
    </div>
    <Takeaway tone="yellow">
      <Chip bg={FONDANT} fg={ICING}>Running cost</Chip>
      A 200 W box, 4 hours a day in Jaipur: about ₹190 a month in power.
    </Takeaway>
    <Source>1 user, short prompt, speculative decoding on; long context and many users run slower. Prices Oct 2026, moving weekly with the memory shortage.</Source>
    <Footer />
  </div>
);

/* ── Start ────────────────────────────────────────────── */

const Action = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ background: WHITE, borderRadius: 'var(--osd-radius)', padding: '28px 34px', display: 'flex', alignItems: 'center', gap: 28, fontSize: 34, lineHeight: 1.36, minHeight: 150, boxSizing: 'border-box' }}>
    <Badge n={n} />
    <div>{children}</div>
  </div>
);

const Aside = ({ label, children, tone = 'dark', grow = false }: { label: string; children: ReactNode; tone?: 'dark' | 'yellow'; grow?: boolean }) => (
  <div style={{ flex: grow ? 1 : 'none', background: tone === 'dark' ? FONDANT : YELLOW, color: tone === 'dark' ? ICING : FONDANT, borderRadius: 'var(--osd-radius)', padding: '34px 38px', display: 'flex', flexDirection: 'column', gap: 16 }}>
    <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.8 }}>{label}</span>
    <div style={{ fontSize: 32, lineHeight: 1.4, fontWeight: 500 }}>{children}</div>
  </div>
);

const Tap = ({ children }: { children: ReactNode }) => (
  <span style={{ fontFamily: MONO, fontSize: '0.8em', fontWeight: 500, background: ICING, borderRadius: 10, padding: '3px 12px', lineHeight: 1.7 }}>{children}</span>
);

const StartNow: Page = () => (
  <div style={{ ...root, background: BLUE, color: FONDANT }}>
    <div style={{ position: 'absolute', left: PAD_X, top: 84, display: 'flex', alignItems: 'center', gap: 24 }}>
      <Chip>This week</Chip>
      <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 500 }}>No new hardware required</span>
    </div>
    <Title top={170} size={88}>
      Start with what you <Em on="blue">have</Em>.
    </Title>
    {/* One row so both columns share a top and a bottom edge. */}
    <div style={{ position: 'absolute', left: PAD_X, right: PAD_X, top: 340, display: 'flex', gap: 40 }}>
      <div style={{ width: 1020, flex: 'none', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Action n={1}>
          Check your memory: <Tap>RAM</Tap> on a Mac, <Tap>VRAM</Tap> on a GPU. That picks your tier.
        </Action>
        <Action n={2}>
          On a Mac, install <b>Splash</b>. On a PC, <b>LM Studio</b> or <b>Ollama</b>. Pull the model that fits.
        </Action>
        <Action n={3}>
          Point your chat app or coding agent at it. Then pull the network cable and watch it keep going.
        </Action>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Aside label="Stuck?" tone="dark">
          Ask the AI you already use to set up your local one. That’s how I run mine.
        </Aside>
        <Aside label="Buying a laptop anyway?" tone="yellow" grow>
          Spend the difference on memory, not a faster chip.
        </Aside>
      </div>
    </div>
    <Footer onBlue />
  </div>
);

const Close: Page = () => (
  <div style={{ ...root, background: GRADIENT_BG }}>
    <BitmelaBand style={{ right: 0 }} />
    <Eyebrow top={214}>
      <BitmelaChip />
      <span>Thank you · questions?</span>
    </Eyebrow>
    <h1 style={{ ...HEAD, position: 'absolute', left: PAD_X, top: 290, width: 1480, fontSize: 132, lineHeight: 1.08 }}>
      Local AI is
      <br />
      <Em>freedom tech</Em>.
    </h1>
    <p style={{ position: 'absolute', left: PAD_X, top: 610, width: 1300, margin: 0, fontSize: 42, lineHeight: 1.45, color: MUTED }}>
      Hold your own keys. Run your own node. Now run your own model.
    </p>
    <div style={{ position: 'absolute', left: PAD_X, top: 760, display: 'flex', alignItems: 'center', gap: 32 }}>
      <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${FONDANT}` }}>
        <img src={sethPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scale(1.7)', transformOrigin: '58% 36%' }} />
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
// Index-aligned with the page array below. Talking points are paraphrases in Seth's voice, not quotes; each carries
// its intel-layer pointer (findings/14-ai.md unless noted) so it can be re-checked. Target: 17 minutes plus Q&A.

export const notes: (string | undefined)[] = [
  // 1 Cover
  `[0:00 · 45s] Disclose up front: COO at Cake Wallet, and Cake runs its own AI on-prem, so this is company work as well as a personal obsession.
Honest arc, briefly: you were a sceptic of AI hype and of hosted AI's privacy for years, and you came round this summer once open-weight models got good enough to run yourself. Not an early adopter. [14-ai.md § How the turn happened; voice.md § Mood and register in 2026]
Frame: you came to talk about owning the thing that answers your questions, the way this room already thinks about owning keys.`,
  // 2 Renting
  `[0:45 · 90s] Three ways renting bites. Keep it calm, no doom. [voice.md § Never say 1, 14]
Privacy: what you type into a chatbot is a record of how you think, not just what you know. [voice.md slide-ready line 28, paraphrased] Hosted "we don't log" is the VPN trust model: a promise, not a guarantee. [14-ai.md § 2025-07 spoken]
Cost (India): ChatGPT Go's free-year promo closed to new users 21 Jan 2026; Airtel's free Perplexity Pro closed 16 Jan 2026 (TechCrunch, 2026-08-18); Jio's free Google AI Pro claim window ran to 29 Oct 2026, yesterday (Jio T&Cs; check if extended). Paid now: ChatGPT Go ₹399, Plus ₹1,999, Claude Pro ~₹2,000, Google AI Pro ₹1,950 a month. Your view: today's plans are subsidised and will get narrower as labs chase profit. [14-ai.md § Subscriptions are subsidised]
Access: Anthropic cut Claude Code weekly limits 17% from mid-September (BleepingComputer, 2026-08-29). Cake waited months for frontier-lab cyber access and never got in, so it defends itself with open weights. Who decides access matters more than how good the model is. [14-ai.md § Who gets access]`,
  // 3 Thesis
  `[2:15 · 75s] The core idea for a Bitcoin room: owning your intelligence is self-custody for AI. Sovereign money is the base you build a free life on; your own model is the same kind of base for your thinking. [14-ai.md § Owning your intelligence; voice.md line 90, paraphrased]
Private: never leaves your LAN. Unlimited: no weekly cap, so you can leave agents running all night. Yours: no one can retire the model you rely on or change its rules.
Keep "Not your weights, not your intelligence" as the one line people remember.`,
  // 4 Divider: pace
  `[3:30 · 15s] Transition. The reason this talk exists in 2026 and not 2025: the open models caught up.`,
  // 5 Timeline
  `[3:45 · 75s] Public weight dates (HF commits, checked 2026-10-29): Kimi K3 27 Jul; DeepSeek V4 Flash 0731 checkpoint 31 Jul (first V4 Flash preview weights were April); Qwen 3.8-27B 14 Aug; GLM 5.3 Flash and Qwen 3.8 Flash Next 26 Aug; GLM 5.3 28 Aug (its API launched 14 Aug, weights two weeks later); DeepSeek V4.1 Flash 10 Sep; Xiaomi MiMo V2.6 Flash 21 Sep; DeepSeek V4.1 Flash 1017 on 17 Oct.
Counting the datacentre-size ones too (DeepSeek V4 Pro 0813, Qwen 3.8 Max, MiniMax M3.1 Flash on 23 Oct, Reflection's Beam 1.0 on 16 Oct, Ling 3.1 Flash on 27 Oct) it's a dozen-plus in about three months.
Your story order: Kimi K3 changed things for cyber work first, then DeepSeek V4 Flash is what made Cake host locally. [14-ai.md § How the turn happened, confirmed order]
1017 in one line: a minor update to V4.1 Flash, same weights size, much better at agentic coding (Terminal-Bench 4.0 31.2 → 42.3, vendor-reported), with shorter answers. Opus 5 still leads that benchmark (51.8), so don't claim it beats everything.
Point: you can't un-release weights. Nobody had to ask permission.`,
  // 6 Licensing
  `[5:00 · 60s] Open weights let you download and run it. Open source also lets you ship, sell and fork it. Many "open source AI" models aren't, and as with source-available Bitcoin software, that distinction matters a lot. [14-ai.md § Licensing matters]
Today's three: Qwen 3.8-27B is Apache-2.0; DeepSeek V4.1 Flash 1017 is MIT; Qwen 3.8 Flash Next is the Qwen Community License 1.0 (fine for personal and internal use; extra terms above 100M MAU or US$20M monthly revenue, and for model-as-a-service). Kimi K3 and GLM 5.3 have their own revenue-triggered licences too.
Click to reveal the second card.`,
  // 7 Divider: tiers
  `[6:00 · 30s] The practical half. Picking a model is mostly one question: how much RAM or VRAM do you have? You don't need to understand KV caches to start. [14-ai.md § Start from your RAM]`,
  // 8 Models
  `[6:30 · 90s] Small: Qwen 3.8-27B. Dense 27B, ~17 GB at 4-bit, fits a 24 GB GPU or a 48 GB Mac. Vendor-reported, it beats Opus 4.6 on SWE-bench Pro (61.7 vs 53.4).
Medium: Qwen 3.8 Flash Next. 125B MoE with only 6B active per token (plus a 51B lookup table that can live on SSD), so it's fast. NVIDIA's FP4-Local build is ~96 GiB and validated on one DGX Spark. Billed as a preview of the Qwen4 architecture.
Large: DeepSeek V4.1 Flash 1017. Don't let "Flash" fool you: it's the biggest, 552B MoE, 16B active, plus 196B of Engram memory (~763B on disk). The 2.9-bit build is ~196 GiB and runs on two Sparks with the memory tables on SSD; full-quality weights want four.
Why 1017 for security: on a private CVE benchmark it scored 87.5% pass@3. That number is from the post you quote-posted (@pilvar222, 22 Oct), not your own measurement; your own line was that it's been beating every other model you can run locally, and much faster than GLM 5.3. [14-ai.md § Model picks]
Rule of thumb (yours): more RAM, smarter model. [14-ai.md § Running local AI day to day]`,
  // 9 RTX 3090
  `[8:00 · 55s] 121.8 tok/s: HyperQwen single-user table, default sampling, DFlash2 speculative decoding on, card capped at 250 W (github.com/syv-ai/HyperQwen, measured on vLLM 0.27/0.28). The old deck's 138 was a best greedy run, now gone from the repo. Plain llama.cpp without speculation does ~40 tok/s, so the software stack matters as much as the card.
Price: TechEnclave forums put a used 3090 at about ₹1 lakh ± 20k in Oct 2026, up from ₹45–65k in Oct–Nov 2025, and the used market has been thin. US eBay is $1,000–1,450. Test the card before you pay; there are scam listings around ₹60k.
That's the card only: you need a PC with it. If you game on a PC already, this is your on-ramp.`,
  // 10 MacBook Pro
  `[9:00 · 55s] 74 tok/s: Splash 1.0 launch figure, M5 Pro 48 GB, 4-bit, coding prompts, speculative drafts on (hf.co/incoai/Qwen3.8-27B-Splash, 2026-09-18). An independent M5 Pro run got ~59 on code and ~40 on prose, so say "40 to 75 depending on the work".
Price: ₹3,71,900 on Apple India (14", M5 Pro 15-core CPU / 16-core GPU, 48 GB, 1 TB, MRP incl. GST, 2026-10-29). Base 24 GB is ₹2,99,900, so the memory bump is ₹72,000.
Your point: most of you were going to buy a laptop anyway; this is base specs versus bumped specs, not a new purchase from zero. People think they need far more hardware than they do. [14-ai.md § Upgrade what you'd buy anyway]
Honest caveat in your own view: a Mac laptop is great for one person, not a server; slow prefill and it struggles with several users at once.`,
  // 11 DGX Spark
  `[10:00 · 55s] 55.6 tok/s prose, 1 user (MiaAI-Lab TensorFold v1.1.4, 2026-10-27); ~110 on code. Another single-Spark recipe (myllmbox v5.4) gets ~266–292 tok/s total across 16 users, which is the point of this box.
Price: ₹7,47,999 at PrimeABGB, in stock, 2026-10-29 (MRP ₹8,99,999). NVIDIA's US price went $3,999 → $4,699 → $6,950 (2 Oct 2026) with the memory shortage. Cake paid about $4,600 each. GB10 partner boxes (ASUS Ascent GX10 etc.) cost about the same here. A new 64 GB Spark is $4,999 but too small for this tier.
Your "Uncle Jim" idea: one box serving family and friends, trusted like a VPN promise but with data at rest in someone you know's house. Present it as a possibility; your own family isn't there yet. [14-ai.md § Recommendations, Uncle Jim]`,
  // 12 Mac Studio
  `[11:00 · 55s] 118 tok/s prose at T=0 (155 on new code), your own recipe: oMLX + patches, 6-bit, MTP on, M5 Ultra 80-core GPU, 256 GB, measured 2026-09-28 (github.com/sethforprivacy/Qwen3.8-Flash-Next-M5-Ultra-oMLX). TensorFold decodes faster still on the same box.
Why twice the Spark on the same model: memory bandwidth. Faster memory, faster answers.
Price: ₹12,65,900 on Apple India (M5 Ultra 36-core CPU / 80-core GPU, 256 GB, 1 TB, MRP). The 64-core-GPU 256 GB config is ₹11,09,900. Cheaper path to this model: a Mac Studio M5 Max 128 GB at ₹6,27,900.
Your target if you're buying for the long term: a 256 GB Ultra. [14-ai.md § Upgrade what you'd buy anyway]
Do NOT claim DeepSeek 1017 runs here yet: TensorFold's DeepSeek-on-Metal PR closed unmerged 2026-10-27 and there's no solid measured number.`,
  // 13 2× DGX Spark
  `[12:00 · 60s] 74.9 tok/s prose, 1 user, TensorFold TP=2, 2.9-bit EXL3 with the Engram tables on local NVMe, speculative drafts on, greedy (github.com/MiaAI-Lab/DeepSeek-v4.1-Flash-1017-2x-DGX-Sparks, 2026-10-19). Independent check: 73.1 (tonyd2wild). At DeepSeek's recommended temperature 1.0 it's ~50 prose / ~93 code (ursuciprian, 2026-10-25). Say "50 to 75".
Price: 2 × ₹7,47,999 ≈ ₹15 lakh.
Cake: your Sparks run DeepSeek 1017 on four boxes and MiMo V2.6 Flash on four more (your X post, 2026-10-23). Four Sparks with full-quality weights do ~65–97 tok/s. Eight is overkill for anyone; Cake could get away with four. [14-ai.md § Eight Sparks are overkill]
Why own it: findings and exploits never leave the building, and there's no meter. First week of local scanning cost about $6 of electricity against an estimated $3k on a frontier API. [14-ai.md § Run it on-prem; § Cost] Rough edges are real: you still reach for a frontier model when local gets stuck.`,
  // 14 Ladder
  `[13:00 · 60s] Leave this up for photos; prices are what people asked for after the last version of this talk.
Running cost: Jaipur (JVVNL FY2026-27) slabs are ₹4.75–7.50/kWh plus a ~₹1 surcharge. 200 W × 4 h × 30 days = 24 kWh ≈ ₹190/month at ~₹8, less than ChatGPT Go. A 3090 PC under load is ~350 W; 24/7 at 200 W is ~₹1,150/month, still under Claude Pro.
Honest bit: hardware prices rose this year with the memory shortage, and harder in India (GPU prices up ~30% in one month, Jul→Aug 2026). Prices move weekly, so check on the day. You expect them to fall over the next few years. [14-ai.md § Scaled for concurrency]
Smaller models keep getting smarter per GB (the "densing law"), which balances out the hardware cost. [14-ai.md § Sustainability]`,
  // 15 Start now
  `[14:00 · 90s] You're already an AI user if you want local AI, so let the AI you use set up your local one. That's literally how you run yours. No special wrapper needed. [14-ai.md § Don't hand-manage it; voice.md lines 91–92, paraphrased]
Splash is Apple-silicon only, which is why the slide splits Mac and PC. Be straight about speed: the tier numbers come from tuned stacks (Splash on the Mac, the HyperQwen recipe on the 3090). Plain llama.cpp (what Ollama and LM Studio's GGUF path run) does the same 27B at roughly 16–27 tok/s on an M5 Pro and ~40–66 on a 3090, depending on whether MTP is on, so it's the easy start, not the fast one. LM Studio is where you started yourself back in 2024. [14-ai.md § 2024]
Scope your agents: even frontier models make mistakes, so be careful what you give them access to. The security boundary is the machine you prompt from. [14-ai.md § Scope agent access; § The security boundary]
If someone only has a phone: these models aren't phone-sized yet. Hosted, in order of trust: a "we don't log" promise, then end-to-end encrypted and attested (Maple), then local. NanoGPT is a Cake partner; disclose if you mention it. Never the labs' own Chinese APIs for these open models. [14-ai.md § Hosted ladder; § Open weights ≠ Chinese APIs]`,
  // 16 Close
  `[15:30] Close: local AI is freedom tech. Same lesson this room already learned with keys and nodes, applied to the thing that thinks with you. AI helps defenders more than attackers, as long as defenders have the same tools. [14-ai.md § Defenders win; voice.md line 89, paraphrased]
Then Q&A. Likely questions: "Which one should I buy?" (whatever you'd buy anyway, with more memory); "Is a Chinese model safe to run?" (weights run offline on your box; the risk is their hosted API, not the file); "Electricity?" (≈ ₹190/month for typical use); "Can I share one with my family?" (yes, that's the Spark slide).`,
];

/* ═════════════════════════ Export ═════════════════════════ */

export const meta: SlideMeta = {
  title: 'AI That Never Leaves Your Laptop — Bitmela 2026',
  createdAt: '2026-10-29T07:07:58.429Z',
};

export default [
  Cover,
  Renting,
  Thesis,
  DividerPace,
  Timeline,
  Licensing,
  DividerTiers,
  Models,
  Machine1,
  Machine2,
  Machine3,
  Machine4,
  Machine5,
  Ladder,
  StartNow,
  Close,
] satisfies Page[];
