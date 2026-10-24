import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Play, BookOpen } from 'lucide-react';
import { CourseThumbnail } from '@/components/course/CourseInfo';
import { CourseProgressBar } from './CourseProgressBar';

const LEVEL_BADGES = {
  A0: 'bg-sky-700 text-sky-100 border-sky-600',
  A1: 'bg-emerald-700 text-emerald-100 border-emerald-600',
  A2: 'bg-teal-700 text-teal-100 border-teal-600',
  B1: 'bg-amber-700 text-amber-100 border-amber-600',
  B2: 'bg-purple-700 text-purple-100 border-purple-600',
  C1: 'bg-[#EA580C] text-white border-[#C2410C]',
};

export function MyCourseCard({ course }) {
  const isCompleted = course.progressPercentage === 100;
  const levelClass = LEVEL_BADGES[course.level] || 'bg-[#24382B] text-[#FFF7E8] border-[#1b2b21]';
  const continueUrl = course.lastAccessedLessonId
    ? `/learn/${course.courseId || course.id}/lesson/${course.lastAccessedLessonId}`
    : `/learn/${course.courseId || course.id}`;

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="card course-card group relative flex flex-col bg-[#FFF7E8] border border-[#E8E5DF] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#FF7A00]/60 transition-all duration-300"
    >
      <div className="relative overflow-hidden aspect-[16/10] bg-[#EEE3D1]">
        <CourseThumbnail course={course} />
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2.5 py-1 text-xs font-extrabold rounded-lg shadow-sm tracking-wide border ${levelClass}`}>
            {course.level}
          </span>
        </div>
        {isCompleted && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-800 text-emerald-100 border border-emerald-700 shadow-sm flex items-center gap-1">
              <CheckCircle2 size={12} />
              <BilingualText>{"✓ Đã hoàn thành"}</BilingualText>
            </span>
          </div>
        )}
      </div>

      <div className="card-body p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#253044] group-hover:text-[#FF7A00] transition-colors leading-snug line-clamp-2">
            <Link to={`/courses/${course.courseId || course.id}`} className="hover:underline no-underline text-inherit">
              <BilingualText vi={course.titleVi || course.title} en={course.title} />
            </Link>
          </h2>
          <CourseProgressBar course={course} />
        </div>

        <div className="pt-3 border-t border-[#E8E5DF]/50 flex items-center gap-2">
          <Link
            className="button flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FF7A00] hover:bg-[#EA580C] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all no-underline"
            to={continueUrl}
          >
            {isCompleted ? <BookOpen size={14} /> : <Play size={13} fill="currentColor" />}
            <span>{isCompleted ? 'Xem lại khóa học' : 'Tiếp tục học'}</span>
            <ArrowRight size={14} className="ml-1" />
          </Link>

          <Link
            to={`/courses/${course.courseId || course.id}`}
            className="p-2.5 rounded-xl border border-[#E8E5DF] bg-white hover:bg-stone-50 text-[#253044] text-xs font-bold transition-all"
            title={bilingualLabel("Chi tiết khóa học", "Course details")}
          >
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default MyCourseCard;
