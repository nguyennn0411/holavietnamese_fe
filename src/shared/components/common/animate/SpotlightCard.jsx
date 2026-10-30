import React, { useRef, useState } from 'react';
import { cn } from '@/utils/cn';

/**
 * Lucian UX/UI Prompt #050 - Spotlight-tilt interactive card.
 * Adds dynamic 3D perspective tilt and radial cursor spotlight glare.
 */
export function SpotlightCard({
  children,
  className,
  glareColor = 'rgba(255, 122, 0, 0.12)',
  tilt = true,
  maxTilt = 6,
  ...props
}) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({ rx: 0, ry: 0 });

  const handlePointerMove = (e) => {
    if (!cardRef.current || e.pointerType === 'touch') return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCoords({ x, y });

    if (tilt) {
      const rx = ((y - 50) / 50) * -maxTilt;
      const ry = ((x - 50) / 50) * maxTilt;
      setTiltStyle({ rx, ry });
    }
  };

  const handlePointerEnter = () => setIsHovered(true);

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTiltStyle({ rx: 0, ry: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={cn('relative rounded-2xl transition-transform duration-200 ease-out', className)}
      style={{
        perspective: '1000px',
        transform: isHovered
          ? `rotateX(${tiltStyle.rx}deg) rotateY(${tiltStyle.ry}deg)`
          : 'rotateX(0deg) rotateY(0deg)',
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {/* Spotlight glare layer */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${coords.x}% ${coords.y}%, ${glareColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}

export default SpotlightCard;
