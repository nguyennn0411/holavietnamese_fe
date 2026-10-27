import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flame,
  Gift,
  Heart,
  HelpCircle,
  Landmark,
  Languages,
  Lock,
  MapPinned,
  MessageCircle,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trophy,
  UserCheck,
  X,
  Zap,
} from 'lucide-react';
import { courseService } from '@/services/courseService';
import { learnerService } from '@/services/learnerService';
import { learningService } from '@/services/learningService';
import { BuffaloMascot } from '@/components/mascot';
import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useTranslation } from 'react-i18next';
import {
  buildRecommendationPath,
  GOAL_DISCOVERY_PROFILES,
  GOAL_PROFILES,
  normalizeGoalId,
} from '@/features/onboarding/services/recommendationEngine';
import '@/styles/duolingo-path.css';
import '@/styles/learning-path-simple.css';

type AnyRecord = Record<string, any>;

interface UnitConfig {
  unitNumber: number;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  gradient: string;
  depthColor: string;
  lessonRange: [number, number]; // 0-indexed inclusive [start, end]
  guidebook: {
    summary: string;
    summaryEn?: string;
    tips: string[];
    tipsEn?: string[];
    vocabulary: { vi: string; en: string }[];
  };
}

export const CEFR_LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'] as const;

export const normalizeCefrLevel = (...values: any[]): string | null => {
  for (const value of values) {
    const normalized = String(value || '').toUpperCase().trim();
    if (CEFR_LEVELS.includes(normalized as any)) return normalized;
  }
  return null;
};

export const LEVEL_PATH_PROFILES: Record<string, AnyRecord> = {
  A0: {
    badgeVi: 'Nhập môn',
    badgeEn: 'Absolute Beginner',
    titleVi: 'Khởi động tiếng Việt từ nền tảng',
    titleEn: 'Start Vietnamese from the foundations',
    descriptionVi: 'Làm quen bảng chữ cái, 6 thanh điệu và những mẫu câu sinh tồn trước khi bước vào A1.',
    descriptionEn: 'Build sound, script, and survival-language foundations before moving into A1.',
    stages: [
      ['Âm, chữ và 6 thanh điệu', 'Sounds, letters, and six tones'],
      ['Chào hỏi và thông tin cá nhân', 'Greetings and personal information'],
      ['Giao tiếp sinh tồn đầu tiên', 'First survival conversations'],
    ],
    tipVi: 'Hãy luyện phát âm 6 dấu thanh to và rõ ràng trước gương mỗi ngày.',
    tipEn: 'Practice the 6 tones out loud in front of a mirror daily.',
  },
  A1: {
    badgeVi: 'Cơ bản',
    badgeEn: 'Elementary',
    titleVi: 'Xây nền giao tiếp tiếng Việt',
    titleEn: 'Build your Vietnamese communication foundation',
    descriptionVi: 'Phát triển phát âm, từ vựng cốt lõi và phản xạ trong tình huống quen thuộc hằng ngày.',
    descriptionEn: 'Develop pronunciation, core vocabulary, and reflexes for familiar situations.',
    stages: [
      ['Phát âm và câu giao tiếp nền tảng', 'Pronunciation and core sentences'],
      ['Đời sống hằng ngày', 'Everyday life'],
      ['Phản xạ và cột mốc A1', 'Reflex practice and A1 milestone'],
    ],
    tipVi: 'Nhớ gọi phục vụ trong quán ăn bằng "Em ơi!" hoặc "Anh ơi!" nhé!',
    tipEn: 'Remember to call restaurant servers with "Em oi!" or "Anh oi!"',
  },
  A2: {
    badgeVi: 'Sơ cấp',
    badgeEn: 'Pre-Intermediate',
    titleVi: 'Mở rộng giao tiếp thường ngày',
    titleEn: 'Expand everyday communication',
    descriptionVi: 'Nói rõ hơn về cuộc sống, nhu cầu, gia đình, thời tiết và trải nghiệm trong các ngữ cảnh quen thuộc.',
    descriptionEn: 'Speak more clearly about life, needs, and experiences in familiar contexts.',
    stages: [
      ['Củng cố mẫu câu thiết yếu', 'Strengthen essential sentence patterns'],
      ['Hội thoại theo tình huống', 'Situational conversations'],
      ['Kể lại trải nghiệm và cột mốc A2', 'Share experiences and reach A2'],
    ],
    tipVi: 'Học cách mặc cả lịch sự ở chợ truyền thống: "Bớt cho em một chút nhé!"',
    tipEn: 'Learn polite bargaining at local markets: "Bot cho em mot chut nhe!"',
  },
  B1: {
    badgeVi: 'Trung cấp',
    badgeEn: 'Intermediate',
    titleVi: 'Giao tiếp độc lập và tự tin',
    titleEn: 'Communicate independently and confidently',
    descriptionVi: 'Diễn đạt ý kiến, du lịch tự túc, văn hóa lễ hội và xử lý những cuộc hội thoại công việc dài hơn.',
    descriptionEn: 'Express opinions, tell stories, and handle longer conversations in daily and workplace life.',
    stages: [
      ['Kết nối ý và mở rộng vốn từ', 'Connect ideas and broaden vocabulary'],
      ['Thảo luận đời sống và công việc', 'Discuss life and work'],
      ['Trình bày quan điểm và cột mốc B1', 'Present viewpoints and reach B1'],
    ],
    tipVi: 'Bày tỏ quan điểm tự nhiên với cụm từ: "Theo quan điểm của tôi...".',
    tipEn: 'Express viewpoints naturally using: "Theo quan diem cua toi...".',
  },
  B2: {
    badgeVi: 'Cao cấp',
    badgeEn: 'Upper-Intermediate',
    titleVi: 'Giao tiếp chuyên sâu theo ngữ cảnh',
    titleEn: 'Advanced context-aware communication',
    descriptionVi: 'Thảo luận linh hoạt, hiểu sắc thái thành ngữ, đàm phán và dùng tiếng Việt hiệu quả trong môi trường chuyên nghiệp.',
    descriptionEn: 'Discuss flexibly, understand nuance, and use Vietnamese effectively in professional settings.',
    stages: [
      ['Ngôn ngữ chính xác và tự nhiên', 'Accurate and natural language'],
      ['Thảo luận chủ đề phức tạp', 'Discuss complex topics'],
      ['Lập luận và cột mốc B2', 'Build arguments and reach B2'],
    ],
    tipVi: 'Vận dụng các câu thành ngữ phổ biến sẽ làm cách nói của bạn thêm sâu sắc.',
    tipEn: 'Using common idioms makes your Vietnamese speech rich and nuanced.',
  },
  C1: {
    badgeVi: 'Thành thạo',
    badgeEn: 'Advanced',
    titleVi: 'Làm chủ sắc thái tiếng Việt',
    titleEn: 'Master Vietnamese nuance',
    descriptionVi: 'Tinh chỉnh phong cách, văn học nghệ thuật, lập luận học thuật và sử dụng ngôn ngữ tự nhiên như người bản xứ.',
    descriptionEn: 'Refine style, argumentation, and language use for academic and professional contexts.',
    stages: [
      ['Sắc thái và phong cách diễn đạt', 'Nuance and expressive style'],
      ['Ngôn ngữ học thuật và chuyên môn', 'Academic and professional language'],
      ['Trình bày chuyên sâu và cột mốc C1', 'Advanced presentation and C1 milestone'],
    ],
    tipVi: 'Cảm nhận nhạc tính và vẻ đẹp câu từ qua các tác phẩm văn học Việt Nam kinh điển.',
    tipEn: 'Appreciate tone musicality and literary beauty through classic Vietnamese literature.',
  },
};

export const LEVEL_CURRICULUM_DATA: Record<string, { units: UnitConfig[]; lessons: AnyRecord[] }> = {
  A0: {
    units: [
      {
        unitNumber: 1,
        title: 'Bảng Chữ Cái & 6 Thanh Điệu Cơ Bản',
        titleEn: 'Alphabet & 6 Tone Foundations',
        description: 'Làm quen bảng chữ cái tiếng Việt, 11 nguyên âm đơn và cách phát âm 6 thanh điệu.',
        descriptionEn: 'Master the Vietnamese alphabet, 11 single vowels, and 6 fundamental tones.',
        gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
        depthColor: '#075985',
        lessonRange: [0, 2],
        guidebook: {
          summary: 'Nền tảng phát âm bảng chữ cái và 6 thanh điệu tiếng Việt.',
          summaryEn: 'Foundations of the alphabet and 6 Vietnamese tones.',
          tips: [
            'Tiếng Việt có 6 thanh điệu: Ngang (không dấu), Huyền (`), Sắc (´), Hỏi (?), Ngã (~), Nặng (.)',
            'Các nguyên âm có dấu mũ/móc: ă, â, ê, ô, ơ, ư cần uốn khẩu hình chuẩn xác.',
            'Luyện tập phát âm từ thanh Ngang chuẩn trước khi thêm các dấu thanh.',
          ],
          tipsEn: [
            'Vietnamese has 6 tones: Mid level, Low falling, High rising, Dipping, Breaking, Low constricted.',
            'Special vowels (ă, â, ê, ô, ơ, ư) require precise mouth and tongue shaping.',
            'Master the flat tone first before layering other tone contours.',
          ],
          vocabulary: [
            { vi: 'Chữ cái', en: 'Letter / Alphabet' },
            { vi: 'Dấu thanh', en: 'Tone mark' },
            { vi: 'Nguyên âm', en: 'Vowel' },
            { vi: 'Phụ âm', en: 'Consonant' },
          ],
        },
      },
      {
        unitNumber: 2,
        title: 'Lời Chào Sơ Khởi & Số Đếm 0 - 100',
        titleEn: 'First Greetings & Numbers 0 - 100',
        description: 'Mẫu câu chào hỏi lễ phép, cảm ơn, tạm biệt và đếm số tiền tệ đơn giản.',
        descriptionEn: 'Polite greetings, thank-you expressions, goodbyes, and counting numbers.',
        gradient: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
        depthColor: '#0F766E',
        lessonRange: [3, 5],
        guidebook: {
          summary: 'Mẫu câu chào hỏi căn bản nhất và quy tắc đếm số tiếng Việt.',
          summaryEn: 'Essential greeting patterns and counting numbers.',
          tips: [
            'Luôn thêm từ "ạ" ở cuối câu khi nói chuyện với người lớn tuổi hơn.',
            'Số 15 đọc là "mười lăm", số 21 đọc là "hai mươi mốt".',
            'Đại từ nhân xưng cơ bản: Tôi (mình), Bạn (người đối diện).',
          ],
          tipsEn: [
            'Always add "ạ" at the end of sentences for politeness to elders.',
            'Number 15 is pronounced "mười lăm", 21 is "hai mươi mốt".',
            'Core pronouns: Tôi (I/me), Bạn (you).',
          ],
          vocabulary: [
            { vi: 'Xin chào', en: 'Hello' },
            { vi: 'Cảm ơn', en: 'Thank you' },
            { vi: 'Tạm biệt', en: 'Goodbye' },
            { vi: 'Một, hai, ba...', en: 'One, two, three...' },
          ],
        },
      },
      {
        unitNumber: 3,
        title: 'Phản Xạ Sinh Tồn & Cột Mốc A0',
        titleEn: 'Survival Reflexes & A0 Milestone',
        description: 'Luyện tai nghe và phản xạ phát âm cùng AI Tutor trước khi bước vào chặng A1.',
        descriptionEn: 'Auditory reflex practice with AI Tutor and A0 foundation milestone.',
        gradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
        depthColor: '#1D4ED8',
        lessonRange: [6, 7],
        guidebook: {
          summary: 'Tổng kết chặng nhập môn A0 và chuẩn bị tâm thế tự tin vào A1.',
          summaryEn: 'Review A0 foundations and step confidently into A1.',
          tips: [
            'Đừng ngại nói sai: Gia sư AI luôn kiên nhẫn hướng dẫn từng âm.',
            'Luyện tập 10 phút mỗi ngày tạo nên sự khác biệt rất lớn.',
            'Hoàn thành bài 8 để mở khóa trọn vẹn lộ trình Sơ cấp A1!',
          ],
          tipsEn: [
            'Do not fear mistakes: AI Tutor guides every syllable patiently.',
            '10 minutes daily practice creates lasting fluency.',
            'Complete Lesson 8 to fully unlock your A1 Elementary path!',
          ],
          vocabulary: [
            { vi: 'Lắng nghe', en: 'Listen' },
            { vi: 'Nhắc lại', en: 'Repeat' },
            { vi: 'Chính xác', en: 'Correct' },
            { vi: 'Bắt đầu A1', en: 'Start A1' },
          ],
        },
      },
    ],
    lessons: [
      {
        id: 101,
        title: 'Bài 1: Bảng chữ cái & 11 nguyên âm đơn',
        titleVi: 'Bài 1: Bảng chữ cái & 11 nguyên âm đơn',
        titleEn: 'Lesson 1: Alphabet & 11 Single Vowels',
        description: 'Nhận biết mặt chữ cái tiếng Việt và làm chủ phát âm 11 nguyên âm đơn đặc trưng.',
        descriptionVi: 'Nhận biết mặt chữ cái tiếng Việt và làm chủ phát âm 11 nguyên âm đơn đặc trưng.',
        descriptionEn: 'Identify Vietnamese letters and master 11 single vowel pronunciations.',
        estimatedDuration: 10,
        xpReward: 20,
        objectives: ['Nhận biết 29 chữ cái tiếng Việt', 'Phát âm chuẩn các nguyên âm ă, â, ê, ô, ơ, ư', 'Phân biệt chữ d và đ'],
        objectivesVi: ['Nhận biết 29 chữ cái tiếng Việt', 'Phát âm chuẩn các nguyên âm ă, â, ê, ô, ơ, ư', 'Phân biệt chữ d và đ'],
        objectivesEn: ['Recognize 29 Vietnamese letters', 'Pronounce vowels correctly (ă, â, ê, ô, ơ, ư)', 'Distinguish letters d and đ'],
        isCompleted: false,
        learningStatus: 'AVAILABLE',
      },
      {
        id: 102,
        title: 'Bài 2: Bí kíp 6 thanh điệu thần kỳ',
        titleVi: 'Bài 2: Bí kíp 6 thanh điệu thần kỳ',
        titleEn: 'Lesson 2: The 6 Vietnamese Tones',
        description: 'Khám phá bí mật 6 thanh điệu: Ngang, Huyền, Sắc, Hỏi, Ngã, Nặng với mô hình cao độ.',
        descriptionVi: 'Khám phá bí mật 6 thanh điệu: Ngang, Huyền, Sắc, Hỏi, Ngã, Nặng với mô hình cao độ.',
        descriptionEn: 'Discover the 6 tones with visual pitch contours and interactive listening.',
        estimatedDuration: 12,
        xpReward: 25,
        objectives: ['Phân biệt 6 dấu thanh', 'Thực hành chuỗi âm: ba - bà - bá - bả - bã - bạ', 'Nhận diện thanh điệu trong từ đơn'],
        objectivesVi: ['Phân biệt 6 dấu thanh', 'Thực hành chuỗi âm: ba - bà - bá - bả - bã - bạ', 'Nhận diện thanh điệu trong từ đơn'],
        objectivesEn: ['Distinguish all 6 tones', 'Practice tone chains: ba - bà - bá - bả - bã - bạ', 'Identify tones in single words'],
        isCompleted: false,
        learningStatus: 'AVAILABLE',
      },
      {
        id: 103,
        title: 'Bài 3: Ghép âm & Phụ âm đầu thông dụng',
        titleVi: 'Bài 3: Ghép âm & Phụ âm đầu thông dụng',
        titleEn: 'Lesson 3: Syllable Blending & Consonants',
        description: 'Ghép phụ âm đầu (b, c, m, n, t, ch, th) với nguyên âm để tạo thành các từ hoàn chỉnh.',
        descriptionVi: 'Ghép phụ âm đầu (b, c, m, n, t, ch, th) với nguyên âm để tạo thành các từ hoàn chỉnh.',
        descriptionEn: 'Blend initial consonants with vowels to build complete Vietnamese syllables.',
        estimatedDuration: 12,
        xpReward: 25,
        objectives: ['Ghép âm chuẩn xác', 'Luyện tai nghe phụ âm đôi (ch, th, nh, ph)', 'Đọc trơn các từ cơ bản'],
        objectivesVi: ['Ghép âm chuẩn xác', 'Luyện tai nghe phụ âm đôi (ch, th, nh, ph)', 'Đọc trơn các từ cơ bản'],
        objectivesEn: ['Accurate syllable blending', 'Train auditory perception of double consonants', 'Smooth reading of core syllables'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 104,
        title: 'Bài 4: Chào hỏi, Cảm ơn & Tạm biệt',
        titleVi: 'Bài 4: Chào hỏi, Cảm ơn & Tạm biệt',
        titleEn: 'Lesson 4: Greetings, Thanks & Goodbye',
        description: 'Mẫu câu sinh tồn cần thiết nhất khi gặp gỡ người Việt trong đời sống hằng ngày.',
        descriptionVi: 'Mẫu câu sinh tồn cần thiết nhất khi gặp gỡ người Việt trong đời sống hằng ngày.',
        descriptionEn: 'Essential survival phrases when meeting Vietnamese speakers in daily life.',
        estimatedDuration: 10,
        xpReward: 20,
        objectives: ['Mẫu câu: "Xin chào", "Cảm ơn", "Tạm biệt"', 'Cách thêm "ạ" thể hiện lễ phép', 'Phản xạ chào hỏi tự nhiên'],
        objectivesVi: ['Mẫu câu: "Xin chào", "Cảm ơn", "Tạm biệt"', 'Cách thêm "ạ" thể hiện lễ phép', 'Phản xạ chào hỏi tự nhiên'],
        objectivesEn: ['Phrases: "Xin chao", "Cam on", "Tam biet"', 'Using "a" for politeness', 'Natural greeting reflexes'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 105,
        title: 'Bài 5: Đếm số từ 0 đến 100 & Tuổi tác',
        titleVi: 'Bài 5: Đếm số từ 0 đến 100 & Tuổi tác',
        titleEn: 'Lesson 5: Numbers 0 to 100 & Age',
        description: 'Làm chủ các con số từ 0 đến 100, quy tắc biến âm (mười lăm, hai mươi mốt) và hỏi tuổi.',
        descriptionVi: 'Làm chủ các con số từ 0 đến 100, quy tắc biến âm (mười lăm, hai mươi mốt) và hỏi tuổi.',
        descriptionEn: 'Master numbers 0 to 100, pronunciation variants, and asking age.',
        estimatedDuration: 12,
        xpReward: 25,
        objectives: ['Đếm số 0 - 100 thành thạo', 'Hỏi tuổi: "Bạn bao nhiêu tuổi?"', 'Đọc số điện thoại tiếng Việt'],
        objectivesVi: ['Đếm số 0 - 100 thành thạo', 'Hỏi tuổi: "Bạn bao nhiêu tuổi?"', 'Đọc số điện thoại tiếng Việt'],
        objectivesEn: ['Count fluently from 0 to 100', 'Ask age: "Ban bao nhieu tuoi?"', 'Read phone numbers in Vietnamese'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 106,
        title: 'Bài 6: Đại từ nhân xưng: Tôi, Bạn, Anh, Chị',
        titleVi: 'Bài 6: Đại từ nhân xưng: Tôi, Bạn, Anh, Chị',
        titleEn: 'Lesson 6: Core Pronouns & Addressing',
        description: 'Hiểu đại từ xưng hô cơ bản và cách xưng hô lịch sự tùy theo độ tuổi.',
        descriptionVi: 'Hiểu đại từ xưng hô cơ bản và cách xưng hô lịch sự tùy theo độ tuổi.',
        descriptionEn: 'Understand core personal pronouns and polite forms of address.',
        estimatedDuration: 14,
        xpReward: 30,
        objectives: ['Sử dụng đại từ Tôi / Bạn', 'Chào anh / Chào chị / Chào em', 'Tự giới thiệu tên của mình'],
        objectivesVi: ['Sử dụng đại từ Tôi / Bạn', 'Chào anh / Chào chị / Chào em', 'Tự giới thiệu tên của mình'],
        objectivesEn: ['Use core pronouns Tôi / Bạn', 'Polite greetings: Chào anh / chị / em', 'Introduce your own name'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 107,
        title: 'Bài 7: Luyện phản xạ phát âm cùng AI Tutor',
        titleVi: 'Bài 7: Luyện phản xạ phát âm cùng AI Tutor',
        titleEn: 'Lesson 7: AI Pronunciation Reflex Challenge',
        description: 'Thực hành nói trực tiếp với Gia sư AI và nhận phản hồi chấm điểm phát âm ngay lập tức.',
        descriptionVi: 'Thực hành nói trực tiếp với Gia sư AI và nhận phản hồi chấm điểm phát âm ngay lập tức.',
        descriptionEn: 'Practice live speaking with AI Tutor and receive real-time pronunciation feedback.',
        estimatedDuration: 15,
        xpReward: 40,
        objectives: ['Phát âm to rõ ràng', 'Nhận phản hồi chấm điểm AI', 'Sửa lỗi cao độ dấu thanh'],
        objectivesVi: ['Phát âm to rõ ràng', 'Nhận phản hồi chấm điểm AI', 'Sửa lỗi cao độ dấu thanh'],
        objectivesEn: ['Speak clearly out loud', 'Receive AI tone score feedback', 'Correct tone contour errors'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 108,
        title: 'Bài 8: Đánh giá tổng hợp & Hoàn thành A0',
        titleVi: 'Bài 8: Đánh giá tổng hợp & Hoàn thành A0',
        titleEn: 'Lesson 8: A0 Milestone Challenge',
        description: 'Kiểm tra tổng hợp kiến thức chặng Nhập môn, nhận chứng nhận hoàn thành A0 và mở khóa A1.',
        descriptionVi: 'Kiểm tra tổng hợp kiến thức chặng Nhập môn, nhận chứng nhận hoàn thành A0 và mở khóa A1.',
        descriptionEn: 'Comprehensive milestone challenge to graduate A0 and advance into A1.',
        estimatedDuration: 20,
        xpReward: 60,
        objectives: ['Đạt 80%+ bài đánh giá A0', 'Tổng kết bảng chữ cái & số đếm', 'Mở khóa chặng Sơ cấp A1'],
        objectivesVi: ['Đạt 80%+ bài đánh giá A0', 'Tổng kết bảng chữ cái & số đếm', 'Mở khóa chặng Sơ cấp A1'],
        objectivesEn: ['Score 80%+ on A0 milestone test', 'Review alphabet & numbers', 'Unlock Elementary A1 stage'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
    ],
  },

  A1: {
    units: [
      {
        unitNumber: 1,
        title: 'Bước Đầu Làm Quen & Nền Tảng Âm Tiết',
        titleEn: 'First Steps & Syllable Foundations',
        description: 'Làm quen cách chào hỏi lịch sự, giải mã 6 thanh điệu tiếng Việt và số đếm mua sắm.',
        descriptionEn: 'Learn polite greetings, decode the 6 Vietnamese tones, and count numbers for shopping.',
        gradient: 'linear-gradient(135deg, #FF7A00 0%, #E11D48 100%)',
        depthColor: '#7A170F',
        lessonRange: [0, 2],
        guidebook: {
          summary: 'Nền tảng thanh điệu và các câu chào hỏi căn bản nhất khi gặp người Việt Nam.',
          summaryEn: 'Tone foundations and the most essential greetings when meeting Vietnamese people.',
          tips: [
            'Tiếng Việt có 6 thanh điệu: Ngang (không dấu), Huyền (`), Sắc (´), Hỏi (?), Ngã (~), Nặng (.)',
            'Xưng hô lịch sự: Chào anh (nam lớn hơn), Chào chị (nữ lớn hơn), Chào em (nhỏ tuổi hơn).',
            'Khi mua sắm, luôn thêm "ạ" ở cuối câu để thể hiện sự lễ phép: "Bao nhiêu tiền ạ?"',
          ],
          tipsEn: [
            'Vietnamese has 6 tones: Mid level, Low falling, High rising, Dipping-rising, High breaking, Low constricted.',
            'Polite pronouns: Chào anh (older male), Chào chị (older female), Chào em (younger person).',
            'When shopping, always add "ạ" at the end for politeness: "Bao nhiêu tiền ạ?"',
          ],
          vocabulary: [
            { vi: 'Xin chào', en: 'Hello' },
            { vi: 'Cảm ơn', en: 'Thank you' },
            { vi: 'Tạm biệt', en: 'Goodbye' },
            { vi: 'Bao nhiêu tiền', en: 'How much does it cost?' },
          ],
        },
      },
      {
        unitNumber: 2,
        title: 'Đời Sống Hằng Ngày & Ẩm Thực Phố Phường',
        titleEn: 'Daily Life & Street Food Culture',
        description: 'Giới thiệu bản thân, tự tin gọi món phở bánh mì và hỏi đường đi lại.',
        descriptionEn: 'Introduce yourself, order pho and banh mi with confidence, and ask for directions.',
        gradient: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
        depthColor: '#064E3B',
        lessonRange: [3, 5],
        guidebook: {
          summary: 'Cách giao tiếp trong quán ăn Việt Nam và chỉ dẫn đường phố thân thiện.',
          summaryEn: 'How to communicate in Vietnamese eateries and friendly street navigation.',
          tips: [
            'Khi gọi phục vụ tại quán: "Em ơi!" hoặc "Anh ơi!" là cách gọi tự nhiên và phổ biến nhất.',
            'Mẫu câu gọi món: "Cho em một bát phở bò tái ít hành" hoặc "Cho một ly cà phê sữa đá mang đi".',
            'Hỏi đường: "Cho tôi hỏi đường ra chợ Bến Thành đi hướng nào ạ?"',
          ],
          tipsEn: [
            'Calling waitstaff at restaurants: "Em ơi!" or "Anh ơi!" is the most natural and friendly way.',
            'Ordering phrase: "Cho em một bát phở bò..." or "Cho một ly cà phê sữa đá mang đi".',
            'Asking directions: "Cho tôi hỏi đường ra chợ Bến Thành đi hướng nào ạ?"',
          ],
          vocabulary: [
            { vi: 'Phở bò', en: 'Beef pho noodles' },
            { vi: 'Bánh mì', en: 'Vietnamese baguette' },
            { vi: 'Cà phê sữa đá', en: 'Iced milk coffee' },
            { vi: 'Rẽ trái / Rẽ phải', en: 'Turn left / Turn right' },
          ],
        },
      },
      {
        unitNumber: 3,
        title: 'Phản Xạ AI & Về Đích Chặng Sơ Cấp A1',
        titleEn: 'AI Reflexes & A1 Elementary Milestone',
        description: 'Thực hành tương tác trực tiếp với Gia sư AI và hoàn thành thử thách chứng chỉ.',
        descriptionEn: 'Practice live interactions with the AI Tutor and complete the certificate challenge.',
        gradient: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)',
        depthColor: '#78350F',
        lessonRange: [6, 7],
        guidebook: {
          summary: 'Rèn luyện phản xạ phát âm chuẩn xác với Gia sư AI và tổng kết toàn bộ chặng Sơ cấp.',
          summaryEn: 'Sharpen accurate pronunciation reflexes with AI Tutor and review the entire Elementary stage.',
          tips: [
            'Đừng sợ phát âm sai: Gia sư AI luôn kiên nhẫn sửa từng âm tiết và cao độ thanh điệu.',
            'Hãy luyện nói thành tiếng to, rõ ràng theo nhịp điệu tự nhiên.',
            'Hoàn thành bài 8 để nhận chứng chỉ điện tử A1 và mở khóa chặng Trung cấp!',
          ],
          tipsEn: [
            'Do not fear mispronunciation: AI Tutor is always patient, guiding each syllable and tone.',
            'Practice speaking out loud clearly with a natural conversational rhythm.',
            'Complete lesson 8 to receive your digital A1 Certificate and unlock next levels!',
          ],
          vocabulary: [
            { vi: 'Luyện tập', en: 'Practice' },
            { vi: 'Phản xạ', en: 'Reflex' },
            { vi: 'Chính xác', en: 'Accurate' },
            { vi: 'Xuất sắc', en: 'Excellent' },
          ],
        },
      },
    ],
    lessons: [
      {
        id: 1,
        title: 'Bài 1: Làm quen & Chào hỏi cơ bản',
        titleVi: 'Bài 1: Làm quen & Chào hỏi cơ bản',
        titleEn: 'Lesson 1: Introduction & Basic Greetings',
        description: 'Học cách chào hỏi thông dụng trong đời sống Việt Nam: Xin chào, Cảm ơn, Tạm biệt và cách xưng hô lịch sự.',
        descriptionVi: 'Học cách chào hỏi thông dụng trong đời sống Việt Nam: Xin chào, Cảm ơn, Tạm biệt và cách xưng hô lịch sự.',
        descriptionEn: 'Learn common Vietnamese greetings: Hello, Thank you, Goodbye, and polite addressing forms.',
        estimatedDuration: 10,
        xpReward: 20,
        objectives: ['Chào hỏi tự nhiên', 'Nhận biết phát âm Xin chào - Cảm ơn', 'Tự tin xưng hô ban đầu'],
        objectivesVi: ['Chào hỏi tự nhiên', 'Nhận biết phát âm Xin chào - Cảm ơn', 'Tự tin xưng hô ban đầu'],
        objectivesEn: ['Natural greetings', 'Pronounce Hello & Thank you correctly', 'Confident basic addressing'],
        isCompleted: false,
        learningStatus: 'AVAILABLE',
      },
      {
        id: 2,
        title: 'Bài 2: Bảng chữ cái & 6 thanh điệu',
        titleVi: 'Bài 2: Bảng chữ cái & 6 thanh điệu',
        titleEn: 'Lesson 2: Vietnamese Alphabet & 6 Tones',
        description: 'Khám phá bí mật 6 thanh điệu tiếng Việt (Ngang, Huyền, Sắc, Hỏi, Ngã, Nặng) với mô hình âm thanh trực quan.',
        descriptionVi: 'Khám phá bí mật 6 thanh điệu tiếng Việt (Ngang, Huyền, Sắc, Hỏi, Ngã, Nặng) với mô hình âm thanh trực quan.',
        descriptionEn: 'Unlock the secrets of 6 Vietnamese tones with interactive pitch contours.',
        estimatedDuration: 15,
        xpReward: 30,
        objectives: ['Phân biệt 6 dấu thanh', 'Thực hành các nguyên âm đặc trưng (ă, â, ê, ô, ơ, ư)', 'Luyện tai nghe cao độ'],
        objectivesVi: ['Phân biệt 6 dấu thanh', 'Thực hành các nguyên âm đặc trưng (ă, â, ê, ô, ơ, ư)', 'Luyện tai nghe cao độ'],
        objectivesEn: ['Distinguish 6 tone marks', 'Practice special vowels (ă, â, ê, ô, ơ, ư)', 'Train auditory pitch contour perception'],
        isCompleted: false,
        learningStatus: 'AVAILABLE',
      },
      {
        id: 3,
        title: 'Bài 3: Đếm số & Giá tiền',
        titleVi: 'Bài 3: Đếm số & Giá tiền',
        titleEn: 'Lesson 3: Numbers & Shopping Prices',
        description: 'Làm chủ các con số từ 1 đến 1.000.000 và cách hỏi giá tiền Việt Nam Đồng (VND) khi đi chợ hay mua sắm.',
        descriptionVi: 'Làm chủ các con số từ 1 đến 1.000.000 và cách hỏi giá tiền Việt Nam Đồng (VND) khi đi chợ hay mua sắm.',
        descriptionEn: 'Master numbers from 1 to 1,000,000 and learn to ask prices in VND at markets or shops.',
        estimatedDuration: 12,
        xpReward: 25,
        objectives: ['Đếm số trôi chảy từ 1 đến 100', 'Hỏi giá: "Bao nhiêu tiền một cái?"', 'Nhận diện mệnh giá tiền polymer'],
        objectivesVi: ['Đếm số trôi chảy từ 1 đến 100', 'Hỏi giá: "Bao nhiêu tiền một cái?"', 'Nhận diện mệnh giá tiền polymer'],
        objectivesEn: ['Count fluently from 1 to 100', 'Ask prices: "How much does it cost?"', 'Recognize polymer VND currency denominations'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 4,
        title: 'Bài 4: Giới thiệu bản thân & Quốc tịch',
        titleVi: 'Bài 4: Giới thiệu bản thân & Quốc tịch',
        titleEn: 'Lesson 4: Self-Introduction & Nationality',
        description: 'Tự tin giới thiệu tên tuổi, quê hương, nghề nghiệp và sở thích bằng các mẫu câu tiếng Việt tự nhiên.',
        descriptionVi: 'Tự tin giới thiệu tên tuổi, quê hương, nghề nghiệp và sở thích bằng các mẫu câu tiếng Việt tự nhiên.',
        descriptionEn: 'Confidently introduce your name, hometown, profession, and hobbies using natural Vietnamese patterns.',
        estimatedDuration: 15,
        xpReward: 35,
        objectives: ['Mẫu câu: "Tôi là...", "Tôi đến từ..."', 'Nói về nghề nghiệp và thời gian ở Việt Nam', 'Giao tiếp làm quen bạn mới'],
        objectivesVi: ['Mẫu câu: "Tôi là...", "Tôi đến từ..."', 'Nói về nghề nghiệp và thời gian ở Việt Nam', 'Giao tiếp làm quen bạn mới'],
        objectivesEn: ['Sentence patterns: "I am...", "I come from..."', 'Talk about profession and time in Vietnam', 'Make new Vietnamese friends easily'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 5,
        title: 'Bài 5: Ẩm thực & Gọi món quán ăn',
        titleVi: 'Bài 5: Ẩm thực & Gọi món quán ăn',
        titleEn: 'Lesson 5: Food & Ordering at Restaurants',
        description: 'Học từ vựng các món ăn Việt nức tiếng: Phở, Bánh mì, Bún chả, Cà phê sữa đá và cách gọi món chuẩn phong cách bản địa.',
        descriptionVi: 'Học từ vựng các món ăn Việt nức tiếng: Phở, Bánh mì, Bún chả, Cà phê sữa đá và cách gọi món chuẩn phong cách bản địa.',
        descriptionEn: 'Learn food vocabulary for famous Vietnamese dishes and order like a local.',
        estimatedDuration: 18,
        xpReward: 40,
        objectives: ['Gọi món và ghi chú đặc biệt (ít đá, không hành)', 'Hỏi xin hóa đơn: "Em ơi tính tiền!"', 'Khám phá văn hóa ẩm thực đường phố'],
        objectivesVi: ['Gọi món và ghi chú đặc biệt (ít đá, không hành)', 'Hỏi xin hóa đơn: "Em ơi tính tiền!"', 'Khám phá văn hóa ẩm thực đường phố'],
        objectivesEn: ['Order food with special notes (less ice, no scallions)', 'Ask for the bill: "Check please!"', 'Explore vibrant street food culture'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 6,
        title: 'Bài 6: Hỏi đường & Phương tiện đi lại',
        titleVi: 'Bài 6: Hỏi đường & Phương tiện đi lại',
        titleEn: 'Lesson 6: Asking Directions & Transportation',
        description: 'Cách hỏi đường, bắt xe ôm công nghệ (Grab, Be) và chỉ hướng rẽ trái, rẽ phải, đi thẳng tại phố phường Việt Nam.',
        descriptionVi: 'Cách hỏi đường, bắt xe ôm công nghệ (Grab, Be) và chỉ hướng rẽ trái, rẽ phải, đi thẳng tại phố phường Việt Nam.',
        descriptionEn: 'How to ask directions, use ride-hailing apps (Grab, Be), and navigate turns across Vietnam.',
        estimatedDuration: 14,
        xpReward: 30,
        objectives: ['Chỉ đường: rẽ trái, rẽ phải, đi thẳng', 'Giao tiếp với tài xế xe công nghệ', 'Nhận diện các địa danh quen thuộc'],
        objectivesVi: ['Chỉ đường: rẽ trái, rẽ phải, đi thẳng', 'Giao tiếp với tài xế xe công nghệ', 'Nhận diện các địa danh quen thuộc'],
        objectivesEn: ['Direct turns: turn left, turn right, go straight', 'Communicate with ride-hailing drivers', 'Identify familiar landmarks'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 7,
        title: 'Bài 7: Luyện phản xạ hội thoại AI',
        titleVi: 'Bài 7: Luyện phản xạ hội thoại AI',
        titleEn: 'Lesson 7: Conversational AI Reflex Practice',
        description: 'Thực hành tương tác trực tiếp với Gia sư AI thông minh để kiểm tra phản xạ nói và nhận phản hồi phát âm chuẩn xác.',
        descriptionVi: 'Thực hành tương tác trực tiếp với Gia sư AI thông minh để kiểm tra phản xạ nói và nhận phản hồi phát âm chuẩn xác.',
        descriptionEn: 'Engage in open-ended conversations with the smart AI Tutor to test speaking reflexes and get instant feedback.',
        estimatedDuration: 15,
        xpReward: 50,
        objectives: ['Luyện nói phản xạ không cần kịch bản', 'Nhận chấm điểm phát âm AI theo thời gian thực', 'Tự tin hội thoại thực tế'],
        objectivesVi: ['Luyện nói phản xạ không cần kịch bản', 'Nhận chấm điểm phát âm AI theo thời gian thực', 'Tự tin hội thoại thực tế'],
        objectivesEn: ['Unscripted conversational reflex practice', 'Receive real-time AI pronunciation feedback', 'Build confidence in real situations'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 8,
        title: 'Bài 8: Tổng kết & Thử thách chặng Sơ cấp',
        titleVi: 'Bài 8: Tổng kết & Thử thách chặng Sơ cấp',
        titleEn: 'Lesson 8: Final Review & Elementary Challenge',
        description: 'Kiểm tra tổng hợp kiến thức chặng Sơ cấp, nhận huy hiệu hoàn thành và mở khóa chặng tiếp theo.',
        descriptionVi: 'Kiểm tra tổng hợp kiến thức chặng Sơ cấp, nhận huy hiệu hoàn thành và mở khóa chặng tiếp theo.',
        descriptionEn: 'Comprehensive review across the Elementary stage to earn your completion badge and unlock next levels.',
        estimatedDuration: 20,
        xpReward: 80,
        objectives: ['Đạt 80%+ câu hỏi trắc nghiệm & nghe', 'Mở khóa chứng nhận Sơ cấp A1', 'Tích lũy trọn vẹn điểm thưởng chặng'],
        objectivesVi: ['Đạt 80%+ câu hỏi trắc nghiệm & nghe', 'Mở khóa chứng nhận Sơ cấp A1', 'Tích lũy trọn vẹn điểm thưởng chặng'],
        objectivesEn: ['Score 80%+ on quiz & listening challenges', 'Unlock digital Elementary A1 Certificate', 'Accumulate full stage bonus XP'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
    ],
  },

  A2: {
    units: [
      {
        unitNumber: 1,
        title: 'Gia Đình, Bạn Bè & Thói Quen Thường Nhật',
        titleEn: 'Family, Friends & Daily Routines',
        description: 'Kể về gia đình 3 thế hệ, mô tả ngoại hình, tính cách và sở thích hằng ngày.',
        descriptionEn: 'Talk about 3-generation families, describe appearance, personality, and daily hobbies.',
        gradient: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
        depthColor: '#115E59',
        lessonRange: [0, 2],
        guidebook: {
          summary: 'Đại từ xưng hô thân tộc và mẫu câu miêu tả tính cách, sở thích.',
          summaryEn: 'Kinship address forms and patterns describing personality and routines.',
          tips: [
            'Hệ thống xưng hô họ hàng tiếng Việt: ông bà nội/ngoại, cô, dì, chú, bác.',
            'Tính từ ghép miêu tả ngoại hình: cao ráo, mảnh khảnh, đẫm đà.',
            'Mẫu câu sở thích: "Mình rất thích nghe nhạc khi rảnh rỗi".',
          ],
          tipsEn: [
            'Vietnamese kinship titles: paternal/maternal grandparents, aunts, uncles.',
            'Compound adjectives for appearance: cao ráo (tall), hiền lành (gentle).',
            'Talking about hobbies: "Mình rất thích... khi rảnh rỗi".',
          ],
          vocabulary: [
            { vi: 'Gia đình', en: 'Family' },
            { vi: 'Ngoại hình', en: 'Appearance' },
            { vi: 'Tính cách', en: 'Personality' },
            { vi: 'Thói quen', en: 'Daily routine' },
          ],
        },
      },
      {
        unitNumber: 2,
        title: 'Đời Sống Đô Thị, Thời Tiết & Đi Lại',
        titleEn: 'Urban Living, Weather & Commuting',
        description: 'Khí hậu 4 mùa Việt Nam, cách hẹn giờ giấc chính xác và mua sắm tại chợ truyền thống.',
        descriptionEn: '4-season climate, setting appointments, and shopping in traditional markets.',
        gradient: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
        depthColor: '#0369A1',
        lessonRange: [3, 5],
        guidebook: {
          summary: 'Giao tiếp tình huống đô thị, cách đặt lịch hẹn và kỹ năng mua sắm bản địa.',
          summaryEn: 'Urban situational communication, setting appointments, and market shopping skills.',
          tips: [
            'Miền Bắc có 4 mùa rõ rệt, miền Nam có mùa mưa và mùa khô.',
            'Cách nói giờ hơn và giờ kém: "tám giờ mười lăm" hoặc "chín giờ kém mười".',
            'Mặc cả lịch sự: "Cô ơi bớt cho cháu một chút lấy may nhé!".',
          ],
          tipsEn: [
            'Northern Vietnam has 4 seasons; the South has rainy and dry seasons.',
            'Telling time: "tám giờ mười lăm" (8:15) or "chín giờ kém mười" (8:50).',
            'Polite bargaining: "Cô ơi bớt cho cháu một chút lấy may nhé!".',
          ],
          vocabulary: [
            { vi: 'Thời tiết', en: 'Weather' },
            { vi: 'Lịch hẹn', en: 'Appointment' },
            { vi: 'Siêu thị', en: 'Supermarket' },
            { vi: 'Mặc cả', en: 'Bargain' },
          ],
        },
      },
      {
        unitNumber: 3,
        title: 'Kể Chuyện Trải Nghiệm & Cột Mốc A2',
        titleEn: 'Sharing Experiences & A2 Milestone',
        description: 'Kể lại một chuyến đi đáng nhớ cùng Gia sư AI và hoàn thành kỳ thi đánh giá A2.',
        descriptionEn: 'Narrate a memorable trip with AI Tutor and pass the A2 comprehensive challenge.',
        gradient: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
        depthColor: '#3730A3',
        lessonRange: [6, 7],
        guidebook: {
          summary: 'Kỹ năng kể chuyện quá khứ và kết nối các ý trong đoạn văn tiếng Việt ngắn.',
          summaryEn: 'Past narration skills and connecting ideas in short Vietnamese paragraphs.',
          tips: [
            'Dùng các phó từ thời gian: đã, đang, sẽ để xác định mốc thời gian diễn ra sự việc.',
            'Sử dụng các từ nối: vì vậy, sau đó, tuy nhiên để câu chuyện thêm hấp dẫn.',
            'Chinh phục bài 8 để hoàn thành cấp độ A2 và tự tin bước sang B1!',
          ],
          tipsEn: [
            'Use aspect markers: đã (past), đang (continuous), sẽ (future).',
            'Connect ideas with: vì vậy (so), sau đó (after that), tuy nhiên (however).',
            'Conquer Lesson 8 to complete A2 and step into B1!',
          ],
          vocabulary: [
            { vi: 'Trải nghiệm', en: 'Experience' },
            { vi: 'Kỷ niệm', en: 'Memory' },
            { vi: 'Kể lại', en: 'Narrate / Tell' },
            { vi: 'Cột mốc A2', en: 'A2 Milestone' },
          ],
        },
      },
    ],
    lessons: [
      {
        id: 201,
        title: 'Bài 1: Gia đình & Mối quan hệ thân thuộc',
        titleVi: 'Bài 1: Gia đình & Mối quan hệ thân thuộc',
        titleEn: 'Lesson 1: Family & Kinship Relationships',
        description: 'Giới thiệu các thành viên trong gia đình 3 thế hệ và đại từ xưng hô chuẩn xác.',
        descriptionVi: 'Giới thiệu các thành viên trong gia đình 3 thế hệ và đại từ xưng hô chuẩn xác.',
        descriptionEn: 'Introduce family members across 3 generations and kinship address forms.',
        estimatedDuration: 12,
        xpReward: 25,
        objectives: ['Kể về gia đình 3 thế hệ', 'Xưng hô họ hàng nội ngoại', 'Nói về nghề nghiệp của người thân'],
        objectivesVi: ['Kể về gia đình 3 thế hệ', 'Xưng hô họ hàng nội ngoại', 'Nói về nghề nghiệp của người thân'],
        objectivesEn: ['Describe 3-generation families', 'Kinship address forms', 'Discuss relatives professions'],
        isCompleted: false,
        learningStatus: 'AVAILABLE',
      },
      {
        id: 202,
        title: 'Bài 2: Miêu tả ngoại hình & Tính cách',
        titleVi: 'Bài 2: Miêu tả ngoại hình & Tính cách',
        titleEn: 'Lesson 2: Describing Appearance & Personality',
        description: 'Học vốn từ miêu tả diện mạo, vóc dáng và tính cách con người Việt Nam.',
        descriptionVi: 'Học vốn từ miêu tả diện mạo, vóc dáng và tính cách con người Việt Nam.',
        descriptionEn: 'Learn vocabulary to describe facial features, physique, and personality traits.',
        estimatedDuration: 14,
        xpReward: 30,
        objectives: ['Từ vựng miêu tả diện mạo', 'Tính từ chỉ tính cách', 'Đặt câu so sánh hơn/nhất trong tiếng Việt'],
        objectivesVi: ['Từ vựng miêu tả diện mạo', 'Tính từ chỉ tính cách', 'Đặt câu so sánh hơn/nhất trong tiếng Việt'],
        objectivesEn: ['Appearance vocabulary', 'Personality adjectives', 'Make comparative sentences in Vietnamese'],
        isCompleted: false,
        learningStatus: 'AVAILABLE',
      },
      {
        id: 203,
        title: 'Bài 3: Sở thích & Thói quen hằng ngày',
        titleVi: 'Bài 3: Sở thích & Thói quen hằng ngày',
        titleEn: 'Lesson 3: Hobbies & Daily Routines',
        description: 'Bày tỏ sở thích cá nhân, thời gian rảnh rỗi và trạng từ chỉ tần suất.',
        descriptionVi: 'Bày tỏ sở thích cá nhân, thời gian rảnh rỗi và trạng từ chỉ tần suất.',
        descriptionEn: 'Express personal hobbies, leisure activities, and frequency adverbs.',
        estimatedDuration: 15,
        xpReward: 30,
        objectives: ['Mẫu câu: "Tôi thích...", "Tôi không thích..."', 'Nói về thời gian biểu một ngày', 'Sử dụng trạng từ: luôn luôn, thỉnh thoảng'],
        objectivesVi: ['Mẫu câu: "Tôi thích...", "Tôi không thích..."', 'Nói về thời gian biểu một ngày', 'Sử dụng trạng từ: luôn luôn, thỉnh thoảng'],
        objectivesEn: ['Patterns: "I like...", "I dislike..."', 'Describe a daily schedule', 'Use frequency adverbs'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 204,
        title: 'Bài 4: Thời tiết 4 mùa & Khí hậu vùng miền',
        titleVi: 'Bài 4: Thời tiết 4 mùa & Khí hậu vùng miền',
        titleEn: 'Lesson 4: 4 Seasons & Regional Climate',
        description: 'Khám phá sự khác biệt thời tiết giữa Bắc - Trung - Nam và mẫu câu dự báo.',
        descriptionVi: 'Khám phá sự khác biệt thời tiết giữa Bắc - Trung - Nam và mẫu câu dự báo.',
        descriptionEn: 'Explore climate differences between North, Central, and South Vietnam.',
        estimatedDuration: 14,
        xpReward: 30,
        objectives: ['Từ vựng thời tiết: nóng, lạnh, mưa rào, nồm ẩm', 'Mẫu câu hỏi thời tiết hôm nay', 'Chọn trang phục phù hợp khí hậu'],
        objectivesVi: ['Từ vựng thời tiết: nóng, lạnh, mưa rào, nồm ẩm', 'Mẫu câu hỏi thời tiết hôm nay', 'Chọn trang phục phù hợp khí hậu'],
        objectivesEn: ['Weather terms: hot, cold, shower, humid', 'Ask about daily weather', 'Pick suitable seasonal clothing'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 205,
        title: 'Bài 5: Đặt lịch hẹn, Giờ giấc & Sự kiện',
        titleVi: 'Bài 5: Đặt lịch hẹn, Giờ giấc & Sự kiện',
        titleEn: 'Lesson 5: Scheduling Appointments & Time',
        description: 'Mẫu câu hẹn gặp bạn bè, đồng nghiệp và diễn đạt thời gian chính xác.',
        descriptionVi: 'Mẫu câu hẹn gặp bạn bè, đồng nghiệp và diễn đạt thời gian chính xác.',
        descriptionEn: 'Arrange meetings with friends, colleagues, and express exact time.',
        estimatedDuration: 15,
        xpReward: 35,
        objectives: ['Mẫu câu: "Thứ mấy bạn rảnh?"', 'Cách nói giờ hơn và giờ kém', 'Nhận hoặc từ chối lịch hẹn lịch sự'],
        objectivesVi: ['Mẫu câu: "Thứ mấy bạn rảnh?"', 'Cách nói giờ hơn và giờ kém', 'Nhận hoặc từ chối lịch hẹn lịch sự'],
        objectivesEn: ['Phrase: "Which day are you free?"', 'Past and to hour time expressions', 'Accept or decline appointments politely'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 206,
        title: 'Bài 6: Mua sắm siêu thị & Mặc cả chợ',
        titleVi: 'Bài 6: Mua sắm siêu thị & Mặc cả chợ',
        titleEn: 'Lesson 6: Market Shopping & Polite Bargaining',
        description: 'Tự tin đi chợ truyền thống, hỏi nguồn gốc hàng hóa và mặc cả thân thiện.',
        descriptionVi: 'Tự tin đi chợ truyền thống, hỏi nguồn gốc hàng hóa và mặc cả thân thiện.',
        descriptionEn: 'Shop confidently in traditional markets, ask about origin, and bargain politely.',
        estimatedDuration: 16,
        xpReward: 35,
        objectives: ['So sánh mua hàng siêu thị và chợ', 'Mẫu câu mặc cả: "Bớt cho em một chút nhé!"', 'Hỏi xuất xứ và hạn sử dụng'],
        objectivesVi: ['So sánh mua hàng siêu thị và chợ', 'Mẫu câu mặc cả: "Bớt cho em một chút nhé!"', 'Hỏi xuất xứ và hạn sử dụng'],
        objectivesEn: ['Compare supermarket vs local market', 'Polite bargaining phrases', 'Ask about origin and expiry dates'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 207,
        title: 'Bài 7: AI Roleplay: Kể về chuyến đi đáng nhớ',
        titleVi: 'Bài 7: AI Roleplay: Kể về chuyến đi đáng nhớ',
        titleEn: 'Lesson 7: AI Roleplay - Tell a Travel Story',
        description: 'Luyện nói trôi chảy đoạn văn ngắn 1-2 phút cùng AI về một trải nghiệm thực tế.',
        descriptionVi: 'Luyện nói trôi chảy đoạn văn ngắn 1-2 phút cùng AI về một trải nghiệm thực tế.',
        descriptionEn: 'Practice fluent 1-2 minute storytelling with AI about a real-life experience.',
        estimatedDuration: 18,
        xpReward: 50,
        objectives: ['Sử dụng liên từ: hôm qua, sau đó, vì vậy', 'Kể lại một trải nghiệm thực tế', 'Nhận chấm điểm ngữ pháp AI'],
        objectivesVi: ['Sử dụng liên từ: hôm qua, sau đó, vì vậy', 'Kể lại một trải nghiệm thực tế', 'Nhận chấm điểm ngữ pháp AI'],
        objectivesEn: ['Use connectors: yesterday, after that, so', 'Narrate a personal experience', 'Get AI grammar feedback'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 208,
        title: 'Bài 8: Đánh giá tổng hợp & Chinh phục A2',
        titleVi: 'Bài 8: Đánh giá tổng hợp & Chinh phục A2',
        titleEn: 'Lesson 8: A2 Milestone Review & Challenge',
        description: 'Thử thách tổng hợp kiến thức chặng Sơ cấp A2 và nhận chứng nhận hoàn thành.',
        descriptionVi: 'Thử thách tổng hợp kiến thức chặng Sơ cấp A2 và nhận chứng nhận hoàn thành.',
        descriptionEn: 'Comprehensive challenge across Pre-Intermediate stage to earn your A2 certificate.',
        estimatedDuration: 22,
        xpReward: 80,
        objectives: ['Đạt 80%+ câu hỏi tổng hợp A2', 'Nắm vững từ vựng đời sống đô thị', 'Mở khóa chặng Trung cấp B1'],
        objectivesVi: ['Đạt 80%+ câu hỏi tổng hợp A2', 'Nắm vững từ vựng đời sống đô thị', 'Mở khóa chặng Trung cấp B1'],
        objectivesEn: ['Score 80%+ on A2 comprehensive quiz', 'Master urban lifestyle vocabulary', 'Unlock Intermediate B1 stage'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
    ],
  },

  B1: {
    units: [
      {
        unitNumber: 1,
        title: 'Du Lịch Khám Phá & Phong Tục Lễ Hội',
        titleEn: 'Travel Exploration & Cultural Festivals',
        description: 'Lên lịch trình du lịch xuyên Việt, khám phá phong tục Tết cổ truyền và xử lý tình huống phát sinh.',
        descriptionEn: 'Plan trips across Vietnam, explore Tet traditions, and handle travel inquiries.',
        gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
        depthColor: '#B45309',
        lessonRange: [0, 2],
        guidebook: {
          summary: 'Vốn từ du lịch khám phá và nét đẹp văn hóa lễ hội cổ truyền Việt Nam.',
          summaryEn: 'Travel discovery vocabulary and traditional Vietnamese festival customs.',
          tips: [
            'Tìm hiểu ý nghĩa phong tục Tết: xông đất, mừng tuổi, chúc Tết ông bà.',
            'Cách khiếu nại dịch vụ khách sạn văn minh: "Tôi muốn phản ánh về tình trạng phòng...".',
            'Khám phá ẩm thực đặc sản ba miền khi đi du lịch.',
          ],
          tipsEn: [
            'Learn Tet traditions: first-footer, lucky money, blessing elders.',
            'Polite service feedback: "Toi muon phan anh ve...".',
            'Explore 3-region culinary specialties when traveling.',
          ],
          vocabulary: [
            { vi: 'Lịch trình', en: 'Itinerary' },
            { vi: 'Phong tục Tết', en: 'Tet traditions' },
            { vi: 'Danh lam thắng cảnh', en: 'Scenic spots' },
            { vi: 'Xử lý sự cố', en: 'Problem resolution' },
          ],
        },
      },
      {
        unitNumber: 2,
        title: 'Môi Trường Công Việc & Học Tập',
        titleEn: 'Workplace & Academic Communication',
        description: 'Phỏng vấn tuyển dụng, viết email trao đổi công việc chuyên nghiệp và tranh luận văn minh.',
        descriptionEn: 'Job interviews, writing workplace emails, and engaging in constructive discussions.',
        gradient: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
        depthColor: '#0369A1',
        lessonRange: [3, 5],
        guidebook: {
          summary: 'Kỹ năng giao tiếp trong môi trường công sở và văn hóa doanh nghiệp tại Việt Nam.',
          summaryEn: 'Workplace communication and professional etiquette in Vietnam.',
          tips: [
            'Cấu trúc email công việc: Tiêu đề rõ ràng, Kính gửi, Nội dung gạch đầu dòng, Trân trọng.',
            'Bày tỏ ý kiến phản biện nhã nhặn: "Tôi rất đồng ý ở điểm A, tuy nhiên về điểm B...".',
            'Hiểu văn hóa làm việc nhóm và giao tiếp cấp bậc trong doanh nghiệp Việt.',
          ],
          tipsEn: [
            'Email structure: Clear subject, Dear..., bullet points, Regards.',
            'Diplomatic disagreement: "I agree with point A, however on point B...".',
            'Understand teamwork and hierarchy culture in Vietnamese companies.',
          ],
          vocabulary: [
            { vi: 'Phỏng vấn', en: 'Interview' },
            { vi: 'Email công việc', en: 'Work email' },
            { vi: 'Báo cáo tiến độ', en: 'Progress report' },
            { vi: 'Trình bày quan điểm', en: 'Present viewpoint' },
          ],
        },
      },
      {
        unitNumber: 3,
        title: 'Làm Chủ Diễn Đạt & Cột Mốc B1',
        titleEn: 'Independent Fluency & B1 Milestone',
        description: 'Thử thách đối thoại giải quyết vấn đề cùng AI và đánh giá toàn diện năng lực B1.',
        descriptionEn: 'Problem-solving dialogue challenge with AI and B1 milestone evaluation.',
        gradient: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
        depthColor: '#6D28D9',
        lessonRange: [6, 7],
        guidebook: {
          summary: 'Củng cố tư duy ngôn ngữ độc lập và chuẩn bị bước vào giai đoạn nâng cao.',
          summaryEn: 'Consolidate independent language thinking and prepare for advanced stages.',
          tips: [
            'Tự tin diễn đạt ý kiến dài 2-3 phút mà không cần dịch từ tiếng mẹ đẻ.',
            'Luyện thói quen đọc báo và nghe podcast tiếng Việt mỗi ngày.',
            'Vượt qua bài 8 để chính thức sở hữu danh hiệu Người học Độc lập B1!',
          ],
          tipsEn: [
            'Express thoughts in 2-3 minute flows without translating from native language.',
            'Read Vietnamese articles and listen to podcasts regularly.',
            'Conquer Lesson 8 to officially achieve B1 Independent Learner status!',
          ],
          vocabulary: [
            { vi: 'Tự chủ', en: 'Independent' },
            { vi: 'Hùng biện', en: 'Eloquence / Debate' },
            { vi: 'Quan điểm', en: 'Viewpoint' },
            { vi: 'Chuẩn B1', en: 'B1 Certified' },
          ],
        },
      },
    ],
    lessons: [
      {
        id: 301,
        title: 'Bài 1: Lên lịch trình du lịch xuyên Việt',
        titleVi: 'Bài 1: Lên lịch trình du lịch xuyên Việt',
        titleEn: 'Lesson 1: Planning a Trans-Vietnam Journey',
        description: 'Lập kế hoạch du lịch chi tiết: địa điểm, phương tiện và đặt dịch vụ bằng tiếng Việt.',
        descriptionVi: 'Lập kế hoạch du lịch chi tiết: địa điểm, phương tiện và đặt dịch vụ bằng tiếng Việt.',
        descriptionEn: 'Plan travel itineraries in detail: destinations, transport, and bookings in Vietnamese.',
        estimatedDuration: 15,
        xpReward: 30,
        objectives: ['Lên kế hoạch du lịch xuyên Việt', 'Đặt phòng khách sạn và vé tàu xe', 'Hỏi kinh nghiệm từ dân bản địa'],
        objectivesVi: ['Lên kế hoạch du lịch xuyên Việt', 'Đặt phòng khách sạn và vé tàu xe', 'Hỏi kinh nghiệm từ dân bản địa'],
        objectivesEn: ['Plan trips across Vietnam', 'Book hotels and train/bus tickets', 'Ask travel tips from locals'],
        isCompleted: false,
        learningStatus: 'AVAILABLE',
      },
      {
        id: 302,
        title: 'Bài 2: Phong tục Tết cổ truyền & Ngày hội văn hóa',
        titleVi: 'Bài 2: Phong tục Tết cổ truyền & Ngày hội văn hóa',
        titleEn: 'Lesson 2: Tet Customs & Cultural Festivals',
        description: 'Hiểu ý nghĩa các ngày lễ lớn, phong tục Tết Nguyên Đán và lời chúc đầu năm.',
        descriptionVi: 'Hiểu ý nghĩa các ngày lễ lớn, phong tục Tết Nguyên Đán và lời chúc đầu năm.',
        descriptionEn: 'Understand major holidays, Lunar New Year customs, and festive greetings.',
        estimatedDuration: 16,
        xpReward: 35,
        objectives: ['Từ vựng phong tục Tết cổ truyền', 'Mẫu câu chúc Tết ý nghĩa', 'Hiểu văn hóa sum họp gia đình'],
        objectivesVi: ['Từ vựng phong tục Tết cổ truyền', 'Mẫu câu chúc Tết ý nghĩa', 'Hiểu văn hóa sum họp gia đình'],
        objectivesEn: ['Tet customs vocabulary', 'Meaningful New Year wishes', 'Understand family reunion culture'],
        isCompleted: false,
        learningStatus: 'AVAILABLE',
      },
      {
        id: 303,
        title: 'Bài 3: Xử lý tình huống phát sinh khi du lịch',
        titleVi: 'Bài 3: Xử lý tình huống phát sinh khi du lịch',
        titleEn: 'Lesson 3: Handling Travel Inquiries & Emergencies',
        description: 'Giải thích sự cố khi du lịch, khiếu nại dịch vụ và đề nghị hỗ trợ lịch sự.',
        descriptionVi: 'Giải thích sự cố khi du lịch, khiếu nại dịch vụ và đề nghị hỗ trợ lịch sự.',
        descriptionEn: 'Explain travel issues, handle service complaints, and request support politely.',
        estimatedDuration: 16,
        xpReward: 35,
        objectives: ['Trình bày sự cố lịch sự', 'Đề nghị giải quyết và bồi hoàn', 'Điền biểu mẫu thông tin dịch vụ'],
        objectivesVi: ['Trình bày sự cố lịch sự', 'Đề nghị giải quyết và bồi hoàn', 'Điền biểu mẫu thông tin dịch vụ'],
        objectivesEn: ['State issues courteously', 'Request remedies and refunds', 'Fill out service feedback forms'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 304,
        title: 'Bài 4: Phỏng vấn tuyển dụng & Hồ sơ xin việc',
        titleVi: 'Bài 4: Phỏng vấn tuyển dụng & Hồ sơ xin việc',
        titleEn: 'Lesson 4: Job Interviews & Professional Profiles',
        description: 'Giới thiệu bản thân, trình bày kinh nghiệm làm việc và trả lời phỏng vấn chuyên nghiệp.',
        descriptionVi: 'Giới thiệu bản thân, trình bày kinh nghiệm làm việc và trả lời phỏng vấn chuyên nghiệp.',
        descriptionEn: 'Present professional qualifications, experience, and answer interview questions.',
        estimatedDuration: 18,
        xpReward: 40,
        objectives: ['Trình bày kinh nghiệm làm việc', 'Trả lời câu hỏi điểm mạnh/yếu', 'Thảo luận chế độ đãi ngộ'],
        objectivesVi: ['Trình bày kinh nghiệm làm việc', 'Trả lời câu hỏi điểm mạnh/yếu', 'Thảo luận chế độ đãi ngộ'],
        objectivesEn: ['Present career experience', 'Discuss strengths and weaknesses', 'Discuss compensation and expectations'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 305,
        title: 'Bài 5: Soạn thảo email & Trao đổi công việc',
        titleVi: 'Bài 5: Soạn thảo email & Trao đổi công việc',
        titleEn: 'Lesson 5: Professional Email & Work Correspondence',
        description: 'Quy chuẩn viết email công việc tiếng Việt và giao tiếp hiệu quả nơi công sở.',
        descriptionVi: 'Quy chuẩn viết email công việc tiếng Việt và giao tiếp hiệu quả nơi công sở.',
        descriptionEn: 'Standard workplace email conventions and efficient business correspondence.',
        estimatedDuration: 16,
        xpReward: 40,
        objectives: ['Soạn thảo email công việc chuẩn mực', 'Báo cáo tiến độ và deadline', 'Trao đổi chuyên nghiệp với đồng nghiệp'],
        objectivesVi: ['Soạn thảo email công việc chuẩn mực', 'Báo cáo tiến độ và deadline', 'Trao đổi chuyên nghiệp với đồng nghiệp'],
        objectivesEn: ['Draft standard work emails', 'Report progress and deadlines', 'Communicate professionally with peers'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 306,
        title: 'Bài 6: Thảo luận, tranh luận & Trình bày quan điểm',
        titleVi: 'Bài 6: Thảo luận, tranh luận & Trình bày quan điểm',
        titleEn: 'Lesson 6: Discussion, Debate & Expressing Viewpoints',
        description: 'Bày tỏ quan điểm cá nhân, đồng tình, phản biện lịch sự và đưa dẫn chứng thuyết phục.',
        descriptionVi: 'Bày tỏ quan điểm cá nhân, đồng tình, phản biện lịch sự và đưa dẫn chứng thuyết phục.',
        descriptionEn: 'Express personal viewpoints, polite agreement/disagreement, and convincing rationale.',
        estimatedDuration: 18,
        xpReward: 45,
        objectives: ['Mẫu câu: "Theo quan điểm của tôi..."', 'Phản biện lịch sự và nhã nhặn', 'Xây dựng lập luận logic'],
        objectivesVi: ['Mẫu câu: "Theo quan điểm của tôi..."', 'Phản biện lịch sự và nhã nhặn', 'Xây dựng lập luận logic'],
        objectivesEn: ['Pattern: "In my opinion..."', 'Polite and diplomatic counterarguments', 'Construct logical reasoning'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 307,
        title: 'Bài 7: AI Roleplay: Đối thoại giải quyết tình huống',
        titleVi: 'Bài 7: AI Roleplay: Đối thoại giải quyết tình huống',
        titleEn: 'Lesson 7: AI Roleplay - Situational Problem Solving',
        description: 'Tương tác đối thoại mở giải quyết tình huống công việc phức tạp với Gia sư AI.',
        descriptionVi: 'Tương tác đối thoại mở giải quyết tình huống công việc phức tạp với Gia sư AI.',
        descriptionEn: 'Open conversational problem-solving in complex work scenarios with AI Tutor.',
        estimatedDuration: 20,
        xpReward: 60,
        objectives: ['Phản xạ đối thoại mở không kịch bản', 'Giải quyết vấn đề linh hoạt', 'Nhận đánh giá độ lưu loát AI'],
        objectivesVi: ['Phản xạ đối thoại mở không kịch bản', 'Giải quyết vấn đề linh hoạt', 'Nhận đánh giá độ lưu loát AI'],
        objectivesEn: ['Unscripted conversational reflexes', 'Flexible problem resolution', 'Get AI fluency and tone analytics'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 308,
        title: 'Bài 8: Đánh giá năng lực toàn diện & Cột mốc B1',
        titleVi: 'Bài 8: Đánh giá năng lực toàn diện & Cột mốc B1',
        titleEn: 'Lesson 8: B1 Comprehensive Milestone Challenge',
        description: 'Vượt qua bài kiểm tra đánh giá năng lực ngôn ngữ B1 và nhận chứng nhận chính thức.',
        descriptionVi: 'Vượt qua bài kiểm tra đánh giá năng lực ngôn ngữ B1 và nhận chứng nhận chính thức.',
        descriptionEn: 'Pass the B1 language proficiency test and earn your official completion badge.',
        estimatedDuration: 25,
        xpReward: 90,
        objectives: ['Đạt 80%+ bài đánh giá B1', 'Làm chủ giao tiếp độc lập', 'Mở khóa chặng Cao cấp B2'],
        objectivesVi: ['Đạt 80%+ bài đánh giá B1', 'Làm chủ giao tiếp độc lập', 'Mở khóa chặng Cao cấp B2'],
        objectivesEn: ['Score 80%+ on B1 evaluation', 'Master independent conversation', 'Unlock Upper-Intermediate B2'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
    ],
  },

  B2: {
    units: [
      {
        unitNumber: 1,
        title: 'Kinh Doanh, Đàm Phán & Báo Chí',
        titleEn: 'Business, Negotiation & Media',
        description: 'Thuật ngữ thương mại, đàm phán hợp đồng kinh tế và đọc hiểu tin tức thời sự chuyên sâu.',
        descriptionEn: 'Commercial terms, contract negotiations, and in-depth news analysis.',
        gradient: 'linear-gradient(135deg, #7C2D12 0%, #C2410C 100%)',
        depthColor: '#451A03',
        lessonRange: [0, 2],
        guidebook: {
          summary: 'Thuật ngữ kinh tế tài chính và phương pháp phân tích báo chí chuyên đề.',
          summaryEn: 'Financial terms and methodologies for thematic news analysis.',
          tips: [
            'Làm quen với các cụm từ đàm phán: "điều khoản thanh toán", "nghĩa vụ hợp đồng", "quyền lợi song phương".',
            'Đọc lướt nhanh các tiêu đề báo kinh tế để nắm bắt xu hướng thị trường.',
            'Cấu trúc bài thuyết trình chuyên nghiệp: Mở đầu ấn tượng, Luận chứng 3 điểm, Kêu gọi hành động.',
          ],
          tipsEn: [
            'Master negotiation terms: payment terms, obligations, bilateral benefits.',
            'Skim economic headlines to capture market trends quickly.',
            'Presentation structure: Impactful opening, 3 key arguments, Call to action.',
          ],
          vocabulary: [
            { vi: 'Đàm phán', en: 'Negotiate' },
            { vi: 'Hợp đồng thương mại', en: 'Commercial contract' },
            { vi: 'Thời sự', en: 'Current affairs' },
            { vi: 'Báo cáo thị trường', en: 'Market report' },
          ],
        },
      },
      {
        unitNumber: 2,
        title: 'Chiều Sâu Văn Hóa, Ca Dao Tục Ngữ & Xã Hội',
        titleEn: 'Cultural Depth, Proverbs & Contemporary Society',
        description: 'Thành ngữ tục ngữ thông dụng, thảo luận xu hướng xã hội và giao tiếp liên văn hóa.',
        descriptionEn: 'Vietnamese idioms, discussing social trends, and cross-cultural communication.',
        gradient: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        depthColor: '#0F0D24',
        lessonRange: [3, 5],
        guidebook: {
          summary: 'Sắc thái biểu cảm của ca dao, tục ngữ và nghệ thuật ứng xử tinh tế của người Việt.',
          summaryEn: 'Expressive nuances of proverbs and subtle Vietnamese cultural communication.',
          tips: [
            'Hiểu nghĩa bóng của các câu tục ngữ: "Uống nước nhớ nguồn", "Lá lành đùm lá rách".',
            'Giao tiếp gián tiếp tinh tế trong các tình huống nhạy cảm.',
            'Bàn luận các vấn đề thời sự: phát triển bền vững, công nghệ và biến đổi xã hội.',
          ],
          tipsEn: [
            'Understand figurative meanings of proverbs like "Uống nước nhớ nguồn".',
            'Diplomatic indirect speech in culturally sensitive situations.',
            'Discuss modern issues: sustainable growth, tech, and societal change.',
          ],
          vocabulary: [
            { vi: 'Thành ngữ', en: 'Idiom' },
            { vi: 'Tục ngữ', en: 'Proverb' },
            { vi: 'Xu hướng xã hội', en: 'Social trend' },
            { vi: 'Liên văn hóa', en: 'Cross-cultural' },
          ],
        },
      },
      {
        unitNumber: 3,
        title: 'Tranh Luận Đa Chiều & Cột Mốc B2',
        titleEn: 'Multi-Perspective Debate & B2 Milestone',
        description: 'AI Roleplay đàm phán hợp đồng căng thẳng và kỳ thi đánh giá năng lực B2.',
        descriptionEn: 'High-stakes AI contract negotiation and B2 comprehensive evaluation.',
        gradient: 'linear-gradient(135deg, #831843 0%, #BE185D 100%)',
        depthColor: '#500724',
        lessonRange: [6, 7],
        guidebook: {
          summary: 'Nâng cao khả năng biện luận logic và phản xạ ngôn ngữ ở trình độ cao cấp.',
          summaryEn: 'Elevate logical argumentation and high-level conversational reflexes.',
          tips: [
            'Giữ vững lập trường trong tranh luận bằng luận cứ xác thực và dẫn chứng cụ thể.',
            'Làm chủ ngữ điệu nhấn giọng để tăng tính thuyết phục của phát ngôn.',
            'Vượt qua bài 8 để sở hữu chứng chỉ Cao cấp B2!',
          ],
          tipsEn: [
            'Maintain stance during debates using verified facts and evidence.',
            'Master vocal emphasis to elevate persuasiveness.',
            'Pass Lesson 8 to claim your Upper-Intermediate B2 credential!',
          ],
          vocabulary: [
            { vi: 'Biện luận', en: 'Argumentation' },
            { vi: 'Thuyết phục', en: 'Persuade' },
            { vi: 'Sắc sảo', en: 'Sharp / Incisive' },
            { vi: 'Chứng chỉ B2', en: 'B2 Certificate' },
          ],
        },
      },
    ],
    lessons: [
      {
        id: 401,
        title: 'Bài 1: Thuật ngữ kinh doanh & Đàm phán thương mại',
        titleVi: 'Bài 1: Thuật ngữ kinh doanh & Đàm phán thương mại',
        titleEn: 'Lesson 1: Business Terms & Commercial Negotiation',
        description: 'Làm chủ hệ thống thuật ngữ thương mại và mẫu câu đàm phán hợp đồng chuyên nghiệp.',
        descriptionVi: 'Làm chủ hệ thống thuật ngữ thương mại và mẫu câu đàm phán hợp đồng chuyên nghiệp.',
        descriptionEn: 'Master commercial vocabulary and professional contract negotiation expressions.',
        estimatedDuration: 18,
        xpReward: 40,
        objectives: ['Nắm vững thuật ngữ thương mại', 'Đàm phán điều khoản thanh toán', 'Thỏa thuận cam kết song phương'],
        objectivesVi: ['Nắm vững thuật ngữ thương mại', 'Đàm phán điều khoản thanh toán', 'Thỏa thuận cam kết song phương'],
        objectivesEn: ['Master commercial vocabulary', 'Negotiate payment terms', 'Agree on bilateral commitments'],
        isCompleted: false,
        learningStatus: 'AVAILABLE',
      },
      {
        id: 402,
        title: 'Bài 2: Đọc hiểu báo chí & Phân tích thời sự',
        titleVi: 'Bài 2: Đọc hiểu báo chí & Phân tích thời sự',
        titleEn: 'Lesson 2: News Media Reading & Current Affairs Analysis',
        description: 'Đọc hiểu nhanh báo chí kinh tế - xã hội và tóm tắt tin tức thời sự chính luận.',
        descriptionVi: 'Đọc hiểu nhanh báo chí kinh tế - xã hội và tóm tắt tin tức thời sự chính luận.',
        descriptionEn: 'Read socio-economic journalism rapidly and summarize political-economic news.',
        estimatedDuration: 20,
        xpReward: 45,
        objectives: ['Đọc hiểu báo chí chuyên sâu', 'Phân tích số liệu và biểu đồ', 'Tóm tắt bài viết 500 từ'],
        objectivesVi: ['Đọc hiểu báo chí chuyên sâu', 'Phân tích số liệu và biểu đồ', 'Tóm tắt bài viết 500 từ'],
        objectivesEn: ['In-depth news reading', 'Analyze data and infographics', 'Summarize 500-word articles'],
        isCompleted: false,
        learningStatus: 'AVAILABLE',
      },
      {
        id: 403,
        title: 'Bài 3: Thuyết trình chiến lược & Báo cáo thị trường',
        titleVi: 'Bài 3: Thuyết trình chiến lược & Báo cáo thị trường',
        titleEn: 'Lesson 3: Strategic Presentations & Market Reports',
        description: 'Kỹ năng thuyết trình chuyên đề bằng tiếng Việt tự tin trước ban lãnh đạo và đối tác.',
        descriptionVi: 'Kỹ năng thuyết trình chuyên đề bằng tiếng Việt tự tin trước ban lãnh đạo và đối tác.',
        descriptionEn: 'Deliver thematic presentations in Vietnamese with confidence before executives and partners.',
        estimatedDuration: 20,
        xpReward: 45,
        objectives: ['Cấu trúc bài thuyết trình chuyên nghiệp', 'Sử dụng từ nối chuyển ý uyển chuyển', 'Xử lý câu hỏi phản biện'],
        objectivesVi: ['Cấu trúc bài thuyết trình chuyên nghiệp', 'Sử dụng từ nối chuyển ý uyển chuyển', 'Xử lý câu hỏi phản biện'],
        objectivesEn: ['Professional presentation structure', 'Smooth transitional phrases', 'Handle audience Q&A deftly'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 404,
        title: 'Bài 4: Thành ngữ & Tục ngữ Việt Nam ứng dụng',
        titleVi: 'Bài 4: Thành ngữ & Tục ngữ Việt Nam ứng dụng',
        titleEn: 'Lesson 4: Applied Vietnamese Idioms & Proverbs',
        description: 'Hiểu chiều sâu văn hóa và vận dụng thành ngữ tự nhiên trong giao tiếp thường nhật.',
        descriptionVi: 'Hiểu chiều sâu văn hóa và vận dụng thành ngữ tự nhiên trong giao tiếp thường nhật.',
        descriptionEn: 'Understand cultural depth and naturally deploy idioms in daily and professional discourse.',
        estimatedDuration: 18,
        xpReward: 40,
        objectives: ['Hiểu nghĩa đen và nghĩa bóng', 'Vận dụng 30 thành ngữ phổ biến', 'Tăng chiều sâu cho lời nói'],
        objectivesVi: ['Hiểu nghĩa đen và nghĩa bóng', 'Vận dụng 30 thành ngữ phổ biến', 'Tăng chiều sâu cho lời nói'],
        objectivesEn: ['Literal vs figurative meanings', 'Apply 30 common idioms', 'Add depth to communication'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 405,
        title: 'Bài 5: Phân tích xu hướng xã hội đương đại',
        titleVi: 'Bài 5: Phân tích xu hướng xã hội đương đại',
        titleEn: 'Lesson 5: Analyzing Modern Societal Trends',
        description: 'Bàn luận các vấn đề: chuyển đổi số, môi trường, phát triển đô thị và biến đổi văn hóa.',
        descriptionVi: 'Bàn luận các vấn đề: chuyển đổi số, môi trường, phát triển đô thị và biến đổi văn hóa.',
        descriptionEn: 'Discuss digital transformation, sustainability, urbanization, and cultural evolution.',
        estimatedDuration: 20,
        xpReward: 45,
        objectives: ['Diễn đạt lập luận đa chiều', 'Nêu giải pháp và kiến nghị', 'Viết đoạn văn nghị luận 300 từ'],
        objectivesVi: ['Diễn đạt lập luận đa chiều', 'Nêu giải pháp và kiến nghị', 'Viết đoạn văn nghị luận 300 từ'],
        objectivesEn: ['Multi-perspective arguments', 'Propose constructive recommendations', 'Write 300-word commentary'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 406,
        title: 'Bài 6: Giao tiếp liên văn hóa & Ứng xử tinh tế',
        titleVi: 'Bài 6: Giao tiếp liên văn hóa & Ứng xử tinh tế',
        titleEn: 'Lesson 6: Cross-Cultural Communication & Etiquette',
        description: 'Nghệ thuật giao tiếp gián tiếp, thấu hiểu tâm lý ứng xử và tránh điều kiêng kỵ văn hóa.',
        descriptionVi: 'Nghệ thuật giao tiếp gián tiếp, thấu hiểu tâm lý ứng xử và tránh điều kiêng kỵ văn hóa.',
        descriptionEn: 'The art of indirect speech, psychological nuances, and avoiding cultural taboos.',
        estimatedDuration: 18,
        xpReward: 45,
        objectives: ['Giao tiếp gián tiếp tinh tế', 'Thấu hiểu bối cảnh xưng hô', 'Tránh xung đột văn hóa'],
        objectivesVi: ['Giao tiếp gián tiếp tinh tế', 'Thấu hiểu bối cảnh xưng hô', 'Tránh xung đột văn hóa'],
        objectivesEn: ['Subtle indirect speech', 'Context-aware addressing', 'Prevent cultural misunderstanding'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 407,
        title: 'Bài 7: AI Roleplay: Đàm phán hợp đồng căng thẳng',
        titleVi: 'Bài 7: AI Roleplay: Đàm phán hợp đồng căng thẳng',
        titleEn: 'Lesson 7: AI Roleplay - High-Stakes Contract Negotiation',
        description: 'Đối thoại đối kháng đàm phán hợp đồng thương mại gay cấn với đối tác AI.',
        descriptionVi: 'Đối thoại đối kháng đàm phán hợp đồng thương mại gay cấn với đối tác AI.',
        descriptionEn: 'Adversarial commercial negotiation practice under pressure with AI partner.',
        estimatedDuration: 22,
        xpReward: 65,
        objectives: ['Bảo vệ lập trường kiên quyết', 'Đàm phán giải pháp win-win', 'Nhận phân tích chiến lược ngôn từ'],
        objectivesVi: ['Bảo vệ lập trường kiên quyết', 'Đàm phán giải pháp win-win', 'Nhận phân tích chiến lược ngôn từ'],
        objectivesEn: ['Defend commercial stance', 'Negotiate win-win solutions', 'Get AI strategic diction analytics'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 408,
        title: 'Bài 8: Đánh giá chuyên sâu B2 & Về đích',
        titleVi: 'Bài 8: Đánh giá chuyên sâu B2 & Về đích',
        titleEn: 'Lesson 8: B2 Advanced Comprehensive Assessment',
        description: 'Kỳ thi tốt nghiệp chặng Cao cấp B2 khẳng định năng lực làm việc hoàn toàn bằng tiếng Việt.',
        descriptionVi: 'Kỳ thi tốt nghiệp chặng Cao cấp B2 khẳng định năng lực làm việc hoàn toàn bằng tiếng Việt.',
        descriptionEn: 'B2 graduation challenge confirming ability to operate entirely in Vietnamese.',
        estimatedDuration: 30,
        xpReward: 100,
        objectives: ['Đạt 80%+ bài thi năng lực B2', 'Khẳng định năng lực làm việc', 'Mở khóa chặng Thành thạo C1'],
        objectivesVi: ['Đạt 80%+ bài thi năng lực B2', 'Khẳng định năng lực làm việc', 'Mở khóa chặng Thành thạo C1'],
        objectivesEn: ['Score 80%+ on B2 assessment', 'Confirm professional proficiency', 'Unlock C1 Mastery stage'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
    ],
  },

  C1: {
    units: [
      {
        unitNumber: 1,
        title: 'Tinh Hoa Văn Học, Nghệ Thuật & Bản Sắc',
        titleEn: 'Literary Mastery & Cultural Identity',
        description: 'Ngôn ngữ thi ca cổ điển, nghệ thuật sân khấu truyền thống và triết lý nhân sinh dân tộc.',
        descriptionEn: 'Classical poetic diction, traditional performing arts, and national cultural philosophy.',
        gradient: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)',
        depthColor: '#2E1065',
        lessonRange: [0, 2],
        guidebook: {
          summary: 'Cảm thụ nghệ thuật ngôn từ qua kho tàng văn học và sân khấu dân gian Việt Nam.',
          summaryEn: 'Appreciating verbal artistry through Vietnamese literature and traditional theater.',
          tips: [
            'Tìm hiểu thể thơ lục bát và vẻ đẹp vần điệu trong Truyện Kiều.',
            'Phân tích nghệ thuật biểu diễn dân gian: Chèo, Tuồng, Ca trù, Đờn ca tài tử.',
            'Cảm nhận triết lý nhân sinh: đạo hiếu, nghĩa tình và lòng khoan dung.',
          ],
          tipsEn: [
            'Explore lục bát poetry and melodic meter in Tale of Kiều.',
            'Analyze traditional theater: Chèo, Tuồng, Ca trù, Đờn ca tài tử.',
            'Reflect on philosophy: filial piety, gratitude, compassion.',
          ],
          vocabulary: [
            { vi: 'Tinh hoa thi ca', en: 'Poetic essence' },
            { vi: 'Sân khấu cổ truyền', en: 'Traditional theater' },
            { vi: 'Triết lý nhân sinh', en: 'Humanistic philosophy' },
            { vi: 'Bản sắc văn hóa', en: 'Cultural identity' },
          ],
        },
      },
      {
        unitNumber: 2,
        title: 'Học Thuật Chuyên Sâu, Nghị Luận & Biện Luận',
        titleEn: 'Academic Discourse, Argumentation & Debate',
        description: 'Văn phong nghị luận khoa học, nghệ thuật hàm ngôn và diễn thuyết phản biện trước hội thảo.',
        descriptionEn: 'Academic argumentation, pragmatic presupposition, and conference speech debating.',
        gradient: 'linear-gradient(135deg, #1C1917 0%, #44403C 100%)',
        depthColor: '#0C0A09',
        lessonRange: [3, 5],
        guidebook: {
          summary: 'Phương pháp viết luận khoa học và nghệ thuật sử dụng hàm ngôn tinh vi.',
          summaryEn: 'Scientific writing methodology and mastering subtle pragmatic nuances.',
          tips: [
            'Sử dụng thuật ngữ chính xác tuyệt đối trong các văn bản học thuật chuyên sâu.',
            'Làm chủ hàm ngôn, nói giảm nói tránh để tạo tính uyển chuyển cao nhất.',
            'Kỹ năng hùng biện và phản biện thuyết phục trước công chúng quốc tế.',
          ],
          tipsEn: [
            'Deploy precise terminology in scholarly publications.',
            'Master pragmatic presuppositions and euphemisms.',
            'Public speaking and conference debate skills before global audiences.',
          ],
          vocabulary: [
            { vi: 'Nghị luận học thuật', en: 'Academic argumentation' },
            { vi: 'Hàm ngôn', en: 'Pragmatic presupposition' },
            { vi: 'Tu từ học', en: 'Rhetoric / Stylistics' },
            { vi: 'Diễn thuyết', en: 'Public oration' },
          ],
        },
      },
      {
        unitNumber: 3,
        title: 'Đỉnh Cao Năng Lực & Chứng Nhận C1',
        titleEn: 'Summit Proficiency & C1 Milestone',
        description: 'AI Roleplay phản biện học thuật đa chiều và luận giải chuyên đề tốt nghiệp C1.',
        descriptionEn: 'Critical academic defense with AI and C1 master dissertation challenge.',
        gradient: 'linear-gradient(135deg, #831843 0%, #9D174D 100%)',
        depthColor: '#500724',
        lessonRange: [6, 7],
        guidebook: {
          summary: 'Chứng nhận mức độ thành thạo tương đương người bản ngữ có học thức cao.',
          summaryEn: 'Attaining native-like mastery of cultivated Vietnamese speech and writing.',
          tips: [
            'Tự do sáng tạo ngôn từ và làm chủ mọi sắc thái biểu đạt tinh tế nhất.',
            'Đóng góp tiếng nói trong các diễn đàn học thuật và văn hóa quốc tế.',
            'Chúc mừng bạn đã chinh phục đỉnh cao tiếng Việt cùng HolaVietnamese!',
          ],
          tipsEn: [
            'Creatively craft language and master every subtle nuance.',
            'Contribute in international academic and cultural forums.',
            'Congratulations on conquering the summit with HolaVietnamese!',
          ],
          vocabulary: [
            { vi: 'Thành thạo', en: 'Mastery / Near-native' },
            { vi: 'Bản ngữ học thức', en: 'Cultivated native speaker' },
            { vi: 'Luận giải chuyên đề', en: 'Thematic dissertation' },
            { vi: 'Đỉnh cao C1', en: 'C1 Summit' },
          ],
        },
      },
    ],
    lessons: [
      {
        id: 501,
        title: 'Bài 1: Ngôn ngữ thi ca & Văn học cổ điển',
        titleVi: 'Bài 1: Ngôn ngữ thi ca & Văn học cổ điển',
        titleEn: 'Lesson 1: Classical Poetry & Literary Heritage',
        description: 'Tiếp cận các áng thơ văn kinh điển và cảm nhận nhạc tính độc đáo của tiếng Việt.',
        descriptionVi: 'Tiếp cận các áng thơ văn kinh điển và cảm nhận nhạc tính độc đáo của tiếng Việt.',
        descriptionEn: 'Explore classic Vietnamese poetry and sense the unique musicality of the language.',
        estimatedDuration: 20,
        xpReward: 50,
        objectives: ['Cảm thụ thể thơ lục bát & song thất lục bát', 'Phân tích tầng nghĩa biểu tượng', 'Cảm nhận nhạc tính thanh điệu'],
        objectivesVi: ['Cảm thụ thể thơ lục bát & song thất lục bát', 'Phân tích tầng nghĩa biểu tượng', 'Cảm nhận nhạc tính thanh điệu'],
        objectivesEn: ['Appreciate classic poetic meters', 'Analyze symbolic figurative layers', 'Sense tone-based musicality'],
        isCompleted: false,
        learningStatus: 'AVAILABLE',
      },
      {
        id: 502,
        title: 'Bài 2: Nghệ thuật sân khấu truyền thống',
        titleVi: 'Bài 2: Nghệ thuật sân khấu truyền thống',
        titleEn: 'Lesson 2: Traditional Performing Arts',
        description: 'Tìm hiểu Chèo, Tuồng, Ca trù, Cải lương và mỹ học dân gian trong ngôn ngữ kịch.',
        descriptionVi: 'Tìm hiểu Chèo, Tuồng, Ca trù, Cải lương và mỹ học dân gian trong ngôn ngữ kịch.',
        descriptionEn: 'Study Cheo, Tuong, Ca tru, Cai luong, and theatrical folk aesthetics.',
        estimatedDuration: 20,
        xpReward: 50,
        objectives: ['Từ vựng sân khấu dân gian', 'Phân tích nhân vật văn học kinh điển', 'Hiểu văn hóa ước lệ tượng trưng'],
        objectivesVi: ['Từ vựng sân khấu dân gian', 'Phân tích nhân vật văn học kinh điển', 'Hiểu văn hóa ước lệ tượng trưng'],
        objectivesEn: ['Folk theatrical terminology', 'Analyze archetypal characters', 'Understand symbolic stylization'],
        isCompleted: false,
        learningStatus: 'AVAILABLE',
      },
      {
        id: 503,
        title: 'Bài 3: Triết lý nhân sinh & Tư tưởng văn hóa',
        titleVi: 'Bài 3: Triết lý nhân sinh & Tư tưởng văn hóa',
        titleEn: 'Lesson 3: Humanistic Philosophy & Worldview',
        description: 'Bàn luận về triết lý trọng tình, hòa hiếu, nhân nghĩa và đạo sống của người Việt.',
        descriptionVi: 'Bàn luận về triết lý trọng tình, hòa hiếu, nhân nghĩa và đạo sống của người Việt.',
        descriptionEn: 'Discuss cultural philosophy: harmony, benevolence, and Vietnamese moral ethics.',
        estimatedDuration: 22,
        xpReward: 55,
        objectives: ['Diễn đạt tư tưởng triết học', 'Phân tích văn hóa làng xã', 'Bàn về đạo lý nhân sinh'],
        objectivesVi: ['Diễn đạt tư tưởng triết học', 'Phân tích văn hóa làng xã', 'Bàn về đạo lý nhân sinh'],
        objectivesEn: ['Express philosophical discourse', 'Analyze village communal ethics', 'Discuss existential values'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 504,
        title: 'Bài 4: Văn phong nghị luận học thuật & Viết luận sâu',
        titleVi: 'Bài 4: Văn phong nghị luận học thuật & Viết luận sâu',
        titleEn: 'Lesson 4: Academic Writing & Critical Discourse',
        description: 'Quy chuẩn viết báo cáo khoa học, tiểu luận và sử dụng liên từ logic chặt chẽ.',
        descriptionVi: 'Quy chuẩn viết báo cáo khoa học, tiểu luận và sử dụng liên từ logic chặt chẽ.',
        descriptionEn: 'Conventions of scientific papers, scholarly essays, and tight logical discourse.',
        estimatedDuration: 22,
        xpReward: 55,
        objectives: ['Văn phong nghị luận khoa học', 'Trích dẫn và biện luận học thuật', 'Viết bài luận chuyên sâu 1000 từ'],
        objectivesVi: ['Văn phong nghị luận khoa học', 'Trích dẫn và biện luận học thuật', 'Viết bài luận chuyên sâu 1000 từ'],
        objectivesEn: ['Scholarly essay registers', 'Academic citation & argumentation', 'Write 1000-word critical essay'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 505,
        title: 'Bài 5: Hàm ngôn, tiền giả định & Sắc thái biểu cảm',
        titleVi: 'Bài 5: Hàm ngôn, tiền giả định & Sắc thái biểu cảm',
        titleEn: 'Lesson 5: Pragmatics, Implicature & Subtle Nuances',
        description: 'Giải mã các tầng ý nghĩa ẩn dụ, chơi chữ và hàm ý trong phát ngôn của người bản ngữ.',
        descriptionVi: 'Giải mã các tầng ý nghĩa ẩn dụ, chơi chữ và hàm ý trong phát ngôn của người bản ngữ.',
        descriptionEn: 'Decode pragmatic presupposition, wordplay, and implicit meaning in cultivated speech.',
        estimatedDuration: 20,
        xpReward: 50,
        objectives: ['Giải mã tiền giả định & hàm ngôn', 'Làm chủ các biện pháp tu từ cao cấp', 'Ứng biến ngôn từ sắc sảo'],
        objectivesVi: ['Giải mã tiền giả định & hàm ngôn', 'Làm chủ các biện pháp tu từ cao cấp', 'Ứng biến ngôn từ sắc sảo'],
        objectivesEn: ['Decode presupposition & implicature', 'Master advanced rhetorical devices', 'Eloquent verbal wit'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 506,
        title: 'Bài 6: Diễn thuyết trước công chúng & Phản biện',
        titleVi: 'Bài 6: Diễn thuyết trước công chúng & Phản biện',
        titleEn: 'Lesson 6: Public Oration & Conference Debating',
        description: 'Diễn thuyết truyền cảm hứng bằng tiếng Việt và đối đáp phản biện linh hoạt tại hội thảo.',
        descriptionVi: 'Diễn thuyết truyền cảm hứng bằng tiếng Việt và đối đáp phản biện linh hoạt tại hội thảo.',
        descriptionEn: 'Inspiring keynote speaking and agile intellectual rebuttals at international symposia.',
        estimatedDuration: 25,
        xpReward: 60,
        objectives: ['Hùng biện truyền cảm hứng', 'Làm chủ ngữ điệu và ánh mắt', 'Đối đáp phản biện sắc sảo'],
        objectivesVi: ['Hùng biện truyền cảm hứng', 'Làm chủ ngữ điệu và ánh mắt', 'Đối đáp phản biện sắc sảo'],
        objectivesEn: ['Inspirational keynote speaking', 'Master cadence and eye contact', 'Incisive debate rebuttals'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 507,
        title: 'Bài 7: AI Roleplay: Phản biện luận điểm học thuật',
        titleVi: 'Bài 7: AI Roleplay: Phản biện luận điểm học thuật',
        titleEn: 'Lesson 7: AI Roleplay - Academic Defense Challenge',
        description: 'Bảo vệ công trình nghiên cứu và tranh luận đa chiều trước hội đồng AI phản biện khắt khe.',
        descriptionVi: 'Bảo vệ công trình nghiên cứu và tranh luận đa chiều trước hội đồng AI phản biện khắt khe.',
        descriptionEn: 'Defend scholarly research in a rigorous defense against an AI critique panel.',
        estimatedDuration: 25,
        xpReward: 75,
        objectives: ['Bảo vệ luận điểm học thuật', 'Phản bác luận cứ đối phương logic', 'Nhận đánh giá năng lực C1 đỉnh cao'],
        objectivesVi: ['Bảo vệ luận điểm học thuật', 'Phản bác luận cứ đối phương logic', 'Nhận đánh giá năng lực C1 đỉnh cao'],
        objectivesEn: ['Defend scholarly thesis', 'Logically counter rival assertions', 'Get elite C1 proficiency analytics'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
      {
        id: 508,
        title: 'Bài 8: Luận giải chuyên đề tổng kết & Đạt chuẩn C1',
        titleVi: 'Bài 8: Luận giải chuyên đề tổng kết & Đạt chuẩn C1',
        titleEn: 'Lesson 8: C1 Master Dissertation & Grand Milestone',
        description: 'Hoàn thành công trình luận giải chuyên đề khẳng định năng lực tiếng Việt đỉnh cao.',
        descriptionVi: 'Hoàn thành công trình luận giải chuyên đề khẳng định năng lực tiếng Việt đỉnh cao.',
        descriptionEn: 'Complete the graduation thesis confirming cultivated near-native mastery.',
        estimatedDuration: 35,
        xpReward: 120,
        objectives: ['Hoàn thành luận văn chuyên đề C1', 'Đạt chuẩn năng lực người bản xứ', 'Nhận huy chương Tinh hoa Tiếng Việt'],
        objectivesVi: ['Hoàn thành luận văn chuyên đề C1', 'Đạt chuẩn năng lực người bản xứ', 'Nhận huy chương Tinh hoa Tiếng Việt'],
        objectivesEn: ['Submit final C1 dissertation', 'Cultivated native speaker benchmark', 'Awarded Vietnamese Master Laurel'],
        isCompleted: false,
        learningStatus: 'LOCKED',
      },
    ],
  },
};

const DEFAULT_CURRICULUM_LESSONS = LEVEL_CURRICULUM_DATA.A1.lessons;
const UNITS_DATA = LEVEL_CURRICULUM_DATA.A1.units;

// Serpentine S-Curve Horizontal Offsets (in pixels)
const S_CURVE_OFFSETS = [0, 56, 88, 56, 0, -56, -88, -56];

const asArray = (value: any): AnyRecord[] => {
  const unwrapped = value?.result ?? value;
  if (Array.isArray(unwrapped)) return unwrapped;
  return Array.isArray(unwrapped?.content) ? unwrapped.content : [];
};

const courseIdOf = (c: AnyRecord | null) => c?.courseId ?? c?.id;

const courseLevelOf = (item: AnyRecord | null) =>
  normalizeCefrLevel(item?.level, item?.cefrLevel, item?.courseLevel, item?.course?.level);

const readStoredOnboarding = (): AnyRecord => {
  try {
    return JSON.parse(localStorage.getItem('hola:onboarding:v1') || '{}') || {};
  } catch {
    return {};
  }
};

const ACTIVE_LEARNING_PATH_KEY = 'hola:active-learning-path:v1';

const readActiveLearningPath = (): AnyRecord => {
  try {
    return JSON.parse(localStorage.getItem(ACTIVE_LEARNING_PATH_KEY) || '{}') || {};
  } catch {
    return {};
  }
};

const saveActiveLearningPath = (course: AnyRecord, level: string) => {
  const courseId = courseIdOf(course);
  if (!courseId) return;
  localStorage.setItem(ACTIVE_LEARNING_PATH_KEY, JSON.stringify({
    courseId,
    level,
    appliedAt: new Date().toISOString(),
  }));
};

const DISCOVERY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  culture: Landmark,
  regions: Languages,
  places: MapPinned,
  speaking: MessageCircle,
  vocabulary: BookOpen,
};

const getCourseTitle = (c: AnyRecord | null, isVi: boolean) => {
  if (!c) return isVi ? 'Tiếng Việt Sơ Cấp A1' : 'Elementary Vietnamese A1';
  const rawTitle = c.titleVi || c.title || c.courseTitle || '';
  if (isVi) return rawTitle || 'Tiếng Việt Sơ Cấp A1';
  if (c.titleEn) return c.titleEn;
  return rawTitle;
};

function SimpleLearningPath({
  isVi,
  currentPathLevel,
  recommendedLevel,
  pathProfile,
  lessons,
  statusOf,
  startLesson,
  inProgressCourse,
  recommendedCourse,
  isFollowingRecommendation,
  handleSelectCourse,
  handleSwitchLevelTab,
  matchingCoursesPreview,
  matchingCoursesPath,
}: AnyRecord) {
  const completedCount = lessons.filter((lesson: AnyRecord) => statusOf(lesson) === 'completed').length;
  const currentIndex = CEFR_LEVELS.indexOf(currentPathLevel as any);
  const nextLevel = CEFR_LEVELS[Math.min(Math.max(currentIndex + 1, 0), CEFR_LEVELS.length - 1)];
  const roadmapLessons = lessons.slice(0, 4);
  const activeProgress = Number(inProgressCourse?.progressPercentage ?? inProgressCourse?.progress ?? 0);

  return (
    <main className="learning-path-simple-page">
      <section className="learning-path-simple-card" aria-labelledby="simple-path-title">
        <header className="learning-path-simple-header">
          <div>
            <strong><BookOpen size={17} /> Hola Vietnamese</strong>
            <span><BilingualText vi="Học tập cá nhân hóa" en="Personalized Learning" /></span>
          </div>
          <span className="learning-path-simple-label"><BilingualText vi="Lộ trình của tôi" en="My Learning Path" /></span>
        </header>

        <div className="learning-path-simple-intro">
          <span className="learning-path-simple-kicker"><BilingualText vi="Lộ trình cá nhân hóa" en="Personalized path" /></span>
          <h1 id="simple-path-title"><BilingualText vi="Hành trình tiếng Việt của bạn" en="Your Vietnamese Journey" /></h1>
          <p><BilingualText vi="Lộ trình dành riêng cho bạn dựa trên trình độ và mục tiêu học tập." en="A learning path tailored to your level and goals." /></p>
          <div className="learning-path-simple-tags">
            <span>{currentPathLevel} · {pathProfile?.badgeEn}</span>
            <span><BilingualText vi="Mục tiêu: Giao tiếp hằng ngày" en="Goal: Daily communication" /></span>
          </div>
        </div>

        <dl className="learning-path-simple-stats">
          <div><dt>{currentPathLevel}</dt><dd><BilingualText vi="Trình độ hiện tại" en="Current level" /></dd></div>
          <div><dt>{completedCount}/{lessons.length}</dt><dd><BilingualText vi="Bài đã hoàn thành" en="Lessons completed" /></dd></div>
          <div><dt>{nextLevel}</dt><dd><BilingualText vi="Mục tiêu tiếp theo" en="Next target" /></dd></div>
        </dl>

        <section className="learning-path-level-section" aria-labelledby="level-selector-title">
          <div className="learning-path-section-heading">
            <div>
              <h2 id="level-selector-title"><BilingualText vi="Lộ trình theo trình độ" en="Level roadmap" /></h2>
              <p><BilingualText vi="Chọn trình độ để xem nội dung phù hợp." en="Choose a level to view its learning content." /></p>
            </div>
            <span>{recommendedLevel === currentPathLevel ? <BilingualText vi="Được đề xuất" en="Recommended" /> : <BilingualText vi={`Đang xem ${currentPathLevel}`} en={`Viewing ${currentPathLevel}`} />}</span>
          </div>
          <div className="learning-path-level-tabs" role="tablist">
            {CEFR_LEVELS.map((level) => <button key={level} type="button" role="tab" aria-selected={level === currentPathLevel} className={level === currentPathLevel ? 'is-active' : ''} onClick={() => handleSwitchLevelTab(level)}>{level}</button>)}
          </div>
          <div className="learning-path-level-copy">
            <span>{currentPathLevel}</span>
            <strong><BilingualText vi={pathProfile?.titleVi} en={pathProfile?.titleEn} /></strong>
            <p><BilingualText vi={pathProfile?.descriptionVi} en={pathProfile?.descriptionEn} /></p>
          </div>
        </section>

        {inProgressCourse && <section className="learning-path-continue" aria-labelledby="continue-course-title">
          <div className="learning-path-section-heading">
            <div><h2 id="continue-course-title"><BilingualText vi="Tiếp tục học" en="Continue your learning" /></h2><span className="learning-path-status"><BilingualText vi="Đang học" en="In progress" /></span></div>
            <small>{activeProgress}%</small>
          </div>
          <strong>{getCourseTitle(inProgressCourse, isVi)}</strong>
          <p>{inProgressCourse.completedLessons ?? 0}/{inProgressCourse.totalLessons ?? lessons.length} <BilingualText vi="bài học hoàn thành" en="lessons completed" /></p>
          <div className="learning-path-progress"><span style={{ width: `${Math.max(0, Math.min(activeProgress, 100))}%` }} /></div>
          <button type="button" className="learning-path-link-button" onClick={() => handleSelectCourse(inProgressCourse)}><BilingualText vi="Tiếp tục khóa học" en="Continue course" /></button>
          {recommendedCourse && !isFollowingRecommendation && <div className="learning-path-suggestion"><strong><BilingualText vi="Lộ trình đề xuất" en="Recommended path" /></strong><p><BilingualText vi={`Dựa trên trình độ ${recommendedLevel}, bạn có thể chuyển sang lộ trình phù hợp hơn mà không mất tiến độ hiện tại.`} en={`Based on level ${recommendedLevel}, you can use a better-matched path without losing current progress.`} /></p><button type="button" onClick={() => handleSelectCourse(recommendedCourse)}><BilingualText vi="Áp dụng lộ trình đề xuất" en="Use recommended path" /></button></div>}
        </section>}

        <section className="learning-path-roadmap" aria-labelledby="roadmap-title">
          <div className="learning-path-section-heading"><h2 id="roadmap-title"><BilingualText vi="Lộ trình học tập" en="Your Learning Roadmap" /></h2><span>{currentPathLevel}</span></div>
          <ol>
            <li className="is-completed"><span><Check size={16} /></span><div><small><BilingualText vi="Hoàn thành" en="Completed" /></small><strong><BilingualText vi="Bắt đầu hành trình" en="Start your journey" /></strong><p><BilingualText vi="Xác định trình độ và mục tiêu" en="Confirm your level and learning goal" /></p></div></li>
            {roadmapLessons.map((lesson: AnyRecord, index: number) => {
              const state = statusOf(lesson);
              return <li key={lesson.id ?? index} className={`is-${state}`}><button type="button" disabled={state === 'locked'} onClick={() => state !== 'locked' && startLesson(lesson)} aria-label={lesson.titleVi || lesson.title}>{state === 'completed' ? <Check size={16} /> : state === 'locked' ? <Lock size={14} /> : <BookOpen size={15} />}</button><div><small><BilingualText vi={index === roadmapLessons.length - 1 ? 'Checkpoint' : `Bước ${index + 1}`} en={index === roadmapLessons.length - 1 ? 'Checkpoint' : `Step ${index + 1}`} /></small><strong><BilingualText vi={lesson.titleVi || lesson.title} en={lesson.titleEn || lesson.title} /></strong><p><BilingualText vi={lesson.descriptionVi || lesson.description || pathProfile?.stages?.[index]?.[0]} en={lesson.descriptionEn || lesson.description || pathProfile?.stages?.[index]?.[1]} /></p></div></li>;
            })}
          </ol>
        </section>

        <section className="learning-path-courses" aria-labelledby="recommended-courses-title">
          <div className="learning-path-section-heading"><div><h2 id="recommended-courses-title"><BilingualText vi="Khóa học đề xuất" en="Recommended Courses" /></h2><p><BilingualText vi={`Các khóa học trình độ ${currentPathLevel} phù hợp với mục tiêu của bạn.`} en={`${currentPathLevel} courses matched to your goal.`} /></p></div><Link to={matchingCoursesPath}><BilingualText vi="Xem tất cả" en="View all" /> <ArrowRight size={14} /></Link></div>
          {matchingCoursesPreview.length ? <div className="learning-path-course-list">{matchingCoursesPreview.map((item: AnyRecord) => <button type="button" key={courseIdOf(item)} onClick={() => handleSelectCourse(item)}><span>{courseLevelOf(item) || currentPathLevel}</span><strong>{getCourseTitle(item, isVi)}</strong><small><BilingualText vi="Mở khóa học" en="Open course" /> <ChevronRight size={13} /></small></button>)}</div> : <p className="learning-path-empty"><BilingualText vi="Chưa có khóa học phù hợp được xuất bản." en="No matching published courses yet." /></p>}
        </section>
      </section>
    </main>
  );
}

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const isVi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('vi');

  // URL query params
  const requestedLevel = normalizeCefrLevel(searchParams.get('level'));
  const requestedGoal = searchParams.get('goal') || 'other';
  const requestedPace = searchParams.get('pace') || 'steady';

  // Remote & Local data states
  const [progress, setProgress] = useState<AnyRecord>({});
  const [courseList, setCourseList] = useState<AnyRecord[]>([]);
  const [enrolledList, setEnrolledList] = useState<AnyRecord[]>([]);
  const [course, setCourse] = useState<AnyRecord | null>(null);
  const [courseProgress, setCourseProgress] = useState<AnyRecord>({});
  const [lessons, setLessons] = useState<AnyRecord[]>(DEFAULT_CURRICULUM_LESSONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);

  // Level & Recommendation source tracking
  const [recommendedLevel, setRecommendedLevel] = useState<string>('A1');
  const [selectedLevel, setSelectedLevel] = useState<string>('A1');
  const [levelOrigin, setLevelOrigin] = useState<'placement' | 'onboarding' | 'profile' | 'url' | 'default'>('default');
  const [placementAccuracy, setPlacementAccuracy] = useState<number | null>(null);
  const [recommendationGoal, setRecommendationGoal] = useState(requestedGoal);
  const [recommendationPace, setRecommendationPace] = useState(requestedPace);

  // Modals
  const [selectedLesson, setSelectedLesson] = useState<AnyRecord | null>(null);
  const [activeGuidebook, setActiveGuidebook] = useState<UnitConfig['guidebook'] | null>(null);
  const [chestModalOpen, setChestModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    const loadRoadmap = async () => {
      try {
        const [summary, enrolledResponse, catalogResponse, profile] = await Promise.all([
          learnerService.getProgressData().catch(() => ({})),
          courseService.myCourses().catch(() => []),
          courseService.list().catch(() => []),
          learnerService.getProfile().catch(() => ({})),
        ]);

        if (!active) return;
        setProgress(summary ?? {});

        const enrolled = asArray(enrolledResponse);
        const catalog = asArray(catalogResponse);
        setEnrolledList(enrolled);

        const storedOnboarding = readStoredOnboarding();
        const storedRecommendation = storedOnboarding.recommendation || {};
        const activeLearningPath = readActiveLearningPath();

        // Level detection priority:
        // 1. Level explicitly confirmed by the learner
        const confirmedTarget = normalizeCefrLevel(activeLearningPath.level);
        // 2. Placement test diagnostic
        const placementTarget = normalizeCefrLevel(storedOnboarding.placementResult?.targetLevel);
        // 3. Existing profile
        const profileTarget = normalizeCefrLevel(profile?.targetLevel);
        // 4. Onboarding recommendation
        const onboardingTarget = normalizeCefrLevel(storedRecommendation.targetLevel);

        // Priority for the user's recommended level:
        const detectedLevel = confirmedTarget || placementTarget || profileTarget || onboardingTarget || 'A1';

        // Detect origin for display
        if (confirmedTarget) {
          setLevelOrigin('profile');
        } else if (placementTarget) {
          setLevelOrigin('placement');
          if (storedOnboarding.placementResult?.accuracy !== undefined) {
            setPlacementAccuracy(storedOnboarding.placementResult.accuracy);
          }
        } else if (onboardingTarget) {
          setLevelOrigin('onboarding');
        } else if (profileTarget) {
          setLevelOrigin('profile');
        } else if (requestedLevel) {
          setLevelOrigin('url');
        } else {
          setLevelOrigin('default');
        }

        const preferredLevel = requestedLevel || detectedLevel;
        setRecommendedLevel(detectedLevel);
        setSelectedLevel(preferredLevel);

        const preferredGoal = searchParams.get('goal') || storedRecommendation.goalId || profile?.learningGoal || 'other';
        const preferredPace = searchParams.get('pace') || storedRecommendation.paceId || 'steady';
        setRecommendationGoal(preferredGoal);
        setRecommendationPace(preferredPace);

        // Build combined course list: all catalog courses, with enrollment data merged
        const combinedCourses: AnyRecord[] = [];
        const seenIds = new Set<string>();

        // Catalog courses
        for (const item of catalog) {
          const cid = String(courseIdOf(item));
          if (cid && !seenIds.has(cid)) {
            seenIds.add(cid);
            const enrolledMatch = enrolled.find((e) => String(courseIdOf(e)) === cid);
            combinedCourses.push({ ...item, ...enrolledMatch });
          }
        }
        // Enrolled courses not in catalog
        for (const item of enrolled) {
          const cid = String(courseIdOf(item));
          if (cid && !seenIds.has(cid)) {
            seenIds.add(cid);
            combinedCourses.push(item);
          }
        }

        const activeCourse = combinedCourses.find((item) => item.status === 'ACTIVE' || item.isCurrent);
        const savedPathCourse = combinedCourses.find(
          (item) => String(courseIdOf(item)) === String(activeLearningPath.courseId),
        );
        const levelMatch = combinedCourses.find((item) => courseLevelOf(item) === preferredLevel);
        let current = savedPathCourse ?? activeCourse ?? levelMatch ?? combinedCourses[0] ?? null;

        if (current) {
          const autoId = courseIdOf(current);
          if (autoId) {
            await courseService.enroll(autoId).catch(() => {});
          }
        } else {
          current = {
            id: 2,
            courseId: 2,
            title: `Tiếng Việt ${preferredLevel}`,
            titleVi: `Tiếng Việt ${preferredLevel}`,
            courseTitle: `Tiếng Việt ${preferredLevel}`,
            description: `Lộ trình tiếng Việt tương tác theo trình độ ${preferredLevel}.`,
            level: preferredLevel,
            progress: 0,
          };
          combinedCourses.push(current);
        }

        setCourseList(combinedCourses);
        setCourse(current);

        const currentCid = courseIdOf(current);
        let fetchedLessons: AnyRecord[] = [];
        let fetchedProgress: AnyRecord = {};

        if (currentCid) {
          try {
            const [rawLessons, rawProgress] = await Promise.all([
              learningService.lessons(currentCid).catch(() => []),
              learningService.progress(currentCid).catch(() => ({})),
            ]);
            fetchedLessons = asArray(rawLessons);
            fetchedProgress = rawProgress ?? {};
          } catch {
            // fallback
          }
        }

        if (!active) return;
        const levelCurriculum = LEVEL_CURRICULUM_DATA[preferredLevel] || LEVEL_CURRICULUM_DATA.A1;
        setLessons(fetchedLessons.length > 0 ? fetchedLessons : levelCurriculum.lessons);
        setCourseProgress(fetchedProgress);
      } catch (reason: any) {
        if (active) {
          setError(reason?.message || 'Không thể tải dữ liệu lộ trình học. Đang hiển thị bài học mặc định.');
          const fallbackCurriculum = LEVEL_CURRICULUM_DATA[requestedLevel || 'A1'] || LEVEL_CURRICULUM_DATA.A1;
          setLessons(fallbackCurriculum.lessons);
          setCourse({
            id: 2,
            courseId: 2,
            title: `Tiếng Việt ${requestedLevel || 'A1'}`,
            titleVi: `Tiếng Việt ${requestedLevel || 'A1'}`,
            description: 'Lộ trình học tập cá nhân hóa.',
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadRoadmap();
    return () => {
      active = false;
    };
  }, [revision, requestedLevel, searchParams]);

  // Handle switching course
  const handleSelectCourse = async (nextCourse: AnyRecord) => {
    setCourse(nextCourse);
    const nextLevel = courseLevelOf(nextCourse) || selectedLevel;
    setSelectedLevel(nextLevel);
    saveActiveLearningPath(nextCourse, nextLevel);
    const cid = courseIdOf(nextCourse);
    if (!cid) return;
    try {
      setLoading(true);
      await courseService.enroll(cid).catch(() => {});
      const [rawLessons, rawProgress] = await Promise.all([
        learningService.lessons(cid).catch(() => []),
        learningService.progress(cid).catch(() => ({})),
      ]);
      const arr = asArray(rawLessons);
      const levelCurriculum = LEVEL_CURRICULUM_DATA[nextLevel] || LEVEL_CURRICULUM_DATA.A1;
      setLessons(arr.length > 0 ? arr : levelCurriculum.lessons);
      setCourseProgress(rawProgress ?? {});
      setSelectedLesson(null);
    } catch {
      const levelCurriculum = LEVEL_CURRICULUM_DATA[nextLevel] || LEVEL_CURRICULUM_DATA.A1;
      setLessons(levelCurriculum.lessons);
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking a Level Tab (A0, A1, A2, B1, B2, C1)
  const handleSwitchLevelTab = (targetLvl: string) => {
    setSelectedLevel(targetLvl);
    const params = new URLSearchParams(searchParams);
    params.set('level', targetLvl);
    setSearchParams(params);

    // Look for a course with this level in combined courses
    const match = courseList.find((c) => courseLevelOf(c) === targetLvl);
    if (match) {
      handleSelectCourse(match);
    } else {
      const lvlCurriculum = LEVEL_CURRICULUM_DATA[targetLvl] || LEVEL_CURRICULUM_DATA.A1;
      setLessons(lvlCurriculum.lessons);
      setCourse({
        id: `mock-${targetLvl}`,
        courseId: `mock-${targetLvl}`,
        title: `Tiếng Việt ${targetLvl}`,
        titleVi: `Tiếng Việt ${targetLvl}`,
        level: targetLvl,
        progress: 0,
      });
    }
  };

  // Set selected level as the primary target in user profile
  const handleSetAsPrimaryLevel = async (lvl: string) => {
    try {
      await learnerService.updateProfile({ targetLevel: lvl });
      setRecommendedLevel(lvl);
      if (course) saveActiveLearningPath(course, lvl);
      const stored = readStoredOnboarding();
      stored.recommendation = { ...(stored.recommendation || {}), targetLevel: lvl };
      localStorage.setItem('hola:onboarding:v1', JSON.stringify(stored));
      setRevision((v) => v + 1);
    } catch {
      // Ignored
    }
  };

  // Progress metrics
  const currentId = courseProgress?.currentLessonId ?? courseProgress?.nextLessonId ?? progress?.currentLesson?.id ?? lessons[0]?.id;
  const completedIds = useMemo(
    () => new Set(asArray(courseProgress?.completedLessons).map((item) => item.id ?? item.lessonId)),
    [courseProgress],
  );
  const firstIncomplete = lessons.find((lesson) => !lesson.isCompleted && !completedIds.has(lesson.id));

  // In-progress course (course with active learning progress)
  const inProgressCourse = useMemo(() => {
    return enrolledList.find((c) => {
      const p = Number(c.progressPercentage ?? c.progress ?? 0);
      return p > 0;
    }) || null;
  }, [enrolledList]);

  // Recommended course matching user's evaluated level
  const recommendedCourse = useMemo(
    () => courseList.find((item) => courseLevelOf(item) === recommendedLevel) ?? null,
    [courseList, recommendedLevel],
  );

  // Check if user is currently following the recommended course
  const isFollowingRecommendation = Boolean(
    recommendedCourse && String(courseIdOf(recommendedCourse)) === String(courseIdOf(course)),
  );

  // Active level path profile & units
  const currentPathLevel = selectedLevel || courseLevelOf(course) || recommendedLevel;
  const pathProfile = LEVEL_PATH_PROFILES[currentPathLevel] || LEVEL_PATH_PROFILES.A1;
  const levelCurriculum = LEVEL_CURRICULUM_DATA[currentPathLevel] || LEVEL_CURRICULUM_DATA.A1;

  // Display units for the S-curve
  const displayUnits = useMemo(() => {
    const units = levelCurriculum.units || UNITS_DATA;
    return units.map((unit, index) => ({
      ...unit,
      title: pathProfile.stages[index]?.[0] || unit.title,
      titleEn: pathProfile.stages[index]?.[1] || unit.titleEn,
      description:
        index === 0
          ? pathProfile.descriptionVi
          : index === 1
          ? `Vận dụng kiến thức ${currentPathLevel} qua hội thoại và tình huống thực tế.`
          : `Tổng hợp kỹ năng, luyện phản xạ và chinh phục cột mốc ${currentPathLevel}.`,
      descriptionEn:
        index === 0
          ? pathProfile.descriptionEn
          : index === 1
          ? `Apply ${currentPathLevel} knowledge through conversations and real-life situations.`
          : `Consolidate skills, build reflexes, and reach the ${currentPathLevel} milestone.`,
    }));
  }, [currentPathLevel, levelCurriculum, pathProfile]);

  // Matching courses path & discovery profiles
  const matchingCoursesPath = buildRecommendationPath({
    targetLevel: currentPathLevel,
    goalId: recommendationGoal,
    paceId: recommendationPace,
  });
  const discoveryGoal = GOAL_PROFILES[normalizeGoalId(recommendationGoal)];
  const discoveryRecommendations = GOAL_DISCOVERY_PROFILES[discoveryGoal.id] || GOAL_DISCOVERY_PROFILES.other;

  // Curated matching courses to preview in UI
  const matchingCoursesPreview = useMemo(() => {
    return courseList
      .filter((c) => courseLevelOf(c) === currentPathLevel && String(courseIdOf(c)) !== String(courseIdOf(course)))
      .slice(0, 3);
  }, [courseList, currentPathLevel, course]);

  const statusOf = (lesson: AnyRecord) => {
    if (lesson.isCompleted || lesson.learningStatus === 'COMPLETED' || completedIds.has(lesson.id)) return 'completed';
    if (lesson.id === currentId || lesson.id === firstIncomplete?.id) return 'current';
    if (lesson.locked || lesson.isLocked || lesson.learningStatus === 'LOCKED') return 'locked';
    return 'available';
  };

  const startLesson = (lesson: AnyRecord) => {
    const cid = courseIdOf(course) ?? 1;
    if (statusOf(lesson) === 'locked') return;
    navigate(`/learn/${cid}/lesson/${lesson.id}`);
  };

  if (loading) {
    return (
      <div className="duo-page-container flex items-center justify-center min-h-[70vh]" aria-busy="true">
        <div className="text-center">
          <BuffaloMascot variant="thinking" size="large" animated />
          <h2 className="mt-4 text-xl font-black text-[#EA580C]">
            <BilingualText vi="Đang chuẩn bị bản đồ học tập..." en="Preparing your learning roadmap..." />
          </h2>
          <p className="mt-1 text-sm text-[#8a7565]">
            <BilingualText vi="Nghé đang sắp xếp bài học theo trình độ của bạn." en="Nghé is organizing lessons for your level." />
          </p>
        </div>
      </div>
    );
  }

  return <SimpleLearningPath
    isVi={isVi}
    currentPathLevel={currentPathLevel}
    recommendedLevel={recommendedLevel}
    pathProfile={pathProfile}
    lessons={lessons}
    statusOf={statusOf}
    startLesson={startLesson}
    inProgressCourse={inProgressCourse}
    recommendedCourse={recommendedCourse}
    isFollowingRecommendation={isFollowingRecommendation}
    handleSelectCourse={handleSelectCourse}
    handleSwitchLevelTab={handleSwitchLevelTab}
    matchingCoursesPreview={matchingCoursesPreview}
    matchingCoursesPath={matchingCoursesPath}
  />;

  /* Legacy game-style path is retained below temporarily for reference while the clean UI is verified. */
  return (
    <div className="duo-page-container">
      <div className="w-full max-w-[1520px] 2xl:max-w-[1640px] mx-auto px-2 sm:px-4 lg:px-6">
        {/* Duolingo Top Cockpit Bar */}
        <div className="duo-stats-bar">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-xs text-[#8a7565]">
              <BilingualText vi="KHÓA ĐANG HỌC:" en="CURRENT COURSE:" />
            </span>
            {courseList.length > 1 ? (
              <select
                aria-label={bilingualLabel("Chọn khóa học", "Select course")}
                className="cursor-pointer rounded-xl border border-[#E8DCCB] bg-[#FFF8EE] px-3 py-1.5 text-xs font-black text-[#EA580C] outline-none hover:bg-white"
                value={courseIdOf(course) ?? ''}
                onChange={(e) => {
                  const next = courseList.find((c) => String(courseIdOf(c)) === e.target.value);
                  if (next) handleSelectCourse(next);
                }}
              >
                {courseList.map((c) => (
                  <option key={courseIdOf(c)} value={courseIdOf(c)}>
                    {getCourseTitle(c, isVi)} ({courseLevelOf(c) || 'A1'})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs font-black text-[#EA580C] bg-[#FFF8EE] px-2.5 py-1 rounded-lg border border-[#E8DCCB]">
                {getCourseTitle(course, isVi)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="duo-stat-pill" title={bilingualLabel("Chuỗi ngày học liên tục", "Day streak")}>
              <Flame size={18} className="text-[#FF7A00] fill-[#FF7A00]" />
              <span>{progress?.streakCount ?? progress?.currentStreak ?? 1}</span>
            </div>
            <div className="duo-stat-pill" title={bilingualLabel("Tổng điểm kinh nghiệm XP", "Total XP")}>
              <Zap size={18} className="text-[#FFC800] fill-[#FFC800]" />
              <span>{progress?.totalXp ?? 120} XP</span>
            </div>
            <div className="duo-stat-pill" title={bilingualLabel("Trái tim năng lượng", "Energy hearts")}>
              <Heart size={18} className="text-[#EF4444] fill-[#EF4444]" />
              <span>{progress?.hearts ?? 5}</span>
            </div>
          </div>
        </div>

        {error ? (
          <div role="alert" className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <span>{error}</span>
            <button onClick={() => setRevision((v) => v + 1)} className="inline-flex items-center gap-2 font-bold hover:underline">
              <RefreshCw size={15} /> <BilingualText vi="Thử lại" en="Retry" />
            </button>
          </div>
        ) : null}

        {/* Level Switcher Tabs Bar */}
        <section className="mb-6 rounded-3xl border border-[#E8E5DF] bg-white p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-[#EA580C]" />
              <span className="text-xs font-black text-[#251B18] uppercase tracking-wider">
                <BilingualText vi="Chọn trình độ lộ trình:" en="Select level roadmap:" />
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to="/onboarding/placement-test"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C] hover:text-[#C2410C] hover:underline"
              >
                <RotateCcw size={14} />
                <BilingualText vi="Làm lại bài kiểm tra đầu vào" en="Retake placement test" />
              </Link>
            </div>
          </div>

          <div className="duo-level-tabs" role="tablist">
            {CEFR_LEVELS.map((lvl) => {
              const isCurrentTab = lvl === currentPathLevel;
              const isRecommended = lvl === recommendedLevel;
              return (
                <button
                  key={lvl}
                  type="button"
                  role="tab"
                  aria-selected={isCurrentTab}
                  className={`duo-level-tab ${isCurrentTab ? 'is-active' : ''}`}
                  onClick={() => handleSwitchLevelTab(lvl)}
                >
                  <span className="font-black">{lvl}</span>
                  <span className="text-[11px] opacity-80">
                    <BilingualText vi={LEVEL_PATH_PROFILES[lvl]?.badgeVi} en={LEVEL_PATH_PROFILES[lvl]?.badgeEn} />
                  </span>
                  {isRecommended && (
                    <span className="duo-level-badge-rec">
                      <Sparkles size={11} className="mr-0.5 inline" />
                      <BilingualText vi="Đề xuất" en="Recommended" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* In-Progress Course Alert Banner (Preserves Progress when different from recommended) */}
        {inProgressCourse && recommendedCourse && String(courseIdOf(inProgressCourse)) !== String(courseIdOf(course)) && (
          <div className="duo-in-progress-card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FFEAD5] text-[#EA580C]">
                <Clock3 size={22} />
              </span>
              <div>
                <span className="inline-flex items-center gap-1 rounded-md bg-[#FFF0DF] px-2 py-0.5 text-[10px] font-black uppercase text-[#EA580C]">
                  <BilingualText vi="Bạn đang học dở khóa học khác" en="Course in progress" />
                </span>
                <h3 className="mt-1 text-base font-black text-[#251B18]">
                  {getCourseTitle(inProgressCourse, isVi)} ({courseLevelOf(inProgressCourse) || 'A1'})
                </h3>
                <p className="mt-0.5 text-xs text-[#78685B]">
                  <BilingualText
                    vi={`Tiến độ hiện tại: ${inProgressCourse.progressPercentage ?? inProgressCourse.progress ?? 0}% · Hệ thống luôn lưu giữ trọn vẹn tiến độ của bạn.`}
                    en={`Current progress: ${inProgressCourse.progressPercentage ?? inProgressCourse.progress ?? 0}% · Your progress is always preserved.`}
                  />
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectCourse(inProgressCourse)}
                className="rounded-xl border border-[#FDBA74] bg-white px-3.5 py-2 text-xs font-black text-[#EA580C] hover:bg-[#FFF8EE]"
              >
                <BilingualText vi="Tiếp tục khóa học này" en="Resume this course" />
              </button>
              {recommendedCourse && !isFollowingRecommendation && (
                <button
                  type="button"
                  onClick={() => handleSelectCourse(recommendedCourse)}
                  className="rounded-xl bg-[#FF7A00] px-4 py-2 text-xs font-black text-white hover:bg-[#EA580C] shadow-xs"
                >
                  <BilingualText vi="Áp dụng lộ trình đề xuất" en="Use recommended path" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Personalized Path Overview Banner */}
        <section className="mb-7 overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-[#FFF8EE] via-white to-[#FFF3E3] p-5 shadow-sm sm:p-7" aria-labelledby="personalized-path-title">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center rounded-full bg-[#FF7A00] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white">
                  <BilingualText vi={`Lộ trình đề xuất · ${recommendedLevel}`} en={`Recommended path · ${recommendedLevel}`} />
                </span>
                {/* Level Source Origin Pill */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-white/80 px-2.5 py-1 text-[11px] font-bold text-[#9A6700]">
                  <UserCheck size={13} className="text-[#EA580C]" />
                  {levelOrigin === 'placement' ? (
                    <BilingualText
                      vi={`Xác định từ: Bài kiểm tra đầu vào${placementAccuracy ? ` (${placementAccuracy}% chính xác)` : ''}`}
                      en={`Assessed via: Placement test${placementAccuracy ? ` (${placementAccuracy}% accuracy)` : ''}`}
                    />
                  ) : levelOrigin === 'onboarding' ? (
                    <BilingualText vi="Xác định từ: Khảo sát Onboarding" en="Assessed via: Onboarding survey" />
                  ) : levelOrigin === 'profile' ? (
                    <BilingualText vi="Xác định từ: Hồ sơ cá nhân" en="Assessed via: User profile" />
                  ) : (
                    <BilingualText vi={`Trình độ đang xem: ${currentPathLevel}`} en={`Viewing level: ${currentPathLevel}`} />
                  )}
                </span>
              </div>

              <h1 id="personalized-path-title" className="mt-3 text-2xl font-black leading-tight text-[#251B18] sm:text-3xl">
                <BilingualText vi={pathProfile?.titleVi} en={pathProfile?.titleEn} />
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[#78685B]">
                <BilingualText vi={pathProfile?.descriptionVi} en={pathProfile?.descriptionEn} />
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {recommendedCourse && !isFollowingRecommendation && (
                <button
                  type="button"
                  onClick={() => handleSelectCourse(recommendedCourse)}
                  className="rounded-xl bg-[#FF7A00] px-4 py-2.5 text-xs font-black text-white shadow-sm hover:bg-[#EA580C]"
                >
                  <BilingualText vi="Áp dụng lộ trình đề xuất" en="Use recommended path" />
                </button>
              )}

              {currentPathLevel !== recommendedLevel && (
                <button
                  type="button"
                  onClick={() => handleSetAsPrimaryLevel(currentPathLevel)}
                  className="rounded-xl border border-orange-300 bg-white px-3.5 py-2.5 text-xs font-black text-[#EA580C] shadow-2xs hover:bg-orange-50"
                  title={bilingualLabel("Đặt làm trình độ mục tiêu trong hồ sơ", "Set as my target level in profile")}
                >
                  <BilingualText vi={`Đặt làm trình độ chính (${currentPathLevel})`} en={`Set as my target (${currentPathLevel})`} />
                </button>
              )}

              <Link
                to={matchingCoursesPath}
                className="rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-xs font-black text-[#EA580C] no-underline hover:bg-orange-50"
              >
                <BilingualText vi="Xem khóa học phù hợp" en="View matching courses" />
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {(pathProfile?.stages || []).map((stage: string[], index: number) => (
              <article key={stage[0]} className="rounded-2xl border border-[#F0E2D1] bg-white/90 p-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF7A00]">
                  <BilingualText vi={`Chặng ${index + 1}`} en={`Stage ${index + 1}`} />
                </span>
                <strong className="mt-1 block text-sm leading-snug text-[#251B18]">
                  <BilingualText vi={stage[0]} en={stage[1]} />
                </strong>
              </article>
            ))}
          </div>

          {recommendedCourse && (
            <p className="mt-4 mb-0 text-xs font-bold text-[#78685B]">
              <BilingualText
                vi={`${isFollowingRecommendation ? 'Bạn đang theo đúng lộ trình đề xuất' : 'Khóa học nên bắt đầu'}: ${getCourseTitle(recommendedCourse, true)}.`}
                en={`${isFollowingRecommendation ? 'You are following the recommended path' : 'Recommended starting course'}: ${getCourseTitle(recommendedCourse, false)}.`}
              />
            </p>
          )}
        </section>

        {/* 2-Column Duolingo Layout: Winding Path on Left, Sidebar Widgets on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
          {/* Main Learning Serpentine Path */}
          <div className="w-full max-w-xl mx-auto">
            {displayUnits.map((unit, unitIdx) => {
              const unitLessons = lessons.slice(unit.lessonRange[0], unit.lessonRange[1] + 1);

              return (
                <div key={`${currentPathLevel}-${unit.unitNumber}`} className="mb-14">
                  {/* Unit Header Banner */}
                  <div
                    className="duo-unit-banner"
                    style={{ background: unit.gradient, boxShadow: `0 6px 0 ${unit.depthColor}` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="duo-unit-tag">
                          <BookOpen size={13} className="shrink-0" />{' '}
                          <BilingualText vi={`CHƯƠNG ${unit.unitNumber} · ${currentPathLevel}`} en={`UNIT ${unit.unitNumber} · ${currentPathLevel}`} />
                        </span>
                        <h2 className="duo-unit-title break-words">
                          <BilingualText vi={unit.title} en={unit.titleEn || unit.title} />
                        </h2>
                        <p className="duo-unit-desc break-words">
                          <BilingualText vi={unit.description} en={unit.descriptionEn || unit.description} />
                        </p>
                      </div>
                      <button
                        type="button"
                        className="duo-unit-guidebook-btn shrink-0 self-start sm:self-center"
                        onClick={() => setActiveGuidebook(unit.guidebook)}
                      >
                        <BookMarked size={16} className="shrink-0" />
                        <span className="whitespace-nowrap">
                          <BilingualText vi="HƯỚNG DẪN" en="GUIDEBOOK" />
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Serpentine S-Curve Path of Nodes */}
                  <div className="duo-path-column">
                    {/* SVG Connector Track linking between all circular nodes */}
                    {(() => {
                      const ROW_HEIGHT = 120;
                      const CANVAS_WIDTH = 340;
                      const CENTER_X = 170;
                      const hasChest = unitIdx < displayUnits.length - 1;
                      const totalSvgHeight = unitLessons.length * ROW_HEIGHT + (hasChest ? 110 : 0);

                      const nodeCoords = unitLessons.map((_, idxInUnit) => {
                        const globalIndex = unit.lessonRange[0] + idxInUnit;
                        const offsetX = S_CURVE_OFFSETS[globalIndex % S_CURVE_OFFSETS.length];
                        return {
                          x: CENTER_X + offsetX,
                          y: 60 + idxInUnit * ROW_HEIGHT,
                        };
                      });

                      const pLast = nodeCoords[nodeCoords.length - 1];
                      const chestPath = pLast
                        ? `M ${pLast.x} ${pLast.y} C ${pLast.x} ${pLast.y + 50}, ${CENTER_X} ${unitLessons.length * ROW_HEIGHT + 10}, ${CENTER_X} ${unitLessons.length * ROW_HEIGHT + 55}`
                        : '';

                      return (
                        <svg
                          className="duo-path-svg-track"
                          width={CANVAS_WIDTH}
                          height={totalSvgHeight}
                          viewBox={`0 0 ${CANVAS_WIDTH} ${totalSvgHeight}`}
                          aria-hidden="true"
                        >
                          {/* Segment lines between adjacent lesson nodes */}
                          {nodeCoords.slice(0, -1).map((p1, j) => {
                            const p2 = nodeCoords[j + 1];
                            const d = `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + 55}, ${p2.x} ${p2.y - 55}, ${p2.x} ${p2.y}`;
                            const isDoneSeg = statusOf(unitLessons[j]) === 'completed' && statusOf(unitLessons[j + 1]) === 'completed';
                            const isActiveSeg = statusOf(unitLessons[j]) === 'completed' && statusOf(unitLessons[j + 1]) === 'current';

                            return (
                              <g key={j}>
                                <path d={d} fill="none" stroke="#D1BEA8" strokeWidth="18" strokeLinecap="round" />
                                <path
                                  d={d}
                                  fill="none"
                                  stroke={isDoneSeg ? '#FFC800' : isActiveSeg ? '#E11D48' : '#EDE2D3'}
                                  strokeWidth="12"
                                  strokeLinecap="round"
                                />
                                <path
                                  d={d}
                                  fill="none"
                                  stroke={isDoneSeg ? '#FFFFFF' : '#BFAD97'}
                                  strokeWidth="3.5"
                                  strokeDasharray="6 8"
                                  strokeLinecap="round"
                                  opacity={isDoneSeg ? 0.95 : 0.75}
                                />
                              </g>
                            );
                          })}

                          {/* Connecting track to milestone chest */}
                          {hasChest && pLast && (
                            <g>
                              <path d={chestPath} fill="none" stroke="#D1BEA8" strokeWidth="18" strokeLinecap="round" />
                              <path d={chestPath} fill="none" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" />
                              <path d={chestPath} fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeDasharray="6 8" strokeLinecap="round" opacity="0.9" />
                            </g>
                          )}
                        </svg>
                      );
                    })()}

                    {unitLessons.map((lesson, idxInUnit) => {
                      const globalIndex = unit.lessonRange[0] + idxInUnit;
                      const status = statusOf(lesson);
                      const isCurrent = status === 'current';
                      const isCompleted = status === 'completed';
                      const isLocked = status === 'locked';
                      const offsetX = S_CURVE_OFFSETS[globalIndex % S_CURVE_OFFSETS.length];

                      return (
                        <div
                          key={lesson.id ?? globalIndex}
                          className="duo-step-row"
                          style={{ transform: `translateX(${offsetX}px)` }}
                        >
                          {/* Companion Mascot Nghé cheering at strategic nodes */}
                          {unit.unitNumber === 1 && idxInUnit === 1 && (
                            <div
                              className="duo-mascot-companion hidden md:flex"
                              style={{ left: 'calc(50% - 220px)', top: '-15px' }}
                            >
                              <div className="duo-mascot-bubble">
                                {isVi ? 'Chỉ 10 phút mỗi ngày cùng Nghé nhé! 🎉' : 'Just 10 minutes a day with Nghé! 🎉'}
                              </div>
                              <BuffaloMascot variant="encouraging" size="medium" animated />
                            </div>
                          )}

                          {unit.unitNumber === 2 && idxInUnit === 1 && (
                            <div
                              className="duo-mascot-companion hidden md:flex"
                              style={{ left: 'calc(50% + 95px)', top: '-15px' }}
                            >
                              <div className="duo-mascot-bubble">
                                {isVi ? 'Bạn đang tiến bộ rất nhanh! 🌟' : 'You are making great progress! 🌟'}
                              </div>
                              <BuffaloMascot variant="happy" size="medium" animated />
                            </div>
                          )}

                          {/* 3D Action Node */}
                          <div className="relative">
                            {isCurrent && (
                              <>
                                <div className="duo-node-ring" />
                                <div className="duo-floating-badge">
                                  <BilingualText vi="BẮT ĐẦU!" en="START!" />
                                </div>
                              </>
                            )}

                            <button
                              type="button"
                              className={`duo-node-btn ${isCompleted ? 'is-completed' : isCurrent ? 'is-current' : 'is-locked'}`}
                              onClick={() => setSelectedLesson(lesson)}
                              title={lesson.titleVi || lesson.title}
                            >
                              {isCompleted ? (
                                <Check size={36} strokeWidth={4} />
                              ) : isLocked ? (
                                <Lock size={26} strokeWidth={2.5} />
                              ) : (
                                <Play size={30} fill="currentColor" className="text-white ml-0.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Milestone Reward Chest between units */}
                    {unitIdx < displayUnits.length - 1 && (
                      <div className="mt-4 mb-8 flex flex-col items-center">
                        <button
                          type="button"
                          className="duo-chest-node"
                          onClick={() => setChestModalOpen(true)}
                          title={bilingualLabel("Rương phần thưởng chặng", "Milestone reward chest")}
                        >
                          <Gift size={34} strokeWidth={2.2} />
                          <span className="text-[10px] font-black tracking-wider uppercase mt-1">+50 XP</span>
                        </button>
                        <span className="text-xs font-bold text-[#8a7565] mt-2">
                          <BilingualText vi={`Rương quà chặng ${unit.unitNumber}`} en={`Unit ${unit.unitNumber} Chest`} />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Sidebar Widgets */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Matching Courses Card Showcase */}
            <div className="duo-sidebar-widget overflow-hidden border-orange-200 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-sm text-[#251B18] flex items-center gap-2">
                  <BookOpen size={18} className="text-[#FF7A00]" />
                  <BilingualText vi={`Khóa học chuẩn ${currentPathLevel}`} en={`${currentPathLevel} Matching Courses`} />
                </h3>
                <span className="text-[10px] font-black uppercase text-[#EA580C] bg-[#FFF0DF] px-2 py-0.5 rounded-full">
                  {currentPathLevel}
                </span>
              </div>
              <p className="text-xs text-[#78685B] mb-3 leading-relaxed">
                <BilingualText
                  vi={`Các khóa học được thiết kế tương thích với mục tiêu và trình độ ${currentPathLevel} của bạn.`}
                  en={`Curated courses aligned with your goals and ${currentPathLevel} level.`}
                />
              </p>

              {matchingCoursesPreview.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {matchingCoursesPreview.map((c) => (
                    <div
                      key={courseIdOf(c)}
                      className="duo-course-mini-card flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <strong className="block text-xs font-black text-[#251B18] truncate">
                          {getCourseTitle(c, isVi)}
                        </strong>
                        <span className="text-[11px] text-[#8a7565]">
                          {c.estimatedDuration || 12} <BilingualText vi="bài học" en="lessons" />
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectCourse(c)}
                        className="rounded-lg bg-[#FFF4EB] border border-[#FDBA74] px-2.5 py-1 text-[11px] font-black text-[#EA580C] hover:bg-[#FF7A00] hover:text-white transition-all shrink-0"
                      >
                        <BilingualText vi="Học ngay" en="Start" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <Link
                to={matchingCoursesPath}
                className="group flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-[#FFF8EE] border border-[#FDBA74] text-xs font-black text-[#EA580C] hover:bg-[#FF7A00] hover:text-white transition-all no-underline"
              >
                <span>
                  <BilingualText vi="Xem tất cả khóa học phù hợp →" en="View all matching courses →" />
                </span>
              </Link>
            </div>

            {/* Goal-based culture and regional discovery */}
            <div className="duo-sidebar-widget overflow-hidden border-orange-200 bg-gradient-to-br from-[#FFF9F2] to-white">
              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#FF7A00]">
                  <BilingualText vi="Đề xuất theo mục đích" en="Recommended for your goal" />
                </span>
                <h3 className="mt-1 text-base font-black leading-snug text-[#251B18]">
                  <BilingualText vi={discoveryGoal.titleVi} en={discoveryGoal.titleEn} />
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#78685B]">
                  <BilingualText
                    vi={`Nội dung bổ trợ phù hợp với trình độ ${currentPathLevel} và mục tiêu của bạn.`}
                    en={`Extra content matched to your ${currentPathLevel} level and learning goal.`}
                  />
                </p>
              </div>
              <div className="space-y-2.5">
                {discoveryRecommendations.map((item: AnyRecord) => {
                  const DiscoveryIcon = DISCOVERY_ICONS[item.id] || BookOpen;
                  return (
                    <Link
                      key={`${discoveryGoal.id}-${item.id}`}
                      to={item.path}
                      className="group flex items-start gap-3 rounded-2xl border border-[#F0E2D1] bg-white p-3 no-underline transition-all hover:-translate-y-0.5 hover:border-[#FDBA74] hover:shadow-xs"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FFF0DC] text-[#EA580C] group-hover:bg-[#FF7A00] group-hover:text-white">
                        <DiscoveryIcon size={17} />
                      </span>
                      <span className="min-w-0">
                        <strong className="block text-xs font-black leading-snug text-[#251B18]">
                          <BilingualText vi={item.titleVi} en={item.titleEn} />
                        </strong>
                        <small className="mt-0.5 block text-[11px] leading-relaxed text-[#78685B]">
                          <BilingualText vi={item.detailVi} en={item.detailEn} />
                        </small>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Daily Quests Widget */}
            <div className="duo-sidebar-widget">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-base text-[#251B18] flex items-center gap-2">
                  <TargetIcon size={18} className="text-[#FF7A00]" />
                  <BilingualText vi="Nhiệm vụ hôm nay" en="Daily Quests" />
                </h3>
                <span className="text-[10px] font-black text-[#8a7565]">
                  <BilingualText vi="HẾT HẠN SAU 12H" en="EXPIRES IN 12H" />
                </span>
              </div>

              <div className="space-y-3">
                <div className="duo-quest-item">
                  <span className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-black shrink-0">
                    <Trophy size={18} />
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-extrabold text-[#251B18] mb-1">
                      <span><BilingualText vi="Đạt 30 XP hôm nay" en="Earn 30 XP today" /></span>
                      <span>20 / 30 XP</span>
                    </div>
                    <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-full bg-[#FFC800] rounded-full" style={{ width: '66%' }} />
                    </div>
                  </div>
                </div>

                <div className="duo-quest-item">
                  <span className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-black shrink-0">
                    <Check size={18} />
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-extrabold text-[#251B18] mb-1">
                      <span><BilingualText vi="Hoàn thành 1 bài học" en="Complete 1 lesson" /></span>
                      <span>1 / 1</span>
                    </div>
                    <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-full bg-[#16A34A] rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>

                <div className="duo-quest-item">
                  <span className="w-9 h-9 rounded-xl bg-[#FFF4EB] text-[#FF7A00] flex items-center justify-center font-black shrink-0">
                    <Zap size={18} />
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-extrabold text-[#251B18] mb-1">
                      <span><BilingualText vi="Luyện phản xạ với Gia sư AI" en="Reflex practice with AI Tutor" /></span>
                      <span>0 / 1</span>
                    </div>
                    <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF7A00] rounded-full" style={{ width: '0%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mascot Tip Companion Card */}
            <div className="duo-sidebar-widget bg-gradient-to-br from-[#FFF9F2] to-[#FFF3E3] border-[#EADBC8]">
              <div className="flex items-start gap-3">
                <BuffaloMascot variant="teaching" size="small" animated />
                <div>
                  <h4 className="font-black text-xs text-[#EA580C]">
                    <BilingualText vi={`Mẹo học từ Nghé (${currentPathLevel}):`} en={`Tip from Nghé (${currentPathLevel}):`} />
                  </h4>
                  <p className="mt-1 text-xs text-[#78685B] leading-relaxed">
                    <BilingualText
                      vi={`&ldquo;${pathProfile?.tipVi || 'Luyện tập 10 phút mỗi ngày tạo nên phản xạ tự nhiên!'}&rdquo;`}
                      en={`&ldquo;${pathProfile?.tipEn || '10 minutes daily practice creates natural reflexes!'}&rdquo;`}
                    />
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Lesson Detail Popup Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="duo-modal-overlay" onClick={() => setSelectedLesson(null)}>
            <motion.div
              className="duo-modal-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="duo-modal-close"
                onClick={() => setSelectedLesson(null)}
                aria-label={bilingualLabel("Đóng", "Close")}
              >
                <X size={18} />
              </button>

              <div className="text-center pt-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFF4D5] text-[#9A6700]">
                  {statusOf(selectedLesson) === 'completed'
                    ? isVi ? '✓ ĐÃ HOÀN THÀNH' : '✓ COMPLETED'
                    : statusOf(selectedLesson) === 'current'
                    ? isVi ? '★ ĐANG HỌC' : '★ CURRENT'
                    : isVi ? '🔒 ĐANG KHÓA' : '🔒 LOCKED'}
                </span>

                <h3 className="mt-3 text-2xl font-black text-[#251B18] leading-snug">
                  {selectedLesson.titleVi || selectedLesson.title}
                </h3>

                <p className="mt-2 text-sm text-[#78685B] leading-relaxed">
                  {selectedLesson.descriptionVi || selectedLesson.description}
                </p>

                <div className="mt-4 flex items-center justify-center gap-4 text-xs font-bold text-[#EA580C]">
                  <span className="flex items-center gap-1.5 bg-[#FAF5EB] px-3 py-1.5 rounded-full">
                    <Clock3 size={15} /> {selectedLesson.estimatedDuration || 12} <BilingualText vi="phút" en="min" />
                  </span>
                  <span className="flex items-center gap-1.5 bg-[#FEF3C7] text-[#B45309] px-3 py-1.5 rounded-full">
                    +{selectedLesson.xpReward || 25} XP
                  </span>
                </div>

                {(selectedLesson.objectivesVi || selectedLesson.objectives || []).length > 0 && (
                  <div className="mt-5 text-left bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#EADBC8]">
                    <span className="block text-xs font-black uppercase tracking-wider text-[#8a7565] mb-2">
                      <BilingualText vi="Mục tiêu bài học:" en="Lesson objectives:" />
                    </span>
                    <ul className="space-y-1.5">
                      {(selectedLesson.objectivesVi || selectedLesson.objectives || []).map((obj: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-medium text-[#4B3F38]">
                          <Check size={14} className="text-[#16A34A] shrink-0 mt-0.5" strokeWidth={3} />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="button"
                    disabled={statusOf(selectedLesson) === 'locked'}
                    onClick={() => startLesson(selectedLesson)}
                    className={`duo-3d-button ${
                      statusOf(selectedLesson) === 'completed' ? 'is-review' : 'is-primary'
                    }`}
                  >
                    {statusOf(selectedLesson) === 'completed' ? (
                      <>
                        <RefreshCw size={18} /> <BilingualText vi="ÔN TẬP BÀI HỌC (+10 XP)" en="REVIEW LESSON (+10 XP)" />
                      </>
                    ) : statusOf(selectedLesson) === 'locked' ? (
                      <>
                        <Lock size={18} /> <BilingualText vi="BÀI HỌC ĐANG KHÓA" en="LESSON LOCKED" />
                      </>
                    ) : (
                      <>
                        <Play size={18} fill="currentColor" />{' '}
                        <BilingualText vi={`BẮT ĐẦU (+${selectedLesson.xpReward || 25} XP)`} en={`START (+${selectedLesson.xpReward || 25} XP)`} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guidebook Modal */}
      <AnimatePresence>
        {activeGuidebook && (
          <div className="duo-modal-overlay" onClick={() => setActiveGuidebook(null)}>
            <motion.div
              className="duo-modal-card duo-modal-card--guidebook"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="duo-modal-close"
                onClick={() => setActiveGuidebook(null)}
                aria-label={bilingualLabel("Đóng", "Close")}
              >
                <X size={18} />
              </button>

              <div className="pr-12 pb-3 border-b border-[#F3EDE3]">
                <div className="flex items-center gap-2 text-xs font-black text-[#FF7A00] uppercase tracking-wider mb-1.5">
                  <BookMarked size={16} className="shrink-0" />
                  <span className="truncate">
                    <BilingualText vi={`Sổ tay hướng dẫn · ${currentPathLevel}`} en={`Guidebook · ${currentPathLevel}`} />
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#251B18] leading-tight">
                  <BilingualText vi="Điểm ngữ pháp & Từ vựng then chốt" en="Key Grammar & Core Vocabulary" />
                </h3>
              </div>

              <div className="duo-guidebook-scroll flex-1 py-4 space-y-4">
                <div className="bg-[#FFFBF5] border border-[#F3E5D4] rounded-2xl p-3 text-xs text-[#78685B] leading-relaxed break-words">
                  {isVi ? activeGuidebook.summary : activeGuidebook.summaryEn || activeGuidebook.summary}
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#8a7565] mb-2">
                    <BilingualText vi="Mẹo phát âm & Ngữ pháp:" en="Pronunciation & Grammar Tips:" />
                  </h4>
                  <div className="space-y-2">
                    {(isVi ? activeGuidebook.tips : activeGuidebook.tipsEn || activeGuidebook.tips).map((tip, i) => (
                      <div
                        key={i}
                        className="text-xs bg-[#F9FAFB] p-3 rounded-xl border border-gray-200 text-[#374151] leading-relaxed break-words flex items-start gap-2"
                      >
                        <span className="font-black text-[#FF7A00] select-none shrink-0">•</span>
                        <span className="flex-1 min-w-0">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#8a7565] mb-2">
                    <BilingualText vi="Từ vựng trọng tâm:" en="Core Vocabulary:" />
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeGuidebook.vocabulary.map((vocab, i) => (
                      <div
                        key={i}
                        className="bg-[#FFF8EE] border border-[#EADBC8] p-3 rounded-xl text-xs flex flex-col justify-center min-w-0 overflow-hidden shadow-2xs"
                      >
                        <strong className="block text-[#FF7A00] font-black text-sm truncate" title={vocab.vi}>
                          {vocab.vi}
                        </strong>
                        <span className="text-[#8a7565] font-medium mt-0.5 break-words leading-snug">
                          {vocab.en}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F3EDE3]">
                <button
                  type="button"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#F97316] text-white text-xs font-black hover:bg-[#C2410C] shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:translate-y-0.5"
                  onClick={() => setActiveGuidebook(null)}
                >
                  <BilingualText vi="ĐÃ HIỂU! TIẾP TỤC HỌC" en="GOT IT! CONTINUE" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Milestone Gift Chest Modal */}
      <AnimatePresence>
        {chestModalOpen && (
          <div className="duo-modal-overlay" onClick={() => setChestModalOpen(false)}>
            <motion.div
              className="duo-modal-card text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="duo-modal-close"
                onClick={() => setChestModalOpen(false)}
                aria-label={bilingualLabel("Đóng", "Close")}
              >
                <X size={18} />
              </button>

              <div className="pt-2">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FEF3C7] border-4 border-[#F59E0B] flex items-center justify-center text-[#B45309] shadow-lg">
                  <Gift size={44} />
                </div>
                <h3 className="mt-4 text-2xl font-black text-[#251B18]">
                  <BilingualText vi="Rương Kho Báu Chặng!" en="Milestone Treasure Chest!" />
                </h3>
                <p className="mt-2 text-sm text-[#78685B]">
                  <BilingualText
                    vi="Hoàn thành toàn bộ các bài học trong chương để mở khóa rương kho báu và nhận +50 XP cùng danh hiệu danh dự!"
                    en="Complete all lessons in the unit to unlock this chest and earn +50 XP plus an honor badge!"
                  />
                </p>
                <button
                  type="button"
                  className="mt-6 duo-3d-button is-primary"
                  onClick={() => setChestModalOpen(false)}
                >
                  <BilingualText vi="CỐ GẮNG HỌC TIẾP!" en="KEEP LEARNING!" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function TargetIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export default DashboardScreen;
