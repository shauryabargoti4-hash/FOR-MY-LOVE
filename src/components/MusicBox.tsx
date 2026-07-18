import React, { useEffect, useRef, useState } from "react";
import myCustomSong from "@/assets/igorlisul-the-old-good-path-relaxing-guitar-music-563065.mp3";
import { initAudioAnalyzer, startAnalyzerLoop, stopAnalyzerLoop } from "@/lib/audio-analyzer";

interface NoteParticle {
  id: number;
  char: string;
  left: number;
}

export default function MusicBox() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [notes, setNotes] = useState<NoteParticle[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle Session Storage Preference restore
  useEffect(() => {
    if (!isMounted) return;

    const savedState = sessionStorage.getItem("musicBoxPlayState");
    
    if (savedState === "playing") {
      const resumePlayback = () => {
        if (audioRef.current) {
          initAudioAnalyzer(audioRef.current);
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
              startAnalyzerLoop();
              cleanupEvents();
            })
            .catch((err) => {
              console.log("Autoplay blocked by browser. Awaiting click.", err);
            });
        }
      };

      const cleanupEvents = () => {
        window.removeEventListener("click", resumePlayback);
        window.removeEventListener("scroll", resumePlayback);
        window.removeEventListener("touchstart", resumePlayback);
      };

      // Bind to user interactions to bypass browsers' autoplay blockers
      window.addEventListener("click", resumePlayback);
      window.addEventListener("scroll", resumePlayback);
      window.addEventListener("touchstart", resumePlayback);

      return cleanupEvents;
    }
  }, [isMounted]);

  // Spawn rising musical notes particles while audio is playing
  useEffect(() => {
    if (!isPlaying) {
      setNotes([]);
      return;
    }

    const noteSymbols = ["♪", "♫", "♩", "♬"];
    const interval = setInterval(() => {
      setNotes((prev) => {
        const id = Math.random();
        const char = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];
        const left = Math.random() * 32 - 16; // offset center drift
        const updated = [...prev, { id, char, left }];
        if (updated.length > 5) {
          updated.shift();
        }
        return updated;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      stopAnalyzerLoop();
      sessionStorage.setItem("musicBoxPlayState", "paused");
    } else {
      initAudioAnalyzer(audioRef.current);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          startAnalyzerLoop();
          sessionStorage.setItem("musicBoxPlayState", "playing");
        })
        .catch((err) => {
          console.error("Audio play failed:", err);
        });
    }
  };

  if (!isMounted) return null;

  return (
    <div className="fixed left-4 bottom-4 z-40 select-none pointer-events-auto flex flex-col items-center">
      {/* 1. Hidden Audio Element (Chopin Nocturne Op. 9 No. 2 - Frank Levy recording) */}
      <audio
        ref={audioRef}
        src={myCustomSong}
        loop
        preload="auto"
      />

      {/* 2. Rising Music Note Particles */}
      <div className="relative w-16 h-0 overflow-visible pointer-events-none">
        {notes.map((n) => (
          <span
            key={n.id}
            className="absolute bottom-6 font-handwritten text-gold/90 text-lg font-bold animate-note-float select-none pointer-events-none"
            style={{ 
              left: `calc(50% + ${n.left}px)`,
            }}
          >
            {n.char}
          </span>
        ))}
      </div>

      {/* 3. Vintage Music Box Trigger Button */}
      <button
        type="button"
        onClick={togglePlay}
        className="w-14 h-14 rounded-full bg-[#fbf9f4] border border-[#c5a880]/30 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer hover:shadow-xl focus:outline-none"
        title={isPlaying ? "Mute music box" : "Play music box"}
      >
        <svg 
          className="w-10 h-10 text-gold" 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wooden Music Box Cabinet body */}
          <rect x="12" y="24" width="40" height="30" rx="3" fill="#6d4c41" stroke="#3e2723" strokeWidth="2"/>
          {/* Hinged Lid */}
          <rect x="8" y="16" width="48" height="8" rx="1.5" fill="#8d6e63" stroke="#3e2723" strokeWidth="2"/>
          {/* Brass crest detail */}
          <rect x="24" y="10" width="16" height="6" rx="1" fill="#e5c29e" stroke="#3e2723" strokeWidth="1"/>
          <circle cx="32" cy="13" r="1.5" fill="#8c2d3a"/>

          {/* Winding Stem on the right side */}
          <rect x="52" y="35" width="5" height="3" fill="#e5c29e" stroke="#3e2723" strokeWidth="1"/>

          {/* Winding Handle/Key (spins when playing) */}
          <g 
            className={isPlaying ? "animate-spin" : ""}
            style={{ 
              transformOrigin: "54px 36.5px",
              animationDuration: "3s"
            }}
          >
            <circle cx="56" cy="30" r="3" fill="none" stroke="#e5c29e" strokeWidth="1.5"/>
            <circle cx="56" cy="43" r="3" fill="none" stroke="#e5c29e" strokeWidth="1.5"/>
            <line x1="56" y1="30" x2="56" y2="43" stroke="#e5c29e" strokeWidth="1.5"/>
          </g>

          {/* Center Sound/Note pattern */}
          {isPlaying ? (
            <path d="M 28,38 A 4,4 0 0 1 36,38" stroke="#e5c29e" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          ) : (
            <line x1="26" y1="38" x2="38" y2="38" stroke="#e5c29e" strokeWidth="1.5" strokeLinecap="round"/>
          )}
        </svg>
      </button>

      {/* 4. Small Tooltip hint */}
      <span className="mt-1 text-[8px] uppercase tracking-wider text-muted-foreground/60">
        {isPlaying ? "Playing" : "Music Box"}
      </span>
    </div>
  );
}
