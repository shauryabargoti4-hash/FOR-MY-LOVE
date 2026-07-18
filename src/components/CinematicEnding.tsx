/**
 * CinematicEnding
 *
 * A cinematic, scroll-triggered closing scene inspired by Regency period drama finales.
 *
 * Sequence (triggered on IntersectionObserver entry):
 *  0.0s  — Section fades in, warm ivory light blooms from bottom
 *  0.4s  — Wax seal rises from below (translateY + scale)
 *  0.8s  — Seal settles. Golden particles begin floating.
 *  2.5s  — Seal begins slow 3D flip (rotateY 0 → 180°, 2.8s duration)
 *  5.4s  — Back face (A ♡ S) is fully visible, seal gently oscillates
 *  5.8s  — Handwritten sentence fades in letter by letter
 *  7.0s  — Final signature & heart pulse in
 *
 * The page ends with a soft ivory radial glow — no abrupt footer.
 */

import { useEffect, useRef, useState } from "react";

// ─── Particle config ──────────────────────────────────────────────────────────

const PARTICLES = [
  { top: "18%", left: "12%",  size: 3.5,  dur: "7.2s",  delay: "0.0s",  op: 0.55 },
  { top: "32%", left: "82%",  size: 2.5,  dur: "9.4s",  delay: "1.1s",  op: 0.40 },
  { top: "60%", left: "6%",   size: 4.0,  dur: "8.1s",  delay: "2.3s",  op: 0.50 },
  { top: "75%", left: "88%",  size: 2.0,  dur: "6.8s",  delay: "0.7s",  op: 0.35 },
  { top: "12%", left: "55%",  size: 3.0,  dur: "10.2s", delay: "3.0s",  op: 0.45 },
  { top: "45%", left: "92%",  size: 2.5,  dur: "7.8s",  delay: "1.8s",  op: 0.38 },
  { top: "82%", left: "22%",  size: 3.5,  dur: "9.0s",  delay: "4.2s",  op: 0.48 },
  { top: "25%", left: "38%",  size: 1.8,  dur: "11.0s", delay: "2.7s",  op: 0.30 },
  { top: "68%", left: "68%",  size: 2.8,  dur: "8.5s",  delay: "5.0s",  op: 0.42 },
  { top: "10%", left: "78%",  size: 4.2,  dur: "6.5s",  delay: "0.4s",  op: 0.55 },
  { top: "52%", left: "18%",  size: 2.2,  dur: "9.8s",  delay: "3.5s",  op: 0.36 },
  { top: "88%", left: "52%",  size: 3.0,  dur: "7.5s",  delay: "1.4s",  op: 0.44 },
  { top: "38%", left: "62%",  size: 1.6,  dur: "12.0s", delay: "6.0s",  op: 0.28 },
  { top: "72%", left: "45%",  size: 2.4,  dur: "8.8s",  delay: "2.0s",  op: 0.40 },
  { top: "20%", left: "28%",  size: 3.2,  dur: "7.0s",  delay: "4.8s",  op: 0.50 },
  { top: "5%",  left: "42%",  size: 2.0,  dur: "10.5s", delay: "3.8s",  op: 0.32 },
  { top: "92%", left: "75%",  size: 3.8,  dur: "8.2s",  delay: "1.6s",  op: 0.46 },
  { top: "48%", left: "35%",  size: 1.5,  dur: "9.2s",  delay: "5.5s",  op: 0.25 },
  { top: "16%", left: "65%",  size: 2.8,  dur: "7.6s",  delay: "0.9s",  op: 0.42 },
  { top: "78%", left: "10%",  size: 3.4,  dur: "8.6s",  delay: "3.2s",  op: 0.48 },
];

// ─── Front Seal SVG ───────────────────────────────────────────────────────────

function FrontSeal() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-2xl"
      aria-label="Wax seal front"
    >
      <defs>
        {/* Deep wax radial — gives dimensional depth */}
        <radialGradient id="waxFront" cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stopColor="#A83048" />
          <stop offset="45%"  stopColor="#7A1E2E" />
          <stop offset="100%" stopColor="#4A0E1C" />
        </radialGradient>
        {/* Gold emboss gradient */}
        <linearGradient id="goldFront" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#F0D898" />
          <stop offset="40%"  stopColor="#D6B97A" />
          <stop offset="100%" stopColor="#9A7040" />
        </linearGradient>
        {/* Subtle gloss highlight */}
        <radialGradient id="glossFront" cx="30%" cy="28%" r="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id="sealShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* ── Wax blob (organic irregular circle) ── */}
      <path
        d="M100 10
           C 130 8  152 18  160 38
           C 168 58  174 78  168 98
           C 162 118 155 140 138 155
           C 121 170  98 178  76 172
           C 54  166  36 150  26 130
           C 16  110  12  86  18  64
           C 24  42   40  18  62  12
           C 74   8   88  10  100 10 Z"
        fill="url(#waxFront)"
        filter="url(#sealShadow)"
      />

      {/* Gloss overlay */}
      <path
        d="M100 10
           C 130 8  152 18  160 38
           C 168 58  174 78  168 98
           C 162 118 155 140 138 155
           C 121 170  98 178  76 172
           C 54  166  36 150  26 130
           C 16  110  12  86  18  64
           C 24  42   40  18  62  12
           C 74   8   88  10  100 10 Z"
        fill="url(#glossFront)"
      />

      {/* ── Outer embossed ring ── */}
      <circle cx="100" cy="96" r="72"
        stroke="url(#goldFront)" strokeWidth="1.2"
        fill="none" opacity="0.60" />

      {/* ── Inner decorative ring ── */}
      <circle cx="100" cy="96" r="60"
        stroke="url(#goldFront)" strokeWidth="0.7"
        fill="none" opacity="0.40" />

      {/* ── Tiny petal ornaments around the inner ring ── */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 100 + 60 * Math.cos(rad);
        const y = 96  + 60 * Math.sin(rad);
        return (
          <circle key={deg}
            cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.2"
            fill="url(#goldFront)" opacity="0.55" />
        );
      })}

      {/* ── Centre dot ── */}
      <circle cx="100" cy="96" r="5"
        fill="url(#goldFront)" opacity="0.45" />

      {/* ── Embossed letter B ── */}
      <text
        x="100" y="116"
        fontFamily="Playfair Display, Georgia, serif"
        fontSize="72"
        fontWeight="700"
        fill="url(#goldFront)"
        fillOpacity="0.88"
        textAnchor="middle"
        style={{ letterSpacing: "-1px" }}
      >
        B
      </text>

      {/* Subtle inner shadow on B for depth */}
      <text
        x="101" y="117"
        fontFamily="Playfair Display, Georgia, serif"
        fontSize="72"
        fontWeight="700"
        fill="#000"
        fillOpacity="0.12"
        textAnchor="middle"
      >
        B
      </text>
    </svg>
  );
}

// ─── Back Seal SVG ────────────────────────────────────────────────────────────

function BackSeal() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-2xl"
      aria-label="Wax seal back"
    >
      <defs>
        <radialGradient id="waxBack" cx="62%" cy="34%" r="65%">
          <stop offset="0%"   stopColor="#A83048" />
          <stop offset="45%"  stopColor="#7A1E2E" />
          <stop offset="100%" stopColor="#4A0E1C" />
        </radialGradient>
        <linearGradient id="goldBack" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#F0D898" />
          <stop offset="40%"  stopColor="#D6B97A" />
          <stop offset="100%" stopColor="#9A7040" />
        </linearGradient>
        <radialGradient id="glossBack" cx="70%" cy="28%" r="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id="sealShadow2" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* ── Wax blob ── */}
      <path
        d="M100 10
           C 130 8  152 18  160 38
           C 168 58  174 78  168 98
           C 162 118 155 140 138 155
           C 121 170  98 178  76 172
           C 54  166  36 150  26 130
           C 16  110  12  86  18  64
           C 24  42   40  18  62  12
           C 74   8   88  10  100 10 Z"
        fill="url(#waxBack)"
        filter="url(#sealShadow2)"
      />
      <path
        d="M100 10
           C 130 8  152 18  160 38
           C 168 58  174 78  168 98
           C 162 118 155 140 138 155
           C 121 170  98 178  76 172
           C 54  166  36 150  26 130
           C 16  110  12  86  18  64
           C 24  42   40  18  62  12
           C 74   8   88  10  100 10 Z"
        fill="url(#glossBack)"
      />

      {/* ── Outer ring ── */}
      <circle cx="100" cy="96" r="72"
        stroke="url(#goldBack)" strokeWidth="1.2"
        fill="none" opacity="0.60" />
      <circle cx="100" cy="96" r="60"
        stroke="url(#goldBack)" strokeWidth="0.7"
        fill="none" opacity="0.40" />

      {/* ── Petal dots ── */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 100 + 60 * Math.cos(rad);
        const y = 96  + 60 * Math.sin(rad);
        return (
          <circle key={deg}
            cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.2"
            fill="url(#goldBack)" opacity="0.55" />
        );
      })}

      {/* ── Decorative crown flourish above initials ── */}
      <path d="M78 62 C82 54 90 52 100 56 C110 52 118 54 122 62"
        stroke="url(#goldBack)" strokeWidth="1.2" fill="none" opacity="0.70"
        strokeLinecap="round" />
      <circle cx="78"  cy="62" r="2.5" fill="url(#goldBack)" opacity="0.65" />
      <circle cx="100" cy="54" r="3"   fill="url(#goldBack)" opacity="0.70" />
      <circle cx="122" cy="62" r="2.5" fill="url(#goldBack)" opacity="0.65" />

      {/* ── Intertwined A ♡ S ── */}
      {/* A */}
      <text x="72" y="108"
        fontFamily="Dancing Script, cursive"
        fontSize="44" fontWeight="700"
        fill="url(#goldBack)" fillOpacity="0.90"
        textAnchor="middle">
        A
      </text>
      {/* Heart */}
      <text x="100" y="108"
        fontFamily="serif"
        fontSize="28"
        fill="#D6B97A" fillOpacity="0.92"
        textAnchor="middle">
        ♡
      </text>
      {/* S */}
      <text x="128" y="108"
        fontFamily="Dancing Script, cursive"
        fontSize="44" fontWeight="700"
        fill="url(#goldBack)" fillOpacity="0.90"
        textAnchor="middle">
        S
      </text>

      {/* ── Bottom flourish ── */}
      <path d="M78 122 C85 130 95 132 100 130 C105 132 115 130 122 122"
        stroke="url(#goldBack)" strokeWidth="1.0" fill="none" opacity="0.55"
        strokeLinecap="round" />

      {/* Centre dot */}
      <circle cx="100" cy="96" r="4" fill="url(#goldBack)" opacity="0.40" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CinematicEndingProps {
  herName: string;
  yourName: string;
}

export default function CinematicEnding({ herName, yourName }: CinematicEndingProps) {
  const sectionRef    = useRef<HTMLElement>(null);
  const [entered,     setEntered]     = useState(false);
  const [sealVisible, setSealVisible] = useState(false);
  const [flipping,    setFlipping]    = useState(false);
  const [flipped,     setFlipped]     = useState(false);
  const [showQuote,   setShowQuote]   = useState(false);
  const [showSig,     setShowSig]     = useState(false);
  const [oscillate,   setOscillate]   = useState(false);
  const [isMounted,   setIsMounted]   = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (!isMounted) return;
    const section = sectionRef.current;
    if (!section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !entered) {
          setEntered(true);

          // Sequence timings
          setTimeout(() => setSealVisible(true),  400);
          setTimeout(() => setFlipping(true),    2500);
          setTimeout(() => setFlipped(true),     5200);
          setTimeout(() => setOscillate(true),   5600);
          setTimeout(() => setShowQuote(true),   5900);
          setTimeout(() => setShowSig(true),     7200);
        }
      },
      { threshold: 0.25 }
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, [isMounted, entered]);

  // Flip angle: 0 → 180 when flipping, stays at 180 when flipped
  const flipAngle = flipped ? 180 : flipping ? 180 : 0;

  // Oscillation after flip settles
  const oscillateStyle: React.CSSProperties = oscillate
    ? {
        animation: "seal-oscillate 5s ease-in-out infinite",
        animationDelay: "0s",
      }
    : {};

  if (!isMounted) return null;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden select-none"
      style={{
        background:
          "linear-gradient(180deg, #EFE6D8 0%, #F6F1E8 30%, #FAF7F2 70%, #FFFDF9 100%)",
      }}
    >
      {/* ── Scoped keyframes ── */}
      <style>{`
        @keyframes particle-drift {
          0%   { transform: translateY(0px)   scale(1);    opacity: var(--op); }
          35%  { transform: translateY(-22px) scale(1.15); opacity: calc(var(--op) * 1.3); }
          65%  { transform: translateY(-10px) scale(0.9);  opacity: calc(var(--op) * 0.8); }
          100% { transform: translateY(0px)   scale(1);    opacity: var(--op); }
        }
        @keyframes particle-shimmer {
          0%, 100% { box-shadow: 0 0 3px 1px rgba(214,185,122,0.4); }
          50%       { box-shadow: 0 0 8px 3px rgba(214,185,122,0.7); }
        }
        @keyframes seal-rise {
          from { transform: translateY(60px) scale(0.72); opacity: 0; }
          to   { transform: translateY(0px)  scale(1);    opacity: 1; }
        }
        @keyframes seal-oscillate {
          0%,100% { transform: rotateY(180deg) rotate(-1.5deg); }
          25%     { transform: rotateY(180deg) rotate( 1.2deg); }
          50%     { transform: rotateY(180deg) rotate(-0.8deg); }
          75%     { transform: rotateY(180deg) rotate( 1.8deg); }
        }
        @keyframes quote-reveal {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sig-reveal {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heart-beat {
          0%,100% { transform: scale(1);    }
          15%     { transform: scale(1.28); }
          30%     { transform: scale(1);    }
          45%     { transform: scale(1.18); }
          60%     { transform: scale(1);    }
        }
        @keyframes bottom-glow {
          0%,100% { opacity: 0.55; }
          50%     { opacity: 0.75; }
        }
        @keyframes lace-slide {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
      `}</style>

      {/* ── Top lace border ── */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden"
        style={{ height: "2px", background: "linear-gradient(90deg, transparent, #D6B97A66, #D6B97A, #D6B97A66, transparent)" }}
      />

      {/* ── Golden dust particles ── */}
      {entered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: p.top,
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: "50%",
                background: `radial-gradient(circle, #F0D898 0%, #B68A35 60%, transparent 100%)`,
                animation: `particle-drift ${p.dur} ease-in-out ${p.delay} infinite, particle-shimmer ${p.dur} ease-in-out ${p.delay} infinite`,
                ["--op" as string]: p.op,
                opacity: p.op,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Section title ── */}
      <div
        className="relative z-10 mb-14"
        style={{
          opacity: entered ? 1 : 0,
          transition: "opacity 1.2s ease 0.2s",
        }}
      >
        <p className="text-xs uppercase tracking-[0.35em] font-semibold"
          style={{ color: "#B68A35", fontFamily: "serif" }}>
          Fin
        </p>
        <div
          className="mt-3 mx-auto"
          style={{
            width: "120px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #D6B97A, transparent)",
            transformOrigin: "center",
            animation: entered ? "lace-slide 1.2s ease 0.4s both" : "none",
          }}
        />
      </div>

      {/* ── 3D Wax Seal ── */}
      <div
        className="relative z-10 mb-14"
        style={{
          width: "220px",
          height: "220px",
          perspective: "900px",
          animation: sealVisible ? "seal-rise var(--duration-slow) var(--ease-regency-elastic) 0s both" : "none",
          opacity: sealVisible ? 1 : 0,
        }}
      >
        {/* Card wrapper — flips on rotateY */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateY(${flipAngle}deg)`,
            transition: flipping && !flipped
              ? "transform 2.8s var(--ease-regency-slow)"
              : "none",
            ...oscillateStyle,
          }}
        >
          {/* Front face */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <FrontSeal />
          </div>

          {/* Back face (pre-rotated 180° so it shows when card is flipped) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <BackSeal />
          </div>
        </div>
      </div>

      {/* ── Divider rule ── */}
      <div
        style={{
          width: "240px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #D6B97A88, transparent)",
          marginBottom: "3rem",
          opacity: showQuote ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      />

      {/* ── Handwritten quote ── */}
      <p
        className="relative z-10"
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          color: "#5E2A35",
          maxWidth: "600px",
          lineHeight: 1.55,
          fontStyle: "italic",
          fontWeight: 600,
          padding: "0 1.5rem",
          animation: showQuote ? "quote-reveal 1.4s cubic-bezier(0.16,1,0.3,1) both" : "none",
          opacity: showQuote ? 1 : 0,
        }}
      >
        "And so the story continues,<br />
        one heartbeat at a time."
      </p>

      {/* ── Final signature ── */}
      <div
        className="relative z-10 mt-16 flex flex-col items-center gap-4"
        style={{
          animation: showSig ? "sig-reveal 1.2s ease both" : "none",
          opacity: showSig ? 1 : 0,
        }}
      >
        {/* Decorative rule */}
        <div style={{
          width: "80px", height: "1px",
          background: "linear-gradient(90deg, transparent, #B68A35, transparent)",
        }} />

        <p style={{
          fontFamily: "serif",
          fontSize: "1.1rem",
          color: "#3A2B27",
          letterSpacing: "0.04em",
          fontWeight: 500,
          opacity: 0.82,
        }}>
          I love you, {herName}.
        </p>

        <p style={{
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.28em",
          color: "#6B4A1E",
          opacity: 0.65,
          fontFamily: "serif",
        }}>
          Forever yours — {yourName}
        </p>

        {/* Pulsing heart */}
        <span
          style={{
            fontSize: "1.4rem",
            color: "#8B2252",
            display: "block",
            marginTop: "0.5rem",
            animation: showSig ? "heart-beat 2.2s ease-in-out 0.5s infinite" : "none",
          }}
          aria-hidden="true"
        >
          ♡
        </span>
      </div>

      {/* ── Bottom ivory glow — soft ending light ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "280px",
          background:
            "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(255,253,248,0.95) 0%, rgba(250,247,242,0.6) 50%, transparent 100%)",
          animation: "bottom-glow 4s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      {/* ── Absolute bottom fade to pure ivory ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "120px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(255,253,250,0.85) 60%, #FFFDF9 100%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
