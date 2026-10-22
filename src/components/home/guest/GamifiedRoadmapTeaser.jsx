import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Play } from 'lucide-react';
import { ROADMAP_NODES } from '@/components/home/data/homeData';
import { useTranslation } from 'react-i18next';

/**
 * Gamified Learning Roadmap Adventure Path Teaser
 */
export function GamifiedRoadmapTeaser() {
  const navigate = useNavigate();
  const { t } = useTranslation('home');
  return (
    <section className="roadmap-teaser py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="eyebrow text-xs font-bold uppercase tracking-wider text-[#EA580C]">
          {t('roadmap.eyebrow')}
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-[#253044] tracking-tight">
          {t('roadmap.title')}
        </h2>
        <p className="text-sm text-[#64748B]">
          {t('roadmap.description')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white/92 backdrop-blur-xs border border-[#E8E5DF]/70 rounded-3xl p-6 sm:p-10 shadow-[0_10px_35px_-5px_rgba(67,25,20,0.05)] relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          {ROADMAP_NODES.map((node) => (
            <motion.div
              key={node.id}
              whileHover={{ scale: 1.012 }}
              role={node.status === 'locked' ? undefined : 'link'}
              tabIndex={node.status === 'locked' ? undefined : 0}
              onClick={() => node.status !== 'locked' && navigate(node.status === 'current' ? '/welcome' : '/courses')}
              onKeyDown={(event) => {
                if (node.status !== 'locked' && (event.key === 'Enter' || event.key === ' ')) navigate(node.status === 'current' ? '/welcome' : '/courses');
              }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                node.status === 'completed'
                  ? 'bg-white border-emerald-300 shadow-2xs'
                  : node.status === 'current'
                  ? 'bg-[#FFF7E8] border-2 border-[#EA580C] shadow-md ring-4 ring-[#EA580C]/10'
                  : 'bg-[#FFFCF7] border-[#E8E5DF]/50 opacity-60'
              } ${node.status !== 'locked' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              {/* Node Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  node.status === 'completed'
                    ? 'bg-emerald-700 text-white'
                    : node.status === 'current'
                    ? 'bg-[#EA580C] text-white shadow-[0_4px_0_#C2410C]'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {node.status === 'completed' ? (
                  <Check size={20} strokeWidth={3} />
                ) : node.status === 'current' ? (
                  <Play size={18} fill="currentColor" />
                ) : (
                  <span className="text-xs font-bold text-stone-400 font-mono">#{node.id}</span>
                )}
              </div>

              {/* Title & Level */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#24382B] text-white">
                    {node.level}
                  </span>
                  {node.status === 'current' && (
                    <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider">
                      {t('roadmap.current')}
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#253044] truncate mt-0.5">
                  {node.title}
                </h3>
              </div>

              {/* Stars & Reward */}
              <div className="flex items-center gap-3 shrink-0">
                
                <span className="text-[11px] font-bold text-[#EA580C] bg-[#FFF0DC] px-2 py-0.5 rounded-md hidden sm:inline-block">
                  +{node.xp} XP
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-8 text-center">
          <Link
            to="/welcome"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-black text-xs shadow-[0_4px_0_#C2410C] active:translate-y-1 active:shadow-none transition-all"
          >
            <span>{t('roadmap.action')}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GamifiedRoadmapTeaser;
