import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Clock, CheckCircle2, Play, Lock } from 'lucide-react';
import { CourseThumbnail } from './CourseInfo';

// Màu sắc nhận diện theo khung trình độ CEFR với độ tương phản cao
const LEVEL_BADGES = {
  A0: 'bg-sky-700 text-white border-sky-500/60',
  A1: 'bg-emerald-700 text-white border-emerald-500/60',
  A2: 'bg-teal-700 text-white border-teal-500/60',
  B1: 'bg-amber-700 text-white border-amber-500/60',
  B2: 'bg-purple-700 text-white border-purple-500/60',
  C1: 'bg-[#DA251D] text-white border-red-500/60',
};

export function CourseCard({ course, enrollment }) {
  const isEnrolled = Boolean(enrollment?.isEnrolled);
  const isCompleted =
    enrollment?.status === 'COMPLETED' || enrollment?.progressPercentage === 100;
  const isInProgress =
    isEnrolled &&
    !isCompleted &&
    (enrollment?.completedLessons > 0 ||
      enrollment?.progressPercentage > 0 ||
      enrollment?.status === 'IN_PROGRESS');
  const isEnrolledNotStarted = isEnrolled && !isCompleted && !isInProgress;
  const isRestricted = course?.status === 'ARCHIVED' || course?.isRestricted;

  // Trạng thái hiển thị huy hiệu góc phải trên ảnh thumbnail
  let statusBadge = null;
  if (isRestricted) {
    statusBadge = (
      <span className="px-3 py-1 text-xs font-bold rounded-lg shadow-md bg-stone-800/90 text-stone-200 border border-stone-600/60 flex items-center gap-1.5 backdrop-blur-xs">
        <Lock size={12} />
        <span>Tạm khóa</span>
      </span>
    );
  } else if (isCompleted) {
    statusBadge = (
      <span className="px-3 py-1 text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 bg-emerald-700/95 text-white border border-emerald-500/60 backdrop-blur-xs">
        <CheckCircle2 size={13} className="text-emerald-200" />
        <span>Đã hoàn thành</span>
      </span>
    );
  } else if (isInProgress) {
    statusBadge = (
      <span className="px-3 py-1 text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 bg-[#DA251D]/95 text-white border border-red-400/60 backdrop-blur-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        <span>Đang học</span>
      </span>
    );
  } else if (isEnrolledNotStarted) {
    statusBadge = (
      <span className="px-3 py-1 text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 bg-[#24382B]/95 text-[#FFF9EE] border border-stone-600/60 backdrop-blur-xs">
        <span>Đã đăng ký</span>
      </span>
    );
  } else {
    statusBadge = (
      <span className="px-3 py-1 text-xs font-bold rounded-lg shadow-md flex items-center gap-1 bg-black/60 text-white border border-white/20 backdrop-blur-md">
        <span>Chưa đăng ký</span>
      </span>
    );
  }

  const progressPercent =
    enrollment?.progressPercentage ??
    (enrollment?.totalLessons && enrollment?.completedLessons
      ? Math.round((enrollment.completedLessons / enrollment.totalLessons) * 100)
      : 0);

  const levelClass = LEVEL_BADGES[course.level] || 'bg-[#24382B] text-[#FFF9EE] border-stone-600/60';

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="card course-card group relative bg-white border border-[#DECBB4]/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#DA251D]/60 transition-all duration-300"
    >
      {/* Thumbnail area with overlay badges */}
      <div className="relative overflow-hidden aspect-[16/10] bg-stone-900 shrink-0">
        <CourseThumbnail course={course} />

        {/* Level badge floating */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2.5 py-1 text-xs font-black rounded-lg shadow-md tracking-wider uppercase border backdrop-blur-xs ${levelClass}`}>
            {course.level}
          </span>
        </div>

        {/* Enrollment status pill */}
        <div className="absolute top-3 right-3 z-10">{statusBadge}</div>
      </div>

      {/* Card body */}
      <div className="card-body p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-3">
          {/* Metadata info */}
          <div className="flex items-center gap-3 text-xs text-[#78685B] font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen size={13} className="text-[#DA251D]" />
              <span>{course.totalLessons ?? course.lessonCount ?? 0} bài học</span>
            </span>
            <span className="text-stone-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} className="text-[#DA251D]" />
              <span>
                {course.durationLabel || `${course.estimatedMinutes ?? course.estimatedDuration ?? 0} phút`}
              </span>
            </span>
          </div>

          {/* Title & English Subtitle */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#431914] group-hover:text-[#DA251D] transition-colors leading-snug line-clamp-1 m-0">
              <Link to={`/courses/${course.id}`} className="hover:underline no-underline text-inherit">
                {course.titleVi || course.title}
              </Link>
            </h2>
            {course.title && course.titleVi && course.title !== course.titleVi && (
              <p className="text-xs font-medium text-[#8C7A6B] line-clamp-1 mt-0.5 m-0">
                {course.title}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#5C4D42] line-clamp-2 leading-relaxed m-0">
            {course.descriptionVi || course.description}
          </p>

          {/* Progress bar if enrolled */}
          {isEnrolled && (
            <div className="space-y-1.5 bg-[#FFF9EE] p-3 rounded-xl border border-[#DECBB4]/60">
              <div className="flex items-center justify-between text-xs font-bold text-[#431914]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className={isCompleted ? 'text-emerald-600' : 'text-[#DA251D]'} />
                  <span>Tiến độ học</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#FFF2D6] text-[#A62A24] font-black text-xs">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200/80 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-emerald-600' : 'bg-gradient-to-r from-[#DA251D] to-[#E65046]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action footer with prominent CTA button */}
        <div className="pt-3 border-t border-[#DECBB4]/50 flex items-center justify-between gap-3">
          {isEnrolled ? (
            <Link
              to={`/courses/${course.id}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#DA251D] hover:bg-[#B71C1C] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all no-underline group/btn cursor-pointer"
            >
              {isCompleted ? (
                <>
                  <BookOpen size={15} />
                  <span>Xem lại khóa học</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  <span>Tiếp tục học</span>
                </>
              )}
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link
              to={`/courses/${course.id}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#24382B] hover:bg-[#1a2920] text-[#FFF9EE] font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all no-underline group/btn cursor-pointer"
            >
              <span>Xem chi tiết khóa học</span>
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}

          {/* Quick Level & Count Pill on right */}
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#78685B] bg-[#FFF9EE] border border-[#DECBB4]/80 px-2.5 py-1 rounded-lg">
            {course.level} • {course.totalLessons ?? course.lessonCount ?? 0} bài
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default CourseCard;
