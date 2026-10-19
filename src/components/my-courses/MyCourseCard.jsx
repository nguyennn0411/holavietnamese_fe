import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { CourseThumbnail } from '@/components/course/CourseInfo';
import { CourseProgressBar } from './CourseProgressBar';

export function MyCourseCard({ course }) {
  const isCompleted = course.progressPercentage === 100;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="card course-card group relative flex flex-col bg-[#FFF9EE] border border-[#DECBB4] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#cfb79d] transition-all duration-300"
    >
      <div className="relative overflow-hidden aspect-[16/10] bg-[#EEE3D1]">
        <CourseThumbnail course={course} />
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#24382B] text-[#FFF9EE] shadow-sm tracking-wide">
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

      <div className="card-body p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#431914] group-hover:text-[#A62A24] transition-colors leading-snug line-clamp-2 mb-3">
            <BilingualText vi={course.titleVi || course.title} en={course.title} />
          </h2>
          <CourseProgressBar course={course} />
        </div>

        <div className="pt-2">
          <Link
            className="button w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#A62A24] hover:bg-[#89221E] text-white font-bold text-xs shadow-sm transition-all"
            to={`/learn/${course.courseId}`}
          >
            <BilingualText>{"Tiếp tục học →"}</BilingualText>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
