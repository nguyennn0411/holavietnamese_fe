import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { CourseThumbnail } from './CourseInfo';
import { BilingualText } from '@/components/common/BilingualText';

// Màu sắc nhận diện theo khung trình độ CEFR với độ tương phản hài hòa
const LEVEL_BADGES = {
  A0: 'bg-sky-600/90 text-white border-sky-400/40',
  A1: 'bg-emerald-600/90 text-white border-emerald-400/40',
  A2: 'bg-teal-600/90 text-white border-teal-400/40',
  B1: 'bg-amber-600/90 text-white border-amber-400/40',
  B2: 'bg-purple-600/90 text-white border-purple-400/40',
  C1: 'bg-[#F97316]/90 text-white border-orange-300/40',
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
      <span className="px-2.5 py-1 text-xs font-medium rounded-lg shadow-2xs bg-white/95 text-[#64748B] border border-[#E2E8F0] flex items-center gap-1.5 backdrop-blur-sm">
        <Lock size={12} />
        <BilingualText vi="Tạm khóa" en="Temporarily locked" />
      </span>
    );
  } else if (isCompleted) {
    statusBadge = (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 bg-white/95 text-emerald-700 border border-emerald-200 backdrop-blur-sm">
        <CheckCircle2 size={13} className="text-emerald-600" />
        <BilingualText vi="Đã hoàn thành" en="Completed" />
      </span>
    );
  } else if (isInProgress) {
    statusBadge = (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 bg-white/95 text-[#EA580C] border border-[#FED7AA] backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA580C] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EA580C]" />
        </span>
        <BilingualText vi="Đang học" en="In progress" />
      </span>
    );
  } else if (isEnrolledNotStarted) {
    statusBadge = (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 bg-white/95 text-[#2563EB] border border-[#BFDBFE] backdrop-blur-sm">
        <BilingualText vi="Đã đăng ký" en="Enrolled" />
      </span>
    );
  } else {
    statusBadge = (
      <span className="px-2.5 py-1 text-xs font-medium rounded-lg shadow-2xs flex items-center gap-1 bg-white/90 text-[#64748B] border border-[#E2E8F0] backdrop-blur-sm">
        <BilingualText vi="Chưa đăng ký" en="Not enrolled" />
      </span>
    );
  }

  const progressPercent =
    enrollment?.progressPercentage ??
    (enrollment?.totalLessons && enrollment?.completedLessons
      ? Math.round((enrollment.completedLessons / enrollment.totalLessons) * 100)
      : 0);

  const levelClass = LEVEL_BADGES[course.level] || 'bg-[#FFF0DC] text-[#EA580C] border border-[#FED7AA]';

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative flex flex-col bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-[#CBD5E1] transition-all duration-200"
    >
      {/* Thumbnail area with overlay badges */}
      <div className="relative overflow-hidden aspect-[16/9.5] bg-slate-900 shrink-0">
        <CourseThumbnail course={course} />

        {/* Level badge floating */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md shadow-xs tracking-wider uppercase border backdrop-blur-sm ${levelClass}`}>
            {course.level}
          </span>
        </div>

        {/* Enrollment status pill */}
        <div className="absolute top-3 right-3 z-10">{statusBadge}</div>
      </div>

      {/* Card body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2.5">
          {/* Metadata info */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] font-medium">
            <span className="inline-flex items-center gap-1">
              <BilingualText
                vi={`${course.totalLessons ?? course.lessonCount ?? 0} bài học`}
                en={`${course.totalLessons ?? course.lessonCount ?? 0} lessons`}
              />
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1">
              {course.durationLabel ? (
                <span>{course.durationLabel}</span>
              ) : (
                <BilingualText
                  vi={`${course.estimatedMinutes ?? course.estimatedDuration ?? 0} phút`}
                  en={`${course.estimatedMinutes ?? course.estimatedDuration ?? 0} mins`}
                />
              )}
            </span>
          </div>

          {/* Title & English Subtitle */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#1E293B] group-hover:text-[#F97316] transition-colors leading-snug line-clamp-1 m-0">
              <Link to={`/courses/${course.id}`} className="hover:underline no-underline text-inherit">
                <BilingualText vi={course.titleVi || course.title} en={course.title} />
              </Link>
            </h3>
            {course.title && course.titleVi && course.title !== course.titleVi && (
              <p className="text-xs text-[#94A3B8] font-normal line-clamp-1 mt-0.5 m-0">
                {course.title}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#64748B] line-clamp-2 leading-relaxed m-0">
            <BilingualText vi={course.descriptionVi || course.description} en={course.description} />
          </p>

          {/* Progress bar if enrolled */}
          {isEnrolled && (
            <div className="space-y-1.5 bg-[#FFF8EE] p-3 rounded-xl border border-[#FED7AA]/50">
              <div className="flex items-center justify-between text-xs font-semibold text-[#1E293B]">
                <span className="flex items-center gap-1">
                  <BilingualText vi="Tiến độ học" en="Learning progress" />
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#FFF0DC] text-[#EA580C] font-bold text-xs">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-emerald-600' : 'bg-gradient-to-r from-[#F97316] to-[#EA580C]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action footer with refined CTA button */}
        <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
          {isEnrolled ? (
            <Link
              to={`/courses/${course.id}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs shadow-2xs hover:shadow-xs transition-all no-underline group/btn cursor-pointer"
            >
              {isCompleted ? (
                <BilingualText vi="Xem lại khóa học" en="Review course" />
              ) : (
                <BilingualText vi="Tiếp tục học" en="Continue learning" />
              )}
              <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <Link
              to={`/courses/${course.id}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#1E293B] border border-[#E2E8F0] hover:border-[#CBD5E1] font-semibold text-xs shadow-2xs transition-all no-underline group/btn cursor-pointer"
            >
              <BilingualText vi="Xem chi tiết" en="View details" />
              <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          )}

          {/* Quick Level & Count Pill on right */}
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-lg shrink-0">
            {course.level} • <BilingualText vi={`${course.totalLessons ?? course.lessonCount ?? 0} bài`} en={`${course.totalLessons ?? course.lessonCount ?? 0} lessons`} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default CourseCard;
