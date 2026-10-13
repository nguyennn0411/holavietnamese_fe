import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { ToneCurveGraph } from '@/components/edtech/ui/ToneCurveGraph';
import { VIETNAMESE_TONES } from '@/constants/vietnameseTones';
import { audioFeedback } from '@/utils/audioFeedback';
import { speakVietnamese } from '@/utils/speech';
import { TONE_LIST } from '@/components/home/data/homeData';

/**
 * Bento 1: Tone Pitch Curves Visualizer Card
 */
export function TonePitchCard() {
  const [activeTone, setActiveTone] = useState('HOI');

  const handlePlayTone = (tId) => {
    setActiveTone(tId);
    audioFeedback.playVietnameseTone(tId);
    const item = TONE_LIST.find((x) => x.id === tId);
    if (item) speakVietnamese(item.word);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="w-full bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(67,25,20,0.04)] flex flex-col justify-between space-y-6 text-left"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-[#EDF0E5] text-[#24382B] text-xs font-bold uppercase tracking-wider">
            Đồ thị cao độ • Live Pitch Contour
          </span>
          <span className="text-[11px] font-bold text-[#A62A24] bg-[#F5E1D8] px-2.5 py-0.5 rounded-full">
            Web Audio API
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-[#431914]">
          Làm chủ 6 thanh điệu tiếng Việt trực quan
        </h3>
        <p className="text-xs sm:text-sm text-[#78685B] leading-relaxed">
          Bấm chọn từng thanh để xem đồ thị dao động âm thanh uốn lượn và nghe chuẩn cao độ:
        </p>
      </div>

      {/* Interactive Tone Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {TONE_LIST.map((t) => {
          const isSelected = activeTone === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handlePlayTone(t.id)}
              className={`!min-h-0 !min-w-0 p-3 rounded-2xl border transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                isSelected
                  ? 'bg-[#FFF9EE] border-2 border-[#A62A24] shadow-md scale-105'
                  : 'bg-white hover:bg-[#FFF9EE]/60 border-[#DECBB4]/70 hover:border-[#A62A24]'
              }`}
            >
              <span className="text-[10px] font-bold text-[#78685B] uppercase">{t.name}</span>
              <span className="text-lg font-black text-[#431914]">{t.word}</span>
              <span className="text-[10px] text-[#A62A24] font-bold">{t.symbol}</span>
              <Volume2 className="w-3.5 h-3.5 text-[#A62A24] mt-0.5 shrink-0" strokeWidth={2.2} />
            </button>
          );
        })}
      </div>

      {/* Live ToneCurveGraph Component Embedded Directly */}
      <div className="w-full">
        <ToneCurveGraph
          tone={VIETNAMESE_TONES[activeTone]}
          interactive={true}
          onPlay={() => {
            const item = TONE_LIST.find((x) => x.id === activeTone);
            if (item) speakVietnamese(item.word);
          }}
        />
      </div>

      {/* Tone Details Ribbon */}
      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DECBB4]/70 flex flex-wrap items-center justify-between text-xs text-[#78685B] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#A62A24]" />
          <span>
            Mẹo nhớ: <strong className="text-[#431914]">{VIETNAMESE_TONES[activeTone]?.mnemonicTip}</strong>
          </span>
        </div>
        <Link
          to="/edtech/vocabulary"
          className="text-[#A62A24] font-bold hover:underline flex items-center gap-1 shrink-0"
        >
          Mở kho so sánh thanh điệu →
        </Link>
      </div>
    </motion.div>
  );
}

export default TonePitchCard;
