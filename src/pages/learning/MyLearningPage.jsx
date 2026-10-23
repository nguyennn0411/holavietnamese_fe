import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useCallback, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Languages, MapPin, Award, ArrowRight, Plus, CheckCircle2, Calendar, Flame, Clock, Play } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { learnerService } from '@/services/learnerService';
import { courseService } from '@/services/courseService';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { ResourceState } from '@/components/common/ResourceState';
import { EmptyState, Artwork, SpeakButton } from '@/components/common/Ui';
import { ProgressBar } from '@/components/common/ProgressBar';
import { ContentImage } from '@/components/common/ContentImage';

const LEARNING_TABS = new Set(['courses', 'vocabulary', 'journey', 'quiz']);

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
      const [overview, coursesResult] = await Promise.all([
        learnerService.getMyLearningOverview().catch(() => ({})),
        courseService.myCourses().catch(() => []),
      ]);

      const myCoursesList = Array.isArray(coursesResult) ? coursesResult : (coursesResult?.content || []);
      const overviewCourses = overview?.enrolledCourses || [];

      // Hợp nhất dữ liệu các khóa học đã đăng ký
      const courseMap = new Map();

      // 1. Dữ liệu chi tiết từ /api/me/courses
      myCoursesList.forEach((c) => {
        const id = c.courseId || c.id;
        courseMap.set(String(id), {
          id,
          courseId: id,
          title: c.title,
          titleVi: c.titleVi || c.title,
          image: c.thumbnailUrl || c.image,
          thumbnailUrl: c.thumbnailUrl || c.image,
          level: c.level || 'A1',
          totalLessons: Number(c.totalLessons) || 0,
          completedLessons: Number(c.completedLessons) || 0,
          progressPercentage: Number(c.progressPercentage) || 0,
          status: c.status,
          lastAccessedLessonId: c.lastAccessedLessonId,
          nextLesson: c.progressPercentage === 100 ? 'Đã hoàn thành' : 'Tiếp tục bài học',
        });
      });

      // 2. Bổ sung từ overview nếu chưa có
      overviewCourses.forEach((c) => {
        const id = c.id || c.courseId;
        const key = String(id);
        if (!courseMap.has(key)) {
          courseMap.set(key, {
            id,
            courseId: id,
            title: c.title,
            titleVi: c.titleVi || c.title,
            image: c.image || c.thumbnailUrl,
            thumbnailUrl: c.image || c.thumbnailUrl,
            level: c.level || 'A1',
            totalLessons: Number(c.totalLessons) || 0,
            completedLessons: Number(c.completedLessons) || 0,
            progressPercentage: Number(c.progress) || 0,
            status: c.progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
            lastAccessedLessonId: c.lastAccessedLessonId,
            nextLesson: c.nextLesson,
          });
        }
      });

      const mergedCourses = Array.from(courseMap.values());

      return {
        ...overview,
        enrolledCourses: mergedCourses,
        totalEnrolled: mergedCourses.length,
        completedCoursesCount: mergedCourses.filter((c) => c.progressPercentage >= 100 || c.status === 'COMPLETED').length,
        inProgressCoursesCount: mergedCourses.filter((c) => c.progressPercentage < 100 && c.status !== 'COMPLETED').length,
      };
    }, [])
  );

  const tabItems = [
    { id: 'courses', labelVi: 'Khóa học của tôi', labelEn: 'My Courses', icon: BookOpen },
    { id: 'vocabulary', labelVi: 'Từ vựng đã lưu', labelEn: 'Saved Words', icon: Languages },
    { id: 'journey', labelVi: 'Khám phá Việt Nam', labelEn: 'Explore Vietnam', icon: MapPin },
    { id: 'quiz', labelVi: 'Lịch sử quiz', labelEn: 'Quiz History', icon: Award },
  ];

  return (
    <div className="mylearning-page w-full max-w-[1560px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF7E8] via-[#F7F0E3] to-[#EEE3D1] border border-[#E8E5DF] p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#FFF0DC] border border-[#E7B59D] text-[#EA580C] text-xs font-bold uppercase tracking-wider shadow-xs">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs shadow-xs transition-all"
            >
              <BilingualText>{"Khám phá thêm khóa học →"}</BilingualText>
            </Link>

            <Link
              to="/edtech/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-[#253044] border border-[#E8E5DF] font-semibold text-xs shadow-xs transition-all hover:border-[#EA580C]"
            >
              <BilingualText>{"Đến Lộ trình học tương tác (EdTech) →"}</BilingualText>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Tabs Bar */}
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
              className={`flex-shrink-0 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'border-[#EA580C] text-[#EA580C] bg-[#FFF7E8]'
                  : 'border-transparent text-[#64748B] hover:text-[#253044] hover:bg-[#FFF7E8]/50'
              }`}
            >
              <BilingualText vi={item.labelVi} en={item.labelEn} />
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <ResourceState resource={resource}>
        {(data) => {
          const allCourses = data.enrolledCourses || [];
          const activeCourse = allCourses.find((c) => c.progressPercentage < 100 && c.status !== 'COMPLETED') || allCourses[0];

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
                      {data.completedLessons ?? data.completedLessonsCount ?? 0}
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
                  {/* Hero Continue Learning Card if active course exists */}
                  {activeCourse && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl bg-gradient-to-r from-[#24382B] via-[#2F4A39] to-[#3B5B47] text-[#FFF7E8] p-6 sm:p-8 shadow-md border border-[#24382B] flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2 max-w-xl">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF0E5] text-[#24382B] font-extrabold text-[11px] uppercase tracking-wider">
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

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                        <Link
                          to={
                            activeCourse.lastAccessedLessonId
                              ? `/learn/${activeCourse.id}/lesson/${activeCourse.lastAccessedLessonId}`
                              : `/learn/${activeCourse.id}`
                          }
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#E1B65B] hover:bg-[#d4a849] text-[#253044] font-black text-xs shadow-md transition-all"
                        >
                          <Play size={15} fill="currentColor" />
                          <BilingualText>{"Tiếp tục học ngay →"}</BilingualText>
                        </Link>
                        <Link
                          to={`/courses/${activeCourse.id}`}
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
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
                            ? 'bg-[#EA580C] text-white shadow-xs'
                            : 'bg-white text-[#64748B] hover:text-[#253044] border border-[#E8E5DF]'
                        }`}
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
                            ? 'bg-[#EA580C] text-white shadow-xs'
                            : 'bg-white text-[#64748B] hover:text-[#253044] border border-[#E8E5DF]'
                        }`}
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
                            ? 'bg-[#EA580C] text-white shadow-xs'
                            : 'bg-white text-[#64748B] hover:text-[#253044] border border-[#E8E5DF]'
                        }`}
                      >
                        <BilingualText>{"Đã hoàn thành"}</BilingualText> ({data.completedCoursesCount ?? 0})
                      </button>
                    </div>

                    <Link
                      to="/courses"
                      className="text-xs font-bold text-[#EA580C] hover:text-[#C2410C] inline-flex items-center gap-1"
                    >
                      <span>+ <BilingualText>{"Khám phá khóa học mới"}</BilingualText></span>
                    </Link>
                  </div>

                  {/* Course Cards Grid */}
                  {filteredCourses.length > 0 ? (
                    <div className="course-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCourses.map((course) => {
                        const isCompleted = course.progressPercentage >= 100 || course.status === 'COMPLETED';
                        const continueUrl = course.lastAccessedLessonId
                          ? `/learn/${course.id}/lesson/${course.lastAccessedLessonId}`
                          : `/learn/${course.id}`;

                        return (
                          <motion.article
                            whileHover={{ y: -4 }}
                            key={course.id}
                            className="card learning-course group relative flex flex-col bg-[#FFF7E8] border border-[#E8E5DF] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                          >
                            <div className="relative overflow-hidden aspect-[16/10] bg-[#EEE3D1]">
                              <ContentImage
                                className="learning-course-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src={course.image || course.thumbnailUrl}
                                alt={course.title}
                                fallback={
                                  <Artwork
                                    kind={course.id % 2 ? 'food' : 'village'}
                                    alt={`Minh họa khóa học: ${course.title}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                }
                              />
                              <div className="absolute top-3 left-3 z-10">
                                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#24382B] text-[#FFF7E8] shadow-sm tracking-wide">
                                  {course.level}
                                </span>
                              </div>
                              <div className="absolute top-3 right-3 z-10">
                                <span
                                  className={`badge px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 ${
                                    isCompleted
                                      ? 'bg-emerald-800 text-emerald-100 border border-emerald-700'
                                      : 'bg-[#EA580C] text-white border border-[#C2410C]'
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
                                  className="button flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs shadow-sm transition-all"
                                  to={continueUrl}
                                >
                                  <BilingualText vi={isCompleted ? 'Xem lại khóa học' : 'Tiếp tục học →'} en={isCompleted ? 'Review course' : 'Continue learning →'} />
                                  <ArrowRight size={14} />
                                </Link>

                                <Link
                                  className="px-3 py-2.5 rounded-xl border border-[#E8E5DF] bg-white hover:bg-[#F7F0E3] text-[#253044] text-xs font-bold transition-all"
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
                        <span className="w-12 h-12 rounded-2xl bg-[#FFF0DC] text-[#EA580C] flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform">
                          <Plus size={24} />
                        </span>
                        <h2 className="text-lg font-bold text-[#253044] mb-1">
                          <BilingualText>{"Khám phá khóa học mới?"}</BilingualText>
                        </h2>
                        <p className="text-xs text-[#64748B] max-w-xs mb-4">
                          <BilingualText>{"Mở rộng hành trình học tập tiếng Việt theo chủ đề bạn yêu thích."}</BilingualText>
                        </p>
                        <Link
                          className="button secondary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E8E5DF] text-[#253044] font-bold text-xs hover:border-[#EA580C] transition-all"
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
                            className="px-4 py-2 rounded-xl bg-[#EA580C] text-white font-bold text-xs shadow-xs hover:bg-[#C2410C] cursor-pointer"
                          >
                            <BilingualText>{"Xem tất cả khóa học"}</BilingualText>
                          </button>
                        ) : (
                          <Link
                            to="/courses"
                            className="px-5 py-2.5 rounded-xl bg-[#EA580C] text-white font-bold text-xs shadow-md hover:bg-[#C2410C]"
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
                        className="button secondary px-4 py-2 rounded-xl bg-white border border-[#E8E5DF] text-[#253044] font-bold text-xs hover:border-[#EA580C] transition-all"
                        to={ROUTES.VOCABULARY_NOTEBOOK}
                      >
                        <BilingualText>{"Mở sổ tay"}</BilingualText>
                      </Link>
                      <Link
                        className="button px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs shadow-sm transition-all"
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
                          className="mylearning-word-chip bg-white/90 border border-[#E8E5DF] rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-2"
                          key={index}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`badge px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                word.mastered
                                  ? 'bg-[#EDF0E5] text-[#24382B]'
                                  : 'bg-[#F8E6B7] text-[#253044]'
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
                    <EmptyState
                      title={bilingualLabel("Sổ tay đang chờ những từ đầu tiên", "Notebook is waiting for your first words")}
                      description={bilingualLabel("Lưu từ mới trong bài học hoặc thêm vào sổ tay để ôn tập ngắt quãng.", "Save new words from lessons or your notebook to review with spaced repetition.")}
                    />
                  )}
                </section>
              )}

              {/* TAB 3: Free destination discovery */}
              {tab === 'journey' && (
                <div className="explore-learning card bg-[#FFF7E8] border border-[#E8E5DF] rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center gap-8">
                  <div className="w-48 h-48 shrink-0 rounded-2xl overflow-hidden border border-[#E8E5DF] shadow-sm bg-white p-2">
                    <Artwork kind="lanterns" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <span className="eyebrow text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                        <BilingualText vi="Khám phá điểm đến" en="Discover destinations" />
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#253044] mt-1">
                        <BilingualText vi="Khám phá Việt Nam" en="Explore Vietnam" />
                      </h2>
                    </div>

                    <p className="text-sm text-[#64748B]">
                      <BilingualText
                        vi="Chọn điểm đến bạn quan tâm để tìm hiểu văn hóa, cách nói vùng miền và thực hành giao tiếp theo kịch bản. Bạn có thể khám phá tự do bất cứ lúc nào."
                        en="Choose a destination to discover its culture, regional language and conversation scenarios. Explore freely at any time."
                      />
                    </p>

                    <div className="actions flex flex-wrap items-center gap-3 pt-2">
                      <Link
                        className="button inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs shadow-sm transition-all"
                        to={ROUTES.EXPLORE}
                      >
                        <BilingualText>{"Xem các điểm đến →"}</BilingualText>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Quiz History */}
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
                      {data.quizHistory.map((quiz) => (
                        <div
                          className="list-row flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/80 border border-[#E8E5DF] gap-3"
                          key={quiz.id}
                        >
                          <div className="space-y-1">
                            <strong className="block text-sm font-bold text-[#253044]">{quiz.quizName}</strong>
                            <p className="text-[11px] text-[#64748B] flex items-center gap-1">
                              <Calendar size={12} />
                              {quiz.date}
                            </p>
                          </div>
                          <div className="actions flex items-center gap-3 self-end sm:self-auto">
                            <span
                              className={`badge px-2.5 py-1 rounded-lg text-xs font-bold ${
                                quiz.passed ? 'bg-[#EDF0E5] text-[#24382B]' : 'bg-[#FFF0DC] text-[#EA580C]'
                              }`}
                            >
                              {quiz.score}/100 · <BilingualText>{quiz.passed ? 'Đạt' : 'Cần ôn tập'}</BilingualText>
                            </span>
                            <Link
                              className="text-link text-xs font-bold text-[#EA580C] hover:underline"
                              to={`/quiz-attempts/${quiz.id}/result`}
                            >
                              <BilingualText>{"Xem kết quả →"}</BilingualText>
                            </Link>
                          </div>
                        </div>
                      ))}
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
