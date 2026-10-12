import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Check,
  Volume2,
  MessageCircle,
  MapPin,
  Trophy,
  Zap,
} from 'lucide-react';

/**
 * HeroSlideContent - Left column (45%) content with animated text reveal,
 * dynamic slide typography, dual high-converting CTAs, and trust metrics.
 */
export function HeroSlideContent({ slideIndex = 0 }) {
  const slides = [
    // Slide 1 - Welcome to Vietnam
    {
      kicker: '🇻🇳 TIẾNG VIỆT ĐỜI THỰC • REAL-LIFE VIETNAMESE',
      kickerIcon: Sparkles,
      titleMain: 'Learn Vietnamese.',
      titleHighlight: 'Love Vietnam.',
      titleVi: 'Khám phá tiếng Việt. Yêu trọn nhịp sống Việt Nam.',
      lead: 'Nền tảng học tiếng Việt tương tác số 1 dành cho người nước ngoài. Kết hợp 6 thanh điệu chuẩn IPA, gia sư AI đàm thoại và nhịp sống văn hóa Việt Nam.',
      primaryCta: { label: 'Bắt đầu học miễn phí', to: '/register' },
      secondaryCta: { label: 'Khám phá khóa học', to: '/courses', icon: Compass },
      quickLink: { label: 'Trải nghiệm Lộ trình EdTech →', to: '/edtech/dashboard' },
      valueProps: ['5 phút mỗi ngày', '6 thanh điệu trực quan', 'AI sửa phát âm'],
    },
    // Slide 2 - Speak with Confidence
    {
      kicker: '🎙️ LUYỆN NÓI TỰ TIN • SPEAK WITH CONFIDENCE',
      kickerIcon: Volume2,
      titleMain: 'Speak Vietnamese',
      titleHighlight: 'with Confidence.',
      titleVi: 'Làm chủ 6 thanh điệu. Tự tin bước ra đường phố.',
      lead: 'Đập tan nỗi sợ phát âm sai với biểu đồ cao độ âm thanh (Pitch Contour) trực quan và hệ thống nhận diện giọng nói chuẩn người bản xứ.',
      primaryCta: { label: 'Luyện phát âm ngay', to: '/edtech/lesson' },
      secondaryCta: { label: 'Khám phá khóa học', to: '/courses', icon: Compass },
      quickLink: { label: 'Kho từ & Cặp âm tương phản →', to: '/edtech/vocabulary' },
      valueProps: ['Biểu đồ cao độ IPA', 'Nhận diện phát âm', '100% giọng bản xứ'],
    },
    // Slide 3 - Discover Vietnamese Culture
    {
      kicker: '🍜 VĂN HÓA & ẨM THỰC • EXPLORE VIETNAMESE CULTURE',
      kickerIcon: MapPin,
      titleMain: 'Explore Vietnam',
      titleHighlight: 'Beyond Words.',
      titleVi: 'Học tiếng qua Phở, Bánh mì và nét đẹp đời sống.',
      lead: 'Không chỉ học ngữ pháp khô khan. Khám phá văn hóa ẩm thực vỉa hè, nghệ thuật mặc cả thân thiện và phong tục truyền thống từ Hà Nội đến Sài Gòn.',
      primaryCta: { label: 'Khám phá Văn hóa & Ẩm thực', to: '/culture' },
      secondaryCta: { label: 'Bắt đầu học miễn phí', to: '/register', icon: Sparkles },
      quickLink: { label: '50+ Kịch bản giao tiếp đời thực →', to: '/courses' },
      valueProps: ['Quán phở & Cà phê phin', 'Mặc cả chợ Bến Thành', 'Gọi xe & Đi du lịch'],
    },
    // Slide 4 - Learning Journey
    {
      kicker: '🎮 LỘ TRÌNH GAMIFIED • CEFR LEARNING PATH',
      kickerIcon: Trophy,
      titleMain: 'Every Lesson',
      titleHighlight: 'Brings You Closer.',
      titleVi: 'Học như chơi game. Tiến bộ vượt bậc mỗi ngày.',
      lead: 'Lộ trình chia nhỏ từ Sơ cấp A1 đến Trung cấp B2 theo chuẩn quốc tế. Tích lũy XP, duy trì Streak rực lửa và nhận huy hiệu danh giá.',
      primaryCta: { label: 'Xem Lộ trình CEFR', to: '/edtech/dashboard' },
      secondaryCta: { label: 'Bắt đầu học miễn phí', to: '/register', icon: Zap },
      quickLink: { label: 'Bảng xếp hạng giải đấu tuần →', to: '/progress' },
      valueProps: ['Chặng học A1 đến B2', 'Nhiệm vụ & Rương thưởng', 'Streak giữ lửa học'],
    },
    // Slide 5 - AI Conversation Practice
    {
      kicker: '🤖 GIA SƯ AI 24/7 • PRACTICE ANYTIME WITH AI',
      kickerIcon: MessageCircle,
      titleMain: 'Your Vietnamese',
      titleHighlight: 'AI Speaking Partner.',
      titleVi: 'Luyện phản xạ giao tiếp không sợ ngượng ngùng.',
      lead: 'Trò chuyện tự do với gia sư AI thông minh được tối ưu riêng cho người nước ngoài. AI phân tích ngữ điệu, chỉ ra lỗi sai và gợi ý cách đối đáp tự nhiên.',
      primaryCta: { label: 'Trò chuyện cùng AI Tutor', to: '/ai-tutor' },
      secondaryCta: { label: 'Khám phá khóa học', to: '/courses', icon: Compass },
      quickLink: { label: 'Thực hành kịch bản đối thoại →', to: '/ai-scenarios' },
      valueProps: ['Phản hồi tức thì 24/7', 'Tự động sửa lỗi ngữ pháp', 'Tình huống đa dạng'],
    },
  ];

  const current = slides[slideIndex] || slides[0];
  const KickerIcon = current.kickerIcon;

  return (
    <div className="space-y-6 text-left relative z-10 max-w-xl">
      {/* 1. Kicker Social Proof Pill */}
      <motion.div
        key={`kicker-${slideIndex}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5E1D8] border border-[#E7B59D] text-[#A62A24] text-xs font-black shadow-2xs"
      >
        <KickerIcon size={14} className="text-[#A62A24] shrink-0" />
        <span className="truncate">{current.kicker}</span>
      </motion.div>

      {/* 2. Main Heading with Text Reveal */}
      <motion.div
        key={`title-${slideIndex}`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="space-y-1"
      >
        <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-black text-[#202124] tracking-tight leading-[1.12]">
          {current.titleMain}
          <br />
          <span className="text-[#DA251D] drop-shadow-xs">{current.titleHighlight}</span>
        </h1>
        <p className="text-sm sm:text-base font-bold text-[#A62A24]/90 pt-1">
          {current.titleVi}
        </p>
      </motion.div>

      {/* 3. Subtitle / Lead Paragraph */}
      <motion.p
        key={`lead-${slideIndex}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        className="text-sm sm:text-base text-[#78685B] leading-relaxed"
      >
        {current.lead}
      </motion.p>

      {/* 4. Dual Prominent CTAs */}
      <motion.div
        key={`cta-${slideIndex}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.22 }}
        className="flex flex-wrap items-center gap-3.5 pt-1"
      >
        {/* Primary CTA (Start Learning Free / Action) */}
        <Link
          to={current.primaryCta.to}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#DA251D] hover:bg-[#89221E] text-white font-black text-sm shadow-[0_4px_0_#89221E] active:translate-y-1 active:shadow-none transition-all hover:scale-102 cursor-pointer"
        >
          <span>{current.primaryCta.label}</span>
          <ArrowRight size={18} />
        </Link>

        {/* Secondary CTA (Explore Courses) */}
        <Link
          to={current.secondaryCta.to}
          className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-[#FFF9EE] text-[#202124] border border-[#DECBB4] font-bold text-xs shadow-xs transition-all hover:border-[#DA251D] cursor-pointer"
        >
          {current.secondaryCta.icon && (
            <current.secondaryCta.icon size={16} className="text-[#DA251D]" />
          )}
          <span>{current.secondaryCta.label}</span>
        </Link>

        {/* Quick Route Link */}
        {current.quickLink && (
          <Link
            to={current.quickLink.to}
            className="text-xs font-bold text-[#78685B] hover:text-[#DA251D] transition-colors ml-1"
          >
            {current.quickLink.label}
          </Link>
        )}
      </motion.div>

      {/* 5. Trust Value Props */}
      <motion.div
        key={`props-${slideIndex}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#78685B] pt-2"
      >
        {current.valueProps.map((prop, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            <Check size={15} className="text-[#DA251D] shrink-0" strokeWidth={2.5} />
            <span>{prop}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
