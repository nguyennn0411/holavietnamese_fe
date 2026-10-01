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
    <ProgressBar value={progress.progressPercentage} label={`${progress.completedLessons} / ${progress.totalLessons} lessons completed`} />
    <div className="learning-grid"><LessonSidebar lessons={lessons} courseId={courseId} currentId={lesson.id} />
    <div className="card lesson-panel"><LessonContent lesson={lesson} />
    <section className="vocabulary-prompt"><h2>Build your vocabulary</h2><p>Found a useful word? Keep it in your notebook.</p><button className="secondary" onClick={() => setSavingWord(true)}>Save Vocabulary</button>{message && <p className="success" role="status">{message}</p>}</section>
    {savingWord && <VocabularyForm lessonId={lesson.id} onClose={() => setSavingWord(false)} onSaved={() => { setSavingWord(false); setMessage('Saved to your vocabulary notebook.'); }} />}
    {error && <p role="alert">{error}</p>}<LessonNavigation lesson={lesson} pending={pending} onComplete={complete} /></div></div></section>}</ResourceState>
}
