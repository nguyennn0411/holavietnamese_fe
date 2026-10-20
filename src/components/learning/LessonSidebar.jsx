import { useState, useRef, useEffect, useMemo } from 'react';
import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom';
import { LessonStatus } from './LessonStatus';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  X,
  Play,
  Search,
  Check
} from 'lucide-react';

export function LessonSidebar({
  lessons = [],
  courseId,
  currentId,
  isOpen = true,
  onClose,
  courseTitle = '',
  isDrawer = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const activeItemRef = useRef(null);
  const listContainerRef = useRef(null);

  // Thống kê tiến độ
  const completedCount = useMemo(
    () => lessons.filter((l) => l.isCompleted || l.learningStatus === 'COMPLETED').length,
    [lessons]
  );
  const totalCount = lessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Lọc bài học theo từ khóa tìm kiếm
  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) return lessons;
    const query = searchQuery.toLowerCase().trim();
    return lessons.filter((l, idx) => {
      const order = String(l.lessonOrder || idx + 1);
      const titleVi = (l.titleVi || l.title || '').toLowerCase();
      const titleEn = (l.title || '').toLowerCase();
      return order.includes(query) || titleVi.includes(query) || titleEn.includes(query);
    });
  }, [lessons, searchQuery]);

  // Tự động cuộn bài học hiện tại vào tầm nhìn
  useEffect(() => {
    if (activeItemRef.current && listContainerRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentId]);

  return (
    <nav
      className={`lesson-roadmap-card w-full bg-white flex flex-col shadow-sm select-none transition-all ${
        isDrawer
          ? 'h-full border-0 rounded-none'
          : 'h-[calc(100vh-140px)] max-h-[840px] min-h-[500px] rounded-3xl border border-[#DECBB4] overflow-hidden'
      }`}
      aria-label="Lộ trình bài học trong khóa"
    >
      {/* ==================== ROADMAP HEADER ==================== */}
      <div className="shrink-0 bg-[#FFFDF9] border-b border-[#DECBB4]/60 p-4 sm:p-5 space-y-3">
        {/* Top bar: Title + Count Badge + Close button (Mobile) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#FFF2D6] border border-[#DECBB4]/80 flex items-center justify-center text-[#DA251D] shrink-0 shadow-2xs">
              <BookOpen size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-[#431914] tracking-tight m-0 truncate">
                  <BilingualText vi="Lộ trình bài học" en="Course Roadmap" />
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[11px] font-bold shrink-0">
                  {totalCount} bài
                </span>
              </div>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng danh sách bài"
              className="p-1.5 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Course title */}
        {courseTitle && (
          <p className="text-xs font-semibold text-[#78685B] line-clamp-1 m-0" title={courseTitle}>
            {courseTitle}
          </p>
        )}

        {/* Progress Tracker Card */}
        <div className="bg-[#FFF9EE]/70 rounded-2xl border border-[#DECBB4]/50 p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#431914]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              <span>{completedCount}/{totalCount} bài hoàn thành</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#FFF2D6] text-[#A62A24] font-black text-xs">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-stone-200/70 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#DA251D] to-[#E65046] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Search input (especially helpful for 20-30+ lessons) */}
        {totalCount > 5 && (
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài học..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-[#DECBB4]/80 rounded-xl focus:outline-none focus:border-[#DA251D] focus:ring-1 focus:ring-[#DA251D] placeholder:text-stone-400 text-[#431914]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                aria-label="Xóa tìm kiếm"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ==================== LESSON LIST (SCROLLABLE) ==================== */}
      <div
        ref={listContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 roadmap-custom-scrollbar"
      >
        {filteredLessons.length === 0 ? (
          <div className="text-center py-8 text-xs text-stone-400 font-medium">
            Không tìm thấy bài học nào phù hợp.
          </div>
        ) : (
          filteredLessons.map((lesson, idx) => {
            const isCurrent = String(lesson.id) === String(currentId);
            const isCompleted = lesson.isCompleted || lesson.learningStatus === 'COMPLETED';
            const lessonNumber = lesson.lessonOrder || idx + 1;

            return (
              <div
                key={lesson.id || idx}
                ref={isCurrent ? activeItemRef : null}
              >
                <Link
                  aria-current={isCurrent ? 'page' : undefined}
                  to={`/learn/${courseId}/lesson/${lesson.id}`}
                  onClick={() => onClose?.()}
                  className={`group relative flex items-center justify-between gap-3 p-3 rounded-2xl text-xs sm:text-sm transition-all no-underline ${
                    isCurrent
                      ? 'bg-[#FFF9EE] border-2 border-[#DA251D] border-l-4 border-l-[#DA251D] shadow-xs'
                      : isCompleted
                      ? 'bg-white hover:bg-emerald-50/40 border border-stone-200 hover:border-emerald-300 shadow-2xs'
                      : 'bg-white hover:bg-[#FFFDF9] border border-stone-200 hover:border-[#DECBB4] shadow-2xs'
                  }`}
                >
                  {/* Left: Number Badge */}
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs font-black flex items-center justify-center shrink-0 transition-transform ${
                      isCurrent
                        ? 'bg-[#DA251D] text-white shadow-xs ring-2 ring-[#DA251D]/20 scale-105'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                    }`}
                  >
                    {isCompleted ? <Check size={14} className="stroke-[3]" /> : lessonNumber}
                  </span>

                  {/* Middle: Title & Meta Info */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p
                      className={`font-bold line-clamp-2 leading-snug m-0 ${
                        isCurrent
                          ? 'text-[#DA251D]'
                          : isCompleted
                          ? 'text-stone-800 group-hover:text-emerald-900'
                          : 'text-stone-700 group-hover:text-[#431914]'
                      }`}
                    >
                      <BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} />
                    </p>

                    {/* Meta: Duration & Status Badge */}
                    <div className="flex items-center gap-2 text-[11px] text-stone-400">
                      {lesson.estimatedDuration && (
                        <span className="inline-flex items-center gap-1 font-medium text-stone-500">
                          <Clock size={11} className="text-stone-400" />
                          <span>{lesson.estimatedDuration}m</span>
                        </span>
                      )}

                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-[#FFF2D6] text-[#A62A24] font-black text-[10px]">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DA251D] opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#DA251D]" />
                          </span>
                          <span>Đang học</span>
                        </span>
                      )}

                      {!isCurrent && isCompleted && (
                        <span className="text-emerald-600 font-semibold text-[10px]">
                          Hoàn thành
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Status Icon */}
                  <div className="shrink-0 flex items-center">
                    {isCurrent ? (
                      <span className="w-6 h-6 rounded-lg bg-[#DA251D]/10 flex items-center justify-center text-[#DA251D]">
                        <Play size={11} className="fill-[#DA251D] ml-0.5" />
                      </span>
                    ) : isCompleted ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                        <CheckCircle2 size={13} className="text-emerald-700" />
                      </span>
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-stone-300 group-hover:border-[#DA251D]/60 transition-colors" />
                    )}
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>

      {/* ==================== ROADMAP FOOTER ==================== */}
      <div className="shrink-0 p-3 bg-stone-50 border-t border-[#DECBB4]/40 text-center text-[11px] font-semibold text-stone-500">
        {completedCount === totalCount && totalCount > 0 ? (
          <span className="text-emerald-700 font-bold">
            🎉 Bạn đã hoàn thành toàn bộ khóa học!
          </span>
        ) : (
          <span>
            Còn <strong className="text-[#DA251D]">{totalCount - completedCount}</strong> bài học chưa hoàn thành
          </span>
        )}
      </div>
    </nav>
  );
}

export default LessonSidebar;
