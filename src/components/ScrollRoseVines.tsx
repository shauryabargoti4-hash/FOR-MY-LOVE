/**
 * ScrollRoseVines
 *
 * Decorative rose vine SVGs fixed to the left and right edges of the page.
 * Scroll-driven growth synced with music-reactive breathing.
 * Triggers drifting petals to fall from the bloomed roses during orchestral peaks.
 */

import React, { useEffect, useState, useCallback, useRef } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function band(scroll: number, start: number, end: number): number {
  if (scroll <= start) return 0;
  if (scroll >= end) return 1;
  return (scroll - start) / (end - start);
}

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

function petalColor(scroll: number, start: number): string {
  const t1 = band(scroll, start, start + 0.35);       
  const t2 = band(scroll, start + 0.35, start + 0.75); 
  if (t2 > 0) return lerpColor("#e8a8b8", "#8b2252", t2);
  return lerpColor("#4a7c4e", "#e8a8b8", t1);
}

const STEM_LENGTH = 1080;

// ─── Falling Petal Interface ──────────────────────────────────────────────────

interface FallingPetal {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  swayTime: number;
  angle: number;
  rotSpeed: number;
  opacity: number;
}

// ─── Vine SVG component ───────────────────────────────────────────────────────

interface VineProps {
  scroll: number;
}

function VineSvg({ scroll }: VineProps) {
  const drawn = lerp(0, STEM_LENGTH, band(scroll, 0, 0.88));
  const dashOffset = STEM_LENGTH - drawn;

  const branchDrawn = lerp(0, 300, band(scroll, 0.04, 0.88));
  const branchOffset = 300 - branchDrawn;

  const lA = band(scroll, 0.04, 0.20) * 0.82;
  const lB = band(scroll, 0.20, 0.38) * 0.82;
  const lC = band(scroll, 0.38, 0.56) * 0.82;
  const lD = band(scroll, 0.56, 0.74) * 0.82;
  const lE = band(scroll, 0.74, 0.90) * 0.82;

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
      {/* Main Stem */}
      <path
        d="M20,0 C30,120 10,240 40,360 C60,480 30,600 50,720 C70,840 40,960 30,1000"
        stroke={vine}
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={STEM_LENGTH}
        strokeDashoffset={dashOffset}
      />

      {/* Symmetrical leaves and branch details */}
      <g stroke={vine} strokeWidth="1.6" fill="none">
        <path d="M30,120 Q55,140 70,130" strokeDasharray="300" strokeDashoffset={branchOffset} />
        <path d="M22,240 Q4,260 -10,250" strokeDasharray="300" strokeDashoffset={branchOffset} />
        <path d="M40,480 Q70,490 85,475" strokeDasharray="300" strokeDashoffset={branchOffset} />
        <path d="M45,680 Q20,700 0,690" strokeDasharray="300" strokeDashoffset={branchOffset} />
        <path d="M48,820 Q75,840 90,830" strokeDasharray="300" strokeDashoffset={branchOffset} />
      </g>

      {/* Leaves Group A */}
      <g opacity={lA}>
        <path d="M22,50 C32,45 35,32 25,28 C15,32 18,45 22,50 Z" fill={vine} />
        <path d="M25,80 C36,75 42,65 32,60 C22,65 20,75 25,80 Z" fill={vine} />
      </g>

      {/* Leaves Group B */}
      <g opacity={lB}>
        <path d="M28,180 C18,185 12,198 20,202 C28,198 32,185 28,180 Z" fill={vine} />
        <path d="M60,132 C68,124 64,112 55,115 C48,122 52,130 60,132 Z" fill={vine} />
      </g>

      {/* Leaves Group C */}
      <g opacity={lC}>
        <path d="M42,380 C52,375 55,362 45,358 C35,362 38,375 42,380 Z" fill={vine} />
        <path d="M72,482 C80,474 76,462 67,465 C60,472 64,480 72,482 Z" fill={vine} />
      </g>

      {/* Leaves Group D */}
      <g opacity={lD}>
        <path d="M48,580 C38,585 32,598 40,602 C48,598 52,585 48,580 Z" fill={vine} />
        <path d="M20,688 C28,680 24,668 15,671 C8,678 12,686 20,688 Z" fill={vine} />
      </g>

      {/* Leaves Group E */}
      <g opacity={lE}>
        <path d="M45,780 C55,775 58,762 48,758 C38,762 41,775 45,780 Z" fill={vine} />
        <path d="M78,828 C86,820 82,808 73,811 C66,818 70,826 78,828 Z" fill={vine} />
      </g>

      {/* Bloomed Roses */}
      {r1Scale > 0 && (
        <g transform={`translate(70, 130) scale(${r1Scale})`} opacity={r1Opacity}>
          <RoseBud color={r1Color} />
        </g>
      )}
      {r2Scale > 0 && (
        <g transform={`translate(-10, 250) scale(${r2Scale})`} opacity={r2Opacity}>
          <RoseBud color={r2Color} />
        </g>
      )}
      {r3Scale > 0 && (
        <g transform={`translate(85, 475) scale(${r3Scale})`} opacity={r3Opacity}>
          <RoseBud color={r3Color} />
        </g>
      )}
      {r4Scale > 0 && (
        <g transform={`translate(0, 690) scale(${r4Scale})`} opacity={r4Opacity}>
          <RoseBud color={r4Color} />
        </g>
      )}
    </svg>
  );
}

interface RoseBudProps {
  color: string;
}

function RoseBud({ color }: RoseBudProps) {
  return (
    <>
      <circle cx={0} cy={0} r={10} fill={color} opacity={0.35} />
      {/* 5 layered petals */}
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx={0}
          cy={-5}
          rx={4}
          ry={7.5}
          fill={color}
          opacity={0.72}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx={0} cy={0} r={3.5} fill={color} opacity={0.95} />
      <circle cx={-1} cy={-1} r={1.6} fill="#fff8f2" opacity={0.38} />
    </>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function ScrollRoseVines() {
  const [scroll, setScroll] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [fallingPetals, setFallingPetals] = useState<FallingPetal[]>([]);

  const leftVineRef = useRef<HTMLDivElement>(null);
  const rightVineRef = useRef<HTMLDivElement>(null);
  const lastSpawnTimeRef = useRef(0);

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

  // ── Music-reactive loop (breathing and petal falls) ────────────────────────
  useEffect(() => {
    if (!mounted) return;

    let animFrameId: number;

    const tick = () => {
      const audioData = (window as any).__ambientAudioData;
      const isPlaying = audioData?.isPlaying;
      const reducedMotion = audioData?.reducedMotion;
      
      const bass = audioData?.bass || 0;
      const volume = audioData?.volume || 0;

      // 1. Set breathing transform scale directly on vine DOM wrappers
      const scale = isPlaying && !reducedMotion ? 1.0 + volume * 0.015 : 1.0;

      if (leftVineRef.current) {
        leftVineRef.current.style.transform = `scale(${scale})`;
        leftVineRef.current.style.transformOrigin = "left center";
      }
      if (rightVineRef.current) {
        rightVineRef.current.style.transform = `scaleX(-1) scale(${scale})`;
        rightVineRef.current.style.transformOrigin = "right center";
      }

      // 2. Strong beats trigger detaching petals
      if (isPlaying && !reducedMotion && bass > 0.82 && Date.now() - lastSpawnTimeRef.current > 4000) {
        lastSpawnTimeRef.current = Date.now();

        const side = Math.random() > 0.5 ? "left" : "right";
        const yPositions = [150, 260, 480, 700]; // approximate rose y levels on viewport
        const y = yPositions[Math.floor(Math.random() * yPositions.length)];
        const startX = side === "left" ? 50 : window.innerWidth - 50;

        const newPetal = {
          id: Math.random(),
          x: startX,
          y,
          size: Math.random() * 6 + 6, // 6px to 12px detaching petals
          speedX: side === "left" ? Math.random() * 0.4 + 0.15 : -(Math.random() * 0.4 + 0.15),
          speedY: Math.random() * 0.5 + 0.4,
          swayTime: Math.random() * 100,
          angle: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 1.5,
          opacity: 0.95
        };

        setFallingPetals((prev) => [...prev, newPetal]);
      }

      // 3. Update active detaching falling petals coordinates
      setFallingPetals((prev) => {
        if (prev.length === 0) return prev;
        return prev
          .map((p) => {
            const updated = {
              ...p,
              y: p.y + p.speedY,
              x: p.x + p.speedX + Math.sin(p.swayTime) * 0.4,
              swayTime: p.swayTime + 0.015,
              angle: p.angle + p.rotSpeed,
              opacity: p.y > window.innerHeight - 100 ? p.opacity - 0.025 : p.opacity
            };
            return updated;
          })
          .filter((p) => p.y < window.innerHeight && p.opacity > 0);
      });

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [mounted]);

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
    transition: "transform 0.1s ease-out"
  };

  return (
    <>
      {/* Left vine */}
      <div ref={leftVineRef} style={{ ...svgWrapStyle, left: 0 }}>
        <VineSvg scroll={scroll} />
      </div>

      {/* Right vine — mirror of left */}
      <div ref={rightVineRef} style={{ ...svgWrapStyle, right: 0 }}>
        <VineSvg scroll={scroll} />
      </div>

      {/* Dynamic Detaching Falling Petals overlay */}
      {fallingPetals.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none select-none z-50"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            transform: `rotate(${p.angle}deg)`,
            transition: "none",
          }}
        >
          <svg viewBox="0 0 20 20" className="w-full h-full text-[#8b2252]">
            <path d="M10,0 C5,5 0,10 5,15 C10,20 15,20 15,15 C15,10 15,5 10,0 Z" fill="currentColor" />
          </svg>
        </div>
      ))}
    </>
  );
}
