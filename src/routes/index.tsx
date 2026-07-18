import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  differenceInCalendarDays,
  differenceInMonths,
  addMonths,
  format,
} from "date-fns";
import {
  Heart,
  Coffee,
  MapPin,
  Music,
  Home,
  Plane,
  Camera,
  Star,
  Sparkles,
} from "lucide-react";

import ScrollAnimation from "@/components/ScrollAnimation";
import RegencyDivider from "@/components/RegencyDivider";
import InteractiveEnvelope from "@/components/InteractiveEnvelope";
import ScrapbookGallery from "@/components/ScrapbookGallery";
import RoyalLibrary from "@/components/RoyalLibrary";
import HiddenSeal from "@/components/HiddenSeal";
import Preloader from "@/components/Preloader";
import RoyalInvitation from "@/components/RoyalInvitation";
import RegencyCandle from "@/components/RegencyCandle";
import CinematicEnding from "@/components/CinematicEnding";
import AntiquePocketWatch from "@/components/AntiquePocketWatch";
import RegencyChandelier from "@/components/RegencyChandelier";
import heroArya from "@/assets/hero-arya.jpg";
import memory1 from "@/assets/memory-1.jpg";
import memory2 from "@/assets/memory-2.jpg";
import memory3 from "@/assets/memory-3.jpg";
import memory4 from "@/assets/memory-4.jpg";

// ── Customise these for Arya ──
const HER_NAME = "Arya";
const YOUR_NAME = "OM";
const START_DATE = "2025-10-18";

const memories = [
  {
    month: 1,
    title: "The First Hello",
    text: "The conversation that started everything — and somehow never really ended.",
    icon: Heart,
  },
  {
    month: 2,
    title: "Late-Night Talks",
    text: "We traded sleep for stories, and every minute felt like a secret.",
    icon: Coffee,
  },
  {
    month: 3,
    title: "Our First Adventure",
    text: "A little trip that proved we could get lost, tired, and hungry — and still laugh.",
    icon: MapPin,
  },
  {
    month: 4,
    title: "Sunday Mornings",
    text: "The slow kind of mornings where coffee tastes better because you're across from me.",
    icon: Home,
  },
  {
    month: 5,
    title: "Meeting Your World",
    text: "Every new corner of you I discovered made me like you even more.",
    icon: Music,
  },
  {
    month: 6,
    title: "The Hard Week",
    text: "Life threw things at us, but we caught them together. That's when I knew.",
    icon: Star,
  },
  {
    month: 7,
    title: "Inside Jokes",
    text: "A whole language built from glances, nonsense words, and remembered details.",
    icon: Camera,
  },
  {
    month: 8,
    title: "Planning Forever",
    text: "Future stopped being scary the moment it had your name in it.",
    icon: Plane,
  },
  {
    month: 9,
    title: "Right Now",
    text: "Nine months in, and I still choose you. Every single day.",
    icon: Sparkles,
  },
];

const photos = [
  { 
    src: memory1, 
    caption: `OUR PROPOSAL
THE MOST BEAUTIFUL PART OF MY LIFE` 
  },
  { 
    src: memory2, 
    caption: "OUR FIRST VIDEO CALL" 
  },
  { 
    src: memory3, 
    caption: "FIRST TIME HAVING CHEESECAKE WITH MY KUCHHU PUCHHU" 
  },
  { 
    src: memory4, 
    caption: `OUR FIRST TRIP TOGATHER
IMAGICA` 
  },
];

const books = [
  {
    id: 1,
    title: "Our Proposal",
    subtitle: "Vol. I",
    spineColor: "#5E2A35",
    coverColor: "#4a1f28",
    pageColor: "#fdf6ee",
    goldTone: "#D6B97A",
    src: memory1,
    caption: `OUR PROPOSAL\nTHE MOST BEAUTIFUL PART OF MY LIFE`,
    floral: "M20,8 Q28,14 20,20 Q12,14 20,8 Z M8,20 Q14,12 20,20 Q14,28 8,20 Z M32,20 Q26,12 20,20 Q26,28 32,20 Z M20,32 Q28,26 20,20 Q12,26 20,32 Z",
  },
  {
    id: 2,
    title: "First Video Call",
    subtitle: "Vol. II",
    spineColor: "#2D4A3E",
    coverColor: "#1e3329",
    pageColor: "#f5faf7",
    goldTone: "#C5A880",
    src: memory2,
    caption: "OUR FIRST VIDEO CALL",
    floral: "M20,5 Q35,20 20,35 Q5,20 20,5 Z M5,20 Q20,5 35,20 Q20,35 5,20 Z",
  },
  {
    id: 3,
    title: "Cheesecake Date",
    subtitle: "Vol. III",
    spineColor: "#1B3A5C",
    coverColor: "#112844",
    pageColor: "#f2f6fc",
    goldTone: "#D6B97A",
    src: memory3,
    caption: "FIRST TIME HAVING CHEESECAKE\nWITH MY KUCHHU PUCHHU",
    floral: "M20,6 C26,12 34,12 34,20 C34,28 26,28 20,34 C14,28 6,28 6,20 C6,12 14,12 20,6 Z",
  },
  {
    id: 4,
    title: "Imagica Trip",
    subtitle: "Vol. IV",
    spineColor: "#6B4A1E",
    coverColor: "#503614",
    pageColor: "#fdf8f0",
    goldTone: "#E8C97E",
    src: memory4,
    caption: `OUR FIRST TRIP TOGATHER\nIMAGICA`,
    floral: "M20,4 Q24,10 30,10 Q24,16 20,22 Q16,16 10,10 Q16,10 20,4 Z M20,36 Q16,30 10,30 Q16,24 20,18 Q24,24 30,30 Q24,30 20,36 Z",
  },
];

const loveLetter = `My Arya,

Nine months. Not a lifetime, not yet — but somehow long enough to know, and short enough to still feel like the beginning.

You are my favourite person to come home to, my favourite voice on the phone, my favourite hand to hold in a crowd. You make ordinary days feel like celebrations and celebrations feel like coming home.

I built this little corner of the internet because the world deserves to know — and because you deserve to be reminded every day — that I love you. Not just the easy, glowing moments, but the quiet, complicated, real ones too.

Here's to month ten, and the year after that, and all the ones we can't count yet.

Forever yours,`;

interface AnniversaryStats {
  months: number;
  daysTogether: number;
  daysUntilNext: number;
  nextDateLabel: string;
}

interface FloatingHeart {
  id: number;
  left: string;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `Happy 9-Month Anniversary, ${HER_NAME}` },
      {
        name: "description",
        content: `A love-letter website from ${YOUR_NAME} for ${HER_NAME}.`,
      },
      {
        property: "og:title",
        content: `Happy 9-Month Anniversary, ${HER_NAME}`,
      },
      {
        property: "og:description",
        content: `A love-letter website from ${YOUR_NAME} for ${HER_NAME}.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [stats, setStats] = useState<AnniversaryStats | null>(null);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const start = new Date(START_DATE);
    const today = new Date();
    const months = differenceInMonths(today, start);
    const daysTogether = differenceInCalendarDays(today, start);
    const nextMonthiversary = addMonths(start, months + 1);
    const daysUntilNext = differenceInCalendarDays(nextMonthiversary, today);

    setStats({
      months,
      daysTogether,
      daysUntilNext,
      nextDateLabel: format(nextMonthiversary, "MMMM d, yyyy"),
    });
  }, []);

  const sendLove = () => {
    const id = Date.now();
    const left = `${Math.random() * 70 + 15}%`;
    setHearts((prev) => [...prev, { id, left }]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1800);
  };

  return (
    <main className="overflow-x-hidden bg-laid-paper min-h-screen relative">
      <Preloader />
      {/* ── Scroll Animation Hero ── */}
      <ScrollAnimation />

      {/* ── Hero ── */}
      <section id="hero" className="relative flex min-h-screen items-center justify-center px-6 text-center overflow-hidden">
        {/* Regency Corner Ornaments (Under 6% opacity) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Top-Left Scroll */}
          <svg className="absolute top-8 left-8 w-20 h-20 text-gold opacity-[0.05]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10,10 Q25,15 35,25 Q45,35 45,50 Q42,42 35,37 Q25,30 10,30 Z M10,10 Q15,25 25,35 Q35,45 50,45 Q42,42 37,35 Q30,25 30,10 Z M10,10 C20,20 40,25 60,15 C50,22 35,22 25,25 Z" />
          </svg>
          {/* Top-Right Scroll */}
          <svg className="absolute top-8 right-8 w-20 h-20 text-gold opacity-[0.05] rotate-90" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10,10 Q25,15 35,25 Q45,35 45,50 Q42,42 35,37 Q25,30 10,30 Z M10,10 Q15,25 25,35 Q35,45 50,45 Q42,42 37,35 Q30,25 30,10 Z M10,10 C20,20 40,25 60,15 C50,22 35,22 25,25 Z" />
          </svg>
          {/* Bottom-Left Scroll */}
          <svg className="absolute bottom-8 left-8 w-20 h-20 text-gold opacity-[0.05] -rotate-90" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10,10 Q25,15 35,25 Q45,35 45,50 Q42,42 35,37 Q25,30 10,30 Z M10,10 Q15,25 25,35 Q35,45 50,45 Q42,42 37,35 Q30,25 30,10 Z M10,10 C20,20 40,25 60,15 C50,22 35,22 25,25 Z" />
          </svg>
          {/* Bottom-Right Scroll */}
          <svg className="absolute bottom-8 right-8 w-20 h-20 text-gold opacity-[0.05] rotate-180" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10,10 Q25,15 35,25 Q45,35 45,50 Q42,42 35,37 Q25,30 10,30 Z M10,10 Q15,25 25,35 Q35,45 50,45 Q42,42 37,35 Q30,25 30,10 Z M10,10 C20,20 40,25 60,15 C50,22 35,22 25,25 Z" />
          </svg>
        </div>

        <img
          src={heroArya}
          alt={`A special photo for ${HER_NAME}`}
          width={1280}
          height={800}
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />

        {/* ── Regency Chandelier (music-reactive sparkles & sway) ── */}
        <RegencyChandelier />

        <div className="relative z-10 mx-auto max-w-3xl">
          {/* Candles flanking the hero heading */}
          <div className="absolute -left-16 top-8 hidden lg:block">
            <RegencyCandle bodyHeight={100} proximityRadius={220} />
          </div>
          <div className="absolute -right-16 top-8 hidden lg:block">
            <RegencyCandle bodyHeight={100} proximityRadius={220} />
          </div>
          <p
            className="mb-4 animate-fade-in-up text-sm font-bold uppercase tracking-[0.3em] text-primary relative inline-flex items-center gap-2"
            style={{ animationDelay: "0.05s" }}
          >
            9 Months of Us
            <HiddenSeal noteText="You are my favorite place in the entire world." align="right" className="ml-1 translate-y-[-2px]" />
          </p>
          <h1
            className="animate-fade-in-up text-5xl font-medium leading-[1.1] text-foreground md:text-7xl lg:text-8xl"
            style={{ animationDelay: "0.15s" }}
          >
            Happy 9-Month Anniversary,
            <br />
            <span className="italic text-primary">{HER_NAME}</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl animate-fade-in-up text-lg leading-relaxed text-muted-foreground md:text-xl"
            style={{ animationDelay: "0.25s" }}
          >
            One website can't hold all my love, but it's a start.
          </p>

          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              type="button"
              onClick={sendLove}
              className="inline-flex animate-fade-in-up items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 active:scale-95"
              style={{ animationDelay: "0.35s" }}
            >
              <Heart className="h-5 w-5 fill-current" />
              Send a heartbeat
            </button>
            <HiddenSeal noteText="Every single day, I choose you over and over." align="left" className="animate-fade-in-up" />
          </div>
        </div>

        {/* Floating hearts */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {hearts.map((h) => (
            <Heart
              key={h.id}
              className="absolute bottom-24 h-8 w-8 fill-current text-primary animate-float-up"
              style={{ left: h.left }}
            />
          ))}
        </div>
      </section>

      <RegencyDivider />

      {/* ── Royal Invitation (About Section) ── */}
      <RoyalInvitation />

      <RegencyDivider />

      {/* ── Stats ── */}
      <section id="stats" className="relative px-6 py-20 overflow-hidden">
        {/* Centered Botanical Sketch Backdrop (Under 5% opacity) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] text-gold overflow-hidden select-none">
          <svg className="w-80 h-80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M50,90 Q48,65 50,45 T55,15" />
            <path d="M49,70 Q60,65 58,73" />
            <path d="M50,70 Q40,67 42,75" />
            <path d="M50,52 Q63,47 60,57" />
            <path d="M50,52 Q37,47 40,57" />
            <path d="M55,15 C45,5 35,17 47,25 C55,30 65,25 60,15 Z" />
            <path d="M52,18 C48,13 42,18 48,23 C52,27 58,23 56,17 C54,13 52,16 52,18 Z" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          <StatCard label="Months together" value={stats?.months ?? "—"} />
          <div className="relative">
            <StatCard label="Days side by side" value={stats?.daysTogether ?? "—"} />
            <HiddenSeal noteText="Your smile is the brightest part of my day." align="center" className="absolute top-3 right-3 scale-95" />
          </div>
          <StatCard
            label="Until next monthiversary"
            value={
              stats
                ? stats.daysUntilNext === 0
                  ? "Today!"
                  : `${stats.daysUntilNext} days`
                : "—"
            }
            sub={stats?.nextDateLabel}
          />
        </div>
      </section>

      <RegencyDivider />

      {/* ── Antique Pocket Watch ── */}
      <section id="timepiece" className="relative px-6 py-20 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#f5ecd8]/30 to-[#FAF8F5]">
        {/* Decorative corner scrolls for pocket watch section */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] text-amber-900 select-none overflow-hidden">
          <svg className="absolute top-4 left-4 w-24 h-24" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10,10 Q35,15 35,40 Q25,30 10,30 Z" />
          </svg>
          <svg className="absolute top-4 right-4 w-24 h-24 rotate-90" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10,10 Q35,15 35,40 Q25,30 10,30 Z" />
          </svg>
          <svg className="absolute bottom-4 left-4 w-24 h-24 -rotate-90" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10,10 Q35,15 35,40 Q25,30 10,30 Z" />
          </svg>
          <svg className="absolute bottom-4 right-4 w-24 h-24 rotate-180" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10,10 Q35,15 35,40 Q25,30 10,30 Z" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-800">
            A Keepsake of Love
          </p>
          <h2 className="mt-3 text-3xl font-medium text-foreground md:text-5xl">
            Our Love, Beyond Time
          </h2>
          <div className="mt-2 w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>
          <p className="mt-4 max-w-md text-muted-foreground text-sm leading-relaxed">
            An antique gold timepiece that measures our shared memories rather than hours. Click the pocket watch to open it.
          </p>
          
          <div className="mt-12">
            <AntiquePocketWatch />
          </div>
        </div>
      </section>

      <RegencyDivider />

      {/* ── Love Letter ── */}
      <section id="letter" className="relative px-6 py-24 overflow-hidden">
        {/* Circular Scrollwork Vignette/Crest Backdrop (Under 6% opacity) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] text-gold overflow-hidden select-none">
          <svg className="w-[450px] h-[450px]" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.8">
            <circle cx="60" cy="60" r="45" strokeDasharray="3 3" />
            <circle cx="60" cy="60" r="48" />
            <path d="M60,8 L60,12 M60,108 L60,112 M8,60 L12,60 M108,60 L112,60" />
            <path d="M60,12 Q65,22 75,25 Q65,28 60,38 Q55,28 45,25 Q55,22 60,12 Z" />
            <path d="M60,108 Q65,98 75,95 Q65,92 60,82 Q55,92 45,95 Q55,98 60,108 Z" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-2xl relative">
          <InteractiveEnvelope 
            recipient={HER_NAME} 
            sender={YOUR_NAME} 
            content={loveLetter} 
          />
          <HiddenSeal noteText="I love the way your hand fits perfectly in mine." align="right" className="absolute -top-7 right-2 scale-95" />
        </div>
      </section>

      <RegencyDivider />

      {/* ── Timeline ── */}
      <section id="timeline" className="relative bg-secondary/40 px-6 py-24 overflow-hidden">
        {/* Botanical Ivy Vine side backgrounds (Under 4% opacity) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <svg className="absolute -left-10 top-20 w-48 h-96 text-gold opacity-[0.03]" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M10,10 Q25,50 15,100 T20,190" />
            <path d="M15,50 Q30,45 28,52 M15,50 C22,48 24,56 15,50 Z" />
            <path d="M18,100 Q33,95 31,102" />
            <path d="M16,150 Q31,145 29,152" />
          </svg>
          <svg className="absolute -right-10 bottom-20 w-48 h-96 text-gold opacity-[0.03] scale-x-[-1]" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M10,10 Q25,50 15,100 T20,190" />
            <path d="M15,50 Q30,45 28,52" />
            <path d="M18,100 Q33,95 31,102" />
            <path d="M16,150 Q31,145 29,152" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="text-center text-sm font-bold uppercase tracking-[0.25em] text-primary">
            Our Story
          </p>
          <h2 className="mt-3 text-center text-4xl font-medium text-foreground md:text-6xl">
            9 Months, 9 Moments
          </h2>

          <div className="relative mt-16">
            {/* Elegant Dotted Gold Vine Timeline Divider */}
            <div className="absolute bottom-0 left-8 top-0 w-px md:left-1/2 flex flex-col justify-between items-center pointer-events-none opacity-[0.08]" style={{ height: '100%' }}>
              <div className="w-[2px] h-full bg-repeat-y" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='20' viewBox='0 0 4 20'%3E%3Cline x1='2' y1='0' x2='2' y2='20' stroke='%23c5a880' stroke-width='1.5' stroke-dasharray='2 2'/%3E%3C/svg%3E")` }} />
            </div>

            {memories.map((memory, index) => {
              const Icon = memory.icon;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={memory.month}
                  className="relative mb-14 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="absolute left-8 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm md:left-1/2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div
                    className={`pl-24 md:w-1/2 md:pl-0 ${
                      isEven
                        ? "md:pr-16 md:text-right"
                        : "md:ml-auto md:pl-16"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-primary relative inline-flex items-center gap-1.5">
                      Month {memory.month}
                      {memory.month === 3 && (
                        <HiddenSeal noteText="You make the ordinary moments feel extraordinary." align={isEven ? "right" : "left"} className="scale-75 translate-y-[-1px]" />
                      )}
                      {memory.month === 7 && (
                        <HiddenSeal noteText="My heart is, and always will be, yours." align={isEven ? "right" : "left"} className="scale-75 translate-y-[-1px]" />
                      )}
                    </span>
                    <h3 className="mt-1 text-2xl font-medium text-foreground">
                      {memory.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">
                      {memory.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <RegencyDivider />

      {/* ── Gallery ── */}
      <section id="gallery" className="relative px-6 py-24 overflow-hidden">
        {/* Faint Botanical sketches in back (Under 4% opacity) */}
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none opacity-[0.03] text-gold overflow-hidden select-none">
          <svg className="w-64 h-64 -ml-16" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M10,90 Q30,80 50,50 T90,10" />
            <circle cx="50" cy="50" r="2" fill="currentColor" />
            <circle cx="90" cy="10" r="3" fill="currentColor" />
          </svg>
          <svg className="w-64 h-64 -mr-16 scale-x-[-1]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M10,90 Q30,80 50,50 T90,10" />
            <circle cx="50" cy="50" r="2" fill="currentColor" />
            <circle cx="90" cy="10" r="3" fill="currentColor" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <p className="text-center text-sm font-bold uppercase tracking-[0.25em] text-primary">
            Through My Eyes
          </p>
          <h2 className="mt-3 text-center text-4xl font-medium text-foreground md:text-6xl">
            Moments I Never Want to Forget
          </h2>
          <p className="mt-3 text-center text-sm text-muted-foreground tracking-wide">
            Click a book to open it
          </p>

          <div className="mt-16">
            <RoyalLibrary books={books} />
          </div>
        </div>
      </section>

      <RegencyDivider />

      {/* ── Cinematic Ending ── */}
      <CinematicEnding herName={HER_NAME} yourName={YOUR_NAME} />
    </main>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-md relative overflow-hidden">
      <p className="text-4xl font-medium text-foreground md:text-5xl z-10 relative">{value}</p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground z-10 relative">
        {label}
      </p>
      {sub && <p className="mt-1 text-xs text-muted-foreground/70 z-10 relative">{sub}</p>}
    </div>
  );
}
