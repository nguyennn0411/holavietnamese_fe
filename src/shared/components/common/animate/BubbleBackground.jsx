import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/utils/cn';

/**
 * Playful floating gradient blobs/bubbles background for onboarding, auth, or mascot dialogues.
 */
export function BubbleBackground({ className, children }) {
  const bubbles = [
    { size: 280, color: 'bg-orange-300/20', top: '-10%', left: '10%', duration: 18, delay: 0 },
    { size: 340, color: 'bg-brand-yellow/20', top: '50%', left: '-5%', duration: 22, delay: 2 },
    { size: 240, color: 'bg-red-400/15', top: '20%', left: '70%', duration: 16, delay: 1 },
    { size: 300, color: 'bg-amber-300/20', top: '75%', left: '60%', duration: 20, delay: 3 },
  ];

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        {bubbles.map((b, i) => (
          <motion.div
            key={i}
            className={cn('absolute rounded-full blur-3xl', b.color)}
            style={{
              width: b.size,
              height: b.size,
              top: b.top,
              left: b.left,
            }}
            animate={{
              x: [0, 30, -25, 0],
              y: [0, -35, 20, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      {children}
    </div>
  );
}

export default BubbleBackground;
