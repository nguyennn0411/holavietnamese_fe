import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import bunChaImage from '@/assets/images/learner-carousel/bun-cha.webp';
import mausoleumImage from '@/assets/images/learner-carousel/ho-chi-minh-mausoleum.webp';
import tetImage from '@/assets/images/learner-carousel/vietnamese-tet.webp';
import midAutumnImage from '@/assets/images/learner-carousel/mid-autumn-festival.webp';

const AUTOPLAY_DELAY = 5600;
const TRANSITION_MS = 600;

export function LearnerHeroCarousel({ continueTo }) {
  const { t } = useTranslation('learner');
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const transitionLocked = useRef(false);
  const pointerStart = useRef(null);
  const unlockTimer = useRef(null);

  const slides = [
    { key: 'buncha', image: bunChaImage, to: continueTo || '/courses' },
    { key: 'mausoleum', image: mausoleumImage, to: '/culture' },
    { key: 'tet', image: tetImage, to: '/courses' },
    { key: 'midAutumn', image: midAutumnImage, to: '/ai-tutor' },
  ];

  const navigate = useCallback((nextIndex, nextDirection = 1, manual = true) => {
    if (transitionLocked.current) return;
    transitionLocked.current = true;
    setDirection(nextDirection);
    setActiveIndex((nextIndex + slides.length) % slides.length);
    if (manual) setTimerKey((value) => value + 1);
    window.clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(() => { transitionLocked.current = false; }, reduceMotion ? 50 : TRANSITION_MS);
  }, [reduceMotion, slides.length]);

  useEffect(() => () => window.clearTimeout(unlockTimer.current), []);

  useEffect(() => {
    if (paused || reduceMotion) return undefined;
    const timer = window.setTimeout(() => navigate(activeIndex + 1, 1, false), AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [activeIndex, navigate, paused, reduceMotion, timerKey]);

  const slide = slides[activeIndex];
  const handlePointerDown = (event) => { pointerStart.current = { x: event.clientX, y: event.clientY }; };
  const handlePointerUp = (event) => {
    if (!pointerStart.current) return;
    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) navigate(activeIndex + (deltaX < 0 ? 1 : -1), deltaX < 0 ? 1 : -1);
  };

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
            key={slide.key}
            className="learner-carousel__slide"
            custom={direction}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 70 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -70 }}
            transition={{ duration: reduceMotion ? .1 : .58, ease: [0.22, 1, 0.36, 1] }}
            aria-roledescription="slide"
            aria-label={t('dashboard.carousel.position', { current: activeIndex + 1, total: slides.length })}
          >
            <div className="learner-carousel__copy">
              <span>{t(`dashboard.carousel.${slide.key}.eyebrow`)}</span>
              <h2>{t(`dashboard.carousel.${slide.key}.title`)}</h2>
              <p>{t(`dashboard.carousel.${slide.key}.description`)}</p>
              <Link to={slide.to}>{t(`dashboard.carousel.${slide.key}.action`)}<ArrowRight size={17} /></Link>
            </div>
            <div className="learner-carousel__photo">
              <img src={slide.image} alt={t(`dashboard.carousel.${slide.key}.imageAlt`)} loading={activeIndex === 0 ? 'eager' : 'lazy'} decoding="async" draggable="false" />
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="learner-carousel__controls">
        <div className="learner-carousel__dots" role="group" aria-label={t('dashboard.carousel.choose')}>
          {slides.map((item, index) => <button key={item.key} type="button" className={index === activeIndex ? 'is-active' : ''} onClick={() => navigate(index, index > activeIndex ? 1 : -1)} aria-label={t('dashboard.carousel.goTo', { number: index + 1 })} aria-current={index === activeIndex ? 'true' : undefined}><span /></button>)}
        </div>
        <div className="learner-carousel__arrows">
          <button type="button" onClick={() => navigate(activeIndex - 1, -1)} aria-label={t('dashboard.carousel.previous')}><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => navigate(activeIndex + 1, 1)} aria-label={t('dashboard.carousel.next')}><ArrowRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}

export default LearnerHeroCarousel;
