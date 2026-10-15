import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Volume2, ArrowRight } from 'lucide-react';
import { audioFeedback } from '@/utils/audioFeedback';
import { speakVietnamese } from '@/utils/speech';
import { AI_PROMPTS } from '@/components/home/data/homeData';

/**
 * Bento 2: AI Voice Wave Tutor Preview Card
 */
export function AiTutorPreviewCard() {
  const [aiMessageIndex, setAiMessageIndex] = useState(0);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="w-full bg-gradient-to-br from-[#24382B] via-[#2d4435] to-[#1c2c22] text-[#FFF9EE] border border-[#24382B] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 text-left"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-[#E1B65B]/20 text-[#E1B65B] border border-[#E1B65B]/30 text-xs font-bold uppercase tracking-wider">
            AI Tutor 24/7
          </span>
          <span className="text-[11px] text-[#E1B65B] font-semibold">Tự động sửa lỗi</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white">
          Luyện phản xạ với AI Gia sư
        </h3>
        <p className="text-xs sm:text-sm text-[#D5DDCB] leading-relaxed">
          Trò chuyện không áp lực. AI phân tích giọng đọc, gợi ý câu giao tiếp tự nhiên và giải thích ngữ pháp tức thì.
        </p>
      </div>

      {/* Interactive Dialog Bubble */}
      <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-3">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-full bg-[#E1B65B] text-[#431914] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
            AI
          </span>
          <div className="space-y-1">
            <p className="text-xs text-white leading-relaxed font-medium">
              {AI_PROMPTS[aiMessageIndex].ai}
            </p>
            <p className="text-[10px] text-[#E1B65B] italic">
              {AI_PROMPTS[aiMessageIndex].tip}
            </p>
          </div>
        </div>

        {/* Animated Sound Wave Bars with Speak Button */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10">
          <div className="flex items-center gap-1 h-6">
            {[35, 75, 50, 90, 30, 85, 60, 100, 45, 70].map((h, i) => (
              <motion.span
                key={i}
                animate={{ height: [`${h}%`, `${Math.max(20, 105 - h)}%`, `${h}%`] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.08 }}
                className="w-1 bg-[#E1B65B] rounded-full"
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              speakVietnamese(AI_PROMPTS[aiMessageIndex].ai);
              audioFeedback.playPopSound(1.2);
            }}
            className="!min-h-0 !min-w-0 px-3 py-1.5 rounded-full bg-[#E1B65B] hover:bg-[#d4a849] text-[#431914] font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 shrink-0" strokeWidth={2.2} />
            <span>Nghe AI nói</span>
          </button>
        </div>
      </div>

      {/* Interactive User Response Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold text-[#E1B65B]/80">Chọn câu trả lời thử:</span>
        <div className="flex flex-wrap gap-1.5">
          {AI_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setAiMessageIndex(idx);
                audioFeedback.playTap();
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                aiMessageIndex === idx
                  ? 'bg-white text-[#24382B] font-bold shadow-xs'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {p.user}
            </button>
          ))}
        </div>
      </div>

      <Link
        to="/ai-tutor"
        className="w-full py-3 px-4 rounded-xl bg-[#E1B65B] hover:bg-[#d4a849] text-[#431914] font-black text-xs text-center shadow-[0_4px_0_#b88d36] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
      >
        <span>Vào phòng đàm thoại AI Tutor</span>
        <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}

export default AiTutorPreviewCard;
