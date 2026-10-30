import React from 'react';
import { AnimateIcon as BaseAnimateIcon } from '@animate-ui/react/icons';
import { cn } from '@/utils/cn';

/**
 * Animated icon wrapper for Lucide icons.
 * Triggers interactive animations like 'path' draw, bounce, or pulse on hover or tap.
 */
export function AnimatedIcon({
  children,
  className,
  animateOnHover = 'path', // 'path' | 'path-loop' | boolean
  animateOnTap,
  animateOnView,
  loop = false,
  speed = 1,
  delay = 0,
  ...props
}) {
  return (
    <BaseAnimateIcon
      className={cn('inline-flex items-center justify-center', className)}
      animateOnHover={animateOnHover}
      animateOnTap={animateOnTap}
      animateOnView={animateOnView}
      loop={loop}
      speed={speed}
      delay={delay}
      {...props}
    >
      {children}
    </BaseAnimateIcon>
  );
}

export default AnimatedIcon;
