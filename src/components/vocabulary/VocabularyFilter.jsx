import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
export function VocabularyFilter({ courses, lessons, courseId, lessonId, onCourseChange, onLessonChange }) {
  return <><label><BilingualText>{"Khóa học"}</BilingualText><select value={courseId} onChange={e => onCourseChange(e.target.value)}><option value="">{bilingualLabel("Tất cả khóa học")}</option>{courses.map(c => <option key={c.courseId} value={c.courseId}>{c.title}</option>)}</select></label>
    <label><BilingualText>{"Bài học"}</BilingualText><select value={lessonId} onChange={e => onLessonChange(e.target.value)}><option value="">{bilingualLabel("Tất cả bài học")}</option>{lessons.filter(l => !courseId || String(l.courseId) === courseId).map(l => <option key={l.id} value={l.id}>{l.title}</option>)}</select></label></>
}
