import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Play, Star, Compass } from 'lucide-react';
import { ROADMAP_NODES } from '@/components/home/data/homeData';

/**
 * Gamified Learning Roadmap Adventure Path Teaser
 */
export function GamifiedRoadmapTeaser() {
  return (
    <section className="roadmap-teaser py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="eyebrow text-xs font-bold uppercase tracking-wider text-[#A62A24]">
          Lộ trình phiêu lưu • Learning Adventure
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-[#431914] tracking-tight">
          Từng chặng rõ ràng, học 5 phút mỗi ngày
        </h2>
        <p className="text-sm text-[#78685B]">
          Mỗi bài học được chia nhỏ theo chặng. Mở khóa huy hiệu, tích lũy XP và làm chủ tiếng Việt theo chuẩn CEFR.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 sm:p-10 shadow-[0_10px_35px_-5px_rgba(67,25,20,0.05)] relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          {ROADMAP_NODES.map((node) => (
            <motion.div
              key={node.id}
              whileHover={{ scale: 1.012 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                node.status === 'completed'
                  ? 'bg-white border-emerald-300 shadow-2xs'
                  : node.status === 'current'
                  ? 'bg-[#FFF9EE] border-2 border-[#A62A24] shadow-md ring-4 ring-[#A62A24]/10'
                  : 'bg-[#FAF8F5] border-[#DECBB4]/50 opacity-60'
              }`}
            >
              {/* Node Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                  node.status === 'completed'
                    ? 'bg-emerald-700 text-white'
                    : node.status === 'current'
                    ? 'bg-[#A62A24] text-white shadow-[0_4px_0_#89221E]'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {node.status === 'completed' ? (
                  <Check size={20} strokeWidth={3} />
                ) : node.status === 'current' ? (
                  <Play size={18} fill="currentColor" />
                ) : (
                  <span>🔒</span>
                )}
              </div>

              {/* Title & Level */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#24382B] text-white">
                    {node.level}
                  </span>
                  {node.status === 'current' && (
                    <span className="text-[10px] font-bold text-[#A62A24] uppercase tracking-wider">
                      Đang ở chặng này
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#431914] truncate mt-0.5">
                  {node.title}
                </h3>
              </div>

              {/* Stars & Reward */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      size={14}
                      className={
                        starIdx <= node.stars
                          ? 'text-amber-500 fill-amber-400'
                          : 'text-stone-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-[#A62A24] bg-[#F5E1D8] px-2 py-0.5 rounded-md hidden sm:inline-block">
                  +{node.xp} XP
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-8 text-center">
          <Link
            to="/edtech/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#A62A24] hover:bg-[#89221E] text-white font-black text-xs shadow-[0_4px_0_#89221E] active:translate-y-1 active:shadow-none transition-all"
          >
            <Compass size={16} />
            <span>Mở Lộ Trình Học EdTech Toàn Diện →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GamifiedRoadmapTeaser;
