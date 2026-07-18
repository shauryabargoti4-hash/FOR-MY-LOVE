/**
 * ScrollRoseVines
 *
 * Decorative rose vine SVGs fixed to the left and right edges of the page.
 * Scroll-driven animation using plain React + CSS:
 *   – vine stem grows via stroke-dashoffset
 *   – leaves unfold in opacity bands
 *   – roses bloom from bud → blush → deep rose via CSS color interpolation
 *
 * No external animation library required.
 */

import { useEffect, useState, useCallback } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Linear interpolation between two numbers */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/** Map a scroll value [0,1] through a band [start,end] → [0,1] */
function band(scroll: number, start: number, end: number): number {
  if (scroll <= start) return 0;
  if (scroll >= end) return 1;
  return (scroll - start) / (end - start);
}

/** Interpolate between two hex colors at ratio t [0,1] */
function lerpColor(a: string, b: string, t: number): string {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const rr = Math.round(lerp(ar, br, t));
  const rg = Math.round(lerp(ag, bg, t));
  const rb = Math.round(lerp(ab, bb, t));
  return `rgb(${rr},${rg},${rb})`;
}

/** Three-stop color interpolation: green → blush → deep rose */
function petalColor(scroll: number, start: number): string {
  const t1 = band(scroll, start, start + 0.35);       // green → blush
  const t2 = band(scroll, start + 0.35, start + 0.75); // blush → deep rose
  if (t2 > 0) return lerpColor("#e8a8b8", "#8b2252", t2);
  return lerpColor("#4a7c4e", "#e8a8b8", t1);
}

// SVG total path length for the main stem (approximate)
const STEM_LENGTH = 1080;

// ─── SVG Vine (shared for left, mirrored via scaleX for right) ───────────────

interface VineProps {
  scroll: number;
}

function VineSvg({ scroll }: VineProps) {
  // Vine growth: stem draws from 0→STEM_LENGTH as scroll goes 0→0.88
  const drawn = lerp(0, STEM_LENGTH, band(scroll, 0, 0.88));
  const dashOffset = STEM_LENGTH - drawn;

  // Branch drawing (all branches share same progress, slightly delayed)
  const branchDrawn = lerp(0, 300, band(scroll, 0.04, 0.88));
  const branchOffset = 300 - branchDrawn;

  // Leaf opacities — 5 bands
  const lA = band(scroll, 0.04, 0.20) * 0.82;
  const lB = band(scroll, 0.20, 0.38) * 0.82;
  const lC = band(scroll, 0.38, 0.56) * 0.82;
  const lD = band(scroll, 0.56, 0.74) * 0.82;
  const lE = band(scroll, 0.74, 0.90) * 0.82;

  // Rose bloom scales & colors (each blooms in its own scroll band)
  const r1Scale   = lerp(0, 1, band(scroll, 0.08, 0.26));
  const r1Opacity = band(scroll, 0.08, 0.20);
  const r1Color   = petalColor(scroll, 0.08);

  const r2Scale   = lerp(0, 1, band(scroll, 0.26, 0.44));
  const r2Opacity = band(scroll, 0.26, 0.38);
  const r2Color   = petalColor(scroll, 0.26);

  const r3Scale   = lerp(0, 1, band(scroll, 0.44, 0.62));
  const r3Opacity = band(scroll, 0.44, 0.56);
  const r3Color   = petalColor(scroll, 0.44);

  const r4Scale   = lerp(0, 1, band(scroll, 0.62, 0.80));
  const r4Opacity = band(scroll, 0.62, 0.74);
  const r4Color   = petalColor(scroll, 0.62);

  const vine = "#4a7c4e";

  return (
    <svg
      viewBox="0 0 130 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      {/* ── Main Winding Stem ──────────────────────────────────────────── */}
      <path
        d="M 68 -20
           C 44 90 98 185 62 305
           C 32 405 94 488 56 608
           C 24 705 90 788 60 908
           C 37 972 70 1000 68 1022"
        stroke={vine}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        pathLength={STEM_LENGTH}
        strokeDasharray={STEM_LENGTH}
        strokeDashoffset={dashOffset}
        style={{ transition: "stroke-dashoffset 0.08s linear" }}
      />

      {/* ── Branches ──────────────────────────────────────────────────── */}
      {/* Branch 1 — y≈265, toward left */}
      <path
        d="M 64 265 C 48 255 30 246 13 240"
        stroke={vine} strokeWidth="1.7" fill="none" strokeLinecap="round"
        pathLength={300} strokeDasharray={300} strokeDashoffset={branchOffset}
        style={{ transition: "stroke-dashoffset 0.08s linear" }}
      />
      {/* Branch 2 — y≈490, toward right */}
      <path
        d="M 60 490 C 80 478 102 470 118 465"
        stroke={vine} strokeWidth="1.7" fill="none" strokeLinecap="round"
        pathLength={300} strokeDasharray={300} strokeDashoffset={branchOffset}
        style={{ transition: "stroke-dashoffset 0.08s linear" }}
      />
      {/* Branch 3 — y≈662, toward left */}
      <path
        d="M 58 662 C 42 650 24 642 9 636"
        stroke={vine} strokeWidth="1.7" fill="none" strokeLinecap="round"
        pathLength={300} strokeDasharray={300} strokeDashoffset={branchOffset}
        style={{ transition: "stroke-dashoffset 0.08s linear" }}
      />
      {/* Branch 4 — y≈880, toward right */}
      <path
        d="M 62 880 C 82 868 105 860 120 856"
        stroke={vine} strokeWidth="1.7" fill="none" strokeLinecap="round"
        pathLength={300} strokeDasharray={300} strokeDashoffset={branchOffset}
        style={{ transition: "stroke-dashoffset 0.08s linear" }}
      />

      {/* ── Leaves ────────────────────────────────────────────────────── */}
      {/* Pair A */}
      <path d="M66 148 C56 134 48 139 54 148 C48 157 56 162 66 148 Z"
        fill={vine} opacity={lA} transform="rotate(-38 66 148)"
        style={{ transition: "opacity 0.3s ease" }} />
      <path d="M60 208 C70 194 78 199 72 208 C78 217 70 222 60 208 Z"
        fill={vine} opacity={lA} transform="rotate(22 60 208)"
        style={{ transition: "opacity 0.3s ease" }} />
      {/* Pair B */}
      <path d="M64 372 C54 358 46 363 52 372 C46 381 54 386 64 372 Z"
        fill={vine} opacity={lB} transform="rotate(-28 64 372)"
        style={{ transition: "opacity 0.3s ease" }} />
      <path d="M57 432 C67 418 75 423 69 432 C75 441 67 446 57 432 Z"
        fill={vine} opacity={lB} transform="rotate(33 57 432)"
        style={{ transition: "opacity 0.3s ease" }} />
      {/* Pair C */}
      <path d="M61 542 C51 528 43 533 49 542 C43 551 51 556 61 542 Z"
        fill={vine} opacity={lC} transform="rotate(-24 61 542)"
        style={{ transition: "opacity 0.3s ease" }} />
      <path d="M58 595 C68 581 76 586 70 595 C76 604 68 609 58 595 Z"
        fill={vine} opacity={lC} transform="rotate(30 58 595)"
        style={{ transition: "opacity 0.3s ease" }} />
      {/* Pair D */}
      <path d="M62 758 C52 744 44 749 50 758 C44 767 52 772 62 758 Z"
        fill={vine} opacity={lD} transform="rotate(-30 62 758)"
        style={{ transition: "opacity 0.3s ease" }} />
      <path d="M59 818 C69 804 77 809 71 818 C77 827 69 832 59 818 Z"
        fill={vine} opacity={lD} transform="rotate(26 59 818)"
        style={{ transition: "opacity 0.3s ease" }} />
      {/* Pair E */}
      <path d="M64 952 C54 938 46 943 52 952 C46 961 54 966 64 952 Z"
        fill={vine} opacity={lE} transform="rotate(-22 64 952)"
        style={{ transition: "opacity 0.3s ease" }} />

      {/* ── Roses ─────────────────────────────────────────────────────── */}
      {/* Rose 1 — tip of Branch 1 (cx=11, cy=234) */}
      <g
        transform={`translate(11, 234) scale(${r1Scale})`}
        style={{ transformOrigin: "11px 234px", opacity: r1Opacity, transition: "opacity 0.2s ease" }}
      >
        <Rose color={r1Color} />
      </g>

      {/* Rose 2 — tip of Branch 2 (cx=120, cy=459) */}
      <g
        transform={`translate(120, 459) scale(${r2Scale})`}
        style={{ transformOrigin: "120px 459px", opacity: r2Opacity, transition: "opacity 0.2s ease" }}
      >
        <Rose color={r2Color} />
      </g>

      {/* Rose 3 — tip of Branch 3 (cx=7, cy=630) */}
      <g
        transform={`translate(7, 630) scale(${r3Scale})`}
        style={{ transformOrigin: "7px 630px", opacity: r3Opacity, transition: "opacity 0.2s ease" }}
      >
        <Rose color={r3Color} />
      </g>

      {/* Rose 4 — tip of Branch 4 (cx=122, cy=850) */}
      <g
        transform={`translate(122, 850) scale(${r4Scale})`}
        style={{ transformOrigin: "122px 850px", opacity: r4Opacity, transition: "opacity 0.2s ease" }}
      >
        <Rose color={r4Color} />
      </g>
    </svg>
  );
}

// ─── Rose Shape (drawn at origin 0,0; parent <g> handles placement) ──────────
// Outer 6 petals + inner 6 petals + center disc + sepal

function Rose({ color }: { color: string }) {
  const outerAngles = [0, 60, 120, 180, 240, 300];
  const innerAngles = [30, 90, 150, 210, 270, 330];
  return (
    <>
      {/* Sepal — always green, behind petals */}
      <path
        d="M0 7 C-5 3 -6 -4 0 -2 C6 -4 5 3 0 7 Z"
        fill="#3d6b42"
        opacity={0.92}
      />
      {/* Outer petal ring */}
      {outerAngles.map((angle) => (
        <ellipse
          key={`op${angle}`}
          cx={0}
          cy={-7}
          rx={5.5}
          ry={10}
          fill={color}
          opacity={0.52}
          transform={`rotate(${angle})`}
        />
      ))}
      {/* Inner petal ring */}
      {innerAngles.map((angle) => (
        <ellipse
          key={`ip${angle}`}
          cx={0}
          cy={-5}
          rx={4}
          ry={7.5}
          fill={color}
          opacity={0.72}
          transform={`rotate(${angle})`}
        />
      ))}
      {/* Center disc */}
      <circle cx={0} cy={0} r={3.5} fill={color} opacity={0.95} />
      {/* Highlight spot */}
      <circle cx={-1} cy={-1} r={1.6} fill="#fff8f2" opacity={0.38} />
    </>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function ScrollRoseVines() {
  const [scroll, setScroll] = useState(0);
  const [mounted, setMounted] = useState(false);

  const onScroll = useCallback(() => {
    const top = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    setScroll(max > 0 ? Math.min(1, top / max) : 0);
  }, []);

  useEffect(() => {
    setMounted(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onScroll]);

  if (!mounted) return null;

  const svgWrapStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    width: "130px",
    height: "100vh",
    pointerEvents: "none",
    userSelect: "none",
    zIndex: 4,
    opacity: 0.80,
    overflow: "visible",
  };

  return (
    <>
      {/* Left vine */}
      <div style={{ ...svgWrapStyle, left: 0 }}>
        <VineSvg scroll={scroll} />
      </div>

      {/* Right vine — mirror of left */}
      <div style={{ ...svgWrapStyle, right: 0, transform: "scaleX(-1)" }}>
        <VineSvg scroll={scroll} />
      </div>
    </>
  );
}
