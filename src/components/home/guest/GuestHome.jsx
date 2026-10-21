import React from 'react';
import { HeroBannerSlider, AnimatedMarquee } from '@/components/home/hero';
import { GuestCulturalStrip } from './GuestCulturalStrip';
import { AmbientWatermark } from '../common/HeritageWatermark';
import { HeroInteractiveWidget } from './HeroInteractiveWidget';
import { MetricsRibbon } from './MetricsRibbon';
import { BentoGridSection } from './BentoGridSection';
import { GamifiedRoadmapTeaser } from './GamifiedRoadmapTeaser';
import { ExpatTestimonials } from './ExpatTestimonials';
import { CallToActionBanner } from './CallToActionBanner';
import { useTranslation } from 'react-i18next';
import { BuffaloMascot, MascotSpeechBubble } from '@/components/mascot';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * Guest Home Landing Page for Unauthenticated Visitors
 */
export function GuestHome() {
  const { t } = useTranslation('home');
  return (
    <div className="immersive-home relative w-full overflow-hidden">
      {/* Scrollable Ambient Heritage Background Watermarks */}
      <AmbientWatermark
        className="absolute -right-28 top-[480px] w-[620px] h-[620px] opacity-[0.05]"
      />
      <AmbientWatermark
        className="absolute -left-28 top-[1600px] w-[580px] h-[580px] opacity-[0.045]"
      />
      <AmbientWatermark
        className="absolute -right-28 top-[2700px] w-[560px] h-[560px] opacity-[0.045]"
      />

      {/* Elegant Cultural Introduction Strip */}
      <GuestCulturalStrip />

      {/* 1. Flagship 3D Animated Hero Slider (85-95vh) */}
      <HeroBannerSlider />

      {/* 2. Seamless Infinite Horizontal Marquee */}
      <AnimatedMarquee />

      {/* Friendly Guide Introduction: Meet Nghé */}
      <section className="nghe-guest-intro" aria-labelledby="nghe-guest-title">
        <div className="nghe-guest-intro__card">
          <div className="nghe-guest-intro__stage">
            <div className="nghe-guest-intro__bubble">
              <MascotSpeechBubble arrow="bottom">
                {t('mascot.greeting')}
              </MascotSpeechBubble>
            </div>
            <div className="nghe-guest-intro__pedestal">
              <BuffaloMascot
                variant="welcome"
                size="large"
                animated
                accessibilityLabel={t('mascot.alt')}
              />
            </div>
          </div>

          <div className="nghe-guest-intro__content">
            <div className="nghe-guest-intro__eyebrow">
              <Sparkles size={14} />
              <span>{t('mascot.kicker', 'BẠN ĐỒNG HÀNH TIẾNG VIỆT • LEARNING BUDDY')}</span>
            </div>
            <h2 id="nghe-guest-title">{t('mascot.title')}</h2>
            <p>{t('mascot.description')}</p>
            <div className="nghe-guest-intro__actions">
              <a href="/welcome" className="nghe-guest-intro__cta">
                <span>{t('mascot.action')}</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Quick 10-Second Trial Mini-Lesson */}
      <section id="mini-lesson" className="w-full scroll-mt-24 py-12 px-4 sm:px-8 lg:px-14 bg-gradient-to-b from-[#FBF8F3] via-white to-[#FBF8F3] border-b border-[#EBDED0]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0DC] border border-[#FED7AA] text-[#FF7A00] text-xs font-black uppercase tracking-wider">
              <span>☕ {t('miniLesson.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#253044] tracking-tight">
              {t('miniLesson.title')}
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              {t('miniLesson.description')}
            </p>
          </div>
          <div className="flex justify-center w-full lg:w-auto">
            <HeroInteractiveWidget />
          </div>
        </div>
      </section>

      {/* 4. Metrics Ribbon: Full-Width Edge-to-Edge Banner */}
      <MetricsRibbon />

      {/* 5. Bento Grid Showcase: Full-Width Section */}
      <section id="features" className="w-full scroll-mt-24 py-16 sm:py-24 px-4 sm:px-8 lg:px-14 xl:px-20 border-b border-[#EBDED0] bg-gradient-to-b from-white via-[#FBF8F3]/80 to-white">
        <div className="max-w-7xl mx-auto">
          <BentoGridSection />
        </div>
      </section>

      {/* 6. Gamified Roadmap Teaser: Full-Width Section */}
      <section id="learning-path" className="w-full scroll-mt-24 py-16 sm:py-24 px-4 sm:px-8 lg:px-14 xl:px-20 border-b border-[#EBDED0] bg-[#F6EFE6]/50">
        <div className="max-w-7xl mx-auto">
          <GamifiedRoadmapTeaser />
        </div>
      </section>

      {/* 7. Expat Testimonials: Full-Width Section */}
      <section id="testimonials" className="w-full scroll-mt-24 py-16 sm:py-24 px-4 sm:px-8 lg:px-14 xl:px-20 border-b border-[#EBDED0] bg-gradient-to-b from-white to-[#FBF8F3]">
        <div className="max-w-7xl mx-auto">
          <ExpatTestimonials />
        </div>
      </section>

      {/* 8. High-converting Final CTA: Full-Width Edge-to-Edge Banner */}
      <CallToActionBanner />
    </div>
  );
}

export default GuestHome;
