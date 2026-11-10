import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { localizedSiteField, safeExternalUrl, safeInternalPath } from '@/features/admin/context/SiteContentContext';

function BannerAction({ banner, label }) {
  if (!label || banner?.actionType === 'NONE') return null;
  if (banner?.actionType === 'EXTERNAL_URL') {
    const href = safeExternalUrl(banner.actionTarget);
    return href ? <a href={href} target="_blank" rel="noreferrer">{label}<ArrowRight size={18} /></a> : null;
  }
  const target = safeInternalPath(banner?.actionTarget)
    || (banner?.actionType === 'CONTINUE_LEARNING' ? '/welcome' : null);
  return target ? <Link to={target}>{label}<ArrowRight size={18} /></Link> : null;
}

export function HeroSlideContent({ banner }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || 'en';
  const key = banner?.id ?? banner?.code ?? 'banner';

  return (
    <motion.div key={key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }} className="guest-cultural-copy">
      <span className="guest-cultural-copy__eyebrow">{localizedSiteField(banner, 'eyebrow', language)}</span>
      <h1>{localizedSiteField(banner, 'title', language)}</h1>
      <p>{localizedSiteField(banner, 'description', language)}</p>
      <BannerAction banner={banner} label={localizedSiteField(banner, 'actionLabel', language)} />
    </motion.div>
  );
}

export default HeroSlideContent;
