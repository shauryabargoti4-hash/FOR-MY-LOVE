import React, { useEffect, useState } from "react";

export default function Preloader() {
  const [isMounted, setIsMounted] = useState(false);
  const [isEmbossed, setIsEmbossed] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Lock scroll to prevent users from scrolling past the preloader
    document.body.style.overflow = "hidden";

    // 1. Emboss/Stamp animation triggers shortly after mount
    const stampTimer = setTimeout(() => {
      setIsEmbossed(true);
    }, 200);

    // 2. Fading out starts after 2.2 seconds (gently dissolving)
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2200);

    // 3. Remove preloader completely from layout after transition finishes (3.0s total)
    const hideTimer = setTimeout(() => {
      setIsHidden(true);
      document.body.style.overflow = ""; // restore scrolling
    }, 3000);

    return () => {
      clearTimeout(stampTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = ""; // fallback restore
    };
  }, []);

  if (!isMounted || isHidden) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#fbf9f4] flex flex-col items-center justify-center transition-all duration-[800ms] ease-in-out select-none pointer-events-none ${
        isFadingOut 
          ? "opacity-0 scale-105" 
          : "opacity-100 scale-100"
      }`}
    >
      {/* 1. Large Embossing Wax Seal */}
      <div 
        className={`w-36 h-36 relative z-10 transition-transform duration-1000 ${
          isEmbossed ? "animate-emboss" : "scale-85 opacity-50"
        }`}
      >
        <svg 
          className="w-full h-full text-gold" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Irregular crimson wax seal shape */}
          <path 
            d="M 50,5 C 69,4 79,15 78,30 C 76,45 84,59 71,71 C 58,83 37,87 25,77 C 13,67 11,49 15,32 C 19,15 32,6 50,5 Z" 
            fill="#8c2d3a" 
          />
          {/* Inner details crest */}
          <circle cx="50" cy="50" r="32" stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" fill="none" />
          
          {/* Gold Heart Emblem (embosses/grows inside seal) */}
          <path 
            className={`transition-all duration-1000 delay-300 ease-out ${
              isEmbossed ? "opacity-90 scale-100" : "opacity-0 scale-50"
            }`}
            style={{ transformOrigin: "50px 50px" }}
            d="M50,61 C47.5,58.2 41,52 41,47.5 C41,43.5 44,40.5 48,40.5 C50,40.5 50,42.5 50,42.5 C50,42.5 50,40.5 52,40.5 C56,40.5 59,43.5 59,47.5 C59,52 52.5,58.2 50,61 Z" 
            fill="#e5c29e" 
          />
        </svg>
      </div>

      {/* 2. Floating Gold Dust Particles */}
      {isEmbossed && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 14 }).map((_, idx) => {
            const delay = 0.15 * idx;
            const duration = 1.8 + Math.random() * 1.4;
            // Generate offset coords around center (40% to 60%)
            const top = 38 + Math.random() * 24; 
            const left = 38 + Math.random() * 24;
            const size = Math.random() * 3.2 + 1.8; // 1.8px to 5px particle size
            
            return (
              <div
                key={idx}
                className="absolute rounded-full bg-[#c5a880]/60 animate-gold-dust"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`
                }}
              />
            );
          })}
        </div>
      )}

      {/* 3. Luxury embossed text details */}
      <div 
        className={`absolute bottom-16 transition-opacity duration-1000 delay-500 ease-out text-center ${
          isEmbossed ? "opacity-60" : "opacity-0"
        }`}
      >
        <span className="font-handwritten text-2xl text-[#7a2e38] tracking-wide">
          Our Love Story
        </span>
      </div>
    </div>
  );
}
