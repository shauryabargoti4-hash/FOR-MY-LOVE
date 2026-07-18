import React, { useEffect, useRef, useState } from "react";
import RegencyCandle from "@/components/RegencyCandle";

export default function RegencyDivider() {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it reaches the center viewport
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [isMounted]);

  if (!isMounted) {
    // SSR fallback: render empty placeholder with same dimensions
    return <div className="w-full h-16 my-8" />;
  }

  return (
    <div 
      ref={elementRef} 
      className="w-full max-w-4xl mx-auto h-16 my-10 relative flex justify-center items-center select-none"
    >
      {/* Left candle */}
      <div className="absolute left-2 bottom-0 pointer-events-auto" style={{ zIndex: 10 }}>
        <RegencyCandle bodyHeight={68} proximityRadius={160} />
      </div>

      {/* Right candle */}
      <div className="absolute right-2 bottom-0 pointer-events-auto" style={{ zIndex: 10 }}>
        <RegencyCandle bodyHeight={68} proximityRadius={160} />
      </div>
      <svg 
        className="w-full h-full text-gold" 
        viewBox="0 0 800 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle drop shadow filter for the 3D-like wax seal effect */}
          <filter id="seal-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.25" />
          </filter>
        </defs>

        {/* 1. Dotted Stitching lines (scale out horizontally from the center) */}
        <g 
          className="transition-all duration-[1000ms] ease-out"
          style={{ 
            transform: isVisible ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "400px 30px",
            opacity: isVisible ? 1 : 0
          }}
        >
          {/* Left stitching */}
          <line x1="60" y1="30" x2="320" y2="30" stroke="#c5a880" strokeWidth="1.2" strokeDasharray="3 4" />
          {/* Right stitching */}
          <line x1="480" y1="30" x2="740" y2="30" stroke="#c5a880" strokeWidth="1.2" strokeDasharray="3 4" />
        </g>

        {/* 2. Symmetrical Botanical flourishes (fade & scale in after stitching starts) */}
        <g 
          className="transition-all duration-[800ms]"
          style={{ 
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.92)",
            transformOrigin: "400px 30px",
            transitionDelay: "200ms"
          }}
        >
          {/* Left Floral Scroll */}
          <path d="M 320,30 C 335,30 340,18 355,20 C 365,22 362,34 350,32 C 340,30 338,36 348,38 C 360,40 365,28 372,28" stroke="#c5a880" strokeWidth="1.2" />
          <path d="M 335,30 Q 342,24 340,30 Z" fill="#c5a880" />
          <path d="M 348,38 Q 354,42 352,36 Z" fill="#c5a880" />

          {/* Right Floral Scroll (Mirrored) */}
          <path d="M 480,30 C 465,30 460,18 445,20 C 435,22 438,34 450,32 C 460,30 462,36 452,38 C 440,40 435,28 428,28" stroke="#c5a880" strokeWidth="1.2" />
          <path d="M 465,30 Q 458,24 460,30 Z" fill="#c5a880" />
          <path d="M 452,38 Q 446,42 448,36 Z" fill="#c5a880" />
        </g>

        {/* 3. Wax Seal Stamp (Pops in elastic-style at the end of the sequence) */}
        <g 
          className="transition-all duration-[800ms]"
          style={{ 
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0)",
            transformOrigin: "400px 30px",
            transitionDelay: "450ms",
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
        >
          {/* Irregular melted wax blob shape (handcrafted feel) */}
          <path 
            d="M 400,8 C 414,7 423,17 421,29 C 419,41 409,52 396,51 C 384,50 377,39 379,27 C 381,15 388,9 400,8 Z" 
            fill="#8c2d3a" 
            filter="url(#seal-shadow)" 
          />
          {/* Inner ring indent */}
          <circle cx="400" cy="29" r="16" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" fill="none" />
          {/* Embossed gold monogram/heart design */}
          <path 
            d="M 400,24 C 398.2,20 393.2,20 393.2,24 C 393.2,28.2 400,34 400,34 C 400,34 406.8,28.2 406.8,24 C 406.8,20 401.8,20 400,24 Z" 
            fill="#e5c29e" 
            opacity="0.8" 
          />
        </g>
      </svg>
    </div>
  );
}
