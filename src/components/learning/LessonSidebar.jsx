import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom'
import { LessonStatus } from './LessonStatus'
export function LessonSidebar({ lessons, courseId, currentId }) {
  return <nav className="lesson-sidebar" aria-label="Bài học trong khóa"><h2><BilingualText>{"Các bài học của bạn"}</BilingualText></h2><ol>{lessons.map(lesson =>
    <li key={lesson.id}><Link aria-current={lesson.id === currentId ? 'page' : undefined} className={lesson.id === currentId ? 'current' : ''} to={`/learn/${courseId}/lesson/${lesson.id}`}>
      <span>{lesson.lessonOrder}. <BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} /></span><LessonStatus status={lesson.learningStatus} /></Link></li>)}</ol></nav>
}
