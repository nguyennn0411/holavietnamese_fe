import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/utils/cn';

/**
 * Animated icon wrapper for Lucide icons.
 * Triggers interactive animations like bounce or pulse on hover or tap.
 */
export function AnimatedIcon({
  children,
  className,
  ...props
}) {
  return (
    <motion.span
      className={cn('inline-flex items-center justify-center', className)}
      whileHover={{ scale: 1.15, rotate: 4 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.span>
  );
}

export default AnimatedIcon;
