import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Volume2, ArrowRight } from 'lucide-react';
import { audioFeedback } from '@/utils/audioFeedback';
import { speakVietnamese } from '@/utils/speech';
import { CULTURAL_SITUATIONS } from '@/components/home/data/homeData';

/**
 * Bento 4: Street Situational Drills Card
 */
export function SituationalDrillsCard() {
  const [activeSituationIndex, setActiveSituationIndex] = useState(0);
  const currentSituation = CULTURAL_SITUATIONS[activeSituationIndex];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="w-full bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(67,25,20,0.04)] flex flex-col justify-between space-y-5 text-left"
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-[#F5E1D8] text-[#A62A24] text-xs font-bold uppercase tracking-wider">
            Tình huống thực tế • Situational Drills
          </span>
          <span className="text-[11px] font-semibold text-[#78685B]">Interactive preview</span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-[#431914]">
          Bước ra đường phố và giao tiếp tự tin
        </h3>
        <p className="text-xs text-[#78685B]">
          Bấm chọn từng tình huống để nghe câu giao tiếp chuẩn bản xứ:
        </p>
      </div>

      {/* Situation Cards Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {CULTURAL_SITUATIONS.map((item, idx) => {
          const Icon = item.icon;
          const isSelected = activeSituationIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveSituationIndex(idx);
                speakVietnamese(item.phraseVi);
                audioFeedback.playTap();
              }}
              className={`p-3 rounded-2xl border text-left transition-all space-y-1 cursor-pointer ${
                isSelected
                  ? 'bg-[#FFF9EE] border-2 border-[#A62A24] shadow-xs'
                  : 'bg-[#FAF8F5] border-[#DECBB4]/70 hover:border-[#A62A24]'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-[#A62A24] text-white' : 'bg-[#F5E1D8] text-[#A62A24]'
                }`}
              >
                <Icon size={14} />
              </div>
              <h4 className="text-xs font-bold text-[#431914] truncate">{item.title}</h4>
              <p className="text-[10px] text-[#78685B] truncate">{item.situation}</p>
            </button>
          );
        })}
      </div>

      {/* Active Situation Dialog Ribbon */}
      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DECBB4] space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#A62A24]">
              {currentSituation.title} • {currentSituation.situation}
            </span>
            <p className="text-sm font-black text-[#431914]">
              “{currentSituation.phraseVi}”
            </p>
          </div>
          <button
            type="button"
            onClick={() => speakVietnamese(currentSituation.phraseVi)}
            className="!min-h-0 !min-w-0 !p-0 w-9 h-9 rounded-xl bg-[#A62A24] text-white flex items-center justify-center shadow-xs hover:bg-[#89221E] transition-colors shrink-0 ml-2 cursor-pointer"
            title="Nghe câu mẫu"
            aria-label="Nghe câu mẫu"
          >
            <Volume2 className="w-4 h-4 shrink-0" strokeWidth={2.2} />
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between text-xs text-[#78685B] border-t border-[#DECBB4]/50 pt-2">
          <span>{currentSituation.phraseEn}</span>
          <span className="font-mono text-[11px] text-stone-400">{currentSituation.ipa}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-[#78685B]">Bao gồm đối thoại, trả giá và chỉ đường</span>
        <Link to="/courses" className="text-[#A62A24] font-bold hover:underline flex items-center gap-1">
          <span>Xem tất cả khóa học</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}

export default SituationalDrillsCard;
