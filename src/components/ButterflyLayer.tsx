/**
 * ButterflyLayer
 *
 * Spawns 4 SVG butterflies that fly organically across the page using a
 * physics-inspired velocity + bezier-interpolated target system.
 *
 * Features:
 *  – Organic sine-wave oscillation on flight paths
 *  – Landing behaviour: wings slow, butterfly rests 3–7 seconds
 *  – Cursor proximity: butterfly flees naturally when hovered
 *  – One "guide" butterfly that periodically circles a hint position
 *    and shows a subtle "something is hidden here…" tooltip
 *  – Each butterfly rotates to face its direction of travel
 *  – Wing flutter speed adjusts to state (resting / flying / fleeing)
 *  – All animation via RAF loop + direct DOM mutation (no re-renders)
 *
 * No external animation libraries required.
 */

import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BState = "spawning" | "flying" | "resting" | "fleeing" | "guiding";

interface BConfig {
  id: string;
  spawnMs: number;
  isGuide: boolean;
  wingColor: string;
  lowerColor: string;
  size: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + Math.round(255 * amt));
  const g = Math.min(255, ((n >> 8)  & 0xff) + Math.round(255 * amt));
  const b = Math.min(255, ((n)       & 0xff) + Math.round(255 * amt));
  return `rgb(${r},${g},${b})`;
}

// ─── Butterfly SVG ────────────────────────────────────────────────────────────
// Drawn centred at (0,0). Parent <div> handles position + rotation.
// CSS custom property --fs on the outer wrapper controls flutter speed.

function ButterflySVG({
  id, wingColor, lowerColor, size, isGuide,
}: {
  id: string; wingColor: string; lowerColor: string;
  size: number; isGuide: boolean;
}) {
  const body   = "#3A2B27";
  const spot   = "#5E2A35";
  const gold   = "#D6B97A";
  const vein   = "#3A2B2744";

  return (
    <>
      <style>{`
        /* Left-wing fold: scaleX 1 → near-zero → 1 */
        @keyframes ${id}-lw {
          0%, 100% { transform: scaleX(1);    }
          48%, 52% { transform: scaleX(0.06); }
        }
        /* Right-wing fold: starts mirrored */
        @keyframes ${id}-rw {
          0%, 100% { transform: scaleX(-1);    }
          48%, 52% { transform: scaleX(-0.06); }
        }
        /* Guide pulse ring */
        @keyframes ${id}-gp {
          0%, 100% { opacity: 0.45; transform: scale(1.00); }
          50%       { opacity: 0.85; transform: scale(1.18); }
        }
      `}</style>

      <svg
        width={size * 2.6}
        height={size * 2.2}
        viewBox="-42 -38 84 76"
        fill="none"
        style={{ overflow: "visible", display: "block" }}
        aria-hidden="true"
      >
        {/* Guide butterfly gets an orbiting pulse ring */}
        {isGuide && (
          <circle cx="0" cy="10" r="30"
            stroke={gold} strokeWidth="0.9" fill="none"
            style={{ animation: `${id}-gp 1.7s ease-in-out infinite`,
                     transformOrigin: "0px 10px" }} />
        )}

        {/* ── Antennae ── */}
        <path d="M-2 -8 C-6 -18 -14 -26 -12 -34"
          stroke={body} strokeWidth="0.9" strokeLinecap="round" />
        <circle cx="-12" cy="-34" r="2" fill={gold} />
        <path d="M2 -8 C6 -18 14 -26 12 -34"
          stroke={body} strokeWidth="0.9" strokeLinecap="round" />
        <circle cx="12" cy="-34" r="2" fill={gold} />

        {/* ── Left wings group (folds toward body at x=0) ── */}
        <g style={{
          transformOrigin: "0px 8px",
          animationName: `${id}-lw`,
          animationDuration: "var(--fs, 0.22s)",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}>
          {/* Upper left wing */}
          <path d="M0 0 C-14 -20 -42 -24 -40 -8 C-38 6 -22 14 0 22 Z"
            fill={wingColor} opacity="0.88" />
          <path d="M0 4 C-12 -4 -30 -12 -34 -4"
            stroke={vein} strokeWidth="0.6" />
          <path d="M0 4 C-8 2 -20 8 -24 16"
            stroke={vein} strokeWidth="0.5" />
          {/* Eye spot upper left */}
          <circle cx="-26" cy="-4" r="4.5" fill={spot} opacity="0.52" />
          <circle cx="-26" cy="-4" r="2.2" fill={gold}  opacity="0.65" />
          <circle cx="-26" cy="-4" r="0.8" fill="#fff"  opacity="0.50" />

          {/* Lower left wing */}
          <path d="M0 20 C-10 14 -32 18 -30 34 C-28 46 -14 44 0 36 Z"
            fill={lowerColor} opacity="0.80" />
          <path d="M0 24 C-8 20 -22 24 -24 32"
            stroke={vein} strokeWidth="0.5" />
          <circle cx="-18" cy="28" r="3" fill={spot} opacity="0.42" />
          <circle cx="-18" cy="28" r="1.4" fill={gold} opacity="0.55" />
        </g>

        {/* ── Right wings group (mirror of left) ── */}
        <g style={{
          transformOrigin: "0px 8px",
          animationName: `${id}-rw`,
          animationDuration: "var(--fs, 0.22s)",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}>
          {/* Upper right wing */}
          <path d="M0 0 C14 -20 42 -24 40 -8 C38 6 22 14 0 22 Z"
            fill={wingColor} opacity="0.88" />
          <path d="M0 4 C12 -4 30 -12 34 -4"
            stroke={vein} strokeWidth="0.6" />
          <path d="M0 4 C8 2 20 8 24 16"
            stroke={vein} strokeWidth="0.5" />
          <circle cx="26" cy="-4" r="4.5" fill={spot} opacity="0.52" />
          <circle cx="26" cy="-4" r="2.2" fill={gold}  opacity="0.65" />
          <circle cx="26" cy="-4" r="0.8" fill="#fff"  opacity="0.50" />

          {/* Lower right wing */}
          <path d="M0 20 C10 14 32 18 30 34 C28 46 14 44 0 36 Z"
            fill={lowerColor} opacity="0.80" />
          <path d="M0 24 C8 20 22 24 24 32"
            stroke={vein} strokeWidth="0.5" />
          <circle cx="18" cy="28" r="3" fill={spot} opacity="0.42" />
          <circle cx="18" cy="28" r="1.4" fill={gold} opacity="0.55" />
        </g>

        {/* ── Body ── */}
        <ellipse cx="0" cy="12" rx="2.8" ry="24" fill={body} />
        <ellipse cx="-0.6" cy="8"  rx="1.1" ry="9"
          fill={lighten(body, 0.35)} opacity="0.45" />

        {/* Head */}
        <circle cx="0" cy="-7" r="3.8" fill={body} />
        <circle cx="-1" cy="-8" r="1.2" fill={lighten(body, 0.3)} opacity="0.4" />
      </svg>
    </>
  );
}

// ─── Single Butterfly Instance ────────────────────────────────────────────────

function ButterflyInstance({ cfg }: { cfg: BConfig }) {
  const domRef    = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number>(0);
  const posRef    = useRef({ x: -200, y: -200 });
  const velRef    = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 400, y: 300 });
  const stateRef  = useRef<BState>("spawning");
  const rotRef    = useRef(0);
  const lastTsRef = useRef(0);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const restTRef  = useRef(0);     // ms remaining in rest
  const guideTRef = useRef(0);     // ms accumulator for guide trigger
  const [guideHint, setGuideHint] = useState(false);

  // ── Stable helper functions (use only refs) ─────────────────────────────

  const pickTarget = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    targetRef.current = {
      x: vw * (0.12 + Math.random() * 0.76),
      y: vh * (0.12 + Math.random() * 0.76),
    };
  };

  const doRest = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Aim for a "decorative" zone — near center columns
    targetRef.current = {
      x: vw * (0.28 + Math.random() * 0.44),
      y: vh * (0.22 + Math.random() * 0.56),
    };
    stateRef.current = "resting";
    restTRef.current = 3000 + Math.random() * 4000;
  };

  const spawn = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const edge = Math.floor(Math.random() * 4);
    const p = posRef.current;
    const v = velRef.current;
    if      (edge === 0) { p.x = -80;     p.y = Math.random() * vh; }
    else if (edge === 1) { p.x = vw + 80; p.y = Math.random() * vh; }
    else if (edge === 2) { p.x = Math.random() * vw; p.y = -80; }
    else                 { p.x = Math.random() * vw; p.y = vh + 80; }
    v.x = 0; v.y = 0;
    pickTarget();
    stateRef.current = "flying";
  };

  // ── Global mouse tracking ──────────────────────────────────────────────

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── Spawn after delay ──────────────────────────────────────────────────

  useEffect(() => {
    const t = setTimeout(() => spawn(), cfg.spawnMs);
    return () => clearTimeout(t);
  }, []);

  // ── Guide hint cleanup ─────────────────────────────────────────────────

  const guideHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (guideHintTimerRef.current) clearTimeout(guideHintTimerRef.current);
    };
  }, []);

  // ── RAF animation loop ─────────────────────────────────────────────────

  useEffect(() => {
    const tick = (ts: number) => {
      const el = domRef.current;
      if (!el || stateRef.current === "spawning") {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const dt  = Math.min(ts - lastTsRef.current, 50);
      lastTsRef.current = ts;

      const pos   = posRef.current;
      const vel   = velRef.current;
      const tgt   = targetRef.current;
      const mouse = mouseRef.current;
      const state = stateRef.current;
      const vw    = window.innerWidth;
      const vh    = window.innerHeight;

      // ── Cursor flee ──────────────────────────────────────────────────
      const mdx = mouse.x - pos.x;
      const mdy = mouse.y - pos.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

      if (mdist < 72 && state !== "fleeing") {
        stateRef.current = "fleeing";
        const angle = Math.atan2(mdy, mdx) + Math.PI;
        vel.x = Math.cos(angle) * 14;
        vel.y = Math.sin(angle) * 14;
        targetRef.current = {
          x: pos.x + Math.cos(angle) * 340,
          y: pos.y + Math.sin(angle) * 340,
        };
      }

      // ── Guide behaviour ──────────────────────────────────────────────
      if (cfg.isGuide && state === "flying") {
        guideTRef.current += dt;
        if (guideTRef.current > 22000) {
          guideTRef.current = 0;
          stateRef.current = "guiding";
          // Circle near the hero section interactive zone
          const cx = vw * 0.50 + Math.sin(ts * 0.0008) * 55;
          const cy = vh * 0.42 + Math.cos(ts * 0.0006) * 30;
          targetRef.current = { x: cx, y: cy };

          setGuideHint(true);
          guideHintTimerRef.current = setTimeout(() => setGuideHint(false), 4500);

          // Return to normal after 7s
          setTimeout(() => {
            if (stateRef.current === "guiding") {
              stateRef.current = "flying";
              pickTarget();
            }
          }, 7000);
        }
      }

      // ── Physics ──────────────────────────────────────────────────────
      const ACCEL   = state === "fleeing" ? 0.055 : state === "resting" ? 0.022 : 0.020;
      const DAMP    = state === "fleeing" ? 0.87  : state === "resting" ? 0.76  : 0.91;
      const SINE_A  = state === "fleeing" ? 0.4   : state === "resting" ? 0.2   : 1.4;
      const SINE_F  = 0.0016;
      const PHASE   = parseInt(cfg.id.replace(/\D/g, "").slice(0, 4) || "0", 10);

      const dx = tgt.x - pos.x;
      const dy = tgt.y - pos.y;
      vel.x = (vel.x + dx * ACCEL) * DAMP;
      vel.y = (vel.y + dy * ACCEL) * DAMP;

      // Perpendicular oscillation for natural sine-path
      const spd = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
      const nx  = spd > 0.01 ? vel.x / spd : 0;
      const ny  = spd > 0.01 ? vel.y / spd : 1;
      const sine = Math.sin(ts * SINE_F + PHASE) * SINE_A;

      pos.x += vel.x + (-ny * sine);
      pos.y += vel.y + ( nx * sine);

      // ── Rotation: face direction of travel ───────────────────────────
      if (spd > 0.4) {
        const targetRot = Math.atan2(vel.y, vel.x) * (180 / Math.PI) + 90;
        const diff      = ((targetRot - rotRef.current + 540) % 360) - 180;
        rotRef.current += diff * 0.10;
      }

      // ── Flutter speed via CSS custom property ────────────────────────
      const fs = state === "resting" ? 0.65 + Math.random() * 0.15
               : state === "fleeing" ? 0.09
               : 0.18 + Math.sin(ts * 0.001) * 0.03; // subtle organic variation
      el.style.setProperty("--fs", `${fs}s`);

      // ── Apply transform ───────────────────────────────────────────────
      el.style.transform =
        `translate(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px)` +
        ` rotate(${rotRef.current.toFixed(1)}deg)`;

      // ── State transitions ─────────────────────────────────────────────
      const distToTgt = Math.sqrt(dx * dx + dy * dy);

      if (state === "flying" && distToTgt < 28 && spd < 2.5) {
        if (Math.random() < 0.38) doRest();
        else pickTarget();
      }

      if (state === "resting") {
        restTRef.current -= dt;
        if (restTRef.current <= 0 || mdist < 110) {
          stateRef.current = "flying";
          pickTarget();
        }
      }

      if (state === "fleeing" && distToTgt < 35 && spd < 1.8) {
        stateRef.current = "flying";
        pickTarget();
      }

      if (state === "guiding") {
        // Update circling target continuously
        const cx = vw * 0.50 + Math.sin(ts * 0.0008) * 55;
        const cy = vh * 0.42 + Math.cos(ts * 0.0007) * 35;
        targetRef.current = { x: cx, y: cy };
      }

      // ── Off-screen → respawn ─────────────────────────────────────────
      if (pos.x < -220 || pos.x > vw + 220 || pos.y < -220 || pos.y > vh + 220) {
        spawn();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={domRef}
      className="fixed top-0 left-0 z-[14] pointer-events-auto"
      style={{
        willChange: "transform",
        transform: "translate(-300px,-300px)",
        // Offset so the butterfly appears centred on its position
        marginLeft: `${-cfg.size * 1.3}px`,
        marginTop:  `${-cfg.size * 1.1}px`,
      }}
    >
      <ButterflySVG
        id={cfg.id}
        wingColor={cfg.wingColor}
        lowerColor={cfg.lowerColor}
        size={cfg.size}
        isGuide={cfg.isGuide}
      />

      {/* Guide hint tooltip */}
      {guideHint && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-42px",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#B68A35",
            fontFamily: "serif",
            background: "rgba(246,241,232,0.90)",
            border: "1px solid rgba(214,185,122,0.4)",
            borderRadius: "2px",
            padding: "4px 10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
            animation: "fadeInUp 0.4s ease",
          }}
        >
          ✦ something hidden awaits…
        </div>
      )}
    </div>
  );
}

// ─── Butterfly Configs ────────────────────────────────────────────────────────

const CONFIGS: BConfig[] = [
  {
    id:         "bf1",
    spawnMs:    1800,
    isGuide:    false,
    wingColor:  "#C4873A",         // warm amber
    lowerColor: "#E8A84A",
    size:       22,
  },
  {
    id:         "bf2",
    spawnMs:    5500,
    isGuide:    false,
    wingColor:  "#8A6090",         // soft mauve
    lowerColor: "#B890C0",
    size:       18,
  },
  {
    id:         "bf3",
    spawnMs:    9000,
    isGuide:    false,
    wingColor:  "#7A5C3A",         // espresso-amber
    lowerColor: "#A88050",
    size:       20,
  },
  {
    id:         "bf-guide",
    spawnMs:    7000,
    isGuide:    true,
    wingColor:  "#C8A848",         // champagne gold
    lowerColor: "#E8CC80",
    size:       25,
  },
];

// ─── Layer Component ──────────────────────────────────────────────────────────

export default function ButterflyLayer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {CONFIGS.map((cfg) => (
        <ButterflyInstance key={cfg.id} cfg={cfg} />
      ))}
    </>
  );
}
