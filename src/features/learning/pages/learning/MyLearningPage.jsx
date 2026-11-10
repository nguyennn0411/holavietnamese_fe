import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import { useCallback, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Languages, Award, ArrowRight, Plus, CheckCircle2, Calendar, Flame, Clock, Play } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { learnerService } from '@/features/learning/api/learnerService';
import { courseService } from '@/features/learning/api/courseService';
import { useAsyncResource } from '@/shared/hooks/useAsyncResource';
import { ResourceState } from '@/shared/components/common/ResourceState';
import { EmptyState, SpeakButton } from '@/shared/components/common/Ui';
import { ProgressBar } from '@/shared/components/common/ProgressBar';
import { ContentImage } from '@/shared/components/common/ContentImage';
import { getCourseCover } from '@/features/learning/components/course/CourseInfo';

const LEARNING_TABS = new Set(['courses', 'vocabulary', 'quiz']);

function formatQuizDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(dateStr);
  }
}

function getQuizBilingualTitle(quiz) {
  const raw = quiz.quizName || quiz.quiz_name || 'Bài kiểm tra';
  if (/pronunciation/i.test(raw)) {
    return { vi: 'Kiểm tra: Phát âm cơ bản', en: 'Quiz: Basic Pronunciation' };
  }
  if (/personal names|learning goals/i.test(raw)) {
    return { vi: 'Kiểm tra: Mục tiêu học tập & Tên người', en: 'Learning Goals & Personal Names - check' };
  }
  if (/country|countries|language/i.test(raw)) {
    return { vi: 'Kiểm tra: Quốc gia & Ngôn ngữ', en: 'Quiz: Countries and Languages' };
  }
  if (/number|count/i.test(raw)) {
    return { vi: 'Kiểm tra: Số đếm', en: 'Quiz: Numbers and Counting' };
  }
  if (/time/i.test(raw)) {
    return { vi: 'Kiểm tra: Xem giờ', en: 'Quiz: Telling the Time' };
  }
  if (/date|day/i.test(raw)) {
    return { vi: 'Kiểm tra: Thứ, ngày và tháng', en: 'Quiz: Days and Dates' };
  }
  if (/family/i.test(raw)) {
    return { vi: 'Kiểm tra: Gia đình', en: 'Quiz: Family' };
  }
  if (/weather/i.test(raw)) {
    return { vi: 'Kiểm tra: Thời tiết', en: 'Quiz: Weather' };
  }
  return { vi: raw, en: raw };
}

export function MyLearningPage({ initialTab = 'courses' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const tab = LEARNING_TABS.has(requestedTab)
    ? requestedTab
    : (LEARNING_TABS.has(initialTab) ? initialTab : 'courses');
  const [courseFilter, setCourseFilter] = useState('all'); // 'all' | 'in_progress' | 'completed'

  const selectTab = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === 'courses') next.delete('tab');
    else next.set('tab', id);
    setSearchParams(next);
  };

  const resource = useAsyncResource(
    useCallback(async () => {
      const [overview, coursesResult, catalogResult] = await Promise.all([
        learnerService.getMyLearningOverview().catch(() => ({})),
        courseService.myCourses().catch(() => []),
        courseService.list().catch(() => []),
      ]);

      const myCoursesList = Array.isArray(coursesResult) ? coursesResult : (coursesResult?.content || []);
      const overviewCourses = overview?.enrolledCourses || [];
      const catalogList = Array.isArray(catalogResult) ? catalogResult : (catalogResult?.content || []);

      // Bảng tra cứu thông tin khóa học chuẩn từ catalog
      const catalogMap = new Map();
      catalogList.forEach((c) => {
        if (c && c.id) {
          catalogMap.set(String(c.id), c);
        }
      });

      const courseMap = new Map();

      // 1. Dữ liệu chi tiết từ /api/me/courses kết hợp thông tin catalog
      myCoursesList.forEach((c) => {
        const id = c.courseId || c.id;
        const key = String(id);
        const cat = catalogMap.get(key);
        const progressPercentage = Number(c.progressPercentage) || 0;
        const completedLessons = Number(c.completedLessons) || 0;
        const totalLessons = Number(c.totalLessons || cat?.lessonCount || cat?.lesson_count || 0);
        const isCompleted = progressPercentage >= 100 || c.status === 'COMPLETED';
        const hasStarted = progressPercentage > 0 || Boolean(c.lastAccessedLessonId);
        const rawCover = cat?.thumbnailUrl || c.thumbnailUrl || c.image;

        courseMap.set(key, {
          id,
          courseId: id,
          enrollmentId: c.enrollmentId,
          title: cat?.title || c.title,
          titleVi: cat?.titleVi || cat?.title_vi || c.titleVi || c.title,
          description: cat?.description || c.description,
          descriptionVi: cat?.descriptionVi || cat?.description_vi || c.descriptionVi,
          image: rawCover,
          thumbnailUrl: rawCover,
          level: cat?.level || c.level || 'A1',
          totalLessons,
          completedLessons,
          progressPercentage,
          status: isCompleted ? 'COMPLETED' : (hasStarted ? 'IN_PROGRESS' : 'NOT_STARTED'),
          lastAccessedLessonId: c.lastAccessedLessonId,
          hasStarted,
          nextLesson: isCompleted ? 'Đã hoàn thành' : (c.lastAccessedLessonId ? 'Tiếp tục bài học' : 'Bắt đầu bài học'),
        });
      });

      // 2. Bổ sung từ overview nếu chưa có trong danh sách
      overviewCourses.forEach((c) => {
        const id = c.id || c.courseId;
        const key = String(id);
        const cat = catalogMap.get(key);
        const progress = Number(c.progress || c.progressPercentage) || 0;
        const isCompleted = progress >= 100 || c.status === 'COMPLETED';
        const hasStarted = progress > 0 || Boolean(c.lastAccessedLessonId);
        const rawCover = cat?.thumbnailUrl || c.image || c.thumbnailUrl;

        if (!courseMap.has(key)) {
          courseMap.set(key, {
            id,
            courseId: id,
            title: cat?.title || c.title,
            titleVi: cat?.titleVi || cat?.title_vi || c.titleVi || c.title,
            description: cat?.description || c.description,
            descriptionVi: cat?.descriptionVi || cat?.description_vi || c.descriptionVi,
            image: rawCover,
            thumbnailUrl: rawCover,
            level: cat?.level || c.level || 'A1',
            totalLessons: Number(c.totalLessons || cat?.lessonCount || 0),
            completedLessons: Number(c.completedLessons) || 0,
            progressPercentage: progress,
            status: isCompleted ? 'COMPLETED' : (hasStarted ? 'IN_PROGRESS' : 'NOT_STARTED'),
            lastAccessedLessonId: c.lastAccessedLessonId,
            hasStarted,
            nextLesson: isCompleted ? 'Đã hoàn thành' : (c.lastAccessedLessonId ? 'Tiếp tục bài học' : 'Bắt đầu bài học'),
          });
        } else {
          const item = courseMap.get(key);
          if (!item.titleVi && cat?.titleVi) item.titleVi = cat.titleVi;
          if (!item.image && rawCover) item.image = rawCover;
        }
      });

      // 3. Sắp xếp danh sách khóa học theo ưu tiên thực tế:
      // - Các khóa đang học (có bài vừa truy cập hoặc tiến độ > 0) đưa lên đầu
      // - Khóa có lastAccessedLessonId ưu tiên cao nhất
      // - Các khóa chưa học và đã hoàn thành xếp tiếp theo
      const mergedCourses = Array.from(courseMap.values()).sort((a, b) => {
        const aCompleted = a.status === 'COMPLETED';
        const bCompleted = b.status === 'COMPLETED';
        if (aCompleted && !bCompleted) return 1;
        if (!aCompleted && bCompleted) return -1;

        if (a.hasStarted && !b.hasStarted) return -1;
        if (!a.hasStarted && b.hasStarted) return 1;

        if (a.hasStarted && b.hasStarted) {
          if (a.lastAccessedLessonId && !b.lastAccessedLessonId) return -1;
          if (!a.lastAccessedLessonId && b.lastAccessedLessonId) return 1;
          if (b.progressPercentage !== a.progressPercentage) {
            return b.progressPercentage - a.progressPercentage;
          }
        }

        return Number(a.id) - Number(b.id);
      });

      const completedCount = mergedCourses.filter((c) => c.status === 'COMPLETED' || c.progressPercentage >= 100).length;
      const inProgressCount = mergedCourses.filter((c) => c.status !== 'COMPLETED' && c.progressPercentage < 100 && c.hasStarted).length;
      const realCompletedLessons = mergedCourses.reduce((sum, c) => sum + (c.completedLessons || 0), 0);

      return {
        ...overview,
        enrolledCourses: mergedCourses,
        totalEnrolled: mergedCourses.length,
        completedCoursesCount: completedCount,
        inProgressCoursesCount: inProgressCount,
        completedLessonsCount: Math.max(overview?.completedLessons || 0, realCompletedLessons),
      };
    }, [])
  );

  const tabItems = [
    { id: 'courses', labelVi: 'Khóa học của tôi', labelEn: 'My Courses', icon: BookOpen },
    { id: 'vocabulary', labelVi: 'Từ vựng đã lưu', labelEn: 'Saved Words', icon: Languages },
    { id: 'quiz', labelVi: 'Lịch sử quiz', labelEn: 'Quiz History', icon: Award },
  ];

  return (
    <div className="mylearning-page w-full max-w-[1560px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-8">
      {/* Hero Header With Authentic Vietnam Study Photo */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF7E8] via-[#F7F0E3] to-[#EEE3D1] border border-[#E8E5DF] p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-white border border-[#E7B59D] text-[#EA580C] text-xs font-bold uppercase tracking-wider shadow-xs">
            <BilingualText vi="Hành trình của riêng bạn" en="Personal Learning Space" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#253044] tracking-tight">
            <BilingualText>{"Góc học tập của tôi"}</BilingualText>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-2xl">
            <BilingualText>
              {"Từng bài học, từng từ mới. Một chút tiến bộ mỗi ngày tích lũy thành phản xạ tiếng Việt tự nhiên."}
            </BilingualText>
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl !bg-white hover:!bg-[#FFF7E8] !text-[#EA580C] hover:!text-[#C2410C] border-2 border-[#EA580C] font-bold text-xs shadow-xs transition-all active:!bg-white"
            >
              <BilingualText>{"Khám phá thêm khóa học →"}</BilingualText>
            </Link>

            <Link
              to="/edtech/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl !bg-white hover:!bg-[#FFF7E8] text-[#253044] hover:text-[#EA580C] border border-[#E8E5DF] hover:border-[#EA580C] font-semibold text-xs shadow-xs transition-all active:!bg-white"
            >
              <BilingualText>{"Đến Lộ trình học tương tác (EdTech) →"}</BilingualText>
            </Link>
          </div>
        </div>

        {/* Real photo showcase */}
        <div className="hidden lg:block relative shrink-0 w-80 h-48 xl:w-96 xl:h-52 rounded-2xl overflow-hidden border-2 border-white/90 shadow-md">
          <img
            src="/design/hero/hero_real_cafe_study.jpg"
            alt="Thực hành giao tiếp tiếng Việt thực tế"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3.5">
            <span className="text-white text-xs font-bold drop-shadow-sm">
              <BilingualText vi="Thực hành tiếng Việt tự nhiên trong đời sống" en="Natural real-life Vietnamese practice" />
            </span>
          </div>
        </div>
      </section>

      {/* Modern Tabs Bar with pure white active & neutral inactive */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E8E5DF] scrollbar-none" role="tablist" aria-label={bilingualLabel("Góc học tập", "My Learning")}>
        {tabItems.map((item) => {
          const Icon = item.icon;
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => selectTab(item.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                isActive
                  ? '!bg-white !text-[#EA580C] !border-2 !border-[#EA580C] shadow-xs'
                  : '!bg-white/80 !text-[#64748B] hover:!text-[#EA580C] hover:!bg-white border border-[#E8E5DF]'
              } active:!bg-white active:!text-[#EA580C]`}
            >
              <Icon size={16} className={isActive ? 'text-[#EA580C]' : 'text-[#64748B]'} />
              <BilingualText vi={item.labelVi} en={item.labelEn} />
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <ResourceState resource={resource}>
        {(data) => {
          const allCourses = data.enrolledCourses || [];

          // Khóa học đang học tích cực nhất (ưu tiên bài học truy cập gần nhất)
          const activeCourse =
            allCourses.find((c) => c.status === 'IN_PROGRESS' && c.lastAccessedLessonId) ||
            allCourses.find((c) => c.status !== 'COMPLETED' && c.hasStarted) ||
            allCourses.find((c) => c.status !== 'COMPLETED') ||
            allCourses[0];

          // Lọc danh sách khóa học theo bộ lọc con
          const filteredCourses = allCourses.filter((c) => {
            const isCompleted = c.progressPercentage >= 100 || c.status === 'COMPLETED';
            if (courseFilter === 'in_progress') return !isCompleted;
            if (courseFilter === 'completed') return isCompleted;
            return true;
          });

          return (
            <div className="space-y-8">
              {/* Stat Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF]/80 shadow-xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF7E8] border border-[#E8E5DF] text-[#EA580C] flex items-center justify-center shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] block uppercase tracking-wider">
                      <BilingualText vi="Bài đã học" en="Completed lessons" />
                    </span>
                    <strong className="text-lg sm:text-xl font-black text-[#253044]">
                      {data.completedLessonsCount ?? data.completedLessons ?? 0}
                    </strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF]/80 shadow-xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                    <Languages size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] block uppercase tracking-wider">
                      <BilingualText vi="Từ đã lưu" en="Saved words" />
                    </span>
                    <strong className="text-lg sm:text-xl font-black text-[#253044]">
                      {data.savedVocabCount ?? 0}
                    </strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF]/80 shadow-xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
                    <Flame size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] block uppercase tracking-wider">
                      <BilingualText vi="Chuỗi học tập" en="Day streak" />
                    </span>
                    <strong className="text-lg sm:text-xl font-black text-[#253044]">
                      {data.currentStreak ?? data.streakCount ?? 1} <BilingualText vi="ngày" en="days" />
                    </strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF]/80 shadow-xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] block uppercase tracking-wider">
                      <BilingualText vi="Thời gian học" en="Learning time" />
                    </span>
                    <strong className="text-lg sm:text-xl font-black text-[#253044]">
                      {data.totalTimeMinutes ?? 45} <BilingualText vi="phút" en="min" />
                    </strong>
                  </div>
                </div>
              </div>

              {/* TAB 1: Enrolled Courses */}
              {tab === 'courses' && (
                <div className="space-y-6">
                  {/* Hero Continue Learning Card with Real Photo */}
                  {activeCourse && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl bg-gradient-to-r from-[#24382B] via-[#2F4A39] to-[#3B5B47] text-[#FFF7E8] p-6 sm:p-8 shadow-md border border-[#24382B] flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-2xl">
                        {/* Real course photo thumbnail */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/20 shadow-md shrink-0 bg-stone-900">
                          <img
                            src={getCourseCover(activeCourse)}
                            alt={activeCourse.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#24382B] font-extrabold text-[11px] uppercase tracking-wider shadow-xs">
                            <Play size={12} fill="currentColor" />
                            <BilingualText>{"Tiếp tục hành trình học tập"}</BilingualText>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-black text-white">
                            <BilingualText vi={activeCourse.titleVi || activeCourse.title} en={activeCourse.title} />
                          </h2>
                          <div className="flex items-center gap-3 text-xs text-[#D5DDCB]">
                            <span className="font-bold text-amber-300">{activeCourse.level}</span>
                            <span>•</span>
                            <span>
                              <BilingualText
                                vi={`Đã hoàn thành ${activeCourse.completedLessons}/${activeCourse.totalLessons || '—'} bài học (${activeCourse.progressPercentage}%)`}
                                en={`Completed ${activeCourse.completedLessons}/${activeCourse.totalLessons || '—'} lessons (${activeCourse.progressPercentage}%)`}
                              />
                            </span>
                          </div>
                          <div className="w-full max-w-md h-2 rounded-full bg-white/20 overflow-hidden mt-1">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-300"
                              style={{ width: `${activeCourse.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                        <Link
                          to={
                            activeCourse.lastAccessedLessonId
                              ? `/courses/${activeCourse.id}/lessons/${activeCourse.lastAccessedLessonId}`
                              : `/courses/${activeCourse.id}/learn`
                          }
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl !bg-white hover:!bg-[#FFF7E8] !text-[#EA580C] hover:!text-[#C2410C] border-2 border-[#EA580C] font-black text-xs shadow-md transition-all active:!bg-white active:!text-[#EA580C]"
                        >
                          <Play size={15} fill="currentColor" />
                          <BilingualText>{"Tiếp tục học ngay →"}</BilingualText>
                        </Link>
                        <Link
                          to={`/courses/${activeCourse.id}`}
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl !bg-white/10 hover:!bg-white hover:!text-[#24382B] text-white font-bold text-xs border border-white/30 transition-all active:!bg-white active:!text-[#24382B]"
                        >
                          <BilingualText>{"Chi tiết khóa"}</BilingualText>
                        </Link>
                      </div>
                    </motion.div>
                  )}

                  {/* Course Filter Controls (All, In Progress, Completed) */}
                  <div className="flex items-center justify-between border-b border-[#E8E5DF]/60 pb-3 flex-wrap gap-3">
                    <div className="flex items-center gap-2" role="tablist" aria-label={bilingualLabel("Bộ lọc khóa học", "Course filters")}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={courseFilter === 'all'}
                        onClick={() => setCourseFilter('all')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          courseFilter === 'all'
                            ? '!bg-white !text-[#EA580C] !border-2 !border-[#EA580C] shadow-xs'
                            : '!bg-white/90 !text-[#64748B] hover:!text-[#EA580C] hover:!bg-white border border-[#E8E5DF]'
                        } active:!bg-white active:!text-[#EA580C]`}
                      >
                        <BilingualText>{"Tất cả"}</BilingualText> ({allCourses.length})
                      </button>

                      <button
                        type="button"
                        role="tab"
                        aria-selected={courseFilter === 'in_progress'}
                        onClick={() => setCourseFilter('in_progress')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          courseFilter === 'in_progress'
                            ? '!bg-white !text-[#EA580C] !border-2 !border-[#EA580C] shadow-xs'
                            : '!bg-white/90 !text-[#64748B] hover:!text-[#EA580C] hover:!bg-white border border-[#E8E5DF]'
                        } active:!bg-white active:!text-[#EA580C]`}
                      >
                        <BilingualText>{"Đang học"}</BilingualText> ({data.inProgressCoursesCount ?? 0})
                      </button>

                      <button
                        type="button"
                        role="tab"
                        aria-selected={courseFilter === 'completed'}
                        onClick={() => setCourseFilter('completed')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          courseFilter === 'completed'
                            ? '!bg-white !text-[#EA580C] !border-2 !border-[#EA580C] shadow-xs'
                            : '!bg-white/90 !text-[#64748B] hover:!text-[#EA580C] hover:!bg-white border border-[#E8E5DF]'
                        } active:!bg-white active:!text-[#EA580C]`}
                      >
                        <BilingualText>{"Đã hoàn thành"}</BilingualText> ({data.completedCoursesCount ?? 0})
                      </button>
                    </div>

                    <Link
                      to="/courses"
                      className="text-xs font-bold text-[#EA580C] hover:text-[#C2410C] inline-flex items-center gap-1 active:!bg-white"
                    >
                      <span>+ <BilingualText>{"Khám phá khóa học mới"}</BilingualText></span>
                    </Link>
                  </div>

                  {/* Course Cards Grid With Real Photographs */}
                  {filteredCourses.length > 0 ? (
                    <div className="course-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCourses.map((course) => {
                        const isCompleted = course.progressPercentage >= 100 || course.status === 'COMPLETED';
                        const continueUrl = course.lastAccessedLessonId
                          ? `/courses/${course.id}/lessons/${course.lastAccessedLessonId}`
                          : `/courses/${course.id}/learn`;
                        const realCover = getCourseCover(course);

                        return (
                          <motion.article
                            whileHover={{ y: -4 }}
                            key={course.id}
                            className="card learning-course group relative flex flex-col bg-[#FFF7E8] border border-[#E8E5DF] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                          >
                            <div className="relative overflow-hidden aspect-[16/10] bg-stone-900">
                              <ContentImage
                                className="learning-course-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src={realCover}
                                alt={course.title}
                                fallback={
                                  <img
                                    src={realCover}
                                    alt={`Ảnh thực tế khóa học: ${course.title}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                }
                              />
                              <div className="absolute top-3 left-3 z-10">
                                <span className="px-2.5 py-1 text-xs font-bold rounded-lg !bg-white text-[#24382B] border border-[#E8E5DF] shadow-xs tracking-wide">
                                  {course.level}
                                </span>
                              </div>
                              <div className="absolute top-3 right-3 z-10">
                                <span
                                  className={`badge px-2.5 py-1 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 ${
                                    isCompleted
                                      ? '!bg-white text-emerald-700 border border-emerald-400'
                                      : '!bg-white text-[#EA580C] border border-[#EA580C]'
                                  }`}
                                >
                                  {isCompleted ? <CheckCircle2 size={12} /> : null}
                                  <BilingualText>{isCompleted ? 'Đã hoàn thành' : 'Đang học'}</BilingualText>
                                </span>
                              </div>
                            </div>

                            <div className="learning-course-body p-5 flex flex-col flex-1 justify-between gap-4">
                              <div className="space-y-2">
                                <h2 className="text-lg font-bold text-[#253044] group-hover:text-[#EA580C] transition-colors leading-snug line-clamp-2">
                                  <Link to={`/courses/${course.id}`} className="hover:underline">
                                    <BilingualText vi={course.titleVi || course.title} en={course.title} />
                                  </Link>
                                </h2>

                                <div className="pt-1">
                                  <ProgressBar
                                    value={course.progressPercentage}
                                    label={
                                      course.totalLessons
                                        ? bilingualLabel(`${course.completedLessons}/${course.totalLessons} bài học`, `${course.completedLessons}/${course.totalLessons} lessons`)
                                        : bilingualLabel(`${course.progressPercentage}% hoàn thành`, `${course.progressPercentage}% completed`)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="pt-2 border-t border-[#E8E5DF]/40 flex items-center gap-2">
                                <Link
                                  className="button flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl !bg-white hover:!bg-[#FFF7E8] !text-[#EA580C] border-2 border-[#EA580C] font-bold text-xs shadow-xs transition-all active:!bg-white active:!text-[#EA580C]"
                                  to={continueUrl}
                                >
                                  <BilingualText vi={isCompleted ? 'Xem lại khóa học' : 'Tiếp tục học →'} en={isCompleted ? 'Review course' : 'Continue learning →'} />
                                  <ArrowRight size={14} />
                                </Link>

                                <Link
                                  className="px-3 py-2.5 rounded-xl border border-[#E8E5DF] !bg-white hover:!bg-[#FFF7E8] text-[#253044] hover:text-[#EA580C] hover:border-[#EA580C] text-xs font-bold transition-all active:!bg-white"
                                  to={`/courses/${course.id}`}
                                  title={bilingualLabel("Chi tiết khóa học", "Course details")}
                                >
                                  <BookOpen size={14} />
                                </Link>
                              </div>
                            </div>
                          </motion.article>
                        );
                      })}

                      {/* Add New Course Card */}
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="card learning-course-add group flex flex-col items-center justify-center text-center p-8 bg-[#FFF7E8]/70 border-2 border-dashed border-[#E8E5DF] hover:border-[#EA580C] rounded-2xl transition-all"
                      >
                        <span className="w-12 h-12 rounded-2xl !bg-white text-[#EA580C] border border-[#E8E5DF] flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform">
                          <Plus size={24} />
                        </span>
                        <h2 className="text-lg font-bold text-[#253044] mb-1">
                          <BilingualText>{"Khám phá khóa học mới?"}</BilingualText>
                        </h2>
                        <p className="text-xs text-[#64748B] max-w-xs mb-4">
                          <BilingualText>{"Mở rộng hành trình học tập tiếng Việt theo chủ đề bạn yêu thích."}</BilingualText>
                        </p>
                        <Link
                          className="button secondary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl !bg-white hover:!bg-[#FFF7E8] border border-[#E8E5DF] hover:border-[#EA580C] text-[#253044] hover:text-[#EA580C] font-bold text-xs transition-all active:!bg-white"
                          to="/courses"
                        >
                          <BilingualText>{"Khám phá khóa học"}</BilingualText>
                          <ArrowRight size={13} />
                        </Link>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <EmptyState
                        title={allCourses.length ? bilingualLabel("Không có khóa học nào ở trạng thái này", "No courses match this status") : bilingualLabel("Bạn chưa đăng ký khóa học nào", "You haven't enrolled in any courses yet")}
                        description={
                          allCourses.length
                            ? bilingualLabel("Hãy thử đổi bộ lọc sang tất cả khóa học để xem toàn bộ danh sách.", "Try changing the filter to all courses to view the full list.")
                            : bilingualLabel("Khám phá ngay kho khóa học phong phú để bắt đầu hành trình học tiếng Việt.", "Explore our rich catalog of courses to begin your Vietnamese learning journey.")
                        }
                      />
                      <div className="flex justify-center">
                        {allCourses.length ? (
                          <button
                            type="button"
                            onClick={() => setCourseFilter('all')}
                            className="px-4 py-2 rounded-xl !bg-white hover:!bg-[#FFF7E8] !text-[#EA580C] border-2 border-[#EA580C] font-bold text-xs shadow-xs transition-all cursor-pointer active:!bg-white"
                          >
                            <BilingualText>{"Xem tất cả khóa học"}</BilingualText>
                          </button>
                        ) : (
                          <Link
                            to="/courses"
                            className="px-5 py-2.5 rounded-xl !bg-white hover:!bg-[#FFF7E8] !text-[#EA580C] border-2 border-[#EA580C] font-bold text-xs shadow-md transition-all active:!bg-white"
                          >
                            <BilingualText>{"Khám phá khóa học ngay →"}</BilingualText>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Saved Vocabulary */}
              {tab === 'vocabulary' && (
                <section className="card bg-[#FFF7E8] border border-[#E8E5DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="builder-heading flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E5DF]/60 pb-5">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#253044]">
                        <BilingualText>{"Từ vựng đã lưu ("}</BilingualText>
                        {data.savedVocabCount ?? 0})
                      </h2>
                      <p className="text-xs text-[#64748B] mt-1">
                        <BilingualText>{"Những từ quen thuộc trên hành trình học của bạn."}</BilingualText>
                      </p>
                    </div>
                    <div className="actions flex items-center gap-3">
                      <Link
                        className="button secondary px-4 py-2 rounded-xl !bg-white hover:!bg-[#FFF7E8] border border-[#E8E5DF] hover:border-[#EA580C] text-[#253044] hover:text-[#EA580C] font-bold text-xs transition-all active:!bg-white"
                        to={ROUTES.VOCABULARY_NOTEBOOK}
                      >
                        <BilingualText>{"Mở sổ tay"}</BilingualText>
                      </Link>
                      <Link
                        className="button px-5 py-2 rounded-xl !bg-white hover:!bg-[#FFF7E8] !text-[#EA580C] hover:!text-[#C2410C] border-2 border-[#EA580C] font-bold text-xs shadow-xs transition-all active:!bg-white active:!text-[#EA580C]"
                        to={ROUTES.VOCABULARY_REVIEW}
                      >
                        <BilingualText>{"Ôn tập →"}</BilingualText>
                      </Link>
                    </div>
                  </div>

                  {data.recentVocab?.length ? (
                    <div className="mylearning-vocab-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {data.recentVocab.map((word, index) => (
                        <div
                          className="mylearning-word-chip bg-white border border-[#E8E5DF] rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-2"
                          key={index}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`badge px-2 py-0.5 rounded-md text-[10px] font-bold uppercase !bg-white ${
                                word.mastered
                                  ? '!text-emerald-700 border border-emerald-400'
                                  : '!text-amber-800 border border-amber-300'
                              }`}
                            >
                              <BilingualText>{word.mastered ? 'Đã thuộc' : 'Đang ôn tập'}</BilingualText>
                            </span>
                            <SpeakButton text={word.vi} />
                          </div>
                          <h3 className="text-base font-bold text-[#253044]">{word.vi}</h3>
                          <p className="text-xs text-[#64748B]">{word.en}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-36 h-28 rounded-2xl overflow-hidden border border-[#E8E5DF] shadow-xs mx-auto">
                        <img
                          src="/design/hero/hero_real_student_portrait.jpg"
                          alt="Sổ tay từ vựng thực tế"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <EmptyState
                        title={bilingualLabel("Sổ tay đang chờ những từ đầu tiên", "Notebook is waiting for your first words")}
                        description={bilingualLabel("Lưu từ mới trong bài học hoặc thêm vào sổ tay để ôn tập ngắt quãng.", "Save new words from lessons or your notebook to review with spaced repetition.")}
                      />
                    </div>
                  )}
                </section>
              )}

              {/* TAB 3: Quiz History */}
              {tab === 'quiz' && (
                <section className="card bg-[#FFF7E8] border border-[#E8E5DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="border-b border-[#E8E5DF]/60 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#253044]">
                      <BilingualText>{"Nhìn lại những điều đã học"}</BilingualText>
                    </h2>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      <BilingualText>{"Lịch sử làm bài kiểm tra và đánh giá năng lực tiếng Việt của bạn."}</BilingualText>
                    </p>
                  </div>

                  {data.quizHistory?.length ? (
                    <div className="space-y-3">
                      {data.quizHistory.map((quiz) => {
                        const titleObj = getQuizBilingualTitle(quiz);
                        return (
                          <div
                            className="list-row flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white border border-[#E8E5DF] gap-3 shadow-xs hover:border-[#EA580C] transition-colors"
                            key={quiz.id}
                          >
                            <div className="space-y-1">
                              <strong className="block text-sm font-bold text-[#253044]">
                                <BilingualText vi={titleObj.vi} en={titleObj.en} />
                              </strong>
                              <p className="text-[11px] text-[#64748B] flex items-center gap-1.5 font-medium">
                                <Calendar size={13} className="text-[#EA580C]" />
                                <span>{formatQuizDate(quiz.date)}</span>
                              </p>
                            </div>
                            <div className="actions flex items-center gap-3 self-end sm:self-auto">
                              <span
                                className={`badge px-2.5 py-1 rounded-lg text-xs font-bold !bg-white ${
                                  quiz.passed
                                    ? '!text-emerald-700 border border-emerald-400'
                                    : '!text-[#EA580C] border border-[#EA580C]'
                                }`}
                              >
                                {Math.round(quiz.score)}/100 · <BilingualText>{quiz.passed ? 'Đạt' : 'Cần ôn tập'}</BilingualText>
                              </span>
                              <Link
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl !bg-white hover:!bg-[#FFF7E8] !text-[#EA580C] border border-[#EA580C] text-xs font-bold shadow-xs transition-all active:!bg-white active:!text-[#EA580C]"
                                to={`/quiz-attempts/${quiz.id}/result`}
                              >
                                <BilingualText>{"Xem kết quả →"}</BilingualText>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      title={bilingualLabel("Chưa có bài kiểm tra đã hoàn thành", "No completed quizzes yet")}
                      description={bilingualLabel("Các kết quả quiz sau mỗi chương học sẽ xuất hiện tại đây.", "Quiz results from completed units will appear here.")}
                    />
                  )}
                </section>
              )}
            </div>
          );
        }}
      </ResourceState>
    </div>
  );
}
