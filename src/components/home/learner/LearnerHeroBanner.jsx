import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BookOpen, ChevronLeft, ChevronRight, Heart, MessageCircle, Pause, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import bunChaImage from '@/assets/images/learner-carousel/bun-cha.webp';
import mausoleumImage from '@/assets/images/learner-carousel/ho-chi-minh-mausoleum.webp';
import hoiAnImage from '@/assets/images/guest-carousel/vietnam-hoi-an-banner.jpg';

/** Cinematic learner carousel shown at the top of the authenticated dashboard. */
export function LearnerHeroBanner({
  user,
  greeting: greetingProp,
  streakCount = 0,
  totalXp = 0,
  hearts,
  hasCheckedInToday = false,
  currentLesson,
  onCheckIn,
}) {
  const { t } = useTranslation('learner');
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const displayName = user?.fullName || user?.username || 'learner';
  const lessonTitle = currentLesson?.title || currentLesson?.titleVi || t('hero.noLesson');
  const progress = currentLesson?.progressPercent ?? currentLesson?.progress ?? 0;
  const lessonId = currentLesson?.lessonId ?? currentLesson?.id;
  const courseId = currentLesson?.courseId;
  const lessonRoute = courseId && lessonId ? `/courses/${courseId}/lesson/${lessonId}` : '/edtech/dashboard';
  // Compute greeting internally so the parent doesn't need to pass it
  const hour = new Date().getHours();
  const greeting = greetingProp ?? (hour < 12 ? t('hero.morning') : hour < 18 ? t('hero.afternoon') : t('hero.evening'));
  const slides = [
    {
      eyebrow: t('hero.continueEyebrow'),
      title: t('hero.continueTitle', { greeting, name: displayName }),
      description: t('hero.continueDescription'),
      image: bunChaImage,
      action: t('hero.continueAction'),
      to: lessonRoute,
      icon: Play,
      meta: lessonTitle,
    },
    {
      eyebrow: t('hero.reviewEyebrow'), title: t('hero.reviewTitle'),
      description: t('hero.reviewDescription'),
      image: hoiAnImage,
      action: t('hero.reviewAction'),
      to: '/vocabulary',
      icon: BookOpen,
      meta: t('hero.reviewMeta'),
    },
    {
      eyebrow: t('hero.tutorEyebrow'), title: t('hero.tutorTitle'),
      description: t('hero.tutorDescription'),
      image: mausoleumImage,
      action: t('hero.tutorAction'),
      to: '/ai-tutor',
      icon: MessageCircle,
      meta: t('hero.tutorMeta'),
    },
  ];
  const slide = slides[currentSlide];
  const SlideIcon = slide.icon;

  useEffect(() => {
    if (isPaused || reduceMotion) return undefined;
    const timer = window.setInterval(() => setCurrentSlide((value) => (value + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [isPaused, reduceMotion, slides.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion) return undefined;
    const context = canvas.getContext('2d');
    let animationId;
    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      radius: Math.random() * 2.5 + 0.8,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.45 + 0.15,
    }));
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 222, 100, ${particle.alpha})`;
        context.fill();
      });
      animationId = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize);
    draw();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, [reduceMotion]);

  return <section className="learner-hero-banner relative w-full overflow-hidden rounded-3xl" aria-label={t('hero.label')} aria-roledescription="carousel" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
    <div className="absolute inset-0 learner-hero-bg" aria-hidden="true" />
    <AnimatePresence mode="popLayout"><motion.div key={slide.image} className="absolute inset-0 learner-hero-photo" style={{backgroundImage:`url(${slide.image})`}} initial={reduceMotion ? false : {opacity:0,scale:1.05}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:.8}} aria-hidden="true" /></AnimatePresence>
    <div className="absolute inset-0 learner-hero-overlay" aria-hidden="true" />
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
    <div className="relative z-10 p-6 sm:p-8 lg:p-10 xl:p-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div className="space-y-3">
          <motion.div key={`eyebrow-${currentSlide}`} initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold uppercase tracking-wider"><span>{slide.eyebrow}</span></motion.div>
          <motion.h1 key={`title-${currentSlide}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.08}} className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">{slide.title}</motion.h1>
          <motion.p key={`description-${currentSlide}`} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.16}} className="text-sm sm:text-base text-white/75 max-w-lg leading-relaxed">{slide.description}</motion.p>
        </div>
        {hearts != null ? <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/12 backdrop-blur-sm border border-white/20"><Heart size={18} className="text-rose-400" fill="currentColor"/><div><span className="block text-sm font-black text-white leading-none">{hearts}</span><span className="block text-[9px] text-white/60 font-semibold uppercase mt-0.5">{t('hero.energy')}</span></div></motion.div> : null}
      </div>
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap"><span className="px-2 py-0.5 rounded-md bg-[#24382B]/80 text-[#D5DDCB] text-[10px] font-black uppercase tracking-wider">{t('hero.journey')}</span><span className="text-[11px] font-bold text-[#FFDE00]">{currentSlide + 1} / {slides.length}</span></div>
            <AnimatePresence mode="wait"><motion.h2 key={slide.meta} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} className="text-lg sm:text-xl font-black text-white leading-snug truncate">{slide.meta}</motion.h2></AnimatePresence>
            <div className="space-y-1"><div className="flex justify-between text-[11px] text-white/65 font-semibold"><span>{currentSlide === 0 ? <>{t('hero.progress')}: <strong className="text-white">{progress}%</strong></> : t('hero.discovery')}</span><span>{currentSlide === 0 ? t('hero.momentum') : t('hero.madeForLevel')}</span></div><div className="w-full bg-white/15 h-2.5 rounded-full overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${currentSlide === 0 ? progress : (currentSlide + 1) * 28}%`}} transition={{duration:1,delay:.4,ease:'easeOut'}} className="h-full rounded-full bg-gradient-to-r from-[#FFDE00] to-[#ff8c00]"/></div></div>
          </div>
          <div className="flex flex-col sm:items-end gap-2.5 shrink-0"><Link to={slide.to} className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#FFDE00] hover:bg-[#f5d000] text-[#253044] font-black text-sm shadow-[0_4px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all group"><span>{slide.action}</span><ChevronRight size={16}/></Link><Link to="/courses" className="text-[11px] font-bold text-white/70 hover:text-white">{t('hero.exploreCourses')}</Link></div>
        </div>
      </motion.div>
      {onCheckIn && !hasCheckedInToday ? <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} className="mt-4 flex items-center justify-between gap-4 p-3.5 rounded-xl bg-[#FFDE00]/15 border border-[#FFDE00]/30"><span className="text-white text-xs font-semibold">{t('hero.checkInReady')}</span><button type="button" onClick={onCheckIn} className="px-4 py-2 rounded-xl bg-[#FFDE00] text-[#253044] font-black text-xs">{t('hero.checkIn')}</button></motion.div> : null}
      <div className="learner-hero-controls" role="group" aria-label={t('hero.choose')}>
        <button type="button" onClick={() => setCurrentSlide((value) => (value - 1 + slides.length) % slides.length)} aria-label={t('hero.previous')}><ChevronLeft/></button>
        <div>{slides.map((item,index) => <button key={item.title} type="button" className={index === currentSlide ? 'is-active' : ''} onClick={() => setCurrentSlide(index)} aria-label={t('hero.show', { number: index + 1 })} aria-current={index === currentSlide ? 'true' : undefined}><span/></button>)}</div>
        <button type="button" onClick={() => setIsPaused((value) => !value)} aria-label={isPaused ? t('hero.resume') : t('hero.pause')}>{isPaused ? <Play/> : <Pause/>}</button>
        <button type="button" onClick={() => setCurrentSlide((value) => (value + 1) % slides.length)} aria-label={t('hero.next')}><ChevronRight/></button>
      </div>
    </div>
    <style>{`
      .learner-hero-bg{background:linear-gradient(135deg,#F97316 0%,#EA580C 35%,#F59E0B 70%,#F5B942 100%)}
      .learner-hero-photo{background-size:cover;background-position:center;opacity:.42}
      .learner-hero-overlay{background:linear-gradient(90deg,rgba(234,88,12,.94) 0%,rgba(245,158,11,.86) 50%,rgba(245,185,66,.72) 100%)}
      .learner-hero-banner{min-height:440px;box-shadow:0 20px 50px rgba(249,115,22,.18)}
      .learner-hero-controls{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:18px}
      .learner-hero-controls>div{display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:99px;background:rgba(255,255,255,.12);backdrop-filter:blur(8px)}
      .learner-hero-controls button{min-width:0;min-height:0;width:31px;height:31px;padding:0;border:1px solid rgba(255,255,255,.2);border-radius:10px;background:rgba(255,255,255,.1);color:white;display:grid;place-items:center;cursor:pointer;transition:.2s}
      .learner-hero-controls>div button{width:25px;height:11px;border:0;background:transparent}.learner-hero-controls>div button span{display:block;width:8px;height:8px;border-radius:99px;background:rgba(255,255,255,.45);transition:.3s}.learner-hero-controls>div button.is-active span{width:22px;background:#FFDE00}.learner-hero-controls svg{width:15px;height:15px}
      @media(max-width:640px){.learner-hero-photo{background-position:65% center}.learner-hero-overlay{background:linear-gradient(90deg,rgba(234,88,12,.96),rgba(245,158,11,.88))}.learner-hero-banner{min-height:520px;border-radius:20px}}
      @media(min-width:768px){.learner-hero-banner{min-height:380px}}
      @media(prefers-reduced-motion:reduce){.learner-hero-controls button{transition:none}}
    `}</style>
  </section>;
}

export default LearnerHeroBanner;
