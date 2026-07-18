/**
 * RegencyCandle
 *
 * An elegant Regency-era SVG candle with:
 *  – Continuously flickering flame (procedural keyframe sways)
 *  – Cursor-proximity lean, glow expansion, brightness boost
 *  – Music-reactive ambient glow pulsing, flame scale peaks, and smoke speed
 *
 * Highly optimized: uses window level state and requestAnimationFrame direct DOM manipulation
 * to completely eliminate React virtual DOM updates and maintain 60 FPS.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";

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
  const glowRef = useRef<SVGEllipseElement>(null);
  const flameGroupRef = useRef<SVGGElement>(null);

  // Stable unique prefix so each candle has independent keyframe names
  const id = useRef(`rc-${Math.random().toString(36).slice(2, 8)}`).current;

  // Local values updated without triggering React re-renders
  const proxRef = useRef(0);
  const targetProxRef = useRef(0);
  const leanRef = useRef(0);
  const targetLeanRef = useRef(0);

  // ── Cursor tracking (writes to refs directly) ──────────────────────────────
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
        targetProxRef.current = t;
        targetLeanRef.current = (dx / proximityRadius) * maxLean * t;
      } else {
        targetProxRef.current = 0;
        targetLeanRef.current = 0;
      }
    },
    [maxLean, proximityRadius]
  );

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  // ── RAF Direct DOM Manipulation Loop (60 FPS) ─────────────────────────────
  useEffect(() => {
    let animFrameId: number;
    let localTime = Math.random() * 100; // offset candle flicker phase

    const tick = () => {
      // 1. Smoothly interpolate cursor values (lerp damping)
      const lerpFactor = 0.08;
      proxRef.current = proxRef.current * (1 - lerpFactor) + targetProxRef.current * lerpFactor;
      leanRef.current = leanRef.current * (1 - lerpFactor) + targetLeanRef.current * lerpFactor;

      // 2. Fetch music-reactive data
      const audioData = (window as any).__ambientAudioData;
      const isPlaying = audioData?.isPlaying;
      const reducedMotion = audioData?.reducedMotion;
      
      const bass = audioData?.bass || 0;
      const volume = audioData?.volume || 0;

      // Base calculations based on cursor proximity
      const glowBaseR = 22;
      const currentGlowR = glowBaseR + proxRef.current * 26;
      let glowOpacity = 0.18 + proxRef.current * 0.28;

      // ── 3. Apply Music Dynamics to Glow ──
      let rx = currentGlowR * 1.5;
      let ry = currentGlowR;

      if (isPlaying) {
        // Ambient glow expands up to 25% larger on beats
        const musicScale = 1.0 + volume * 0.25;
        rx *= musicScale;
        ry *= musicScale;
        // Brightness expands during loud passages
        glowOpacity = Math.min(0.9, glowOpacity + volume * 0.32);
      }

      if (glowRef.current) {
        glowRef.current.setAttribute("rx", rx.toFixed(1));
        glowRef.current.setAttribute("ry", ry.toFixed(1));
        glowRef.current.style.opacity = glowOpacity.toFixed(2);
      }

      // ── 4. Apply Music Dynamics to Flame leaning and scale ──
      if (flameGroupRef.current) {
        if (reducedMotion) {
          flameGroupRef.current.style.transform = `rotate(${leanRef.current.toFixed(2)}deg) scale(1)`;
        } else {
          localTime += 0.02;
          
          // Subtle natural sway driven by bass
          const musicSway = isPlaying 
            ? Math.sin(localTime * 4) * 0.8 * (1.0 + bass * 0.6) 
            : 0;

          // Scale flame taller with overall music amplitude
          const scaleVal = isPlaying 
            ? 1.0 + volume * 0.18 
            : 1.0;

          const totalLean = leanRef.current + musicSway;
          flameGroupRef.current.style.transform = `rotate(${totalLean.toFixed(2)}deg) scale(${scaleVal.toFixed(2)})`;
          flameGroupRef.current.style.transformOrigin = `${cx}px ${FLAME_BASE_Y}px`;
        }
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  // ── SVG geometry ─────────────────────────────────────────────────────────
  const W = 46;                     // total SVG width
  const cx = W / 2;                 // center x
  const FLAME_BASE_Y = 28;          // y where flame meets wick
  const BODY_TOP = FLAME_BASE_Y + 6;
  const BODY_H = bodyHeight;
  const BODY_W_TOP = 13;            // candle width at top
  const BODY_W_BOT = 15;            // candle width at bottom
  const TOTAL_H = BODY_TOP + BODY_H + 18; // +18 for holder

  return (
    <div
      ref={wrapRef}
      className={`inline-block select-none pointer-events-none ${className}`}
      style={{ ...style }}
    >
      {/* Scoped CSS Keyframes for baseline organic flicker loops */}
      <style>{`
        @keyframes ${id}-fo {
          0%,100% { transform: rotate(-1.5deg) scaleX(0.97); }
          25%      { transform: rotate( 1.2deg) scaleX(1.03); }
          50%      { transform: rotate(-2.0deg) scaleX(0.95); }
          75%      { transform: rotate( 0.8deg) scaleX(1.02); }
        }
        @keyframes ${id}-fm {
          0%,100% { transform: scaleX(0.96) scaleY(0.95); opacity: 0.85; }
          33%      { transform: scaleX(1.05) scaleY(1.05); opacity: 1.00; }
          66%      { transform: scaleX(0.94) scaleY(0.92); opacity: 0.88; }
        }
        @keyframes ${id}-fi {
          0%,100% { transform: scaleY(0.94); opacity: 0.90; }
          50%      { transform: scaleY(1.08); opacity: 1.00; }
        }
        @keyframes ${id}-gl {
          0%,100% { transform: scale(1.00); }
          50%      { transform: scale(1.06); }
        }
        @keyframes ${id}-sa {
          0%   { transform: translateY(0px)  translateX(0px) scale(1);   opacity: 0.3; }
          50%  { transform: translateY(-16px) translateX(2px) scale(1.4); opacity: 0.15; }
          100% { transform: translateY(-32px) translateX(-1px) scale(1.9); opacity: 0; }
        }
        @keyframes ${id}-sb {
          0%   { transform: translateY(0px)  translateX(0px) scale(1);   opacity: 0.25; }
          50%  { transform: translateY(-18px) translateX(-3px) scale(1.6); opacity: 0.12; }
          100% { transform: translateY(-36px) translateX(2px)  scale(2.2); opacity: 0; }
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
          <radialGradient id={`${id}-grd`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFD066" stopOpacity="0.75" />
            <stop offset="55%"  stopColor="#FF8C00" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF4500" stopOpacity="0"   />
          </radialGradient>
          <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#f5edda" />
            <stop offset="30%"  stopColor="#fdf8ee" />
            <stop offset="100%" stopColor="#d8c9aa" />
          </linearGradient>
        </defs>

        {/* ══ Ambient glow ellipse ════════════════ */}
        <ellipse
          ref={glowRef}
          cx={cx}
          cy={FLAME_BASE_Y - 4}
          rx={cx * 1.5}
          ry={cx}
          fill={`url(#${id}-grd)`}
          style={{
            animation: `${id}-gl 2.1s ease-in-out infinite`,
            transformOrigin: `${cx}px ${FLAME_BASE_Y - 4}px`,
            willChange: "rx, ry, opacity",
            transition: "rx 0.15s ease-out, ry 0.15s ease-out, opacity 0.15s ease-out"
          }}
        />

        {/* ══ Smoke particles ══════════════════════════ */}
        <circle
          cx={cx - 1.5}
          cy={FLAME_BASE_Y - 22}
          r={1.8}
          fill="#c2bba8"
          style={{
            animation: `${id}-sa 2.8s ease-out infinite`,
            transformOrigin: `${cx - 1.5}px ${FLAME_BASE_Y - 22}px`,
          }}
        />
        <circle
          cx={cx + 2}
          cy={FLAME_BASE_Y - 24}
          r={1.3}
          fill="#b8b2a0"
          style={{
            animation: `${id}-sb 2.8s ease-out infinite`,
            animationDelay: "1.2s",
            transformOrigin: `${cx + 2}px ${FLAME_BASE_Y - 24}px`,
          }}
        />

        {/* ══ Flame group — tilts and scales dynamically ════════════════════════ */}
        <g
          ref={flameGroupRef}
          style={{
            transform: `rotate(0deg)`,
            transformOrigin: `${cx}px ${FLAME_BASE_Y}px`,
            willChange: "transform"
          }}
        >
          <path
            d={`M${cx} ${FLAME_BASE_Y}
                C${cx - 8} ${FLAME_BASE_Y - 6} ${cx - 9} ${FLAME_BASE_Y - 17} ${cx} ${FLAME_BASE_Y - 26}
                C${cx + 9} ${FLAME_BASE_Y - 17} ${cx + 8} ${FLAME_BASE_Y - 6}  ${cx} ${FLAME_BASE_Y} Z`}
            fill="#E8700A"
            opacity={0.76}
            style={{
              animation: `${id}-fo 1.7s ease-in-out infinite`,
              transformOrigin: `${cx}px ${FLAME_BASE_Y}px`,
            }}
          />
          <path
            d={`M${cx} ${FLAME_BASE_Y - 1}
                C${cx - 5.5} ${FLAME_BASE_Y - 6} ${cx - 5.5} ${FLAME_BASE_Y - 16} ${cx} ${FLAME_BASE_Y - 22}
                C${cx + 5.5} ${FLAME_BASE_Y - 16} ${cx + 5.5} ${FLAME_BASE_Y - 6}  ${cx} ${FLAME_BASE_Y - 1} Z`}
            fill="#FFAA00"
            opacity={0.88}
            style={{
              animation: `${id}-fm 1.2s ease-in-out infinite`,
              animationDelay: "0.2s",
              transformOrigin: `${cx}px ${FLAME_BASE_Y - 1}px`,
            }}
          />
          <path
            d={`M${cx} ${FLAME_BASE_Y - 2}
                C${cx - 3} ${FLAME_BASE_Y - 6} ${cx - 3} ${FLAME_BASE_Y - 13} ${cx} ${FLAME_BASE_Y - 16}
                C${cx + 3} ${FLAME_BASE_Y - 13} ${cx + 3} ${FLAME_BASE_Y - 6}  ${cx} ${FLAME_BASE_Y - 2} Z`}
            fill="#FFF2B0"
            opacity={0.96}
            style={{
              animation: `${id}-fi 0.9s ease-in-out infinite`,
              animationDelay: "0.1s",
              transformOrigin: `${cx}px ${FLAME_BASE_Y - 2}px`,
            }}
          />
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

        {/* ══ Wax pool ════════════════════════════════════════════════════════ */}
        <ellipse
          cx={cx}
          cy={BODY_TOP}
          rx={BODY_W_TOP / 2 + 2}
          ry={2.8}
          fill="#fdf2da"
          opacity={0.92}
        />

        {/* ══ Candle body ═════════════════════════════ */}
        <path
          d={`M${cx - BODY_W_TOP / 2} ${BODY_TOP}
              L${cx - BODY_W_BOT / 2} ${BODY_TOP + BODY_H}
              L${cx + BODY_W_BOT / 2} ${BODY_TOP + BODY_H}
              L${cx + BODY_W_TOP / 2} ${BODY_TOP} Z`}
          fill={`url(#${id}-body)`}
        />

        {/* Shadow details */}
        <path
          d={`M${cx + BODY_W_TOP / 2 - 2} ${BODY_TOP}
              L${cx + BODY_W_BOT / 2 - 2} ${BODY_TOP + BODY_H}
              L${cx + BODY_W_BOT / 2}     ${BODY_TOP + BODY_H}
              L${cx + BODY_W_TOP / 2}     ${BODY_TOP} Z`}
          fill="#b8a080"
          opacity={0.35}
        />

        {/* Wax drips */}
        <path
          d={`M${cx - 4} ${BODY_TOP + 12} C${cx - 6} ${BODY_TOP + 22} ${cx - 7} ${BODY_TOP + 34} ${cx - 6} ${BODY_TOP + 40}`}
          stroke="#fdf6e8"
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity={0.55}
        />
        <path
          d={`M${cx + 3} ${BODY_TOP + 8} C${cx + 5} ${BODY_TOP + 16} ${cx + 5} ${BODY_TOP + 26} ${cx + 4} ${BODY_TOP + 30}`}
          stroke="#f8eedd"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity={0.4}
        />

        {/* Collar band */}
        <rect
          x={cx - BODY_W_TOP / 2 - 1}
          y={BODY_TOP - 1}
          width={BODY_W_TOP + 2}
          height={3.5}
          rx={1}
          fill="#B68A35"
          opacity={0.72}
        />

        {/* Holder */}
        <path
          d={`M${cx - 11} ${BODY_TOP + BODY_H}
              L${cx - 13} ${BODY_TOP + BODY_H + 9}
              L${cx + 13} ${BODY_TOP + BODY_H + 9}
              L${cx + 11} ${BODY_TOP + BODY_H} Z`}
          fill="#3e2c18"
        />
        <rect
          x={cx - 11}
          y={BODY_TOP + BODY_H - 0.5}
          width={22}
          height={2.5}
          rx={1}
          fill="#B68A35"
          opacity={0.80}
        />
        <ellipse
          cx={cx}
          cy={BODY_TOP + BODY_H + 9}
          rx={15}
          ry={4.5}
          fill="#2e1e0e"
        />
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
