import React from 'react';
import { HeroBannerSlider, AnimatedMarquee } from '@/components/home/hero';
import { AmbientWatermark } from '../common/HeritageWatermark';
import { HeroInteractiveWidget } from './HeroInteractiveWidget';
import { MetricsRibbon } from './MetricsRibbon';
import { BentoGridSection } from './BentoGridSection';
import { GamifiedRoadmapTeaser } from './GamifiedRoadmapTeaser';
import { ExpatTestimonials } from './ExpatTestimonials';
import { CallToActionBanner } from './CallToActionBanner';

/**
 * Guest Home Landing Page for Unauthenticated Visitors
 */
export function GuestHome() {
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

      {/* 1. Flagship 3D Animated Hero Slider (85-95vh) */}
      <HeroBannerSlider />

      {/* 2. Seamless Infinite Horizontal Marquee */}
      <AnimatedMarquee />

      {/* 3. Interactive Quick 10-Second Trial Mini-Lesson */}
      <section className="w-full py-12 px-4 sm:px-8 lg:px-14 bg-gradient-to-b from-[#FFF9ED] via-white to-[#FFF9ED] border-b border-[#DECBB4]/60">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5E1D8] border border-[#E7B59D] text-[#DA251D] text-xs font-black uppercase tracking-wider">
              <span>☕ Trải nghiệm tức thì • Hands-on Mini Lesson</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#202124] tracking-tight">
              Thử thách 10 giây: Ghép câu gọi cà phê đầu tiên!
            </h2>
            <p className="text-sm text-[#78685B] leading-relaxed">
              Chạm vào các quân từ để sắp xếp thành câu tiếng Việt hoàn chỉnh. Nghe phát âm chuẩn người bản xứ và nhận điểm thưởng XP đầu tiên ngay lập tức!
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
      <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-14 xl:px-20 border-b border-[#DECBB4]/60 bg-gradient-to-b from-[#FFF9EE] via-[#FAF8F5]/60 to-[#FFF9EE]">
        <div className="max-w-7xl mx-auto">
          <BentoGridSection />
        </div>
      </section>

      {/* 6. Gamified Roadmap Teaser: Full-Width Section */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-14 xl:px-20 border-b border-[#DECBB4]/60 bg-[#FAF8F5]/60">
        <div className="max-w-7xl mx-auto">
          <GamifiedRoadmapTeaser />
        </div>
      </section>

      {/* 7. Expat Testimonials: Full-Width Section */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-14 xl:px-20 border-b border-[#DECBB4]/60 bg-gradient-to-b from-[#FFF9EE] to-[#FAF8F5]/60">
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
