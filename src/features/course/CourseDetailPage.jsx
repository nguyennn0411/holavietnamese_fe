import { BilingualText } from "../shared/BilingualText";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, Layers3 } from "lucide-react";
import { ModuleAccordion, CourseProgress } from "./Curriculum";
import { courseService, progressService } from "../shared/services";
import { Badge, Progress, State, useLoad, useAction } from "../shared/ui";

function normalizeOutcomes(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  if (value && typeof value === "object") return [value];
  return [];
}

function outcomeText(outcome) {
  if (outcome && typeof outcome === "object") {
    return {
      vi: outcome.vi || outcome.titleVi || outcome.title || outcome.text || "",
      en: outcome.en || outcome.titleEn || outcome.descriptionEn || "",
    };
  }
  return { vi: String(outcome || ""), en: "" };
}

export function CourseDetailPage() {
  const { id, courseId } = useParams();
  const key = id || courseId;
  const navigate = useNavigate();
  const resource = useLoad(async () => {
    const c = await courseService.getCourse(key);
    return { ...c, progress: c.enrollment ? await progressService.course(key) : null };
  }, [key]);
  const action = useAction(resource.reload);

  return (
    <div className="m2">
      <Link className="m2-text-link" to="/learn">
        <BilingualText vi="← Tất cả khóa học" en="All courses" variant="caption" />
      </Link>
      <State resource={resource}>
        {(c) => {
          const lessons = c.modules.flatMap((m) => m.lessons);
          const next = lessons.find((l) => l.id === c.progress?.lastAccessedLessonId && !l.isLocked)
            || lessons.find((l) => !l.isLocked && l.learningStatus !== "COMPLETED")
            || lessons.find((l) => !l.isLocked);
          const go = () => next && navigate(`/learn/${c.id}/lesson/${next.id}`);
          const outcomes = normalizeOutcomes(c.learningOutcomes ?? c.outcomes);
          return (
            <>
              <section className="m2-detail-hero">
                <div>
                  <Badge>{c.level}</Badge>
                  <h1><BilingualText vi={c.titleVi} en={c.titleEn || c.title} variant="display" /></h1>
                  <p><BilingualText vi={c.descriptionVi} en={c.descriptionEn || c.description} /></p>
                  <div className="m2-meta">
                    <span><Layers3 size={16} /><BilingualText vi={`${c.modules?.length || 0} mô-đun`} en={`${c.modules?.length || 0} modules`} variant="caption" /></span>
                    <span><BookOpen size={16} /><BilingualText vi={`${c.totalLessons || lessons.length} bài học`} en={`${c.totalLessons || lessons.length} lessons`} variant="caption" /></span>
                    <span><Clock size={16} /><BilingualText vi={`~${c.estimatedMinutes || 0} phút`} en={`~${c.estimatedMinutes || 0} minutes`} variant="caption" /></span>
                  </div>
                </div>
                <aside className="m2-panel" style={{ margin: 0 }}>
                  <BilingualText vi="Tóm tắt khóa học" en="Course summary" variant="heading" />
                  <CourseProgress progress={c.progress} totalLessons={c.totalLessons} />
                  {action.error && <p role="alert" className="m2-error">{action.error}</p>}
                  {c.enrollment ? (
                    <button disabled={!next} onClick={go}>
                      <BilingualText vi={c.enrollment.status === "COMPLETED" ? "Ôn tập khóa học" : "Tiếp tục học"} en={c.enrollment.status === "COMPLETED" ? "Review course" : "Continue learning"} variant="caption" />
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button disabled={action.busy} onClick={() => action.run(async () => {
                      try { await courseService.enroll(key); } catch (e) {
                        if (e.status === 401) { navigate("/login", { state: { from: `/courses/${key}` } }); return; }
                        if (e.status !== 409) throw e;
                      }
                    })}>
                      <BilingualText vi="Bắt đầu học" en="Start learning" variant="caption" /><ArrowRight size={16} />
                    </button>
                  )}
                  <p className="m2-muted"><BilingualText vi="Tiến độ được lưu tự động." en="Your progress is saved automatically." variant="caption" /></p>
                </aside>
              </section>

              <nav className="m2-tabs" aria-label="Course sections">
                <a href="#overview" className="selected"><BilingualText vi="Tổng quan" en="Overview" variant="caption" /></a>
                <a href="#outcomes"><BilingualText vi="Kết quả học tập" en="Outcomes" variant="caption" /></a>
                <a href="#modules"><BilingualText vi="Nội dung khóa học" en="Modules" variant="caption" /></a>
              </nav>

              <section id="overview">
                <div className="m2-section-title"><h2><BilingualText vi="Bạn sẽ học được gì?" en="What you'll learn" variant="sectionTitle" /></h2></div>
                {outcomes.length > 0 && <div className="m2-outcomes">{outcomes.map((outcome, index) => { const text = outcomeText(outcome); return <div className="m2-outcome" key={index}>✓ <BilingualText vi={text.vi} en={text.en} /></div>; })}</div>}
              </section>

              <section id="modules">
                <div className="m2-section-title"><h2><BilingualText vi="Nội dung khóa học" en="Course curriculum" variant="sectionTitle" /></h2><BilingualText vi={`${c.modules.length} mô-đun`} en={`${c.modules.length} modules`} variant="caption" /></div>
                {c.modules.map((m) => <ModuleAccordion key={m.id} module={m} courseId={c.id} enrolled={!!c.enrollment} currentId={next?.id} />)}
              </section>
            </>
          );
        }}
      </State>
    </div>
  );
}
