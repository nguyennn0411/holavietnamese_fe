import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  X,
  Play,
  ArrowRight,
  Compass,
  Sparkles,
} from 'lucide-react';
import { useCourses } from '@/features/learning/hooks/useCourses';
import { CourseCard } from '@/features/learning/components/course/CourseCard';
import { ResourceState } from '@/shared/components/common/ResourceState';
import { EmptyState, Artwork } from '@/shared/components/common/Ui';
import {
  GOAL_PROFILES,
  PACE_PROFILES,
  rankCoursesForRecommendation,
} from '@/features/onboarding/services/recommendationEngine';

const LEVEL_COLORS = {
  all: 'bg-stone-400',
  A0: 'bg-sky-500',
  A1: 'bg-emerald-500',
  A2: 'bg-teal-500',
  B1: 'bg-amber-500',
  B2: 'bg-purple-500',
  C1: 'bg-[#F97316]',
};

export function CourseListPage() {
  const resource = useCourses();
  const [searchParams] = useSearchParams();
  const requestedLevel = searchParams.get('level')?.toUpperCase();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState(() => (
    requestedLevel && Object.hasOwn(LEVEL_COLORS, requestedLevel) ? requestedLevel : 'all'
  ));
  const [statusFilter, setStatusFilter] = useState('all');
  const goalId = searchParams.get('goal') || 'other';
  const paceId = searchParams.get('pace') || 'steady';
  const goalProfile = GOAL_PROFILES[goalId] || GOAL_PROFILES.other;
  const paceProfile = PACE_PROFILES[paceId] || PACE_PROFILES.steady;
  const isPersonalizedRecommendation = searchParams.get('recommended') === '1' && level !== 'all';

  const levelOptions = [
    { id: 'all', label: 'Tất cả trình độ', labelEn: 'All levels', desc: 'Toàn bộ khóa học', descEn: 'All courses' },
    { id: 'A0', label: 'A0 - Nhập môn', labelEn: 'A0 - Absolute Beginner', desc: 'Chữ cái & Thanh điệu', descEn: 'Alphabet & 6 Tones' },
    { id: 'A1', label: 'A1 - Cơ bản', labelEn: 'A1 - Elementary', desc: 'Chào hỏi & Giao tiếp nền tảng', descEn: 'Greetings & Basic Communication' },
    { id: 'A2', label: 'A2 - Sơ cấp', labelEn: 'A2 - Pre-Intermediate', desc: 'Đời sống & Mua sắm hàng ngày', descEn: 'Daily Life & Shopping' },
    { id: 'B1', label: 'B1 - Trung cấp', labelEn: 'B1 - Intermediate', desc: 'Hội thoại mở rộng & Tự tin diễn đạt', descEn: 'Conversations & Self-Expression' },
    { id: 'B2', label: 'B2 - Cao cấp', labelEn: 'B2 - Upper Intermediate', desc: 'Làm việc & Thảo luận chủ đề', descEn: 'Work & Thematic Discussions' },
    { id: 'C1', label: 'C1 - Thành thạo', labelEn: 'C1 - Advanced', desc: 'Ngôn ngữ học thuật & Chuyên sâu', descEn: 'Academic & In-depth Fluency' },
  ];

  return (
    <div className="courses-page w-full max-w-full px-0 py-2 sm:py-4 space-y-7">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FFF9F2] to-[#FFF3E6] border border-[#EADBC8]/70 p-6 sm:p-8 md:p-10 shadow-xs">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.07] pointer-events-none overflow-hidden hidden md:block select-none">
          <Artwork kind="dong-son" className="w-full h-full object-contain object-right" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#FDBA74]/40 text-[#EA580C] text-[11px] sm:text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles size={13} className="text-[#EA580C]" />
            <BilingualText>{"Lộ trình toàn diện • Standard Vietnamese Curriculum"}</BilingualText>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E293B] tracking-tight leading-snug">
            <BilingualText>{"Học tiếng Việt theo lộ trình bài bản"}</BilingualText>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#64748B] leading-relaxed max-w-2xl">
            <BilingualText>
              {"Tìm điểm bắt đầu của bạn. Từng bài học được thiết kế bám sát thực tế đời sống, ngữ pháp tự nhiên và văn hóa Việt Nam."}
            </BilingualText>
          </p>

          <div className="pt-1.5 flex flex-wrap items-center gap-2.5">
            <Link
              to="/my-learning"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-xs hover:shadow transition-all no-underline active:scale-95"
            >
              <BilingualText>{"Góc học tập của tôi →"}</BilingualText>
            </Link>

            <Link
              to="/edtech/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFF9F2] text-[#1E293B] border border-[#E2E8F0] hover:border-[#FDBA74] font-bold text-xs shadow-2xs transition-all no-underline active:scale-95"
            >
              <BilingualText>{"Lộ trình học tương tác (EdTech) →"}</BilingualText>
            </Link>
          </div>
        </div>
      </section>

      {isPersonalizedRecommendation && (
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-5 py-4 shadow-xs" role="status">
          <div className="flex items-start gap-3">
            <div>
              <strong className="block text-sm text-emerald-950"><BilingualText vi="Lộ trình khóa học dành riêng cho bạn" en="Your personalized course pathway" /></strong>
              <span className="text-xs text-emerald-800"><BilingualText vi={`${goalProfile.titleVi} · Bắt đầu ở ${level} · ${paceProfile.titleVi}.`} en={`${goalProfile.titleEn} · Starting at ${level} · ${paceProfile.titleEn}.`} /></span>
            </div>
          </div>
          <button type="button" className="inline-flex min-h-8 shrink-0 items-center justify-center rounded-xl border border-emerald-300 bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer" onClick={() => setLevel('all')}><BilingualText vi="Xem tất cả trình độ" en="View all levels" /></button>
        </section>
      )}

      {/* Alphabet Entry Banner */}
      <Link
        to="/alphabet"
        className="alphabet-course-banner group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white hover:bg-[#FFFDF9] border border-[#E8E5DF] hover:border-[#FDBA74] shadow-2xs hover:shadow-xs transition-all duration-200 text-decoration-none"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] text-[#EA580C] border border-[#FED7AA]/60 flex items-center justify-center font-extrabold text-sm shadow-2xs shrink-0 group-hover:scale-105 transition-transform duration-200">
            Aa
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#1E293B] group-hover:text-[#EA580C] transition-colors m-0 truncate">
                <BilingualText vi="Bảng chữ cái tiếng Việt & 6 Thanh điệu" en="Vietnamese Alphabet & 6 Tones" />
              </h3>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-[#FFF1E6] text-[#EA580C] text-[10px] font-bold">
                <BilingualText vi="Nền tảng" en="Foundational" />
              </span>
            </div>
            <p className="text-xs text-[#64748B] m-0 line-clamp-1">
              <BilingualText
                vi="29 chữ cái, ghép âm, thanh điệu đặc trưng · Tích hợp phát âm chuẩn giọng Bắc - Nam"
                en="29 letters, syllable combinations, tones · Northern & Southern standard pronunciation"
              />
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end shrink-0">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFF1E6] hover:bg-[#FFE4D3] text-[#EA580C] border border-[#FDBA74]/50 group-hover:border-[#EA580C]/40 text-xs font-bold transition-all shadow-2xs group-hover:shadow-xs">
            <BilingualText vi="Học phát âm ngay" en="Learn pronunciation now" />
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </span>
        </div>
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
            { id: 'all', label: 'Tất cả trạng thái', labelEn: 'All statuses', count: statusCounts.all },
            { id: 'in_progress', label: 'Đang học', labelEn: 'In Progress', count: statusCounts.in_progress },
            { id: 'enrolled', label: 'Đã đăng ký', labelEn: 'Enrolled', count: statusCounts.enrolled },
            { id: 'completed', label: 'Đã hoàn thành', labelEn: 'Completed', count: statusCounts.completed },
            { id: 'not_enrolled', label: 'Chưa đăng ký', labelEn: 'Not Enrolled', count: statusCounts.not_enrolled },
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
          const recommendedCourses = isPersonalizedRecommendation
            ? rankCoursesForRecommendation(items, { targetLevel: level, goalId }).slice(0, 3)
            : [];

          return (
            <div className="space-y-8">
              {recommendedCourses.length > 0 && (
                <section className="space-y-4 rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50/90 to-white p-5 sm:p-7 shadow-sm" aria-labelledby="recommended-courses-title">
                  <div className="max-w-3xl">
                    <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#EA580C]"><BilingualText vi="Gợi ý từ kết quả onboarding" en="Recommended from your onboarding" /></span>
                    <h2 id="recommended-courses-title" className="mt-1 mb-1 text-xl sm:text-2xl font-black text-[#253044]"><BilingualText vi="Nên học những khóa này trước" en="Start with these courses" /></h2>
                    <p className="m-0 text-xs sm:text-sm leading-relaxed text-[#64748B]"><BilingualText vi={`Các khóa học được xếp hạng theo trình độ ${level} và mục tiêu “${goalProfile.titleVi}”.`} en={`Courses are ranked for level ${level} and your goal: “${goalProfile.titleEn}”.`} /></p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedCourses.map(({ course, enrollment }, index) => (
                      <CourseCard key={`recommended-${course.id}`} course={course} enrollment={enrollment} recommendationRank={index + 1} />
                    ))}
                  </div>
                </section>
              )}

              {/* Modern Filter Toolbar */}
              <section className="bg-white rounded-2xl border border-[#E8E5DF] p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-full sm:max-w-md md:max-w-lg">
                    <Search
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                    />
                    <input
                      type="text"
                      aria-label={bilingualLabel("Tìm khóa học", "Search courses")}
                      placeholder={bilingualLabel("Tìm khóa học theo tên hoặc nội dung…", "Search courses by title or topic…")}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 bg-white border border-[#E2E8F0] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/15 rounded-xl text-xs sm:text-sm text-[#1E293B] placeholder:text-[#94A3B8] transition-all outline-hidden shadow-2xs"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B] p-1 cursor-pointer transition-colors"
                        aria-label={bilingualLabel("Xóa tìm kiếm", "Clear search")}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="text-xs font-medium text-[#64748B] flex items-center gap-1.5 self-start sm:self-center shrink-0">
                    <Compass size={14} className="text-[#F97316]" />
                    <span>
                      <BilingualText>{"Khám phá kho khóa học chuẩn CEFR"}</BilingualText>
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#E8E5DF]/60">
                  {/* Status Filter Tabs / Segmented Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider min-w-[72px] shrink-0">
                      <BilingualText vi="Trạng thái" en="Status" />
                    </span>
                    <div
                      className="flex flex-wrap items-center gap-1.5"
                      role="tablist"
                      aria-label={bilingualLabel("Trạng thái học tập", "Learning status")}
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                              isActive
                                ? 'bg-[#FFF1E6] text-[#EA580C] border border-[#FDBA74] shadow-2xs font-bold'
                                : 'bg-white text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] border border-[#E2E8F0]'
                            }`}
                          >
                            <BilingualText vi={opt.label} en={opt.labelEn} />
                            <span
                              className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                                isActive
                                  ? 'bg-[#EA580C]/15 text-[#EA580C]'
                                  : 'bg-[#E2E8F0] text-[#64748B]'
                              }`}
                            >
                              {opt.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Level Filter Chips */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider min-w-[72px] shrink-0">
                      <BilingualText vi="Trình độ" en="Level" />
                    </span>
                    <div
                      className="flex flex-wrap items-center gap-1.5"
                      role="tablist"
                      aria-label={bilingualLabel("Trình độ khóa học", "Course level")}
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                              isActive
                                ? 'bg-[#FFF1E6] text-[#EA580C] border border-[#FDBA74] font-bold shadow-2xs'
                                : 'bg-white text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] border border-[#E2E8F0]'
                            }`}
                          >
                            {opt.id !== 'all' && (
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isActive ? 'bg-[#EA580C]' : dotColor
                                }`}
                              />
                            )}
                            <BilingualText vi={opt.label} en={opt.labelEn} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* Resume Course Strip if Enrolled (only on all filter without active search) */}
              {enrolled.length > 0 && statusFilter === 'all' && !search && (() => {
                const resumeItem = enrolled[0];
                const resumeCourse = resumeItem.course;
                const resumeEnrollment = resumeItem.enrollment;
                const progressPercent = resumeEnrollment?.progressPercentage != null
                  ? resumeEnrollment.progressPercentage
                  : (resumeEnrollment?.totalLessons && resumeEnrollment?.completedLessons != null
                      ? Math.round((resumeEnrollment.completedLessons / resumeEnrollment.totalLessons) * 100)
                      : null);

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-gradient-to-r from-[#FFFDF9] via-[#FFF9F0] to-[#FFF3E6] border border-[#FED7AA]/70 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C]">
                        <Play size={12} className="fill-[#EA580C]" />
                        <BilingualText vi="Tiếp nối hành trình học tập" en="Continue your learning journey" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#1E293B] m-0">
                        <BilingualText vi={resumeCourse.titleVi || resumeCourse.title} en={resumeCourse.title} />
                      </h3>
                      <p className="text-xs sm:text-sm text-[#64748B] m-0 line-clamp-1">
                        <BilingualText
                          vi="Bạn đang theo học khóa học này. Hãy tiếp tục để duy trì phản xạ và tiến độ nhé!"
                          en="You are currently learning this course. Keep going to maintain your streak and fluency!"
                        />
                      </p>

                      {progressPercent != null && (
                        <div className="flex items-center gap-3 pt-1">
                          <div className="w-36 sm:w-48 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] transition-all duration-300"
                              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[#EA580C]">{progressPercent}%</span>
                          {resumeEnrollment?.totalLessons && resumeEnrollment?.completedLessons != null && (
                            <span className="text-xs text-[#94A3B8]">
                              ({resumeEnrollment.completedLessons}/{resumeEnrollment.totalLessons} <BilingualText vi="bài" en="lessons" />)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/courses/${resumeCourse.id}/learn`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-xs hover:shadow transition-all self-start sm:self-center shrink-0 no-underline cursor-pointer"
                    >
                      <BilingualText vi="Tiếp tục học ngay" en="Continue learning now" />
                      <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                );
              })()}

              {/* Section Heading with Counter */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1E293B] tracking-tight m-0">
                    <BilingualText vi="Một thế giới để khám phá" en="A World to Explore" />
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5 m-0">
                    <BilingualText vi="Danh sách các khóa học được biên soạn chuẩn khung năng lực" en="Standard curriculum courses designed for fluency" />
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-semibold text-[#64748B] shadow-2xs">
                  {filtered.length} <BilingualText vi="khóa học" en="courses" />
                </span>
              </div>

              {/* Grid of Course Cards */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
                  {filtered.map(({ course, enrollment }) => (
                    <CourseCard key={course.id} course={course} enrollment={enrollment} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <EmptyState
                    title={items.length ? bilingualLabel('Không tìm thấy khóa học phù hợp', 'No matching courses found') : bilingualLabel('Các khóa học sẽ sớm có mặt', 'Courses coming soon')}
                    description={
                      items.length
                        ? bilingualLabel('Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc trình độ / trạng thái.', 'Try changing your search keywords or adjusting level / status filters.')
                        : bilingualLabel('Hãy quay lại sau để đón đọc những bài học mới nhất.', 'Please check back later for the latest lessons.')
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
                        className="px-4 py-2 rounded-xl bg-[#F97316] text-white font-semibold text-xs shadow-2xs hover:bg-[#EA580C] transition-all cursor-pointer"
                      >
                        <BilingualText vi="Đặt lại tất cả bộ lọc" en="Reset all filters" />
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
