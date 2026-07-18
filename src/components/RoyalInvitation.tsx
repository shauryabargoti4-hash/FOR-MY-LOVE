import React, { useState } from "react";
import HiddenSeal from "./HiddenSeal";

export default function RoyalInvitation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="invitation" className="relative py-24 px-6 overflow-hidden bg-laid-paper">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Heading */}
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary mb-3">
          Royal Keepsake
        </p>
        <h2 className="text-3xl sm:text-5xl font-medium text-foreground mb-12">
          An Invitation of Honour
        </h2>

        {/* 3D Gatefold Invitation Container */}
        <div className="relative w-full max-w-2xl mx-auto h-[480px] perspective-1000 select-none">
          
          {/* UNDERNEATH: Revealed invitation content */}
          <div className="absolute inset-0 bg-[#fbf9f4] border-2 border-[#b68a35]/30 p-8 sm:p-12 shadow-inner flex flex-col justify-center items-center z-10 transition-opacity duration-1000 rounded-sm">
            {/* Elegant double gold borders */}
            <div className="absolute inset-2 border border-[#b68a35]/15 pointer-events-none" />
            <div className="absolute inset-4 border border-dashed border-[#b68a35]/10 pointer-events-none" />

            {/* Invitation Content */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#b68a35] mb-2 block font-semibold">
                The Honour of Your Presence is Requested
              </span>
              <span className="font-handwritten text-4xl sm:text-5xl text-[#7a2e38] my-3 block leading-tight">
                Lady Arya
              </span>
              <p className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground uppercase my-1 font-bold">
                to celebrate
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-foreground font-medium tracking-wide my-2 uppercase">
                Nine Months of Devotion
              </h3>
              <p className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground uppercase my-1 font-bold">
                With Lord Om
              </p>
              
              <div className="w-16 h-px bg-[#b68a35]/30 my-6" />

              <p className="font-serif italic text-base sm:text-lg text-[#3a2b27]/80 max-w-md leading-relaxed px-4">
                "Commencing on the eighteenth of October, two thousand and twenty-five. May this digital testament stand as a witness to our waltz side-by-side."
              </p>

              <div className="mt-8">
                <span className="font-handwritten text-2xl text-[#b68a35]">
                  Forever Devoted, Om
                </span>
              </div>
            </div>
          </div>

          {/* OVERLAY: Left Door / Panel */}
          <div 
            className={`absolute top-0 bottom-0 left-0 w-1/2 bg-[#efe6d8] border-y border-l border-[#b68a35]/35 shadow-md origin-left transform transform-style-3d z-20 rounded-l-sm ${
              isOpen ? "-rotate-y-180 pointer-events-none" : "rotate-y-0"
            }`}
            style={{ 
              transition: "transform var(--duration-slow) var(--ease-regency-slow)",
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden" 
            }}
          >
            {/* Front outer design of left panel */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between border-r border-dashed border-[#b68a35]/25 bg-laid-paper rounded-l-sm">
              {/* Gold corners */}
              <div className="absolute top-2.5 left-2.5 w-8 h-8 border-t border-l border-[#b68a35]/45" />
              <div className="absolute bottom-2.5 left-2.5 w-8 h-8 border-b border-l border-[#b68a35]/45" />
              
              <div className="text-left font-serif text-[11px] uppercase tracking-widest text-[#b68a35] opacity-50 font-bold">
                Om & Arya
              </div>
              <div className="text-right font-handwritten text-5xl text-[#7a2e38] select-none pr-3">
                A
              </div>
            </div>
          </div>

          {/* OVERLAY: Right Door / Panel */}
          <div 
            className={`absolute top-0 bottom-0 right-0 w-1/2 bg-[#efe6d8] border-y border-r border-[#b68a35]/35 shadow-md origin-right transform transform-style-3d z-20 rounded-r-sm ${
              isOpen ? "rotate-y-180 pointer-events-none" : "rotate-y-0"
            }`}
            style={{ 
              transition: "transform var(--duration-slow) var(--ease-regency-slow)",
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden" 
            }}
          >
            {/* Front outer design of right panel */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between border-l border-dashed border-[#b68a35]/25 bg-laid-paper rounded-r-sm">
              {/* Gold corners */}
              <div className="absolute top-2.5 right-2.5 w-8 h-8 border-t border-r border-[#b68a35]/45" />
              <div className="absolute bottom-2.5 right-2.5 w-8 h-8 border-b border-r border-[#b68a35]/45" />

              <div className="text-right font-serif text-[11px] uppercase tracking-widest text-[#b68a35] opacity-50 font-bold">
                18.10.2025
              </div>
              <div className="text-left font-handwritten text-5xl text-[#7a2e38] select-none pl-3">
                S
              </div>
            </div>
          </div>

          {/* OVERLAY: Ribbon Band & Wax Seal (Fades and cracks on open) */}
          <div 
            className={`absolute inset-0 flex items-center justify-center pointer-events-none z-30 ${
              isOpen ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
            }`}
            style={{ transition: "all var(--duration-slow) var(--ease-regency-slow)" }}
          >
            {/* Vertical Ribbon strip */}
            <div className="absolute top-0 bottom-0 w-8 bg-[#5e2a35] shadow-[0_0_12px_rgba(0,0,0,0.15)] flex items-center justify-center">
              {/* Gold threads lining ribbon */}
              <div className="absolute top-0 bottom-0 left-[2px] w-[1px] bg-[#d6b97a]/40" />
              <div className="absolute top-0 bottom-0 right-[2px] w-[1px] bg-[#d6b97a]/40" />
            </div>

            {/* Horizontal Ribbon strip */}
            <div className="absolute left-0 right-0 h-8 bg-[#5e2a35] shadow-[0_0_12px_rgba(0,0,0,0.15)] flex items-center justify-center">
              {/* Gold threads lining ribbon */}
              <div className="absolute left-0 right-0 top-[2px] h-[1px] bg-[#d6b97a]/40" />
              <div className="absolute left-0 right-0 bottom-[2px] h-[1px] bg-[#d6b97a]/40" />
            </div>

            {/* Clickable Large Red Wax Seal Stamp */}
            <button
              onClick={() => setIsOpen(true)}
              className="absolute w-20 h-20 rounded-full cursor-pointer select-auto pointer-events-auto transform hover:scale-110 active:scale-95 shadow-lg active:shadow-md"
              style={{ transition: "transform var(--duration-fast) var(--ease-regency-elastic), box-shadow var(--duration-fast) var(--ease-regency)" }}
              title="Unseal Royal Invitation"
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
                  fill="#5e2a35" 
                  stroke="#3e1a20"
                  strokeWidth="0.5"
                />
                {/* Gold stamp crest initials */}
                <path 
                  d="M16,13 C15.1,10.5 11.3,10.5 11.3,13 C11.3,15.8 16,19.5 16,19.5 C16,19.5 20.7,15.8 20.7,13 C20.7,10.5 16.9,10.5 16,13 Z" 
                  fill="#d6b97a" 
                  opacity="0.9" 
                />
              </svg>
              {/* Micro-sparkle glow indicator */}
              <div className="absolute inset-0 rounded-full animate-ping bg-[#d6b97a]/15 pointer-events-none" />
            </button>

            {/* Fold instructions text helper */}
            <div className="absolute top-[62%] text-[10px] uppercase tracking-widest text-[#d6b97a] font-sans font-semibold">
              Tap Seal to Open
            </div>
          </div>

          {/* Under-panel fold back option */}
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-[#b68a35] hover:text-[#5e2a35] cursor-pointer font-semibold"
            >
              Fold Invitation [x]
            </button>
          )}

        </div>
      </div>
    </section>
  );
}
