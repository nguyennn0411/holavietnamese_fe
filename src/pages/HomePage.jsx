import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Compass,
  Flame,
  Zap,
  Heart,
  Trophy,
  CheckCircle2,
  Volume2,
  Play,
  Languages,
  MessageCircle,
  Star,
  Award,
  Check,
  RotateCcw,
  Calendar,
  ChevronRight,
  MapPin,
  Gift,
  Keyboard,
  Coffee,
  ShoppingBag,
  Car,
  Shield,
  Clock,
  Crown,
  TrendingUp,
  Target,
  Sparkle,
  Send,
  Delete,
  CheckCircle,
} from 'lucide-react';
import { BilingualText } from '@/components/common/BilingualText';
import { useAuth } from '@/application/context/AuthContext';
import { learnerService } from '@/services/learnerService';
import { useCourses } from '@/hooks/useCourses';
import { EmptyState } from '@/components/common/Ui';
import { audioFeedback } from '@/utils/audioFeedback';
import { ToneCurveGraph } from '@/components/edtech/ui/ToneCurveGraph';
import { VIETNAMESE_TONES } from '@/constants/vietnameseTones';
import { HeroBannerSlider, AnimatedMarquee } from '@/components/home/hero';

// Speak utility for native Vietnamese speech synthesis
const speakVietnamese = (text, rate = 0.9) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }
};

/* ==========================================================================
   PART 1: HERO TACTILE MINI-LESSON WIDGET (Juicy 3D EdTech UI)
   ========================================================================== */
function HeroInteractiveWidget() {
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

/* ==========================================================================
   PART 2: BENTO GRID SHOWCASE (Tones, AI, Diacritics, Street Situations)
   ========================================================================== */
function BentoGridSection() {
  const [activeTone, setActiveTone] = useState('HOI');
  const [typedText, setTypedText] = useState('Phở bò');
  const [aiMessageIndex, setAiMessageIndex] = useState(0);
  const [activeSituationIndex, setActiveSituationIndex] = useState(0);

  const toneList = [
    { id: 'NGANG', name: 'Ngang', symbol: '—', word: 'Ma', mean: 'Ghost' },
    { id: 'HUYEN', name: 'Huyền', symbol: '`', word: 'Mà', mean: 'But/Which' },
    { id: 'SAC', name: 'Sắc', symbol: '´', word: 'Má', mean: 'Cheek/Mom' },
    { id: 'HOI', name: 'Hỏi', symbol: '?', word: 'Mả', mean: 'Tomb' },
    { id: 'NGA', name: 'Ngã', symbol: '~', word: 'Mã', mean: 'Horse/Code' },
    { id: 'NANG', name: 'Nặng', symbol: '.', word: 'Mạ', mean: 'Rice plant' },
  ];

  const handlePlayTone = (tId) => {
    setActiveTone(tId);
    audioFeedback.playVietnameseTone(tId);
    const item = toneList.find((x) => x.id === tId);
    if (item) speakVietnamese(item.word);
  };

  const aiPrompts = [
    {
      ai: '“Chào Mark! Hôm nay bạn muốn ăn phở bò tái hay phở gà ở phố cổ?”',
      user: 'Cho tôi một bát phở bò tái',
      tip: 'AI phản hồi: “Ngon lắm! Bạn nhớ thêm một chút giấm tỏi và ớt nhé!”',
    },
    {
      ai: '“Em chào anh, anh đi đâu để em gọi Grab giúp anh nhé?”',
      user: 'Bác tài cho tôi đến Hồ Gươm',
      tip: 'AI phản hồi: “Dạ được, xe 4 chỗ đang tới đón anh sau 3 phút.”',
    },
    {
      ai: '“Cái nón lá này là đồ thủ công Huế, anh có muốn thử không?”',
      user: 'Cái này bao nhiêu tiền một cái?',
      tip: 'AI phản hồi: “Dạ 80 nghìn một cái, mua hai cái em bớt 10 nghìn nha.”',
    },
  ];

  const diacriticChars = ['á', 'à', 'ả', 'ã', 'ạ', 'ă', 'â', 'ê', 'ô', 'ơ', 'ư', 'đ'];

  const situations = [
    {
      icon: Coffee,
      title: 'Phở & Cà Phê',
      situation: 'Quán vỉa hè Hà Nội / Sài Gòn',
      phraseVi: 'Cho tôi một ly cà phê sữa đá ít đường nhé.',
      phraseEn: 'One iced milk coffee with less sugar please.',
      ipa: '/kaː˨˩ fe˧˧ sɨə˦ˀ˥ daː˧˥/',
    },
    {
      icon: ShoppingBag,
      title: 'Chợ Bến Thành',
      situation: 'Mặc cả & hỏi giá thân thiện',
      phraseVi: 'Cái này bao nhiêu tiền một cái hả cô?',
      phraseEn: 'How much is this one, ma’am?',
      ipa: '/ɓaːw˧˧ ɲiəw˧˧ tiəŋ˨˩/',
    },
    {
      icon: Car,
      title: 'Grab / Taxi',
      situation: 'Chỉ đường & xác nhận địa điểm',
      phraseVi: 'Bác tài cho tôi đến Hồ Gươm, đi đường ven hồ nhé.',
      phraseEn: 'Driver, take me to Hoan Kiem lake via the lakeside road.',
      ipa: '/ho˨˩ ɣɨəm˧˧/',
    },
    {
      icon: MessageCircle,
      title: 'Giao Lưu Bạn Bè',
      situation: 'Làm quen & chào hỏi lịch sự',
      phraseVi: 'Rất vui được làm quen với bạn! Bạn tên là gì?',
      phraseEn: 'Very nice to meet you! What is your name?',
      ipa: '/zət˧˥ vwi˧˧ ləm˨˩ kwɛn˧˧/',
    },
  ];

  const currentSituation = situations[activeSituationIndex];

  return (
    <section className="bento-showcase space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5E1D8] border border-[#E7B59D] text-[#A62A24] text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} />
          <span>Tính năng EdTech thế hệ mới • Modern Innovations</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#431914] tracking-tight">
          Học như chơi game. Tiến bộ qua từng ngày.
        </h2>
        <p className="text-sm text-[#78685B] leading-relaxed">
          Giải quyết triệt để 3 thách thức lớn nhất của người nước ngoài: phân biệt 6 thanh điệu, gõ dấu tiếng Việt và ngữ điệu giao tiếp đời thường.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Bento 1: Tone Pitch Curves Visualizer */}
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
            {toneList.map((t) => {
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
                  <span className="text-lg font-black text-[#431914]">
                    {t.word}
                  </span>
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
                const item = toneList.find((x) => x.id === activeTone);
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
            <Link to="/edtech/vocabulary" className="text-[#A62A24] font-bold hover:underline flex items-center gap-1 shrink-0">
              Mở kho so sánh thanh điệu →
            </Link>
          </div>
        </motion.div>

        {/* Bento 2: AI Voice Wave Tutor */}
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
                  {aiPrompts[aiMessageIndex].ai}
                </p>
                <p className="text-[10px] text-[#E1B65B] italic">
                  {aiPrompts[aiMessageIndex].tip}
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
                  speakVietnamese(aiPrompts[aiMessageIndex].ai);
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
              {aiPrompts.map((p, idx) => (
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

        {/* Bento 3: Virtual Diacritic Keyboard Notepad */}
        <motion.div
          whileHover={{ y: -3 }}
          className="w-full bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(67,25,20,0.04)] flex flex-col justify-between space-y-4 text-left"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard size={18} className="text-[#A62A24]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#A62A24]">
                  Trợ lý gõ dấu ảo
                </span>
              </div>
              <span className="text-[10px] font-semibold text-[#78685B]">Không cần Unikey</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#431914]">
              Bàn phím gõ dấu 1-chạm tương tác
            </h3>
            <p className="text-xs text-[#78685B]">
              Bấm phím để chèn dấu tiếng Việt và phát âm ngay lập tức:
            </p>
          </div>

          {/* Interactive Notepad Display */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#DECBB4] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold uppercase text-[#78685B]">Khung gõ thử:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTypedText((prev) => prev.slice(0, -1));
                    audioFeedback.playTap();
                  }}
                  className="text-[11px] text-[#78685B] hover:text-[#A62A24] font-bold flex items-center gap-0.5"
                  title="Xóa ký tự cuối"
                >
                  <Delete size={12} />
                  <span>Xóa</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTypedText('');
                    audioFeedback.playTap();
                  }}
                  className="text-[11px] text-[#78685B] hover:text-[#A62A24] font-bold"
                >
                  Làm trống
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-[#DECBB4]/60">
              <span className="font-black text-[#431914] text-base truncate">
                {typedText || <span className="text-stone-300 font-normal italic">Bấm phím bên dưới…</span>}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (typedText) speakVietnamese(typedText);
                }}
                disabled={!typedText}
                className="!min-h-0 !min-w-0 !p-0 w-8 h-8 rounded-lg bg-[#F5E1D8] hover:bg-[#A62A24] text-[#A62A24] hover:text-white flex items-center justify-center transition-colors shrink-0 disabled:opacity-40 cursor-pointer"
                title="Phát âm từ vừa gõ"
                aria-label="Phát âm từ vừa gõ"
              >
                <Volume2 className="w-4 h-4 shrink-0" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* Mechanical Keyboard Keycaps */}
          <div className="grid grid-cols-6 gap-1.5">
            {diacriticChars.map((char) => (
              <button
                key={char}
                type="button"
                onClick={() => {
                  setTypedText((prev) => prev + char);
                  speakVietnamese(char);
                  audioFeedback.playTap();
                }}
                className="py-2 rounded-xl bg-white border border-[#DECBB4] hover:border-[#A62A24] font-black text-sm text-[#431914] hover:text-[#A62A24] shadow-[0_2px_0_#DECBB4] hover:shadow-[0_2px_0_#A62A24] active:translate-y-0.5 active:shadow-none transition-all"
              >
                {char}
              </button>
            ))}
          </div>

          {/* Preset Words */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
            <span className="text-[10px] text-[#78685B] font-bold shrink-0">Từ mẫu:</span>
            {['Phở', 'Cà phê', 'Cảm ơn', 'Việt Nam'].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => {
                  setTypedText(w);
                  speakVietnamese(w);
                  audioFeedback.playTap();
                }}
                className="px-2.5 py-0.5 rounded-lg bg-[#FFF9EE] hover:bg-[#F5E1D8] border border-[#DECBB4]/80 text-[#431914] text-[11px] font-bold shrink-0 transition-colors"
              >
                {w}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bento 4: Street Situations */}
        <motion.div
          whileHover={{ y: -3 }}
          className="w-full bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(67,25,20,0.04)] flex flex-col justify-between space-y-5 text-left"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#F5E1D8] text-[#A62A24] text-xs font-bold uppercase tracking-wider">
                Tình huống thực tế • Situational Drills
              </span>
              <span className="text-[11px] font-semibold text-[#78685B]">50+ Kịch bản</span>
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
            {situations.map((item, idx) => {
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
                  className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                    isSelected
                      ? 'bg-[#FFF9EE] border-2 border-[#A62A24] shadow-xs'
                      : 'bg-[#FAF8F5] border-[#DECBB4]/70 hover:border-[#A62A24]'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#A62A24] text-white' : 'bg-[#F5E1D8] text-[#A62A24]'}`}>
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
      </div>
    </section>
  );
}

/* ==========================================================================
   PART 3: GAMIFIED ROADMAP (Winding Zigzag Adventure Path)
   ========================================================================== */
function GamifiedRoadmapTeaser() {
  const nodes = [
    { id: '1', level: 'A0', title: 'Làm quen 6 Thanh điệu & Bảng chữ cái', status: 'completed', stars: 3, xp: 50 },
    { id: '2', level: 'A1', title: 'Chào hỏi & Gọi món đường phố', status: 'completed', stars: 3, xp: 75 },
    { id: '3', level: 'A1+', title: 'Đi chợ & Hỏi giá tiền Việt', status: 'current', stars: 1, xp: 100 },
    { id: '4', level: 'A2', title: 'Giao lưu bạn bè & Đồng nghiệp', status: 'locked', stars: 0, xp: 120 },
    { id: '5', level: 'B1', title: 'Khám phá văn hóa & Đời sống Việt', status: 'locked', stars: 0, xp: 150 },
  ];

  return (
    <section className="roadmap-teaser py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="eyebrow text-xs font-bold uppercase tracking-wider text-[#A62A24]">
          Lộ trình phiêu lưu • Learning Adventure
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-[#431914] tracking-tight">
          Từng chặng rõ ràng, học 5 phút mỗi ngày
        </h2>
        <p className="text-sm text-[#78685B]">
          Mỗi bài học được chia nhỏ theo chặng. Mở khóa huy hiệu, tích lũy XP và làm chủ tiếng Việt theo chuẩn CEFR.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 sm:p-10 shadow-[0_10px_35px_-5px_rgba(67,25,20,0.05)] relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              whileHover={{ scale: 1.012 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                node.status === 'completed'
                  ? 'bg-white border-emerald-300 shadow-2xs'
                  : node.status === 'current'
                  ? 'bg-[#FFF9EE] border-2 border-[#A62A24] shadow-md ring-4 ring-[#A62A24]/10'
                  : 'bg-[#FAF8F5] border-[#DECBB4]/50 opacity-60'
              }`}
            >
              {/* Node Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                  node.status === 'completed'
                    ? 'bg-emerald-700 text-white'
                    : node.status === 'current'
                    ? 'bg-[#A62A24] text-white shadow-[0_4px_0_#89221E]'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {node.status === 'completed' ? (
                  <Check size={20} strokeWidth={3} />
                ) : node.status === 'current' ? (
                  <Play size={18} fill="currentColor" />
                ) : (
                  <span>🔒</span>
                )}
              </div>

              {/* Title & Level */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#24382B] text-white">
                    {node.level}
                  </span>
                  {node.status === 'current' && (
                    <span className="text-[10px] font-bold text-[#A62A24] uppercase tracking-wider">
                      Đang ở chặng này
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#431914] truncate mt-0.5">
                  {node.title}
                </h3>
              </div>

              {/* Stars & Reward */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      size={14}
                      className={
                        starIdx <= node.stars
                          ? 'text-amber-500 fill-amber-400'
                          : 'text-stone-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-[#A62A24] bg-[#F5E1D8] px-2 py-0.5 rounded-md hidden sm:inline-block">
                  +{node.xp} XP
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-8 text-center">
          <Link
            to="/edtech/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#A62A24] hover:bg-[#89221E] text-white font-black text-xs shadow-[0_4px_0_#89221E] active:translate-y-1 active:shadow-none transition-all"
          >
            <Compass size={16} />
            <span>Mở Lộ Trình Học EdTech Toàn Diện →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   PART 4: EXPAT TESTIMONIALS (Real Travelers & Foreigners in VN)
   ========================================================================== */
function ExpatTestimonials() {
  const testimonials = [
    {
      name: 'Mark Richardson',
      role: 'Kỹ sư phần mềm • Sống tại Đà Nẵng',
      code: 'US',
      quote:
        'Biểu đồ cao độ âm thanh là đột phá lớn nhất. Sau 2 tuần, tôi đã phân biệt rõ ràng dấu Hỏi (?) và dấu Ngã (~), không còn bị người bán hàng nghe nhầm nữa!',
      favPhrase: '“Cho tôi tính tiền nhé em ơi!”',
    },
    {
      name: 'Sophie Laurent',
      role: 'Giám đốc sáng tạo • Sống tại Hà Nội',
      code: 'FR',
      quote:
        'AI Tutor tạo cảm giác trò chuyện vô cùng tự nhiên. Tôi có thể thực hành nói trước khi ra chợ hoa quả mà không sợ bị ngại ngùng.',
      favPhrase: '“Bao nhiêu một cân thanh long ạ?”',
    },
    {
      name: 'Kenji Takahashi',
      role: 'Cố vấn kinh doanh • Sống tại TP.HCM',
      code: 'JP',
      quote:
        'Bàn phím ảo một chạm rất tuyệt vời. Tôi không cần phải cài Unikey hay học bảng mã Telex phức tạp mà vẫn gõ đúng dấu tiếng Việt chính xác.',
      favPhrase: '“Cà phê sữa đá ít đường nhé!”',
    },
  ];

  return (
    <section className="testimonials-section space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="eyebrow text-xs font-bold uppercase tracking-wider text-[#A62A24]">
          Cảm nhận từ học viên • Expat Community
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-[#431914] tracking-tight">
          Được tin dùng bởi hơn 15,000+ người nước ngoài tại Việt Nam
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {testimonials.map((t, idx) => (
          <motion.div
            whileHover={{ y: -4 }}
            key={idx}
            className="bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 shadow-[0_8px_30px_rgb(67,25,20,0.04)] flex flex-col justify-between space-y-4 text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#431914] leading-relaxed italic">
                “{t.quote}”
              </p>
            </div>

            <div className="pt-4 border-t border-[#DECBB4]/40 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#431914] flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#F5E1D8] text-[#A62A24] border border-[#DECBB4]/70">
                    {t.code}
                  </span>
                  <span>{t.name}</span>
                </h4>
                <p className="text-[10px] text-[#78685B]">{t.role}</p>
              </div>
              <button
                type="button"
                onClick={() => speakVietnamese(t.favPhrase.replace(/["“”]/g, ''))}
                className="!min-h-0 !min-w-0 text-[11px] font-bold text-[#A62A24] bg-[#F5E1D8] hover:bg-[#A62A24] hover:text-white px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                title="Nghe câu yêu thích"
                aria-label={`Nghe câu yêu thích: ${t.favPhrase}`}
              >
                <span>{t.favPhrase}</span>
                <Volume2 className="w-3.5 h-3.5 shrink-0" strokeWidth={2.2} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   PART 5: GUEST HOME COMPONENT (Master Landing Page)
   ========================================================================== */
function GuestHome() {
  const courses = useCourses();

  return (
    <div className="immersive-home relative w-full overflow-hidden">
      {/* Scrollable Ambient Heritage Background Watermarks */}
      <div
        className="pointer-events-none absolute -right-28 top-[480px] w-[620px] h-[620px] select-none opacity-[0.05] -z-10"
        style={{
          backgroundImage: `url('/design/dong-son-drum.webp')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-28 top-[1600px] w-[580px] h-[580px] select-none opacity-[0.045] -z-10"
        style={{
          backgroundImage: `url('/design/dong-son-drum.webp')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-28 top-[2700px] w-[560px] h-[560px] select-none opacity-[0.045] -z-10"
        style={{
          backgroundImage: `url('/design/dong-son-drum.webp')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        }}
        aria-hidden="true"
      />

      {/* 1. Flagship 3D Animated Hero Slider (85-95vh) */}
      <HeroBannerSlider />

      {/* 2. Seamless Infinite Horizontal Marquee */}
      <AnimatedMarquee />

      {/* 3. Interactive Quick 10-Second Trial Mini-Lesson */}
      <section className="w-full py-12 px-4 sm:px-8 lg:px-14 bg-gradient-to-b from-[#FFF9ED] via-white to-[#FFF9ED] border-b border-[#DECBB4]/60">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5E1D8] border border-[#E7B59D] text-[#DA251D] text-xs font-black uppercase tracking-wider">
              <span>☕ Trải nghiệm tức thì • Hands-on Mini Lesson</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#202124] tracking-tight">
              Thử thách 10 giây: Ghép câu gọi cà phê đầu tiên!
            </h2>
            <p className="text-sm text-[#78685B] leading-relaxed">
              Chạm vào các quân từ để sắp xếp thành câu tiếng Việt hoàn chỉnh. Nghe phát âm chuẩn người bản xứ và nhận điểm thưởng XP đầu tiên ngay lập tức!
            </p>
          </div>
          <div className="flex justify-center w-full lg:w-auto">
            <HeroInteractiveWidget />
          </div>
        </div>
      </section>

      {/* 2. Metrics Ribbon: Full-Width Edge-to-Edge Banner */}
      <section className="w-full bg-white/95 backdrop-blur-md border-b border-[#DECBB4]/70 py-10 px-4 sm:px-8 lg:px-14 shadow-[0_4px_20px_rgba(67,25,20,0.02)]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x md:divide-[#DECBB4]/60">
          <div className="space-y-1 px-4">
            <strong className="block text-2xl sm:text-4xl font-black text-[#A62A24]">15,000+</strong>
            <span className="text-xs sm:text-sm text-[#78685B] font-semibold">Expats & Du khách</span>
          </div>
          <div className="space-y-1 px-4">
            <strong className="block text-2xl sm:text-4xl font-black text-[#A62A24]">50+</strong>
            <span className="text-xs sm:text-sm text-[#78685B] font-semibold">Tình huống đời thực</span>
          </div>
          <div className="space-y-1 px-4">
            <strong className="block text-2xl sm:text-4xl font-black text-[#A62A24]">6 Thanh</strong>
            <span className="text-xs sm:text-sm text-[#78685B] font-semibold">Chuẩn IPA âm học</span>
          </div>
          <div className="space-y-1 px-4">
            <strong className="block text-2xl sm:text-4xl font-black text-[#A62A24]">100%</strong>
            <span className="text-xs sm:text-sm text-[#78685B] font-semibold">Giọng phát âm bản xứ</span>
          </div>
        </div>
      </section>

      {/* 3. Bento Grid Showcase: Full-Width Section */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-14 xl:px-20 border-b border-[#DECBB4]/60 bg-gradient-to-b from-[#FFF9EE] via-[#FAF8F5]/60 to-[#FFF9EE]">
        <div className="max-w-7xl mx-auto">
          <BentoGridSection />
        </div>
      </section>

      {/* 4. Gamified Roadmap Teaser: Full-Width Section */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-14 xl:px-20 border-b border-[#DECBB4]/60 bg-[#FAF8F5]/60">
        <div className="max-w-7xl mx-auto">
          <GamifiedRoadmapTeaser />
        </div>
      </section>

      {/* 5. Expat Testimonials: Full-Width Section */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-14 xl:px-20 border-b border-[#DECBB4]/60 bg-gradient-to-b from-[#FFF9EE] to-[#FAF8F5]/60">
        <div className="max-w-7xl mx-auto">
          <ExpatTestimonials />
        </div>
      </section>

      {/* 6. High-converting Final CTA: Full-Width Edge-to-Edge Banner */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#431914] via-[#61211b] to-[#A62A24] text-white py-20 sm:py-28 px-4 sm:px-8 lg:px-16 text-center shadow-xl">
        {/* Dong Son Bronze Drum Inlay */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] sm:w-[720px] sm:h-[720px] lg:w-[900px] lg:h-[900px] select-none opacity-[0.14] mix-blend-screen"
          style={{
            backgroundImage: `url('/design/dong-son-drum.webp')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
          }}
          aria-hidden="true"
        />
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#E1B65B]/20 text-[#E1B65B] border border-[#E1B65B]/30 text-xs font-black uppercase tracking-wider">
            Bắt đầu hành trình hôm nay
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            5 phút mỗi ngày để tự tin nói tiếng Việt
          </h2>
          <p className="text-base sm:text-lg text-[#F7F0E3]/90 leading-relaxed max-w-2xl mx-auto">
            Tham gia cộng đồng hàng nghìn người nước ngoài đang học tập và yêu mến văn hóa Việt Nam. Miễn phí trọn đời cho các bài học cơ bản.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-[#E1B65B] hover:bg-[#d4a849] text-[#431914] font-black text-sm shadow-[0_4px_0_#b88d36] active:translate-y-1 active:shadow-none transition-all hover:scale-102"
            >
              <span>Đăng Ký Học Miễn Phí Ngay</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/edtech/dashboard"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              <span>Khám Phá Lộ Trình</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ==========================================================================
   PART 6: LEARNER DASHBOARD (Cockpit for Registered Users)
   ========================================================================== */
function LearnerDashboard({ user }) {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 24, seconds: 18 });
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [claimedQuests, setClaimedQuests] = useState({ q1: false, q2: false, q3: false });
  const [reviewedWords, setReviewedWords] = useState({});

  useEffect(() => {
    learnerService.getProgressData().then(setProgress).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = Math.max(0, midnight.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Chào buổi sáng'
      : currentHour < 18
      ? 'Chào buổi chiều'
      : 'Chào buổi tối';

  const dailyGoal = progress?.dailyGoalMinutes || 15;
  const today = progress?.todayMinutes || 8;
  const goalPercent = Math.min(100, Math.round((today / dailyGoal) * 100));
  const currentLesson = progress?.currentLesson;
  const activities = progress?.recentActivities || [];

  // 7-Day Interactive Streak Calendar Tracker
  const streakDays = [
    { day: 'T2', active: true, label: 'Thứ Hai' },
    { day: 'T3', active: true, label: 'Thứ Ba' },
    { day: 'T4', active: true, label: 'Thứ Tư' },
    { day: 'T5', active: true, label: 'Thứ Năm' },
    { day: 'T6', active: true, label: 'Thứ Sáu' },
    { day: 'T7', active: true, isToday: true, label: 'Hôm nay' },
    { day: 'CN', active: false, label: 'Chủ Nhật' },
  ];

  // Daily Quests with Tiered Rewards
  const quests = [
    {
      id: 'q1',
      tier: 'Đồng',
      title: 'Hoàn thành 1 bài học bất kỳ',
      progress: '1/1',
      xp: 15,
      done: true,
    },
    {
      id: 'q2',
      tier: 'Bạc',
      title: 'Luyện 1 bài đối chiếu thanh điệu',
      progress: '1/1',
      xp: 20,
      done: true,
    },
    {
      id: 'q3',
      tier: 'Vàng',
      title: 'Thu thập 50 XP trong ngày',
      progress: '35/50 XP',
      xp: 35,
      done: false,
    },
  ];

  // Weekly League Top Rivals
  const leagueLeaderboard = [
    { rank: 1, name: 'Alex M.', code: 'US', xp: 520, badge: '🥇', isUser: false },
    { rank: 2, name: 'Sarah K.', code: 'UK', xp: 485, badge: '🥈', isUser: false },
    { rank: 3, name: 'Kenji T.', code: 'JP', xp: 440, badge: '🥉', isUser: false },
    { rank: 4, name: user?.fullName || user?.username || 'Bạn', code: 'VN', xp: 380, badge: '⭐', isUser: true },
  ];

  // Quick 2-Minute Spaced Repetition Warm-up Words
  const quickWords = [
    { vi: 'Cảm ơn', en: 'Thank you', ipa: '/kaːm˧˩˨ ʔəːn˧˧/', tip: 'Thanh hỏi ả hạ giọng trong họng' },
    { vi: 'Bao nhiêu', en: 'How much', ipa: '/ɓaːw˧˧ ɲiəw˧˧/', tip: 'Thanh ngang bằng phẳng' },
    { vi: 'Xin lỗi', en: 'Excuse me / Sorry', ipa: '/sin˧˧ loj˦ˀ˥/', tip: 'Thanh ngã ỗi ngắt giọng nhẹ' },
  ];

  const handleDailyCheckIn = () => {
    if (hasCheckedInToday) return;
    audioFeedback.playSuccessChime();
    setHasCheckedInToday(true);
  };

  const handleClaimQuest = (questId) => {
    audioFeedback.playSuccessChime();
    setClaimedQuests((prev) => ({ ...prev, [questId]: true }));
  };

  const handleWaterWord = (viWord) => {
    audioFeedback.playSuccessChime();
    setReviewedWords((prev) => ({ ...prev, [viWord]: true }));
    speakVietnamese(viWord);
  };

  return (
    <div className="dashboard-page relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 overflow-hidden">
      {/* Subtle Heritage Watermark Medallions for Learner Cockpit */}
      <div
        className="pointer-events-none absolute -right-24 -top-12 w-[540px] h-[540px] select-none opacity-[0.05] -z-10"
        style={{
          backgroundImage: `url('/design/dong-son-drum.webp')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-28 bottom-24 w-[560px] h-[560px] select-none opacity-[0.045] -z-10"
        style={{
          backgroundImage: `url('/design/dong-son-drum.webp')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        }}
        aria-hidden="true"
      />

      {/* 1. Header & Live Gamification Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#DECBB4]/60 pb-6">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#F5E1D8] border border-[#E7B59D] text-[#A62A24] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>{greeting}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#431914] tracking-tight">
            {user?.fullName || user?.username || 'Học viên'}!
          </h1>
          <p className="text-xs sm:text-sm text-[#78685B]">
            Cấp độ hiện tại: <strong className="text-[#431914]">Sơ cấp A1 • Trạm 3</strong> — Duy trì ngọn lửa học tập mỗi ngày.
          </p>
        </div>

        {/* Gamification Stats Ribbon */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#DECBB4]/60 shadow-[0_4px_16px_rgba(67,25,20,0.03)]">
            <Flame size={22} className="text-[#ff7a00] animate-bounce-subtle shrink-0" fill="currentColor" />
            <div>
              <span className="block text-sm font-black text-[#431914] leading-tight">
                {hasCheckedInToday ? 8 : (progress?.streakCount ?? progress?.currentStreak ?? 7)}
              </span>
              <span className="block text-[10px] text-[#78685B] font-semibold uppercase">Ngày Streak</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#DECBB4]/60 shadow-[0_4px_16px_rgba(67,25,20,0.03)]">
            <Zap size={22} className="text-[#8b5cf6] shrink-0" fill="currentColor" />
            <div>
              <span className="block text-sm font-black text-[#431914] leading-tight">
                {(progress?.totalXp ?? 145) + (hasCheckedInToday ? 10 : 0)}
              </span>
              <span className="block text-[10px] text-[#78685B] font-semibold uppercase">Tổng XP</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#DECBB4]/60 shadow-[0_4px_16px_rgba(67,25,20,0.03)]">
            <Heart size={22} className="text-[#ef4444] shrink-0" fill="currentColor" />
            <div>
              <span className="block text-sm font-black text-[#431914] leading-tight">5/5</span>
              <span className="block text-[10px] text-[#78685B] font-semibold uppercase">Trái tim</span>
            </div>
          </div>

          <Link
            to="/edtech/dashboard"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#A62A24] hover:bg-[#89221E] text-white font-black text-xs shadow-[0_4px_0_#89221E] active:translate-y-1 active:shadow-none transition-all"
          >
            <Compass size={16} />
            <span>Vào Lộ trình EdTech →</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium" role="alert">
          {error}
        </div>
      )}

      {/* 2. Interactive 7-Day Streak Calendar Tracker Bar */}
      <section className="bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(67,25,20,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-[#ff7a00]" fill="currentColor" />
            <h2 className="text-sm sm:text-base font-black text-[#431914]">
              Chuỗi 7 ngày liên tục • Weekly Streak Tracker
            </h2>
          </div>
          <p className="text-xs text-[#78685B]">
            Học ít nhất 1 bài mỗi ngày để giữ ngọn lửa không bị tắt.
          </p>
        </div>

        {/* 7-Day Pill Badges */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {streakDays.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center w-11 h-14 rounded-2xl border text-center transition-all ${
                item.isToday
                  ? 'bg-[#FFF9EE] border-2 border-[#A62A24] shadow-md ring-2 ring-[#A62A24]/10 scale-105'
                  : item.active
                  ? 'bg-amber-50/80 border-amber-200 text-amber-800'
                  : 'bg-stone-50 border-stone-200 text-stone-400'
              }`}
            >
              <span className="text-[10px] font-bold">{item.day}</span>
              <div className="mt-1">
                {item.active ? (
                  <Flame size={15} className="text-[#ff7a00]" fill="currentColor" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-stone-300 block my-1" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Streak Check-in & Shield Status */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleDailyCheckIn}
            disabled={hasCheckedInToday}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              hasCheckedInToday
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                : 'bg-[#A62A24] hover:bg-[#89221E] text-white shadow-[0_3px_0_#89221E] active:translate-y-0.5'
            }`}
          >
            {hasCheckedInToday ? (
              <>
                <CheckCircle size={15} className="text-emerald-700" />
                <span>Đã điểm danh (+10 XP)</span>
              </>
            ) : (
              <>
                <Gift size={15} />
                <span>Điểm danh hôm nay (+10 XP)</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#FAF8F5] border border-[#DECBB4]/60 text-xs text-[#78685B]">
            <Shield size={16} className="text-emerald-600 shrink-0" />
            <span>1 Khiên bảo vệ sẵn sàng</span>
          </div>
        </div>
      </section>

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Hero Console + Quick Warm-up + Modules */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. 3D Hero Console "Tiếp Tục Bài Học" */}
          <motion.section
            whileHover={{ y: -2 }}
            className="relative overflow-hidden rounded-3xl bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 p-6 sm:p-8 shadow-[0_8px_30px_rgb(67,25,20,0.04)] space-y-6 text-left"
          >
            {/* Subtle Heritage Dong Son Watermark Inlay */}
            <div
              className="pointer-events-none absolute -right-16 -bottom-16 w-64 h-64 select-none opacity-[0.06]"
              style={{
                backgroundImage: `url('/design/dong-son-drum.webp')`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
              }}
              aria-hidden="true"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#24382B] text-[#FFF9EE] text-[10px] font-black uppercase tracking-wider">
                    {currentLesson?.courseTitle || 'Tiếng Việt Sơ Cấp A1'}
                  </span>
                  <span className="text-[11px] font-bold text-[#A62A24]">
                    Chương 1 • Bài 3
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#431914] leading-snug">
                  {currentLesson?.titleVi || currentLesson?.title || 'Gọi Cà Phê & Nhận Diện Dấu Thanh'}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => speakVietnamese('Cho tôi một ly cà phê sữa đá ít đường nhé')}
                className="!min-h-0 !min-w-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5E1D8] text-[#A62A24] hover:bg-[#A62A24] hover:text-white transition-all text-xs font-bold shrink-0 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 shrink-0" strokeWidth={2.2} />
                <span>Nghe câu mẫu</span>
              </button>
            </div>

            {/* Focal Sentence Card */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DECBB4]/50 flex items-center justify-between text-xs sm:text-sm">
              <p className="text-[#431914] font-medium italic">
                “Cho tôi một ly cà phê sữa đá ít đường nhé!”
              </p>
              <span className="text-[11px] text-[#78685B] shrink-0 ml-2">
                Iced milk coffee with less sugar
              </span>
            </div>

            {/* Progress Bar with Milestones */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#78685B] font-semibold">
                <span>Tiến độ bài học: <strong>60%</strong></span>
                <span>Còn 2 câu hỏi để hoàn thành</span>
              </div>
              <div className="w-full bg-[#EEE3D1] h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-[#A62A24] h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${currentLesson?.progressPercent || 60}%` }}
                />
              </div>
            </div>

            {/* 3 Stations Preview Ribbon */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span className="truncate font-semibold">1. Flashcard Phở</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFF9EE] border-2 border-[#A62A24] text-[#A62A24] text-xs flex items-center gap-2 shadow-xs">
                <Play size={14} fill="currentColor" className="shrink-0" />
                <span className="truncate font-bold">2. Ghép Cà Phê</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-400 text-xs flex items-center gap-2">
                <span>🔒</span>
                <span className="truncate font-semibold">3. Thử Thanh Điệu</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#DECBB4]/40">
              <Link
                to="/edtech/lesson"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-[#A62A24] hover:bg-[#89221E] text-white font-black text-sm shadow-[0_4px_0_#89221E] active:translate-y-1 active:shadow-none transition-all hover:scale-102"
              >
                <Play size={16} fill="currentColor" />
                <span>HỌC TIẾP NGAY (5 PHÚT)</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/courses" className="text-xs font-bold text-[#A62A24] hover:underline">
                Xem toàn bộ giáo trình →
              </Link>
            </div>
          </motion.section>

          {/* B. Quick 2-Minute Warm-up Spaced Repetition (SRS Widget) */}
          <section className="bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 shadow-[0_8px_30px_rgb(67,25,20,0.04)] space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DECBB4]/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#F8E6B7] text-[#431914] flex items-center justify-center font-bold">
                  🌱
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#431914]">
                    Vườn từ vựng • 2-Minute Memory Warm-up
                  </h3>
                  <p className="text-[11px] text-[#78685B]">
                    Thuật toán nhắc lại ngắt quãng (SRS): 3 từ vựng này sắp rơi khỏi trí nhớ của bạn!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  quickWords.forEach((w) => setReviewedWords((prev) => ({ ...prev, [w.vi]: true })));
                  audioFeedback.playSuccessChime();
                }}
                className="px-4 py-2 rounded-xl bg-[#FFF9EE] hover:bg-[#F5E1D8] border border-[#DECBB4] text-[#A62A24] font-bold text-xs shrink-0 transition-colors"
              >
                Tưới nước tất cả (+15 XP) →
              </button>
            </div>

            {/* 3 Quick Words Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quickWords.map((item, idx) => {
                const isWatered = reviewedWords[item.vi];
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2 shadow-2xs ${
                      isWatered
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-[#FAF8F5] border-[#DECBB4]/70 hover:border-[#A62A24]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-black text-[#431914]">
                          {item.vi}
                        </h4>
                        <p className="text-[11px] text-[#78685B]">{item.en}</p>
                        <span className="text-[10px] text-stone-400 font-mono">{item.ipa}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => speakVietnamese(item.vi)}
                        className="!min-h-0 !min-w-0 !p-0 w-8 h-8 rounded-lg bg-white border border-[#DECBB4] hover:bg-[#A62A24] text-[#A62A24] hover:text-white flex items-center justify-center transition-all shadow-2xs shrink-0 cursor-pointer group/audio audio-btn"
                        title={`Phát âm "${item.vi}"`}
                        aria-label={`Phát âm ${item.vi}`}
                      >
                        <Volume2 className="w-4 h-4 shrink-0 transition-transform group-hover/audio:scale-110" strokeWidth={2.2} />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-[#DECBB4]/40 flex items-center justify-between">
                      <span className="text-[10px] text-[#78685B] italic truncate">{item.tip}</span>
                      <button
                        type="button"
                        onClick={() => handleWaterWord(item.vi)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                          isWatered
                            ? 'bg-emerald-200 text-emerald-800'
                            : 'bg-[#F5E1D8] text-[#A62A24] hover:bg-[#A62A24] hover:text-white'
                        }`}
                      >
                        {isWatered ? '✓ Đã thuộc' : '+5 XP'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* C. Quick Learning Modules Hub (3 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <Link
              to="/ai-tutor"
              className="p-5 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 hover:border-[#A62A24] shadow-2xs hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F5E1D8] text-[#A62A24] flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle size={20} />
              </div>
              <h3 className="text-sm font-black text-[#431914] group-hover:text-[#A62A24] transition-colors">
                AI Gia sư đàm thoại
              </h3>
              <p className="text-[11px] text-[#78685B]">Luyện phản xạ từng câu hỏi đáp</p>
            </Link>

            <Link
              to="/edtech/vocabulary"
              className="p-5 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 hover:border-[#A62A24] shadow-2xs hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EDF0E5] text-[#24382B] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Volume2 size={20} />
              </div>
              <h3 className="text-sm font-black text-[#431914] group-hover:text-[#A62A24] transition-colors">
                Kho từ & Thanh điệu
              </h3>
              <p className="text-[11px] text-[#78685B]">So sánh cặp từ Minimal Pairs</p>
            </Link>

            <Link
              to="/culture"
              className="p-5 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 hover:border-[#A62A24] shadow-2xs hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F8E6B7] text-[#431914] flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin size={20} />
              </div>
              <h3 className="text-sm font-black text-[#431914] group-hover:text-[#A62A24] transition-colors">
                Văn hóa & Điểm đến
              </h3>
              <p className="text-[11px] text-[#78685B]">Phong tục, món ngon & con người</p>
            </Link>
          </div>
        </div>

        {/* Right Column (4 cols): Quests + Leaderboard + Word of Day */}
        <aside className="lg:col-span-4 space-y-6 text-left">
          {/* A. Daily Quests with Tiered Chests & Countdown */}
          <section className="bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 shadow-[0_8px_30px_rgb(67,25,20,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DECBB4]/40 pb-3">
              <div className="flex items-center gap-2">
                <Gift size={18} className="text-[#A62A24]" />
                <h3 className="text-base font-black text-[#431914]">Nhiệm vụ hôm nay</h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#78685B] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#DECBB4]/50">
                <Clock size={12} className="text-[#A62A24]" />
                <span>
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {quests.map((quest) => {
                const isClaimed = claimedQuests[quest.id];
                return (
                  <div
                    key={quest.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
                      isClaimed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : quest.done
                        ? 'bg-amber-50/60 border-amber-200 text-[#431914]'
                        : 'bg-[#FAF8F5] border-[#DECBB4]/70 text-[#431914]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                          quest.done || isClaimed ? 'bg-emerald-600 text-white' : 'border border-stone-300'
                        }`}
                      >
                        {quest.done || isClaimed ? '✓' : ''}
                      </span>
                      <div className="truncate">
                        <span className={`block font-bold ${isClaimed ? 'line-through opacity-80' : ''}`}>
                          {quest.title}
                        </span>
                        <span className="text-[10px] text-[#78685B]">{quest.progress}</span>
                      </div>
                    </div>
                    {quest.done && !isClaimed ? (
                      <button
                        type="button"
                        onClick={() => handleClaimQuest(quest.id)}
                        className="px-2.5 py-1 rounded-xl bg-[#A62A24] hover:bg-[#89221E] text-white font-black text-[11px] shrink-0 shadow-2xs"
                      >
                        Nhận {quest.xp} XP
                      </button>
                    ) : (
                      <span className="font-black text-[#A62A24] shrink-0">
                        +{quest.xp} XP
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Daily Goal Time Progress */}
            <div className="pt-2 border-t border-[#DECBB4]/40 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#78685B]">
                <span>Mục tiêu thời gian:</span>
                <strong className="text-[#431914]">{today}/{dailyGoal} phút</strong>
              </div>
              <div className="w-full bg-[#EEE3D1] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#A62A24] h-full rounded-full transition-all duration-500"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>
            </div>
          </section>

          {/* B. Weekly League Leaderboard (Bảng Xếp Hạng Giải Đấu Vàng) */}
          <section className="bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 shadow-[0_8px_30px_rgb(67,25,20,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DECBB4]/40 pb-3">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                <h3 className="text-base font-black text-[#431914]">Bảng xếp hạng tuần</h3>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Giải Vàng
              </span>
            </div>

            <p className="text-[11px] text-[#78685B]">
              Top 10 sẽ thăng hạng lên <strong>Giải Ruby</strong> sau 2 ngày nữa! Bạn chỉ còn thiếu 60 XP để vào Top 3.
            </p>

            <div className="space-y-2">
              {leagueLeaderboard.map((item) => (
                <div
                  key={item.rank}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                    item.isUser
                      ? 'bg-[#FFF9EE] border-2 border-[#A62A24] font-bold shadow-2xs'
                      : 'bg-[#FAF8F5] border border-[#DECBB4]/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-center text-xs font-black">{item.badge}</span>
                    <span className="font-semibold text-[#431914] flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#F5E1D8] text-[#A62A24] border border-[#DECBB4]/70">
                        {item.code}
                      </span>
                      <span>{item.name}</span>
                    </span>
                  </div>
                  <span className="font-black text-[#78685B]">{item.xp} XP</span>
                </div>
              ))}
            </div>
          </section>

          {/* C. Cultural Tip & Word of the Day */}
          <section className="bg-[#FFF9EE]/92 backdrop-blur-xs border border-[#DECBB4] rounded-3xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A62A24] bg-[#F5E1D8] px-2.5 py-0.5 rounded-md">
                Từ vựng & Văn hóa trong ngày
              </span>
              <button
                type="button"
                onClick={() => speakVietnamese('Dạ. Dạ con cảm ơn bác.')}
                className="!min-h-0 !min-w-0 !p-0 w-8 h-8 rounded-full bg-white border border-[#DECBB4] text-[#A62A24] flex items-center justify-center hover:bg-[#A62A24] hover:text-white transition-all shadow-2xs shrink-0 cursor-pointer group/wod audio-btn"
                title="Nghe phát âm “Dạ”"
                aria-label="Nghe phát âm Dạ"
              >
                <Volume2 className="w-4 h-4 shrink-0 transition-transform group-hover/wod:scale-110" strokeWidth={2.2} />
              </button>
            </div>

            <div>
              <h4 className="text-lg font-black text-[#431914]">“Dạ” [zâː / jâː]</h4>
              <p className="text-xs text-[#78685B] leading-relaxed mt-1">
                Từ mở đầu câu kinh điển của người miền Nam, thể hiện sự kính trọng, lễ phép và khiêm nhường đối với người lớn tuổi.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/80 border border-[#DECBB4]/60 text-[11px] text-[#431914] italic">
              Ví dụ: “Dạ, cho con gửi tiền ạ.”
            </div>
          </section>
        </aside>
      </div>

      {/* 4. Recent Activity Timeline Feed */}
      <section className="bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(67,25,20,0.04)] space-y-4 text-left">
        <h2 className="text-lg font-black text-[#431914]">Hoạt động học tập gần đây</h2>
        {activities.length ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] border border-[#DECBB4]/50 shadow-2xs"
              >
                <div className="space-y-0.5">
                  <strong className="block text-xs sm:text-sm font-bold text-[#431914]">
                    {activity.titleVi || activity.title}
                  </strong>
                  <small className="text-[11px] text-[#78685B] flex items-center gap-1">
                    <Calendar size={11} />
                    {activity.time}
                  </small>
                </div>
                {activity.xp != null && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#F8E6B7] text-[#431914] font-bold text-xs">
                    +{activity.xp} XP
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Chưa có hoạt động gần đây"
            description="Các bài học và lần ôn tập hoàn thành sẽ xuất hiện tại đây."
          />
        )}
      </section>
    </div>
  );
}

/* ==========================================================================
   PART 7: MAIN EXPORTED COMPONENT
   ========================================================================== */
export function HomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="homepage-heritage-root relative w-full min-h-screen">
      {/* 
        Mặt trống đồng Đông Sơn - Nền chìm toàn màn hình (Cả Guest và Learner)
        - Cố định trung tâm màn hình (fixed inset-0), hiện diện trang trọng ở mọi vị trí cuộn
        - Hoa văn mặt trời, chim lạc và các vành đồng tâm bao phủ toàn bộ khung nhìn
        - Độ mờ tinh tế 6% tạo cảm giác nền giấy điệp truyền thống, văn bản và nút bấm 100% rõ nét
      */}
      <div
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
        aria-hidden="true"
      >
        <div
          className="w-[min(96vw,1000px)] h-[min(96vw,1000px)] sm:w-[920px] sm:h-[920px] lg:w-[1100px] lg:h-[1100px] aspect-square opacity-[0.06] bg-contain bg-center bg-no-repeat transform-gpu"
          style={{
            backgroundImage: `url('/design/dong-son-drum.webp')`,
          }}
        />
      </div>

      {/* Nội dung trang chủ */}
      <div className="relative z-10 w-full">
        {isAuthenticated ? <LearnerDashboard user={user} /> : <GuestHome />}
      </div>
    </div>
  );
}
