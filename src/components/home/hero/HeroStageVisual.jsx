import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { localizedSiteField, resolveBannerImage } from '@/contexts/SiteContentContext';

export function HeroStageVisual({ banner, eager = false }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || 'en';
  const key = banner?.id ?? banner?.code ?? 'banner';
  const image = resolveBannerImage(banner);

  return (
    <div className="guest-cultural-photo">
      <AnimatePresence initial={false} mode="wait">
        {image && <motion.img key={key} src={image} alt={localizedSiteField(banner, 'imageAlt', language)} initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .6, ease: 'easeOut' }} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false" />}
      </AnimatePresence>
      <div className="guest-cultural-photo__shade" aria-hidden="true" />
      {localizedSiteField(banner, 'photoLabel', language) && <span>{localizedSiteField(banner, 'photoLabel', language)}</span>}
    </div>
  );
}

export default HeroStageVisual;
