import React, { useState } from "react";

interface InteractiveEnvelopeProps {
  recipient: string;
  sender: string;
  content: string;
}

export default function InteractiveEnvelope({ recipient, sender, content }: InteractiveEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div 
      className={`relative w-full max-w-[480px] aspect-[3/2] mx-auto ${
        isOpen ? "mt-48 mb-24 scale-[1.03]" : "mt-8 mb-8 hover:scale-[1.01]"
      }`}
      style={{ transition: "all var(--duration-slow) var(--ease-regency-slow)" }}
    >
      {/* 3D Envelope Wrapper */}
      <div 
        className={`relative w-full h-full bg-[#ebdcb9] rounded-b-xl border border-[#d8c7a2] cursor-pointer ${
          isOpen ? "shadow-2xl" : "shadow-md hover:shadow-lg"
        }`}
        style={{ 
          transition: "box-shadow var(--duration-medium) var(--ease-regency)",
          transitionDelay: "0s"
        }}
        onClick={handleOpen}
      >
        
        {/* 1. Inside Pocket Background (dark warm paper shade) */}
        <div className="absolute inset-0 bg-[#cbb892] rounded-b-xl overflow-hidden shadow-inner" />

        {/* 2. Letter Sheet (Slides upward out of the envelope and elevates to z-index: 30) */}
        <div 
          className={`absolute left-[4%] right-[4%] bg-[#fefdfa] p-6 sm:p-10 border border-gold/10 shadow-lg rounded-md ${
            isOpen 
              ? "-translate-y-[62%] z-20 h-auto opacity-100 scale-100 max-h-[460px] overflow-y-auto" 
              : "top-[8%] bottom-[4%] z-10 opacity-60 scale-[0.96]"
          }`}
          style={{ 
            transformOrigin: "bottom center",
            transition: "all var(--duration-slow) var(--ease-regency-slow)"
          }}
        >
          {/* Embossed laid paper texture overlay */}
          <div className="absolute inset-0 bg-laid-paper opacity-[0.06] pointer-events-none" />

          {/* Letter Content (Fades in with handwriting font style) */}
          <div 
            className={`transition-opacity duration-1000 ease-in-out ${
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{ transitionDelay: isOpen ? "800ms" : "0ms" }}
          >
            <h3 className="font-handwritten text-3xl sm:text-4xl text-[#7a2e38] mb-4">
              My {recipient},
            </h3>
            <div className="font-handwritten text-xl sm:text-2xl leading-relaxed text-muted-foreground space-y-4 whitespace-pre-line px-2 py-1">
              {content.split("\n\n").map((para, idx) => {
                // Don't repeat the signature if we print it separately
                if (para.startsWith("Forever yours") || para.startsWith("My " + recipient)) return null;
                return <p key={idx}>{para}</p>;
              })}
            </div>
            <p className="mt-8 font-handwritten text-2xl sm:text-3xl text-primary text-right pr-3">
              Forever yours,<br />
              <span className="italic">— {sender}</span>
            </p>
          </div>
        </div>

        {/* 3. Front overlapping flaps (Polygon cuts with clip-paths and clean drop shadows) */}
        {/* Bottom Flap Cover */}
        <div 
          className="absolute inset-0 z-15 bg-[#ebdcb9] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]" 
          style={{ 
            clipPath: "polygon(0% 100%, 50% 50%, 100% 100%)",
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px"
          }} 
        />
        {/* Left Side Flap Cover */}
        <div 
          className="absolute inset-0 z-15 bg-[#e5d5b1]" 
          style={{ 
            clipPath: "polygon(0% 0%, 50% 50%, 0% 100%)",
            borderBottomLeftRadius: "12px"
          }} 
        />
        {/* Right Side Flap Cover */}
        <div 
          className="absolute inset-0 z-15 bg-[#e5d5b1]" 
          style={{ 
            clipPath: "polygon(100% 0%, 50% 50%, 100% 100%)",
            borderBottomRightRadius: "12px"
          }} 
        />

        {/* 4. Top Folding Flap (Rotates on horizontal X-axis upward when opened) */}
        <div 
          className="absolute top-0 left-0 right-0 h-1/2 bg-[#dfd0ad] border-t border-[#d1c2a0]" 
          style={{ 
            clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)",
            transformOrigin: "top center",
            transform: isOpen ? "rotateX(180deg) translateY(2px)" : "rotateX(0deg)",
            zIndex: isOpen ? 5 : 25,
            transition: "transform var(--duration-slow) var(--ease-regency-slow), z-index 0s"
          }} 
        />

        {/* 5. Wax Seal (Sits on the tip of the top flap. Splits/Cracks when opened) */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ 
            zIndex: isOpen ? 10 : 30,
            transform: isOpen ? "translate(-50%, -125px) scale(0.9)" : "translate(-50%, -50%) scale(1)",
            opacity: isOpen ? 0.4 : 1,
            transition: "all var(--duration-slow) var(--ease-regency-slow)"
          }}
        >
          <svg 
            className="w-12 h-12 select-none" 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="seal-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Left Half of Wax Seal (Separates and rotates left) */}
            <g 
              style={{ 
                transform: isOpen ? "translateX(-6px) rotate(-10deg)" : "translateX(0px) rotate(0deg)",
                transformOrigin: "24px 24px",
                transition: "transform var(--duration-slow) var(--ease-regency-slow)"
              }}
            >
              {/* Irregular Left Half wax shape */}
              <path 
                d="M24,4 C19,4 12,5.5 8,11 C4,16.5 5,23.5 5,28 C5,32.5 7,37.5 11,41 C15,44.5 20,44 24,44 L24,4 Z" 
                fill="#8c2d3a" 
                filter="url(#seal-shadow)" 
              />
              {/* Inner ring Left Half */}
              <path d="M24,8 C19.5,8 14.5,9.5 11.5,13.5 C8.5,17.5 9,22.5 9,26 C9,29.5 11,33.5 14,36 C17,38.5 21,38 24,38 L24,8 Z" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" fill="none" />
              {/* Gold heart Left Half */}
              <path d="M24,18 C22,14 17,14 17,18 C17,22.2 24,28 24,28 Z" fill="#e5c29e" opacity="0.8" />
            </g>

            {/* Right Half of Wax Seal (Separates and rotates right) */}
            <g 
              style={{ 
                transform: isOpen ? "translateX(6px) rotate(10deg)" : "translateX(0px) rotate(0deg)",
                transformOrigin: "24px 24px",
                transition: "transform var(--duration-slow) var(--ease-regency-slow)"
              }}
            >
              {/* Irregular Right Half wax shape */}
              <path 
                d="M24,4 L24,44 C28,44 33,44.5 37,41 C41,37.5 43,32.5 43,28 C43,23.5 44,16.5 40,11 C36,5.5 29,4 24,4 Z" 
                fill="#8c2d3a" 
                filter="url(#seal-shadow)" 
              />
              {/* Inner ring Right Half */}
              <path d="M24,8 L24,38 C27,38 31,38.5 34,36 C37,33.5 39,29.5 39,26 C39,22.5 39.5,17.5 36.5,13.5 C33.5,9.5 28.5,8 24,8 Z" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" fill="none" />
              {/* Gold heart Right Half */}
              <path d="M24,18 C24,18 31,22.2 31,18 C31,14 26,14 24,18 Z" fill="#e5c29e" opacity="0.8" />
            </g>
          </svg>
        </div>

      </div>
    </div>
  );
}
