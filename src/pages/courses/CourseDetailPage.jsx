import { BilingualText } from '@/components/common/BilingualText';
import { Link, useParams } from 'react-router-dom';
import { useCourse } from '@/hooks/useCourses';
import { CourseInfo, CourseThumbnail } from '@/components/course/CourseInfo';
import { EnrollButton } from '@/components/course/EnrollButton';
import { ResourceState } from '@/components/common/ResourceState';
import { CourseCurriculum } from '@/components/course/CourseCurriculum';
import { CourseProgress } from '@/components/course/CourseProgress';
export function CourseDetailPage() {
 const {courseId}=useParams(); const resource=useCourse(courseId);
 return <section><Link className="text-link" to="/courses"><BilingualText>{"← Tất cả khóa học"}</BilingualText></Link><ResourceState resource={resource}>{({course,enrollment})=><>
 <div className="course-detail-hero card"><div><span className="badge">{course.level} · <BilingualText>{course.isFree?'Miễn phí':'Khóa học'}</BilingualText></span><h1><BilingualText vi={course.titleVi || course.title} en={course.title} /></h1><p className="lead preserve-lines"><BilingualText vi={course.descriptionVi || course.description} en={course.description} /></p><CourseInfo course={course}/><EnrollButton courseId={courseId} enrollment={enrollment} onEnrolled={resource.reload}/></div><CourseThumbnail course={course}/></div>
 {course.learningOutcomes&&<section className="course-outcomes"><h2><BilingualText>{"Bạn sẽ học được gì"}</BilingualText></h2><div>{String(course.learningOutcomes).split(/\n|;/).filter(Boolean).map((text,i)=><p className="card" key={i}><span>✓</span> {text}</p>)}</div></section>}
 {enrollment?.isEnrolled&&<div className="split-grid course-curriculum-grid"><CourseCurriculum courseId={courseId}/><aside className="card"><h2><BilingualText>{"Tiến độ khóa học"}</BilingualText></h2><CourseProgress courseId={courseId}/><Link className="button" to={`/learn/${courseId}`}><BilingualText>{"Tiếp tục học →"}</BilingualText></Link></aside></div>}
 {!enrollment?.isEnrolled&&course.modules?.length>0&&<section className="curriculum"><h2><BilingualText>{"Nội dung khóa học"}</BilingualText></h2>{course.modules.map(module=><details className="curriculum-module" key={module.id} open><summary><BilingualText vi={module.titleVi || module.title} en={module.title} /></summary>{module.lessons?.map(lesson=><div className="curriculum-lesson" key={lesson.id}><span><BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} /></span><small>{lesson.estimatedMinutes}<BilingualText>{"phút · Đăng ký để học"}</BilingualText></small></div>)}</details>)}</section>}
 </>}</ResourceState></section>;
}
