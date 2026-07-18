import React, { useEffect, useRef, useState } from "react";

export default function RegencyChandelier() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let animFrameId: number;
    let angleTime = 0;
    let shimmerPos = 0;

    const tick = () => {
      const audioData = (window as any).__ambientAudioData;
      const isPlaying = audioData?.isPlaying;
      const reducedMotion = audioData?.reducedMotion;
      
      const bass = audioData?.bass || 0;
      const treble = audioData?.treble || 0;
      const volume = audioData?.volume || 0;

      // ── 1. Gentle Sway Animation ──
      if (containerRef.current) {
        if (reducedMotion) {
          containerRef.current.style.transform = "rotate(0deg)";
        } else {
          // Slowly increment angle time. If music is playing, speed up slightly on the beats
          const speedFactor = isPlaying ? 0.008 + bass * 0.012 : 0.005;
          angleTime += speedFactor;

          // Maximum sway angle is 0.6 degrees normally, up to 1.8 degrees during music peaks
          const maxSway = isPlaying ? 0.6 + bass * 1.4 : 0.4;
          const currentAngle = Math.sin(angleTime * Math.PI * 2) * maxSway;
          
          containerRef.current.style.transform = `rotate(${currentAngle.toFixed(3)}deg)`;
          containerRef.current.style.transformOrigin = "50% 0%";
        }
      }

      // ── 2. Crystal Sparkle Shimmer (Gradient position manipulation) ──
      if (gradientRef.current) {
        // If music is playing, shimmer moves dynamically in response to higher treble frequencies
        const increment = isPlaying ? 0.4 + treble * 3.5 : 0.2;
        shimmerPos = (shimmerPos + increment) % 200;

        // Slide gradient stops across crystals
        const x1Value = (shimmerPos - 100).toFixed(1);
        const x2Value = (shimmerPos).toFixed(1);

        gradientRef.current.setAttribute("x1", `${x1Value}%`);
        gradientRef.current.setAttribute("x2", `${x2Value}%`);
      }

      // ── 3. Dynamic Candle Flame Pulsing ──
      // Query candle flames in this chandelier and scale them slightly with music
      if (containerRef.current && isPlaying) {
        const flames = containerRef.current.querySelectorAll(".chandelier-flame");
        flames.forEach((flame) => {
          const baseScale = 1.0;
          const audioScale = baseScale + volume * 0.25; // flame grows up to 25% larger on beats
          (flame as SVGElement).style.transform = `scale(${audioScale.toFixed(2)})`;
        });

        const glows = containerRef.current.querySelectorAll(".chandelier-glow");
        glows.forEach((glow) => {
          const baseOpacity = 0.45;
          const audioOpacity = Math.min(0.85, baseOpacity + volume * 0.40);
          (glow as SVGElement).style.opacity = audioOpacity.toFixed(2);
        });
      } else if (containerRef.current) {
        // Reset scale & opacity when not playing
        const flames = containerRef.current.querySelectorAll(".chandelier-flame");
        flumesReset: flames.forEach((flame) => {
          (flame as SVGElement).style.transform = "scale(1)";
        });

        const glows = containerRef.current.querySelectorAll(".chandelier-glow");
        glowsReset: glows.forEach((glow) => {
          (glow as SVGElement).style.opacity = "0.45";
        });
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-64 z-20 pointer-events-none select-none transition-transform"
      style={{ willChange: "transform" }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <defs>
          {/* Shimmer gradient used on crystals to simulate light sparkles */}
          <linearGradient id="crystal-shimmer" ref={gradientRef} x1="-100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#c5a880" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#c5a880" stopOpacity="0.4" />
          </linearGradient>

          {/* Candle Flame Glow */}
          <radialGradient id="chandelier-flame-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD266" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Hanging Support Chain */}
        <line x1="100" y1="0" x2="100" y2="60" stroke="#b68a35" strokeWidth="1.8" strokeDasharray="3 3" />
        <circle cx="100" cy="60" r="3.5" fill="#a37b2d" />

        {/* 2. Symmetrical Brass Arms */}
        {/* Central column shaft */}
        <path d="M98 60 H102 V160 H98 Z" fill="#b68a35" />
        
        {/* Tier 1 support arms */}
        <path d="M100 130 C75 130 50 115 50 85 M100 130 C125 130 150 115 150 85" stroke="#b68a35" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Tier 2 support arms (wider lower loop) */}
        <path d="M100 160 C60 160 30 140 30 100 M100 160 C140 160 170 140 170 100" stroke="#b68a35" strokeWidth="2.0" strokeLinecap="round" fill="none" />

        {/* 3. Chandelier Crystals (Teardrops & Hanging Strands) */}
        {/* Crystal strands connecting arms */}
        <path d="M50 85 C65 110 85 115 100 115 C115 115 135 110 150 85" stroke="url(#crystal-shimmer)" strokeWidth="1.5" strokeDasharray="1 3" fill="none" />
        <path d="M30 100 C55 135 80 145 100 145 C120 145 145 135 170 100" stroke="url(#crystal-shimmer)" strokeWidth="1.8" strokeDasharray="1 3" fill="none" />

        {/* Hanging diamond drop crystals on support points */}
        {/* Center main crystal bottom */}
        <g transform="translate(100, 175)">
          <polygon points="0,-8 5,0 0,8 -5,0" fill="url(#crystal-shimmer)" stroke="#c5a880" strokeWidth="0.4" />
        </g>
        
        {/* Left tier 1 crystal */}
        <g transform="translate(50, 95)">
          <polygon points="0,-6 4,0 0,6 -4,0" fill="url(#crystal-shimmer)" stroke="#c5a880" strokeWidth="0.4" />
        </g>

        {/* Right tier 1 crystal */}
        <g transform="translate(150, 95)">
          <polygon points="0,-6 4,0 0,6 -4,0" fill="url(#crystal-shimmer)" stroke="#c5a880" strokeWidth="0.4" />
        </g>

        {/* Outer left crystal */}
        <g transform="translate(30, 112)">
          <polygon points="0,-6 4,0 0,6 -4,0" fill="url(#crystal-shimmer)" stroke="#c5a880" strokeWidth="0.4" />
        </g>

        {/* Outer right crystal */}
        <g transform="translate(170, 112)">
          <polygon points="0,-6 4,0 0,6 -4,0" fill="url(#crystal-shimmer)" stroke="#c5a880" strokeWidth="0.4" />
        </g>

        {/* 4. Elegant Candles & Glowing Flames */}
        {/* Candle 1 (Far Left) */}
        <g transform="translate(30, 80)">
          <rect x="-3" y="0" width="6" height="20" fill="#fdfaf2" stroke="#b68a35" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="0" y2="-3" stroke="#221100" strokeWidth="0.8" />
          {/* Ambient Glow */}
          <circle cx="0" cy="-6" r="10" fill="url(#chandelier-flame-glow)" className="chandelier-glow" opacity="0.45" />
          {/* Flame Path */}
          <path d="M0 -3 C-1.5 -5 -2 -9 0 -13 C2 -9 1.5 -5 0 -3 Z" fill="#FFAA00" className="chandelier-flame" style={{ transformOrigin: "0px -3px", transition: "transform 0.1s ease" }} />
        </g>

        {/* Candle 2 (Inner Left) */}
        <g transform="translate(50, 65)">
          <rect x="-3" y="0" width="6" height="20" fill="#fdfaf2" stroke="#b68a35" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="0" y2="-3" stroke="#221100" strokeWidth="0.8" />
          <circle cx="0" cy="-6" r="10" fill="url(#chandelier-flame-glow)" className="chandelier-glow" opacity="0.45" />
          <path d="M0 -3 C-1.5 -5 -2 -9 0 -13 C2 -9 1.5 -5 0 -3 Z" fill="#FFAA00" className="chandelier-flame" style={{ transformOrigin: "0px -3px", transition: "transform 0.1s ease" }} />
        </g>

        {/* Candle 3 (Inner Right) */}
        <g transform="translate(150, 65)">
          <rect x="-3" y="0" width="6" height="20" fill="#fdfaf2" stroke="#b68a35" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="0" y2="-3" stroke="#221100" strokeWidth="0.8" />
          <circle cx="0" cy="-6" r="10" fill="url(#chandelier-flame-glow)" className="chandelier-glow" opacity="0.45" />
          <path d="M0 -3 C-1.5 -5 -2 -9 0 -13 C2 -9 1.5 -5 0 -3 Z" fill="#FFAA00" className="chandelier-flame" style={{ transformOrigin: "0px -3px", transition: "transform 0.1s ease" }} />
        </g>

        {/* Candle 4 (Far Right) */}
        <g transform="translate(170, 80)">
          <rect x="-3" y="0" width="6" height="20" fill="#fdfaf2" stroke="#b68a35" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="0" y2="-3" stroke="#221100" strokeWidth="0.8" />
          <circle cx="0" cy="-6" r="10" fill="url(#chandelier-flame-glow)" className="chandelier-glow" opacity="0.45" />
          <path d="M0 -3 C-1.5 -5 -2 -9 0 -13 C2 -9 1.5 -5 0 -3 Z" fill="#FFAA00" className="chandelier-flame" style={{ transformOrigin: "0px -3px", transition: "transform 0.1s ease" }} />
        </g>

        {/* Hanging crystal drops along the shaft center */}
        <g transform="translate(100, 100)">
          <polygon points="0,-4 3,0 0,4 -3,0" fill="url(#crystal-shimmer)" stroke="#c5a880" strokeWidth="0.3" />
        </g>
        <g transform="translate(100, 120)">
          <polygon points="0,-4 3,0 0,4 -3,0" fill="url(#crystal-shimmer)" stroke="#c5a880" strokeWidth="0.3" />
        </g>
        <g transform="translate(100, 140)">
          <polygon points="0,-4 3,0 0,4 -3,0" fill="url(#crystal-shimmer)" stroke="#c5a880" strokeWidth="0.3" />
        </g>
      </svg>
    </div>
  );
}
