import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { HeroSlideContent } from './HeroSlideContent';
import { HeroStageVisual } from './HeroStageVisual';
import { audioFeedback } from '@/utils/audioFeedback';

const TOTAL_SLIDES = 5;
const AUTOPLAY_DURATION = 5500; // 5.5 seconds per slide

/**
 * HeroBannerSlider - Premium 3D Animated Hero Slider for HolaVietnamese.
 * Occupies 85-95vh on desktop with 45% left content and 55% right 3D stage.
 * Features auto-rotation, smooth progress indicator, swipe gestures, pause on hover.
 */
export function HeroBannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100%

  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef(null);

  const slideTitles = [
    'Chào mừng Việt Nam',
    'Luyện nói tự tin',
    'Khám phá văn hóa',
    'Lộ trình EdTech',
    'AI Gia sư 24/7',
  ];

  // Next / Prev slide handlers
  const handleNextSlide = useCallback(() => {
    audioFeedback.playTap();
    setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const handlePrevSlide = useCallback(() => {
    audioFeedback.playTap();
    setCurrentSlide((prev) => (prev - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const handleSelectSlide = (idx) => {
    if (idx === currentSlide) return;
    audioFeedback.playTap();
    setCurrentSlide(idx);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextSlide, handlePrevSlide]);

  // Autoplay and continuous progress timer
  useEffect(() => {
    if (isPaused) return;

    startTimeRef.current = Date.now() - (progress / 100) * AUTOPLAY_DURATION;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentPct = Math.min(100, (elapsed / AUTOPLAY_DURATION) * 100);
      setProgress(currentPct);

      if (elapsed >= AUTOPLAY_DURATION) {
        setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
        setProgress(0);
        startTimeRef.current = Date.now();
      } else {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentSlide, isPaused, progress]);

  // Mobile Swipe Gesture Handlers
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 45; // px

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Slide
      handleNextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Previous Slide
      handlePrevSlide();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <section
      className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden py-10 sm:py-14 lg:py-18 px-4 sm:px-8 lg:px-14 xl:px-20 border-b border-[#DECBB4]/60 bg-gradient-to-b from-[#FFF9ED] via-[#FAF8F5]/90 to-[#FFF9ED]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Khám phá các điểm nổi bật của nền tảng HolaVietnamese"
    >
      {/* 1. Subtle Background Dong Son Drum Medallion Watermark */}
      <div
        className="pointer-events-none absolute right-[-6%] top-1/2 -translate-y-1/2 w-[580px] h-[580px] sm:w-[750px] sm:h-[750px] lg:w-[940px] lg:h-[940px] select-none opacity-[0.055] transition-transform duration-1000 ease-out -z-10"
        style={{
          backgroundImage: `url('/design/dong-son-drum.webp')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        }}
        aria-hidden="true"
      />

      {/* 2. Main 2-Column Grid (45% Left / 55% Right) */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-14 items-center relative z-10">
        {/* Left Column (5 cols on lg ~ 42-45%) */}
        <div className="lg:col-span-6 xl:col-span-6 w-full">
          <HeroSlideContent slideIndex={currentSlide} />
        </div>

        {/* Right Column (7 cols on lg ~ 55-58%) */}
        <div className="lg:col-span-6 xl:col-span-6 flex justify-center items-center w-full">
          <HeroStageVisual slideIndex={currentSlide} />
        </div>
      </div>

      {/* 3. Slider Navigation Controls (Left & Right Arrows) */}
      <div className="absolute inset-y-1/2 -translate-y-1/2 inset-x-2 sm:inset-x-4 pointer-events-none flex items-center justify-between z-30">
        <button
          type="button"
          onClick={handlePrevSlide}
          className="pointer-events-auto !min-h-0 !min-w-0 !p-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/80 hover:bg-white text-[#202124] hover:text-[#DA251D] border border-[#DECBB4]/80 hover:border-[#DA251D] flex items-center justify-center backdrop-blur-md shadow-md hover:shadow-lg transition-all hover:scale-108 active:scale-95 cursor-pointer"
          title="Slide trước (Mũi tên trái)"
          aria-label="Slide trước"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" strokeWidth={2.5} />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          className="pointer-events-auto !min-h-0 !min-w-0 !p-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/80 hover:bg-white text-[#202124] hover:text-[#DA251D] border border-[#DECBB4]/80 hover:border-[#DA251D] flex items-center justify-center backdrop-blur-md shadow-md hover:shadow-lg transition-all hover:scale-108 active:scale-95 cursor-pointer"
          title="Slide tiếp theo (Mũi tên phải)"
          aria-label="Slide tiếp theo"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" strokeWidth={2.5} />
        </button>
      </div>

      {/* 4. Bottom Modern Pagination & Progress Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-0 flex flex-col items-center gap-2 z-30 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#DECBB4]/70 shadow-sm">
          {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSlide(idx)}
                className={`relative h-2.5 sm:h-3 rounded-full transition-all cursor-pointer overflow-hidden ${
                  isActive
                    ? 'w-10 sm:w-14 bg-stone-200'
                    : 'w-2.5 sm:w-3 bg-stone-300 hover:bg-[#DA251D]/60'
                }`}
                title={slideTitles[idx]}
                aria-label={`Chuyển tới slide ${idx + 1}: ${slideTitles[idx]}`}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-[#DA251D] rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: 'linear' }}
                  />
                )}
              </button>
            );
          })}

          {/* Autoplay Pause/Play Toggle Button */}
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="!min-h-0 !min-w-0 !p-0 w-5 h-5 rounded-full flex items-center justify-center text-[#78685B] hover:text-[#DA251D] ml-1 transition-colors cursor-pointer"
            title={isPaused ? 'Tiếp tục tự động chuyển slide' : 'Tạm dừng tự động chuyển slide'}
            aria-label={isPaused ? 'Tiếp tục autoplay' : 'Tạm dừng autoplay'}
          >
            {isPaused ? <Play size={10} fill="currentColor" /> : <Pause size={10} fill="currentColor" />}
          </button>
        </div>
      </div>
    </section>
  );
}
