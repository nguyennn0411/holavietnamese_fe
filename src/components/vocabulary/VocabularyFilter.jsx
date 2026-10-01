export function VocabularyFilter({ courses, lessons, courseId, lessonId, onCourseChange, onLessonChange }) {
  return <><label>Course<select value={courseId} onChange={e => onCourseChange(e.target.value)}><option value="">All Courses</option>{courses.map(c => <option key={c.courseId} value={c.courseId}>{c.title}</option>)}</select></label>
    <label>Lesson<select value={lessonId} onChange={e => onLessonChange(e.target.value)}><option value="">All Lessons</option>{lessons.filter(l => !courseId || String(l.courseId) === courseId).map(l => <option key={l.id} value={l.id}>{l.title}</option>)}</select></label></>
}
