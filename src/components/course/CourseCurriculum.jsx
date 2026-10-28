import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom';
import { useLessons } from '@/hooks/useLearning';
import { ResourceState } from '@/components/common/ResourceState';
import { BookOpen, Clock, PlayCircle } from 'lucide-react';

export function CourseCurriculum({ courseId }) {
  const resource = useLessons(courseId);

  return (
    <section className="card curriculum bg-white rounded-3xl border border-[#E8E5DF] p-6 sm:p-8 shadow-xs space-y-5">
      <div className="flex items-center gap-2 border-b border-[#E8E5DF]/40 pb-4">
        <BookOpen size={20} className="text-[#FF7A00]" />
        <h2 className="text-lg sm:text-xl font-black text-[#253044] m-0">
          <BilingualText>{"Nội dung khóa học"}</BilingualText>
        </h2>
      </div>

      <ResourceState resource={resource}>
        {(lessons) =>
          lessons.length ? (
            <ol className="space-y-2.5 list-none p-0 m-0">
              {lessons.map((l, index) => (
                <li key={l.id}>
                  <Link
                    to={`/courses/${courseId}/lesson/${l.id}`}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#FFF7E8] border border-[#E8E5DF]/60 hover:border-[#FF7A00] text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs no-underline text-inherit group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-[#FFF2D6] text-[#EA580C] group-hover:bg-[#FF7A00] group-hover:text-white font-black text-xs flex items-center justify-center shrink-0 border border-[#FFCD00]/40 transition-colors">
                        {l.lessonOrder || index + 1}
                      </span>
                      <span className="truncate group-hover:text-[#FF7A00] transition-colors">
                        <BilingualText vi={l.titleVi || l.title} en={l.title} />
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-stone-400 shrink-0 text-xs">
                      {l.estimatedDuration && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
                          <Clock size={12} className="text-[#FF7A00]" />
                          <span>{l.estimatedDuration} phút</span>
                        </span>
                      )}
                      <PlayCircle size={15} className="text-stone-300 group-hover:text-[#FF7A00] transition-colors" />
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-xs text-[#64748B] italic py-3 m-0">
              <BilingualText>{"Chưa có bài học được xuất bản."}</BilingualText>
            </p>
          )
        }
      </ResourceState>
    </section>
  );
}

export default CourseCurriculum;
