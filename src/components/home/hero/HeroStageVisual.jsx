import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import phoImage from '@/assets/images/guest-carousel/vietnam-pho-banner.jpg';
import tetImage from '@/assets/images/guest-carousel/vietnam-tet-banner.jpg';
import midAutumnImage from '@/assets/images/guest-carousel/vietnam-mid-autumn-banner.jpg';
import hoiAnImage from '@/assets/images/guest-carousel/vietnam-hoi-an-banner.jpg';

const SLIDES = [
  { key: 'pho', image: phoImage },
  { key: 'tet', image: tetImage },
  { key: 'midAutumn', image: midAutumnImage },
  { key: 'hoiAn', image: hoiAnImage },
];

export function HeroStageVisual({ slideIndex = 0 }) {
  const { t } = useTranslation('home');
  const current = SLIDES[slideIndex] || SLIDES[0];

  return (
    <div className="guest-cultural-photo">
      <AnimatePresence initial={false} mode="wait">
        <motion.img key={current.key} src={current.image} alt={t(`guestBanner.${current.key}.imageAlt`)} initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .6, ease: 'easeOut' }} loading={slideIndex === 0 ? 'eager' : 'lazy'} decoding="async" draggable="false" />
      </AnimatePresence>
      <div className="guest-cultural-photo__shade" aria-hidden="true" />
      <span>{t(`guestBanner.${current.key}.photoLabel`)}</span>
    </div>
  );
}

export default HeroStageVisual;
