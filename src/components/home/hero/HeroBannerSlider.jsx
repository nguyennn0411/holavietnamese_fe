import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HeroSlideContent } from './HeroSlideContent';
import { HeroStageVisual } from './HeroStageVisual';
import { audioFeedback } from '@/utils/audioFeedback';

const TOTAL_SLIDES = 4;
const AUTOPLAY_DURATION = 5600;
const TRANSITION_LOCK = 650;

export function HeroBannerSlider() {
  const { t } = useTranslation('home');
  const reduceMotion = useReducedMotion();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  const locked = useRef(false);
  const unlockTimer = useRef(null);
  const paused = manualPaused || hovered || focusWithin || reduceMotion;
  const slideTitles = t('guestBanner.slideTitles', { returnObjects: true });

  const goTo = useCallback((nextIndex, manual = true) => {
    if (locked.current) return;
    locked.current = true;
    if (manual) audioFeedback.playTap();
    setCurrentSlide((nextIndex + TOTAL_SLIDES) % TOTAL_SLIDES);
    if (manual) setTimerKey((value) => value + 1);
    window.clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(() => { locked.current = false; }, reduceMotion ? 50 : TRANSITION_LOCK);
  }, [reduceMotion]);

  useEffect(() => () => window.clearTimeout(unlockTimer.current), []);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setTimeout(() => goTo(currentSlide + 1, false), AUTOPLAY_DURATION);
    return () => window.clearTimeout(timer);
  }, [currentSlide, goTo, paused, timerKey]);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(currentSlide - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); goTo(currentSlide + 1); }
  };

  const handleTouchEnd = () => {
    if (touchStart.current == null || touchEnd.current == null) return;
    const distance = touchStart.current - touchEnd.current;
    touchStart.current = null;
    touchEnd.current = null;
    if (Math.abs(distance) > 45) goTo(currentSlide + (distance > 0 ? 1 : -1));
  };

  return (
    <section
      className="hero-banner-container guest-cultural-banner"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false); }}
      onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; touchEnd.current = null; }}
      onTouchMove={(event) => { touchEnd.current = event.touches[0].clientX; }}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label={t('carouselLabel')}
    >
      <div className="hero-banner-grid">
        <HeroSlideContent slideIndex={currentSlide} />
        <HeroStageVisual slideIndex={currentSlide} />
      </div>

      <div className="guest-cultural-banner__arrows">
        <button type="button" onClick={() => goTo(currentSlide - 1)} aria-label={t('previousSlide')}><ChevronLeft size={22} /></button>
        <button type="button" onClick={() => goTo(currentSlide + 1)} aria-label={t('nextSlide')}><ChevronRight size={22} /></button>
      </div>

      <div className="guest-cultural-banner__pagination" role="group" aria-label={t('carouselLabel')}>
        {Array.from({ length: TOTAL_SLIDES }).map((_, index) => (
          <button key={index} type="button" className={index === currentSlide ? 'is-active' : ''} onClick={() => goTo(index)} title={slideTitles[index]} aria-label={t('goToSlide', { number: index + 1, title: slideTitles[index] })} aria-current={index === currentSlide ? 'true' : undefined}>
            <span>{index === currentSlide && <i key={`${currentSlide}-${timerKey}`} className={paused ? 'is-paused' : ''} />}</span>
          </button>
        ))}
        <button type="button" className="guest-cultural-banner__pause" onClick={() => setManualPaused((value) => !value)} aria-label={manualPaused ? t('resumeSlides') : t('pauseSlides')} title={manualPaused ? t('resumeSlides') : t('pauseSlides')}>
          {manualPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
        </button>
      </div>
    </section>
  );
}

export default HeroBannerSlider;
