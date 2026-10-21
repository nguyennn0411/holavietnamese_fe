import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, Turtle, Headphones, HelpCircle, Check, X } from 'lucide-react';
import { DictationDataDTO } from '@/types/edtech';
import { DiacriticKeyboardBar } from '@/components/edtech/ui/DiacriticKeyboardBar';
import { audioFeedback } from '@/utils/audioFeedback';

interface DictationExerciseProps {
  data: DictationDataDTO;
  userInput: string;
  onInputChange: (val: string) => void;
  isChecked?: boolean;
  isCorrect?: boolean;
}

export const DictationExercise: React.FC<DictationExerciseProps> = ({
  data,
  userInput,
  onInputChange,
  isChecked = false,
  isCorrect = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPlayingNormal, setIsPlayingNormal] = useState(false);
  const [isPlayingSlow, setIsPlayingSlow] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handlePlayNormal = () => {
    setIsPlayingNormal(true);
    audioFeedback.speakVietnamese(data.audioPromptTextVi, 1.0);
    setTimeout(() => setIsPlayingNormal(false), 1200);
  };

  const handlePlaySlow = () => {
    setIsPlayingSlow(true);
    // Rate 0.55 for turtle slow pronunciation
    audioFeedback.speakVietnamese(data.audioPromptTextVi, 0.55);
    setTimeout(() => setIsPlayingSlow(false), 2000);
  };

  const handleInsertChar = (char: string) => {
    // Sync state
    if (inputRef.current) {
      onInputChange(inputRef.current.value);
    } else {
      onInputChange(userInput + char);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Exercise Eyebrow & Title */}
      <div className="w-full text-left mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Headphones className="w-3.5 h-3.5 text-emerald-600" />
          Luyện Nghe & Gõ Chính Tả • Dictation Drill
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-2">
          Nghe và gõ lại câu tiếng Việt bạn nghe được:
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Listen carefully and type what you hear in Vietnamese.
        </p>
      </div>

      {/* Dual Audio Controls Box */}
      <div className="w-full bg-white border-2 border-slate-200 rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-card-soft">
        <div className="flex items-center gap-4">
          {/* Normal Speed 1.0x Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayNormal}
            className={`!min-h-0 !min-w-0 !p-0 !border-0 w-16 h-16 rounded-3xl flex items-center justify-center font-bold text-white transition-all shadow-[0_4px_0_#047857] active:translate-y-1 active:shadow-none cursor-pointer audio-btn ${
              isPlayingNormal ? 'bg-emerald-500 ring-4 ring-emerald-200' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
            aria-label="Nghe ở tốc độ bình thường (1.0x)"
            title="Tốc độ bình thường (1.0x)"
          >
            <Volume2 className="w-8 h-8 shrink-0" strokeWidth={2.2} />
          </motion.button>

          {/* Slow Speed 0.6x (Turtle) Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlaySlow}
            className={`!min-h-0 !min-w-0 !p-0 !border-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-[0_3px_0_#0284c7] active:translate-y-0.5 active:shadow-none cursor-pointer audio-btn ${
              isPlayingSlow
                ? 'bg-sky-400 text-white ring-4 ring-sky-200'
                : 'bg-sky-500 hover:bg-sky-400 text-white'
            }`}
            aria-label="Nghe ở tốc độ chậm (0.6x - Con rùa)"
            title="Nghe phát âm chậm rãi (0.6x)"
          >
            <Turtle className="w-7 h-7 shrink-0" />
          </motion.button>

          <div className="text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Điều khiển âm thanh:
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                1.0x Chuẩn
              </span>
              <span className="text-sm font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200 flex items-center gap-1">
                <Turtle className="w-3.5 h-3.5" /> 0.6x Chậm
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Bấm biểu tượng rùa nếu bạn cần nghe rõ từng dấu thanh.
            </p>
          </div>
        </div>

        {/* Translation Hint Toggle */}
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>{showHint ? 'Ẩn nghĩa gợi ý' : 'Gợi ý nghĩa tiếng Anh'}</span>
        </button>
      </div>

      {/* Translation Hint Box */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-4 bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-center justify-between"
        >
          <span>
            <HelpCircle size={13} className="inline mr-1 text-amber-600" /><strong>Gợi ý:</strong> "{data.translationEn}" ({data.wordCount} từ)
          </span>
          {data.hint && <span className="text-amber-700 italic">{data.hint}</span>}
        </motion.div>
      )}

      {/* Main Input Text Box */}
      <div className="w-full mb-3">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={isChecked}
            placeholder="Gõ câu bạn nghe được tại đây..."
            className={`w-full text-lg md:text-xl font-bold px-5 py-4 rounded-3xl bg-white border-2 text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:ring-4 focus:ring-emerald-100 shadow-sm transition-all vn-diacritic-safe ${
              isChecked
                ? isCorrect
                  ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900'
                  : 'border-rose-400 bg-rose-50/40 text-rose-900'
                : 'border-slate-300 focus:border-emerald-500'
            }`}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />

          {isChecked && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isCorrect ? (
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center">
                  <X className="w-5 h-5 stroke-[3]" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Virtual Diacritic Keyboard Assistant (No Unikey needed!) */}
      {!isChecked && (
        <div className="w-full">
          <DiacriticKeyboardBar
            inputRef={inputRef}
            onInsertChar={handleInsertChar}
          />
        </div>
      )}

      {/* Notes for Foreigners */}
      {data.notesForForeigners && !isChecked && (
        <p className="w-full text-left text-xs text-slate-400 mt-3 italic">
          📌 {data.notesForForeigners}
        </p>
      )}
    </div>
  );
};
