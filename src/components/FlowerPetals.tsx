import React, { useEffect, useRef, useState } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayTime: number;
  angle: number;
  rotSpeed: number;
  opacity: number;
}

export default function FlowerPetals() {
  const PETAL_COUNT = 10;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const petalsRef = useRef<Petal[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const createPetal = (canvasWidth: number, canvasHeight: number, isInitial = false): Petal => {
    const colors = ["rgba(255, 192, 203, 0.65)", "rgba(247, 231, 206, 0.65)"];
    return {
      x: Math.random() * canvasWidth,
      y: isInitial ? Math.random() * canvasHeight : -20,
      size: Math.random() * 8 + 8, // sizes between 8px and 16px
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 0.4 + 0.3, // slow downward movement (0.3 to 0.7px per frame)
      swaySpeed: Math.random() * 0.015 + 0.005,
      swayAmplitude: Math.random() * 0.6 + 0.3,
      swayTime: Math.random() * 100,
      angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.006, // gentle rotation
      opacity: 0, // start transparent to fade in
    };
  };

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas sizes
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Initialize 8-12 petals
    const initialPetals: Petal[] = [];
    for (let i = 0; i < PETAL_COUNT; i++) {
      initialPetals.push(createPetal(canvas.width, canvas.height, true));
    }
    petalsRef.current = initialPetals;

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Draw a single petal leaf shape using bezier curves
    const drawPetalShape = (c: CanvasRenderingContext2D, p: Petal) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.angle);
      c.fillStyle = p.color;
      c.globalAlpha = p.opacity;

      c.beginPath();
      c.moveTo(0, -p.size);
      // Left side curve
      c.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size / 2, p.size / 2, 0, p.size);
      // Right side curve
      c.bezierCurveTo(p.size / 2, p.size / 2, p.size / 2, -p.size / 2, 0, -p.size);
      c.closePath();
      c.fill();

      c.restore();
    };

    let animationId: number;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mouse = mouseRef.current;
      const petals = petalsRef.current;
      
      // Proximity limit check for Footer
      const footer = document.querySelector("footer");
      let maxAllowedY = canvas.height;
      
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        // Since canvas is fixed, footerRect.top represents the viewport-relative position of footer top
        maxAllowedY = footerRect.top - 40;
      }

      petals.forEach((p) => {
        // 1. Horizontal sway (sine wave oscillation)
        p.swayTime += p.swaySpeed;
        p.x += Math.sin(p.swayTime) * p.swayAmplitude;

        // 2. Slow downward fall
        p.y += p.speedY;

        // 3. Axis rotation
        p.angle += p.rotSpeed;

        // 4. Subtle mouse push force
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          const force = (120 - dist) / 120;
          // Softly push petal away from cursor
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        // 5. Opacity transitions (fade in at top, fade out before footer)
        if (p.y < 50) {
          p.opacity = Math.min(1, p.opacity + 0.02);
        }

        if (p.y > maxAllowedY) {
          // Beyond allowed limit: force fade out and respawn
          p.opacity = Math.max(0, p.opacity - 0.05);
          if (p.opacity <= 0) {
            Object.assign(p, createPetal(canvas.width, canvas.height, false));
          }
        } else if (p.y > maxAllowedY - 100) {
          // Within 100px of footer: start fade out
          const distToLimit = maxAllowedY - p.y;
          p.opacity = Math.max(0, Math.min(1, distToLimit / 100));
        } else {
          // Fully visible
          p.opacity = Math.min(1, p.opacity + 0.01);
        }

        // 6. Respawn if scrolled off viewport bottom
        if (p.y > canvas.height + 20) {
          Object.assign(p, createPetal(canvas.width, canvas.height, false));
        }

        // Draw active petal
        drawPetalShape(ctx, p);
      });

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none select-none z-50"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
