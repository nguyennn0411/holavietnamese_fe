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
    <Link className="text-link" to={`/courses/${courseId}`}>← {course.title}</Link>
    <ProgressBar value={progress.progressPercentage} label={`${progress.completedLessons} / ${progress.totalLessons} bài học đã hoàn thành`} />
    <div className="learning-grid"><LessonSidebar lessons={lessons} courseId={courseId} currentId={lesson.id} />
    <div className="lesson-panel"><LessonActivities onProgress={result=>{if(result.completed)resource.reload();}} lessonId={lesson.id} fallback={<div className="card"><LessonContent lesson={lesson} /></div>} />
    <section className="vocabulary-prompt"><h2>Thêm một từ mới</h2><p>Gặp một từ hữu ích? Lưu lại để ôn tập sau.</p><button className="secondary" onClick={() => setSavingWord(true)}>Lưu từ vựng</button>{message && <p className="success" role="status">{message}</p>}</section>
    {savingWord && <VocabularyForm lessonId={lesson.id} onClose={() => setSavingWord(false)} onSaved={() => { setSavingWord(false); setMessage('Đã lưu vào sổ tay từ vựng.'); }} />}
    {error && <p role="alert">{error}</p>}<LessonNavigation lesson={lesson} pending={pending} onComplete={complete} /></div></div></section>}</ResourceState>
}
