import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  localizedSiteField,
  resolveBannerImage,
  safeExternalUrl,
  safeInternalPath,
  useSiteContent,
} from '@/application/context/SiteContentContext';
import { BANNER_PLACEMENTS } from '@/config/siteContentDefaults';

const AUTOPLAY_DELAY = 5600;
const TRANSITION_MS = 600;

function BannerAction({ banner, continueTo, label }) {
  if (!label || banner?.actionType === 'NONE') return null;
  if (banner?.actionType === 'EXTERNAL_URL') {
    const href = safeExternalUrl(banner.actionTarget);
    return href ? <a href={href} target="_blank" rel="noreferrer">{label}<ArrowRight size={17} /></a> : null;
  }
  const target = banner?.actionType === 'CONTINUE_LEARNING'
    ? (safeInternalPath(continueTo) || safeInternalPath(banner.actionTarget) || '/edtech/dashboard')
    : safeInternalPath(banner?.actionTarget);
  return target ? <Link to={target}>{label}<ArrowRight size={17} /></Link> : null;
}

export function LearnerHeroCarousel({ continueTo }) {
  const { t, i18n } = useTranslation('learner');
  const { getBanners } = useSiteContent();
  const slides = getBanners(BANNER_PLACEMENTS.LEARNER_HOME);
  const totalSlides = slides.length;
  const language = i18n.resolvedLanguage || i18n.language || 'en';
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const transitionLocked = useRef(false);
  const pointerStart = useRef(null);
  const unlockTimer = useRef(null);

  const navigate = useCallback((nextIndex, nextDirection = 1, manual = true) => {
    if (transitionLocked.current || totalSlides < 2) return;
    transitionLocked.current = true;
    setDirection(nextDirection);
    setActiveIndex((nextIndex + totalSlides) % totalSlides);
    if (manual) setTimerKey((value) => value + 1);
    window.clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(() => { transitionLocked.current = false; }, reduceMotion ? 50 : TRANSITION_MS);
  }, [reduceMotion, totalSlides]);

  useEffect(() => () => window.clearTimeout(unlockTimer.current), []);

  useEffect(() => {
    if (activeIndex >= totalSlides) setActiveIndex(0);
  }, [activeIndex, totalSlides]);

  useEffect(() => {
    if (paused || reduceMotion || totalSlides < 2) return undefined;
    const timer = window.setTimeout(() => navigate(activeIndex + 1, 1, false), AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [activeIndex, navigate, paused, reduceMotion, timerKey, totalSlides]);

  const slide = slides[activeIndex] || slides[0];
  const handlePointerDown = (event) => { pointerStart.current = { x: event.clientX, y: event.clientY }; };
  const handlePointerUp = (event) => {
    if (!pointerStart.current) return;
    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) navigate(activeIndex + (deltaX < 0 ? 1 : -1), deltaX < 0 ? 1 : -1);
  };

  if (totalSlides === 0) return null;
  const slideKey = slide.id ?? slide.code ?? activeIndex;

  return (
    <section
      className="learner-carousel"
      aria-roledescription="carousel"
      aria-label={t('dashboard.carousel.label')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { pointerStart.current = null; }}
    >
      <div className="learner-carousel__viewport">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.article
            key={slideKey}
            className="learner-carousel__slide"
            custom={direction}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 70 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -70 }}
            transition={{ duration: reduceMotion ? .1 : .58, ease: [0.22, 1, 0.36, 1] }}
            aria-roledescription="slide"
            aria-label={t('dashboard.carousel.position', { current: activeIndex + 1, total: totalSlides })}
          >
            <div className="learner-carousel__copy">
              <span>{localizedSiteField(slide, 'eyebrow', language)}</span>
              <h2>{localizedSiteField(slide, 'title', language)}</h2>
              <p>{localizedSiteField(slide, 'description', language)}</p>
              <BannerAction banner={slide} continueTo={continueTo} label={localizedSiteField(slide, 'actionLabel', language)} />
            </div>
            <div className="learner-carousel__photo">
              {resolveBannerImage(slide) && <img src={resolveBannerImage(slide)} alt={localizedSiteField(slide, 'imageAlt', language)} loading={activeIndex === 0 ? 'eager' : 'lazy'} decoding="async" draggable="false" />}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      {totalSlides > 1 && <div className="learner-carousel__controls">
        <div className="learner-carousel__dots" role="group" aria-label={t('dashboard.carousel.choose')}>
          {slides.map((item, index) => <button key={item.id ?? item.code ?? index} type="button" className={index === activeIndex ? 'is-active' : ''} onClick={() => navigate(index, index > activeIndex ? 1 : -1)} aria-label={t('dashboard.carousel.goTo', { number: index + 1 })} aria-current={index === activeIndex ? 'true' : undefined}><span /></button>)}
        </div>
        <div className="learner-carousel__arrows">
          <button type="button" onClick={() => navigate(activeIndex - 1, -1)} aria-label={t('dashboard.carousel.previous')}><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => navigate(activeIndex + 1, 1)} aria-label={t('dashboard.carousel.next')}><ArrowRight size={18} /></button>
        </div>
      </div>}
    </section>
  );
}

export default LearnerHeroCarousel;
