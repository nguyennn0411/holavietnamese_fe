import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

/**
 * Compact, elegant cultural introduction strip for Guest Homepage.
 * Positioned seamlessly between GuestTopbar and HeroBannerSlider.
 * Highlights: Discover Vietnam tagline + cultural pillars with subtle red/gold accents.
 */
export function GuestCulturalStrip() {
  const { t } = useTranslation('home');

  return (
    <div
      className="guest-cultural-strip"
      role="region"
      aria-label={t('culturalStrip.ariaLabel', { defaultValue: 'Vietnamese cultural introduction' })}
    >
      <div className="guest-cultural-strip__inner">
        <div className="guest-cultural-strip__lead">
          <span className="guest-cultural-strip__badge" aria-hidden="true">
            <Sparkles className="guest-cultural-strip__badge-icon" />
          </span>
          <p className="guest-cultural-strip__tagline">
            {t('culturalStrip.tagline', { defaultValue: 'Discover Vietnam, one word at a time.' })}
          </p>
        </div>

        <div
          className="guest-cultural-strip__pillars"
          aria-label={t('culturalStrip.pillars', { defaultValue: 'Language • Culture • Connection' })}
        >
          <span className="guest-cultural-strip__pillar">
            {t('culturalStrip.pillarLanguage', { defaultValue: 'Language' })}
          </span>
          <span className="guest-cultural-strip__dot" aria-hidden="true">•</span>
          <span className="guest-cultural-strip__pillar">
            {t('culturalStrip.pillarCulture', { defaultValue: 'Culture' })}
          </span>
          <span className="guest-cultural-strip__dot" aria-hidden="true">•</span>
          <span className="guest-cultural-strip__pillar">
            {t('culturalStrip.pillarConnection', { defaultValue: 'Connection' })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GuestCulturalStrip;
