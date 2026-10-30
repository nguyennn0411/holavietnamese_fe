import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

/**
 * Animated dynamic starfield / cosmos background for achievement cards, night themes, or hero banners.
 */
export function StarsBackground({
  className,
  starCount = 60,
  speed = 0.4,
  colors = ['#FFFFFF', '#FDE1B3', '#F5B942', '#FED7AA'],
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * speed * 0.3,
      vy: (Math.random() - 0.5) * speed * 0.3,
      alpha: Math.random(),
      alphaSpeed: Math.random() * 0.02 + 0.005,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha += s.alphaSpeed;

        if (s.alpha >= 1 || s.alpha <= 0.1) {
          s.alphaSpeed = -s.alphaSpeed;
        }

        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.shadowBlur = 4;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [starCount, speed, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none absolute inset-0 w-full h-full', className)}
    />
  );
}

export default StarsBackground;
