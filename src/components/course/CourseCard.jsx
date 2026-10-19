import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { CourseInfo, CourseThumbnail } from './CourseInfo';

export function CourseCard({ course, enrollment }) {
  const isEnrolled = enrollment?.isEnrolled;
  const isCompleted = enrollment?.status === 'COMPLETED';

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="card course-card group relative flex flex-col bg-[#FFF9EE] border border-[#DECBB4] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#cfb79d] transition-all duration-300"
    >
      {/* Thumbnail area with overlay badges */}
      <div className="relative overflow-hidden aspect-[16/10] bg-[#EEE3D1]">
        <CourseThumbnail course={course} />

        {/* Level badge floating */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#24382B] text-[#FFF9EE] shadow-sm tracking-wide">
            {course.level}
          </span>
        </div>

        {/* Enrollment status pill */}
        {isEnrolled && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 ${
                isCompleted
                  ? 'bg-emerald-800 text-emerald-100 border border-emerald-700'
                  : 'bg-[#A62A24] text-white border border-[#89221E]'
              }`}
            >
              {isCompleted ? <CheckCircle2 size={12} /> : null}
              <BilingualText>{isCompleted ? 'Đã hoàn thành' : 'Đang học'}</BilingualText>
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="card-body p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Metadata info */}
          <div className="flex items-center gap-3 text-xs text-[#78685B] mb-2 font-medium">
            <span className="inline-flex items-center gap-1">
              <BookOpen size={13} className="text-[#A62A24]" />
              {course.totalLessons ?? course.lessonCount ?? 0} <BilingualText>{"bài học"}</BilingualText>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={13} className="text-[#A62A24]" />
              <BilingualText>{course.durationLabel || `${course.estimatedMinutes ?? course.estimatedDuration ?? 0} phút`}</BilingualText>
            </span>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-[#431914] group-hover:text-[#A62A24] transition-colors leading-snug line-clamp-2 mb-2">
            <Link to={`/courses/${course.id}`} className="hover:underline">
              <BilingualText vi={course.titleVi || course.title} en={course.title} />
            </Link>
          </h2>

          {/* Description */}
          <p className="text-xs text-[#78685B] line-clamp-2 leading-relaxed">
            <BilingualText vi={course.descriptionVi || course.description} en={course.description} />
          </p>
        </div>

        {/* Action footer */}
        <div className="pt-3 border-t border-[#DECBB4]/40 flex items-center justify-between">
          <Link
            className="text-link text-xs font-bold text-[#A62A24] hover:text-[#89221E] inline-flex items-center gap-1.5 transition-colors group-hover:translate-x-0.5"
            to={`/courses/${course.id}`}
          >
            <BilingualText>{"Xem khóa học →"}</BilingualText>
          </Link>
          <span className="w-7 h-7 rounded-full bg-[#F5E1D8] text-[#A62A24] flex items-center justify-center group-hover:bg-[#A62A24] group-hover:text-white transition-all shadow-sm">
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
