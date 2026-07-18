import React, { useState, useEffect, useRef } from "react";

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
  const [activeBookId, setActiveBookId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Book cover open/closed
  const [currentSpread, setCurrentSpread] = useState(0); // 0, 1, 2
  const [isClosing, setIsClosing] = useState(false);
  const [reflection, setReflection] = useState({ x: 50, y: 50 });
  const [pageReflection, setPageReflection] = useState({ x: 50, y: 50 });
  const [isTurningPage, setIsTurningPage] = useState(false);
  const [turnDirection, setTurnDirection] = useState<"next" | "prev">("next");

  const modalRef = useRef<HTMLDivElement>(null);
  
  // Track mouse coordinates for cover sheen reflections
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setReflection({ x, y });
  };

  const handleMouseLeave = () => {
    setReflection({ x: 50, y: 50 });
  };

  // Track mouse coordinates for open pages reflection
  const handlePageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPageReflection({ x, y });
  };

  const handlePageMouseLeave = () => {
    setPageReflection({ x: 50, y: 50 });
  };

  const handleOpenBook = (bookId: number) => {
    if (isClosing) return;
    setActiveBookId(bookId);
    
    // Map clicked book to the appropriate spread index
    // Book 1 (id 1) -> Spread 0
    // Book 2 (id 2) -> Spread 1 (left side)
    // Book 3 (id 3) -> Spread 1 (right side)
    // Book 4 (id 4) -> Spread 2
    if (bookId === 1) setCurrentSpread(0);
    else if (bookId === 2 || bookId === 3) setCurrentSpread(1);
    else setCurrentSpread(2);

    // Smooth sequence: first open the modal, then swing open the cover
    setTimeout(() => {
      setIsOpen(true);
    }, 150);
  };

  const handleCloseBook = () => {
    setIsClosing(true);
    setIsOpen(false); // Swing closed the cover first
    setTimeout(() => {
      setActiveBookId(null);
      setIsClosing(false);
    }, 700); // Wait for cover swing closed and fade out
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTurningPage || currentSpread >= 2) return;
    setIsTurningPage(true);
    setTurnDirection("next");
    setTimeout(() => {
      setCurrentSpread((prev) => prev + 1);
      setIsTurningPage(false);
    }, 500); // Midway through the 1.0s transition
  };

  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTurningPage || currentSpread <= 0) return;
    setIsTurningPage(true);
    setTurnDirection("prev");
    setTimeout(() => {
      setCurrentSpread((prev) => prev - 1);
      setIsTurningPage(false);
    }, 500); // Midway through the 1.0s transition
  };

  // Find active book metadata
  const activeBook = books.find((b) => b.id === activeBookId) || books[0];

  return (
    <div className="relative w-full">
      {/* ── Royal Library Shelf ── */}
      <div className="relative flex items-end justify-center gap-3 sm:gap-5 px-4 pt-12 pb-0 flex-wrap">
        {books.map((book) => (
          <div
            key={book.id}
            className="group relative flex flex-col items-center cursor-pointer select-none"
            onClick={() => handleOpenBook(book.id)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            title={`Read: ${book.title}`}
          >
            {/* Book Spine */}
            <div
              className="relative flex flex-col items-center justify-between rounded-t-sm rounded-b-none"
              style={{
                width: "52px",
                height: "240px",
                background: `linear-gradient(105deg, ${book.spineColor}cc 0%, ${book.spineColor} 40%, ${book.spineColor}dd 70%, ${book.spineColor}99 100%)`,
                boxShadow: "2px 0 8px rgba(0,0,0,0.22), -1px 0 4px rgba(0,0,0,0.12), inset 3px 0 6px rgba(255,255,255,0.06)",
                transform: "translateX(0)",
                transition: "transform var(--duration-fast) var(--ease-regency), box-shadow var(--duration-fast) var(--ease-regency)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(-6px) translateY(-6px)";
                e.currentTarget.style.boxShadow = "6px 6px 20px rgba(0,0,0,0.4), -1px 0 4px rgba(0,0,0,0.15), inset 3px 0 8px rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0) translateY(0)";
                e.currentTarget.style.boxShadow = "2px 0 8px rgba(0,0,0,0.22), -1px 0 4px rgba(0,0,0,0.12), inset 3px 0 6px rgba(255,255,255,0.06)";
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

              {/* Vertical Title */}
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

              {/* Hover metallic reflection overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-t-sm"
                style={{
                  background: `linear-gradient(${135 + (reflection.x + reflection.y) / 2}deg, transparent 20%, ${book.goldTone}22 50%, transparent 80%)`,
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
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(0,0,0,0.3) 60px, rgba(0,0,0,0.3) 62px)",
        }} />
      </div>

      {/* Shelf Drop Shadow */}
      <div
        className="w-full h-3"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 100%)" }}
      />

      {/* ── 3D Hardcover Book Modal Overlay ── */}
      {activeBookId !== null && (
        <div
          ref={modalRef}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 transition-opacity duration-[600ms] ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          style={{ 
            background: "rgba(22,14,10,0.85)", 
            backdropFilter: "blur(6px)",
            transitionTimingFunction: "var(--ease-regency)"
          }}
          onClick={handleCloseBook}
        >
          {/* 3D Journal Box */}
          <div
            className={`relative max-w-4xl w-full flex flex-col items-center justify-center transition-all duration-[800ms] ${
              isClosing ? "scale-95 opacity-0 translate-y-12" : "scale-100 opacity-100 translate-y-0"
            }`}
            style={{ 
              perspective: "1500px",
              transitionTimingFunction: "var(--ease-regency-slow)"
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handlePageMouseMove}
            onMouseLeave={handlePageMouseLeave}
          >
            {/* The 3D Book Object */}
            <div 
              className="relative flex w-full max-w-[800px] aspect-[16/10] transform-style-3d shadow-[0_25px_65px_rgba(0,0,0,0.7)]"
              style={{
                height: "auto",
                minHeight: "440px"
              }}
            >
              
              {/* LEFT PAGE SPREAD */}
              <div 
                className="flex-1 flex flex-col justify-center p-8 sm:p-10 relative rounded-l-sm border-r border-[#3a2b27]/10"
                style={{
                  background: `linear-gradient(135deg, ${activeBook.pageColor} 0%, #f7f0e2 80%, #ebe0cd 100%)`,
                  boxShadow: "inset -12px 0 24px rgba(0,0,0,0.06)",
                }}
              >
                {/* Subtle paper rules */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(180deg, transparent, transparent 28px, #3a2b27 28px, #3a2b27 29px)",
                    backgroundPositionY: "45px",
                  }}
                />

                {/* SPREAD CONTENT LEFT */}
                {currentSpread === 0 ? (
                  // Spread 0 Left: Dedication Title
                  <div className="text-center flex flex-col items-center justify-center h-full">
                    <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#b68a35] font-semibold">
                      Chronicle of Love
                    </span>
                    <div className="my-6 text-gold opacity-60">
                      <svg width="60" height="60" viewBox="0 0 80 80" fill="none">
                        <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3"/>
                        <path d="M40,18 C45,28 55,28 40,35 C25,28 35,28 40,18 Z" fill="currentColor"/>
                        <path d="M40,62 C45,52 55,52 40,45 C25,52 35,52 40,62 Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="font-serif text-2xl text-foreground font-medium uppercase tracking-wider">
                      Volume I - IV
                    </h3>
                    <p className="font-handwritten text-xl text-[#7a2e38] mt-3 max-w-xs leading-relaxed">
                      "A digital record of our most cherished, golden moments."
                    </p>
                    <span className="font-serif text-[10px] tracking-widest text-[#b68a35] opacity-50 uppercase mt-4">
                      Est. 18.10.2025
                    </span>
                  </div>
                ) : currentSpread === 1 ? (
                  // Spread 1 Left: Volume II (First Video Call)
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#b68a35] mb-2 font-bold">
                      {books[1].subtitle}
                    </span>
                    <div className="relative p-2 bg-white shadow-md border border-gold/5 max-w-[210px] mb-3">
                      <img src={books[1].src} alt={books[1].title} className="w-full object-cover max-h-[140px] object-top" />
                    </div>
                    <p className="font-handwritten text-lg text-amber-950 px-2 leading-relaxed">
                      {books[1].caption}
                    </p>
                  </div>
                ) : (
                  // Spread 2 Left: Volume IV (Imagica Trip)
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#b68a35] mb-2 font-bold">
                      {books[3].subtitle}
                    </span>
                    <div className="relative p-2 bg-white shadow-md border border-gold/5 max-w-[210px] mb-3">
                      <img src={books[3].src} alt={books[3].title} className="w-full object-cover max-h-[140px] object-top" />
                    </div>
                    <p className="font-handwritten text-lg text-amber-950 px-2 leading-relaxed">
                      {books[3].caption}
                    </p>
                  </div>
                )}

                {/* Page turn shadow inner gutter */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.18))" }}
                />
              </div>

              {/* BOOK SPINE GUTTER */}
              <div
                className="w-6 flex-shrink-0 relative z-10"
                style={{
                  background: `linear-gradient(90deg, ${activeBook.spineColor}dd 0%, ${activeBook.spineColor} 50%, ${activeBook.spineColor}dd 100%)`,
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.6), 2px 0 5px rgba(0,0,0,0.3), -2px 0 5px rgba(0,0,0,0.3)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-50"
                  style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)" }}
                />
              </div>

              {/* RIGHT PAGE SPREAD */}
              <div 
                className="flex-1 flex flex-col justify-center p-8 sm:p-10 relative rounded-r-sm border-l border-[#3a2b27]/10"
                style={{
                  background: `linear-gradient(135deg, ${activeBook.pageColor} 0%, #f7f0e2 80%, #ebe0cd 100%)`,
                  boxShadow: "inset 12px 0 24px rgba(0,0,0,0.06)",
                }}
              >
                {/* Subtle paper rules */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(180deg, transparent, transparent 28px, #3a2b27 28px, #3a2b27 29px)",
                    backgroundPositionY: "45px",
                  }}
                />

                {/* SPREAD CONTENT RIGHT */}
                {currentSpread === 0 ? (
                  // Spread 0 Right: Volume I (Our Proposal)
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#b68a35] mb-2 font-bold">
                      {books[0].subtitle}
                    </span>
                    <div className="relative p-2 bg-white shadow-md border border-gold/5 max-w-[210px] mb-3">
                      <img src={books[0].src} alt={books[0].title} className="w-full object-cover max-h-[140px] object-top" />
                    </div>
                    <p className="font-handwritten text-lg text-amber-950 px-2 leading-relaxed">
                      {books[0].caption}
                    </p>
                  </div>
                ) : currentSpread === 1 ? (
                  // Spread 1 Right: Volume III (Cheesecake Date)
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#b68a35] mb-2 font-bold">
                      {books[2].subtitle}
                    </span>
                    <div className="relative p-2 bg-white shadow-md border border-gold/5 max-w-[210px] mb-3">
                      <img src={books[2].src} alt={books[2].title} className="w-full object-cover max-h-[140px] object-top" />
                    </div>
                    <p className="font-handwritten text-lg text-amber-950 px-2 leading-relaxed">
                      {books[2].caption}
                    </p>
                  </div>
                ) : (
                  // Spread 2 Right: Closing Crest
                  <div className="text-center flex flex-col items-center justify-center h-full">
                    <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#b68a35] font-semibold">
                      To Be Continued
                    </span>
                    <div className="my-6 text-gold opacity-60">
                      <svg width="60" height="60" viewBox="0 0 80 80" fill="none">
                        <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3"/>
                        <path d="M40,35 Q50,45 40,62 Q30,45 40,35 Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="font-serif text-2xl text-foreground font-medium uppercase tracking-wider">
                      Our Story
                    </h3>
                    <p className="font-handwritten text-xl text-[#7a2e38] mt-3 max-w-xs leading-relaxed">
                      "Each day with you is a page I look forward to turning."
                    </p>
                    <span className="font-serif text-[10px] tracking-widest text-[#b68a35] opacity-50 uppercase mt-4">
                      Forever Devoted
                    </span>
                  </div>
                )}

                {/* Page turn shadow inner gutter */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none"
                  style={{ background: "linear-gradient(270deg, transparent, rgba(0,0,0,0.18))" }}
                />
              </div>

              {/* 3D HARDCOVER FRONT COVER (Swings open to the left on hinge) */}
              <div 
                className="absolute inset-y-0 right-0 w-1/2 select-none transform-style-3d origin-left shadow-2xl flex items-center justify-center rounded-r-sm z-30"
                style={{
                  transform: isOpen ? "rotateY(-180deg) translateZ(1px)" : "rotateY(0deg)",
                  transition: "transform var(--duration-slow) var(--ease-regency-slow), z-index var(--duration-slow) step-end",
                  backgroundColor: "#160e0a",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  zIndex: isOpen ? 0 : 30
                }}
                onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
              >
                {/* Closed Book Cover Front Face */}
                <div 
                  className="absolute inset-0 rounded-r-sm border-l-[3px] border-amber-950 flex flex-col items-center justify-center p-8 backface-hidden shadow-inner"
                  style={{
                    background: `linear-gradient(135deg, ${activeBook.coverColor} 0%, ${activeBook.coverColor}ee 50%, ${activeBook.coverColor}dd 100%)`,
                    border: `5px solid ${activeBook.spineColor}33`,
                    borderLeft: `8px solid ${activeBook.spineColor}cc`
                  }}
                >
                  {/* Embossed gold border */}
                  <div className="absolute inset-3 border-[2px] border-dashed opacity-40 rounded-sm" style={{ borderColor: activeBook.goldTone }} />
                  <div className="absolute inset-5 border opacity-50 rounded-sm" style={{ borderColor: activeBook.goldTone }} />

                  {/* Gold corner brackets */}
                  <div className="absolute top-6 left-6 w-8 h-8 border-t-[2px] border-l-[2px] opacity-75" style={{ borderColor: activeBook.goldTone }} />
                  <div className="absolute top-6 right-6 w-8 h-8 border-t-[2px] border-r-[2px] opacity-75" style={{ borderColor: activeBook.goldTone }} />
                  <div className="absolute bottom-6 left-6 w-8 h-8 border-b-[2px] border-l-[2px] opacity-75" style={{ borderColor: activeBook.goldTone }} />
                  <div className="absolute bottom-6 right-6 w-8 h-8 border-b-[2px] border-r-[2px] opacity-75" style={{ borderColor: activeBook.goldTone }} />

                  <span className="font-serif text-[11px] uppercase tracking-[0.3em] font-semibold mb-2 block" style={{ color: activeBook.goldTone }}>
                    {activeBook.subtitle}
                  </span>
                  
                  {/* Decorative crest */}
                  <div className="my-6 opacity-80" style={{ color: activeBook.goldTone }}>
                    <svg width="64" height="64" viewBox="0 0 40 40" fill="none">
                      <path d={activeBook.floral} stroke="currentColor" strokeWidth="1.0" fill="none" />
                      <circle cx="20" cy="20" r="4" fill="currentColor" fillOpacity="0.5" />
                    </svg>
                  </div>

                  <h3 className="font-serif text-3xl font-bold uppercase tracking-wider text-center px-4 leading-normal select-none" style={{ color: activeBook.goldTone, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                    {activeBook.title}
                  </h3>

                  <div className="mt-8 w-12 h-px opacity-30" style={{ background: activeBook.goldTone }} />
                  <span className="font-handwritten text-2xl mt-4 opacity-75" style={{ color: activeBook.goldTone }}>
                    Lady Arya
                  </span>

                  {/* Metallic Shimmer Gloss Overlay */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none rounded-r-sm mix-blend-overlay transition-all duration-300"
                    style={{
                      background: `linear-gradient(${135 + (reflection.x + reflection.y) / 2}deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.6) 100%)`
                    }}
                  />
                </div>

                {/* Inner Cover Face (Endpaper backing revealed when swung open, rotated 180deg) */}
                <div 
                  className="absolute inset-0 rounded-l-sm [transform:rotateY(180deg)] backface-hidden flex items-center justify-center overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${activeBook.coverColor}ef 0%, ${activeBook.coverColor}cc 100%)`,
                    borderRight: `4px solid ${activeBook.goldTone}44`,
                    boxShadow: "inset -8px 0 24px rgba(0,0,0,0.3)",
                    WebkitBackfaceVisibility: "hidden"
                  }}
                >
                  <div className="absolute inset-0 opacity-[0.08]" style={{ color: activeBook.goldTone }}>
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                      <pattern id="inside-paper" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                        <path d="M10,2 Q15,10 10,18 Q5,10 10,2 Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                      </pattern>
                      <rect width="100" height="100" fill="url(#inside-paper)"/>
                    </svg>
                  </div>
                  <div className="relative text-center flex flex-col items-center justify-center p-6" style={{ color: activeBook.goldTone }}>
                    <span className="font-handwritten text-3xl">Om & Arya</span>
                    <span className="font-serif text-[9px] tracking-widest uppercase mt-2 opacity-50">Volume Kept Safely</span>
                  </div>
                </div>

              </div>

              {/* 3D TURNING PAGE SHEET (Visible during active page turns) */}
              <div 
                className={`absolute inset-y-0 right-0 w-1/2 transform-style-3d origin-left pointer-events-none z-20 ${
                  isTurningPage ? "" : "hidden"
                }`}
                style={{
                  transform: turnDirection === "next" 
                    ? "rotateY(-180deg)" 
                    : "rotateY(0deg)",
                  transition: "transform 1.0s var(--ease-regency-slow)",
                  transformOrigin: "left center"
                }}
              >
                {/* Front side of flipping sheet (Leaving page) */}
                <div 
                  className="absolute inset-0 bg-[#f7f0e2] border-l border-[#3a2b27]/10 flex flex-col justify-center p-8 text-center backface-hidden shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${activeBook.pageColor} 0%, #f7f0e2 80%, #ebe0cd 100%)`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden"
                  }}
                >
                  {/* Mirror reflection glare on page */}
                  <div className="absolute inset-0 opacity-[0.03] bg-gradient-to-tr from-white via-transparent to-black"></div>
                  <div className="w-12 h-12 rounded-full border border-gold/10 mx-auto opacity-35"></div>
                </div>

                {/* Back side of flipping sheet (Entering page) */}
                <div 
                  className="absolute inset-0 bg-[#fdfaf2] border-r border-[#3a2b27]/10 flex flex-col justify-center p-8 text-center [transform:rotateY(180deg)] backface-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${activeBook.pageColor} 0%, #fdfaf2 80%, #eae0cd 100%)`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden"
                  }}
                >
                  {/* Mirror reflection glare on page */}
                  <div className="absolute inset-0 opacity-[0.03] bg-gradient-to-tl from-white via-transparent to-black"></div>
                  <div className="w-12 h-12 rounded-full border border-gold/10 mx-auto opacity-35"></div>
                </div>
              </div>

            </div>

            {/* Interactive Turn Tabs flanking bottom edges */}
            {isOpen && (
              <div className="absolute bottom-[-54px] w-full flex items-center justify-between px-12 z-40">
                {/* Left Turn Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentSpread === 0 || isTurningPage}
                  className={`px-4 py-2 text-xs uppercase tracking-widest text-[#d6b97a] disabled:opacity-20 hover:text-white cursor-pointer font-semibold transition-all duration-300 ${
                    currentSpread === 0 ? "pointer-events-none" : ""
                  }`}
                  style={{ transitionTimingFunction: "var(--ease-regency)" }}
                >
                  [⟵ Previous Volume]
                </button>

                {/* Cover closing / Return */}
                <button
                  onClick={handleCloseBook}
                  className="px-6 py-2 text-xs uppercase tracking-[0.2em] text-[#d6b97a] hover:text-white border border-[#d6b97a]/30 hover:border-white rounded-full bg-[#160e0a]/50 cursor-pointer font-semibold transition-all duration-300"
                  style={{ transitionTimingFunction: "var(--ease-regency)" }}
                >
                  Close Shelf
                </button>

                {/* Right Turn Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentSpread === 2 || isTurningPage}
                  className={`px-4 py-2 text-xs uppercase tracking-widest text-[#d6b97a] disabled:opacity-20 hover:text-white cursor-pointer font-semibold transition-all duration-300 ${
                    currentSpread === 2 ? "pointer-events-none" : ""
                  }`}
                  style={{ transitionTimingFunction: "var(--ease-regency)" }}
                >
                  [Next Volume ⟶]
                </button>
              </div>
            )}

            {/* Book base shadow under sheet */}
            <div
              className="absolute -bottom-8 left-12 right-12 h-8 rounded-full pointer-events-none z-[-1]"
              style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 75%)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
