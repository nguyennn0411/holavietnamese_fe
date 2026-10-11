import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom'
export function LessonNavigation({ lesson, pending, onComplete }) {
  const path = id => `/learn/${lesson.courseId}/lesson/${id}`
  return <div className="lesson-navigation">
    {lesson.previousLessonId ? <Link className="button secondary" to={path(lesson.previousLessonId)}><BilingualText>{"← Bài trước"}</BilingualText></Link> : <span />}
    <button disabled={pending || lesson.isCompleted} onClick={onComplete}><BilingualText>{lesson.isCompleted ? '✓ Đã hoàn thành' : pending ? 'Đang lưu…' : 'Hoàn thành bài học'}</BilingualText></button>
    {lesson.nextLessonId && <Link className="button secondary" to={path(lesson.nextLessonId)}><BilingualText>{"Bài tiếp theo →"}</BilingualText></Link>}
  </div>
}
