import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * High-converting Final Call-to-Action Banner with Dong Son bronze drum inlay
 */
export function CallToActionBanner() {
  const { t } = useTranslation('home');
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#431914] via-[#61211b] to-[#A62A24] text-white py-20 sm:py-28 px-4 sm:px-8 lg:px-16 text-center shadow-xl">
      {/* Dong Son Bronze Drum Inlay */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] sm:w-[720px] sm:h-[720px] lg:w-[900px] lg:h-[900px] select-none opacity-[0.14] mix-blend-screen"
        style={{
          backgroundImage: `url('/design/dong-son-drum.webp')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        }}
        aria-hidden="true"
      />
      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#E1B65B]/20 text-[#E1B65B] border border-[#E1B65B]/30 text-xs font-black uppercase tracking-wider">
          {t('cta.eyebrow')}
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
          {t('cta.title')}
        </h2>
        <p className="text-base sm:text-lg text-[#F7F0E3]/90 leading-relaxed max-w-2xl mx-auto">
          {t('cta.description')}
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link
            to="/welcome"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-[#E1B65B] hover:bg-[#d4a849] text-[#431914] font-black text-sm shadow-[0_4px_0_#b88d36] active:translate-y-1 active:shadow-none transition-all hover:scale-102"
          >
            <span>{t('cta.primary')}</span>
            <ArrowRight size={18} />
          </Link>
          <a
            href="#learning-path"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
          >
            <span>{t('cta.secondary')}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default CallToActionBanner;
