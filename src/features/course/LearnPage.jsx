import { BilingualText } from "../shared/BilingualText";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import { courseService } from "../shared/services";
import {
  Badge,
  Empty,
  Pagination,
  Progress,
  State,
  levels,
  useLoad,
} from "../shared/ui";
export function CourseCard({ course, enrollment }) {
  const c = course;
  return (
    <article className="m2-course-card">
      <Link to={`/courses/${c.id}`} className="m2-cover">
        {c.thumbnailUrl ? (
          <img src={c.thumbnailUrl} alt="" />
        ) : (
          <>
            <span>Học tiếng Việt</span>
            <strong>Xin chào.</strong>
            <i>Every word opens a door.</i>
          </>
        )}
        <Badge>{c.level}</Badge>
      </Link>
      <div className="m2-card-body">
        <h3>
          <Link to={`/courses/${c.id}`}>
            <BilingualText
              vi={c.titleVi}
              en={c.titleEn || c.title}
              variant="title"
            />
          </Link>
        </h3>
        <p>
          <BilingualText
            vi={c.descriptionVi}
            en={c.descriptionEn || c.description}
            variant="caption"
          />
        </p>
        <div className="m2-meta">
          <span>
            <BookOpen size={15} />
            <BilingualText
              vi={(c.lessonCount ?? c.totalLessons ?? 0) + " bài học"}
              en={(c.lessonCount ?? c.totalLessons ?? 0) + " lessons"}
              variant="caption"
            />
          </span>
          <span>
            <Clock size={15} />
            <BilingualText
              vi={(c.estimatedMinutes ?? c.estimatedDuration ?? 0) + " phút"}
              en={(c.estimatedMinutes ?? c.estimatedDuration ?? 0) + " minutes"}
              variant="caption"
            />
          </span>
        </div>
        {enrollment && (
          <>
            <Progress value={enrollment.progress?.progressPercentage} />
            <small>
              {enrollment.status === "COMPLETED"
                ? "Completed"
                : `${enrollment.progress?.progressPercentage || 0}% complete`}
            </small>
          </>
        )}
        <Link className="m2-text-link" to={`/courses/${c.id}`}>
          <BilingualText
            vi={enrollment ? "Tiếp tục học" : "Bắt đầu học"}
            en={enrollment ? "Continue Learning" : "Start Learning"}
            variant="caption"
          />{" "}
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </article>
  );
}
export function LearnPage() {
  const [q, setQ] = useState(""),
    [level, setLevel] = useState(""),
    [page, setPage] = useState(0);
  const list = useLoad(
    () => courseService.getCourses({ q, level, page, size: 9 }),
    [q, level, page],
  );
  const mine = useLoad(
    () =>
      courseService.mine().catch((e) => {
        if (e.status === 401) return { content: [] };
        throw e;
      }),
    [],
  );
  const enrolled = mine.data?.content || [];
  return (
    <div className="m2">
      {mine.error && (
        <p role="alert" className="m2-error">
          <BilingualText
            vi="Không thể tải tiến độ học."
            en="Unable to load your progress."
          />
          <button onClick={mine.reload}>
            <BilingualText vi="Thử lại" en="Retry" variant="caption" />
          </button>
        </p>
      )}
      <section className="m2-hero">
        <div>
          <p className="eyebrow">HOLA VIETNAMESE</p>
          <h1>
            <BilingualText
              vi="Học tiếng Việt từng bước"
              en="Learn Vietnamese, one step at a time."
              variant="display"
            />
          </h1>
          <p>
            <BilingualText
              vi="Học từ vựng, luyện hội thoại và tự tin hơn mỗi ngày."
              en="Build vocabulary, practise conversations and grow more confident every day."
            />
          </p>
          <input
            className="m2-search"
            aria-label="Search courses"
            placeholder="Tìm khóa học / Search courses..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <div className="m2-hero-art" aria-hidden="true">
          <span>á à ả ã ạ</span>
          <strong>
            Việt
            <br />
            Nam.
          </strong>
          <small>LANGUAGE • CULTURE • CONNECTION</small>
        </div>
      </section>
      <div className="m2-tabs">
        <button
          className={!level ? "selected" : "secondary"}
          onClick={() => {
            setLevel("");
            setPage(0);
          }}
        >
          <BilingualText
            vi="Tất cả trình độ"
            en="All levels"
            variant="caption"
          />
        </button>
        {levels.map((l) => (
          <button
            key={l}
            className={level === l ? "selected" : "secondary"}
            onClick={() => {
              setLevel(l);
              setPage(0);
            }}
          >
            {l}
          </button>
        ))}
      </div>
      {enrolled.some((e) => e.status !== "COMPLETED") && (
        <section>
          <h2>
            <BilingualText
              vi="Tiếp tục học"
              en="Continue learning"
              variant="title"
            />
          </h2>
          <div className="m2-grid">
            {enrolled
              .filter((e) => e.status !== "COMPLETED")
              .slice(0, 3)
              .map((e) => (
                <CourseCard key={e.id} course={e} enrollment={e} />
              ))}
          </div>
        </section>
      )}
      <State resource={list}>
        {(data) => (
          <>
            {!q &&
              !level &&
              data.content.some(
                (c) => !enrolled.some((e) => e.id === c.id),
              ) && (
                <section>
                  <h2>
                    <BilingualText
                      vi="Khóa học dành cho bạn"
                      en="Recommended for your next step"
                      variant="title"
                    />
                  </h2>
                  <div className="m2-grid">
                    {data.content
                      .filter(
                        (c) =>
                          !enrolled.some((e) => e.id === c.id) &&
                          ["A0", "A1"].includes(c.level),
                      )
                      .slice(0, 3)
                      .map((c) => (
                        <CourseCard key={c.id} course={c} />
                      ))}
                  </div>
                </section>
              )}
            <div className="m2-section-title">
              <h2>
                <BilingualText
                  vi="Tất cả khóa học"
                  en="All courses"
                  variant="title"
                />
              </h2>
              <BilingualText
                vi={`${data.totalElements} khóa học để khám phá`}
                en={`${data.totalElements} courses to explore`}
                variant="caption"
              />
            </div>
            {data.content.length ? (
              <div className="m2-grid">
                {data.content.map((c) => (
                  <CourseCard
                    key={c.id}
                    course={c}
                    enrollment={enrolled.find((e) => e.id === c.id)}
                  />
                ))}
              </div>
            ) : (
              <Empty>
                <BilingualText
                  vi="Không có khóa học phù hợp bộ lọc."
                  en="No courses match your filters."
                />
              </Empty>
            )}
            <Pagination data={data} onChange={setPage} />
          </>
        )}
      </State>
    </div>
  );
}
