import { BilingualText } from '@/components/common/BilingualText';
import { Artwork } from '@/components/common/Ui';
import { ContentImage } from '@/components/common/ContentImage';
import { BookOpen, Clock } from 'lucide-react';

export function CourseInfo({ course }) {
  return (
    <div className="course-meta flex items-center gap-3 text-xs text-[#78685B] font-medium">
      <span className="badge px-2 py-0.5 rounded-md bg-[#24382B] text-[#FFF9EE] font-bold text-[10px] tracking-wider">
        {course.level}
      </span>
      <span className="inline-flex items-center gap-1">
        <BookOpen size={12} className="text-[#A62A24]" />
        {course.totalLessons ?? course.lessonCount ?? 0} <BilingualText>{"bài học"}</BilingualText>
      </span>
      <span>•</span>
      <span className="inline-flex items-center gap-1">
        <Clock size={12} className="text-[#A62A24]" />
        <BilingualText>{course.durationLabel || `${course.estimatedMinutes ?? course.estimatedDuration ?? 0} phút`}</BilingualText>
      </span>
    </div>
  );
}

export function CourseThumbnail({ course }) {
  const kind = /travel|du lịch/i.test(course.title)
    ? 'coast'
    : /daily|coffee|đời sống/i.test(course.title)
    ? 'coffee'
    : /foundation|cơ bản|tone/i.test(course.title)
    ? 'village'
    : 'food';

  return (
    <div className="course-thumbnail relative w-full h-full overflow-hidden">
      <ContentImage
        src={course.thumbnailUrl}
        alt={course.title}
        className="figma-art w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        fallback={
          <Artwork
            kind={kind}
            alt={`Minh họa khóa học: ${course.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        }
      />
    </div>
  );
}
