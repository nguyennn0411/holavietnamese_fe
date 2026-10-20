import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Sparkles,
  BookOpen,
  ArrowRight,
  Play,
  Compass,
  CheckCircle2,
  GraduationCap,
  Layers,
  Filter
} from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { CourseCard } from '@/components/course/CourseCard';
import { ResourceState } from '@/components/common/ResourceState';
import { EmptyState, Artwork } from '@/components/common/Ui';

const LEVEL_COLORS = {
  all: 'bg-stone-500',
  A0: 'bg-sky-500',
  A1: 'bg-emerald-500',
  A2: 'bg-teal-500',
  B1: 'bg-amber-500',
  B2: 'bg-purple-500',
  C1: 'bg-[#DA251D]',
};

export function CourseListPage() {
  const resource = useCourses();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const levelOptions = [
    { id: 'all', label: 'Tất cả trình độ', desc: 'Toàn bộ khóa học' },
    { id: 'A0', label: 'A0 - Nhập môn', desc: 'Chữ cái & Thanh điệu' },
    { id: 'A1', label: 'A1 - Cơ bản', desc: 'Chào hỏi & Giao tiếp nền tảng' },
    { id: 'A2', label: 'A2 - Sơ cấp', desc: 'Đời sống & Mua sắm hàng ngày' },
    { id: 'B1', label: 'B1 - Trung cấp', desc: 'Hội thoại mở rộng & Tự tin diễn đạt' },
    { id: 'B2', label: 'B2 - Cao cấp', desc: 'Làm việc & Thảo luận chủ đề' },
    { id: 'C1', label: 'C1 - Thành thạo', desc: 'Ngôn ngữ học thuật & Chuyên sâu' },
  ];

  return (
    <div className="courses-page w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9EE] via-[#F7F0E3] to-[#EEE3D1] border border-[#DECBB4] p-6 sm:p-10 shadow-sm">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none overflow-hidden hidden md:block select-none">
          <Artwork kind="dong-son" className="w-full h-full object-contain object-right" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5E1D8] border border-[#E7B59D] text-[#A62A24] text-xs font-extrabold uppercase tracking-wider shadow-2xs">
            <Sparkles size={14} className="text-[#DA251D]" />
            <BilingualText>{"Lộ trình toàn diện • Standard Vietnamese Curriculum"}</BilingualText>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#431914] tracking-tight leading-tight">
            <BilingualText>{"Học tiếng Việt theo lộ trình bài bản"}</BilingualText>
          </h1>

          <p className="text-sm sm:text-base text-[#78685B] leading-relaxed max-w-2xl">
            <BilingualText>
              {"Tìm điểm bắt đầu của bạn. Từng bài học được thiết kế bám sát thực tế đời sống, ngữ pháp tự nhiên và văn hóa Việt Nam."}
            </BilingualText>
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/my-learning"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#DA251D] hover:bg-[#B71C1C] text-white font-black text-xs shadow-md hover:shadow-lg transition-all no-underline active:scale-95"
            >
              <BilingualText>{"Góc học tập của tôi →"}</BilingualText>
            </Link>

            <Link
              to="/edtech/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-[#431914] border border-[#DECBB4] font-bold text-xs shadow-2xs transition-all hover:border-[#DA251D] no-underline active:scale-95"
            >
              <Compass size={15} className="text-[#DA251D]" />
              <BilingualText>{"Lộ trình học tương tác (EdTech) →"}</BilingualText>
            </Link>
          </div>
        </div>
      </section>

      {/* Alphabet Entry Banner */}
      <Link
        to="/alphabet"
        className="card alphabet-course-entry flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FFF9EE] to-[#F5E1D8] border border-[#DECBB4] hover:border-[#DA251D] shadow-2xs hover:shadow-md transition-all text-decoration-none group"
      >
        <div className="flex items-center gap-3.5">
          <span className="w-11 h-11 rounded-2xl bg-[#DA251D] text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
            Aa
          </span>
          <div>
            <strong className="block text-sm sm:text-base font-black text-[#A62A24] group-hover:text-[#DA251D] transition-colors">
              Bảng chữ cái tiếng Việt & 6 Thanh điệu →
            </strong>
            <span className="text-xs text-[#78685B] font-medium">
              29 chữ cái, ghép âm, thanh điệu đặc trưng · Tích hợp phát âm chuẩn giọng Bắc - Nam
            </span>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-[#DA251D] group-hover:translate-x-1 transition-transform">
          Học phát âm ngay →
        </span>
      </Link>

      {/* Main Content Area with Dynamic Filter Counts */}
      <ResourceState resource={resource}>
        {(items) => {
          // Tính toán số lượng theo từng trạng thái để hiển thị trên badge
          const statusCounts = {
            all: items.length,
            in_progress: 0,
            enrolled: 0,
            completed: 0,
            not_enrolled: 0,
          };

          items.forEach(({ enrollment }) => {
            const isEnrolled = Boolean(enrollment?.isEnrolled);
            const isCompleted =
              enrollment?.status === 'COMPLETED' || enrollment?.progressPercentage === 100;
            const isInProgress =
              isEnrolled &&
              !isCompleted &&
              (enrollment?.completedLessons > 0 ||
                enrollment?.progressPercentage > 0 ||
                enrollment?.status === 'IN_PROGRESS');

            if (isEnrolled) statusCounts.enrolled += 1;
            if (isInProgress) statusCounts.in_progress += 1;
            if (isCompleted) statusCounts.completed += 1;
            if (!isEnrolled) statusCounts.not_enrolled += 1;
          });

          const statusOptions = [
            { id: 'all', label: 'Tất cả trạng thái', count: statusCounts.all },
            { id: 'in_progress', label: 'Đang học', count: statusCounts.in_progress },
            { id: 'enrolled', label: 'Đã đăng ký', count: statusCounts.enrolled },
            { id: 'completed', label: 'Đã hoàn thành', count: statusCounts.completed },
            { id: 'not_enrolled', label: 'Chưa đăng ký', count: statusCounts.not_enrolled },
          ];

          // Lọc danh sách khóa học
          const filtered = items.filter(({ course, enrollment }) => {
            // Level filter
            if (level !== 'all' && course.level !== level) return false;

            // Search query filter
            const matchesSearch = `${course.title} ${course.description} ${course.titleVi || ''} ${course.descriptionVi || ''}`
              .toLowerCase()
              .includes(search.toLowerCase());
            if (!matchesSearch) return false;

            // Status filter
            const isEnrolled = Boolean(enrollment?.isEnrolled);
            const isCompleted =
              enrollment?.status === 'COMPLETED' || enrollment?.progressPercentage === 100;
            const isInProgress =
              isEnrolled &&
              !isCompleted &&
              (enrollment?.completedLessons > 0 ||
                enrollment?.progressPercentage > 0 ||
                enrollment?.status === 'IN_PROGRESS');

            if (statusFilter === 'in_progress') return isInProgress;
            if (statusFilter === 'enrolled') return isEnrolled;
            if (statusFilter === 'completed') return isCompleted;
            if (statusFilter === 'not_enrolled') return !isEnrolled;

            return true;
          });

          const enrolled = items.filter((i) => i.enrollment?.isEnrolled);

          return (
            <div className="space-y-8">
              {/* Modern Filter Toolbar */}
              <section className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#DECBB4] p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <Search
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78685B]"
                    />
                    <input
                      type="text"
                      aria-label="Tìm khóa học"
                      placeholder={bilingualLabel("Tìm khóa học theo tên hoặc nội dung…")}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-9 py-2.5 bg-[#FFF9EE] border border-[#DECBB4] focus:border-[#DA251D] focus:ring-2 focus:ring-[#DA251D]/10 rounded-xl text-xs sm:text-sm text-[#431914] placeholder-[#78685B]/60 transition-all outline-hidden"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78685B] hover:text-[#431914] p-1 cursor-pointer"
                        aria-label="Xóa tìm kiếm"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-[#78685B] flex items-center gap-1.5 self-end md:self-center">
                    <GraduationCap size={15} className="text-[#DA251D]" />
                    <span>
                      <BilingualText>{"Khám phá kho khóa học chuẩn CEFR"}</BilingualText>
                    </span>
                  </div>
                </div>

                {/* Status Filter Tabs with Counts */}
                <div
                  className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#DECBB4]/40"
                  role="tablist"
                  aria-label="Trạng thái học tập"
                >
                  {statusOptions.map((opt) => {
                    const isActive = statusFilter === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setStatusFilter(opt.id)}
                        className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-[#431914] text-[#FFF9EE] shadow-xs'
                            : 'text-[#78685B] hover:text-[#431914] hover:bg-[#F7F0E3]/70'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-stone-200/70 text-stone-600'
                          }`}
                        >
                          {opt.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Level Filter Pills */}
                <div
                  className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none"
                  role="tablist"
                  aria-label="Trình độ khóa học"
                >
                  {levelOptions.map((opt) => {
                    const isActive = level === opt.id;
                    const dotColor = LEVEL_COLORS[opt.id] || 'bg-stone-400';

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setLevel(opt.id)}
                        className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                          isActive
                            ? 'bg-[#DA251D] text-white shadow-sm ring-1 ring-[#B71C1C]'
                            : 'bg-[#FFF9EE] text-[#78685B] hover:text-[#431914] hover:bg-[#F7F0E3] border border-[#DECBB4]/70'
                        }`}
                      >
                        {opt.id !== 'all' && (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isActive ? 'bg-white' : dotColor
                            }`}
                          />
                        )}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Resume Course Strip if Enrolled (only on all filter without active search) */}
              {enrolled.length > 0 && statusFilter === 'all' && !search && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl bg-gradient-to-r from-[#24382B] via-[#2F4A39] to-[#3B5B47] text-[#FFF9EE] p-5 sm:p-7 shadow-md border border-[#24382B] flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                >
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-[#EDF0E5] text-[#24382B] font-extrabold text-[11px] uppercase tracking-wider">
                      <Play size={11} fill="currentColor" />
                      <BilingualText>{"Tiếp nối hành trình học tập"}</BilingualText>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white m-0">
                      {enrolled[0].course.title}
                    </h2>
                    <p className="text-xs text-[#D5DDCB] m-0">
                      <BilingualText>
                        {"Khóa học bạn đang theo học gần đây nhất. Hãy tiếp tục để duy trì phản xạ!"}
                      </BilingualText>
                    </p>
                  </div>

                  <Link
                    to={`/learn/${enrolled[0].course.id}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#E1B65B] hover:bg-[#d4a849] text-[#431914] font-black text-xs shadow-md transition-all self-start sm:self-center shrink-0 no-underline"
                  >
                    <BilingualText>{"Tiếp tục học ngay →"}</BilingualText>
                  </Link>
                </motion.div>
              )}

              {/* Section Heading with Counter */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#431914] tracking-tight m-0">
                    <BilingualText>{"Một thế giới để khám phá"}</BilingualText>
                  </h2>
                  <p className="text-xs text-[#78685B] mt-0.5 m-0">
                    <BilingualText>{"Danh sách các khóa học được biên soạn chuẩn khung năng lực"}</BilingualText>
                  </p>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#FFF9EE] border border-[#DECBB4] text-xs font-black text-[#DA251D] shadow-2xs">
                  {filtered.length} <BilingualText>{"khóa học"}</BilingualText>
                </span>
              </div>

              {/* Grid of Course Cards */}
              {filtered.length > 0 ? (
                <div className="card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map(({ course, enrollment }) => (
                    <CourseCard key={course.id} course={course} enrollment={enrollment} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <EmptyState
                    title={items.length ? 'Không tìm thấy khóa học phù hợp' : 'Các khóa học sẽ sớm có mặt'}
                    description={
                      items.length
                        ? 'Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc trình độ / trạng thái.'
                        : 'Hãy quay lại sau để đón đọc những bài học mới nhất.'
                    }
                  />
                  {(search || level !== 'all' || statusFilter !== 'all') && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSearch('');
                          setLevel('all');
                          setStatusFilter('all');
                        }}
                        className="px-5 py-2.5 rounded-2xl bg-[#DA251D] text-white font-bold text-xs shadow-xs hover:bg-[#B71C1C] transition-all cursor-pointer"
                      >
                        <BilingualText>{"Đặt lại tất cả bộ lọc"}</BilingualText>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }}
      </ResourceState>
    </div>
  );
}

export default CourseListPage;
