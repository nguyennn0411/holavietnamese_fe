import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Keyboard, ArrowUp } from 'lucide-react';
import { audioFeedback } from '@/utils/audioFeedback';

interface DiacriticKeyboardBarProps {
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  onInsertChar: (char: string) => void;
  className?: string;
  compact?: boolean;
}

export const DiacriticKeyboardBar: React.FC<DiacriticKeyboardBarProps> = ({
  inputRef,
  onInsertChar,
  className = '',
  compact = false,
}) => {
  const [isUppercase, setIsUppercase] = useState(false);
  const [activeTab, setActiveTab] = useState<'TONES' | 'SPECIAL' | 'ALL'>('ALL');

  // Vietnamese diacritic characters
  const TONE_A_ROW = ['á', 'à', 'ả', 'ã', 'ạ'];
  const SPECIAL_VOWELS = ['ă', 'â', 'ê', 'ô', 'ơ', 'ư', 'đ'];
  const OTHER_TONED_VOWELS = ['é', 'è', 'ẻ', 'ẽ', 'ẹ', 'í', 'ì', 'ỉ', 'ĩ', 'ị', 'ó', 'ò', 'ỏ', 'õ', 'ọ', 'ú', 'ù', 'ủ', 'ũ', 'ụ', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'];

  // Quick core set (most critical for foreigners)
  const CORE_KEYS = [
    'á', 'à', 'ả', 'ã', 'ạ',
    'ă', 'â', 'ê', 'ô', 'ơ', 'ư', 'đ'
  ];

  const handleKeyClick = (char: string) => {
    const finalChar = isUppercase ? char.toUpperCase() : char.toLowerCase();
    audioFeedback.playPopSound(1.25);

    // If inputRef is supplied, insert directly at current cursor position
    if (inputRef && inputRef.current) {
      const el = inputRef.current;
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;
      const currentValue = el.value;

      const newValue = currentValue.substring(0, start) + finalChar + currentValue.substring(end);
      el.value = newValue;

      // Dispatch synthetic input event so React state syncs properly
      const event = new Event('input', { bubbles: true });
      el.dispatchEvent(event);

      // Restore focus and place cursor right after inserted character
      el.focus();
      const newCursorPos = start + finalChar.length;
      el.setSelectionRange(newCursorPos, newCursorPos);
    }

    onInsertChar(finalChar);
  };

  const currentKeySet = activeTab === 'TONES'
    ? TONE_A_ROW
    : activeTab === 'SPECIAL'
    ? SPECIAL_VOWELS
    : CORE_KEYS;

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-slate-50/95 backdrop-blur-sm p-2 shadow-sm select-none ${className}`}
    >
      <div className="flex items-center justify-between gap-2 px-1 mb-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
          <Keyboard className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bàn phím gõ dấu ảo • Diacritics</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Shift / Uppercase Toggle */}
          <button
            type="button"
            onClick={() => setIsUppercase(!isUppercase)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-0.5 transition-colors ${
              isUppercase
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
            title="Chữ hoa / Chữ thường (Shift)"
          >
            <ArrowUp className="w-3 h-3" />
            <span>Chữ hoa</span>
          </button>
        </div>
      </div>

      {/* Keys Row */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-white/80 rounded-xl border border-slate-200/60 shadow-inner">
        {currentKeySet.map((key) => {
          const displayKey = isUppercase ? key.toUpperCase() : key;

          return (
            <motion.button
              key={key}
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleKeyClick(key)}
              className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white border border-slate-200 shadow-[0_2px_0_#cbd5e1] hover:border-emerald-400 hover:shadow-[0_2px_0_#10b981] hover:bg-emerald-50 active:translate-y-0.5 active:shadow-none flex items-center justify-center font-bold text-sm md:text-base text-slate-800 cursor-pointer transition-all vn-diacritic-safe"
              aria-label={`Chèn ký tự ${displayKey}`}
            >
              {displayKey}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
