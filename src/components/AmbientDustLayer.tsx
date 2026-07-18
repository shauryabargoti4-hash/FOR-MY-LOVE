import React, { useEffect, useRef, useState } from "react";

interface DustParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  baseOpacity: number;
  swaySpeed: number;
  swayTime: number;
}

export default function AmbientDustLayer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<DustParticle[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const createParticle = (width: number, height: number, isInitial = false): DustParticle => {
    const baseOpacity = Math.random() * 0.12 + 0.05; // very faint (5% to 17% opacity)
    return {
      x: Math.random() * width,
      y: isInitial ? Math.random() * height : height + 10,
      size: Math.random() * 2 + 1, // small dust specks (1px to 3px)
      speedX: (Math.random() - 0.5) * 0.2, // slow horizontal drift
      speedY: -Math.random() * 0.35 - 0.1, // slow upward movement
      opacity: 0,
      baseOpacity,
      swaySpeed: Math.random() * 0.01 + 0.005,
      swayTime: Math.random() * 100
    };
  };

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Initialize 30-40 particles
    const particleCount = 35;
    const initialParticles: DustParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      initialParticles.push(createParticle(canvas.width, canvas.height, true));
    }
    particlesRef.current = initialParticles;

    let animFrameId: number;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      const audioData = (window as any).__ambientAudioData;
      const isPlaying = audioData?.isPlaying;
      const reducedMotion = audioData?.reducedMotion;
      
      const volume = audioData?.volume || 0;
      const bass = audioData?.bass || 0;

      particles.forEach((p) => {
        // ── 1. Apply Physics (unless reduced motion is strictly blocking movement) ──
        if (!reducedMotion) {
          p.swayTime += p.swaySpeed;
          // Apply horizontal drift + sine wave sway
          p.x += p.speedX + Math.sin(p.swayTime) * 0.15;
          // Make upward movement react slightly to the bass rhythm
          const currentSpeedY = isPlaying ? p.speedY * (1.0 + bass * 0.35) : p.speedY;
          p.y += currentSpeedY;
        }

        // Wrap around horizontal edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Respawn if drifted off the top of screen
        if (p.y < -10) {
          Object.assign(p, createParticle(canvas.width, canvas.height, false));
        }

        // ── 2. Calculate Glow and Opacity based on Music ──
        // Ambient dust opacity breathes subtly with music volume
        let targetOpacity = p.baseOpacity;
        if (isPlaying) {
          // Increase opacity by up to 10% during musical peaks
          targetOpacity = p.baseOpacity * (1.0 + volume * 0.75);
        }

        // Smooth fade-in on spawn, fade-out near top
        if (p.opacity < targetOpacity) {
          p.opacity = Math.min(targetOpacity, p.opacity + 0.005);
        } else if (p.opacity > targetOpacity) {
          p.opacity = Math.max(targetOpacity, p.opacity - 0.005);
        }

        // Fade out near the top boundary
        if (p.y < 80) {
          p.opacity = Math.max(0, p.opacity * (p.y / 80));
        }

        // ── 3. Render Particle speck ──
        ctx.save();
        ctx.beginPath();
        
        // Draw a soft glowing dot
        const glowRadius = isPlaying ? p.size * (1.0 + volume * 0.5) : p.size;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius * 2);
        
        // Gold dust glow gradient stops
        const opacityStr = p.opacity.toFixed(3);
        gradient.addColorStop(0, `rgba(214, 185, 122, ${opacityStr})`);
        gradient.addColorStop(0.4, `rgba(182, 138, 53, ${(p.opacity * 0.5).toFixed(3)})`);
        gradient.addColorStop(1, `rgba(182, 138, 53, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, glowRadius * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none select-none z-[1]"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
