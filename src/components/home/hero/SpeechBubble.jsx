import React from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { audioFeedback } from '@/utils/audioFeedback';

const speakVietnamese = (text, rate = 0.9) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }
};

/**
 * SpeechBubble - 3D glassmorphism conversation card with real audio pronunciation
 */
export function SpeechBubble({
  textVi,
  textEn,
  ipa,
  avatarEmoji = '👋',
  avatarBg = 'bg-[#FFCD00]',
  position = 'top-4 left-4',
  delay = 0.3,
  className = '',
}) {
  const handlePlayAudio = (e) => {
    e.stopPropagation();
    audioFeedback.playPopSound(1.2);
    speakVietnamese(textVi);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, y: 12 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -6, 0],
      }}
      transition={{
        opacity: { duration: 0.45, delay },
        scale: { duration: 0.45, delay },
        y: {
          duration: 4.5,
          delay: delay + 0.2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      whileHover={{ scale: 1.05, y: -4 }}
      className={`absolute ${position} z-25 max-w-[260px] sm:max-w-[300px] p-3 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-[0_16px_36px_rgba(67,25,20,0.12),0_2px_6px_rgba(67,25,20,0.06)] text-left flex items-start gap-3 select-none pointer-events-auto transition-all ${className}`}
    >
      {/* 3D Avatar Pill */}
      <span
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${avatarBg} text-lg flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_4px_10px_rgba(0,0,0,0.1)]`}
      >
        {avatarEmoji}
      </span>

      {/* Bubble Content */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs sm:text-sm font-black text-[#202124] leading-snug truncate">
            {textVi}
          </p>
          <button
            type="button"
            onClick={handlePlayAudio}
            className="!min-h-0 !min-w-0 !p-0 w-6 h-6 rounded-lg bg-[#FFF9ED] hover:bg-[#DA251D] text-[#DA251D] hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-2xs cursor-pointer group/audio"
            title={`Phát âm: "${textVi}"`}
            aria-label={`Phát âm ${textVi}`}
          >
            <Volume2 className="w-3.5 h-3.5 group-hover/audio:scale-110 transition-transform" />
          </button>
        </div>

        <p className="text-[10px] sm:text-[11px] font-semibold text-[#78685B] leading-tight mt-0.5">
          {textEn}
        </p>
        {ipa && (
          <span className="block text-[9px] font-mono text-stone-400 mt-0.5">
            {ipa}
          </span>
        )}
      </div>
    </motion.div>
  );
}
