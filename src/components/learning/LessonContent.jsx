import { MediaPlayer } from './MediaPlayer'
export function LessonContent({ lesson }) {
  return <article className="lesson-content"><p className="eyebrow">Bài học {lesson.lessonOrder} · {lesson.estimatedDuration} phút</p>
    <h1>{lesson.title}</h1><p className="lead">{lesson.description}</p><MediaPlayer videoUrl={lesson.videoUrl} audioUrl={lesson.audioUrl} />
    <div className="lesson-text preserve-lines">{lesson.content}</div></article>
}
