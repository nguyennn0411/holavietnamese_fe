import { BilingualText } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { BookOpen, Clock } from 'lucide-react';

const LEVEL_BADGES = {
  A0: 'bg-sky-700 text-sky-100',
  A1: 'bg-emerald-700 text-emerald-100',
  A2: 'bg-teal-700 text-teal-100',
  B1: 'bg-amber-700 text-amber-100',
  B2: 'bg-purple-700 text-purple-100',
  C1: 'bg-[#EA580C] text-white',
};

const DEFAULT_COVERS = [
  `${import.meta.env.BASE_URL}design/hero/slide3_culture.jpg`,
  `${import.meta.env.BASE_URL}design/hero/slide2_speaking.jpg`,
  `${import.meta.env.BASE_URL}design/hero/slide1_welcome.jpg`,
  `${import.meta.env.BASE_URL}design/hero/slide4_journey.jpg`,
  `${import.meta.env.BASE_URL}design/hero/slide5_aitutor.jpg`,
];

export function getCourseCover(course) {
  if (course?.thumbnailUrl && !course.thumbnailUrl.includes('food.svg') && !course.thumbnailUrl.includes('design/')) {
    return course.thumbnailUrl;
  }

  const title = (course?.titleVi || course?.title || '').toLowerCase();
  const level = (course?.level || '').toUpperCase();

  // Pattern matching by topic & level
  if (/thực tế|giao tiếp thực tế|nhà hàng|khách sạn|ẩm thực|food|cuisine/i.test(title) || level === 'A2') {
    return `${import.meta.env.BASE_URL}design/hero/slide3_culture.jpg`;
  }
  if (/sinh hoạt|di chuyển|daily|life|travel/i.test(title)) {
    return `${import.meta.env.BASE_URL}design/hero/slide2_speaking.jpg`;
  }
  if (/làm quen|giao tiếp 1|sơ cấp 1|phát âm|alphabet|a0/i.test(title) || level === 'A0') {
    return `${import.meta.env.BASE_URL}design/hero/slide1_welcome.jpg`;
  }
  if (/hành trình|khám phá|trung cấp|b1/i.test(title) || level === 'B1') {
    return `${import.meta.env.BASE_URL}design/hero/slide4_journey.jpg`;
  }
  if (/nâng cao|b2|c1|luyện nói/i.test(title) || level === 'B2' || level === 'C1') {
    return `${import.meta.env.BASE_URL}design/hero/slide5_aitutor.jpg`;
  }

  // Deterministic fallback by id
  const idNum = Number(String(course?.id || '1').replace(/\D/g, '')) || 0;
  return DEFAULT_COVERS[idNum % DEFAULT_COVERS.length];
}

export function CourseInfo({ course }) {
  const levelClass = LEVEL_BADGES[course.level] || 'bg-[#24382B] text-[#FFF7E8]';

  return (
    <div className="course-meta flex items-center gap-2.5 text-xs text-[#64748B] font-medium">
      <span className={`badge px-2.5 py-0.5 rounded-md font-extrabold text-[10px] tracking-wider shadow-2xs ${levelClass}`}>
        {course.level}
      </span>
      <span className="inline-flex items-center gap-1">
        <BookOpen size={13} className="text-[#FF7A00]" />
        <span>{course.totalLessons ?? course.lessonCount ?? 0}</span>
        <BilingualText>{"bài học"}</BilingualText>
      </span>
      <span>•</span>
      <span className="inline-flex items-center gap-1">
        <Clock size={13} className="text-[#FF7A00]" />
        <BilingualText>{course.durationLabel || `${course.estimatedMinutes ?? course.estimatedDuration ?? 0} phút`}</BilingualText>
      </span>
    </div>
  );
}

export function CourseThumbnail({ course, className = '' }) {
  const coverUrl = getCourseCover(course);

  return (
    <div className={`course-thumbnail relative w-full h-full overflow-hidden bg-stone-900 ${className}`}>
      <ContentImage
        src={coverUrl}
        alt={course?.titleVi || course?.title || 'Khóa học'}
        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        fallback={
          <img
            src={`${import.meta.env.BASE_URL}design/hero/slide1_welcome.jpg`}
            alt={course?.title || 'Khóa học'}
            className="w-full h-full object-cover"
          />
        }
      />
      {/* Subtle gradient overlay to make overlay badges pop and improve text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/35 pointer-events-none" />
    </div>
  );
}

export default CourseInfo;
