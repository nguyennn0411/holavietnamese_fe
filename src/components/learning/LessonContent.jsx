import { BilingualText } from '@/components/common/BilingualText';
import { MediaPlayer } from './MediaPlayer'
export function LessonContent({ lesson }) {
  return <article className="lesson-content"><p className="eyebrow"><BilingualText>{"Bài học"}</BilingualText>{lesson.lessonOrder} · {lesson.estimatedDuration}<BilingualText>{"phút"}</BilingualText></p>
    <h1><BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} /></h1><p className="lead"><BilingualText vi={lesson.descriptionVi || lesson.description} en={lesson.description} /></p><MediaPlayer videoUrl={lesson.videoUrl} audioUrl={lesson.audioUrl} />
    <div className="lesson-text preserve-lines">{lesson.content}</div></article>
}
