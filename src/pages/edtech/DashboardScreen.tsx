import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, Award, BookMarked, BookOpen, Check, ChevronDown, Clock3,
  Flame, Gift, Heart, Lock, Map, Play, RefreshCw, Sparkles, Star, Trophy, X, Zap
} from 'lucide-react';
import { courseService } from '@/services/courseService';
import { learnerService } from '@/services/learnerService';
import { learningService } from '@/services/learningService';
import { BuffaloMascot } from '@/components/mascot';
import '@/presentation/styles/duolingo-path.css';

type AnyRecord = Record<string, any>;

const DEFAULT_CURRICULUM_LESSONS: AnyRecord[] = [
  {
    id: 1,
    title: 'Bài 1: Làm quen & Chào hỏi cơ bản',
    titleVi: 'Bài 1: Làm quen & Chào hỏi cơ bản',
    description: 'Học cách chào hỏi thông dụng trong đời sống Việt Nam: Xin chào, Cảm ơn, Tạm biệt và cách xưng hô lịch sự.',
    estimatedDuration: 10,
    xpReward: 20,
    objectives: ['Chào hỏi tự nhiên', 'Nhận biết phát âm Xin chào - Cảm ơn', 'Tự tin xưng hô ban đầu'],
    isCompleted: false,
    learningStatus: 'AVAILABLE',
  },
  {
    id: 2,
    title: 'Bài 2: Bảng chữ cái & 6 thanh điệu',
    titleVi: 'Bài 2: Bảng chữ cái & 6 thanh điệu',
    description: 'Khám phá bí mật 6 thanh điệu tiếng Việt (Ngang, Huyền, Sắc, Hỏi, Ngã, Nặng) với mô hình âm thanh trực quan.',
    estimatedDuration: 15,
    xpReward: 30,
    objectives: ['Phân biệt 6 dấu thanh', 'Thực hành các nguyên âm đặc trưng (ă, â, ê, ô, ơ, ư)', 'Luyện tai nghe cao độ'],
    isCompleted: false,
    learningStatus: 'AVAILABLE',
  },
  {
    id: 3,
    title: 'Bài 3: Đếm số & Giá tiền',
    titleVi: 'Bài 3: Đếm số & Giá tiền',
    description: 'Làm chủ các con số từ 1 đến 1.000.000 và cách hỏi giá tiền Việt Nam Đồng (VND) khi đi chợ hay mua sắm.',
    estimatedDuration: 12,
    xpReward: 25,
    objectives: ['Đếm số trôi chảy từ 1 đến 100', 'Hỏi giá: "Bao nhiêu tiền một cái?"', 'Nhận diện mệnh giá tiền polymer'],
    isCompleted: false,
    learningStatus: 'LOCKED',
  },
  {
    id: 4,
    title: 'Bài 4: Giới thiệu bản thân & Quốc tịch',
    titleVi: 'Bài 4: Giới thiệu bản thân & Quốc tịch',
    description: 'Tự tin giới thiệu tên tuổi, quê hương, nghề nghiệp và sở thích bằng các mẫu câu tiếng Việt tự nhiên.',
    estimatedDuration: 15,
    xpReward: 35,
    objectives: ['Mẫu câu: "Tôi là...", "Tôi đến từ..."', 'Nói về nghề nghiệp và thời gian ở Việt Nam', 'Giao tiếp làm quen bạn mới'],
    isCompleted: false,
    learningStatus: 'LOCKED',
  },
  {
    id: 5,
    title: 'Bài 5: Ẩm thực & Gọi món quán ăn',
    titleVi: 'Bài 5: Ẩm thực & Gọi món quán ăn',
    description: 'Học từ vựng các món ăn Việt nức tiếng: Phở, Bánh mì, Bún chả, Cà phê sữa đá và cách gọi món chuẩn phong cách bản địa.',
    estimatedDuration: 18,
    xpReward: 40,
    objectives: ['Gọi món và ghi chú đặc biệt (ít đá, không hành)', 'Hỏi xin hóa đơn: "Em ơi tính tiền!"', 'Khám phá văn hóa ẩm thực đường phố'],
    isCompleted: false,
    learningStatus: 'LOCKED',
  },
  {
    id: 6,
    title: 'Bài 6: Hỏi đường & Phương tiện đi lại',
    titleVi: 'Bài 6: Hỏi đường & Phương tiện đi lại',
    description: 'Cách hỏi đường, bắt xe ôm công nghệ (Grab, Be) và chỉ hướng rẽ trái, rẽ phải, đi thẳng tại phố phường Việt Nam.',
    estimatedDuration: 14,
    xpReward: 30,
    objectives: ['Chỉ đường: rẽ trái, rẽ phải, đi thẳng', 'Giao tiếp với tài xế xe công nghệ', 'Nhận diện các địa danh quen thuộc'],
    isCompleted: false,
    learningStatus: 'LOCKED',
  },
  {
    id: 7,
    title: 'Bài 7: Luyện phản xạ hội thoại AI',
    titleVi: 'Bài 7: Luyện phản xạ hội thoại AI',
    description: 'Thực hành tương tác trực tiếp với Gia sư AI thông minh để kiểm tra phản xạ nói và nhận phản hồi phát âm chuẩn xác.',
    estimatedDuration: 15,
    xpReward: 50,
    objectives: ['Luyện nói phản xạ không cần kịch bản', 'Nhận chấm điểm phát âm AI theo thời gian thực', 'Tự tin hội thoại thực tế'],
    isCompleted: false,
    learningStatus: 'LOCKED',
  },
  {
    id: 8,
    title: 'Bài 8: Tổng kết & Thử thách chặng Sơ cấp',
    titleVi: 'Bài 8: Tổng kết & Thử thách chặng Sơ cấp',
    description: 'Kiểm tra tổng hợp kiến thức chặng Sơ cấp, nhận huy hiệu hoàn thành và mở khóa chặng tiếp theo.',
    estimatedDuration: 20,
    xpReward: 80,
    objectives: ['Đạt 80%+ câu hỏi trắc nghiệm & nghe', 'Mở khóa chứng nhận Sơ cấp A1', 'Tích lũy trọn vẹn điểm thưởng chặng'],
    isCompleted: false,
    learningStatus: 'LOCKED',
  },
];

interface UnitConfig {
  unitNumber: number;
  title: string;
  description: string;
  gradient: string;
  depthColor: string;
  lessonRange: [number, number]; // 0-indexed inclusive [start, end]
  guidebook: {
    summary: string;
    tips: string[];
    vocabulary: { vi: string; en: string }[];
  };
}

const UNITS_DATA: UnitConfig[] = [
  {
    unitNumber: 1,
    title: 'Bước Đầu Làm Quen & Nền Tảng Âm Tiết',
    description: 'Làm quen cách chào hỏi lịch sự, giải mã 6 thanh điệu tiếng Việt và số đếm mua sắm.',
    gradient: 'linear-gradient(135deg, #FF7A00 0%, #E11D48 100%)',
    depthColor: '#7A170F',
    lessonRange: [0, 2], // Lessons 1, 2, 3
    guidebook: {
      summary: 'Nền tảng thanh điệu và các câu chào hỏi căn bản nhất khi gặp người Việt Nam.',
      tips: [
        'Tiếng Việt có 6 thanh điệu: Ngang (không dấu), Huyền (`), Sắc (´), Hỏi (?), Ngã (~), Nặng (.)',
        'Xưng hô lịch sự: Chào anh (nam lớn hơn), Chào chị (nữ lớn hơn), Chào em (nhỏ tuổi hơn).',
        'Khi mua sắm, luôn thêm "ạ" ở cuối câu để thể hiện sự lễ phép: "Bao nhiêu tiền ạ?"',
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
    description: 'Giới thiệu bản thân, tự tin gọi món phở bánh mì và hỏi đường đi lại.',
    gradient: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
    depthColor: '#064E3B',
    lessonRange: [3, 5], // Lessons 4, 5, 6
    guidebook: {
      summary: 'Cách giao tiếp trong quán ăn Việt Nam và chỉ dẫn đường phố thân thiện.',
      tips: [
        'Khi gọi phục vụ tại quán: "Em ơi!" hoặc "Anh ơi!" là cách gọi tự nhiên và phổ biến nhất.',
        'Mẫu câu gọi món: "Cho em một bát phở bò tái ít hành" hoặc "Cho một ly cà phê sữa đá mang đi".',
        'Hỏi đường: "Cho tôi hỏi đường ra chợ Bến Thành đi hướng nào ạ?"',
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
    description: 'Thực hành tương tác trực tiếp với Gia sư AI và hoàn thành thử thách chứng chỉ.',
    gradient: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)',
    depthColor: '#78350F',
    lessonRange: [6, 7], // Lessons 7, 8
    guidebook: {
      summary: 'Rèn luyện phản xạ phát âm chuẩn xác với Gia sư AI và tổng kết toàn bộ chặng Sơ cấp.',
      tips: [
        'Đừng sợ phát âm sai: Gia sư AI luôn kiên nhẫn sửa từng âm tiết và cao độ thanh điệu.',
        'Hãy luyện nói thành tiếng to, rõ ràng theo nhịp điệu tự nhiên.',
        'Hoàn thành bài 8 để nhận chứng chỉ điện tử A1 và mở khóa chặng Trung cấp!',
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
        const [summary, enrolledResponse] = await Promise.all([
          learnerService.getProgressData().catch(() => ({})),
          courseService.myCourses().catch(() => []),
        ]);

        if (!active) return;
        setProgress(summary ?? {});

        let enrolled = asArray(enrolledResponse);
        let current = enrolled.find((item) => item.status === 'ACTIVE') ?? enrolled[0] ?? null;

        // Auto-select and auto-enroll if learner has no courses enrolled yet
        if (!current) {
          try {
            const catalog = await courseService.list().catch(() => []);
            const allCourses = asArray(catalog);
            if (allCourses.length > 0) {
              current = allCourses[0];
              enrolled = allCourses;
              const autoId = courseIdOf(current);
              if (autoId) {
                courseService.enroll(autoId).catch(() => {});
              }
            }
          } catch {
            // fallback
          }
        }

        if (!current) {
          current = {
            id: 1,
            courseId: 1,
            title: 'Tiếng Việt Sơ Cấp A1',
            titleVi: 'Tiếng Việt Sơ Cấp A1',
            courseTitle: 'Tiếng Việt Sơ Cấp A1',
            description: 'Lộ trình tiếng Việt tương tác từng bước từ phát âm, 6 thanh điệu đến phản xạ hội thoại thực tế.',
            progress: 0,
          };
          enrolled = [current];
        }

        setCourseList(enrolled);
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
            id: 1,
            courseId: 1,
            title: 'Tiếng Việt Sơ Cấp A1',
            titleVi: 'Tiếng Việt Sơ Cấp A1',
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
          <h2 className="mt-4 text-xl font-black text-[#EA580C]">Đang chuẩn bị bản đồ học tập...</h2>
          <p className="mt-1 text-sm text-[#8a7565]">Nghé đang sắp xếp bài học theo cấp độ của bạn.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="duo-page-container">
      <div className="mx-auto max-w-6xl">
        {/* Duolingo Top Cockpit Bar */}
        <div className="duo-stats-bar">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-[#8a7565]">KHÓA ĐANG HỌC:</span>
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
                    {c.titleVi || c.title || c.courseTitle}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm font-black text-[#EA580C]">
                {course?.titleVi ?? course?.title ?? 'Tiếng Việt Sơ Cấp A1'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="duo-stat-pill" title="Chuỗi ngày học liên tục">
              <Flame size={20} className="text-[#FF7A00] fill-[#FF7A00]" />
              <span>{progress?.streakCount ?? progress?.currentStreak ?? 1}</span>
            </div>
            <div className="duo-stat-pill" title="Tổng điểm kinh nghiệm XP">
              <Zap size={20} className="text-[#FFC800] fill-[#FFC800]" />
              <span>{progress?.totalXp ?? 120} XP</span>
            </div>
            <div className="duo-stat-pill" title="Trái tim năng lượng">
              <Heart size={20} className="text-[#EF4444] fill-[#EF4444]" />
              <span>5</span>
            </div>
          </div>
        </div>

        {error ? (
          <div role="alert" className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <span>{error}</span>
            <button onClick={() => setRevision((v) => v + 1)} className="inline-flex items-center gap-2 font-bold hover:underline">
              <RefreshCw size={15} /> Thử lại
            </button>
          </div>
        ) : null}

        {/* 2-Column Duolingo Layout: Winding Path on Left, Quests & Leaderboard on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
          
          {/* Main Learning Serpentine Path */}
          <div className="w-full max-w-xl mx-auto">
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
                      <div>
                        <span className="duo-unit-tag">
                          <BookOpen size={13} /> CHƯƠNG {unit.unitNumber}
                        </span>
                        <h2 className="duo-unit-title">{unit.title}</h2>
                        <p className="duo-unit-desc">{unit.description}</p>
                      </div>
                      <button
                        type="button"
                        className="duo-unit-guidebook-btn self-start sm:self-center"
                        onClick={() => setActiveGuidebook(unit.guidebook)}
                      >
                        <BookMarked size={16} />
                        <span>HƯỚNG DẪN</span>
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
                              style={{ left: '-150px', top: '-15px' }}
                            >
                              <div className="duo-mascot-bubble">
                                "Chỉ 5 phút mỗi ngày cùng Nghé nhé! 🎉"
                              </div>
                              <BuffaloMascot variant="encouraging" size="medium" animated />
                            </div>
                          )}

                          {unit.unitNumber === 2 && idxInUnit === 1 && (
                            <div
                              className="duo-mascot-companion hidden md:flex"
                              style={{ right: '-150px', top: '-15px' }}
                            >
                              <div className="duo-mascot-bubble">
                                "Phở & Bánh mì Việt Nam ngon tuyệt! 🍜"
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
                                  BẮT ĐẦU!
                                </div>
                              </>
                            )}

                            {isCompleted && (
                              <div className="duo-stars-cluster">
                                <Star size={13} className="fill-[#FFC800] text-[#FFC800]" />
                                <Star size={17} className="fill-[#FFC800] text-[#FFC800] -translate-y-1" />
                                <Star size={13} className="fill-[#FFC800] text-[#FFC800]" />
                              </div>
                            )}

                            <button
                              type="button"
                              className={`duo-node-btn ${
                                isCompleted ? 'is-completed' : isCurrent ? 'is-current' : 'is-locked'
                              }`}
                              onClick={() => setSelectedLesson(lesson)}
                              title={lesson.titleVi || lesson.title}
                            >
                              {isCompleted ? (
                                <Check size={36} strokeWidth={4} />
                              ) : isLocked ? (
                                <Lock size={26} strokeWidth={2.5} />
                              ) : (
                                <Star size={36} strokeWidth={2.5} className="fill-white" />
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
                          title="Rương phần thưởng chặng"
                        >
                          <Gift size={34} strokeWidth={2.2} />
                          <span className="text-[10px] font-black tracking-wider uppercase mt-1">
                            +50 XP
                          </span>
                        </button>
                        <span className="text-xs font-bold text-[#8a7565] mt-2">
                          Rương quà chặng {unit.unitNumber}
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
                  <TargetIcon size={20} className="text-[#FF7A00]" /> Nhiệm vụ hôm nay
                </h3>
                <span className="text-xs font-extrabold text-[#8a7565]">HẾT HẠN SAU 12H</span>
              </div>

              <div className="space-y-3.5">
                <div className="duo-quest-item">
                  <span className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-black">
                    <Sparkles size={20} />
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-extrabold text-[#251B18] mb-1">
                      <span>Đạt 30 XP hôm nay</span>
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
                      <span>Hoàn thành 1 bài học</span>
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
                      <span>Luyện phản xạ với Gia sư AI</span>
                      <span>0 / 1</span>
                    </div>
                    <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF7A00] rounded-full" style={{ width: '0%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Leaderboard Widget */}
            <div className="duo-sidebar-widget">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-lg text-[#251B18] flex items-center gap-2">
                  <Trophy size={20} className="text-[#FFC800]" /> Bảng xếp hạng tuần
                </h3>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
                  HẠNG VÀNG
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { rank: 1, name: 'Alexandre (France)', xp: 420, medal: '🥇' },
                  { rank: 2, name: 'Minh Tuấn (Bạn)', xp: 350, medal: '🥈', isUser: true },
                  { rank: 3, name: 'Sarah Miller (USA)', xp: 290, medal: '🥉' },
                ].map((item) => (
                  <div
                    key={item.rank}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-black ${
                      item.isUser ? 'bg-[#FFF8EE] border-2 border-[#E8B74C]' : 'bg-[#F9FAFB]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.medal}</span>
                      <span className={item.isUser ? 'text-[#FF7A00]' : 'text-[#374151]'}>
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[#8a7565]">{item.xp} XP</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#F3EDE3] text-center">
                <Link
                  to="/progress"
                  className="text-xs font-black text-[#FF7A00] hover:underline"
                >
                  Xem bảng xếp hạng đầy đủ →
                </Link>
              </div>
            </div>

            {/* Mascot Tip Companion Card */}
            <div className="duo-sidebar-widget bg-gradient-to-br from-[#FFF9F2] to-[#FFF3E3] border-[#EADBC8]">
              <div className="flex items-start gap-3">
                <BuffaloMascot variant="teaching" size="small" animated />
                <div>
                  <h4 className="font-black text-sm text-[#EA580C]">Mẹo học từ Nghé:</h4>
                  <p className="mt-1 text-xs text-[#78685B] leading-relaxed">
                    "Luyện nghe thanh điệu 5 phút mỗi sáng sẽ giúp bạn phản xạ tự nhiên như người bản xứ!"
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
                aria-label="Đóng"
              >
                <X size={18} />
              </button>

              <div className="text-center pt-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFF4D5] text-[#9A6700]">
                  {statusOf(selectedLesson) === 'completed'
                    ? '✓ ĐÃ HOÀN THÀNH'
                    : statusOf(selectedLesson) === 'current'
                    ? '★ ĐANG HỌC'
                    : '🔒 ĐANG KHÓA'}
                </span>

                <h3 className="mt-3 text-2xl font-black text-[#251B18] leading-snug">
                  {selectedLesson.titleVi || selectedLesson.title}
                </h3>

                <p className="mt-2 text-sm text-[#78685B] leading-relaxed">
                  {selectedLesson.description}
                </p>

                <div className="mt-4 flex items-center justify-center gap-4 text-xs font-bold text-[#EA580C]">
                  <span className="flex items-center gap-1.5 bg-[#FAF5EB] px-3 py-1.5 rounded-full">
                    <Clock3 size={15} /> {selectedLesson.estimatedDuration || 12} phút
                  </span>
                  <span className="flex items-center gap-1.5 bg-[#FEF3C7] text-[#B45309] px-3 py-1.5 rounded-full">
                    <Sparkles size={15} /> +{selectedLesson.xpReward || 25} XP
                  </span>
                </div>

                {Array.isArray(selectedLesson.objectives) && selectedLesson.objectives.length > 0 && (
                  <div className="mt-5 text-left bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#EADBC8]">
                    <span className="block text-xs font-black uppercase tracking-wider text-[#8a7565] mb-2">
                      Mục tiêu bài học:
                    </span>
                    <ul className="space-y-1.5">
                      {selectedLesson.objectives.map((obj: string, i: number) => (
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
                        <RefreshCw size={18} /> ÔN TẬP BÀI HỌC (+10 XP)
                      </>
                    ) : statusOf(selectedLesson) === 'locked' ? (
                      <>
                        <Lock size={18} /> BÀI HỌC ĐANG KHÓA
                      </>
                    ) : (
                      <>
                        <Play size={18} fill="currentColor" /> BẮT ĐẦU (+{selectedLesson.xpReward || 25} XP)
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
              className="duo-modal-card max-w-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="duo-modal-close"
                onClick={() => setActiveGuidebook(null)}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>

              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs font-black text-[#FF7A00] uppercase tracking-wider mb-2">
                  <BookMarked size={18} /> Sổ tay ngữ pháp & phát âm
                </div>
                <h3 className="text-xl font-black text-[#251B18]">
                  Điểm ngữ pháp & Từ vựng quan trọng
                </h3>
                <p className="mt-2 text-xs text-[#78685B] leading-relaxed">
                  {activeGuidebook.summary}
                </p>

                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-black uppercase text-[#8a7565]">Lời khuyên phát âm:</h4>
                  {activeGuidebook.tips.map((tip, i) => (
                    <div key={i} className="text-xs bg-[#F9FAFB] p-2.5 rounded-xl border border-gray-200 text-[#374151]">
                      • {tip}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h4 className="text-xs font-black uppercase text-[#8a7565] mb-2">Từ vựng then chốt:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {activeGuidebook.vocabulary.map((vocab, i) => (
                      <div key={i} className="bg-[#FFF8EE] border border-[#EADBC8] p-2 rounded-xl text-xs">
                        <strong className="block text-[#FF7A00]">{vocab.vi}</strong>
                        <span className="text-[#8a7565]">{vocab.en}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full py-3 rounded-xl bg-[#F97316] text-white text-xs font-black hover:bg-[#C2410C] shadow-sm transition-colors"
                  onClick={() => setActiveGuidebook(null)}
                >
                  ĐÃ HIỂU! TIẾP TỤC HỌC
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
                aria-label="Đóng"
              >
                <X size={18} />
              </button>

              <div className="pt-2">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FEF3C7] border-4 border-[#F59E0B] flex items-center justify-center text-[#B45309] shadow-lg">
                  <Gift size={44} />
                </div>
                <h3 className="mt-4 text-2xl font-black text-[#251B18]">
                  Rương Kho Báu Chặng!
                </h3>
                <p className="mt-2 text-sm text-[#78685B]">
                  Hoàn thành toàn bộ các bài học trong chương để mở khóa rương kho báu và nhận <strong>+50 XP</strong> cùng danh hiệu danh dự!
                </p>
                <button
                  type="button"
                  className="mt-6 duo-3d-button is-primary"
                  onClick={() => setChestModalOpen(false)}
                >
                  CỐ GẮNG HỌC TIẾP!
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
