import { BilingualText } from '@/components/common/BilingualText';
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { learningService } from '@/services/learningService'
import { useLearning } from '@/hooks/useLearning'
import { ResourceState } from '@/components/common/ResourceState'
import { LessonSidebar } from '@/components/learning/LessonSidebar'
import { LessonContent } from '@/components/learning/LessonContent'
import { LessonNavigation } from '@/components/learning/LessonNavigation'
import { ProgressBar } from '@/components/common/ProgressBar'
import { VocabularyForm } from '@/components/vocabulary/VocabularyForm'
import { LessonActivities } from '@/components/learning/LessonActivities'
export function LessonLearningPage() {
  const { courseId, lessonId } = useParams()
  return <LessonScreen key={`${courseId}:${lessonId}`} courseId={courseId} lessonId={lessonId} />
}
function LessonScreen({ courseId, lessonId }) {
  const resource = useLearning(courseId, lessonId)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [savingWord, setSavingWord] = useState(false)
  const [message, setMessage] = useState('')
  async function complete() {
    setPending(true); setError('')
    try { await learningService.complete(lessonId); resource.reload() }
    catch (e) { setError(e.message) } finally { setPending(false) }
  }
  return <ResourceState resource={resource}>{({ course, lesson, lessons, progress }) => <section>
    <Link className="text-link" to={`/courses/${courseId}`}>← <BilingualText vi={course.titleVi || course.title} en={course.title} /></Link>
    <ProgressBar value={progress.progressPercentage} label={`${progress.completedLessons} / ${progress.totalLessons} bài học đã hoàn thành`} />
    <div className="learning-grid"><LessonSidebar lessons={lessons} courseId={courseId} currentId={lesson.id} />
    <div className="lesson-panel"><LessonActivities onProgress={result=>{if(result.completed)resource.reload();}} lessonId={lesson.id} fallback={<div className="card"><LessonContent lesson={lesson} /></div>} />
    <section className="vocabulary-prompt"><h2><BilingualText>{"Thêm một từ mới"}</BilingualText></h2><p><BilingualText>{"Gặp một từ hữu ích? Lưu lại để ôn tập sau."}</BilingualText></p><button className="secondary" onClick={() => setSavingWord(true)}><BilingualText>{"Lưu từ vựng"}</BilingualText></button>{message && <p className="success" role="status"><BilingualText>{message}</BilingualText></p>}</section>
    {savingWord && <VocabularyForm lessonId={lesson.id} onClose={() => setSavingWord(false)} onSaved={() => { setSavingWord(false); setMessage('Đã lưu vào sổ tay từ vựng.'); }} />}
    {error && <p role="alert"><BilingualText>{error}</BilingualText></p>}<LessonNavigation lesson={lesson} pending={pending} onComplete={complete} /></div></div></section>}</ResourceState>
}
