import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * AnimatedMarquee - Infinite horizontal ticker inspired by the Vietnamese flag colors (#FF7A00 & #FFCD00).
 * Features seamless infinite loop, pauses on hover, and responsive typography.
 */
export function AnimatedMarquee() {
  const { t } = useTranslation('home');
  const marqueeItems = t('marquee', { returnObjects: true });

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-r from-[#C2410C] via-[#FF7A00] to-[#C2410C] py-3.5 border-y border-[#FFCD00]/30 shadow-md select-none group"
      aria-label="HolaVietnamese"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FFCD00]/15 via-transparent to-transparent" />

      {/* Ticker Track */}
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] items-center">
        {/* Render 3 copies to ensure perfectly seamless endless loop */}
        {[0, 1, 2].map((copyIndex) => (
          <div key={copyIndex} className="flex items-center shrink-0">
            {marqueeItems.map((item, idx) => (
              <span
                key={`${copyIndex}-${idx}`}
                className="inline-flex items-center gap-3 px-4 text-xs sm:text-sm font-black tracking-widest uppercase text-[#FFCD00] transition-colors"
              >
                <span>{item}</span>
                <span className="text-[#FFF9ED] opacity-60 text-sm">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
