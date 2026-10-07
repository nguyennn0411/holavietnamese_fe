export function CourseInfo({ course }) {
  return <div className="course-meta"><span className="badge">{course.level}</span><span>{course.totalLessons} lessons</span><span>{course.durationLabel}</span></div>
}
export function CourseThumbnail({ course }) {
  return <div className="course-thumbnail" aria-hidden="true">
    {course.thumbnailUrl ? <img src={course.thumbnailUrl} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }} /> : null}
    <span>Tiếng Việt</span>
  </div>
}
