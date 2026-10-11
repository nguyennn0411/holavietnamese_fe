import { BilingualText } from '@/components/common/BilingualText';
import { Artwork } from '@/components/common/Ui';
import { ContentImage } from '@/components/common/ContentImage';
export function CourseInfo({course}) { return <div className="course-meta"><span className="badge">{course.level}</span><span>{course.totalLessons??course.lessonCount??0}<BilingualText>{"bài học"}</BilingualText></span><span><BilingualText>{course.durationLabel||`${course.estimatedMinutes??course.estimatedDuration??0} phút`}</BilingualText></span></div>; }
export function CourseThumbnail({course}) {
 const kind=/travel|du lịch/i.test(course.title)?'coast':/daily|coffee|đời sống/i.test(course.title)?'coffee':/foundation|cơ bản|tone/i.test(course.title)?'village':'food';
 return <div className="course-thumbnail"><ContentImage src={course.thumbnailUrl} alt={course.title} className="figma-art" fallback={<Artwork kind={kind} alt={`Minh họa khóa học: ${course.title}`}/>}/></div>;
}
