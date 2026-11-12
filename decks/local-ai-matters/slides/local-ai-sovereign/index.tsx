// AI That Never Leaves Your Laptop — why local AI matters. Sovereign Conference #1 (Asunción), 22 Nov 2026.
// 30-minute slot: ~21 minutes of talk including a live demo, then live Q&A.
// Re-cut of the Bitmela deck (slides/local-ai-bitmela): same three model tiers and hardware ladder, prices in US dollars,
// plus a scripted live demo (demo/keygen-audit) of DeepSeek V4.1 Flash 1017 on Cake's Sparks in Oh My Pi + herdr.
// Visual system stays Cake Wallet media kit v1.2 (Icing / Fondant / Cake blue, Wix Madefor Text + IBM Plex Mono) with
// the sprinkle network; the Sovereign Conference look (near-black dot grid, condensed Archivo caps, Bitcoin orange)
// appears only as a nod on the cover, the close and the Q&A page. Sources for every figure live in `notes`.
import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { Step, Steps, useIsActivePage, useSlidePageNumber } from '@open-slide/core';

import cakeLogo from './assets/brand/cake-horizontal-fondant.svg';
import cakeLogoMono from './assets/brand/cake-horizontal-mono-fondant.svg';
import sethPhoto from './assets/people/seth-ai.png';
import qrSlides from './assets/qr/slides.svg';
import qrDemo from './assets/qr/demo.svg';

/* ───────────────────────── Fonts (Wix Madefor Text + IBM Plex Mono, as in the Cake Wallet app) ───────────────────────── */

const WIX_URL = new URL('./assets/fonts/WixMadeforText.ttf', import.meta.url).href;
const WIX_ITALIC_URL = new URL('./assets/fonts/WixMadeforText-Italic.ttf', import.meta.url).href;
const PLEX_URL = new URL('./assets/fonts/IBMPlexMono-Regular.ttf', import.meta.url).href;
const PLEX_MEDIUM_URL = new URL('./assets/fonts/IBMPlexMono-Medium.ttf', import.meta.url).href;
const ARCHIVO_URL = new URL('./assets/fonts/Archivo-Variable.woff2', import.meta.url).href; // Sovereign nod only
const FONT_STYLE_ID = 'osd-webfont-local-ai-sovereign';
const FONT_CSS = `@font-face{font-family:'Wix Madefor Text';src:url('${WIX_URL}') format('truetype');font-weight:400 800;font-style:normal;font-display:block;}
@font-face{font-family:'Wix Madefor Text';src:url('${WIX_ITALIC_URL}') format('truetype');font-weight:400 800;font-style:italic;font-display:block;}
@font-face{font-family:'IBM Plex Mono';src:url('${PLEX_URL}') format('truetype');font-weight:400;font-style:normal;font-display:block;}
@font-face{font-family:'IBM Plex Mono';src:url('${PLEX_MEDIUM_URL}') format('truetype');font-weight:500;font-style:normal;font-display:block;}
@font-face{font-family:'Archivo';src:url('${ARCHIVO_URL}') format('woff2');font-weight:100 900;font-stretch:62% 125%;font-style:normal;font-display:block;}`;
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

// Keep in sync with demo/keygen-audit/prompt.txt, the prompt used in the talk.
const PROMPT =
  'Audit this wallet’s key generation for security bugs. For the worst one, write a standalone poc.py that recovers the seed phrase from wallet.json alone, and run it. Then fix keygen.py and run the tests.';

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
  { date: 'SEP 10', model: 'DeepSeek V4.1 Flash' },
  { date: 'SEP 21', model: 'MiMo V2.6 Flash' },
  { date: 'OCT 17', model: 'DeepSeek V4.1 Flash 1017', ours: true },
  { date: 'OCT 29', model: 'Mistral Large 4' },
  { date: 'NOV 2', model: 'Kimi K3.1 Pro' },
];
const RELEASE_COUNT = 'Sixteen major open-weight releases in just over three months.';

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
// `price` is the US-dollar price, rounded. Full sourcing is in the notes for each page.
const MACHINES: {
  tier: TierKey;
  machine: string;
  model: string;
  tps: number;
  price: string;
  priceNote: string;
  note: string;
  source: string;
}[] = [
  {
    tier: 'small',
    machine: 'RTX 3090 · 24 GB, used',
    model: 'Qwen 3.8-27B',
    tps: 129,
    price: '$1,400',
    priceNote: 'used card · US listings $1,300–1,600',
    note: 'A six-year-old gaming card, and still the community’s favourite way in. If you already game on a PC, start here.',
    source: 'github.com/syv-ai/HyperQwen #428 · 129.4 tok/s, 1 user, default sampling, speculative, 250 W (2026-11-02) · resaleprices.com',
  },
  {
    tier: 'small',
    machine: 'MacBook Pro · M5 Pro, 48 GB',
    model: 'Qwen 3.8-27B',
    tps: 74,
    price: '$3,100',
    priceNote: 'new · Apple US, 1 TB',
    note: 'A laptop you might buy anyway, with the memory bumped. No GPU, no server, no cloud.',
    source: 'hf.co/incoai/Qwen3.8-27B-Splash · 74 tok/s, short prompt, speculative drafts (2026-09-18) · Apple US: $2,499 base + $600 for 48 GB',
  },
  {
    tier: 'mid',
    machine: 'DGX Spark · 128 GB',
    model: 'Qwen 3.8 Flash Next',
    tps: 55,
    price: '$7,000',
    priceNote: 'new · NVIDIA, was $3,999 at launch',
    note: 'One quiet box the size of a hardback. Slower per answer, but built to serve a whole household at once.',
    source: 'github.com/MiaAI-Lab/Qwen3.8-Flash-Next-Single-DGX-Spark-TensorFold · 55.6 tok/s prose, 1 user (2026-10-27) · NVIDIA $6,950 since 2026-10-02',
  },
  {
    tier: 'mid',
    machine: 'Mac Studio · M5 Ultra, 256 GB',
    model: 'Qwen 3.8 Flash Next',
    tps: 144,
    price: '$10,800',
    priceNote: 'new · Apple US, 80-core GPU',
    note: 'The box on my desk. Over twice the Spark’s speed on the same model, because its memory is faster.',
    source: 'github.com/BobClawblaw/qwen38-flashnext-mlx6bit-m5-ultra · 144.5 tok/s prose, greedy, 6-bit, TensorFold (2026-10-11) · Apple US $10,799',
  },
  {
    tier: 'big',
    machine: '2× DGX Spark · 256 GB',
    model: 'DeepSeek V4.1 Flash 1017',
    tps: 81,
    price: '$13,900',
    priceNote: 'two boxes at $6,950',
    note: 'Two boxes, one cable between them. Cake runs this model on four of them; that’s what you’re about to see.',
    source: 'github.com/MiaAI-Lab/DeepSeek-v4.1-Flash-1017-2x-DGX-Sparks · 80.7 tok/s prose, T=0, 2.9-bit, speculative drafts (2026-10-29) · 2 × $6,950',
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

// Sovereign Conference #1 (sampled from sovereign-conference.com): the side strip on cover, close and Q&A is the only nod.
const SV_BLACK = '#0B0B0B';
const SV_CREAM = '#F4EFE4';
const SV_ORANGE = '#F7931A';
const SV_DOTS = `radial-gradient(circle at 1.5px 1.5px, rgba(244, 239, 228, 0.18) 1.5px, transparent 0)`;
const SV_TYPE: CSSProperties = {
  fontFamily: "'Archivo', 'Arial Narrow', Impact, sans-serif",
  fontWeight: 900,
  fontStretch: '68%',
  textTransform: 'uppercase',
  lineHeight: 0.9,
};

// The site's hero, turned on its side: a near-black dot-grid strip with the wordmark running up it.
const SovereignBand = ({ style }: { style?: CSSProperties }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      width: 168,
      height: 1080,
      background: SV_BLACK,
      backgroundImage: SV_DOTS,
      backgroundSize: '36px 36px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
    aria-hidden
  >
    <div style={{ ...SV_TYPE, writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 80, lineHeight: 1, whiteSpace: 'nowrap' }}>
      <span style={{ color: SV_CREAM }}>Sovereign </span>
      <span style={{ color: SV_ORANGE }}>Conference</span>
    </div>
  </div>
);

/* ───────────────────────── Frame ───────────────────────── */

// `band` leaves room for the Sovereign strip down the right edge.
const Footer = ({ onBlue = false, onDark = false, band = false }: { onBlue?: boolean; onDark?: boolean; band?: boolean }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: PAD_X,
        right: band ? 168 + 60 : PAD_X,
        bottom: 44,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 22,
        fontWeight: 500,
        color: onDark ? ICING_MUTED : onBlue ? FONDANT : MUTED,
      }}
    >
      <img src={onBlue || onDark ? cakeLogoMono : cakeLogo} alt="Cake Wallet" style={{ height: 34, display: 'block', filter: onDark ? 'invert(1)' : undefined }} />
      <span>AI That Never Leaves Your Laptop · Sovereign Conference · @sethforprivacy</span>
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
    <ShatterNet scale={0.84} style={{ right: 180, top: 90 }} />
    <SovereignBand style={{ right: 0 }} />
    <Eyebrow top={204}>Asunción · 22 November 2026</Eyebrow>
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
      <Card tag="Cost" name="Subsidised, for now">
        $20 a month gets you in. Heavy use is $100 to $500. Those prices are subsidised, and they won’t stay that way.
      </Card>
      <Card tag="Access" name="Someone else decides">
        Claude Code’s weekly cap fell 17% in September. OpenAI announced a Pro cut, then reversed it. Their call, either way.
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
      <Eyebrow>Open-weight releases · July → November 2026</Eyebrow>
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
      <Source>Public weight dates from Hugging Face commit history, retrieved 2026-11-12</Source>
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

// One machine on the ladder: the model it runs, its measured speed streamed live, and what it costs in US dollars.
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
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>Price today</span>
          <span style={{ fontSize: 64, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>≈ {m.price}</span>
          <span style={{ fontFamily: MONO, fontSize: 22, color: MUTED }}>{m.priceNote}</span>
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

const LadderRow = ({ tier, machine, model, tps, price }: { tier: TierKey; machine: string; model: string; tps: number; price: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 28, height: 88, borderBottom: `2px solid ${RULE}` }}>
    <span style={{ width: 210, flex: 'none' }}>
      <Chip bg={TIER_COLOR[tier]}>{TIER_NAME[tier]}</Chip>
    </span>
    <span style={{ flex: 1.3, fontSize: 36, fontWeight: 700, letterSpacing: '-0.01em' }}>{machine}</span>
    <span style={{ flex: 1, fontSize: 30, color: MUTED }}>{model}</span>
    <span style={{ width: 190, flex: 'none', fontFamily: MONO, fontSize: 32, textAlign: 'right' }}>{tps}</span>

    <span style={{ width: 230, flex: 'none', fontSize: 36, fontWeight: 700, textAlign: 'right' }}>{price}</span>
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
        <span style={{ width: 230, flex: 'none', textAlign: 'right' }}>price (USD)</span>
      </div>
      {MACHINES.map((m) => (
        <LadderRow key={m.machine} tier={m.tier} machine={m.machine} model={m.model} tps={m.tps} price={`≈ ${m.price}`} />
      ))}
    </div>
    <Takeaway tone="yellow">
      <Chip bg={FONDANT} fg={ICING}>Running cost</Chip>
      A 200 W box, 4 hours a day in Asunción: about $1.50 a month in power.
    </Takeaway>
    <Source>1 user, short prompt, speculative decoding on; long context and many users run slower. US prices, Nov 2026, moving weekly with the memory shortage.</Source>
    <Footer />
  </div>
);

/* ── Live demo ────────────────────────────────────────── */

const DemoFact = ({ k, children }: { k: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'baseline', borderTop: `2px solid rgba(239, 239, 248, 0.16)`, paddingTop: 18 }}>
    <span style={{ width: 150, flex: 'none', fontFamily: MONO, fontSize: 22, color: ICING_MUTED }}>{k}</span>
    <span style={{ fontSize: 32, lineHeight: 1.35 }}>{children}</span>
  </div>
);

const DemoIntro: Page = () => (
  <div style={{ ...root, background: FONDANT, color: ICING }}>
    <div style={{ position: 'absolute', left: PAD_X, top: 84, display: 'flex', alignItems: 'center', gap: 24 }}>
      <Chip>Live demo</Chip>
      <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 500 }}>Break it first</span>
    </div>
    <Title top={170} size={76} width={1500}>
      Can a model on our own hardware find, prove and <Em>fix</Em> a wallet bug?
    </Title>
    <div style={{ position: 'absolute', left: PAD_X, top: 420, width: 900, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: ICING_MUTED }}>The only prompt</span>
      <div style={{ background: '#241E2A', border: '2px solid rgba(97, 197, 255, 0.5)', borderRadius: 'var(--osd-radius)', padding: '30px 36px', fontFamily: MONO, fontSize: 28, lineHeight: 1.55 }}>
        <span style={{ color: BLUE }}>&gt; </span>
        {PROMPT}
      </div>
      <span style={{ fontSize: 26, lineHeight: 1.45, color: ICING_MUTED }}>
        The bug is the same class as the 2026 Coldcard RNG fallback: entropy that looks random, but isn’t.
      </span>
    </div>
    <div style={{ position: 'absolute', left: 1120, right: PAD_X, top: 420, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <DemoFact k="model">DeepSeek V4.1 Flash 1017</DemoFact>
      <DemoFact k="hardware">Cake’s DGX Sparks, on-prem</DemoFact>
      <DemoFact k="harness">Oh My Pi, inside herdr</DemoFact>
      <DemoFact k="target">tinywallet, a 74-line keygen</DemoFact>
      <DemoFact k="rules">One prompt. No edits. No cloud.</DemoFact>
    </div>
    <Footer onDark />
  </div>
);

const Outcome = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div style={{ flex: 1, background: WHITE, borderRadius: 'var(--osd-radius)', padding: '34px 34px 38px', display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Badge n={n} bg={BLUE} fg={FONDANT} size={64} />
    <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</div>
    <div style={{ fontSize: 29, lineHeight: 1.42, color: MUTED }}>{children}</div>
  </div>
);

const DemoRecap: Page = () => (
  <div style={root}>
    <Eyebrow>What just happened</Eyebrow>
    <Title>
      Found. Proved. Fixed. <Em>Tested</Em>.
    </Title>
    <CardRow top={300}>
      <Outcome n={1} title="Found">
        Key generation seeded <Tap>random</Tap> with the clock. Tests never noticed.
      </Outcome>
      <Outcome n={2} title="Proved">
        From public metadata alone: one day, 86,400 guesses, the full 12 words back in a second.
      </Outcome>
      <Outcome n={3} title="Fixed">
        Real entropy from the operating system, via <Tap>secrets</Tap>.
      </Outcome>
      <Outcome n={4} title="Tested">
        Tests green, and the exploit no longer works.
      </Outcome>
    </CardRow>
    <Takeaway>
      <Chip bg={FONDANT} fg={ICING}>On-prem</Chip>
      No API key, no usage meter, and the exploit never touched anyone else’s server.
    </Takeaway>
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
    <SovereignBand style={{ right: 0 }} />
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
    <Footer band />
  </div>
);

const AskRow = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 20, fontSize: 34, lineHeight: 1.4, borderTop: `2px solid ${RULE}`, paddingTop: 18 }}>
    <span style={{ fontFamily: MONO, color: MUTED }}>?</span>
    <span>{children}</span>
  </div>
);

const QrCard = ({ src, label }: { src: string; label: string }) => (
  <div style={{ background: WHITE, borderRadius: 'var(--osd-radius)', padding: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
    <img src={src} alt="" style={{ width: 230, height: 230, display: 'block' }} />
    <span style={{ fontFamily: MONO, fontSize: 24 }}>{label}</span>
  </div>
);

const QnA: Page = () => (
  <div style={{ ...root, background: GRADIENT_BG }}>
    <SovereignBand style={{ right: 0 }} />
    <Eyebrow top={120}>Live Q&amp;A</Eyebrow>
    <h1 style={{ ...HEAD, position: 'absolute', left: PAD_X, top: 200, fontSize: 132 }}>
      Ask me <Em>anything</Em>.
    </h1>
    <div style={{ position: 'absolute', left: PAD_X, top: 420, width: 880, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <AskRow>Which machine should I buy?</AskRow>
      <AskRow>Is it safe to run a model from a Chinese lab?</AskRow>
      <AskRow>Can I run one for my family?</AskRow>
      <AskRow>What if I only have a phone?</AskRow>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 420, display: 'flex', gap: 28 }}>
      <QrCard src={qrSlides} label="these slides" />
      <QrCard src={qrDemo} label="the demo kit" />
    </div>
    <Footer band />
  </div>
);

/* ═════════════════════════ Speaker notes ═════════════════════════ */
// Index-aligned with the page array below. Talking points are paraphrases in Seth's voice, not quotes; each carries
// its intel-layer pointer (findings/14-ai.md unless noted) so it can be re-checked. Target: ~20 minutes including the demo, then ~10 minutes of Q&A.

export const notes: (string | undefined)[] = [
  // 1 Cover
  `[0:00 · 45s] Disclose up front: COO at Cake Wallet, and Cake runs its own AI on-prem, so this is company work as well as a personal obsession.
Honest arc, briefly: you were a sceptic of AI hype and of hosted AI's privacy for years, and came round this summer once open-weight models got good enough to run yourself. Not an early adopter. [14-ai.md § How the turn happened; voice.md § Mood and register in 2026]
Set expectations: about 20 minutes, a live demo in the middle of it, then the rest is your questions.`,
  // 2 Renting
  `[0:45 · 90s] Three ways renting bites. Keep it calm, no doom. [voice.md § Never say 1, 14]
Privacy: what you type into a chatbot is a record of how you think, not just what you know. [voice.md slide-ready line 28, paraphrased] Hosted "we don't log" is the VPN trust model: a promise, not a guarantee. [14-ai.md § 2025-07 spoken]
Cost (US prices, Nov 2026): ChatGPT Go $8, Plus $20, Pro $100/$200/$500; Claude Pro $20, Max $100, Ultra $200 (Max 20x renamed 30 Oct); Google AI Pro $19.99, Ultra $99.99–199.99. Your view: plans are subsidised and will get narrower as labs chase profit. [14-ai.md § Subscriptions are subsidised]
Access: Anthropic cut Claude Code weekly limits 17% from mid-September (BleepingComputer, 2026-08-29). OpenAI announced a Pro 200 cut from 20x to 10x Plus usage in early October, then reversed it and doubled limits on 29–30 Oct. Point isn't which way it went: it's that someone else turns the dial. Cake waited months for frontier-lab cyber access and never got in. [14-ai.md § Who gets access]`,
  // 3 Thesis
  `[2:15 · 75s] The core idea for this room: owning your intelligence is self-custody for AI. Sovereign money is the base you build a free life on; your own model is the same kind of base for your thinking. [14-ai.md § Owning your intelligence; voice.md line 90, paraphrased]
Tie it to the conference's own thread: fewer things in your life that someone else can switch off. A model on your own hardware is one more of those.
Private: never leaves your LAN. Unlimited: no weekly cap, so agents can run all night. Yours: no one can retire the model you rely on or change its rules.`,
  // 4 Divider: pace
  `[3:30 · 15s] Transition. Why this talk exists in 2026 and not 2025: the open models caught up.`,
  // 5 Timeline
  `[3:45 · 75s] Public weight dates (HF commits, checked 2026-11-12): Kimi K3 27 Jul; DeepSeek V4 Flash 0731 checkpoint 31 Jul; Qwen 3.8-27B 14 Aug; GLM 5.3 Flash and Qwen 3.8 Flash Next 26 Aug; DeepSeek V4.1 Flash 10 Sep; Xiaomi MiMo V2.6 Flash 21 Sep; DeepSeek V4.1 Flash 1017 on 17 Oct; Mistral Large 4 on 29 Oct (~1T, 49B active, modified-MIT licence); Kimi K3.1 Pro 2 Nov (2.8T).
Sixteen counts the ones not on the rail too: Qwen 3.8 Max, DeepSeek V4 Pro 0813, GLM 5.3, Reflection Beam 1.0, MiniMax M3.1 Flash, Ling 3.1 Flash.
Your story order: Kimi K3 changed things for cyber work first, then DeepSeek V4 Flash is what made Cake host locally. [14-ai.md § How the turn happened]
1017 is still the newest DeepSeek Flash. A minor update to V4.1 Flash: much better at agentic coding (Terminal-Bench 4.0 31.2 → 42.3, vendor-reported), shorter answers. Opus 5 still leads that benchmark (51.8).
Point: you can't un-release weights. Nobody had to ask permission.`,
  // 6 Licensing
  `[5:00 · 50s] Open weights let you download and run it. Open source also lets you ship, sell and fork it. Many "open source AI" models aren't, and as with source-available Bitcoin software, the distinction matters a lot. [14-ai.md § Licensing matters]
Today's three: Qwen 3.8-27B is Apache-2.0; DeepSeek V4.1 Flash 1017 is MIT; Qwen 3.8 Flash Next is the Qwen Community License 1.0 (fine for personal and internal use; extra terms above 100M MAU or US$20M monthly revenue, and for model-as-a-service).
Click to reveal the second card.`,
  // 7 Divider: tiers
  `[5:50 · 20s] The practical half. Picking a model is mostly one question: how much RAM or VRAM do you have? [14-ai.md § Start from your RAM]`,
  // 8 Models
  `[6:10 · 80s] Small: Qwen 3.8-27B. Dense 27B, ~17 GB at 4-bit, fits a 24 GB GPU or a 48 GB Mac. Vendor-reported, it beats Opus 4.6 on SWE-bench Pro (61.7 vs 53.4).
Medium: Qwen 3.8 Flash Next. 125B MoE with only 6B active per token (plus a 51B lookup table that can live on SSD), so it's fast. NVIDIA's FP4-Local build (~96 GiB) is validated on one DGX Spark.
Large: DeepSeek V4.1 Flash 1017. Don't let "Flash" fool you: 552B MoE, 16B active, plus 196B of Engram memory (~763B on disk). The 2.9-bit build (~196 GiB) runs on two Sparks with the memory tables on SSD; full-quality weights want four.
It's the one in the demo. On a private CVE benchmark it scored 87.5% pass@3; that's from the post you quote-posted (@pilvar222, 22 Oct), not your own measurement. Your own line: it's been beating every other model you can run locally, and much faster than GLM 5.3.`,
  // 9 RTX 3090
  `[7:30 · 50s] 129.4 tok/s: HyperQwen field report #428 (2 Nov), one 3090 at 250 W, vLLM 0.32, DFlash2 speculative decoding, default sampling. The repo's own benchmark table still says 121.8, so "120 to 130" is the honest range. Plain llama.cpp without speculation does ~40, so the software matters as much as the card.
Price: used US listings $1,300–1,600 in Nov 2026 (resaleprices.com median $1,600; gpupoet Oct $1,325–1,497), up from $1,000–1,450 in September. Active listings, not sold prices. Card only: you need a PC around it.
If you game on a PC already, this is your on-ramp.`,
  // 10 MacBook Pro
  `[8:20 · 50s] 74 tok/s: Splash 1.0 launch figure, M5 Pro 48 GB, 4-bit, coding prompts, speculative drafts on. An independent M5 Pro run got ~59 on code and ~40 on prose, so say "40 to 75 depending on the work". Splash is at 1.6.1 now (faster first token), no new absolute figure.
Price: Apple US M5 Pro 14" is $2,499 with 24 GB / 1 TB (after June's price rise); 48 GB is a $600 bump, so ~$3,100. That's arithmetic from the configurator delta, not a quoted price.
Your point: you were going to buy a laptop anyway; this is base specs versus bumped specs. People think they need far more hardware than they do. [14-ai.md § Upgrade what you'd buy anyway]
Paraguay: DNIT treats a personal computer as a personal-use item, so bringing a laptop in is exempt. Nissei lists an M5 Pro 24 GB / 2 TB at ₲24.1M (~$3,900).`,
  // 11 DGX Spark
  `[9:10 · 50s] 55.6 tok/s prose, 1 user (MiaAI-Lab TensorFold v1.1.4, 2026-10-27); ~110 on code. Another single-Spark recipe gets ~266–292 tok/s total across 16 users, which is the point of this box.
Price: NVIDIA's US price went $3,999 at launch → $4,699 (Feb) → $6,950 (2 Oct 2026) with the memory shortage. Cake paid about $4,600 each. Partner GB10 boxes run ~$6,000–8,000 (Dell Pro Max GB10 $7,901). A new 64 GB Spark is $4,999, too small for this tier.
Your "Uncle Jim" idea: one box serving family and friends. Present it as a possibility; your own family isn't there yet. [14-ai.md § Recommendations, Uncle Jim]`,
  // 12 Mac Studio
  `[10:00 · 50s] 144.5 tok/s prose, greedy, 6-bit, TensorFold, M5 Ultra 256 GB (BobClawblaw, 2026-10-11). Your own oMLX recipe on the same machine did 118 prose / 155 code at T=0 (github.com/sethforprivacy/Qwen3.8-Flash-Next-M5-Ultra-oMLX); TensorFold has pulled ahead on decode since.
Why over twice the Spark on the same model: memory bandwidth. Faster memory, faster answers.
Price: Apple US $10,799 (36-core CPU / 80-core GPU, 256 GB, 1 TB); the 64-core-GPU 256 GB build is ~$9,500. Cheaper route to this model: Mac Studio M5 Max 128 GB at ~$5,400. In Asunción, Nissei has a base Mac Studio at ~$4,100 vs $2,499 in the US, so buy it abroad if you can.
DeepSeek 1017 on a Mac: only measured on the 512 GB M5 Ultra so far (~54 tok/s chat, unmerged TensorFold PR #1720); it needs ~284 GiB, so not on 256 GB. Say so if asked.`,
  // 13 2× DGX Spark
  `[10:50 · 55s] 80.7 tok/s prose at T=0, thinking off, TensorFold TP=2, 2.9-bit EXL3 with the Engram tables on local NVMe, speculative drafts on (MiaAI-Lab, updated 2026-10-29). At DeepSeek's recommended temperature 1.0 it's ~49 prose / ~98 code (ursuciprian v1.2.2, 2026-11-11). Say "50 to 80".
Price: 2 × $6,950 ≈ $13,900.
Cake: your Sparks run DeepSeek 1017 on four boxes and MiMo V2.6 Flash on four more (your X post, 2026-10-23). Four Sparks with full-quality weights do ~65–97 tok/s. Eight is overkill for anyone; Cake could get away with four. [14-ai.md § Eight Sparks are overkill]
Why own it: findings and exploits never leave the building, and there's no meter. First week of local scanning cost about $6 of electricity against an estimated $3k on a frontier API. [14-ai.md § Run it on-prem; § Cost]
Segue: "Let me show you what that's for."`,
  // 14 Ladder
  `[11:45 · 50s] Leave this up for photos; prices are what people asked for after the first version of this talk.
Running cost in Paraguay: ANDE residential works out to about ₲404/kWh ≈ $0.065 (ABC Color example bill, Nov 2025; BCP rate ₲6,226/$ on 12 Nov 2026). 200 W × 4 h × 30 days = 24 kWh ≈ $1.56/month. Even two Sparks flat out 24/7 (~340 W) is ~$16/month, less than one ChatGPT Plus seat.
Local hook if it fits: ANDE just created a tariff class for data centres and AI (Resolution P/Nº 52552/2026, ~$0.05/kWh; Última Hora, 26 Oct 2026). The country is courting AI compute; you can host your own for pennies.
Honest bit: hardware prices rose all year with the memory shortage; an RTX 5090 is $1,999 MSRP, ~$6,500 street in the US, and ~$13,200 at Nissei. Prices move weekly; check on the day.`,
  // 15 Demo intro
  `[12:35 · 45s, then ~4 min live] Read the prompt aloud. Rules: one prompt, no edits, no cloud. Then switch to herdr (left pane ./run.sh, right pane ./monitor.sh) and press enter.
Runbook and fallbacks: decks/local-ai-matters/demo/keygen-audit/README.md. Rehearse with ./rehearse.sh 10 beforehand.
Narrate while it works:
- What it's reading: keygen.py makes a 12-word BIP39 seed. The tests pass. Looks fine.
- The bug class: entropy that looks random but isn't, same family as the Coldcard RNG fallback this summer. Don't name people; the fact is enough. [14-ai.md § Coldcard; 09-money.md Handle with care]
- Point at the right pane: that's the Spark's GPU working, in the next room from where you're sitting. Nothing about this wallet is going to a lab.
- Your stance, paraphrased: a finding isn't real until it's proven; no PoC, no finding. That's why the prompt asks for poc.py. [14-ai.md § A finding isn't real until it's proven]
When it's done: run ./check.sh in the left pane. Three PASS lines.
If it stalls ~30 s: say so plainly, switch to the laptop fallback (Qwen 3.8-27B, offline) or the recorded run. Don't fight it live.
Remote talk: share the whole screen so the switch to herdr shows; the Sparks are on your home network, so the only link at risk is the call. If the call drops, the agent keeps running under herdr; rejoin and reattach.
Keep hostnames and how the cluster is reached off the screen. [14-ai.md Handle with care]`,
  // 16 Demo recap
  `[17:20 · 45s] What just happened, in order. The planted bug: random.seed(int(time.time())) in generate_entropy. wallet.json publishes the creation date and an 8-hex fingerprint, so a day of seconds is 86,400 guesses; the reference PoC finds the phrase in under a second on a laptop.
Why this matters: a traditional audit for this would have been weeks and tens of thousands of dollars; now it's a prompt on hardware you own, running all the time. Pair it with: auditors still matter. [14-ai.md § Audit economics flipped; Recommendations]
Defenders win if they have the same tools; this is how you make sure you do. [14-ai.md § Defenders win]`,
  // 17 Start now
  `[18:05 · 75s] You're already an AI user if you want local AI, so let the AI you use set up your local one. That's how you run yours. [14-ai.md § Don't hand-manage it; voice.md lines 91–92, paraphrased]
Splash is Apple-silicon only, hence the Mac/PC split. Be straight about speed: the tier numbers come from tuned stacks (Splash on the Mac, the HyperQwen recipe on the 3090). Plain llama.cpp (what Ollama and LM Studio's GGUF path run) does the same 27B at roughly 16–27 tok/s on an M5 Pro and ~40–66 on a 3090: the easy start, not the fast one.
The harness in the demo: Oh My Pi for the agent, herdr to keep sessions alive across machines. Mention only if asked.
Scope your agents: even frontier models make mistakes. The security boundary is the machine you prompt from. [14-ai.md § Scope agent access; § The security boundary]`,
  // 18 Close
  `[19:20 · 30s] Close: local AI is freedom tech. Same lesson this room already learned with keys and nodes, applied to the thing that thinks with you. Thank the organisers and Bitcoin Paraguay, then go straight to questions.`,
  // 19 Q&A
  `[19:50 → 30:00] Leave this up for the whole Q&A so people can scan the slides and the demo kit.
Prepared answers:
- Which machine? Whatever you'd buy anyway, with more memory. Used 3090 if you have a PC; a 48 GB Mac if you're buying a laptop; a Spark or Mac Studio for a household.
- Chinese labs? The weights run offline on your box and can't phone home on their own; the risk is their hosted APIs, which you shouldn't use for these models. [14-ai.md § Open weights ≠ Chinese APIs]
- Family? Yes: one box, everyone's devices pointed at it. Trust is like a VPN promise, but in a house you know. [14-ai.md § Uncle Jim]
- Phone only? These models aren't phone-sized yet. Hosted, in order of trust: a "we don't log" promise, then end-to-end encrypted and attested (Maple), then local. NanoGPT is a Cake partner; disclose if you mention it. [14-ai.md § Hosted ladder]
- Electricity here? About 6.5¢/kWh: a couple of dollars a month for normal use.
- Bringing hardware in? DNIT exempts a personal computer as a personal-use item; the general traveller allowance is US$1,000 by air (DNIT, 4 Feb 2026). Don't advise on commercial imports.`,
];

/* ═════════════════════════ Export ═════════════════════════ */

export const meta: SlideMeta = {
  title: 'AI That Never Leaves Your Laptop — Sovereign Conference 2026',
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
  DemoIntro,
  DemoRecap,
  StartNow,
  Close,
  QnA,
] satisfies Page[];
