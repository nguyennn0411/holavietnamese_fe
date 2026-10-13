import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles } from 'lucide-react';
import { FloatingLetters } from './FloatingLetters';
import { SpeechBubble } from './SpeechBubble';
import { Culture3DElements } from './Culture3DElements';
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
 * HeroStageVisual - Right column (55%) featuring interactive 3D Pixar/Duolingo-style
 * stage with animated transitions, floating letters, conversation bubbles, and cultural badges.
 */
export function HeroStageVisual({ slideIndex = 0 }) {
  const [speechRate, setSpeechRate] = useState(0.9);

  // Configuration for 5 slides
  const slideStages = [
    // Slide 1 - Welcome to Vietnam
    {
      imgSrc: '/design/hero/slide1_welcome.jpg',
      alt: 'Gia sư tiếng Việt và học viên nước ngoài cùng mascot Lạc vàng 3D',
      badge: 'Chào Mừng Đến Với Việt Nam 🇻🇳',
      bubble1: {
        textVi: 'Xin chào bạn! 👋',
        textEn: 'Hello there! Welcome to Vietnam.',
        ipa: '/sin˧˧ caːw˨˩ ɓan˧˨/',
        avatarEmoji: '👋',
        avatarBg: 'bg-[#FFCD00]',
        position: 'top-3 -right-2 sm:-right-8',
        delay: 0.2,
      },
      bubble2: {
        textVi: 'Rất vui được gặp bạn! ✨',
        textEn: 'Nice to meet you!',
        ipa: '/zət˧˥ vwi˧˧ dɨək˧˨ ɣap˧˨ ɓan˧˨/',
        avatarEmoji: '✨',
        avatarBg: 'bg-[#DA251D] text-white',
        position: 'bottom-16 sm:bottom-20 -left-1 sm:-left-8',
        delay: 0.45,
      },
      samplePhrase: 'Xin chào! Rất vui được gặp bạn.',
    },
    // Slide 2 - Speak with Confidence
    {
      imgSrc: '/design/hero/slide2_speaking.jpg',
      alt: 'Học viên luyện phát âm tiếng Việt qua micro phòng thu và tai nghe 3D',
      badge: 'Luyện Phát Âm Chuẩn Người Bản Xứ 🎙️',
      bubble1: {
        textVi: 'Bạn khỏe không? 😊',
        textEn: 'How are you doing today?',
        ipa: '/ɓan˧˨ xwɛ˧˩˨ xowŋ͡m˧˧/',
        avatarEmoji: '😊',
        avatarBg: 'bg-[#FFCD00]',
        position: 'top-3 -right-2 sm:-right-8',
        delay: 0.2,
      },
      bubble2: {
        textVi: 'Tôi khỏe, cảm ơn bạn! 🎙️',
        textEn: 'I am doing great, thank you!',
        ipa: '/toj˧˧ xwɛ˧˩˨ kaːm˧˩˨ ʔəːn˧˧ ɓan˧˨/',
        avatarEmoji: '🎙️',
        avatarBg: 'bg-[#059669] text-white',
        position: 'bottom-16 sm:bottom-20 -left-1 sm:-left-8',
        delay: 0.45,
      },
      samplePhrase: 'Bạn khỏe không? Tôi khỏe, cảm ơn bạn!',
    },
    // Slide 3 - Discover Vietnamese Culture
    {
      imgSrc: '/design/hero/slide3_culture.jpg',
      alt: 'Mâm phở bò, bánh mì, cà phê phin và đèn lồng Hội An 3D truyền thống',
      badge: 'Ẩm Thực & Đời Sống Văn Hóa Việt 🍜',
      bubble1: {
        textVi: 'Cho tôi một bát phở tái! 🍜',
        textEn: 'A bowl of rare beef pho please!',
        ipa: '/cɔ˧˧ toj˧˧ mot˧˨ ɓaːt˧˥ fəː˧˩˨ taːj˧˥/',
        avatarEmoji: '🍜',
        avatarBg: 'bg-[#FFCD00]',
        position: 'top-3 -right-2 sm:-right-8',
        delay: 0.2,
      },
      bubble2: {
        textVi: 'Cà phê sữa đá ít đường nha! ☕',
        textEn: 'Iced milk coffee with less sugar!',
        ipa: '/kaː˨˩ fe˧˧ sɨə˦ˀ˥ daː˧˥/',
        avatarEmoji: '☕',
        avatarBg: 'bg-[#B45309] text-white',
        position: 'bottom-16 sm:bottom-20 -left-1 sm:-left-8',
        delay: 0.45,
      },
      samplePhrase: 'Cho tôi một ly cà phê sữa đá ít đường nhé!',
    },
    // Slide 4 - Learning Journey
    {
      imgSrc: '/design/hero/slide4_journey.jpg',
      alt: 'Đảo học tập gamified 3D với lộ trình A1 đến B2, rương báu và cúp vô địch',
      badge: 'Lộ Trình EdTech Chuẩn Quốc Tế CEFR 🏆',
      bubble1: {
        textVi: 'Hoàn thành Chặng A1! 🏆',
        textEn: 'Level A1 Milestone Unlocked!',
        ipa: '/hwaːn˨˩ tʰan˨˩ caŋ˧˨/',
        avatarEmoji: '🏆',
        avatarBg: 'bg-[#FFCD00]',
        position: 'top-3 -right-2 sm:-right-8',
        delay: 0.2,
      },
      bubble2: {
        textVi: '+50 XP Chuỗi 7 Ngày! 🔥',
        textEn: '+50 XP Streak Reward Claimed!',
        ipa: '/cuəj˦ˀ˥ baj˧˩˨ ŋaj˨˩/',
        avatarEmoji: '🔥',
        avatarBg: 'bg-[#EA580C] text-white',
        position: 'bottom-16 sm:bottom-20 -left-1 sm:-left-8',
        delay: 0.45,
      },
      samplePhrase: 'Chúc mừng bạn đã hoàn thành bài học hôm nay!',
    },
    // Slide 5 - AI Conversation Practice
    {
      imgSrc: '/design/hero/slide5_aitutor.jpg',
      alt: 'Robot gia sư AI 3D đội nón lá cầm micro hỗ trợ học tiếng Việt 24/7',
      badge: 'Gia Sư AI Đàm Thoại Thông Minh 24/7 🤖',
      bubble1: {
        textVi: 'Chào bạn! Muốn nói gì nào? 🤖',
        textEn: 'Hello! What scenario shall we practice?',
        ipa: '/caːw˨˩ ɓan˧˨/',
        avatarEmoji: '🤖',
        avatarBg: 'bg-[#FFCD00]',
        position: 'top-3 -right-2 sm:-right-8',
        delay: 0.2,
      },
      bubble2: {
        textVi: 'Phát âm chuẩn 98%! Giỏi lắm! 🌟',
        textEn: 'Tonal accuracy 98%! Great job!',
        ipa: '/faːt˧˥ ʔam˧˧ cuən˧˩˨/',
        avatarEmoji: '🌟',
        avatarBg: 'bg-[#7C3AED] text-white',
        position: 'bottom-16 sm:bottom-20 -left-1 sm:-left-8',
        delay: 0.45,
      },
      samplePhrase: 'Dạ chào bạn, hôm nay bạn muốn đi đâu để tôi hỗ trợ nhé?',
    },
  ];

  const current = slideStages[slideIndex] || slideStages[0];

  const handleSpeakSample = () => {
    audioFeedback.playTap();
    speakVietnamese(current.samplePhrase, speechRate);
  };

  return (
    <div className="relative w-full max-w-[540px] lg:max-w-[580px] mx-auto select-none">
      {/* 1. Ambient Background Glow & Radial Light */}
      <div className="pointer-events-none absolute -inset-6 bg-gradient-to-tr from-[#DA251D]/15 via-[#FFCD00]/20 to-[#FFF9ED]/60 rounded-[3rem] blur-2xl -z-10" />

      {/* 2. Floating 3D Diacritic Letters (Ă, Â, Ê, Ô, Ơ, Ư, Đ) */}
      <FloatingLetters className="z-30" />

      {/* 3. Cultural Context Badges */}
      <Culture3DElements slideIndex={slideIndex} />

      {/* 4. Conversation Speech Bubbles */}
      <AnimatePresence mode="wait">
        <div key={`bubbles-wrapper-${slideIndex}`}>
          <SpeechBubble
            textVi={current.bubble1.textVi}
            textEn={current.bubble1.textEn}
            ipa={current.bubble1.ipa}
            avatarEmoji={current.bubble1.avatarEmoji}
            avatarBg={current.bubble1.avatarBg}
            position={current.bubble1.position}
            delay={current.bubble1.delay}
          />
          <SpeechBubble
            textVi={current.bubble2.textVi}
            textEn={current.bubble2.textEn}
            ipa={current.bubble2.ipa}
            avatarEmoji={current.bubble2.avatarEmoji}
            avatarBg={current.bubble2.avatarBg}
            position={current.bubble2.position}
            delay={current.bubble2.delay}
          />
        </div>
      </AnimatePresence>

      {/* 5. Main 3D Card Container */}
      <div className="relative w-full aspect-square rounded-3xl sm:rounded-[2.5rem] bg-white/90 backdrop-blur-md p-3 sm:p-4 border-2 border-white shadow-[0_25px_60px_-15px_rgba(218,37,29,0.18),0_12px_28px_rgba(67,25,20,0.06)] overflow-hidden">
        {/* Top Header Pill */}
        <div className="absolute top-5 left-5 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 text-[#DA251D] text-[10px] sm:text-xs font-black shadow-xs">
            <Sparkles size={12} className="text-[#DA251D]" />
            <span>{current.badge}</span>
          </span>
        </div>

        {/* Animated 3D Artwork with Ken Burns effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`slide-img-${slideIndex}`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{
              opacity: 1,
              scale: [1, 1.025, 1],
            }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="w-full h-full rounded-2xl sm:rounded-[2rem] overflow-hidden relative shadow-inner"
          >
            <img
              src={current.imgSrc}
              alt={current.alt}
              className="w-full h-full object-cover object-center transform-gpu"
              loading={slideIndex === 0 ? 'eager' : 'lazy'}
            />

            {/* Subtle Gradient Inset Vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />
          </motion.div>
        </AnimatePresence>

        {/* Bottom Interactive Trial Audio Strip */}
        <div className="absolute bottom-5 inset-x-5 z-20 flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={handleSpeakSample}
              className="!min-h-0 !min-w-0 !p-0 w-9 h-9 rounded-xl bg-[#DA251D] hover:bg-[#89221E] text-white flex items-center justify-center transition-all shadow-2xs shrink-0 cursor-pointer group/audio"
              title="Bấm để nghe phát âm mẫu"
              aria-label="Phát âm câu tiếng Việt mẫu"
            >
              <Volume2 className="w-4 h-4 group-hover/audio:scale-110 transition-transform" />
            </button>
            <div className="min-w-0 text-left">
              <span className="block text-[10px] font-black uppercase text-[#DA251D] tracking-wider leading-none">
                Nghe câu mẫu
              </span>
              <p className="text-xs font-bold text-[#202124] truncate mt-0.5">
                {current.samplePhrase}
              </p>
            </div>
          </div>

          {/* Speed Toggle: 1.0x or 0.6x 🐢 */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                const newRate = speechRate === 0.9 ? 0.6 : 0.9;
                setSpeechRate(newRate);
                audioFeedback.playTap();
                speakVietnamese(current.samplePhrase, newRate);
              }}
              className="!min-h-0 !min-w-0 px-2 py-1 rounded-lg bg-[#FFF9ED] border border-[#DECBB4] text-[#DA251D] text-[10px] font-bold hover:bg-[#DA251D] hover:text-white transition-colors cursor-pointer"
              title="Đổi tốc độ phát âm (Bình thường / Chậm)"
            >
              {speechRate === 0.9 ? '1.0x' : '🐢 0.6x'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
