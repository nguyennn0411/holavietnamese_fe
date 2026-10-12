import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Flame,
  Zap,
  Heart,
  Gem,
  Award,
  Play,
  CheckCircle2,
  Lock,
  Gift,
  Trophy,
  ChevronRight,
  Sparkles,
  BookOpen,
  Volume2,
  ArrowLeftRight,
  Home,
  Bot,
  Compass,
  GraduationCap,
  Languages,
} from 'lucide-react';
import { Button } from '@/components/edtech/ui/Button';
import { ProgressBar } from '@/components/edtech/ui/ProgressBar';
import { UserProgressDTO, LearningUnitDTO, DailyChallengeDTO } from '@/types/edtech';
import { VIETNAMESE_TONES } from '@/constants/vietnameseTones';
import { ToneCurveGraph } from '@/components/edtech/ui/ToneCurveGraph';
import { audioFeedback } from '@/utils/audioFeedback';

// Mock User Progress matching Spring Boot DTO
const MOCK_USER_PROGRESS: UserProgressDTO = {
  userId: 'usr-exp-01',
  userName: 'Alex Taylor',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  streakDays: 7,
  streakActiveToday: true,
  xpTotal: 1240,
  xpToday: 35,
  dailyGoalXp: 50,
  level: 3,
  hearts: 5,
  maxHearts: 5,
  gems: 480,
  currentUnitId: 'unit-1',
  currentLessonId: 'lesson-a1-coffee-and-tones',
  completedLessonIds: ['lesson-intro-01'],
};

// Mock Learning Unit and Path Nodes
const MOCK_UNIT: LearningUnitDTO = {
  id: 'unit-1',
  unitNumber: 1,
  title: 'Ẩm thực đường phố & Phát âm',
  titleVi: 'Đơn vị 1: Ẩm thực & 6 Thanh điệu',
  themeColor: 'emerald',
  description: 'Khám phá văn hóa ẩm thực Việt Nam và làm quen với hệ thống thanh điệu.',
  nodes: [
    {
      id: 'lesson-intro-01',
      unitNumber: 1,
      lessonNumber: 1,
      title: 'Xin chào & Cảm ơn',
      titleVi: 'Bài 1: Lời chào thân thiện',
      description: 'Làm quen với các câu giao tiếp cơ bản.',
      cefrLevel: 'A1',
      status: 'COMPLETED',
      stars: 3,
      xpReward: 15,
      type: 'LESSON',
    },
    {
      id: 'lesson-a1-coffee-and-tones',
      unitNumber: 1,
      lessonNumber: 2,
      title: 'Cà phê sữa đá & Thanh điệu',
      titleVi: 'Bài 2: Gọi cà phê & Luyện 6 thanh',
      description: 'Học cách gọi đồ uống và phân biệt cao độ thanh điệu.',
      cefrLevel: 'A1',
      status: 'CURRENT',
      stars: 0,
      xpReward: 25,
      type: 'LESSON',
    },
    {
      id: 'chest-bonus-01',
      unitNumber: 1,
      lessonNumber: 3,
      title: 'Rương kho báu: Tiếng lóng Sài Gòn',
      titleVi: 'Phần thưởng từ vựng',
      description: 'Nhận 50 Gems và từ vựng đặc sắc.',
      cefrLevel: 'A1',
      status: 'LOCKED',
      stars: 0,
      xpReward: 50,
      type: 'CHEST',
    },
    {
      id: 'lesson-tones-deep-dive',
      unitNumber: 1,
      lessonNumber: 4,
      title: 'Chuyên sâu: Dấu Hỏi (?) vs Dấu Ngã (~)',
      titleVi: 'Bài 3: Bí quyết hỏi và ngã',
      description: 'Làm chủ hai thanh điệu khó nhất với người nước ngoài.',
      cefrLevel: 'A1',
      status: 'LOCKED',
      stars: 0,
      xpReward: 30,
      type: 'TONE_DRILL',
    },
    {
      id: 'unit-checkpoint-01',
      unitNumber: 1,
      lessonNumber: 5,
      title: 'Kiểm tra Đơn vị 1: Sẵn sàng dạo phố',
      titleVi: 'Cột mốc Đơn vị 1',
      description: 'Vượt qua thử thách để nhận Cúp vinh danh.',
      cefrLevel: 'A1',
      status: 'LOCKED',
      stars: 0,
      xpReward: 100,
      type: 'CHECKPOINT',
    },
  ],
};

const MOCK_CHALLENGES: DailyChallengeDTO[] = [
  {
    id: 'ch-1',
    title: 'Đạt mục tiêu hàng ngày',
    description: 'Kiếm 50 XP trong hôm nay',
    currentCount: 35,
    targetCount: 50,
    rewardXp: 20,
    completed: false,
    claimed: false,
    iconName: 'zap',
  },
  {
    id: 'ch-2',
    title: 'Bậc thầy cao độ',
    description: 'Luyện 1 bài nhận diện thanh điệu',
    currentCount: 1,
    targetCount: 1,
    rewardXp: 15,
    completed: true,
    claimed: false,
    iconName: 'volume-2',
  },
  {
    id: 'ch-3',
    title: 'Chuỗi bất bại',
    description: 'Học 3 bài học không mất tim',
    currentCount: 1,
    targetCount: 3,
    rewardXp: 30,
    completed: false,
    claimed: false,
    iconName: 'flame',
  },
];

// Related Learning Hubs in the HolaVietnamese platform
const RELATED_LEARNING_HUBS = [
  {
    title: 'Khóa Học Bài Bản',
    titleEn: 'Structured Courses',
    desc: 'Học giáo trình phân cấp theo khung chuẩn CEFR (A1, A2, B1, B2) kèm bài tập lý thuyết.',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-600',
    link: '/courses',
    badge: 'Giáo trình chuẩn',
  },
  {
    title: 'Luyện Nói Cùng AI Tutor',
    titleEn: 'AI Tutor & Roleplay',
    desc: 'Thực hành hội thoại nhập vai tình huống đời thực (nhà hàng, sân bay, chợ Bến Thành).',
    icon: Bot,
    color: 'from-purple-500 to-pink-600',
    link: '/ai-tutor',
    badge: 'Tương tác thông minh',
  },
  {
    title: 'Kho Từ Vựng & 6 Thanh Điệu',
    titleEn: 'Vocabulary & Tone Hub',
    desc: 'Tra cứu phiên âm IPA, nghe phát âm và luyện đối chiếu cặp thanh điệu dễ nhầm.',
    icon: Languages,
    color: 'from-emerald-500 to-teal-600',
    link: '/edtech/vocabulary',
    badge: 'Luyện âm chuyên sâu',
  },
  {
    title: 'Khám Phá Văn Hóa & Du Lịch',
    titleEn: 'Culture & Destinations',
    desc: 'Tìm hiểu phong tục tập quán, ẩm thực đặc trưng và địa danh nổi tiếng Việt Nam.',
    icon: Compass,
    color: 'from-amber-500 to-orange-600',
    link: '/culture',
    badge: 'Trải nghiệm Việt Nam',
  },
  {
    title: 'Góc Học Tập & Tiến Trình',
    titleEn: 'My Learning & Progress',
    desc: 'Theo dõi chỉ số học tập chi tiết, sổ tay từ vựng đã lưu và bộ sưu tập huy hiệu đạt được.',
    icon: GraduationCap,
    color: 'from-rose-500 to-red-600',
    link: '/my-learning',
    badge: 'Thống kê cá nhân',
  },
];

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [progress] = useState<UserProgressDTO>(MOCK_USER_PROGRESS);
  const [challenges, setChallenges] = useState<DailyChallengeDTO[]>(MOCK_CHALLENGES);
  const [selectedNode, setSelectedNode] = useState(MOCK_UNIT.nodes[1]);

  const handleClaimChallenge = (id: string) => {
    audioFeedback.playSuccessChime();
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, claimed: true } : c))
    );
  };

  const handleStartCurrentLesson = () => {
    audioFeedback.playPopSound(1.2);
    navigate('/edtech/lesson');
  };

  return (
    <div className="w-full antialiased selection:bg-[#F5E1D8] selection:text-[#A62A24] pb-16">
      {/* Top Breadcrumb & Gamification Ribbon */}
      <div className="bg-white/95 rounded-3xl p-4 md:p-5 border border-[#DECBB4]/70 shadow-card-soft mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Breadcrumbs Navigation linking back to Home */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 w-full md:w-auto">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[#431914] hover:text-[#A62A24] transition-colors px-2.5 py-1.5 rounded-xl hover:bg-[#FFF9EE]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#A62A24] bg-[#F5E1D8] px-3 py-1 rounded-xl border border-[#E7B59D] flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#A62A24]" />
            Lộ trình học tương tác (EdTech Path)
          </span>
        </div>

        {/* Gamified Live Stats Ribbon */}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end w-full md:w-auto">
          {/* Daily Streak */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 font-extrabold text-xs md:text-sm shadow-sm"
            title="Chuỗi ngày học liên tục"
          >
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            </motion.div>
            <span>{progress.streakDays} ngày</span>
          </div>

          {/* Gems */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 font-extrabold text-xs md:text-sm shadow-sm"
            title="Đá quý thưởng"
          >
            <Gem className="w-4 h-4 fill-sky-500 text-sky-500" />
            <span>{progress.gems}</span>
          </div>

          {/* Hearts */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-xs md:text-sm shadow-sm"
            title="Số tim còn lại"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>{progress.hearts}/5</span>
          </div>

          {/* Total XP */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 font-extrabold text-xs md:text-sm shadow-sm"
            title="Tổng điểm kinh nghiệm"
          >
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{progress.xpTotal} XP</span>
          </div>

          {/* User Level */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFF9EE] border border-[#DECBB4] text-[#431914] font-extrabold text-xs">
            <span>Cấp {progress.level}</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content: Learning Path + Hero & Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* LEFT COLUMN: Learning Path & Units (7 cols) */}
        <section className="lg:col-span-7 flex flex-col items-center">
          {/* Unit Header Card */}
          <div className="w-full bg-gradient-to-r from-[#A62A24] via-[#89221E] to-[#431914] rounded-3xl p-6 text-white shadow-lg mb-8 relative overflow-hidden border border-[#DECBB4]/40">
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E1B65B] bg-[#431914]/60 px-3 py-1 rounded-full border border-[#E1B65B]/40">
                {MOCK_UNIT.titleVi}
              </span>
              <h1 className="text-2xl md:text-3xl font-black mt-2 tracking-tight">
                {MOCK_UNIT.title}
              </h1>
              <p className="text-sm text-[#F7F0E3]/90 mt-1 max-w-md">
                {MOCK_UNIT.description}
              </p>
            </div>

            {/* Background graphic flare */}
            <div className="absolute right-0 bottom-0 opacity-15 translate-x-4 translate-y-4">
              <Award className="w-40 h-40" />
            </div>
          </div>

          {/* Interactive Learning Path Tree (Curved Duolingo Path) */}
          <div className="w-full max-w-md flex flex-col items-center gap-6 py-4 relative">
            {MOCK_UNIT.nodes.map((node, index) => {
              const isCurrent = node.status === 'CURRENT';
              const isCompleted = node.status === 'COMPLETED';
              const isLocked = node.status === 'LOCKED';

              // Alternate x offsets to generate a friendly winding path
              const offsets = [0, -35, 30, -20, 0];
              const xOffset = offsets[index % offsets.length];

              return (
                <div
                  key={node.id}
                  style={{ transform: `translateX(${xOffset}px)` }}
                  className="relative flex flex-col items-center"
                >
                  {/* Current Active Crown Floating Badge */}
                  {isCurrent && (
                    <motion.div
                      animate={{ y: [-4, 4, -4] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -top-10 bg-[#E1B65B] text-[#431914] font-extrabold text-xs px-3.5 py-1 rounded-xl shadow-md border border-[#c99f3b] flex items-center gap-1 select-none whitespace-nowrap z-20"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      Bắt đầu bài này!
                    </motion.div>
                  )}

                  {/* Path Node Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: isLocked ? 1 : 1.08 }}
                    whileTap={{ scale: isLocked ? 1 : 0.95 }}
                    onClick={() => {
                      if (isCurrent) {
                        handleStartCurrentLesson();
                      } else {
                        setSelectedNode(node);
                      }
                    }}
                    className={`!min-h-0 !p-0 !border-0 w-20 h-20 rounded-full flex flex-col items-center justify-center font-black transition-all cursor-pointer select-none relative ${
                      isCompleted
                        ? 'bg-[#E1B65B] text-[#431914] shadow-[0_6px_0_#b45309] hover:bg-[#ebc46e]'
                        : isCurrent
                        ? 'bg-[#A62A24] text-white shadow-[0_6px_0_#89221E] hover:bg-[#89221E] ring-8 ring-[#A62A24]/15'
                        : 'bg-[#EEE3D1] text-[#78685B] shadow-[0_4px_0_#DECBB4] cursor-not-allowed'
                    }`}
                    aria-label={`Bài học ${node.titleVi}`}
                  >
                    {isCompleted && <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />}
                    {isCurrent && <Play className="w-8 h-8 fill-current ml-1" />}
                    {isLocked && node.type === 'CHEST' && (
                      <Gift className="w-8 h-8 text-slate-400" />
                    )}
                    {isLocked && node.type === 'CHECKPOINT' && (
                      <Trophy className="w-8 h-8 text-slate-400" />
                    )}
                    {isLocked && node.type !== 'CHEST' && node.type !== 'CHECKPOINT' && (
                      <Lock className="w-7 h-7" />
                    )}
                  </motion.button>

                  {/* Lesson Label */}
                  <span className="text-xs font-bold text-slate-700 mt-2 text-center max-w-[130px] leading-tight select-none">
                    {node.titleVi}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT COLUMN: Continue Learning Hero & Daily Challenges (5 cols) */}
        <aside className="lg:col-span-5 flex flex-col gap-6">
          {/* Prominent "Continue Learning" Hero Card */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-card-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#A62A24] bg-[#F5E1D8] px-2.5 py-1 rounded-lg border border-[#E7B59D]">
                Đang học tiếp
              </span>
              <span className="text-xs font-bold text-slate-400">
                +{selectedNode.xpReward} XP
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
              {selectedNode.titleVi}
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {selectedNode.description}
            </p>

            {/* Mini Progress */}
            <div className="mb-5">
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                <span>Tiến trình bài</span>
                <span>0 / 5 câu</span>
              </div>
              <ProgressBar current={0} total={5} height="sm" color="red" />
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleStartCurrentLesson}
              icon={<Play className="w-5 h-5 fill-current" />}
              is3D
            >
              Vào học ngay • Start Lesson
            </Button>
          </div>

          {/* Daily Challenges Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-400" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Thử thách hôm nay
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">
                Làm mới lúc 00:00
              </span>
            </div>

            <div className="space-y-4">
              {challenges.map((ch) => (
                <div
                  key={ch.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">
                      {ch.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 block mb-2">
                      {ch.description}
                    </span>

                    <ProgressBar
                      current={ch.currentCount}
                      total={ch.targetCount}
                      height="sm"
                      color="amber"
                    />
                  </div>

                  <div className="shrink-0">
                    {ch.completed && !ch.claimed ? (
                      <button
                        type="button"
                        onClick={() => handleClaimChallenge(ch.id)}
                        className="!min-h-0 !border-0 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xs shadow-[0_2px_0_#b45309] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                      >
                        Nhận +{ch.rewardXp} XP
                      </button>
                    ) : ch.claimed ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Đã nhận
                      </span>
                    ) : (
                      <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-1 rounded-lg">
                        +{ch.rewardXp} XP
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tone Drill Shortcut */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 rounded-3xl p-5 border border-purple-200/80 shadow-card-soft">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-purple-600" />
                <h4 className="text-sm font-extrabold text-slate-900">
                  Luyện Cao Độ & Cặp Dấu Dễ Nhầm
                </h4>
              </div>
              <button
                type="button"
                onClick={() => navigate('/edtech/vocabulary')}
                className="!min-h-0 !p-0 !border-0 bg-transparent text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Xem Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              So sánh nhanh cặp dấu Hỏi (?) và Ngã (~) để luyện tai nghe bản ngữ:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <ToneCurveGraph
                tone={VIETNAMESE_TONES.HOI}
                compact
                interactive
              />
              <ToneCurveGraph
                tone={VIETNAMESE_TONES.NGA}
                compact
                interactive
              />
            </div>
          </div>
        </aside>
      </div>

      {/* BOTTOM SECTION: Cross-Feature Navigation (Connects with the entire app) */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-card-soft">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Hệ sinh thái học tập • Learning Ecosystem
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2">
              Khám Phá Các Phân Hệ Học Khác
            </h3>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Kết hợp lộ trình gamification với khóa học bài bản, đối thoại AI và khám phá văn hóa.
            </p>
          </div>
        </div>

        {/* 5 Connected Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RELATED_LEARNING_HUBS.map((hub) => {
            const IconComponent = hub.icon;

            return (
              <Link
                key={hub.title}
                to={hub.link}
                className="group p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-300 hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${hub.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-700 transition-colors">
                      {hub.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    {hub.title}
                  </h4>
                  <span className="text-xs text-slate-400 block -mt-0.5 mb-2 font-medium">
                    {hub.titleEn}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {hub.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                  <span>Trải nghiệm ngay</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};
