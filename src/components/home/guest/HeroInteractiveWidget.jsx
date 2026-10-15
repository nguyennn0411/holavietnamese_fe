import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RotateCcw, Check, CheckCircle2 } from 'lucide-react';
import { audioFeedback } from '@/utils/audioFeedback';
import { speakVietnamese } from '@/utils/speech';

/**
 * 10-Second Hands-on Mini Lesson Widget (Order Iced Milk Coffee)
 */
export function HeroInteractiveWidget() {
  const targetWords = ['Cho', 'tôi', 'một ly', 'cà phê sữa đá'];
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [availableTokens, setAvailableTokens] = useState([
    'cà phê sữa đá',
    'Cho',
    'bát phở',
    'tôi',
    'một ly',
  ]);
  const [status, setStatus] = useState('idle');

  const handleSelectToken = (token) => {
    if (status === 'correct') return;
    audioFeedback.playTap();
    setSelectedTokens((prev) => [...prev, token]);
    setAvailableTokens((prev) => {
      const idx = prev.indexOf(token);
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
    setStatus('idle');
  };

  const handleRemoveToken = (token) => {
    if (status === 'correct') return;
    audioFeedback.playTap();
    setSelectedTokens((prev) => {
      const idx = prev.indexOf(token);
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
    setAvailableTokens((prev) => [...prev, token]);
    setStatus('idle');
  };

  const handleCheck = () => {
    const isCorrect =
      selectedTokens.length === targetWords.length &&
      selectedTokens.every((val, idx) => val === targetWords[idx]);

    if (isCorrect) {
      audioFeedback.playSuccessChime();
      setStatus('correct');
      speakVietnamese('Cho tôi một ly cà phê sữa đá');
    } else {
      audioFeedback.playErrorSound();
      setStatus('incorrect');
    }
  };

  const handleReset = () => {
    setSelectedTokens([]);
    setAvailableTokens(['cà phê sữa đá', 'Cho', 'bát phở', 'tôi', 'một ly']);
    setStatus('idle');
  };

  return (
    <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl border border-[#DECBB4]/80 shadow-[0_20px_50px_rgba(67,25,20,0.08)] p-6 sm:p-7 space-y-4 text-left transition-all">
      {/* Top Header Tag with Dual Speed Controls */}
      <div className="flex items-center justify-between border-b border-[#DECBB4]/40 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-wider text-[#A62A24]">
            Trải nghiệm 10 giây • Try It Free
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => speakVietnamese('Cho tôi một ly cà phê sữa đá', 0.9)}
            className="!min-h-0 !min-w-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5E1D8] hover:bg-[#A62A24] text-[#A62A24] hover:text-white transition-all text-[11px] font-bold shadow-2xs cursor-pointer"
            title="Nghe chuẩn (1.0x)"
          >
            <Volume2 className="w-3.5 h-3.5 shrink-0" strokeWidth={2.2} />
            <span>1.0x</span>
          </button>
          <button
            type="button"
            onClick={() => speakVietnamese('Cho tôi một ly cà phê sữa đá', 0.6)}
            className="!min-h-0 !min-w-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF8F5] hover:bg-[#DECBB4] text-[#78685B] hover:text-[#431914] transition-all text-[11px] font-bold border border-[#DECBB4]/60 cursor-pointer"
            title="Nghe chậm (0.6x)"
          >
            <span>🐢 0.6x</span>
          </button>
        </div>
      </div>

      {/* Target prompt */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#78685B]">
          Dịch sang tiếng Việt tự nhiên:
        </p>
        <p className="text-base sm:text-lg font-black text-[#431914] mt-0.5">
          “I would like an iced milk coffee please”
        </p>
      </div>

      {/* Answer Drop Slot */}
      <div className="min-h-[58px] p-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-dashed border-[#DECBB4] flex flex-wrap items-center gap-2">
        {selectedTokens.length === 0 ? (
          <span className="text-xs text-[#78685B]/60 italic select-none pl-1">
            Bấm chọn các quân từ bên dưới theo thứ tự…
          </span>
        ) : (
          selectedTokens.map((token, idx) => (
            <motion.button
              layout
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={`${token}-${idx}`}
              type="button"
              onClick={() => handleRemoveToken(token)}
              className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-[#A62A24] text-[#A62A24] font-black text-xs shadow-[0_2px_0_#A62A24] hover:bg-[#F5E1D8] active:translate-y-0.5 transition-all"
            >
              {token}
            </motion.button>
          ))
        )}
      </div>

      {/* Available Word Bank Tokens */}
      <div className="flex flex-wrap gap-2 pt-1">
        {availableTokens.map((token, idx) => (
          <motion.button
            layout
            key={`${token}-${idx}`}
            type="button"
            onClick={() => handleSelectToken(token)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FFF9EE] border border-[#DECBB4] hover:border-[#A62A24] text-[#431914] font-bold text-xs shadow-[0_2px_0_#DECBB4] hover:shadow-[0_2px_0_#A62A24] active:translate-y-0.5 transition-all"
          >
            {token}
          </motion.button>
        ))}
      </div>

      {/* Feedback Alert */}
      <AnimatePresence>
        {status === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span className="font-bold">Chính xác tuyệt đối! Bạn vừa gọi món như người Việt!</span>
            </div>
            <span className="font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg shrink-0">
              +15 XP
            </span>
          </motion.div>
        )}

        {status === 'incorrect' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between"
          >
            <span>Thứ tự đúng: Cho + tôi + một ly + cà phê sữa đá</span>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold underline text-red-700 ml-2"
            >
              Thử lại
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="!min-h-0 !min-w-0 p-2.5 rounded-xl text-[#78685B] hover:text-[#431914] hover:bg-[#FFF9EE] transition-colors shrink-0 cursor-pointer"
          title="Làm lại từ đầu"
        >
          <RotateCcw className="w-4 h-4 shrink-0" />
        </button>

        <button
          type="button"
          disabled={selectedTokens.length === 0 || status === 'correct'}
          onClick={handleCheck}
          className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            status === 'correct'
              ? 'bg-emerald-600 text-white shadow-[0_4px_0_#047857]'
              : selectedTokens.length > 0
              ? 'bg-[#A62A24] hover:bg-[#89221E] text-white shadow-[0_4px_0_#89221E] active:translate-y-1 active:shadow-none'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
          }`}
        >
          {status === 'correct' ? (
            <>
              <Check size={16} />
              <span>Ghép đúng rồi! 🎉</span>
            </>
          ) : (
            <span>Kiểm tra đáp án</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default HeroInteractiveWidget;
