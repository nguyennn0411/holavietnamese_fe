import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/utils/cn';

/**
 * 3D Flip Card component for vocabulary flashcards, grammar tips, or profile cards.
 * Powered by Motion and 3D CSS transforms.
 */
export function FlipCard({
  front,
  back,
  children,
  trigger = 'click', // 'click' | 'hover'
  flipped: controlledFlipped,
  onFlip,
  className,
  innerClassName,
  perspective = 1000,
  transition = { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
}) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isControlled = controlledFlipped !== undefined;
  const isFlipped = isControlled ? controlledFlipped : internalFlipped;

  const handleToggle = () => {
    if (trigger === 'click') {
      const next = !isFlipped;
      if (!isControlled) setInternalFlipped(next);
      onFlip?.(next);
    }
  };

  const handleHover = (state) => {
    if (trigger === 'hover') {
      if (!isControlled) setInternalFlipped(state);
      onFlip?.(state);
    }
  };

  return (
    <div
      className={cn('relative inline-block cursor-pointer select-none', className)}
      style={{ perspective: `${perspective}px` }}
      onClick={handleToggle}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      <motion.div
        className={cn('relative w-full h-full', innerClassName)}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={transition}
      >
        {/* Front Face */}
        <div
          className="w-full h-full"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {front || children}
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

export default FlipCard;
