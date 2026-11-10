import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

/**
 * Festive celebratory fireworks background for quiz completions, streak records, or course finish.
 */
export function FireworksBackground({
  className,
  active = true,
  count = 28,
  frequencyMs = 650,
  colors = ['#DA251D', '#F97316', '#F5B942', '#10B981', '#3B82F6', '#8B5CF6'],
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createFirework = (x, y) => {
      const particleCount = count;
      const angleStep = (Math.PI * 2) / particleCount;
      const color = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < particleCount; i++) {
        const speed = Math.random() * 4.5 + 2;
        const angle = angleStep * i + (Math.random() - 0.5) * 0.25;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.016 + 0.01,
          color,
          size: Math.random() * 2.5 + 1.5,
        });
      }
    };

    let lastLaunch = 0;
    const loop = (timestamp) => {
      if (timestamp - lastLaunch > frequencyMs) {
        lastLaunch = timestamp;
        const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
        createFirework(x, y);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter((p) => p.alpha > 0);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.055; // gravity
        p.alpha -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [active, count, frequencyMs, colors]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none absolute inset-0 z-10 w-full h-full', className)}
    />
  );
}

export default FireworksBackground;
