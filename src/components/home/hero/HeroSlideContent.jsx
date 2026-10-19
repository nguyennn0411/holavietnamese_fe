import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function HeroSlideContent({ slideIndex = 0 }) {
  const { t } = useTranslation('home');
  const slideKeys = ['pho', 'tet', 'midAutumn', 'hoiAn'];
  const key = slideKeys[slideIndex] || slideKeys[0];

  return (
    <motion.div key={key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }} className="guest-cultural-copy">
      <span className="guest-cultural-copy__eyebrow">{t(`guestBanner.${key}.eyebrow`)}</span>
      <h1>{t(`guestBanner.${key}.title`)}</h1>
      <p>{t(`guestBanner.${key}.description`)}</p>
      <Link to="/welcome">{t(`guestBanner.${key}.action`)}<ArrowRight size={18} /></Link>
    </motion.div>
  );
}

export default HeroSlideContent;
