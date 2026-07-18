import React, { useEffect, useRef, useState } from "react";

interface Sparkle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  angle: number;
  spin: number;
  opacity: number;
}

export default function CursorSparkles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const lastSpawnRef = useRef({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sync canvas dimension to viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Spawning throttle metric (distance in pixels)
    const SPAWN_DISTANCE = 22;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Verify if cursor is hovering over any interactive node
      const isInteractive = 
        target.closest("button") || 
        target.closest("a") || 
        target.closest(".cursor-pointer") || 
        target.closest("[role='button']");

      if (!isInteractive) return;

      const lastSpawn = lastSpawnRef.current;
      const dx = e.clientX - lastSpawn.x;
      const dy = e.clientY - lastSpawn.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only spawn particle if mouse has traveled past the trigger distance threshold
      if (distance > SPAWN_DISTANCE) {
        const sparkles = sparklesRef.current;

        // Add small gold 4-point star sparkle
        sparkles.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 3.5, // 3.5px to 7.5px star size
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: -Math.random() * 0.4 - 0.3, // floats upwards slowly
          angle: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.05, // gentle rotation spin
          opacity: 1.0
        });

        lastSpawnRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Draw a single 4-point sparkle star using quadratic curves
    const drawSparkleStar = (c: CanvasRenderingContext2D, s: Sparkle) => {
      c.save();
      c.translate(s.x, s.y);
      c.rotate(s.angle);
      c.fillStyle = "#c5a880"; // warm champagne gold sparkle
      c.globalAlpha = s.opacity;

      c.beginPath();
      // Draw 4-point star path
      c.moveTo(0, -s.size);
      c.quadraticCurveTo(0, 0, s.size, 0);
      c.quadraticCurveTo(0, 0, 0, s.size);
      c.quadraticCurveTo(0, 0, -s.size, 0);
      c.quadraticCurveTo(0, 0, 0, -s.size);
      c.closePath();
      c.fill();

      c.restore();
    };

    let animationId: number;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const sparkles = sparklesRef.current;

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        
        // Update physics
        s.x += s.speedX;
        s.y += s.speedY;
        s.angle += s.spin;
        s.opacity -= 0.02; // fades out over 50 frames (approx 800ms)

        // Remove faded particles
        if (s.opacity <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        // Draw sparkle
        drawSparkleStar(ctx, s);
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none select-none z-50"
    />
  );
}
