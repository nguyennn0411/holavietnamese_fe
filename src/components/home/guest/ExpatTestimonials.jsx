import React from 'react';
import { motion } from 'motion/react';
import { Star, Volume2 } from 'lucide-react';
import { speakVietnamese } from '@/utils/speech';
import { EXPAT_TESTIMONIALS } from '@/components/home/data/homeData';

/**
 * Expat Testimonials Social Proof Section
 */
export function ExpatTestimonials() {
  return (
    <section className="testimonials-section space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="eyebrow text-xs font-bold uppercase tracking-wider text-[#A62A24]">
          Cảm nhận từ học viên • Expat Community
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-[#431914] tracking-tight">
          Được tin dùng bởi hơn 15,000+ người nước ngoài tại Việt Nam
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {EXPAT_TESTIMONIALS.map((t, idx) => (
          <motion.div
            whileHover={{ y: -4 }}
            key={idx}
            className="bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 shadow-[0_8px_30px_rgb(67,25,20,0.04)] flex flex-col justify-between space-y-4 text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#431914] leading-relaxed italic">
                “{t.quote}”
              </p>
            </div>

            <div className="pt-4 border-t border-[#DECBB4]/40 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#431914] flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#F5E1D8] text-[#A62A24] border border-[#DECBB4]/70">
                    {t.code}
                  </span>
                  <span>{t.name}</span>
                </h4>
                <p className="text-[10px] text-[#78685B]">{t.role}</p>
              </div>
              <button
                type="button"
                onClick={() => speakVietnamese(t.favPhrase.replace(/["“”]/g, ''))}
                className="!min-h-0 !min-w-0 text-[11px] font-bold text-[#A62A24] bg-[#F5E1D8] hover:bg-[#A62A24] hover:text-white px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                title="Nghe câu yêu thích"
                aria-label={`Nghe câu yêu thích: ${t.favPhrase}`}
              >
                <span>{t.favPhrase}</span>
                <Volume2 className="w-3.5 h-3.5 shrink-0" strokeWidth={2.2} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ExpatTestimonials;
