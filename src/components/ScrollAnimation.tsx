import React, { useEffect, useRef, useState } from "react";

export default function ScrollAnimation() {
  const TOTAL_FRAMES = 240;
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true on client-side load
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Preload images in the background (client-side only)
  useEffect(() => {
    if (!isMounted) return;

    let count = 0;
    const preloadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const formattedIndex = String(i).padStart(3, '0');
      img.src = `/hero-frames/ezgif-frame-${formattedIndex}.png`;
      
      img.onload = () => {
        count++;
        // Draw the first frame immediately when ready
        if (i === 1) {
          drawInitialFrame(img);
        }
        if (count === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      
      img.onerror = () => {
        count++;
        if (count === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      preloadedImages.push(img);
    }
    imagesRef.current = preloadedImages;
  }, [isMounted]);

  // Monitor scroll progress (client-side only)
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const startY = rect.top + window.scrollY;
      const currentScroll = window.scrollY;
      
      let progress = 0;
      const scrollHeight = rect.height - window.innerHeight;
      if (currentScroll > startY && scrollHeight > 0) {
        progress = (currentScroll - startY) / scrollHeight;
      }
      progress = Math.max(0, Math.min(1, progress));

      setScrollProgress(progress);
      targetFrameRef.current = 1 + progress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isMounted]);

  // Draw initial frame to canvas
  const drawInitialFrame = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = 1280;
    canvas.height = 720;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  // Canvas drawing loop with linear interpolation (lerp) (client-side only)
  useEffect(() => {
    if (!isMounted || !isLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 720;

    let animationId: number;

    const tick = () => {
      const images = imagesRef.current;
      const currentFrame = currentFrameRef.current;
      const targetFrame = targetFrameRef.current;
      
      const frameDelta = targetFrame - currentFrame;
      let nextFrame = currentFrame;

      if (Math.abs(frameDelta) > 0.005) {
        nextFrame += frameDelta * 0.15; // Smooth scroll momentum factor
      } else {
        nextFrame = targetFrame;
      }

      currentFrameRef.current = nextFrame;

      const clampedIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(nextFrame)));
      const img = images[clampedIndex - 1];

      if (img && img.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isMounted, isLoaded]);

  if (!isMounted) {
    return <div className="relative h-[400vh] w-full bg-background" />;
  }

  // Custom sticky implementation using dynamic positioning layout classes:
  // - Top: absolutely positioned at the top of container until scroll starts.
  // - Middle: fixed viewport locks canvas in place during scroll progression.
  // - Bottom: absolutely positioned at the bottom of container when scroll ends, letting it scroll away naturally.
  let positionClass = "absolute top-0 left-0 w-full h-screen";
  if (scrollProgress > 0 && scrollProgress < 1) {
    positionClass = "fixed top-0 left-0 w-full h-screen";
  } else if (scrollProgress >= 1) {
    positionClass = "absolute bottom-0 left-0 w-full h-screen";
  }

  // Soft fade out for canvas near the end (from 90% to 100% scroll progress)
  const canvasOpacity = Math.max(0, Math.min(1, (1 - scrollProgress) / 0.1));

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full bg-background">
      {/* Dynamic Viewport Container */}
      <div className={`${positionClass} overflow-hidden bg-background`}>
        <canvas
          ref={canvasRef}
          className="h-full w-full object-cover block transition-opacity duration-75"
          style={{ opacity: canvasOpacity }}
        />
      </div>
    </div>
  );
}
