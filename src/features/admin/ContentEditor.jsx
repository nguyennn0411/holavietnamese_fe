import { useState } from "react";
import {
  Field,
  Select,
  levels,
  statuses,
  useLoad,
  useAction,
} from "../shared/ui";
import { adminService } from "../shared/services";
import { activityTypes } from "../lesson/ActivityRenderer";
import { questionTypes } from "../quiz/QuestionRenderer";
const defaults = {
  courses: {
    code: "",
    slug: "",
    title: "",
    description: "",
    level: "A1",
    thumbnailUrl: "",
    estimatedMinutes: 10,
    learningOutcomes: "",
    isFree: true,
  },
  modules: { title: "", description: "" },
  lessons: {
    code: "",
    slug: "",
    title: "",
    description: "",
    lessonType: "NORMAL",
    estimatedMinutes: 10,
    prerequisiteIds: [],
  },
  grammar: {
    code: "",
    slug: "",
    title: "",
    level: "A1",
    structurePattern: "",
    explanation: "",
    commonMistakes: "",
    examples: [],
  },
  questions: {
    questionType: "MULTIPLE_CHOICE",
    prompt: "",
    explanation: "",
    difficulty: "EASY",
    topic: "",
    status: "DRAFT",
    options: [
      { id: "a", text: "" },
      { id: "b", text: "" },
    ],
    correctAnswerJson: { optionIds: ["a"] },
  },
  quizzes: {
    title: "",
    description: "",
    quizType: "LESSON",
    courseId: null,
    lessonId: null,
    passingScore: 70,
    maxAttempts: 3,
    timeLimitMinutes: null,
    randomizeQuestions: false,
  },
  activities: {
    activityType: "TEXT",
    title: "",
    instruction: "",
    contentJson: { body: "" },
    isRequired: true,
    maxScore: 0,
    status: "DRAFT",
    quizId: null,
    grammarTopicIds: [],
  },
};
export function ContentEditor({ type, initial = {}, onSave, onCancel }) {
  const newest = initial.versions?.[0];
  const bilingual = {};
  for (const key of ['title','description','instruction','prompt','explanation','commonMistakes','learningObjective']) {
    bilingual[key+'En'] = initial[key+'En'] ?? initial[key] ?? '';
    bilingual[key+'Vi'] = initial[key+'Vi'] ?? '';
  }
  const [d, setD] = useState(() => ({
    ...defaults[type],
    ...initial,
    ...bilingual,
    ...(newest
      ? { options: newest.options, correctAnswerJson: newest.correctAnswerJson }
      : {}),
    estimatedMinutes:
      initial.estimatedMinutes ??
      initial.estimatedDuration ??
      defaults[type]?.estimatedMinutes,
    grammarTopicIds:
      initial.grammarTopics?.map((g) => g.id) || initial.grammarTopicIds || [],
  }));
  const action = useAction();
  const set = (k, v) => setD((old) => ({ ...old, [k]: v }));
  const text = (key, label, area = false) => (
    <Field key={key} label={label}>
      {area ? (
        <textarea
          rows={3}
          value={d[key] ?? ""}
          onChange={(e) => set(key, e.target.value)}
        />
      ) : (
        <input
          required={[
            "code",
            "slug",
            "titleVi", "titleEn",
            "promptVi", "promptEn",
            "structurePattern",
          ].includes(key)}
          value={d[key] ?? ""}
          onChange={(e) => set(key, e.target.value)}
        />
      )}
    </Field>
  );
  const number = (key, label, min = 0) => (
    <Field label={label}>
      <input
        type="number"
        min={min}
        step="any"
        value={d[key] ?? ""}
        onChange={(e) =>
          set(key, e.target.value === "" ? null : Number(e.target.value))
        }
      />
    </Field>
  );
  const select = (key, label, values) => (
    <Select
      label={label}
      values={values}
      all={false}
      value={d[key]}
      onChange={(v) => set(key, v)}
    />
  );
  return (
    <form
      className="m2-form"
      onSubmit={(e) => {
        e.preventDefault();
        action.run(() => {
          const payload = { ...d };
          for (const key of ['title','description','instruction','prompt','explanation','commonMistakes','learningObjective']) delete payload[key];
          return onSave(payload);
        });
      }}
    >
      {["courses", "lessons", "grammar"].includes(type) && (
        <div className="m2-form-grid">
          {text("code", "Code")}
          {text("slug", "Slug")}
        </div>
      )}
      {type !== "questions" && <div className="m2-form-grid">{text("titleVi", "Tiêu đề tiếng Việt")}{text("titleEn", "English title")}</div>}
      {["courses", "modules", "lessons", "quizzes", "grammar"].includes(type) &&
        <div className="m2-form-grid">{text("descriptionVi", "Mô tả tiếng Việt", true)}{text("descriptionEn", "English description", true)}</div>}
      {["courses", "grammar"].includes(type) &&
        select("level", "Level", levels)}
      {type === "courses" && (
        <>
          {text("thumbnailUrl", "Thumbnail URL")}
          <Field label="Estimated hours">
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={Number(((d.estimatedMinutes ?? 0) / 60).toFixed(2))}
              onChange={(e) =>
                set("estimatedMinutes", Math.round(Number(e.target.value) * 60))
              }
            />
          </Field>
          {text("learningOutcomes", "Learning outcomes", true)}
          <label>
            <input
              type="checkbox"
              checked={d.isFree}
              onChange={(e) => set("isFree", e.target.checked)}
            />{" "}
            Free course
          </label>
        </>
      )}
      {type === "lessons" && (
        <>
          <div className="m2-form-grid">{text("learningObjectiveVi", "Mục tiêu tiếng Việt", true)}{text("learningObjectiveEn", "English learning objective", true)}</div>
          {select("lessonType", "Lesson type", [
            "NORMAL",
            "VOCABULARY",
            "GRAMMAR",
            "CONVERSATION",
            "CULTURE",
            "REVIEW",
          ])}
          {number("estimatedMinutes", "Estimated minutes")}
          <Field label="Prerequisite lesson IDs (comma separated)">
            <input
              value={(d.prerequisiteIds || []).join(",")}
              onChange={(e) =>
                set(
                  "prerequisiteIds",
                  e.target.value.split(",").filter(Boolean).map(Number),
                )
              }
            />
          </Field>
        </>
      )}
      {type === "grammar" && (
        <>
          {text("structurePattern", "Cấu trúc tiếng Việt")}{text("structurePatternEn", "English structure") }
          <div className="m2-form-grid">{text("explanationVi", "Giải thích tiếng Việt", true)}{text("explanationEn", "English explanation", true)}</div>
          <div className="m2-form-grid">{text("commonMistakesVi", "Lỗi thường gặp", true)}{text("commonMistakesEn", "Common mistakes in English", true)}</div>
          {text("notes", "Notes", true)}
          <h3>Examples</h3>
          {d.examples.map((ex, i) => (
            <div className="m2-panel" key={i}>
              {["vietnameseText", "translation", "explanation"].map((key) => (
                <Field key={key} label={key}>
                  <input
                    value={ex[key] || ""}
                    onChange={(e) =>
                      set(
                        "examples",
                        d.examples.map((x, n) =>
                          n === i ? { ...x, [key]: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </Field>
              ))}
              <button
                type="button"
                className="secondary"
                onClick={() =>
                  set(
                    "examples",
                    d.examples.filter((_, n) => n !== i),
                  )
                }
              >
                Remove example
              </button>
            </div>
          ))}
          <button
            type="button"
            className="secondary"
            onClick={() =>
              set("examples", [
                ...d.examples,
                { vietnameseText: "", translation: "", explanation: "" },
              ])
            }
          >
            Add example
          </button>
        </>
      )}
      {type === "questions" && (
        <>
          <QuestionFields
            data={d}
            onChange={(patch) => setD({ ...d, ...patch })}
          />
          {select("difficulty", "Difficulty", ["EASY", "MEDIUM", "HARD"])}
          {text("topic", "Topic")}
          <div className="m2-form-grid">{text("explanationVi", "Giải thích tiếng Việt", true)}{text("explanationEn", "English explanation", true)}</div>
          {select("status", "Status", statuses)}
          {initial.id && (
            <p>
              Saving creates v{initial.currentVersion + 1}. Existing attempts
              keep their original snapshot.
            </p>
          )}
        </>
      )}
      {type === "quizzes" && (
        <>
          {select("quizType", "Quiz type", [
            "LESSON",
            "COURSE",
            "PLACEMENT",
            "PRACTICE",
          ])}
          <EntitySelect
            type="courses"
            label="Course"
            value={d.courseId}
            onChange={(v) => set("courseId", v)}
          />
          <EntitySelect
            type="lessons"
            label="Lesson"
            params={{ courseId: d.courseId }}
            value={d.lessonId}
            onChange={(v) => set("lessonId", v)}
          />
          {number("passingScore", "Passing score (%)")}
          {number(
            "timeLimitMinutes",
            "Time limit minutes (blank = unlimited)",
            1,
          )}
          {number("maxAttempts", "Maximum attempts (blank = unlimited)", 1)}
          <label>
            <input
              type="checkbox"
              checked={d.randomizeQuestions}
              onChange={(e) => set("randomizeQuestions", e.target.checked)}
            />{" "}
            Randomize questions
          </label>
        </>
      )}
      {type === "activities" && (
        <>
          {select("activityType", "Activity type", activityTypes)}
          <div className="m2-form-grid">{text("instructionVi", "Hướng dẫn tiếng Việt", true)}{text("instructionEn", "English instruction", true)}</div>
          <ActivityFields data={d} set={set} />
          {number("maxScore", "Maximum score")}
          <label>
            <input
              type="checkbox"
              checked={d.isRequired}
              onChange={(e) => set("isRequired", e.target.checked)}
            />{" "}
            Required activity
          </label>
          {select("status", "Status", ["DRAFT", "PUBLISHED", "ARCHIVED"])}
        </>
      )}
      {["courses", "grammar", "quizzes"].includes(type) && (
        <Select
          label="Status"
          all={false}
          values={
            initial.id
              ? type === "grammar"
                ? ["DRAFT", "PUBLISHED", "ARCHIVED"]
                : statuses
              : ["DRAFT"]
          }
          value={d.status || "DRAFT"}
          onChange={(v) => set("status", v)}
        />
      )}
      {!initial.id && ["courses", "grammar", "quizzes"].includes(type) && (
        <p>Save a draft first, then publish after adding content.</p>
      )}
      {action.error && (
        <p role="alert" className="m2-error">
          {action.error}
        </p>
      )}
      <div className="actions">
        <button disabled={action.busy}>
          {action.busy ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={onCancel}
          disabled={action.busy}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
export function EntitySelect({ type, label, value, onChange, params = {} }) {
  const [q, setQ] = useState("");
  const key = JSON.stringify(params);
  const resource = useLoad(
    () => adminService.list(type, { ...params, q, size: 30 }),
    [type, q, key],
  );
  return (
    <Field label={label}>
      <input
        aria-label={`Search ${label}`}
        placeholder={`Search ${label.toLowerCase()}...`}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <select
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : null)
        }
      >
        <option value="">Select {label}</option>
        {value && !resource.data?.content.some((x) => x.id === value) && (
          <option value={value}>Selected #{value}</option>
        )}
        {resource.data?.content.map((x) => (
          <option key={x.id} value={x.id}>
            {x.title || x.prompt} · #{x.id}
          </option>
        ))}
      </select>
      {resource.error && <small role="alert">{resource.error.message}</small>}
    </Field>
  );
}
export function QuestionFields({ data: d, onChange }) {
  const options = d.options || [],
    type = d.questionType || "FILL_BLANK",
    key = d.correctAnswerJson || {};
  const setKey = (patch) =>
    onChange({ correctAnswerJson: { ...key, ...patch } });
  return (
    <>
      <Select
        label="Question type"
        all={false}
        values={questionTypes}
        value={type}
        onChange={(questionType) =>
          onChange({
            questionType,
            correctAnswerJson:
              questionType === "MATCHING"
                ? { pairs: {} }
                : ["REORDER_SENTENCE", "REORDER"].includes(questionType)
                  ? { sequence: [] }
                  : ["FILL_BLANK", "TRANSLATION", "LISTENING"].includes(
                        questionType,
                      )
                    ? { acceptedAnswers: [] }
                    : { optionIds: [] },
          })
        }
      />
      {['promptVi','promptEn'].map(key=><Field key={key} label={key === 'promptVi' ? 'Câu hỏi tiếng Việt' : 'English question'}>
        <textarea required value={d[key] ?? (key === 'promptEn' ? d.prompt : '') ?? ''} onChange={e=>onChange({[key]:e.target.value})}/>
      </Field>)}
      {["imageUrl", "audioUrl"].map((k) => (
        <Field key={k} label={k}>
          <input
            value={d[k] || ""}
            onChange={(e) => onChange({ [k]: e.target.value })}
          />
        </Field>
      ))}
      <h3>Options / tokens / matching items</h3>
      {options.map((o, i) => (
        <div className="m2-option-edit" key={i}>
          <input
            aria-label="Option ID"
            value={o.id}
            onChange={(e) =>
              onChange({
                options: options.map((x, n) =>
                  n === i ? { ...x, id: e.target.value } : x,
                ),
              })
            }
          />
          {['textVi','textEn'].map(key=><input key={key} aria-label={key === 'textVi' ? 'Vietnamese option' : 'English option'} placeholder={key === 'textVi' ? 'Tiếng Việt' : 'English'} value={o[key] ?? (key === 'textEn' ? o.text : '') ?? ''}
            onChange={e=>onChange({options:options.map((x,n)=>n===i?{...x,[key]:e.target.value}:x)})}/>)}
          {type === "IMAGE_SELECTION" && (
            <input
              aria-label="Option image URL"
              placeholder="https://..."
              value={o.imageUrl || ""}
              onChange={(e) =>
                onChange({
                  options: options.map((x, n) =>
                    n === i ? { ...x, imageUrl: e.target.value } : x,
                  ),
                })
              }
            />
          )}
          <select
            aria-label="Matching side"
            value={o.side || "left"}
            onChange={(e) =>
              onChange({
                options: options.map((x, n) =>
                  n === i ? { ...x, side: e.target.value } : x,
                ),
              })
            }
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
          <button
            type="button"
            className="secondary"
            onClick={() =>
              onChange({ options: options.filter((_, n) => n !== i) })
            }
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="secondary"
        onClick={() =>
          onChange({
            options: [
              ...options,
              { id: `o${Date.now()}`, text: "", side: "left" },
            ],
          })
        }
      >
        Add option
      </button>
      {[
        "MULTIPLE_CHOICE",
        "MULTIPLE_SELECT",
        "TRUE_FALSE",
        "IMAGE_SELECTION",
      ].includes(type) ||
      (type === "LISTENING" && options.length > 0) ? (
        <Field label="Correct options">
          {options.map((o) => (
            <label key={o.id}>
              <input
                type="checkbox"
                checked={key.optionIds?.includes(o.id) || false}
                onChange={(e) =>
                  setKey({
                    optionIds: e.target.checked
                      ? [...(key.optionIds || []), o.id]
                      : (key.optionIds || []).filter((id) => id !== o.id),
                  })
                }
              />
              {o.textVi || o.textEn || o.text || o.id}
            </label>
          ))}
        </Field>
      ) : type === "MATCHING" ? (
        <>
          {options
            .filter((o) => (o.side || "left") === "left")
            .map((o) => (
              <Field key={o.id} label={`Match: ${o.text || o.id}`}>
                <select
                  value={key.pairs?.[o.id] || ""}
                  onChange={(e) =>
                    setKey({ pairs: { ...key.pairs, [o.id]: e.target.value } })
                  }
                >
                  <option value="">Select right item</option>
                  {options
                    .filter((x) => x.side === "right")
                    .map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.text || x.id}
                      </option>
                    ))}
                </select>
              </Field>
            ))}
        </>
      ) : ["REORDER_SENTENCE", "REORDER"].includes(type) ? (
        <Field label="Correct sequence (option IDs separated by commas)">
          <input
            value={key.sequence?.join(",") || ""}
            onChange={(e) =>
              setKey({
                sequence: e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
          />
        </Field>
      ) : (
        <>
          <Field label="Accepted answers (one per line)">
            <textarea
              value={key.acceptedAnswers?.join("\n") || ""}
              onChange={(e) =>
                setKey({ acceptedAnswers: e.target.value.split("\n") })
              }
            />
          </Field>
          <label>
            <input
              type="checkbox"
              checked={key.caseSensitive || false}
              onChange={(e) => setKey({ caseSensitive: e.target.checked })}
            />{" "}
            Case sensitive
          </label>
        </>
      )}
    </>
  );
}
function ActivityFields({ data: d, set }) {
  const c = d.contentJson || {},
    type = d.activityType;
  const change = (k, v) => set("contentJson", { ...c, [k]: v });
  const text = (k, label) => (
    <Field key={k} label={label}>
      <textarea
        value={c[k] ?? ({textVi:c.body,transcriptVi:c.transcript,transcriptEn:c.translation,captionVi:c.caption}[k]) ?? ""}
        onChange={(e) => change(k, e.target.value)}
      />
    </Field>
  );
  if (
    [
      "MULTIPLE_CHOICE",
      "FILL_BLANK",
      "MATCHING",
      "REORDER_SENTENCE",
      "LISTEN_AND_CHOOSE",
      "LISTEN_AND_TYPE",
      "LISTENING",
      "TRANSLATION",
      "PRACTICE",
    ].includes(type)
  )
    return (
      <QuestionFields
        data={{
          ...c,
          questionType:
            type === "PRACTICE"
              ? c.questionType || "FILL_BLANK"
              : type.startsWith("LISTEN_")
                ? "LISTENING"
                : type,
          options: c.options || [],
          correctAnswerJson: c.correctAnswer || {},
        }}
        onChange={(patch) => {
          const { correctAnswerJson, ...rest } = patch;
          set("contentJson", {
            ...c,
            ...rest,
            ...(correctAnswerJson ? { correctAnswer: correctAnswerJson } : {}),
          });
        }}
      />
    );
  if (type === "QUIZ")
    return (
      <EntitySelect
        type="quizzes"
        label="Quiz"
        value={d.quizId}
        onChange={(v) => set("quizId", v)}
      />
    );
  if (type === "GRAMMAR")
    return (
      <>
        <EntitySelect
          type="grammar"
          label="Grammar topic"
          value={d.grammarTopicIds?.[0]}
          onChange={(v) => set("grammarTopicIds", v ? [v] : [])}
        />
      </>
    );
  if (type === "VOCABULARY" || type === "FLASHCARD") return <>
    <h3>Từ vựng / Vocabulary</h3>
    {(c.items || []).map((item,i)=><div className="m2-panel" key={i}>
      {['wordVi','meaningEn','pronunciation','wordType','exampleVi','exampleEn','audioUrl','imageUrl'].map(k=><Field key={k} label={k}>
        <input required={['wordVi','meaningEn','exampleVi','exampleEn'].includes(k)} value={item[k] || ''} onChange={e=>change('items',c.items.map((x,n)=>n===i?{...x,[k]:e.target.value}:x))}/>
      </Field>)}
      <button type="button" className="secondary" onClick={()=>change('items',c.items.filter((_,n)=>n!==i))}>Remove word</button>
    </div>)}
    <button type="button" className="secondary" onClick={()=>change('items',[...(c.items || []),{wordVi:'',meaningEn:'',exampleVi:'',exampleEn:'',audioUrl:null,imageUrl:null}])}>Add word</button>
    {c.vocabularyIds?.length > 0 && <p>Existing vocabulary references: {c.vocabularyIds.join(', ')}</p>}
  </>;
  if (type === "DIALOGUE")
    return (
      <>
        <h3>Dialogue lines</h3>
        {(c.lines || []).map((line, i) => (
          <div className="m2-panel" key={i}>
            {["speaker", "textVi", "textEn", "audioUrl"].map((k) => (
              <Field key={k} label={k}>
                <input
                  value={line[k] ?? (k === "textVi" ? line.text : k === "textEn" ? line.translation : "") ?? ""}
                  onChange={(e) =>
                    change(
                      "lines",
                      c.lines.map((x, n) =>
                        n === i ? { ...x, [k]: e.target.value } : x,
                      ),
                    )
                  }
                />
              </Field>
            ))}
            <button
              type="button"
              className="secondary"
              onClick={() =>
                change(
                  "lines",
                  c.lines.filter((_, n) => n !== i),
                )
              }
            >
              Remove line
            </button>
          </div>
        ))}
        <button
          type="button"
          className="secondary"
          onClick={() =>
            change("lines", [
              ...(c.lines || []),
              { speaker: "", textVi: "", textEn: "" },
            ])
          }
        >
          Add dialogue line
        </button>
      </>
    );
  return (
    <>
      {(type === "TEXT"
        ? ["textVi", "textEn", "imageUrl"]
        : type === "IMAGE"
          ? ["imageUrl", "captionVi", "captionEn"]
          : type === "AUDIO"
            ? ["audioUrl", "transcriptVi", "transcriptEn"]
            : type === "VIDEO"
              ? ["videoUrl", "transcriptVi", "transcriptEn"]
              : type === "PRONUNCIATION"
                ? ["targetText"]
                : ["scenarioId"]
      ).map((k) => text(k, k))}
    </>
  );
}
