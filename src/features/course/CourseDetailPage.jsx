import { BilingualText } from "../shared/BilingualText";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ModuleAccordion, CourseProgress } from "./Curriculum";
import { courseService, progressService } from "../shared/services";
import { Badge, Progress, State, useLoad, useAction } from "../shared/ui";
export function CourseDetailPage() {
  const { id, courseId } = useParams(),
    key = id || courseId,
    navigate = useNavigate();
  const resource = useLoad(async () => {
    const c = await courseService.getCourse(key);
    return {
      ...c,
      progress: c.enrollment ? await progressService.course(key) : null,
    };
  }, [key]);
  const action = useAction(resource.reload);
  return (
    <div className="m2">
      <Link to="/learn"><BilingualText vi="← Tất cả khóa học" en="All courses" variant="caption" /></Link>
      <State resource={resource}>
        {(c) => {
          const lessons = c.modules.flatMap((m) => m.lessons);
          const next =
            lessons.find(
              (l) => l.id === c.progress?.lastAccessedLessonId && !l.isLocked,
            ) ||
            lessons.find(
              (l) => !l.isLocked && l.learningStatus !== "COMPLETED",
            ) ||
            lessons.find((l) => !l.isLocked);
          const go = () => {
            if (next) navigate(`/learn/${c.id}/lesson/${next.id}`);
          };
          return (
            <>
              <section className="m2-detail-hero">
                <Badge>{c.level}</Badge>
                <h1><BilingualText vi={c.titleVi} en={c.titleEn || c.title} variant="display" /></h1>
                <p><BilingualText vi={c.descriptionVi} en={c.descriptionEn || c.description} /></p>
                <span>
                  <BilingualText vi={`${c.totalLessons} bài học · ${c.estimatedMinutes} phút`} en={`${c.totalLessons} lessons · ${c.estimatedMinutes} minutes`} variant="caption" />
                </span>
              </section>
              <div className="m2-with-sidebar">
                <div>
                  <h2><BilingualText vi="Lộ trình học" en="Your learning journey" variant="title" /></h2>
                  {c.modules.map((m) => (
                    <ModuleAccordion
                      key={m.id}
                      module={m}
                      courseId={c.id}
                      enrolled={!!c.enrollment}
                      currentId={next?.id}
                    />
                  ))}
                </div>
                <aside className="m2-panel m2-sticky">
                  <h2><BilingualText vi="Tiến độ khóa học" en="Course progress" variant="heading" /></h2>
                  <CourseProgress
                    progress={c.progress}
                    totalLessons={c.totalLessons}
                  />
                  {action.error && <p role="alert">{action.error}</p>}
                  {c.enrollment ? (
                    <button disabled={!next} onClick={go}>
                      <BilingualText vi={c.enrollment.status === "COMPLETED" ? "Ôn tập khóa học" : "Tiếp tục học"} en={c.enrollment.status === "COMPLETED" ? "Review Course" : "Continue Learning"} variant="caption" />
                    </button>
                  ) : (
                    <button
                      disabled={action.busy}
                      onClick={() =>
                        action.run(async () => {
                          try {
                            await courseService.enroll(key);
                          } catch (e) {
                            if (e.status === 401) {
                              navigate("/login", {
                                state: { from: `/courses/${key}` },
                              });
                              return;
                            }
                            if (e.status !== 409) throw e;
                          }
                        })
                      }
                    >
                      <BilingualText vi="Bắt đầu học" en="Start Learning" variant="caption" />
                    </button>
                  )}
                  <p className="m2-muted">
                    <BilingualText vi="Tiến độ học của bạn được lưu tự động." en="Your learning progress is saved automatically." variant="caption" />
                  </p>
                </aside>
              </div>
            </>
          );
        }}
      </State>
    </div>
  );
}
