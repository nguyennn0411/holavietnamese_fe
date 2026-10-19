import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen } from 'lucide-react';

/**
 * Compact learning motivation strip for Authenticated Learner Dashboard.
 * Positioned cleanly between LearnerTopbar and LearnerHeroCarousel.
 * Provides daily focus motivation and a compact lesson continuation trigger,
 * strictly without repeating Level, Streak, or XP already displayed in the topbar.
 */
export function LearnerMotivationStrip({ continueTo }) {
  const { t } = useTranslation('learner');

  return (
    <section
      className="ld-motivation-strip"
      aria-label={t('motivationStrip.ariaLabel', { defaultValue: 'Daily learning focus' })}
    >
      <div className="ld-motivation-strip__main">
        <span className="ld-motivation-strip__icon" aria-hidden="true">
          <BookOpen size={16} strokeWidth={2.4} />
        </span>
        <div className="ld-motivation-strip__text">
          <strong className="ld-motivation-strip__title">
            {t('motivationStrip.title', { defaultValue: 'Ready for your next Vietnamese lesson?' })}
          </strong>
          <span className="ld-motivation-strip__subtitle">
            {t('motivationStrip.subtitle', { defaultValue: 'A little practice every day makes a difference.' })}
          </span>
        </div>
      </div>

      {continueTo ? (
        <Link
          to={continueTo}
          className="ld-motivation-strip__action"
          aria-label={`${t('motivationStrip.action', { defaultValue: 'Continue lesson' })}: ${t('motivationStrip.title', { defaultValue: 'Ready for your next Vietnamese lesson?' })}`}
        >
          <span>{t('motivationStrip.action', { defaultValue: 'Continue lesson' })}</span>
          <ArrowRight size={14} strokeWidth={2.4} />
        </Link>
      ) : null}
    </section>
  );
}

export default LearnerMotivationStrip;
