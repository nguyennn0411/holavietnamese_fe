import { BilingualText } from '@/components/common/BilingualText';
import { MediaPlayer } from './MediaPlayer';
import { BookOpen, Clock, Target } from 'lucide-react';

export function LessonContent({ lesson }) {
  const duration = lesson.estimatedDuration || lesson.estimatedMinutes || 15;

  return (
    <article className="lesson-content bg-white rounded-3xl border border-[#E8E5DF] p-6 sm:p-10 shadow-sm space-y-6">
      {/* Header Info */}
      <div className="space-y-3.5 border-b border-[#E8E5DF]/40 pb-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2D6] text-[#EA580C] font-black text-xs border border-[#FFCD00]/50 shadow-2xs">
            <BookOpen size={13} />
            <BilingualText>{"Bài học "}</BilingualText>
            {lesson.lessonOrder || 1}
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-bold text-xs border border-stone-200">
            <Clock size={13} className="text-[#FF7A00]" />
            <span>{duration}</span>
            <BilingualText>{"phút"}</BilingualText>
          </span>

          {lesson.cefrLevel && (
            <span className="px-2.5 py-1 rounded-full bg-[#FF7A00] text-white font-extrabold text-xs shadow-2xs">
              {lesson.cefrLevel}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#253044] tracking-tight leading-tight">
          <BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} />
        </h1>

        {(lesson.descriptionVi || lesson.description) && (
          <p className="lead text-sm sm:text-base text-[#64748B] leading-relaxed m-0">
            <BilingualText vi={lesson.descriptionVi || lesson.description} en={lesson.description} />
          </p>
        )}

        {/* Learning Objectives Callout if present */}
        {(lesson.objectiveVi || lesson.objectiveEn) && (
          <div className="p-3.5 rounded-2xl bg-[#FFF7E8] border border-[#E8E5DF]/70 flex items-start gap-2.5 text-xs sm:text-sm text-[#253044]">
            <Target size={16} className="text-[#FF7A00] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#EA580C] block text-xs uppercase tracking-wider mb-0.5">
                <BilingualText>{"Mục tiêu bài học:"}</BilingualText>
              </strong>
              <span className="font-semibold text-stone-800">
                <BilingualText vi={lesson.objectiveVi} en={lesson.objectiveEn} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Media Player Embed */}
      {(lesson.videoUrl || lesson.audioUrl) && (
        <div className="rounded-2xl overflow-hidden border border-[#E8E5DF]/60 shadow-xs bg-[#FFFDF9] p-3">
          <MediaPlayer videoUrl={lesson.videoUrl} audioUrl={lesson.audioUrl} />
        </div>
      )}

      {/* Text Content */}
      {lesson.content && (
        <div className="lesson-text preserve-lines text-sm sm:text-base text-[#253044] leading-relaxed bg-[#FFFDF9] rounded-2xl p-6 border border-[#E8E5DF]/50 font-sans vn-diacritic-safe">
          {lesson.content}
        </div>
      )}
    </article>
  );
}

export default LessonContent;
