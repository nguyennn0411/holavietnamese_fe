import { Link } from 'react-router-dom'
export function LessonNavigation({ lesson, pending, onComplete }) {
  const path = id => `/learn/${lesson.courseId}/lesson/${id}`
  return <div className="lesson-navigation">
    {lesson.previousLessonId ? <Link className="button secondary" to={path(lesson.previousLessonId)}>← Previous Lesson</Link> : <span />}
    <button disabled={pending || lesson.isCompleted} onClick={onComplete}>{lesson.isCompleted ? '✓ Completed' : pending ? 'Saving…' : 'Complete Lesson'}</button>
    {lesson.nextLessonId && <Link className="button secondary" to={path(lesson.nextLessonId)}>Next Lesson →</Link>}
  </div>
}
