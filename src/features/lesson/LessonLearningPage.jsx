import { BilingualText } from "../shared/BilingualText";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { lessonService, courseService, get } from "../shared/services";
import { Badge, Progress, State, useAction, useLoad } from "../shared/ui";
import { LessonActivity } from "./ActivityRenderer";
import { Modal } from "@/components/common/Modal";
import { ModuleAccordion } from "../course/Curriculum";
export function LessonLearningPage({ preview = false }) {
  const params = useParams(),
    id = params.id || params.lessonId,
    [index, setIndex] = useState(0),
    [answer, setAnswer] = useState({}),
    [completion, setCompletion] = useState(null),
    [notice, setNotice] = useState(""),
    [progress, setProgress] = useState(null),
    [curriculum, setCurriculum] = useState(null);
  const resource = useLoad(async () => {
    if (preview) return get(`/admin/lessons/${id}/preview`);
    const lesson = await lessonService.getLesson(id);
    if (params.courseId && Number(params.courseId) !== Number(lesson.courseId))
      throw new Error("This lesson does not belong to the selected course.");
    await lessonService.start(id);
    return {
      ...lesson,
      curriculum: await courseService.getCourse(lesson.courseId),
    };
  }, [id, params.courseId, preview]);
  const action = useAction();
  useEffect(() => {
    setIndex(0);
    setAnswer({});
    setCompletion(null);
    setProgress(null);
    setCurriculum(null);
    setNotice("");
  }, [id]);
  useEffect(() => {
    const l = resource.data;
    if (!l || preview) return;
    setProgress(l.progress);
    setCurriculum(l.curriculum);
    if (l.progress?.completed) return;
    const done = new Set(
      (l.progress?.activities || [])
        .filter((a) => a.status === "COMPLETED")
        .map((a) => a.activityId),
    );
    const next = (l.activities || []).findIndex((a) => !done.has(a.id));
    setIndex(Math.max(0, next));
  }, [resource.data, preview]);
  return (
    <div className="m2 m2-learning">
      <State resource={resource}>
        {(l) => {
          const activities = l.activities || [],
            a = activities[index];
          if (!a)
            return (
              <div className="m2-empty">
                <h2>
                  <BilingualText
                    vi={l.titleVi}
                    en={l.titleEn || l.title}
                    variant="title"
                  />
                </h2>
                <p>{l.content || "No published activities yet."}</p>
                {!preview && l.content && (
                  <button
                    disabled={action.busy}
                    onClick={() =>
                      action.run(async () => {
                        await lessonService.complete(id);
                        resource.reload();
                      })
                    }
                  >
                    <BilingualText
                      vi="Hoàn thành bài học"
                      en="Complete lesson"
                      variant="caption"
                    />
                  </button>
                )}
                <Link to={"/courses/" + l.courseId}>Back to course</Link>
              </div>
            );
          const advance = async () => {
            if (preview) {
              setIndex(Math.min(index + 1, activities.length - 1));
              return;
            }
            const result = await lessonService.completeActivity(a.id, answer);
            if (!result.activityCompleted && a.isRequired) {
              setNotice(
                a.activityType === "QUIZ"
                  ? "Hãy vượt qua bài kiểm tra để tiếp tục. / Pass the quiz before continuing."
                  : "Chưa đúng. Hãy thử lại. / Not quite right. Try again.",
              );
              return;
            }
            setNotice("");
            setProgress(result);
            if (result.newlyCompleted) {
              setCompletion(result);
              setCurriculum(await courseService.getCourse(l.courseId));
            }
            if (index < activities.length - 1) {
              setIndex(index + 1);
              setAnswer({});
            }
          };
          return (
            <div className="m2-learning-shell">
              {!preview && (
                <aside
                  className="m2-course-navigation"
                  aria-label="Course navigation"
                >
                  <h2>
                    <BilingualText
                      vi={l.courseTitleVi}
                      en={l.courseTitleEn || l.courseTitle}
                      variant="heading"
                    />
                  </h2>
                  <details className="m2-curriculum-toggle">
                    <summary>
                      <BilingualText
                        vi="Nội dung khóa học"
                        en="Course curriculum"
                        variant="caption"
                      />
                    </summary>
                    {(curriculum || l.curriculum)?.modules.map((module) => (
                      <ModuleAccordion
                        key={module.id}
                        module={module}
                        courseId={l.courseId}
                        enrolled
                        currentId={l.id}
                      />
                    ))}
                  </details>
                </aside>
              )}
              <section className="m2-learning-content">
                <header className="m2-lesson-header">
                  <Link
                    to={
                      preview
                        ? `/admin/lessons/${id}`
                        : `/courses/${l.courseId}`
                    }
                  >
                    <BilingualText
                      vi={preview ? "← Về trình biên tập" : "← Về khóa học"}
                      en={preview ? "Back to builder" : "Back to Course"}
                      variant="caption"
                    />
                  </Link>
                  {preview && <Badge>Preview · no progress saved</Badge>}
                  <p>
                    <BilingualText
                      vi={l.courseTitleVi}
                      en={l.courseTitleEn || l.courseTitle}
                      variant="caption"
                    />
                    <br />
                    <BilingualText
                      vi={l.moduleTitleVi}
                      en={l.moduleTitleEn || l.moduleTitle}
                      variant="caption"
                    />
                  </p>
                  <div className="row">
                    <h2>
                      <BilingualText
                        vi={l.titleVi}
                        en={l.titleEn || l.title}
                        variant="title"
                      />
                    </h2>
                    <span>
                      <BilingualText
                        vi={`${index + 1} / ${activities.length} hoạt động`}
                        en={`${index + 1} / ${activities.length} activities`}
                        variant="caption"
                      />
                    </span>
                  </div>
                  <p>
                    <BilingualText
                      vi={l.descriptionVi}
                      en={l.descriptionEn || l.description}
                    />
                  </p>
                  {(l.learningObjectiveVi ||
                    l.learningObjectiveEn ||
                    l.learningObjective) && (
                    <p>
                      <BilingualText
                        vi="Mục tiêu bài học"
                        en="Learning objective"
                        variant="heading"
                      />
                      <br />
                      <BilingualText
                        vi={l.learningObjectiveVi}
                        en={l.learningObjectiveEn || l.learningObjective}
                      />
                    </p>
                  )}
                  <p>
                    <BilingualText
                      vi={`${l.estimatedMinutes} phút · Hoàn thành ${progress?.progressPercent ?? 0}%`}
                      en={`${l.estimatedMinutes} minutes · ${progress?.progressPercent ?? 0}% complete`}
                      variant="caption"
                    />
                  </p>
                  <Progress
                    value={
                      preview
                        ? ((index + 1) * 100) / activities.length
                        : progress?.progressPercent || 0
                    }
                  />
                </header>
                {!preview && progress?.completed && (
                  <div className="m2-lesson-complete" role="status">
                    <BilingualText
                      vi="Bạn đã hoàn thành bài học!"
                      en="Lesson completed!"
                      variant="title"
                    />
                    {progress.nextLesson && (
                      <Link
                        className="button"
                        to={
                          "/learn/" +
                          l.courseId +
                          "/lesson/" +
                          progress.nextLesson.id
                        }
                      >
                        <BilingualText
                          vi="Bài học tiếp theo →"
                          en="Next lesson"
                          variant="caption"
                        />
                      </Link>
                    )}
                  </div>
                )}
                <LessonActivity
                  key={a.id}
                  activity={a}
                  answer={answer}
                  onAnswer={setAnswer}
                  preview={preview}
                />
                {(notice || action.error) && (
                  <p role="alert" className="m2-error"><BilingualText vi={(action.error || notice).split(' / ')[0]} en={(action.error || notice).split(' / ')[1]} /></p>
                )}
                <nav className="m2-lesson-nav">
                  <button
                    className="secondary"
                    disabled={index === 0 || action.busy}
                    onClick={() => {
                      setIndex(index - 1);
                      setAnswer({});
                      setNotice("");
                    }}
                  >
                    <BilingualText
                      vi="← Trước"
                      en="Previous"
                      variant="caption"
                    />
                  </button>
                  <span>
                    <BilingualText
                      vi={
                        a.isRequired
                          ? "Hoạt động bắt buộc"
                          : "Hoạt động tùy chọn"
                      }
                      en={
                        a.isRequired ? "Required activity" : "Optional activity"
                      }
                      variant="caption"
                    />
                  </span>
                  {!a.isRequired &&
                    (index < activities.length - 1 ? (
                      <button
                        className="secondary"
                        disabled={action.busy}
                        onClick={() => {
                          setIndex(index + 1);
                          setAnswer({});
                          setNotice("");
                        }}
                      >
                        <BilingualText vi="Bỏ qua hoạt động tùy chọn" en="Skip optional" variant="caption" />
                      </button>
                    ) : (
                      <Link to={`/courses/${l.courseId}`}>
                        <BilingualText vi="Về khóa học" en="Return to course" variant="caption" />
                      </Link>
                    ))}
                  <button
                    disabled={
                      action.busy ||
                      (preview && index === activities.length - 1)
                    }
                    onClick={() => action.run(advance)}
                  >
                    <BilingualText
                      vi={
                        action.busy
                          ? "Đang lưu…"
                          : index === activities.length - 1
                            ? "Hoàn thành bài học"
                            : "Tiếp tục →"
                      }
                      en={
                        action.busy
                          ? "Saving…"
                          : index === activities.length - 1
                            ? "Finish lesson"
                            : "Continue"
                      }
                      variant="caption"
                    />
                  </button>
                </nav>
                {completion && (
                  <Modal
                    title={<BilingualText vi={completion.courseCompleted ? "Đã hoàn thành khóa học!" : "Đã hoàn thành bài học!"} en={completion.courseCompleted ? "Course complete!" : "Lesson complete!"} variant="title" />}
                    onClose={() => setCompletion(null)}
                  >
                    <p><BilingualText vi={`Bạn đã hoàn thành: ${l.titleVi}.`} en={`You completed: ${l.titleEn || l.title}.`} /></p>
                    <Progress
                      value={completion.courseProgress?.progressPercentage}
                    />
                    <p>
                      <BilingualText vi={`${completion.courseProgress?.completedLessons} / ${completion.courseProgress?.totalLessons} bài đã hoàn thành`} en={`${completion.courseProgress?.completedLessons} / ${completion.courseProgress?.totalLessons} lessons completed`} />
                    </p>
                    <div className="actions">
                      {completion.nextLesson && (
                        <Link
                          className="button"
                          to={`/lesson/${completion.nextLesson.id}`}
                        >
                          <BilingualText vi={`Tiếp theo: ${completion.nextLesson.titleVi}`} en={`Next: ${completion.nextLesson.titleEn || completion.nextLesson.title}`} variant="caption" />
                        </Link>
                      )}
                      <Link to={`/courses/${l.courseId}`}><BilingualText vi="Về khóa học" en="Back to Course" variant="caption" /></Link>
                      {completion.courseCompleted && (
                        <>
                          <Link to="/progress"><BilingualText vi="Xem tiến độ" en="View Progress" variant="caption" /></Link>
                          <Link to="/learn"><BilingualText vi="Khám phá khóa học tiếp theo" en="Explore Next Course" variant="caption" /></Link>
                        </>
                      )}
                    </div>
                  </Modal>
                )}
              </section>
            </div>
          );
        }}
      </State>
    </div>
  );
}
