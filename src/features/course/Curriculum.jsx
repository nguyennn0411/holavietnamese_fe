import { BilingualText } from "../shared/BilingualText";
import { Link } from "react-router-dom";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { Badge, Progress } from "../shared/ui";

export function CourseProgress({ progress, totalLessons = 0 }) {
  return (
    <>
      <p>
        <BilingualText vi={`${progress?.completedLessons ?? 0} / ${progress?.totalLessons ?? totalLessons} bài học đã hoàn thành`} en={`${progress?.completedLessons ?? 0} / ${progress?.totalLessons ?? totalLessons} lessons completed`} variant="caption" />
      </p>
      <Progress value={progress?.progressPercentage ?? 0} />
      <strong>{progress?.progressPercentage ?? 0}%</strong>
    </>
  );
}
export function LessonItem({ lesson, courseId, enrolled, currentId }) {
  const completed = lesson.learningStatus === "COMPLETED";
  const current = Number(currentId) === Number(lesson.id);
  return (
    <div className={`m2-lesson-row ${current ? "m2-current" : ""}`}>
      {lesson.isLocked ? (
        <Lock size={18} className="lesson-locked" />
      ) : completed ? (
        <CheckCircle size={18} className="lesson-completed" />
      ) : (
        <PlayCircle size={18} className="lesson-ready" />
      )}
      <div>
        <BilingualText vi={lesson.titleVi} en={lesson.titleEn || lesson.title} variant="heading" />
        <small><BilingualText variant="caption"
          vi={(lesson.estimatedMinutes ?? 0) + ' phút · ' + (lesson.isLocked ? 'Đã khóa' : completed ? 'Hoàn thành' : lesson.learningStatus === 'IN_PROGRESS' ? 'Đang học' : 'Sẵn sàng')}
          en={(lesson.estimatedMinutes ?? 0) + ' minutes · ' + (lesson.isLocked ? 'Locked' : completed ? 'Completed' : lesson.learningStatus === 'IN_PROGRESS' ? 'In progress' : 'Ready')} />
        </small>
      </div>
      {enrolled && !lesson.isLocked && (
        <Link
          aria-current={current ? "page" : undefined}
          to={`/learn/${courseId}/lesson/${lesson.id}`}
        >
          <BilingualText vi="Mở bài →" en="Open" variant="caption" />
        </Link>
      )}
    </div>
  );
}
export function ModuleAccordion({ module, courseId, enrolled, currentId }) {
  return (
    <details className="m2-panel" open>
      <summary>
        <BilingualText vi={module.titleVi} en={module.titleEn || module.title} variant="heading" />{" "}
        <Badge><BilingualText vi={`${module.lessons.filter(l => l.learningStatus === "COMPLETED").length}/${module.lessons.length} bài học`} en={`${module.lessons.filter(l => l.learningStatus === "COMPLETED").length}/${module.lessons.length} lessons`} variant="caption" /></Badge>
      </summary>
      {module.lessons.map((lesson) => (
        <LessonItem
          key={lesson.id}
          lesson={lesson}
          courseId={courseId}
          enrolled={enrolled}
          currentId={currentId}
        />
      ))}
      {!module.lessons.length && <p>No published lessons yet.</p>}
    </details>
  );
}
