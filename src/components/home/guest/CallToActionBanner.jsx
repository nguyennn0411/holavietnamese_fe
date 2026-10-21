import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Formats the CTA title to elegantly highlight the cultural core phrase
 * while maintaining strict WCAG AA contrast against warm light theme backgrounds.
 */
function renderHighlightedTitle(titleText) {
  if (!titleText || typeof titleText !== 'string') return titleText;

  // Vietnamese: highlight "nói tiếng Việt"
  if (titleText.includes('nói tiếng Việt')) {
    const parts = titleText.split('nói tiếng Việt');
    return (
      <>
        {parts[0]}
        <span className="text-[#C9372C] inline-block font-black tracking-tight">
          nói tiếng Việt
        </span>
        {parts[1] || ''}
      </>
    );
  }

  // English: highlight "with confidence"
  if (titleText.includes('with confidence')) {
    const parts = titleText.split('with confidence');
    return (
      <>
        {parts[0]}
        <span className="text-[#C9372C] inline-block font-black tracking-tight">
          with confidence
        </span>
        {parts[1] || ''}
      </>
    );
  }

  return titleText;
}

/**
 * Modern, luminous, high-converting Call-to-Action Hero Section.
 * Designed with warm ivory/cream background, subtle Dong Son bronze drum watermark,
 * and high-contrast accessible typography for international EdTech standards.
 */
export function CallToActionBanner() {
  const { t } = useTranslation('home');

  const title = t('cta.title');
  const eyebrow = t('cta.eyebrow');
  const description = t('cta.description');
  const primaryText = t('cta.primary');
  const secondaryText = t('cta.secondary');

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF7EC] to-[#FFF0DD] border-t border-[#EBDED0] border-b border-[#E8DCCF] py-20 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-16 text-center select-none-text transition-colors duration-300"
      aria-label="Call to action"
    >
      {/* Soft Ambient Radial Warm Glow */}
      <div
        className="pointer-events-none absolute inset-0 select-none"
        style={{
          background:
            'radial-gradient(circle 800px at 50% 10%, rgba(254, 215, 170, 0.42), transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Decorative Vietnamese Dong Son Bronze Drum Watermark */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[780px] sm:h-[780px] lg:w-[980px] lg:h-[980px] select-none opacity-[0.065] mix-blend-multiply transition-opacity duration-500"
        style={{
          backgroundImage: `url('/design/dong-son-drum.webp')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        }}
        aria-hidden="true"
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-6 sm:space-y-7">
        {/* Eyebrow Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF4E5] text-[#C45A24] border border-[#FCD9BD]/80 shadow-[0_2px_8px_rgba(196,90,36,0.06)] text-xs font-black uppercase tracking-wider">
          <Sparkles size={13} className="text-[#C45A24] shrink-0" aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>

        {/* Hero Main Heading with clamp responsive typography */}
        <h2 className="text-[#203047] font-extrabold tracking-tight leading-[1.18] sm:leading-[1.16] text-[clamp(30px,2.4vw+22px,58px)] max-w-3xl mx-auto font-['Be_Vietnam_Pro',sans-serif]">
          {renderHighlightedTitle(title)}
        </h2>

        {/* Refined Description */}
        <p className="text-[#526174] text-base sm:text-lg lg:text-[19px] leading-relaxed max-w-2xl mx-auto font-normal">
          {description}
        </p>

        {/* Dual CTA Button Group */}
        <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4.5 w-full sm:w-auto">
          {/* Primary CTA Button */}
          <Link
            to="/welcome"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 h-12 sm:h-[52px] rounded-2xl bg-[#C9372C] hover:bg-[#B32D23] active:bg-[#9E251C] text-white font-bold text-sm sm:text-base shadow-[0_4px_16px_rgba(201,55,44,0.28)] hover:shadow-[0_8px_24px_rgba(201,55,44,0.36)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9372C] focus-visible:ring-offset-2 cursor-pointer"
          >
            <span>{primaryText}</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          {/* Secondary CTA Button */}
          <a
            href="#learning-path"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 sm:px-8 h-12 sm:h-[52px] rounded-2xl bg-white hover:bg-[#FFF9F0] text-[#203047] font-bold text-sm sm:text-base border border-[#D4C4B0] hover:border-[#C45A24]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_18px_rgba(32,48,71,0.08)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#203047] focus-visible:ring-offset-2 cursor-pointer"
          >
            <span>{secondaryText}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default CallToActionBanner;
