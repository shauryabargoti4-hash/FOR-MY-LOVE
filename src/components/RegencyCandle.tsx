/**
 * RegencyCandle
 *
 * An elegant Regency-era SVG candle with:
 *  – Continuously flickering flame (procedural CSS keyframe chaos)
 *  – Cursor-proximity lean, glow expansion, brightness boost
 *  – Gently rising smoke particles that react to proximity
 *
 * No external dependencies — plain React + CSS.
 * Each instance generates unique animation IDs so multiple candles flicker independently.
 */

import { useEffect, useRef, useState, useCallback } from "react";

interface RegencyCandleProps {
  /** Height of the candle body in SVG units (default 80) */
  bodyHeight?: number;
  /** className for the outer wrapper */
  className?: string;
  /** Inline style for the outer wrapper */
  style?: React.CSSProperties;
  /** How many degrees the flame can lean at maximum proximity (default 9) */
  maxLean?: number;
  /** Cursor proximity radius in px (default 200) */
  proximityRadius?: number;
}

export default function RegencyCandle({
  bodyHeight = 80,
  className = "",
  style,
  maxLean = 9,
  proximityRadius = 200,
}: RegencyCandleProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Lean angle (-maxLean … +maxLean) and proximity intensity (0…1)
  const [lean, setLean] = useState(0);
  const [prox, setProx] = useState(0);

  // Stable unique prefix so each candle has independent keyframe names
  const id = useRef(`rc-${Math.random().toString(36).slice(2, 8)}`).current;

  // ── Cursor tracking ──────────────────────────────────────────────────────
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      // Flame center is near the top of the wrapper
      const fx = rect.left + rect.width / 2;
      const fy = rect.top + 16; // approx flame y
      const dx = e.clientX - fx;
      const dy = e.clientY - fy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < proximityRadius) {
        const t = 1 - dist / proximityRadius;
        setProx(t);
        setLean((dx / proximityRadius) * maxLean * t);
      } else {
        setProx((p) => Math.max(0, p - 0.06));
        setLean((l) => l * 0.88);
      }
    },
    [maxLean, proximityRadius]
  );

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  // ── Derived values ────────────────────────────────────────────────────────
  const glowBaseR = 22;
  const glowR = glowBaseR + prox * 26;          // 22 → 48
  const glowOpacity = 0.18 + prox * 0.28;       // 0.18 → 0.46
  const smokeOpacity = 0.28 + prox * 0.22;      // 0.28 → 0.50 (more visible when disturbed)
  const smokeDur = prox > 0.5 ? "1.5s" : "2.6s"; // faster when cursor close

  // ── SVG geometry ─────────────────────────────────────────────────────────
  const W = 46;                     // total SVG width
  const cx = W / 2;                 // center x
  const FLAME_BASE_Y = 28;          // y where flame meets wick
  const BODY_TOP = FLAME_BASE_Y + 6;
  const BODY_H = bodyHeight;
  const BODY_W_TOP = 13;            // candle width at top (taper)
  const BODY_W_BOT = 15;            // candle width at bottom
  const TOTAL_H = BODY_TOP + BODY_H + 18; // +18 for holder

  return (
    <div
      ref={wrapRef}
      className={`inline-block select-none pointer-events-none ${className}`}
      style={{ ...style }}
    >
      {/* ── Scoped keyframes ── */}
      <style>{`
        /* Outer flame — slow sway */
        @keyframes ${id}-fo {
          0%,100% { transform: rotate(-1.8deg) scaleX(0.96); }
          22%      { transform: rotate( 1.4deg) scaleX(1.04); }
          44%      { transform: rotate(-2.2deg) scaleX(0.94); }
          66%      { transform: rotate( 0.9deg) scaleX(1.02); }
          85%      { transform: rotate(-1.2deg) scaleX(0.98); }
        }
        /* Middle flame — medium flicker */
        @keyframes ${id}-fm {
          0%,100% { transform: scaleX(0.97) scaleY(0.96); opacity: 0.82; }
          30%      { transform: scaleX(1.04) scaleY(1.04); opacity: 1.00; }
          55%      { transform: scaleX(0.95) scaleY(0.93); opacity: 0.88; }
          78%      { transform: scaleX(1.01) scaleY(1.01); opacity: 0.95; }
        }
        /* Inner flame — fast pulse */
        @keyframes ${id}-fi {
          0%,100% { transform: scaleY(0.93); opacity: 0.88; }
          35%      { transform: scaleY(1.06); opacity: 1.00; }
          65%      { transform: scaleY(0.96); opacity: 0.92; }
        }
        /* Glow breathe */
        @keyframes ${id}-gl {
          0%,100% { transform: scale(1.00); opacity: ${(glowOpacity).toFixed(2)}; }
          40%      { transform: scale(1.08); opacity: ${(glowOpacity + 0.06).toFixed(2)}; }
          72%      { transform: scale(0.95); opacity: ${(glowOpacity - 0.04).toFixed(2)}; }
        }
        /* Smoke A */
        @keyframes ${id}-sa {
          0%   { transform: translateY(0px)  translateX(0px) scale(1);   opacity: ${smokeOpacity}; }
          50%  { transform: translateY(-18px) translateX(2px) scale(1.5); opacity: ${(smokeOpacity * 0.55).toFixed(2)}; }
          100% { transform: translateY(-36px) translateX(-1px) scale(2.1); opacity: 0; }
        }
        /* Smoke B */
        @keyframes ${id}-sb {
          0%   { transform: translateY(0px)  translateX(0px) scale(1);   opacity: ${(smokeOpacity * 0.85).toFixed(2)}; }
          50%  { transform: translateY(-20px) translateX(-3px) scale(1.7); opacity: ${(smokeOpacity * 0.45).toFixed(2)}; }
          100% { transform: translateY(-40px) translateX(2px)  scale(2.4); opacity: 0; }
        }
        /* Smoke C */
        @keyframes ${id}-sc {
          0%   { transform: translateY(0px)  translateX(0px) scale(1);   opacity: ${(smokeOpacity * 0.7).toFixed(2)}; }
          50%  { transform: translateY(-15px) translateX(4px) scale(1.4); opacity: ${(smokeOpacity * 0.35).toFixed(2)}; }
          100% { transform: translateY(-30px) translateX(-2px) scale(2.0); opacity: 0; }
        }
      `}</style>

      <svg
        width={W}
        height={TOTAL_H}
        viewBox={`0 0 ${W} ${TOTAL_H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Warm ambient glow */}
          <radialGradient id={`${id}-grd`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFD066" stopOpacity="0.75" />
            <stop offset="55%"  stopColor="#FF8C00" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF4500" stopOpacity="0"   />
          </radialGradient>
          {/* Candle body horizontal gradient (light left → shadow right) */}
          <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#f5edda" />
            <stop offset="30%"  stopColor="#fdf8ee" />
            <stop offset="100%" stopColor="#d8c9aa" />
          </linearGradient>
        </defs>

        {/* ══ Ambient glow ellipse (scales with proximity) ════════════════ */}
        <ellipse
          cx={cx}
          cy={FLAME_BASE_Y - 4}
          rx={glowR * 1.5}
          ry={glowR}
          fill={`url(#${id}-grd)`}
          style={{
            animation: `${id}-gl 1.9s ease-in-out infinite`,
            transformOrigin: `${cx}px ${FLAME_BASE_Y - 4}px`,
            transition: "rx 0.35s ease, ry 0.35s ease, opacity 0.35s ease",
          }}
        />

        {/* ══ Smoke particles (rise above flame) ══════════════════════════ */}
        <circle
          cx={cx - 1.5}
          cy={FLAME_BASE_Y - 22}
          r={2}
          fill="#c2bba8"
          style={{
            animation: `${id}-sa ${smokeDur} ease-out infinite`,
            animationDelay: "0s",
            transformOrigin: `${cx - 1.5}px ${FLAME_BASE_Y - 22}px`,
            transition: "animationDuration 0.4s",
          }}
        />
        <circle
          cx={cx + 2}
          cy={FLAME_BASE_Y - 24}
          r={1.5}
          fill="#b8b2a0"
          style={{
            animation: `${id}-sb ${smokeDur} ease-out infinite`,
            animationDelay: "0.9s",
            transformOrigin: `${cx + 2}px ${FLAME_BASE_Y - 24}px`,
          }}
        />
        <circle
          cx={cx}
          cy={FLAME_BASE_Y - 20}
          r={1.2}
          fill="#ccc5b2"
          style={{
            animation: `${id}-sc ${smokeDur} ease-out infinite`,
            animationDelay: "1.7s",
            transformOrigin: `${cx}px ${FLAME_BASE_Y - 20}px`,
          }}
        />

        {/* ══ Flame group — tilts with cursor lean ════════════════════════ */}
        <g
          style={{
            transform: `rotate(${lean.toFixed(2)}deg)`,
            transformOrigin: `${cx}px ${FLAME_BASE_Y}px`,
            transition: "transform 0.12s ease-out",
          }}
        >
          {/* Outer flame — warm orange, wide sway */}
          <path
            d={`M${cx} ${FLAME_BASE_Y}
                C${cx - 8} ${FLAME_BASE_Y - 6} ${cx - 9} ${FLAME_BASE_Y - 17} ${cx} ${FLAME_BASE_Y - 26}
                C${cx + 9} ${FLAME_BASE_Y - 17} ${cx + 8} ${FLAME_BASE_Y - 6}  ${cx} ${FLAME_BASE_Y} Z`}
            fill="#E8700A"
            opacity={0.76}
            style={{
              animation: `${id}-fo 1.55s ease-in-out infinite`,
              transformOrigin: `${cx}px ${FLAME_BASE_Y}px`,
            }}
          />
          {/* Middle flame — amber, medium frequency */}
          <path
            d={`M${cx} ${FLAME_BASE_Y - 1}
                C${cx - 5.5} ${FLAME_BASE_Y - 6} ${cx - 5.5} ${FLAME_BASE_Y - 16} ${cx} ${FLAME_BASE_Y - 22}
                C${cx + 5.5} ${FLAME_BASE_Y - 16} ${cx + 5.5} ${FLAME_BASE_Y - 6}  ${cx} ${FLAME_BASE_Y - 1} Z`}
            fill="#FFAA00"
            opacity={0.88}
            style={{
              animation: `${id}-fm 1.05s ease-in-out infinite`,
              animationDelay: "0.22s",
              transformOrigin: `${cx}px ${FLAME_BASE_Y - 1}px`,
            }}
          />
          {/* Inner flame — bright yellow, fast pulse */}
          <path
            d={`M${cx} ${FLAME_BASE_Y - 2}
                C${cx - 3} ${FLAME_BASE_Y - 6} ${cx - 3} ${FLAME_BASE_Y - 13} ${cx} ${FLAME_BASE_Y - 16}
                C${cx + 3} ${FLAME_BASE_Y - 13} ${cx + 3} ${FLAME_BASE_Y - 6}  ${cx} ${FLAME_BASE_Y - 2} Z`}
            fill="#FFF2B0"
            opacity={0.96}
            style={{
              animation: `${id}-fi 0.85s ease-in-out infinite`,
              animationDelay: "0.1s",
              transformOrigin: `${cx}px ${FLAME_BASE_Y - 2}px`,
            }}
          />
          {/* Flame tip — white-hot highlight */}
          <ellipse
            cx={cx}
            cy={FLAME_BASE_Y - 14}
            rx={1.4}
            ry={2.5}
            fill="#FFFFFF"
            opacity={0.48}
          />
        </g>

        {/* ══ Wick ════════════════════════════════════════════════════════ */}
        <path
          d={`M${cx - 0.5} ${BODY_TOP} Q${cx + 1} ${FLAME_BASE_Y + 1} ${cx} ${FLAME_BASE_Y - 1}`}
          stroke="#2a1e10"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* ══ Wax pool (melted top) ════════════════════════════════════════ */}
        <ellipse
          cx={cx}
          cy={BODY_TOP}
          rx={BODY_W_TOP / 2 + 2}
          ry={2.8}
          fill="#fdf2da"
          opacity={0.92}
        />

        {/* ══ Candle body (tapered trapezoid) ═════════════════════════════ */}
        <path
          d={`M${cx - BODY_W_TOP / 2} ${BODY_TOP}
              L${cx - BODY_W_BOT / 2} ${BODY_TOP + BODY_H}
              L${cx + BODY_W_BOT / 2} ${BODY_TOP + BODY_H}
              L${cx + BODY_W_TOP / 2} ${BODY_TOP} Z`}
          fill={`url(#${id}-body)`}
        />

        {/* Candle right-side shadow edge */}
        <path
          d={`M${cx + BODY_W_TOP / 2 - 2} ${BODY_TOP}
              L${cx + BODY_W_BOT / 2 - 2} ${BODY_TOP + BODY_H}
              L${cx + BODY_W_BOT / 2}     ${BODY_TOP + BODY_H}
              L${cx + BODY_W_TOP / 2}     ${BODY_TOP} Z`}
          fill="#b8a080"
          opacity={0.35}
        />

        {/* Wax drip — left */}
        <path
          d={`M${cx - 4} ${BODY_TOP + 12} C${cx - 6} ${BODY_TOP + 22} ${cx - 7} ${BODY_TOP + 34} ${cx - 6} ${BODY_TOP + 40}`}
          stroke="#fdf6e8"
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity={0.55}
        />

        {/* Wax drip — right */}
        <path
          d={`M${cx + 3} ${BODY_TOP + 8} C${cx + 5} ${BODY_TOP + 16} ${cx + 5} ${BODY_TOP + 26} ${cx + 4} ${BODY_TOP + 30}`}
          stroke="#f8eedd"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity={0.40}
        />

        {/* Gold collar band at top of body */}
        <rect
          x={cx - BODY_W_TOP / 2 - 1}
          y={BODY_TOP - 1}
          width={BODY_W_TOP + 2}
          height={3.5}
          rx={1}
          fill="#B68A35"
          opacity={0.72}
        />

        {/* ══ Candleholder cup ════════════════════════════════════════════ */}
        <path
          d={`M${cx - 11} ${BODY_TOP + BODY_H}
              L${cx - 13} ${BODY_TOP + BODY_H + 9}
              L${cx + 13} ${BODY_TOP + BODY_H + 9}
              L${cx + 11} ${BODY_TOP + BODY_H} Z`}
          fill="#3e2c18"
        />
        {/* Gold lip on cup */}
        <rect
          x={cx - 11}
          y={BODY_TOP + BODY_H - 0.5}
          width={22}
          height={2.5}
          rx={1}
          fill="#B68A35"
          opacity={0.80}
        />
        {/* Base disc */}
        <ellipse
          cx={cx}
          cy={BODY_TOP + BODY_H + 9}
          rx={15}
          ry={4.5}
          fill="#2e1e0e"
        />
        {/* Gold base rim */}
        <ellipse
          cx={cx}
          cy={BODY_TOP + BODY_H + 9}
          rx={15}
          ry={4.5}
          stroke="#B68A35"
          strokeWidth={0.9}
          fill="none"
          opacity={0.70}
        />
        {/* Stem under base */}
        <rect
          x={cx - 4}
          y={BODY_TOP + BODY_H + 11}
          width={8}
          height={5}
          rx={1}
          fill="#2e1e0e"
        />
        <ellipse
          cx={cx}
          cy={BODY_TOP + BODY_H + 16}
          rx={10}
          ry={2.5}
          fill="#2e1e0e"
        />
        <ellipse
          cx={cx}
          cy={BODY_TOP + BODY_H + 16}
          rx={10}
          ry={2.5}
          stroke="#B68A35"
          strokeWidth={0.7}
          fill="none"
          opacity={0.65}
        />
      </svg>
    </div>
  );
}
