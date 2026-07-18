import React, { useEffect, useState } from "react";

interface FlowerNode {
  x: number;
  y: number;
  threshold: number;
  align: "left" | "right" | "center";
}

export default function ScrollVine() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showVine, setShowVine] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      let progress = 0;
      if (docHeight > 0) {
        progress = scrollTop / docHeight;
      }
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);

      // Hide the vine during the intro scroll-driven sequence (first 2.2 viewports)
      if (scrollTop > window.innerHeight * 2.2) {
        setShowVine(true);
      } else {
        setShowVine(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isMounted]);

  if (!isMounted) return null;

  // The coordinates of 6 flowers distributed along the height of the vine
  const flowers: FlowerNode[] = [
    { x: 20, y: 10, threshold: 0.0, align: "center" },
    { x: 23, y: 126, threshold: 0.2, align: "right" },
    { x: 17, y: 242, threshold: 0.4, align: "left" },
    { x: 23, y: 358, threshold: 0.6, align: "right" },
    { x: 17, y: 474, threshold: 0.8, align: "left" },
    { x: 20, y: 590, threshold: 1.0, align: "center" }
  ];

  return (
    <div 
      className={`fixed right-4 top-[15vh] bottom-[15vh] w-10 z-40 flex flex-col items-center pointer-events-none select-none transition-all duration-500 ease-out ${
        showVine 
          ? "opacity-100 translate-x-0" 
          : "opacity-0 translate-x-6 pointer-events-none"
      }`}
    >
      <svg 
        className="w-full h-full text-gold" 
        viewBox="0 0 40 600" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. Background Stem Path (Faint gold layout line) */}
        <path 
          d="M 20,10 Q 25,60 20,110 T 20,210 T 20,310 T 20,410 T 20,510 T 20,590" 
          stroke="#c5a880" 
          strokeWidth="1.2" 
          strokeOpacity="0.15" 
        />

        {/* 2. Active Progress Stem Path (Draws itself based on scrollProgress) */}
        <path 
          d="M 20,10 Q 25,60 20,110 T 20,210 T 20,310 T 20,410 T 20,510 T 20,590" 
          stroke="#c5a880" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={100 - 100 * scrollProgress}
          strokeOpacity="0.8"
          className="transition-all duration-150 ease-out"
        />

        {/* 3. Tiny Leaf Offshoots branching along the stem */}
        <g stroke="#c5a880" strokeWidth="0.8" strokeOpacity="0.4" fill="none">
          {/* Leaves at alternating coordinates */}
          <path d="M 22,70 Q 28,66 26,74 Z" fill="#c5a880" fillOpacity="0.15" />
          <path d="M 18,170 Q 12,166 14,174 Z" fill="#c5a880" fillOpacity="0.15" />
          <path d="M 22,270 Q 28,266 26,274 Z" fill="#c5a880" fillOpacity="0.15" />
          <path d="M 18,370 Q 12,366 14,374 Z" fill="#c5a880" fillOpacity="0.15" />
          <path d="M 22,470 Q 28,466 26,474 Z" fill="#c5a880" fillOpacity="0.15" />
        </g>

        {/* 4. Gradually Blooming Flowers */}
        {flowers.map((f, idx) => {
          const isBloomed = scrollProgress >= f.threshold;
          
          return (
            <g
              key={idx}
              className="transition-all duration-500 ease-out"
              style={{
                transform: `translate(${f.x}px, ${f.y}px) scale(${isBloomed ? 1 : 0})`,
                transformOrigin: "center",
                opacity: isBloomed ? 1 : 0
              }}
            >
              {/* Petals */}
              <circle cx="-2" cy="-2" r="2.2" fill="#c5a880" />
              <circle cx="2" cy="-2" r="2.2" fill="#c5a880" />
              <circle cx="2" cy="2" r="2.2" fill="#c5a880" />
              <circle cx="-2" cy="2" r="2.2" fill="#c5a880" />
              
              {/* Rose Crimson Center */}
              <circle cx="0" cy="0" r="1.8" fill="#8c2d3a" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
