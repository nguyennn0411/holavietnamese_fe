import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BookMarked, BookOpen, Check, Clock3, Flame, Gift, Heart, Lock, Play, RefreshCw, Trophy, X, Zap } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { learnerService } from '@/services/learnerService';
import { learningService } from '@/services/learningService';
import { BuffaloMascot } from '@/components/mascot';
import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useTranslation } from 'react-i18next';
import '@/presentation/styles/duolingo-path.css';

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

const DEFAULT_CURRICULUM_LESSONS: AnyRecord[] = [
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
    descriptionEn: 'Unlock the secrets of 6 Vietnamese tones (Flat, Grave, Acute, Hook, Tilde, Dot) with interactive pitch contours.',
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
    descriptionEn: 'Master numbers from 1 to 1,000,000 and learn to ask prices in Vietnamese Dong (VND) at markets or shops.',
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
    descriptionEn: 'Learn food vocabulary for famous Vietnamese dishes: Pho, Banh Mi, Bun Cha, Iced Milk Coffee, and order like a local.',
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
    descriptionEn: 'How to ask directions, use ride-hailing apps (Grab, Be), and navigate turns (left, right, straight) across Vietnam.',
    estimatedDuration: 14,
    xpReward: 30,
    objectives: ['Chỉ đường: rẽ trái, rẽ phải, đi thẳng', 'Giao tiếp với tài xế xe công nghệ', 'Nhận diện các địa danh quen thuộc'],
    objectivesVi: ['Chỉ đường: rẽ trái, rẽ phải, đi thẳng', 'Giao tiếp với tài xế xe công nghệ', 'Nhận diện các địa danh quen thuộc'],
    objectivesEn: ['Direct turns: turn left, turn right, go straight', 'Communicate with ride-hailing drivers', 'Identify familiar landmarks and signs'],
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
];

const UNITS_DATA: UnitConfig[] = [
  {
    unitNumber: 1,
    title: 'Bước Đầu Làm Quen & Nền Tảng Âm Tiết',
    titleEn: 'First Steps & Syllable Foundations',
    description: 'Làm quen cách chào hỏi lịch sự, giải mã 6 thanh điệu tiếng Việt và số đếm mua sắm.',
    descriptionEn: 'Learn polite greetings, decode the 6 Vietnamese tones, and count numbers for shopping.',
    gradient: 'linear-gradient(135deg, #FF7A00 0%, #E11D48 100%)',
    depthColor: '#7A170F',
    lessonRange: [0, 2], // Lessons 1, 2, 3
    guidebook: {
      summary: 'Nền tảng thanh điệu và các câu chào hỏi căn bản nhất khi gặp người Việt Nam.',
      summaryEn: 'Tone foundations and the most essential greetings when meeting Vietnamese people.',
      tips: [
        'Tiếng Việt có 6 thanh điệu: Ngang (không dấu), Huyền (`), Sắc (´), Hỏi (?), Ngã (~), Nặng (.)',
        'Xưng hô lịch sự: Chào anh (nam lớn hơn), Chào chị (nữ lớn hơn), Chào em (nhỏ tuổi hơn).',
        'Khi mua sắm, luôn thêm "ạ" ở cuối câu để thể hiện sự lễ phép: "Bao nhiêu tiền ạ?"',
      ],
      tipsEn: [
        'Vietnamese has 6 tones: Mid level (no mark), Low falling (`), High rising (´), Dipping-rising (?), High breaking (~), Low constricted (.).',
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
    lessonRange: [3, 5], // Lessons 4, 5, 6
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
        'Ordering phrase: "Cho em một bát phở bò..." (Give me a bowl of beef pho...) or "Cho một ly cà phê sữa đá mang đi" (One iced coffee with milk to go).',
        'Asking directions: "Cho tôi hỏi đường ra chợ Bến Thành đi hướng nào ạ?" (Excuse me, which way to Ben Thanh market?)',
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
    lessonRange: [6, 7], // Lessons 7, 8
    guidebook: {
      summary: 'Rèn luyện phản xạ phát âm chuẩn xác với Gia sư AI và tổng kết toàn bộ chặng Sơ cấp.',
      summaryEn: 'Sharpen accurate pronunciation reflexes with AI Tutor and review the entire Elementary stage.',
      tips: [
        'Đừng sợ phát âm sai: Gia sư AI luôn kiên nhẫn sửa từng âm tiết và cao độ thanh điệu.',
        'Hãy luyện nói thành tiếng to, rõ ràng theo nhịp điệu tự nhiên.',
        'Hoàn thành bài 8 để nhận chứng chỉ điện tử A1 và mở khóa chặng Trung cấp!',
      ],
      tipsEn: [
        'Do not fear mispronunciation: AI Tutor is always patient, guiding each syllable and tone contour.',
        'Practice speaking out loud clearly with a natural conversational rhythm.',
        'Complete lesson 8 to receive your digital A1 Certificate and unlock the Intermediate stage!',
      ],
      vocabulary: [
        { vi: 'Luyện tập', en: 'Practice' },
        { vi: 'Phản xạ', en: 'Reflex' },
        { vi: 'Chính xác', en: 'Accurate' },
        { vi: 'Xuất sắc', en: 'Excellent' },
      ],
    },
  },
];

const KNOWN_COURSE_TITLES_EN: Record<string, string> = {
  'Tiếng Việt cơ bản A1': 'Basic Vietnamese A1',
  'Tiếng Việt Sơ Cấp A1': 'Elementary Vietnamese A1',
  'Làm quen với Tiếng Việt': 'Introduction to Vietnamese',
  'Tiếng Việt Giao Tiếp Sơ Cấp 1': 'Conversational Vietnamese 1',
  'Tiếng Việt Giao Tiếp 1': 'Conversational Vietnamese 1',
  'Tiếng Việt Giao Tiếp 2': 'Conversational Vietnamese 2',
  'Tiếng Việt Trung Cấp B1': 'Intermediate Vietnamese B1',
};

const getCourseTitle = (c: AnyRecord | null, isVi: boolean) => {
  if (!c) return isVi ? 'Tiếng Việt Sơ Cấp A1' : 'Elementary Vietnamese A1';
  const rawTitle = c.titleVi || c.title || c.courseTitle || '';
  if (isVi) return rawTitle || 'Tiếng Việt Sơ Cấp A1';
  if (c.titleEn) return c.titleEn;
  return KNOWN_COURSE_TITLES_EN[rawTitle] || rawTitle || 'Elementary Vietnamese A1';
};

const getLessonTitle = (lesson: AnyRecord, isVi: boolean) => {
  if (isVi) return lesson.titleVi || lesson.title || '';
  if (lesson.titleEn) return lesson.titleEn;
  const match = DEFAULT_CURRICULUM_LESSONS.find(
    (d) => d.id === lesson.id || d.titleVi === lesson.title || d.title === lesson.title
  );
  if (match?.titleEn) return match.titleEn;
  return lesson.title || lesson.titleVi || '';
};

const getLessonDescription = (lesson: AnyRecord, isVi: boolean) => {
  if (isVi) return lesson.descriptionVi || lesson.description || '';
  if (lesson.descriptionEn) return lesson.descriptionEn;
  const match = DEFAULT_CURRICULUM_LESSONS.find(
    (d) => d.id === lesson.id || d.titleVi === lesson.title || d.title === lesson.title
  );
  if (match?.descriptionEn) return match.descriptionEn;
  return lesson.description || lesson.descriptionVi || '';
};

const getLessonObjectives = (lesson: AnyRecord, isVi: boolean): string[] => {
  if (isVi) return lesson.objectivesVi || lesson.objectives || [];
  if (lesson.objectivesEn) return lesson.objectivesEn;
  const match = DEFAULT_CURRICULUM_LESSONS.find(
    (d) => d.id === lesson.id || d.titleVi === lesson.title || d.title === lesson.title
  );
  if (match?.objectivesEn) return match.objectivesEn;
  return lesson.objectives || lesson.objectivesVi || [];
};

// Serpentine S-Curve Horizontal Offsets (in pixels)
const S_CURVE_OFFSETS = [0, 56, 88, 56, 0, -56, -88, -56];

const asArray = (value: any): AnyRecord[] => {
  const unwrapped = value?.result ?? value;
  if (Array.isArray(unwrapped)) return unwrapped;
  return Array.isArray(unwrapped?.content) ? unwrapped.content : [];
};

const courseIdOf = (c: AnyRecord | null) => c?.courseId ?? c?.id;

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isVi = (i18n.resolvedLanguage || i18n.language || "en").startsWith("vi");
  const [progress, setProgress] = useState<AnyRecord>({});
  const [courseList, setCourseList] = useState<AnyRecord[]>([]);
  const [course, setCourse] = useState<AnyRecord | null>(null);
  const [courseProgress, setCourseProgress] = useState<AnyRecord>({});
  const [lessons, setLessons] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);

  // Modals state
  const [selectedLesson, setSelectedLesson] = useState<AnyRecord | null>(null);
  const [activeGuidebook, setActiveGuidebook] = useState<UnitConfig['guidebook'] | null>(null);
  const [chestModalOpen, setChestModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    const loadRoadmap = async () => {
      try {
        const [summary, enrolledResponse, catalogResponse] = await Promise.all([
          learnerService.getProgressData().catch(() => ({})),
          courseService.myCourses().catch(() => []),
          courseService.list().catch(() => []),
        ]);

        if (!active) return;
        setProgress(summary ?? {});

        const enrolled = asArray(enrolledResponse);
        const catalog = asArray(catalogResponse);

        // Build combined course list: all catalog courses, with enrollment data merged
        const combinedCourses: AnyRecord[] = [];
        const seenIds = new Set<string>();

        // First add catalog courses (from DB)
        for (const item of catalog) {
          const cid = String(courseIdOf(item));
          if (cid && !seenIds.has(cid)) {
            seenIds.add(cid);
            const enrolledMatch = enrolled.find((e) => String(courseIdOf(e)) === cid);
            combinedCourses.push({ ...item, ...enrolledMatch });
          }
        }
        // Then add any remaining enrolled courses
        for (const item of enrolled) {
          const cid = String(courseIdOf(item));
          if (cid && !seenIds.has(cid)) {
            seenIds.add(cid);
            combinedCourses.push(item);
          }
        }

        let current = combinedCourses.find((item) => item.status === 'ACTIVE' || item.isCurrent) ?? combinedCourses[0] ?? null;

        if (current) {
          const autoId = courseIdOf(current);
          if (autoId) {
            await courseService.enroll(autoId).catch(() => {});
          }
        } else {
          current = {
            id: 2,
            courseId: 2,
            title: 'Tiếng Việt cơ bản A1',
            titleVi: 'Tiếng Việt cơ bản A1',
            courseTitle: 'Tiếng Việt cơ bản A1',
            description: 'Lộ trình tiếng Việt tương tác từng bước từ phát âm, 6 thanh điệu đến phản xạ hội thoại thực tế.',
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
        setLessons(fetchedLessons.length > 0 ? fetchedLessons : DEFAULT_CURRICULUM_LESSONS);
        setCourseProgress(fetchedProgress);
      } catch (reason: any) {
        if (active) {
          setError(reason?.message || 'Không thể tải dữ liệu lộ trình học. Đang hiển thị bài học mặc định.');
          setLessons(DEFAULT_CURRICULUM_LESSONS);
          setCourse({
            id: 2,
            courseId: 2,
            title: 'Tiếng Việt cơ bản A1',
            titleVi: 'Tiếng Việt cơ bản A1',
            description: 'Lộ trình học tập cá nhân hóa chuẩn A1.',
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadRoadmap();
    return () => { active = false; };
  }, [revision]);

  const handleSelectCourse = async (nextCourse: AnyRecord) => {
    setCourse(nextCourse);
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
      setLessons(arr.length > 0 ? arr : DEFAULT_CURRICULUM_LESSONS);
      setCourseProgress(rawProgress ?? {});
      setSelectedLesson(null);
    } catch {
      setLessons(DEFAULT_CURRICULUM_LESSONS);
    } finally {
      setLoading(false);
    }
  };

  const currentId = courseProgress?.currentLessonId ?? courseProgress?.nextLessonId ?? progress?.currentLesson?.id ?? lessons[0]?.id;
  const completedIds = useMemo(() => new Set(asArray(courseProgress?.completedLessons).map((item) => item.id ?? item.lessonId)), [courseProgress]);
  const firstIncomplete = lessons.find((lesson) => !lesson.isCompleted && !completedIds.has(lesson.id));
  const completion = Number(courseProgress?.progressPercentage ?? course?.progress ?? 0);

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
      <div className="duo-page-container flex items-center justify-center" aria-busy="true">
        <div className="text-center">
          <BuffaloMascot variant="thinking" size="large" animated />
          <h2 className="mt-4 text-xl font-black text-[#EA580C]"><BilingualText vi="Đang chuẩn bị bản đồ học tập..." en="Preparing your learning roadmap..." /></h2>
          <p className="mt-1 text-sm text-[#8a7565]"><BilingualText vi="Nghé đang sắp xếp bài học theo cấp độ của bạn." en="Nghé is organizing lessons for your level." /></p>
        </div>
      </div>
    );
  }

  return (
    <div className="duo-page-container">
      <div className="w-full max-w-[1520px] 2xl:max-w-[1640px] mx-auto px-2 sm:px-4 lg:px-6">
        {/* Duolingo Top Cockpit Bar */}
        <div className="duo-stats-bar">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-[#8a7565]"><BilingualText vi="KHÓA ĐANG HỌC:" en="CURRENT COURSE:" /></span>
            {courseList.length > 1 ? (
              <select
                className="cursor-pointer rounded-xl border border-[#E8DCCB] bg-[#FFF8EE] px-3 py-1 text-sm font-black text-[#EA580C] outline-none hover:bg-white"
                value={courseIdOf(course) ?? ''}
                onChange={(e) => {
                  const next = courseList.find((c) => String(courseIdOf(c)) === e.target.value);
                  if (next) handleSelectCourse(next);
                }}
              >
                {courseList.map((c) => (
                  <option key={courseIdOf(c)} value={courseIdOf(c)}>
                    {getCourseTitle(c, isVi)}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm font-black text-[#EA580C]">
                {getCourseTitle(course, isVi)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="duo-stat-pill" title={bilingualLabel("Chuỗi ngày học liên tục", "Day streak")}>
              <Flame size={20} className="text-[#FF7A00] fill-[#FF7A00]" />
              <span>{progress?.streakCount ?? progress?.currentStreak ?? 1}</span>
            </div>
            <div className="duo-stat-pill" title={bilingualLabel("Tổng điểm kinh nghiệm XP", "Total XP")}>
              <Zap size={20} className="text-[#FFC800] fill-[#FFC800]" />
              <span>{progress?.totalXp ?? 120} XP</span>
            </div>
            <div className="duo-stat-pill" title={bilingualLabel("Trái tim năng lượng", "Energy hearts")}>
              <Heart size={20} className="text-[#EF4444] fill-[#EF4444]" />
              <span>5</span>
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

        {/* 2-Column Duolingo Layout: Winding Path on Left, Quests & Leaderboard on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px] 2xl:grid-cols-[minmax(0,1fr)_400px] gap-6 lg:gap-8 xl:gap-10 items-start">
          
          {/* Main Learning Serpentine Path */}
          <div className="w-full min-w-0 max-w-[940px] mx-auto">
            {UNITS_DATA.map((unit, unitIdx) => {
              const unitLessons = lessons.slice(unit.lessonRange[0], unit.lessonRange[1] + 1);

              return (
                <div key={unit.unitNumber} className="mb-14">
                  {/* Unit Header Banner */}
                  <div
                    className="duo-unit-banner"
                    style={{ background: unit.gradient, boxShadow: `0 6px 0 ${unit.depthColor}` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="duo-unit-tag">
                          <BookOpen size={13} className="shrink-0" /> <BilingualText vi={`CHƯƠNG ${unit.unitNumber}`} en={`UNIT ${unit.unitNumber}`} />
                        </span>
                        <h2 className="duo-unit-title break-words"><BilingualText vi={unit.title} en={unit.titleEn || unit.title} /></h2>
                        <p className="duo-unit-desc break-words"><BilingualText vi={unit.description} en={unit.descriptionEn || unit.description} /></p>
                      </div>
                      <button
                        type="button"
                        className="duo-unit-guidebook-btn shrink-0 self-start sm:self-center"
                        onClick={() => setActiveGuidebook(unit.guidebook)}
                      >
                        <BookMarked size={16} className="shrink-0" />
                        <span className="whitespace-nowrap"><BilingualText vi="HƯỚNG DẪN" en="GUIDEBOOK" /></span>
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
                      const hasChest = unitIdx < UNITS_DATA.length - 1;
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
                                {/* Outer thick road base / shadow */}
                                <path d={d} fill="none" stroke="#D1BEA8" strokeWidth="18" strokeLinecap="round" />
                                {/* Main road surface */}
                                <path
                                  d={d}
                                  fill="none"
                                  stroke={isDoneSeg ? '#FFC800' : isActiveSeg ? '#E11D48' : '#EDE2D3'}
                                  strokeWidth="12"
                                  strokeLinecap="round"
                                />
                                {/* Stepping stone dashes */}
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
                          {/* Companion Mascot Nghé cheering beside the path at strategic nodes */}
                          {unit.unitNumber === 1 && idxInUnit === 1 && (
                            <div
                              className="duo-mascot-companion hidden md:flex"
                              style={{ left: 'calc(50% - 220px)', top: '-15px' }}
                            >
                              <div className="duo-mascot-bubble">
                                {isVi ? "Chỉ 5 phút mỗi ngày cùng Nghé nhé! 🎉" : "Just 5 minutes a day with Nghé! 🎉"}
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
                                {isVi ? "Phở & Bánh mì Việt Nam ngon tuyệt! 🍜" : "Vietnamese Pho & Banh Mi are delicious! 🍜"}
                              </div>
                              <BuffaloMascot variant="happy" size="medium" animated />
                            </div>
                          )}

                          {/* 3D Action Node */}
                          <div className="relative">
                            {isCurrent && (
                              <>
                                <div className="duo-node-ring" />
                                <div className="duo-floating-badge"><BilingualText vi="BẮT ĐẦU!" en="START!" /></div>
                              </>
                            )}

                            <button
                              type="button"
                              className={`duo-node-btn ${
                                isCompleted ? 'is-completed' : isCurrent ? 'is-current' : 'is-locked'
                              }`}
                              onClick={() => setSelectedLesson(lesson)}
                              title={getLessonTitle(lesson, isVi)}
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
                    {unitIdx < UNITS_DATA.length - 1 && (
                      <div className="mt-4 mb-8 flex flex-col items-center">
                        <button
                          type="button"
                          className="duo-chest-node"
                          onClick={() => setChestModalOpen(true)}
                          title={bilingualLabel("Rương phần thưởng chặng", "Milestone reward chest")}
                        >
                          <Gift size={34} strokeWidth={2.2} />
                          <span className="text-[10px] font-black tracking-wider uppercase mt-1">
                            +50 XP
                          </span>
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

          {/* Right Sidebar Companion Widgets (Duolingo Style) */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Daily Quests Widget */}
            <div className="duo-sidebar-widget">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-lg text-[#251B18] flex items-center gap-2">
                  <TargetIcon size={20} className="text-[#FF7A00]" /> <BilingualText vi="Nhiệm vụ hôm nay" en="Daily Quests" />
                </h3>
                <span className="text-xs font-extrabold text-[#8a7565]"><BilingualText vi="HẾT HẠN SAU 12H" en="EXPIRES IN 12H" /></span>
              </div>

              <div className="space-y-3.5">
                <div className="duo-quest-item">
                  <span className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-black">
                    <Trophy size={20} />
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
                  <span className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-black">
                    <Check size={20} />
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
                  <span className="w-10 h-10 rounded-xl bg-[#FFF4EB] text-[#FF7A00] flex items-center justify-center font-black">
                    <Zap size={20} />
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
                  <h4 className="font-black text-sm text-[#EA580C]"><BilingualText vi="Mẹo học từ Nghé:" en="Tip from Nghé:" /></h4>
                  <p className="mt-1 text-xs text-[#78685B] leading-relaxed">
                    <BilingualText vi="&ldquo;Luyện nghe thanh điệu 5 phút mỗi sáng sẽ giúp bạn phản xạ tự nhiên như người bản xứ!&rdquo;" en="&ldquo;Listening to tones for 5 minutes every morning builds natural reflexes!&rdquo;" />
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Duolingo Lesson Detail Popup Modal */}
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
                    ? (isVi ? '✓ ĐÃ HOÀN THÀNH' : '✓ COMPLETED')
                    : statusOf(selectedLesson) === 'current'
                    ? (isVi ? '★ ĐANG HỌC' : '★ CURRENT')
                    : (isVi ? '🔒 ĐANG KHÓA' : '🔒 LOCKED')}
                </span>

                <h3 className="mt-3 text-2xl font-black text-[#251B18] leading-snug">
                  {getLessonTitle(selectedLesson, isVi)}
                </h3>

                <p className="mt-2 text-sm text-[#78685B] leading-relaxed">
                  {getLessonDescription(selectedLesson, isVi)}
                </p>

                <div className="mt-4 flex items-center justify-center gap-4 text-xs font-bold text-[#EA580C]">
                  <span className="flex items-center gap-1.5 bg-[#FAF5EB] px-3 py-1.5 rounded-full">
                    <Clock3 size={15} /> {selectedLesson.estimatedDuration || 12} <BilingualText vi="phút" en="min" />
                  </span>
                  <span className="flex items-center gap-1.5 bg-[#FEF3C7] text-[#B45309] px-3 py-1.5 rounded-full">
                    +{selectedLesson.xpReward || 25} XP
                  </span>
                </div>

                {getLessonObjectives(selectedLesson, isVi).length > 0 && (
                  <div className="mt-5 text-left bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#EADBC8]">
                    <span className="block text-xs font-black uppercase tracking-wider text-[#8a7565] mb-2">
                      <BilingualText vi="Mục tiêu bài học:" en="Lesson objectives:" />
                    </span>
                    <ul className="space-y-1.5">
                      {getLessonObjectives(selectedLesson, isVi).map((obj: string, i: number) => (
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
                        <Play size={18} fill="currentColor" /> <BilingualText vi={`BẮT ĐẦU (+${selectedLesson.xpReward || 25} XP)`} en={`START (+${selectedLesson.xpReward || 25} XP)`} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guidebook Modal (Sổ tay hướng dẫn của chương) */}
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

              {/* Modal Header with right clearance for close button */}
              <div className="pr-12 pb-3 border-b border-[#F3EDE3]">
                <div className="flex items-center gap-2 text-xs font-black text-[#FF7A00] uppercase tracking-wider mb-1.5">
                  <BookMarked size={16} className="shrink-0" />
                  <span className="truncate"><BilingualText vi="Sổ tay ngữ pháp & phát âm" en="Grammar & Pronunciation Guidebook" /></span>
                </div>
                <h3 className="text-xl font-black text-[#251B18] leading-tight">
                  <BilingualText vi="Điểm ngữ pháp & Từ vựng quan trọng" en="Key Grammar & Vocabulary" />
                </h3>
              </div>

              {/* Scrollable Modal Body */}
              <div className="duo-guidebook-scroll flex-1 py-4 space-y-4">
                {/* Summary Box */}
                <div className="bg-[#FFFBF5] border border-[#F3E5D4] rounded-2xl p-3 text-xs text-[#78685B] leading-relaxed break-words">
                  {isVi ? activeGuidebook.summary : (activeGuidebook.summaryEn || activeGuidebook.summary)}
                </div>

                {/* Pronunciation Tips Section */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#8a7565] mb-2">
                    <BilingualText vi="Lời khuyên phát âm:" en="Pronunciation Tips:" />
                  </h4>
                  <div className="space-y-2">
                    {(isVi ? activeGuidebook.tips : (activeGuidebook.tipsEn || activeGuidebook.tips)).map((tip, i) => (
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

                {/* Key Vocabulary Section */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#8a7565] mb-2">
                    <BilingualText vi="Từ vựng then chốt:" en="Key Vocabulary:" />
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeGuidebook.vocabulary.map((vocab, i) => (
                      <div
                        key={i}
                        className="bg-[#FFF8EE] border border-[#EADBC8] p-3 rounded-xl text-xs flex flex-col justify-center min-w-0 overflow-hidden shadow-2xs"
                      >
                        <strong className="block text-[#FF7A00] font-black text-sm truncate vn-diacritic-safe" title={vocab.vi}>
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

              {/* Modal Footer Button */}
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
                <h3 className="mt-4 text-2xl font-black text-[#251B18]"><BilingualText vi="Rương Kho Báu Chặng!" en="Milestone Treasure Chest!" /></h3>
                <p className="mt-2 text-sm text-[#78685B]"><BilingualText vi="Hoàn thành toàn bộ các bài học trong chương để mở khóa rương kho báu và nhận +50 XP cùng danh hiệu danh dự!" en="Complete all lessons in the unit to unlock this chest and earn +50 XP plus an honor badge!" /></p>
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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export default DashboardScreen;
