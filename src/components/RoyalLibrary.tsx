import React, { useState } from "react";

interface BookData {
  id: number;
  title: string;
  subtitle: string;
  spineColor: string;
  coverColor: string;
  pageColor: string;
  goldTone: string;
  src: string;
  caption: string;
  floral: string; // SVG path data for decorative motif
}

interface Props {
  books: BookData[];
}

export default function RoyalLibrary({ books }: Props) {
  const [openBook, setOpenBook] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleOpen = (id: number) => {
    if (isClosing) return;
    setOpenBook(id);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenBook(null);
      setIsClosing(false);
    }, 600);
  };

  const activeBook = books.find((b) => b.id === openBook) ?? null;

  return (
    <div className="relative w-full">
      {/* ── Royal Library Shelf ── */}
      <div className="relative flex items-end justify-center gap-3 sm:gap-5 px-4 pt-12 pb-0 flex-wrap">

        {books.map((book) => (
          <div
            key={book.id}
            className="group relative flex flex-col items-center cursor-pointer select-none"
            onClick={() => handleOpen(book.id)}
            title={`Open: ${book.title}`}
          >
            {/* Book Spine */}
            <div
              className="relative flex flex-col items-center justify-between transition-all duration-500 ease-out rounded-t-sm rounded-b-none"
              style={{
                width: "52px",
                height: "240px",
                background: `linear-gradient(105deg, ${book.spineColor}cc 0%, ${book.spineColor} 40%, ${book.spineColor}dd 70%, ${book.spineColor}99 100%)`,
                boxShadow: "2px 0 8px rgba(0,0,0,0.22), -1px 0 4px rgba(0,0,0,0.12), inset 3px 0 6px rgba(255,255,255,0.06)",
                transform: "translateX(0)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateX(-6px) translateY(-6px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "6px 6px 20px rgba(0,0,0,0.4), -1px 0 4px rgba(0,0,0,0.15), inset 3px 0 8px rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateX(0) translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "2px 0 8px rgba(0,0,0,0.22), -1px 0 4px rgba(0,0,0,0.12), inset 3px 0 6px rgba(255,255,255,0.06)";
              }}
            >
              {/* Gold top edge strip */}
              <div
                className="w-full h-2 rounded-t-sm"
                style={{ background: `linear-gradient(90deg, ${book.goldTone}88, ${book.goldTone}, ${book.goldTone}88)` }}
              />

              {/* Decorative floral motif top */}
              <div className="w-full flex justify-center opacity-70" style={{ color: book.goldTone }}>
                <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="4" fill="currentColor" fillOpacity="0.5" />
                  <path d={book.floral} stroke="currentColor" strokeWidth="0.8" fill="none" />
                  <circle cx="20" cy="8" r="2" fill="currentColor" fillOpacity="0.4" />
                  <circle cx="20" cy="32" r="2" fill="currentColor" fillOpacity="0.4" />
                  <circle cx="8" cy="20" r="2" fill="currentColor" fillOpacity="0.4" />
                  <circle cx="32" cy="20" r="2" fill="currentColor" fillOpacity="0.4" />
                </svg>
              </div>

              {/* Gold thin rule */}
              <div className="w-[38px] h-px opacity-50" style={{ background: book.goldTone }} />

              {/* Vertical Title (writing-mode trick via rotate) */}
              <div
                className="flex-1 flex items-center justify-center overflow-hidden px-1"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                <span
                  className="font-serif text-[11px] font-semibold tracking-[0.18em] uppercase text-center leading-tight select-none"
                  style={{
                    color: book.goldTone,
                    textShadow: `0 0 8px ${book.goldTone}66, 0 1px 2px rgba(0,0,0,0.4)`,
                    transform: "rotate(180deg)",
                  }}
                >
                  {book.title}
                </span>
              </div>

              {/* Gold thin rule */}
              <div className="w-[38px] h-px opacity-50" style={{ background: book.goldTone }} />

              {/* Decorative floral motif bottom */}
              <div className="w-full flex justify-center opacity-70" style={{ color: book.goldTone }}>
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                  <path d="M20,10 Q28,20 20,30 Q12,20 20,10 Z" stroke="currentColor" strokeWidth="0.8" fill="none" />
                  <circle cx="20" cy="20" r="3" fill="currentColor" fillOpacity="0.4" />
                </svg>
              </div>

              {/* Gold bottom edge strip */}
              <div
                className="w-full h-2 rounded-b-none"
                style={{ background: `linear-gradient(90deg, ${book.goldTone}88, ${book.goldTone}, ${book.goldTone}88)` }}
              />

              {/* Hover shimmer overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-t-sm"
                style={{
                  background: `linear-gradient(120deg, transparent 30%, ${book.goldTone}22 50%, transparent 70%)`,
                }}
              />
            </div>

            {/* Book subtitle below spine */}
            <p
              className="mt-2 text-center text-[9px] uppercase tracking-widest opacity-50 font-sans max-w-[56px] leading-tight"
              style={{ color: book.spineColor }}
            >
              {book.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Wooden Shelf Plank */}
      <div
        className="relative w-full h-5 mt-0 z-10 rounded-sm"
        style={{
          background: "linear-gradient(180deg, #5c3a1e 0%, #7a4f2b 40%, #4a2e14 100%)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.05)",
        }}
      >
        {/* Wood grain lines */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(0,0,0,0.3) 60px, rgba(0,0,0,0.3) 62px)",
        }} />
      </div>

      {/* Shelf Drop Shadow */}
      <div
        className="w-full h-3"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 100%)" }}
      />

      {/* ── Open Book Modal Overlay ── */}
      {activeBook && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 transition-all duration-500 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          style={{ background: "rgba(30,18,12,0.78)", backdropFilter: "blur(4px)" }}
          onClick={handleClose}
        >
          {/* Open Book Container */}
          <div
            className={`relative max-w-4xl w-full transition-all duration-500 ${
              isClosing ? "scale-90 opacity-0" : "scale-100 opacity-100"
            }`}
            style={{ perspective: "1200px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex w-full shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              style={{ minHeight: "460px", maxHeight: "80vh" }}
            >
              {/* Left Page — Back Cover / Decorative Endpaper */}
              <div
                className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden rounded-l-sm"
                style={{
                  background: `linear-gradient(135deg, ${activeBook.coverColor}f0 0%, ${activeBook.coverColor}cc 100%)`,
                  borderRight: `3px solid ${activeBook.goldTone}33`,
                  boxShadow: "inset -8px 0 24px rgba(0,0,0,0.25)",
                }}
              >
                {/* Decorative endpaper pattern */}
                <div className="absolute inset-0 opacity-10" style={{ color: activeBook.goldTone }}>
                  <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
                    <defs>
                      <pattern id="endpaper" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M20,5 C25,15 35,15 20,20 C5,15 15,15 20,5 Z" fill="currentColor" fillOpacity="0.6"/>
                        <circle cx="20" cy="20" r="2" fill="currentColor"/>
                        <path d="M5,20 C15,25 15,35 20,20 C15,5 15,15 5,20 Z" fill="currentColor" fillOpacity="0.6"/>
                        <path d="M35,20 C25,25 25,35 20,20 C25,5 25,15 35,20 Z" fill="currentColor" fillOpacity="0.6"/>
                      </pattern>
                    </defs>
                    <rect width="200" height="200" fill="url(#endpaper)"/>
                  </svg>
                </div>

                {/* Book crest */}
                <div className="relative z-10 text-center">
                  <div style={{ color: activeBook.goldTone }}>
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                      <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3"/>
                      <circle cx="40" cy="40" r="24" stroke="currentColor" strokeWidth="0.5"/>
                      <path d="M40,18 C45,28 55,28 40,35 C25,28 35,28 40,18 Z" fill="currentColor" fillOpacity="0.5"/>
                      <path d="M40,62 C45,52 55,52 40,45 C25,52 35,52 40,62 Z" fill="currentColor" fillOpacity="0.5"/>
                      <path d="M18,40 C28,45 28,55 35,40 C28,25 28,35 18,40 Z" fill="currentColor" fillOpacity="0.5"/>
                      <path d="M62,40 C52,45 52,55 45,40 C52,25 52,35 62,40 Z" fill="currentColor" fillOpacity="0.5"/>
                      <circle cx="40" cy="40" r="5" fill="currentColor" fillOpacity="0.4"/>
                    </svg>
                  </div>
                  <p className="font-serif text-xs tracking-[0.2em] uppercase mt-4 opacity-70" style={{ color: activeBook.goldTone }}>
                    A Royal Memory
                  </p>
                  <p className="font-handwritten text-2xl mt-2 opacity-90" style={{ color: activeBook.goldTone }}>
                    Om & Arya
                  </p>
                  <p className="font-serif text-[10px] tracking-widest uppercase mt-3 opacity-50" style={{ color: activeBook.goldTone }}>
                    Est. 18.10.2025
                  </p>
                </div>

                {/* Page curl shadow on right edge */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.2))" }}
                />
              </div>

              {/* Book Spine (center gutter) */}
              <div
                className="w-5 flex-shrink-0 relative"
                style={{
                  background: `linear-gradient(90deg, ${activeBook.spineColor}88 0%, ${activeBook.spineColor} 50%, ${activeBook.spineColor}88 100%)`,
                  boxShadow: "inset 0 0 12px rgba(0,0,0,0.4)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-40"
                  style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)" }}
                />
              </div>

              {/* Right Page — Memory Content */}
              <div
                className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-hidden rounded-r-sm"
                style={{
                  background: `linear-gradient(160deg, ${activeBook.pageColor} 0%, #fdf8ef 60%, #f9f3e8 100%)`,
                  boxShadow: "inset 6px 0 20px rgba(0,0,0,0.06)",
                }}
              >
                {/* Subtle ruled lines */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.04]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(180deg, transparent, transparent 28px, #3a2b27 28px, #3a2b27 29px)",
                    backgroundPositionY: "40px",
                  }}
                />

                {/* Page number */}
                <div className="absolute top-4 right-6 font-serif text-[10px] text-muted-foreground/40 tracking-widest uppercase">
                  ii
                </div>

                {/* Memory Photo */}
                <div className="relative z-10 w-full max-w-sm">
                  <div
                    className="relative p-2 sm:p-3 mb-4 mx-auto"
                    style={{
                      background: "#fff",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.08)",
                      maxWidth: "320px",
                    }}
                  >
                    {/* Gold corner brackets */}
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 border-t border-l border-[#b68a35]/50" />
                    <div className="absolute top-0.5 right-0.5 w-4 h-4 border-t border-r border-[#b68a35]/50" />
                    <div className="absolute bottom-0.5 left-0.5 w-4 h-4 border-b border-l border-[#b68a35]/50" />
                    <div className="absolute bottom-0.5 right-0.5 w-4 h-4 border-b border-r border-[#b68a35]/50" />

                    <img
                      src={activeBook.src}
                      alt={activeBook.title}
                      className="w-full object-cover"
                      style={{ maxHeight: "220px", objectPosition: "center top" }}
                    />
                  </div>

                  {/* Handwritten caption */}
                  <p
                    className="font-handwritten text-xl sm:text-2xl text-center leading-relaxed whitespace-pre-line px-2 py-1"
                    style={{ color: activeBook.spineColor }}
                  >
                    {activeBook.caption}
                  </p>
                </div>

                {/* Page edge curl hint */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-6 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.04), transparent)" }}
                />
              </div>
            </div>

            {/* Close book button */}
            <button
              onClick={handleClose}
              className="absolute -top-10 right-0 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#d6b97a] hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Close Book [×]
            </button>

            {/* Book open shadow underneath */}
            <div
              className="absolute -bottom-6 left-8 right-8 h-6 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
