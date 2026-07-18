import React, { useEffect, useState, useRef } from "react";

interface HiddenSealProps {
  noteText: string;
  className?: string;
  align?: "center" | "left" | "right";
}

export default function HiddenSeal({ noteText, className = "", align = "center" }: HiddenSealProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close the popup if clicking outside of the component
  useEffect(() => {
    if (!isMounted) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen, isMounted]);

  if (!isMounted) return null;

  // Determine alignments for popover to prevent viewport overflows on edges
  const alignClass = 
    align === "left" 
      ? "left-0" 
      : align === "right" 
        ? "right-0" 
        : "left-1/2 -translate-x-1/2";

  return (
    <div 
      ref={containerRef} 
      className={`relative inline-block z-30 select-none ${className}`}
    >
      {/* 1. Clickable Tiny Wax Seal */}
      <button
        type="button"
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90 ${
          isOpen 
            ? "scale-105 shadow-md shadow-[#8c2d3a]/25 ring-2 ring-[#c5a880]/30" 
            : "hover:scale-110 shadow-sm hover:shadow shadow-black/10"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        title="Find a hidden love note"
      >
        <svg 
          className="w-full h-full text-gold" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Crimson irregular seal shape */}
          <path 
            d="M16,2 C21.5,1.5 28.5,4.5 28,12 C27.5,19.5 29.5,25.5 23,28.5 C16.5,31.5 9.5,29.5 6,24 C2.5,18.5 2.5,10.5 7,6 C11.5,1.5 10.5,2.5 16,2 Z" 
            fill="#8c2d3a" 
          />
          {/* Gold stamp heart emblem */}
          <path 
            d="M16,13 C15.1,10.5 11.3,10.5 11.3,13 C11.3,15.8 16,19.5 16,19.5 C16,19.5 20.7,15.8 20.7,13 C20.7,10.5 16.9,10.5 16,13 Z" 
            fill="#e5c29e" 
            opacity="0.85" 
          />
        </svg>
      </button>

      {/* 2. Folded Stationery Note Popover (No modal backdrop, fades & scales in) */}
      <div 
        className={`absolute top-[135%] w-60 p-4 bg-[#fefcf8] border border-[#c5a880]/30 shadow-xl rounded-sm transition-all duration-300 ease-out z-40 ${alignClass} ${
          isOpen 
            ? "opacity-100 scale-100 pointer-events-auto" 
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ transformOrigin: "top center" }}
        onClick={(e) => {
          e.stopPropagation(); // Avoid triggering container clicks
          setIsOpen(false); // Close when clicking the note paper itself
        }}
      >
        {/* Irregular backing card paper shadow border */}
        <div className="absolute inset-0 border border-dashed border-[#c5a880]/15 -translate-x-[2.5px] translate-y-[2.5px] rounded-sm pointer-events-none" />

        {/* Handwritten text */}
        <p className="font-handwritten text-xl sm:text-2xl text-[#7a2e38] text-center leading-relaxed px-2 py-1">
          {noteText}
        </p>

        {/* Close instruction */}
        <span className="block mt-2 text-[9px] uppercase tracking-wider text-muted-foreground/60 text-right font-sans">
          Click paper to fold [x]
        </span>
      </div>
    </div>
  );
}
