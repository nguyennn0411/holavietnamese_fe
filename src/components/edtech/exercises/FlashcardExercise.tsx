import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, RotateCcw } from 'lucide-react';
import { FlashcardDataDTO } from '@/types/edtech';
import { VIETNAMESE_TONES, TONE_COLOR_MAP } from '@/constants/vietnameseTones';
import { audioFeedback } from '@/utils/audioFeedback';

interface FlashcardExerciseProps {
  data: FlashcardDataDTO;
  onFlipped?: (isFlipped: boolean) => void;
}

export const FlashcardExercise: React.FC<FlashcardExerciseProps> = ({
  data,
  onFlipped,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const toneInfo = VIETNAMESE_TONES[data.tone] || VIETNAMESE_TONES.NGANG;
  const toneColors = TONE_COLOR_MAP[data.tone] || TONE_COLOR_MAP.NGANG;

  const handleFlip = () => {
    const next = !isFlipped;
    setIsFlipped(next);
    audioFeedback.playFlipSound();
    onFlipped?.(next);
  };

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioFeedback.speakVietnamese(data.vietnameseWord);
    audioFeedback.playPopSound(1.2);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <div className="text-center mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
          Thẻ Từ Vựng Mới • Flashcard
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-2">
          Chạm vào thẻ để lật xem nghĩa
        </h2>
        <p className="text-sm text-slate-500">
          Tap card to flip • Press Spacebar or click
        </p>
      </div>

      {/* 3D Flip Card Container */}
      <div
        className="w-full h-80 md:h-96 cursor-pointer select-none [perspective:1200px]"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleFlip();
          }
        }}
        aria-label={`Thẻ từ vựng ${data.vietnameseWord}. Nhấn phím cách hoặc click để lật.`}
      >
        <motion.div
          className="relative w-full h-full rounded-3xl [transform-style:preserve-3d] shadow-card-hover transition-shadow"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.55, type: 'spring', stiffness: 120, damping: 18 }}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-white border-2 border-slate-200/90 p-8 flex flex-col justify-between items-center text-center [backface-visibility:hidden]">
            {/* Tone pill & Part of speech */}
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 uppercase tracking-wider">
                {data.partOfSpeech}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${toneColors.bg} ${toneColors.text} ${toneColors.border}`}
              >
                {toneInfo.nameVi} ({toneInfo.symbol})
              </span>
            </div>

            {/* Central Word with Large Clean Vietnamese Diacritics */}
            <div className="my-auto flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight vn-diacritic-safe">
                {data.vietnameseWord}
              </span>

              {/* IPA Phonetic guide */}
              <span className="mt-3 text-lg font-mono text-emerald-700 bg-emerald-50/80 px-3.5 py-1 rounded-xl border border-emerald-200/60 font-medium">
                {data.ipa}
              </span>

              {/* Audio pronounce button */}
              <button
                type="button"
                onClick={handlePronounce}
                className="!min-h-0 !border-0 mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-[0_3px_0_#047857] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                aria-label="Phát âm từ này"
              >
                <Volume2 className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                <span>Nghe phát âm chuẩn</span>
              </button>
            </div>

            {/* Hint to flip */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chạm để lật xem nghĩa & ví dụ</span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#FFFDF9] to-[#FFF7E8] text-[#253044] border-2 border-[#E8E5DF] p-8 flex flex-col justify-between items-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-md">
            {/* Header */}
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">
                English Meaning
              </span>
              <span className="text-xs text-slate-400">
                {data.vietnameseWord}
              </span>
            </div>

            {/* English Meaning & Examples */}
            <div className="my-auto flex flex-col items-center max-w-md">
              <h3 className="text-3xl md:text-4xl font-extrabold text-[#253044] mb-2">
                {data.englishMeaning}
              </h3>

              {data.notesForForeigners && (
                <p className="text-xs text-[#7C2D12] bg-[#FFF0DC] border border-[#fed7aa] rounded-xl px-3 py-1.5 mb-4">
                  <span className="font-bold mr-1">Gợi ý:</span>{data.notesForForeigners}
                </p>
              )}

              {/* Context Example */}
              <div className="bg-white rounded-2xl p-3.5 text-left border border-[#E8E5DF] shadow-2xs w-full mt-2">
                <p className="text-sm font-bold text-[#253044] vn-diacritic-safe">
                  "{data.exampleSentenceVi}"
                </p>
                <p className="text-xs text-[#64748B] italic mt-1">
                  "{data.exampleSentenceEn}"
                </p>
              </div>
            </div>

            {/* Flip back instruction */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chạm để quay lại mặt trước</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
