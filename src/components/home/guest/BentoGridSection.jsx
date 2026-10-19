import React from 'react';
import { Sparkles } from 'lucide-react';
import { TonePitchCard } from './bento/TonePitchCard';
import { AiTutorPreviewCard } from './bento/AiTutorPreviewCard';
import { DiacriticKeyboardCard } from './bento/DiacriticKeyboardCard';
import { SituationalDrillsCard } from './bento/SituationalDrillsCard';
import { useTranslation } from 'react-i18next';

/**
 * Bento Grid Showcase section highlighting 4 interactive modern learning innovations.
 */
export function BentoGridSection() {
  const { t } = useTranslation('home');
  return (
    <section className="bento-showcase space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5E1D8] border border-[#E7B59D] text-[#A62A24] text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} />
          <span>{t('features.eyebrow')}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#431914] tracking-tight">
          {t('features.title')}
        </h2>
        <p className="text-sm text-[#78685B] leading-relaxed">
          {t('features.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <TonePitchCard />
        <AiTutorPreviewCard />
        <DiacriticKeyboardCard />
        <SituationalDrillsCard />
      </div>
    </section>
  );
}

export default BentoGridSection;
