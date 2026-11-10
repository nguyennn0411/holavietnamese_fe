import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';

/**
 * Typewriter effect for mascot dialogues or learner conversation prompts.
 */
export function TypingText({
  text = '',
  className,
  duration = 45,
  delay = 0,
  loop = false,
  holdDelay = 2000,
  ...props
}) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let timeoutId;
    let currentIndex = 0;
    let isDeleting = false;

    const type = () => {
      if (!isDeleting) {
        if (currentIndex <= text.length) {
          setDisplayed(text.slice(0, currentIndex));
          currentIndex++;
          timeoutId = setTimeout(type, duration);
        } else if (loop) {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            type();
          }, holdDelay);
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--;
          setDisplayed(text.slice(0, currentIndex));
          timeoutId = setTimeout(type, duration / 2);
        } else {
          isDeleting = false;
          timeoutId = setTimeout(type, 400);
        }
      }
    };

    timeoutId = setTimeout(type, delay);
    return () => clearTimeout(timeoutId);
  }, [text, duration, delay, loop, holdDelay]);

  return (
    <span className={cn('inline-block font-sans', className)} {...props}>
      {displayed}
    </span>
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
  duration = 1.0,
  ...props
}) {
  const targetNumber = number !== undefined ? number : (typeof value === 'number' ? value : 0);
  const [displayVal, setDisplayVal] = useState(from);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;
    const startVal = from;
    const endVal = targetNumber;

    if (startVal === endVal) {
      setDisplayVal(endVal);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = (timestamp - startTimestamp) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(startVal + (endVal - startVal) * ease);
      setDisplayVal(current);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [targetNumber, from, duration]);

  const formatted = displayVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

  return (
    <span className={cn('inline-block font-mono font-bold tabular-nums', className)} {...props}>
      {formatted}
    </span>
  );
}

/**
 * Animated shifting gradient text for badges, special achievements, or headers.
 */
export function GradientText({
  text,
  children,
  gradient = 'linear-gradient(90deg, #F97316 0%, #F5B942 50%, #DA251D 100%)',
  className,
  ...props
}) {
  const content = text !== undefined ? text : children;
  return (
    <span
      className={cn('inline-block font-bold', className)}
      style={{
        backgroundImage: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
      {...props}
    >
      {content}
    </span>
  );
}

/**
 * Shimmering metallic text shine effect for streak celebrations and milestone awards.
 */
export function ShimmeringText({ text, children, className, ...props }) {
  const content = text !== undefined ? text : children;
  return (
    <span
      className={cn(
        'inline-block font-semibold bg-gradient-to-r from-orange-600 via-amber-300 to-orange-600 bg-clip-text text-transparent',
        className
      )}
      style={{
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'shimmerText 2.5s linear infinite',
      }}
      {...props}
    >
      {content}
    </span>
  );
}
