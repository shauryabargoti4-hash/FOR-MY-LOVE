import React, { useEffect, useState } from "react";

interface NavLinkItem {
  label: string;
  targetId: string;
}

export default function HeaderNav() {
  const [showNav, setShowNav] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      // Show navigation bar only after scrolling past the full-screen intro animation (around 2 viewports)
      if (window.scrollY > window.innerHeight * 2.2) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMounted]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isMounted) return null;

  const links: NavLinkItem[] = [
    { label: "Us", targetId: "hero" },
    { label: "Invite", targetId: "invitation" },
    { label: "Stats", targetId: "stats" },
    { label: "Timepiece", targetId: "timepiece" },
    { label: "Letter", targetId: "letter" },
    { label: "Story", targetId: "timeline" },
    { label: "Gallery", targetId: "gallery" }
  ];

  return (
    <nav 
      className={`fixed left-1/2 -translate-x-1/2 z-40 rounded-full py-2 px-4 sm:py-2.5 sm:px-6 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-[#c5a880]/15 bg-background/70 backdrop-blur-md flex items-center gap-4 sm:gap-7 transition-all duration-500 ease-out select-none pointer-events-auto ${
        showNav 
          ? "top-4 opacity-100 translate-y-0" 
          : "top-0 opacity-0 -translate-y-8 pointer-events-none"
      }`}
    >
      {links.map((link) => (
        <div key={link.targetId} className="relative group/link py-1 flex flex-col items-center">
          
          {/* Tiny Floral Leaf Ornament (fades & scales in on hover directly above link text) */}
          <svg 
            className="absolute top-[-7px] left-1/2 -translate-x-1/2 w-3 h-3 text-gold opacity-0 scale-50 transition-all duration-300 group-hover/link:opacity-90 group-hover/link:scale-100 pointer-events-none"
            viewBox="0 0 24 24" 
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hand-drawn aesthetic leaf pairs */}
            <path d="M12,2 C12,2 17,7 17,12 C17,14.8 14.8,17 12,17 C9.2,17 7,14.8 7,12 C7,7 12,2 12,2 Z" fillOpacity="0.4" />
            <path d="M12,2 C12,2 7,7 7,12 C7,14.8 9.2,17 12,17 C14.8,17 17,14.8 17,12 C17,7 12,2 12,2 Z" />
          </svg>

          {/* Nav Link text (lifts and turns champagne gold on hover) */}
          <button
            onClick={() => scrollToSection(link.targetId)}
            className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.25em] text-muted-foreground group-hover/link:text-[#c5a880] transition-all duration-300 font-semibold relative nav-underline hover:-translate-y-[1.5px] cursor-pointer"
          >
            {link.label}
          </button>
        </div>
      ))}
    </nav>
  );
}
