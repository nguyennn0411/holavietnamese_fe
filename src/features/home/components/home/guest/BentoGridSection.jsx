import React from 'react';
import { TonePitchCard } from '@/features/home/components/home/guest/bento/TonePitchCard';
import { AiTutorPreviewCard } from '@/features/home/components/home/guest/bento/AiTutorPreviewCard';
import { DiacriticKeyboardCard } from '@/features/home/components/home/guest/bento/DiacriticKeyboardCard';
import { SituationalDrillsCard } from '@/features/home/components/home/guest/bento/SituationalDrillsCard';
import { SpotlightCard } from '@/shared/components/common/animate/SpotlightCard';
import { useTranslation } from 'react-i18next';

/**
 * Bento Grid Showcase section highlighting 4 interactive modern learning innovations.
 */
export function BentoGridSection() {
  const { t } = useTranslation('home');
  return (
    <section className="bento-showcase space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#FFF0DC] border border-[#E7B59D] text-[#EA580C] text-xs font-bold uppercase tracking-wider">
          <span>{t('features.eyebrow')}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#253044] tracking-tight">
          {t('features.title')}
        </h2>
        <p className="text-sm text-[#64748B] leading-relaxed">
          {t('features.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <SpotlightCard className="h-full rounded-3xl overflow-hidden" maxTilt={3}>
          <TonePitchCard />
        </SpotlightCard>
        <SpotlightCard className="h-full rounded-3xl overflow-hidden" maxTilt={3}>
          <AiTutorPreviewCard />
        </SpotlightCard>
        <SpotlightCard className="h-full rounded-3xl overflow-hidden" maxTilt={3}>
          <DiacriticKeyboardCard />
        </SpotlightCard>
        <SpotlightCard className="h-full rounded-3xl overflow-hidden" maxTilt={3}>
          <SituationalDrillsCard />
        </SpotlightCard>
      </div>
    </section>
  );
}

export default BentoGridSection;
