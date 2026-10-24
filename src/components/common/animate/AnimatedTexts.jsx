import React from 'react';
import { TypingText as AnimateTypingText } from '@animate-ui/react/primitives/texts/typing';
import { CountingNumber as AnimateCountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import { GradientText as AnimateGradientText } from '@animate-ui/react/primitives/texts/gradient';
import { ShimmeringText as AnimateShimmeringText } from '@animate-ui/react/primitives/texts/shimmering';
import { cn } from '@/utils/cn';

/**
 * Typewriter effect for mascot dialogues or learner conversation prompts.
 */
export function TypingText({ text, className, duration = 50, delay = 0, loop = false, holdDelay = 2000, ...props }) {
  return (
    <AnimateTypingText
      text={text}
      className={cn('inline-block font-sans', className)}
      duration={duration}
      delay={delay}
      loop={loop}
      holdDelay={holdDelay}
      {...props}
    />
  );
}

/**
 * Animated number counter for XP, Streaks, Lesson Scores, or Gems.
 */
export function CountingNumber({
  value,
  number,
  from = 0,
  className,
  thousandSeparator = ',',
  transition = { type: 'spring', damping: 20, stiffness: 100 },
  ...props
}) {
  const targetNumber = number !== undefined ? number : (typeof value === 'number' ? value : 0);
  return (
    <AnimateCountingNumber
      number={targetNumber}
      fromNumber={from}
      thousandSeparator={thousandSeparator}
      transition={transition}
      className={cn('inline-block font-mono font-bold tabular-nums', className)}
      {...props}
    />
  );
}

/**
 * Animated shifting gradient text for badges, special achievements, or headers.
 */
export function GradientText({
  text,
  gradient = 'linear-gradient(90deg, #F97316 0%, #F5B942 50%, #DA251D 100%)',
  className,
  ...props
}) {
  return (
    <AnimateGradientText
      text={text}
      gradient={gradient}
      className={cn('font-bold', className)}
      {...props}
    />
  );
}

/**
 * Shimmering metallic text shine effect for streak celebrations and milestone awards.
 */
export function ShimmeringText({ text, className, ...props }) {
  return (
    <AnimateShimmeringText
      text={text}
      className={cn('font-semibold', className)}
      {...props}
    />
  );
}
