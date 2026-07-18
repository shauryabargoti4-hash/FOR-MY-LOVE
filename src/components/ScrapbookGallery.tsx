import React, { useEffect, useState } from "react";
import HiddenSeal from "@/components/HiddenSeal";

interface PhotoItem {
  src: string;
  caption: string;
}

interface ScrapbookGalleryProps {
  photos: PhotoItem[];
}

export default function ScrapbookGallery({ photos }: ScrapbookGalleryProps) {
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // SSR Fallback: render basic outline
    return <div className="w-full h-80 bg-background" />;
  }

  // Pre-configured custom scrapbook arrangement parameters
  const scrapbookConfigs = [
    {
      containerClass: "rotate-[-3deg] md:-translate-y-4 hover:rotate-[-1deg] hover:-translate-y-6",
      tapeStyle: { 
        top: "-12px", 
        left: "15%", 
        transform: "rotate(-14deg)", 
        width: "90px" 
      },
      hasFlower: true,
      flowerRotation: "rotate-[15deg]",
      flowerOffset: "-bottom-6 -right-6"
    },
    {
      containerClass: "rotate-[2.5deg] md:translate-y-6 hover:rotate-[0.5deg] hover:translate-y-4",
      tapeStyle: { 
        top: "-10px", 
        right: "20%", 
        transform: "rotate(10deg)", 
        width: "100px" 
      },
      hasFlower: false,
      flowerRotation: "rotate-[-45deg]",
      flowerOffset: "-top-8 -left-8"
    },
    {
      containerClass: "rotate-[-1.5deg] md:-translate-y-2 hover:rotate-[0.5deg] hover:-translate-y-4",
      tapeStyle: { 
        top: "-14px", 
        left: "30%", 
        transform: "rotate(-8deg)", 
        width: "95px" 
      },
      hasFlower: false,
      flowerRotation: "rotate-[75deg]",
      flowerOffset: "-bottom-6 -left-6"
    },
    {
      containerClass: "rotate-[3.5deg] md:translate-y-8 hover:rotate-[1.5deg] hover:translate-y-6",
      tapeStyle: { 
        top: "-12px", 
        right: "15%", 
        transform: "rotate(12deg)", 
        width: "90px" 
      },
      hasFlower: true,
      flowerRotation: "rotate-[-20deg]",
      flowerOffset: "-top-6 -right-6"
    }
  ];

  return (
    <div className="relative w-full">
      {/* 1. Scrapbook Card Grid (Asymmetrical Layout) */}
      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 items-start px-2">
        {photos.map((photo, index) => {
          const config = scrapbookConfigs[index % scrapbookConfigs.length];

          return (
            <div
              key={index}
              className={`group relative overflow-visible rounded-sm border border-gold/15 bg-[#fbf9f4] p-3 shadow-md transition-all duration-500 ease-out cursor-pointer hover:shadow-xl ${config.containerClass}`}
              onClick={() => setActivePhoto(photo)}
              style={{ animationDelay: `${0.15 * index}s` }}
            >
              {/* Backing paper border (vintage paper sheet offset look) */}
              <div 
                className="absolute inset-0 border border-dashed border-[#c5a880]/25 -translate-x-[4px] translate-y-[4px] rounded-sm pointer-events-none z-0" 
              />

              {/* Botanical Washi Tape strip */}
              <div 
                className="absolute h-6 bg-[#eae0cf]/40 border-l border-r border-[#c5a880]/20 border-dashed backdrop-blur-[0.5px] shadow-[0_1px_3px_rgba(0,0,0,0.03)] z-20 pointer-events-none select-none"
                style={config.tapeStyle}
              />

              {/* Photo Frame Container */}
              <div className="relative z-10 border border-[#c5a880]/30 p-2 bg-white shadow-inner overflow-hidden aspect-[4/3]">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              {/* Handwritten Caption */}
              <div className="relative z-10 p-4 pb-1 text-center">
                <p className="font-handwritten text-2xl text-muted-foreground leading-relaxed whitespace-pre-line py-2 px-3">
                  {photo.caption}
                </p>
              </div>

              {/* Dried Wildflower line ornament overlap */}
              {config.hasFlower && (
                <div 
                  className={`absolute w-16 h-16 text-gold/60 opacity-60 z-20 pointer-events-none select-none ${config.flowerOffset} ${config.flowerRotation}`}
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="7" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.8" />
                    <path d="M50,15 Q47,32 50,50" stroke="currentColor" strokeWidth="1" />
                    <path d="M50,50 Q53,68 50,85" stroke="currentColor" strokeWidth="1" />
                    {/* Flower Petals */}
                    <path d="M50,15 C48,22 52,22 50,15 Z M50,85 C48,78 52,78 50,85 Z M15,50 C22,48 22,52 15,50 Z M85,50 C78,48 78,52 85,50 Z" fill="currentColor" />
                    <path d="M25,25 C31,29 29,33 25,25 Z M75,75 C69,71 71,67 75,75 Z M25,75 C31,71 29,67 25,75 Z M75,25 C69,29 71,33 75,25 Z" fill="currentColor" />
                    {/* Stem & Leaves */}
                    <path d="M50,58 Q55,75 52,95" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M52,70 Q62,68 58,74" fill="currentColor" />
                    <path d="M51,80 Q40,78 43,84" fill="currentColor" />
                  </svg>
                </div>
              )}

              {index === 1 && (
                <HiddenSeal noteText="Thank you for being my constant and my home." align="left" className="absolute -top-3 left-4 scale-90" />
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Cinematic Lightbox Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 flex flex-col justify-center items-center p-4 bg-background/90 backdrop-blur-md transition-opacity duration-500 ease-in-out cursor-zoom-out select-none"
          onClick={() => setActivePhoto(null)}
        >
          {/* Close control overlay */}
          <button 
            className="absolute top-6 right-6 text-foreground/75 hover:text-foreground text-sm font-semibold tracking-[0.2em] uppercase flex items-center gap-1 cursor-pointer transition-colors duration-200"
            onClick={() => setActivePhoto(null)}
          >
            Close [x]
          </button>

          {/* Luxury framed card */}
          <div 
            className="relative max-w-4xl max-h-[85vh] bg-[#fbf9f4] p-4 sm:p-6 border border-gold/20 shadow-2xl rounded-sm transition-transform duration-500 ease-out scale-100 flex flex-col items-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dashed background edge */}
            <div className="absolute inset-0 border border-dashed border-[#c5a880]/20 -translate-x-[4px] translate-y-[4px] rounded-sm pointer-events-none" />

            {/* Gold border photo mount */}
            <div className="relative border border-[#c5a880]/40 p-2 sm:p-3 bg-white shadow-inner">
              <img 
                src={activePhoto.src} 
                alt={activePhoto.caption}
                className="max-w-full max-h-[60vh] object-contain rounded-xs select-none"
              />
            </div>

            {/* Handwritten script caption */}
            <p className="mt-6 font-handwritten text-3xl sm:text-5xl text-[#7a2e38] text-center max-w-xl leading-relaxed whitespace-pre-line py-3 px-4">
              {activePhoto.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
