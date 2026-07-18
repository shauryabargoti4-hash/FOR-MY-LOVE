import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RefreshCw } from "lucide-react";

// Romantic quotes to display inside the watch
const QUOTES = [
  "\"My heart is, and always will be, yours.\"\n— Jane Austen",
  "\"You have bewitched me, body and soul, and I love you.\"\n— Pride & Prejudice",
  "\"Every second spent with you is a second treasured for eternity.\"",
  "\"Time stands still when I look into your eyes.\"",
  "\"In all the world, there is no heart for me like yours.\"\n— Maya Angelou",
  "\"You are my today and all of my tomorrows.\"\n— Leo Christopher",
  "\"I love you not only for what you are, but for what I am when I am with you.\""
];

export default function AntiquePocketWatch() {
  const [isOpen, setIsOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [reflection, setReflection] = useState({ x: 50, y: 50 });
  const watchRef = useRef<HTMLDivElement>(null);
  
  // Audio context and nodes for the ticking sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const tickIntervalRef = useRef<number | null>(null);
  const tickCountRef = useRef(0);

  // Handle metallic reflection on mouse move over the watch
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!watchRef.current) return;
    const rect = watchRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setReflection({ x, y });
  };

  const handleMouseLeave = () => {
    setReflection({ x: 50, y: 50 });
  };

  // Synthesize a soft ticking sound using the Web Audio API
  const playTickSound = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Alternate tick and tock pitch slightly
      const isEven = tickCountRef.current % 2 === 0;
      const frequency = isEven ? 800 : 600;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Create a very quick decay for a wooden/metallic mechanical tick sound
      gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.05);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);

      tickCountRef.current += 1;
    } catch (err) {
      console.warn("Audio Context error:", err);
    }
  };

  // Set up the ticking timer
  useEffect(() => {
    // Start ticking once per second
    tickIntervalRef.current = window.setInterval(() => {
      playTickSound();
    }, 1000);

    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [isMuted]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    // Unmute on first open to let the user hear the ticking if desired,
    // but keep it muted by default unless they click mute button
  };

  const cycleQuote = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't close the watch when clicking the next quote button
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    // Resume audio context if browser suspended it
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Pocket Watch Container */}
      <div 
        ref={watchRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={toggleOpen}
        className="relative w-72 h-80 flex items-center justify-center cursor-pointer select-none perspective-1000"
        style={{ touchAction: "none" }}
      >
        {/* Winding Crown & Loop (Top of watch) */}
        <div className="absolute top-2 w-16 h-16 flex flex-col items-center z-20 pointer-events-none">
          {/* Top Loop / Bow */}
          <div className="w-10 h-8 rounded-full border-4 border-amber-600 bg-transparent shadow-inner flex items-center justify-center">
            {/* Small chain link connector */}
            <div className="w-2 h-4 bg-amber-700 rounded-sm translate-y-1"></div>
          </div>
          {/* Winding Stem / Crown */}
          <div className="w-6 h-4 bg-gradient-to-r from-amber-800 via-amber-500 to-amber-800 border border-amber-900 rounded-sm -translate-y-1 shadow-md"></div>
        </div>

        {/* Pocket Watch Case */}
        <div className="absolute top-12 w-64 h-64 rounded-full bg-gradient-to-br from-amber-900 via-yellow-600 to-amber-950 border-[6px] border-amber-800 shadow-2xl flex items-center justify-center overflow-visible">
          
          {/* Outer Gold Bezel */}
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/40 opacity-80 pointer-events-none"></div>

          {/* WATCH FACE (Revealed when open) */}
          <div className="relative w-[232px] h-[232px] rounded-full bg-[#fbf8f0] border-[4px] border-amber-950/20 shadow-inner overflow-hidden flex flex-col items-center justify-center p-6 text-center">
            
            {/* Fine Parchment Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,rgba(240,230,210,0.45)_100%)] pointer-events-none"></div>
            
            {/* Roman Numerals Minute Track */}
            <svg className="absolute inset-0 w-full h-full text-amber-950/20 pointer-events-none" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="0.8" fill="none" strokeDasharray="1,3" />
              <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="0.5" fill="none" />
              {/* Decorative ticks */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 100 + Math.sin(angle) * 82;
                const y1 = 100 - Math.cos(angle) * 82;
                const x2 = 100 + Math.sin(angle) * 88;
                const y2 = 100 - Math.cos(angle) * 88;
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.2" />
                );
              })}
            </svg>

            {/* Escapement / Balance Wheel (Soft ticking mechanical animation) */}
            <div className="absolute top-7 w-10 h-10 rounded-full border border-amber-900/10 flex items-center justify-center pointer-events-none">
              {/* Outer ticking gear */}
              <div 
                className="w-8 h-8 rounded-full border-2 border-dashed border-amber-700/20"
                style={{
                  animation: "tick-wheel 2s steps(2) infinite"
                }}
              ></div>
              {/* Center pivot */}
              <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-900/40"></div>
            </div>

            {/* Romantic Calligraphic Quote */}
            <div className="z-10 mt-6 px-1 flex flex-col justify-center items-center">
              <p className="font-handwritten text-xl text-amber-950 leading-relaxed max-h-[110px] overflow-y-auto whitespace-pre-line px-1">
                {QUOTES[quoteIndex]}
              </p>
            </div>

            {/* Sub-second Hand at Bottom (Soft ticking visual) */}
            <div className="absolute bottom-6 w-8 h-8 rounded-full border border-amber-950/15 flex items-center justify-center pointer-events-none">
              {/* Second hand line */}
              <div 
                className="absolute w-[1px] h-3.5 bg-amber-800 origin-bottom -translate-y-[7px]"
                style={{
                  animation: "tick-hand 60s steps(60) infinite"
                }}
              ></div>
              <div className="w-1 h-1 rounded-full bg-amber-950"></div>
            </div>

            {/* Interactive Buttons (Next Quote and Mute) */}
            <div className="absolute bottom-1 right-10 flex items-center gap-2 z-10">
              {/* Mute/Unmute */}
              <button
                onClick={toggleMute}
                className="p-1 rounded-full text-amber-800/60 hover:text-amber-800 hover:bg-amber-800/5 transition-colors cursor-pointer"
                title={isMuted ? "Unmute ticking" : "Mute ticking"}
              >
                {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
              {/* Next Quote */}
              <button
                onClick={cycleQuote}
                className="p-1 rounded-full text-amber-800/60 hover:text-amber-800 hover:bg-amber-800/5 transition-colors cursor-pointer"
                title="Next memory"
              >
                <RefreshCw size={13} className="hover:rotate-45 transition-transform" />
              </button>
            </div>

          </div>

          {/* 3D POCKET WATCH LID (Swing cover) */}
          <div 
            className="absolute inset-0 rounded-full select-none transform-style-3d origin-left transition-transform duration-[1400ms] ease-in-out shadow-2xl flex items-center justify-center"
            style={{
              transform: isOpen ? "rotateY(-135deg) translateZ(2px)" : "rotateY(0deg)",
              boxShadow: isOpen 
                ? "inset 0 0 20px rgba(0,0,0,0.5), -10px 10px 30px rgba(0,0,0,0.2)" 
                : "none",
              backgroundColor: "#2e1c0c"
            }}
          >
            {/* Outer Lid Cover (Polished Engraved Gold) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffd56b] via-[#b68a35] to-[#47300c] border-[6px] border-[#a57b29] flex flex-col items-center justify-center p-4 backface-hidden shadow-inner">
              
              {/* Dynamic Metallic Shimmer Overlay */}
              <div 
                className="absolute inset-0 rounded-full opacity-40 mix-blend-overlay pointer-events-none transition-all duration-300"
                style={{
                  background: `linear-gradient(${135 + (reflection.x + reflection.y) / 2}deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.6) 100%)`
                }}
              ></div>

              {/* Intricate Victorian/Regency Floral Engraving (SVG vector overlay) */}
              <svg className="absolute inset-0 w-full h-full text-amber-950/25 p-4 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.8" fill="none" strokeDasharray="2,3" />
                <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="0.5" fill="none" />
                {/* Filigree lines */}
                <path d="M 50,14 C 42,24 24,42 50,50 C 76,42 58,24 50,14 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
                <path d="M 50,86 C 42,76 24,58 50,50 C 76,58 58,76 50,86 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
                <path d="M 14,50 C 24,42 42,24 50,50 C 42,76 24,58 14,50 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
                <path d="M 86,50 C 76,42 58,24 50,50 C 58,76 76,58 86,50 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
                {/* Center Monogram Border */}
                <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="0.8" fill="none" />
              </svg>

              {/* Embossed Center Monogram "O & A" */}
              <div className="z-10 w-12 h-12 rounded-full border border-amber-950/20 bg-amber-900/10 flex items-center justify-center shadow-inner">
                <span className="font-handwritten text-[#3a2007] text-lg font-bold">O&A</span>
              </div>
            </div>

            {/* Inner Lid Mirror (Revealed when open, reflects watch face slightly) */}
            <div 
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffeba8] via-[#a8823c] to-[#3a2507] border-[6px] border-[#a57b29] [transform:rotateY(180deg)] backface-hidden flex items-center justify-center overflow-hidden"
              style={{
                WebkitBackfaceVisibility: "hidden"
              }}
            >
              {/* Mirror reflections / glare effect */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-300"
                style={{
                  background: `linear-gradient(${45 + (reflection.x + reflection.y) / 2}deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.8) 100%)`
                }}
              ></div>
              {/* Soft visual reflection of the opposite dial */}
              <div className="w-[190px] h-[190px] rounded-full border border-amber-900/20 opacity-30 shadow-inner flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-950/30"></div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Helper text */}
      <span className="mt-2 text-xs uppercase tracking-widest text-amber-800/60 font-semibold">
        {isOpen ? "Click to close" : "Click to open"}
      </span>

      {/* Styled Animations */}
      <style>{`
        @keyframes tick-wheel {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(45deg); }
        }
        @keyframes tick-hand {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
