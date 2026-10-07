import { Link } from 'react-router-dom'
export function LessonNavigation({ lesson, pending, onComplete }) {
  const path = id => `/learn/${lesson.courseId}/lesson/${id}`
  return <div className="lesson-navigation">
    {lesson.previousLessonId ? <Link className="button secondary" to={path(lesson.previousLessonId)}>← Bài trước</Link> : <span />}
    <button disabled={pending || lesson.isCompleted} onClick={onComplete}>{lesson.isCompleted ? '✓ Đã hoàn thành' : pending ? 'Đang lưu…' : 'Hoàn thành bài học'}</button>
    {lesson.nextLessonId && <Link className="button secondary" to={path(lesson.nextLessonId)}>Bài tiếp theo →</Link>}
  </div>
}
