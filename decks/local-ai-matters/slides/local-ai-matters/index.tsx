import { useEffect, useRef } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { useIsActivePage, useSlidePageNumber } from '@open-slide/core';

export const design: DesignSystem = {
  palette: { bg: '#0a0d0a', text: '#e8f2e4', accent: '#4ade80' },
  fonts: {
    display: '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace',
    body: '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace',
  },
  typeScale: { hero: 168, body: 36 },
  radius: 10,
};

// ——— extras outside the DesignSystem shape ———
const panel = '#0f150f';
const dim = '#1e3a27';
const muted = '#69856e';
const amber = '#e8c56a';
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

const MONO = 'var(--osd-font-body)';

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// ——— shell chrome ————————————————————————————————————————————————

const Scan = () => (
  <div data-slide-loc="32:2"
    style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      backgroundImage:
        'repeating-linear-gradient(0deg, rgba(74,222,128,0.05) 0px, rgba(74,222,128,0.05) 1px, transparent 1px, transparent 3px), radial-gradient(ellipse at 50% 38%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.62) 100%)',
    }}
  />
);

const Cursor = () => {
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
    <span data-slide-loc="61:4" ref={ref} style={{ color: 'var(--osd-accent)' }}>
      ▮
    </span>
  );
};

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div data-slide-loc="70:4"
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 56,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: MONO,
        fontSize: 20,
        color: dim,
        letterSpacing: '0.08em',
      }}
    >
      <span data-slide-loc="84:6">GFTS 2026 | @sethforprivacy</span>
      <span data-slide-loc="85:6">
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div data-slide-loc="93:2"
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: MONO,
    }}
  >
    {children}
    <Scan />
    <Footer />
  </div>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div data-slide-loc="111:2"
    style={{
      fontFamily: MONO,
      fontSize: 24,
      color: 'var(--osd-accent)',
      letterSpacing: '0.32em',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

const Cmd = ({ children }: { children: React.ReactNode }) => (
  <div data-slide-loc="125:2" style={{ fontFamily: MONO, fontSize: 30, color: muted }}>
    <span data-slide-loc="126:4" style={{ color: 'var(--osd-accent)' }}>$ </span>
    {children}
  </div>
);

const Source = ({ children }: { children: React.ReactNode }) => (
  <div data-slide-loc="132:2"
    style={{
      position: 'absolute',
      left: 120,
      right: 120,
      bottom: 96,
      fontFamily: MONO,
      fontSize: 19,
      color: muted,
      letterSpacing: '0.04em',
    }}
  >
    {children}
  </div>
);

// ——— count-up + bar ————————————————————————————————————————————————

const CountUp = ({
  value,
  decimals = 0,
  style,
}: {
  value: number;
  decimals?: number;
  style?: React.CSSProperties;
}) => {
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
    <span data-slide-loc="181:4" ref={ref} style={style}>
      0
    </span>
  );
};

// ——— 1 · cover —————————————————————————————————————————————————

const Cover: Page = () => (
  <Shell>
    <div data-slide-loc="191:4"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 160px',
      }}
    >
      <Eyebrow>Global Freedom Tech Summit</Eyebrow>
      <h1 data-slide-loc="202:6"
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 900,
          lineHeight: 1.05,
          margin: '36px 0 40px',
        }}
      >
        Run It
        <br data-slide-loc="212:8" />
        <span data-slide-loc="213:8" style={{ color: 'var(--osd-accent)' }}>Yourself.</span>
      </h1>
      <p data-slide-loc="215:6"
        style={{
          fontFamily: MONO,
          fontSize: 'var(--osd-size-body)',
          lineHeight: 1.6,
          color: muted,
          maxWidth: 1250,
          margin: 0,
        }}
      >
        Why local AI matters, what to expect when you run it,
        <br data-slide-loc="226:8" />
        and which machine to start with.
      </p>
      <div data-slide-loc="229:6" style={{ marginTop: 64 }}>
        <Cmd>
          whoami <span data-slide-loc="231:17" style={{ color: 'var(--osd-text)' }}>→</span> free<span data-slide-loc="231:73">
            <Cursor />
          </span>
        </Cmd>
      </div>
    </div>
  </Shell>
);

// ——— 2 · they're asking to slow down ———————————————————————————————

const Pacing: Page = () => (
  <Shell>
    <div data-slide-loc="265:4"
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        top: 120,
      }}
    >
      <h2 data-slide-loc="274:6"
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 84,
          fontWeight: 900,
          lineHeight: 1.2,
          margin: '28px 0 72px',
        }}
      >
        The labs want to
        <br data-slide-loc="284:8" />
        <span data-slide-loc="285:8" style={{ color: 'var(--osd-accent)' }}>slow down.</span>
      </h2>
      <div data-slide-loc="287:6" style={{ display: 'flex', flexDirection: 'column', gap: 44, maxWidth: 1500 }}>
        <Bullet>
          <b data-slide-loc="289:10" style={bStyle}>1,386 employees</b> sign “Pacing the Frontier” — coordinated pause
        </Bullet>
        <Bullet>
          <b data-slide-loc="292:10" style={bStyle}>Amodei’s 3-step plan</b> — auditors first, then coordination
        </Bullet>
        <Bullet>
          <b style={bStyle}>From</b> OpenAI · Anthropic · Google DeepMind · Meta
        </Bullet>
        <Bullet>
          <b data-slide-loc="299:10" style={bStyle}>The pause costs them nothing</b> — it slows
          you, not them
        </Bullet>
      </div>
    </div>
    <Source>Pacing the Frontier (Jul 2026, 1,386 signatories) · darioamodei.com “We Must Pace the Frontier” (Sep 2026)</Source>
  </Shell>
);

const bStyle: React.CSSProperties = { color: 'var(--osd-text)' };

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <div data-slide-loc="311:2"
    style={{
      display: 'flex',
      gap: 28,
      fontSize: 'var(--osd-size-body)',
      lineHeight: 1.55,
      color: muted,
    }}
  >
    <span data-slide-loc="320:4" style={{ color: 'var(--osd-accent)' }}>▸</span>
    <span data-slide-loc="321:4" style={{ maxWidth: 1420 }}>{children}</span>
  </div>
);

// ——— 3 · your plan got smaller ————————————————————————————————————

const Stat = ({ n, label }: { n: string; label: string }) => (
  <div data-slide-loc="328:2"
    style={{
      background: panel,
      border: `1px solid ${dim}`,
      borderRadius: 'var(--osd-radius)',
      padding: '30px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
  >
    <span data-slide-loc="339:4"
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 56,
        fontWeight: 900,
        color: amber,
        whiteSpace: 'nowrap',
      }}
    >
      {n}
    </span>
    <span data-slide-loc="350:4" style={{ fontSize: 28, lineHeight: 1.4, color: muted }}>{label}</span>
  </div>
);

const PlanDecline: Page = () => (
  <Shell>
    <div data-slide-loc="356:4" style={{ position: 'absolute', left: 120, right: 120, top: 120 }}>
      <h2 data-slide-loc="358:6"
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 84,
          fontWeight: 900,
          lineHeight: 1.2,
          margin: '28px 0 56px',
        }}
      >
        Meanwhile, your plan got{' '}
        <span data-slide-loc="368:8" style={{ color: amber }}>smaller.</span>
      </h2>
      <div data-slide-loc="370:6"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          maxWidth: 1680,
        }}
      >
        <Stat n="~24 h" label="usable Claude Pro per month — paying subscriber’s log" />
        <Stat n="2–2.5 d" label="until a $200 Max plan hits its weekly cap" />
        <Stat n="1.7–5×" label="faster quota burn after the Aug 17 reset" />
        <Stat n="~5 h" label="a Codex plan’s whole weekly allowance, gone" />
      </div>
    </div>
    <Source>
      anthropics/claude-code issues #11810 / #65678 / #87419 · community.openai.com Codex threads 1388643 / 1378553 · retrieved 2026-09-17
    </Source>
  </Shell>
);

// ——— 4 · thesis ——————————————————————————————————————————————————

const ThesisWord = ({
  word,
  gloss,
}: {
  word: string;
  gloss: string;
}) => (
  <div data-slide-loc="399:2" style={{ display: 'flex', alignItems: 'baseline', gap: 44 }}>
    <span data-slide-loc="400:4"
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 110,
        fontWeight: 900,
        color: 'var(--osd-accent)',
        whiteSpace: 'nowrap',
      }}
    >
      {word}
    </span>
    <span data-slide-loc="411:4" style={{ fontSize: 32, color: muted }}>{gloss}</span>
  </div>
);

const Thesis: Page = () => (
  <Shell>
    <div data-slide-loc="417:4"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 72,
        padding: '0 160px',
      }}
    >
      <ThesisWord word="UNSTOPPABLE" gloss="weights don’t answer to a pause" />
      <ThesisWord word="UNLIMITED" gloss="no begging on X for limit resets" />
      <ThesisWord word="ALIGNED" gloss="a model that answers to you, not to a ToS" />
    </div>
  </Shell>
);

// ——— 5 · divider: the pace ————————————————————————————————————————

const Divider = ({
  cmd,
  big,
  note,
}: {
  cmd: string;
  big: string;
  note: string;
}) => (
  <Shell>
    <div data-slide-loc="448:4"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 160px',
      }}
    >
      <Cmd>{cmd}</Cmd>
      <h2 data-slide-loc="459:6"
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 150,
          fontWeight: 900,
          lineHeight: 1.1,
          margin: '36px 0 48px',
          color: 'var(--osd-text)',
        }}
      >
        {big}
      </h2>
      <p data-slide-loc="471:6" style={{ fontSize: 34, color: muted, margin: 0, lineHeight: 1.55 }}>
        {note}
      </p>
    </div>
  </Shell>
);

const DividerPace: Page = () => (
  <Divider
    cmd="cd ~/local && git log --oneline 2026"
    big={<>The <span data-slide-loc="481:15" style={{ color: 'var(--osd-accent)' }}>pace</span></>}
    note={<>Six weeks of open-weight releases. Nobody asked permission.</>}
  />
);

// ——— 6 · timeline —————————————————————————————————————————————————

const TNode = ({
  date,
  model,
  up = false,
  i,
}: {
  date: string;
  model: string;
  up?: boolean;
  i: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const animate = useIsActivePage();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!animate || reduced()) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }
    el.style.opacity = '0';
    const anim = el.animate(
      [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 420, delay: 200 + i * 300, easing: EASE_OUT, fill: 'both' },
    );
    return () => anim.cancel();
  }, [animate, i]);
  return (
  <div data-slide-loc="497:2" ref={ref}
    style={{
      flex: '1 1 0',
      position: 'relative',
      padding: '0 16px',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: -7,
        top: '50%',
        marginTop: -7,
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: 'var(--osd-accent)',
        boxShadow: '0 0 12px rgba(74,222,128,0.7)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 16,
        right: 4,
        [up ? 'bottom' : 'top']: 'calc(50% + 24px)',
      }}
    >
      <div style={{ fontSize: 22, color: 'var(--osd-accent)', marginBottom: 12 }}>{date}</div>
      <div
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 34,
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
        {model}
      </div>
    </div>
  </div>
  );
};

// The rail the nodes sit on: drawn left-to-right so the timeline reads oldest → newest.
const TimelineRule = () => {
  const ref = useRef<HTMLDivElement>(null);
  const animate = useIsActivePage();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!animate || reduced()) {
      el.style.transform = 'none';
      return;
    }
    const anim = el.animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: 2200, delay: 160, easing: EASE_OUT, fill: 'both' },
    );
    return () => anim.cancel();
  }, [animate]);
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: 2,
        background: dim,
        transformOrigin: 'left center',
      }}
    />
  );
};


const Timeline: Page = () => (
  <Shell>
    <div data-slide-loc="536:4" style={{ position: 'absolute', left: 120, right: 120, top: 120 }}>
      <h2 data-slide-loc="538:6"
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 76,
          fontWeight: 900,
          lineHeight: 1.2,
          margin: '28px 0 96px',
        }}
      >
        2026, the year of local AI</h2>
      <div data-slide-loc="549:6"
        style={{
          display: 'flex',
          gap: 0,
          position: 'relative',
          height: 340,
        }}
      >
        <TimelineRule />
        <TNode i={0} date="JUL 27" model="Kimi K3" up />
        <TNode i={1} date="JUL 31" model="DeepSeek V4 Flash" />
        <TNode i={2} date="AUG 14" model="Qwen 3.8 27B" up />
        <TNode i={3} date="AUG 14" model="GLM 5.3" />
        <TNode i={4} date="AUG 26" model="GLM 5.3 Flash" up />
        <TNode i={5} date="AUG 26" model="Qwen 3.8 Flash Next" />
        <TNode i={6} date="SEP 10" model="DeepSeek V4.1 Flash" up />
      </div>
    </div>
    <Source>HF model cards: moonshotai · deepseek-ai · Qwen · zai-org · epoch.ai/models · dated 2026-09-17</Source>
  </Shell>
);

const LagChip = ({ value, label }: { value: string; label: string }) => (
  <div
    style={{
      background: panel,
      border: `1px solid ${dim}`,
      borderRadius: 'var(--osd-radius)',
      padding: '22px 30px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
  >
    <span
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 44,
        fontWeight: 900,
        lineHeight: 1.1,
        color: 'var(--osd-accent)',
      }}
    >
      {value}
    </span>
    <span style={{ fontSize: 24, color: muted }}>{label}</span>
  </div>
);

// ——— 7 · the point of the pace —————————————————————————————————————

const PacePoint: Page = () => (
  <Shell>
    <div data-slide-loc="573:4"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 160px',
      }}
    >
      <h2 data-slide-loc="584:6"
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 96,
          fontWeight: 900,
          lineHeight: 1.25,
          margin: '36px 0 44px',
          maxWidth: 1560,
        }}
      >
        Seven frontier-grade open releases in{' '}
        <span data-slide-loc="595:8" style={{ color: 'var(--osd-accent)' }}>six weeks.</span>
      </h2>
      <div style={{ maxWidth: 1680 }}>
        <div style={{ fontSize: 22, color: muted, letterSpacing: '0.08em', marginBottom: 18 }}>
          weights published → serving, on hardware you own
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <LagChip value="9 h 41 m" label="GLM-5.3-Flash NVFP4" />
          <LagChip value="16 h" label="DeepSeek-V4.1-Flash" />
          <LagChip value="same day" label="Qwen3.8-Flash-Next" />
        </div>
      </div>
      <div style={{ marginTop: 44 }}>
        <Cmd>
          You can’t pace what already shipped.<Cursor />
        </Cmd>
      </div>
    </div>
  </Shell>
);

const LicenceRow = ({
  model,
  licence,
  osi,
  note,
}: {
  model: string;
  licence: string;
  osi: boolean;
  note: string;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '440px 300px 1fr',
      alignItems: 'center',
      gap: 24,
      padding: '16px 28px',
      background: panel,
      border: `1px solid ${dim}`,
      borderLeft: `3px solid ${osi ? 'var(--osd-accent)' : amber}`,
      borderRadius: 'var(--osd-radius)',
    }}
  >
    <span
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 32,
        fontWeight: 800,
        color: 'var(--osd-text)',
      }}
    >
      {model}
    </span>
    <span style={{ fontSize: 26, color: osi ? 'var(--osd-accent)' : amber }}>
      {licence}
    </span>
    <span style={{ fontSize: 26, color: muted }}>{note}</span>
  </div>
);

const Licensing: Page = () => (
  <Shell>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 120 }}>
      <h2
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 72,
          fontWeight: 900,
          lineHeight: 1.2,
          margin: '28px 0 34px',
        }}
      >
        Open weights
        <br />
        <span style={{ color: amber }}>≠ open source.</span>
      </h2>
      <p style={{ fontSize: 28, color: muted, margin: '0 0 44px', lineHeight: 1.5 }}>
        Downloadable is not the same as free to use.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <LicenceRow
          model="Qwen3.8-27B"
          licence="Apache-2.0"
          osi
          note="OSI-approved — take it, ship it, sell it"
        />
        <LicenceRow
          model="GLM-5.3-Flash"
          licence="MIT"
          osi
          note="OSI-approved — the Flash tier is the freer one"
        />
        <LicenceRow
          model="DeepSeek-V4.1-Flash"
          licence="MIT"
          osi
          note="OSI-approved — same terms"
        />
        <LicenceRow
          model="GLM-5.3"
          licence="custom “glm-5.3”"
          osi={false}
          note="not OSI — MaaS over $10B/yr needs Z.ai’s review"
        />
        <LicenceRow
          model="Kimi K3"
          licence="custom “Kimi K3”"
          osi={false}
          note="not OSI — MaaS over $20M/yr needs a separate deal"
        />
      </div>
    </div>
    <Source>HF LICENSE files: zai-org · moonshotai · Qwen · deepseek-ai · retrieved 2026-09-17</Source>
  </Shell>
);

// ——— 8 · divider: hardware ————————————————————————————————————————

const DividerHw: Page = () => (
  <Divider
    cmd="lsblk --tiers"
    big={<>Pick your <span data-slide-loc="609:21" style={{ color: 'var(--osd-accent)' }}>machine</span></>}
    note={<>Five tiers, two models. Measured in tokens/s — single-stream decode, 2026 community benchmarks.</>}
  />
);

const SAMPLE =
  'no queue. no quota meter. no midnight reset. just weights, silence, and a model that answers to you. it reads the repo, drafts the patch, reviews its own diff, and asks for nothing between the first token and the last. past midnight it is still warm, still consistent, still yours — no usage email, no terms of service in the loop. every token local, every token yours.';

const Stream = ({ tps }: { tps: number }) => {
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
    // Derive the visible character count from elapsed time, never from
    // accumulated per-step delays: setTimeout(1000 / tps) fires late and the
    // lateness compounds, so the old chain drifted to ~50 tok/s whatever the
    // tier claimed. Past 60 tok/s a tier renders several characters per frame,
    // so it is the average rate that has to hold, not each step.
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
    <div data-slide-loc="646:4"
      style={{
        background: panel,
        border: `1px solid ${dim}`,
        borderRadius: 'var(--osd-radius)',
        padding: '20px 28px',
        marginBottom: 30,
      }}
    >
      <div data-slide-loc="655:6"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: MONO,
          fontSize: 18,
          color: muted,
          marginBottom: 12,
        }}
      >
        <span data-slide-loc="665:8">
          <span data-slide-loc="666:10" style={{ color: 'var(--osd-accent)' }}>●</span> live — streamed at this tier’s measured speed
        </span>
      </div>
      <div data-slide-loc="669:6" style={{ height: 168, fontSize: 28, lineHeight: 1.5 }}>
        <span data-slide-loc="670:8"
          ref={out}
          style={{ fontFamily: MONO, whiteSpace: 'pre-wrap', color: 'var(--osd-text)' }}
        />
        <Cursor />
      </div>
    </div>
  );
};

// ——— 9–13 · tier pages ————————————————————————————————————————————

const TierBody = ({
  machine,
  model,
  equiv,
  speed,
  speedDecimals,
  note,
  source,
}: {
  machine: string;
  model: string;
  equiv: string;
  speed: number;
  speedDecimals?: number;
  note: string;
  source: string;
}) => (
  <Shell>
    <div data-slide-loc="700:4" style={{ position: 'absolute', left: 120, right: 120, top: 112 }}>
      <h2 data-slide-loc="709:8"
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 72,
          fontWeight: 900,
          lineHeight: 1.18,
          margin: '22px 0 44px',
        }}
      >
        {machine}
      </h2>
      <div data-slide-loc="721:6" style={{ display: 'flex', alignItems: 'baseline', gap: 26, marginBottom: 28 }}>
        <CountUp
          value={speed}
          decimals={speedDecimals}
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 180,
            fontWeight: 900,
            color: 'var(--osd-accent)',
            textShadow: '0 0 44px rgba(74,222,128,0.35)',
            lineHeight: 1,
          }}
        />
        <span data-slide-loc="734:8" style={{ fontSize: 48, fontWeight: 800, color: 'var(--osd-text)' }}>
          tok/s
        </span>
      </div>
      <Stream tps={speed} />
      <div data-slide-loc="739:6" style={{ fontSize: 28, marginBottom: 12 }}>
        <span data-slide-loc="740:8" style={{ color: 'var(--osd-accent)' }}>model ▸ </span>
        <span data-slide-loc="741:8" style={{ color: 'var(--osd-text)' }}>{model}</span>
        <span style={{ color: muted }}> — {equiv}-class intelligence</span>
      </div>
      <div data-slide-loc="743:6" style={{ fontSize: 24, color: muted, lineHeight: 1.5, maxWidth: 1600 }}>
        {note}
      </div>
    </div>
    <Source>{source}</Source>
  </Shell>
);

const TIER_FADE: SlideTransition = {
  duration: 280,
  exit: { duration: 224, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 0 }] },
  enter: { duration: 308, delay: 112, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
};

const TierMacbook: Page = () => (
  <TierBody
    machine="MacBook Pro · M5 Pro, 48 GB"
    model="Qwen 3.8-27B"
    equiv="Opus 4.6"
    speed={74}
    note="Frontier-class coding and vision in a machine that fits a backpack. No CUDA, no daemon, no datacenter."
    source="Splash 1.0 SPEED-Bench (incoai) on M5 Pro (16c), 48 GB · retrieved 2026-09-18"
  />
);

const Tier3090: Page = () => (
  <TierBody
    machine="RTX 3090 · 24 GB"
    model="Qwen 3.8-27B"
    equiv="Opus 4.6"
    speed={138}
    note="A six-year-old used card, still the community’s benchmark box."
    source="MiaAI-Lab EXL3 kit · 3090 stacks · retrieved 2026-09-17"
  />
);

const TierSpark: Page = () => (
  <TierBody
    machine="2× DGX Spark · 256 GB"
    model="GLM-5.3-Flash 320B"
    equiv="Opus 4.8"
    speed={62.9}
    speedDecimals={1}
    note="Twelve times the model on two desk tiles instead of one card. Intelligence that used to need a rack now sits beside your keyboard."
    source="github.com/MiaAI-Lab/GLM-5.3-Flash-EXL3-2x-DGX-Sparks (2026-08-28) · retrieved 2026-09-17"
  />
);

const TierStudio: Page = () => (
  <TierBody
    machine="Mac Studio Ultra · 256 GB"
    model="GLM-5.3-Flash 320B"
    equiv="Opus 4.8"
    speed={51}
    note="All of it in a single Mac — no second box, no rack. Sparse weights do the heavy lifting; slow prefill is the tax."
    source="llmcheck.net · hf.co/grant-ai · retrieved 2026-09-17"
  />
);

const Tier6000: Page = () => (
  <TierBody
    machine="2× RTX PRO 6000 · 192 GB"
    model="GLM-5.3-Flash 320B"
    equiv="Opus 4.8"
    speed={145.5}
    speedDecimals={1}
    note="Nothing offloaded, nothing throttled. The highest end of local AI — faster than the frontier API it replaces."
    source="hf.co/brandonmusic/GLM-5.3-Flash-tr3-4bpw · retrieved 2026-09-17"
  />
);

TierMacbook.transition = TIER_FADE;
Tier3090.transition = TIER_FADE;
TierSpark.transition = TIER_FADE;
TierStudio.transition = TIER_FADE;
Tier6000.transition = TIER_FADE;

// ——— 14 · closing —————————————————————————————————————————————————

const Closing: Page = () => (
  <Shell>
    <div data-slide-loc="826:4"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 160px',
      }}
    >
      <h2 data-slide-loc="836:6"
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 130,
          fontWeight: 900,
          lineHeight: 1.15,
          margin: '0 0 56px',
        }}
      >
        Local AI is
        <br data-slide-loc="846:8" />
        <span data-slide-loc="847:8" style={{ color: 'var(--osd-accent)' }}>freedom tech.</span>
      </h2>
      <div data-slide-loc="849:6" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Cmd>
          splash serve --model incoai/Qwen3.8-27B-Splash
        </Cmd>
        <p data-slide-loc="851:8" style={{ fontSize: 30, color: muted, margin: 0, lineHeight: 1.55 }}>
          One 27B model, on the laptop you already own. Start this week.
          <Cursor />
        </p>
      </div>
      <Source>
        github.com/incoai/splash · retrieved 2026-09-18
      </Source>
    </div>
  </Shell>
);

// ——— deck —————————————————————————————————————————————————————————

export const transition: SlideTransition = {
  duration: 200,
  exit: {
    duration: 140,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-4px)' },
    ],
  },
  enter: {
    duration: 200,
    delay: 80,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

export const meta: SlideMeta = {
  title: 'Run It Yourself — Why Local AI Matters',
  createdAt: '2026-09-17T10:34:34.431Z',
};

export default [
  Cover,
  Pacing,
  PlanDecline,
  Thesis,
  DividerPace,
  Timeline,
  PacePoint,
  Licensing,
  DividerHw,
  TierMacbook,
  Tier3090,
  TierSpark,
  TierStudio,
  Tier6000,
  Closing,
] satisfies Page[];
