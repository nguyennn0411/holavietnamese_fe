import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { adminService, send, get } from "../shared/services";
import {
  AdminNav,
  Badge,
  Empty,
  Field,
  Pagination,
  Select,
  State,
  levels,
  statuses,
  useAction,
  useLoad,
} from "../shared/ui";
import { ContentEditor, EntitySelect } from "./ContentEditor";
import { Modal } from "@/components/common/Modal";
import { LessonActivity as ActivityRenderer } from "../lesson/ActivityRenderer";
import {
  QuestionRenderer,
  answerText,
  questionTypes,
} from "../quiz/QuestionRenderer";
const names = {
  courses: "Courses",
  lessons: "Lessons",
  grammar: "Grammar library",
  questions: "Question Bank",
  quizzes: "Quizzes",
  "quiz-attempts": "Quiz Attempts",
};
export function AdminListPage({ type }) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ page: 0, q: "", status: "" }),
    [editor, setEditor] = useState(null),
    [history, setHistory] = useState(null),
    [parent, setParent] = useState(null);
  const key = JSON.stringify(filters);
  const resource = useLoad(() => adminService.list(type, filters), [type, key]);
  const action = useAction(resource.reload);
  const filter = (k, v) => setFilters({ ...filters, [k]: v, page: 0 });
  const edit = (row) =>
    ["courses", "quizzes"].includes(type)
      ? navigate(`/admin/${type}/${row.id}/edit`)
      : action.run(async () => setEditor(await adminService.get(type, row.id)));
  return (
    <div className="m2 m2-admin">
      <AdminNav />
      <div className="m2-section-title">
        <div>
          <p className="eyebrow">CONTENT STUDIO</p>
          <h1>{names[type]}</h1>
        </div>
        {type !== "quiz-attempts" && (
          <button
            onClick={() =>
              ["courses", "quizzes"].includes(type)
                ? navigate(`/admin/${type}/new`)
                : setEditor({})
            }
          >
            + Create{" "}
            {type === "grammar"
              ? "topic"
              : type === "quizzes"
                ? "quiz"
                : type.slice(0, -1)}
          </button>
        )}
      </div>
      <div className="m2-filters">
        <Field label="Search">
          <input
            placeholder={`Search ${names[type].toLowerCase()}...`}
            value={filters.q}
            onChange={(e) => filter("q", e.target.value)}
          />
        </Field>
        <Select
          label="Status"
          values={
            type === "quiz-attempts"
              ? ["IN_PROGRESS", "SUBMITTED", "ABANDONED"]
              : statuses
          }
          value={filters.status}
          onChange={(v) => filter("status", v)}
        />
        {["courses", "grammar"].includes(type) && (
          <Select
            label="Level"
            values={levels}
            value={filters.level}
            onChange={(v) => filter("level", v)}
          />
        )}{" "}
        {type === "questions" && (
          <>
            <Select
              label="Type"
              values={questionTypes}
              value={filters.questionType}
              onChange={(v) => filter("questionType", v)}
            />
            <Select
              label="Difficulty"
              values={["EASY", "MEDIUM", "HARD"]}
              value={filters.difficulty}
              onChange={(v) => filter("difficulty", v)}
            />
            <Field label="Topic">
              <input
                value={filters.topic || ""}
                onChange={(e) => filter("topic", e.target.value)}
              />
            </Field>
          </>
        )}
        {type === "lessons" && (
          <>
            <EntitySelect
              type="courses"
              label="Course"
              value={filters.courseId}
              onChange={(v) => filter("courseId", v)}
            />
            <Field label="Module ID">
              <input
                type="number"
                value={filters.moduleId || ""}
                onChange={(e) => filter("moduleId", e.target.value)}
              />
            </Field>
            <Select
              label="Lesson type"
              values={[
                "NORMAL",
                "VOCABULARY",
                "GRAMMAR",
                "CONVERSATION",
                "CULTURE",
                "REVIEW",
              ]}
              value={filters.lessonType}
              onChange={(v) => filter("lessonType", v)}
            />
          </>
        )}
        {type === "quizzes" && (
          <Select
            label="Quiz type"
            values={["LESSON", "COURSE", "PLACEMENT", "PRACTICE"]}
            value={filters.quizType}
            onChange={(v) => filter("quizType", v)}
          />
        )}{" "}
        {type === "quiz-attempts" && (
          <>
            <EntitySelect
              type="quizzes"
              label="Quiz"
              value={filters.quizId}
              onChange={(v) => filter("quizId", v)}
            />
            <Select
              label="Result"
              values={[
                { value: "1", label: "Passed" },
                { value: "0", label: "Not passed" },
              ]}
              value={filters.passed}
              onChange={(v) => filter("passed", v)}
            />
            {["from", "to"].map((k) => (
              <Field key={k} label={k}>
                <input
                  type="date"
                  value={filters[k] || ""}
                  onChange={(e) => filter(k, e.target.value)}
                />
              </Field>
            ))}
          </>
        )}
      </div>
      {action.error && (
        <p role="alert" className="m2-error">
          {action.error}
        </p>
      )}
      <State resource={resource}>
        {(data) => (
          <>
            {data.content.length ? (
              <div className="m2-table-wrap">
                <table className="m2-table">
                  <thead>
                    <tr>
                      <th>
                        {type === "quiz-attempts"
                          ? "Learner / Quiz"
                          : "Content"}
                      </th>
                      <th>Details</th>
                      <th>Status</th>
                      <th>Updated / Started</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.content.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <strong>
                            {row.title || row.prompt || row.quizTitle}
                          </strong>
                          <small>
                            {row.code || row.learner || `#${row.id}`}
                          </small>
                        </td>
                        <td>
                          {type === "courses"
                            ? `${row.level} · ${row.moduleCount} modules · ${row.lessonCount} lessons`
                            : type === "lessons"
                              ? `${row.courseTitle} / ${row.moduleTitle || "Ungrouped"} · ${row.activityCount} activities`
                              : type === "grammar"
                                ? `${row.level} · ${row.exampleCount} examples`
                                : type === "questions"
                                  ? `${row.questionType} · ${row.difficulty} · v${row.currentVersion}`
                                  : type === "quizzes"
                                    ? `${row.questionCount} questions · Pass ${row.passingScore}% · ${row.attemptCount} attempts`
                                    : row.status === "SUBMITTED"
                                      ? `${row.percentage}% · ${row.passed ? "Passed" : "Not passed"}`
                                      : "Not scored"}
                        </td>
                        <td>
                          <Badge>{row.status || row.publicationStatus}</Badge>
                        </td>
                        <td>
                          {String(row.updatedAt || row.startedAt || "")
                            .slice(0, 19)
                            .replace("T", " ")}
                        </td>
                        <td>
                          <div className="m2-table-actions">
                            {type === "quiz-attempts" ? (
                              <button
                                className="secondary"
                                onClick={() =>
                                  action.run(async () =>
                                    setHistory(
                                      await adminService.get(type, row.id),
                                    ),
                                  )
                                }
                              >
                                View
                              </button>
                            ) : (
                              <>
                                <button
                                  className="secondary"
                                  onClick={() => edit(row)}
                                >
                                  Edit
                                </button>
                                {["courses", "lessons", "quizzes"].includes(
                                  type,
                                ) && (
                                  <Link to={`/admin/${type}/${row.id}`}>
                                    Builder →
                                  </Link>
                                )}
                                {type === "lessons" && (
                                  <Link to={`/admin/lessons/${row.id}/preview`}>
                                    Preview
                                  </Link>
                                )}
                                {["courses", "lessons", "quizzes"].includes(
                                  type,
                                ) && (
                                  <button
                                    className="secondary"
                                    disabled={action.busy}
                                    onClick={() =>
                                      action.run(() =>
                                        adminService.remove(type, row.id),
                                      )
                                    }
                                  >
                                    Delete
                                  </button>
                                )}
                                {type !== "questions" && (
                                  <button
                                    className="secondary"
                                    disabled={action.busy}
                                    onClick={() =>
                                      action.run(() =>
                                        adminService.status(
                                          type,
                                          row.id,
                                          "DRAFT",
                                        ),
                                      )
                                    }
                                  >
                                    Unpublish
                                  </button>
                                )}
                                {type === "questions" ? (
                                  <button
                                    className="secondary"
                                    onClick={() =>
                                      action.run(async () =>
                                        setHistory(
                                          await adminService.get(type, row.id),
                                        ),
                                      )
                                    }
                                  >
                                    Version history
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      className="secondary"
                                      disabled={action.busy}
                                      onClick={() =>
                                        action.run(() =>
                                          adminService.status(
                                            type,
                                            row.id,
                                            "PUBLISHED",
                                          ),
                                        )
                                      }
                                    >
                                      Publish
                                    </button>
                                    <button
                                      className="secondary"
                                      disabled={action.busy}
                                      onClick={() =>
                                        action.run(() =>
                                          adminService.status(
                                            type,
                                            row.id,
                                            "ARCHIVED",
                                          ),
                                        )
                                      }
                                    >
                                      Archive
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty>No content matches these filters.</Empty>
            )}
            <Pagination
              data={data}
              onChange={(page) => setFilters({ ...filters, page })}
            />
          </>
        )}
      </State>
      {editor && (
        <Modal
          title={`${editor.id ? "Edit" : "Create"} ${names[type]}`}
          onClose={() => setEditor(null)}
        >
          {type === "lessons" && !editor.id && (
            <Field label="Module ID">
              <input
                type="number"
                min="1"
                value={parent || ""}
                onChange={(e) => setParent(Number(e.target.value))}
              />
            </Field>
          )}
          <ContentEditor
            type={type}
            initial={editor}
            onCancel={() => setEditor(null)}
            onSave={async (data) => {
              if (type === "lessons" && !editor.id) {
                if (!parent)
                  throw new Error("Enter a module ID from the Course Builder.");
                await send(`/admin/modules/${parent}/lessons`, data);
              } else await adminService.saveSettings(type, editor.id, data);
              setEditor(null);
              resource.reload();
            }}
          />
        </Modal>
      )}
      {history && (
        <Modal
          title={
            type === "questions"
              ? "Immutable version history"
              : "Attempt review"
          }
          onClose={() => setHistory(null)}
        >
          {type === "questions" ? (
            history.versions.map((v) => (
              <article className="m2-panel" key={v.id}>
                <Badge>v{v.versionNumber}</Badge>
                <h3>{v.prompt}</h3>
                <QuestionRenderer
                  question={v}
                  value={{}}
                  onChange={() => {}}
                  disabled
                />
                <p>
                  Correct answer: {answerText(v.correctAnswerJson, v.options)}
                </p>
                <p>{v.explanation}</p>
              </article>
            ))
          ) : (
            <>
              <h3>
                {history.quizTitle} ·{" "}
                {history.percentage == null
                  ? "Not scored"
                  : `${history.percentage}%`}
              </h3>
              {history.questions.map((q) => (
                <article className="m2-panel" key={q.id}>
                  <h3>{q.prompt}</h3>
                  <p>
                    v{q.versionNumber} · Answer:{" "}
                    {answerText(q.answer, q.options)}
                  </p>
                  <p>Correct: {answerText(q.correctAnswer, q.options)}</p>
                  <p>
                    {q.score ?? "—"} / {q.points}
                  </p>
                </article>
              ))}
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
function MoveButtons({ items, index, onMove, busy }) {
  return (
    <>
      <button
        className="secondary"
        title="Move up"
        disabled={busy || index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        ↑
      </button>
      <button
        className="secondary"
        title="Move down"
        disabled={busy || index === items.length - 1}
        onClick={() => onMove(index, index + 1)}
      >
        ↓
      </button>
    </>
  );
}
const moved = (items, from, to) => {
  const ids = items.map((x) => x.id);
  [ids[from], ids[to]] = [ids[to], ids[from]];
  return ids;
};
export function AdminCourseBuilderPage() {
  const { id } = useParams(),
    resource = useLoad(() => adminService.get("courses", id), [id]),
    action = useAction(resource.reload),
    [editor, setEditor] = useState(null);
  return (
    <div className="m2 m2-admin">
      <AdminNav />
      <State resource={resource}>
        {(c) => (
          <>
            <div className="m2-section-title">
              <div>
                <Badge>{c.status}</Badge>
                <h1>{c.title}</h1>
                <p>
                  {c.level} · {c.totalLessons} published lessons
                </p>
              </div>
              <button
                onClick={() => setEditor({ type: "courses", initial: c })}
              >
                Edit Course
              </button>
            </div>
            <p className="m2-prewrap">{c.learningOutcomes}</p>
            <div className="actions">
              <button
                onClick={() =>
                  setEditor({ type: "modules", parent: id, initial: {} })
                }
              >
                + Add Module
              </button>
              <button
                className="secondary"
                onClick={() =>
                  action.run(() =>
                    adminService.status("courses", id, "PUBLISHED"),
                  )
                }
              >
                Publish Course
              </button>
              <button
                className="secondary"
                onClick={() =>
                  action.run(() =>
                    adminService.status("courses", id, "ARCHIVED"),
                  )
                }
              >
                Archive
              </button>
              <Link to={`/courses/${id}`}>Learner view</Link>
            </div>
            <h2>Curriculum Builder</h2>
            {c.modules.map((m, i) => (
              <section key={m.id} className="m2-panel">
                <div className="m2-section-title">
                  <h2>
                    {i + 1}. {m.title}
                  </h2>
                  {m.id !== 0 && (
                    <div className="actions">
                      <MoveButtons
                        items={c.modules.filter((m) => m.id !== 0)}
                        index={i}
                        busy={action.busy}
                        onMove={(a, b) =>
                          action.run(() =>
                            adminService.reorder(
                              `courses/${id}/modules`,
                              moved(
                                c.modules.filter((m) => m.id !== 0),
                                a,
                                b,
                              ),
                            ),
                          )
                        }
                      />
                      <button
                        className="secondary"
                        onClick={() =>
                          setEditor({ type: "modules", initial: m })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="secondary"
                        onClick={() =>
                          action.run(() => adminService.remove("modules", m.id))
                        }
                        disabled={m.lessons.length > 0}
                      >
                        Delete empty module
                      </button>
                      <button
                        onClick={() =>
                          setEditor({
                            type: "lessons",
                            parent: m.id,
                            initial: {},
                          })
                        }
                      >
                        + Lesson
                      </button>
                    </div>
                  )}
                </div>
                {m.lessons.map((l, n) => (
                  <div className="m2-lesson-row" key={l.id}>
                    <div>
                      <strong>{l.title}</strong>
                      <small>
                        {l.lessonType} · {l.estimatedMinutes} min · #{l.id}
                      </small>
                    </div>
                    <Badge>{l.status || "PUBLISHED"}</Badge>
                    <MoveButtons
                      items={m.lessons}
                      index={n}
                      busy={action.busy}
                      onMove={(a, b) =>
                        action.run(() =>
                          adminService.reorder(
                            `modules/${m.id}/lessons`,
                            moved(m.lessons, a, b),
                          ),
                        )
                      }
                    />
                    <Link to={`/admin/lessons/${l.id}/edit`}>
                      Edit / Builder →
                    </Link>
                    <button
                      className="secondary"
                      disabled={action.busy}
                      onClick={() =>
                        action.run(() => adminService.remove("lessons", l.id))
                      }
                    >
                      Delete
                    </button>
                    <Link to={`/admin/lessons/${l.id}/preview`}>Preview</Link>
                    <button
                      className="secondary"
                      onClick={() =>
                        action.run(() =>
                          adminService.status("lessons", l.id, "ARCHIVED"),
                        )
                      }
                    >
                      Archive
                    </button>
                  </div>
                ))}
              </section>
            ))}
            {action.error && (
              <p role="alert" className="m2-error">
                {action.error}
              </p>
            )}
          </>
        )}
      </State>
      {editor && (
        <Modal title={`Edit ${editor.type}`} onClose={() => setEditor(null)}>
          <ContentEditor
            type={editor.type}
            initial={editor.initial}
            onCancel={() => setEditor(null)}
            onSave={async (data) => {
              if (editor.parent)
                await send(
                  `/admin/${editor.type === "modules" ? "courses" : "modules"}/${editor.parent}/${editor.type}`,
                  data,
                );
              else
                await adminService.saveSettings(
                  editor.type,
                  editor.initial.id,
                  data,
                );
              setEditor(null);
              resource.reload();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
export function AdminLessonBuilderPage() {
  const params = useParams(),
    id = params.id || params.lessonId;
  const resource = useLoad(() => adminService.get("lessons", id), [id]);
  const action = useAction(resource.reload);
  const [editor, setEditor] = useState(null);
  return (
    <div className="m2 m2-admin">
      <AdminNav />
      <State resource={resource}>
        {(l) => (
          <>
            <Link to={`/admin/courses/${l.courseId}/builder`}>
              ← Course Builder
            </Link>
            <div className="m2-section-title">
              <div>
                <Badge>{l.publicationStatus}</Badge>
                <h1>{l.title}</h1>
                <p>
                  {l.courseTitle} / {l.moduleTitle}
                </p>
              </div>
              <Link to={`/admin/lessons/${id}/preview`}>Preview lesson</Link>
            </div>
            <div className="actions">
              <button
                onClick={() => setEditor({ type: "lessons", initial: l })}
              >
                Edit lesson settings
              </button>
              {["PUBLISHED", "DRAFT", "ARCHIVED"].map((status) => (
                <button
                  className="secondary"
                  key={status}
                  disabled={action.busy}
                  onClick={() =>
                    action.run(() => adminService.status("lessons", id, status))
                  }
                >
                  {status === "PUBLISHED"
                    ? "Publish"
                    : status === "DRAFT"
                      ? "Unpublish"
                      : "Archive"}
                </button>
              ))}
            </div>
            <div className="m2-editor-layout">
              <aside className="m2-panel">
                <h2>Activities</h2>
                <button
                  onClick={() => setEditor({ type: "activities", initial: {} })}
                >
                  + Add activity
                </button>
                {!l.activities.length && <Empty>Add the first activity.</Empty>}
                {l.activities.map((a, i) => (
                  <div className="m2-activity-item" key={a.id}>
                    <button
                      className="secondary"
                      onClick={() =>
                        setEditor({ type: "activities", initial: a })
                      }
                    >
                      {i + 1}. {a.title}
                    </button>
                    <small>
                      {a.activityType} · {a.status}
                    </small>
                    <div className="actions">
                      <MoveButtons
                        items={l.activities}
                        index={i}
                        busy={action.busy}
                        onMove={(from, to) =>
                          action.run(() =>
                            adminService.reorder(
                              `lessons/${id}/activities`,
                              moved(l.activities, from, to),
                            ),
                          )
                        }
                      />
                      <button
                        className="secondary"
                        disabled={action.busy}
                        onClick={() =>
                          action.run(async () => {
                            await adminService.remove("activities", a.id);
                            if (editor?.initial.id === a.id) setEditor(null);
                          })
                        }
                      >
                        Delete / Archive
                      </button>
                    </div>
                  </div>
                ))}
              </aside>
              <section className="m2-panel">
                {editor ? (
                  <ContentEditor
                    key={editor.type + "-" + (editor.initial.id || "new")}
                    type={editor.type}
                    initial={editor.initial}
                    onCancel={() => setEditor(null)}
                    onSave={async (data) => {
                      if (editor.type === "activities" && !editor.initial.id)
                        await send(`/admin/lessons/${id}/activities`, data);
                      else
                        await adminService.saveSettings(
                          editor.type,
                          editor.initial.id,
                          data,
                        );
                      setEditor(null);
                      resource.reload();
                    }}
                  />
                ) : (
                  <Empty>Select an activity to edit its content.</Empty>
                )}
              </section>
            </div>
          </>
        )}
      </State>
      {action.error && (
        <p role="alert" className="m2-error">
          {action.error}
        </p>
      )}
    </div>
  );
}
export function AdminQuizDetailPage() {
  const [questionEditor, setQuestionEditor] = useState(null);
  const [dragged, setDragged] = useState(null);
  const { id } = useParams(),
    resource = useLoad(() => adminService.get("quizzes", id), [id]),
    stats = useLoad(() => get(`/admin/quizzes/${id}/analytics`), [id]),
    action = useAction(() => {
      resource.reload();
      stats.reload();
    }),
    [editor, setEditor] = useState(false),
    [question, setQuestion] = useState(null),
    [points, setPoints] = useState(10),
    [preview, setPreview] = useState(null);
  return (
    <div className="m2 m2-admin">
      <AdminNav />
      <State resource={resource}>
        {(q) => (
          <>
            <div className="m2-section-title">
              <div>
                <Badge>{q.status}</Badge>
                <h1>{q.title}</h1>
                <p>
                  {q.quizType} · Pass {q.passingScore}% ·{" "}
                  {q.maxAttempts || "Unlimited"} attempts ·{" "}
                  {q.timeLimitMinutes || "Unlimited"} minutes · v{q.version}
                </p>
              </div>
              <button onClick={() => setEditor(true)}>Edit settings</button>
            </div>
            <div className="actions">
              <button
                onClick={() =>
                  action.run(() =>
                    adminService.status("quizzes", id, "PUBLISHED"),
                  )
                }
              >
                Publish Quiz
              </button>
              <button
                className="secondary"
                disabled={action.busy || q.status !== "PUBLISHED"}
                onClick={() =>
                  action.run(() => adminService.status("quizzes", id, "DRAFT"))
                }
              >
                Unpublish Quiz
              </button>
              <button
                className="secondary"
                onClick={() =>
                  action.run(() => adminService.status("quizzes", id, "REVIEW"))
                }
              >
                Send to review
              </button>
              <button
                className="secondary"
                onClick={() =>
                  action.run(() =>
                    adminService.status("quizzes", id, "ARCHIVED"),
                  )
                }
              >
                Archive
              </button>
              <button
                className="secondary"
                onClick={() =>
                  action.run(async () =>
                    setPreview(await get(`/admin/quizzes/${id}/preview`)),
                  )
                }
              >
                Preview
              </button>
            </div>
            <section className="m2-panel">
              <h2>Question Builder</h2>
              <button
                onClick={() => {
                  setQuestionEditor({});
                  setPoints(10);
                }}
              >
                + Create question
              </button>
              <p>Drag questions to reorder, or use the arrow buttons.</p>
              <p>
                {q.questions.length} questions ·{" "}
                {q.questions.reduce((s, x) => s + Number(x.points), 0)} total
                points
              </p>
              {q.questions.map((question, i) => (
                <div
                  className="m2-lesson-row"
                  key={question.questionId}
                  draggable={!action.busy}
                  onDragStart={(e) => {
                    setDragged(i);
                    e.dataTransfer.setData(
                      "text/plain",
                      String(question.questionId),
                    );
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={() => setDragged(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragged == null || dragged === i || action.busy) return;
                    const ids = q.questions.map((x) => x.questionId),
                      [item] = ids.splice(dragged, 1);
                    ids.splice(i, 0, item);
                    setDragged(null);
                    action.run(() =>
                      adminService.reorder(`quizzes/${id}/questions`, ids),
                    );
                  }}
                >
                  <span>
                    {i + 1}. {question.prompt}
                  </span>
                  <Badge>{question.questionType}</Badge>
                  <button
                    className="secondary"
                    onClick={() =>
                      action.run(async () => {
                        setQuestionEditor(
                          await adminService.get(
                            "questions",
                            question.questionId,
                          ),
                        );
                        setPoints(question.points);
                      })
                    }
                  >
                    Edit question
                  </button>
                  <span>{question.points} points</span>
                  <MoveButtons
                    items={q.questions}
                    index={i}
                    busy={action.busy}
                    onMove={(a, b) => {
                      const items = q.questions.map((x) => ({
                        id: x.questionId,
                      }));
                      action.run(() =>
                        adminService.reorder(
                          `quizzes/${id}/questions`,
                          moved(items, a, b),
                        ),
                      );
                    }}
                  />
                  <button
                    className="secondary"
                    onClick={() => {
                      setQuestion(question.questionId);
                      setPoints(question.points);
                    }}
                  >
                    Change points
                  </button>
                  <button
                    className="secondary"
                    onClick={() =>
                      action.run(() =>
                        send(
                          `/admin/quizzes/${id}/questions/${question.questionId}`,
                          undefined,
                          "DELETE",
                        ),
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="m2-filters">
                <EntitySelect
                  type="questions"
                  label="Question Bank"
                  value={question}
                  onChange={setQuestion}
                />
                <Field label="Points">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                  />
                </Field>
                <button
                  disabled={!question || action.busy}
                  onClick={() =>
                    action.run(() =>
                      send(`/admin/quizzes/${id}/questions`, {
                        questionId: question,
                        points,
                      }),
                    )
                  }
                >
                  Add / update question
                </button>
              </div>
            </section>
            {editor && (
              <Modal title="Quiz settings" onClose={() => setEditor(false)}>
                <ContentEditor
                  type="quizzes"
                  initial={q}
                  onCancel={() => setEditor(false)}
                  onSave={async (data) => {
                    await adminService.saveSettings("quizzes", id, data);
                    setEditor(false);
                    resource.reload();
                  }}
                />
              </Modal>
            )}
          </>
        )}
      </State>
      {action.error && (
        <p role="alert" className="m2-error">
          {action.error}
        </p>
      )}
      {questionEditor && (
        <Modal
          title={questionEditor.id ? "Edit question" : "Create question"}
          onClose={() => setQuestionEditor(null)}
        >
          <Field label="Points">
            <input
              type="number"
              min="0.01"
              max="10000"
              step="0.01"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
            />
          </Field>
          <ContentEditor
            type="questions"
            initial={questionEditor}
            onCancel={() => setQuestionEditor(null)}
            onSave={async (data) => {
              const saved = await adminService.save(
                "questions",
                questionEditor.id,
                data,
              );
              setQuestionEditor({ ...data, id: saved.id });
              await send(`/admin/quizzes/${id}/questions`, {
                questionId: saved.id,
                points,
              });
              setQuestionEditor(null);
              resource.reload();
            }}
          />
        </Modal>
      )}
      <h2>Quiz analytics</h2>
      <State resource={stats}>
        {(s) => (
          <>
            <div className="m2-grid">
              <div className="m2-panel">
                <h3>{s.attemptCount}</h3>Submitted attempts
              </div>
              <div className="m2-panel">
                <h3>{Number(s.passRate).toFixed(1)}%</h3>Pass rate
              </div>
              <div className="m2-panel">
                <h3>{Number(s.averageScore).toFixed(1)}%</h3>Average score
              </div>
              <div className="m2-panel">
                <h3>{Math.round(Number(s.averageDurationSeconds || 0))}s</h3>
                Average completion time
              </div>
            </div>
            <h3>Frequently incorrect questions</h3>
            {s.frequentlyIncorrect.map((q) => (
              <div
                className="m2-lesson-row"
                key={`${q.questionId}-${q.versionNumber}`}
              >
                <span>
                  {q.prompt} · v{q.versionNumber}
                </span>
                <strong>
                  {Math.round((q.incorrectCount * 100) / q.responses)}%
                  incorrect
                </strong>
              </div>
            ))}
          </>
        )}
      </State>
      {preview && (
        <Modal
          title="Learner-safe quiz preview"
          onClose={() => setPreview(null)}
        >
          <p>No attempts or progress are created in preview.</p>
          {preview.map((q) => (
            <QuestionRenderer
              key={q.questionId}
              question={q}
              value={{}}
              onChange={() => {}}
              disabled
            />
          ))}
        </Modal>
      )}
    </div>
  );
}
