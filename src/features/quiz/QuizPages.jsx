import { BilingualText } from "../shared/BilingualText";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { quizService } from "../shared/services";
import { Badge, Progress, State, useAction, useLoad } from "../shared/ui";
import { QuizQuestion, answerText } from "./QuestionRenderer";
import { Modal } from "@/components/common/Modal";
export function QuizPage() {
  const params = useParams(),
    id = params.id || params.quizId;
  const resource = useLoad(() => quizService.get(id), [id]);
  const [attempt, setAttempt] = useState(null);
  const action = useAction();
  useEffect(() => setAttempt(null), [id]);
  return (
    <div className="m2">
      <State resource={resource}>
        {(quiz) =>
          attempt ? (
            <Attempt key={attempt.id} attempt={attempt} />
          ) : (
            <section className="m2-panel m2-quiz">
              <Badge><BilingualText vi="Kiểm tra" en="Quiz" variant="caption" /></Badge>
              <h1>
                <BilingualText
                  vi={quiz.titleVi}
                  en={quiz.titleEn || quiz.title}
                  variant="display"
                />
              </h1>
              <p>
                <BilingualText
                  vi={quiz.descriptionVi}
                  en={quiz.descriptionEn || quiz.description}
                />
              </p>
              <dl>
                <dt>
                  <BilingualText
                    vi="Số câu hỏi"
                    en="Questions"
                    variant="caption"
                  />
                </dt>
                <dd>{quiz.questionCount}</dd>
                <dt>
                  <BilingualText
                    vi="Điểm đạt"
                    en="Passing score"
                    variant="caption"
                  />
                </dt>
                <dd>{quiz.passingScore}%</dd>
                <dt>
                  <BilingualText
                    vi="Thời gian"
                    en="Time limit"
                    variant="caption"
                  />
                </dt>
                <dd>
                  {quiz.timeLimitMinutes ? (
                    <BilingualText
                      vi={`${quiz.timeLimitMinutes} phút`}
                      en={`${quiz.timeLimitMinutes} minutes`}
                      variant="caption"
                    />
                  ) : (
                    <BilingualText
                      vi="Không giới hạn"
                      en="Unlimited"
                      variant="caption"
                    />
                  )}
                </dd>
                <dt>
                  <BilingualText
                    vi="Số lần làm bài"
                    en="Attempt limit"
                    variant="caption"
                  />
                </dt>
                <dd>
                  {quiz.maxAttempts ?? (
                    <BilingualText
                      vi="Không giới hạn"
                      en="Unlimited"
                      variant="caption"
                    />
                  )}
                </dd>
              </dl>
              <p>
                <BilingualText
                  vi={
                    quiz.timeLimitMinutes
                      ? "Đồng hồ bắt đầu khi mở lượt làm bài và vẫn chạy khi bạn rời trang. Câu trả lời được lưu tự động."
                      : "Bạn có thể học theo nhịp của mình. Câu trả lời được lưu tự động."
                  }
                  en={
                    quiz.timeLimitMinutes
                      ? "The timer starts when you open an attempt and continues while you are away. Answers are saved automatically."
                      : "Work at your own pace. Answers are saved automatically."
                  }
                  variant="caption"
                />
              </p>
              <button
                disabled={action.busy || !quiz.questionCount}
                onClick={() =>
                  action.run(async () =>
                    setAttempt(await quizService.start(id)),
                  )
                }
              >
                <BilingualText
                  vi="Bắt đầu / tiếp tục kiểm tra"
                  en="Start / Resume Quiz"
                  variant="caption"
                />
              </button>
              {action.error && (
                <p role="alert" className="m2-error">
                  {action.error}
                </p>
              )}
            </section>
          )
        }
      </State>
    </div>
  );
}
export function QuizProgress({ answered, total }) {
  return <Progress value={total ? (answered * 100) / total : 0} />;
}
function Attempt({ attempt: a }) {
  const [index, setIndex] = useState(0),
    [answers, setAnswers] = useState(() =>
      Object.fromEntries(
        a.questions.map((q) => [q.questionId, q.answer || {}]),
      ),
    ),
    [confirm, setConfirm] = useState(false),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [remaining, setRemaining] = useState(null);
  const queue = useRef(Promise.resolve()),
    unsaved = useRef(new Map()),
    action = useAction(),
    navigate = useNavigate();
  const q = a.questions[index];
  useEffect(() => {
    if (!a.expiresAt) return;
    const offset = new Date(a.serverTime).getTime() - Date.now();
    const tick = () =>
      setRemaining(
        Math.max(
          0,
          Math.ceil(
            (new Date(a.expiresAt).getTime() - Date.now() - offset) / 1000,
          ),
        ),
      );
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [a.expiresAt, a.serverTime]);
  const enqueue = (question, answer) => {
    unsaved.current.set(question, answer);
    setSaving(true);
    queue.current = queue.current
      .catch(() => {})
      .then(() => quizService.save(a.id, question, answer))
      .then(() => {
        if (unsaved.current.get(question) === answer)
          unsaved.current.delete(question);
        setError("");
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => setSaving(unsaved.current.size > 0));
  };
  const change = (answer) => {
    setAnswers((old) => ({ ...old, [q.questionId]: answer }));
    enqueue(q.questionId, answer);
  };
  const finish = () =>
    action.run(async () => {
      await queue.current;
      if (unsaved.current.size > 0 && remaining !== 0)
        throw new Error(
          "Một số câu trả lời chưa được lưu. Hãy thử lưu lại. / Some answers have not been saved. Retry saving first.",
        );
      await quizService.submit(a.id);
      navigate(`/quiz-attempts/${a.id}`, { replace: true });
    });
  const answered = a.questions.filter((q) =>
    Object.values(answers[q.questionId] || {}).some((v) =>
      typeof v === "string"
        ? v.trim()
        : Array.isArray(v)
          ? v.length
          : Object.keys(v || {}).length,
    ),
  ).length;
  return (
    <div className="m2-quiz">
      <header>
        <Badge><BilingualText vi="Kiểm tra" en="Quiz" variant="caption" /></Badge>
        <h1>
          <BilingualText
            vi={a.quizTitleVi}
            en={a.quizTitleEn || a.quizTitle}
            variant="title"
          />
        </h1>
        <div className="row">
          <span>
            <BilingualText
              vi={`Câu ${index + 1} / ${a.questions.length}`}
              en={`Question ${index + 1} / ${a.questions.length}`}
              variant="caption"
            />
          </span>
          {remaining !== null && (
            <strong role="timer" className={remaining < 60 ? "m2-timer-critical" : remaining < 300 ? "m2-timer-warning" : ""}>
              {Math.floor(remaining / 60)}:
              {String(remaining % 60).padStart(2, "0")} remaining
            </strong>
          )}
        </div>
        <QuizProgress answered={answered} total={a.questions.length} />
      </header>
      <QuizQuestion
        question={q}
        value={answers[q.questionId]}
        onChange={change}
        disabled={action.busy || remaining === 0}
      />
      <p role="status">
        <BilingualText
          vi={saving ? "Đang lưu câu trả lời…" : "Đã lưu câu trả lời"}
          en={saving ? "Saving answers…" : "Answers saved"}
          variant="caption"
        />
      </p>
      {(error || action.error) && (
        <div role="alert" className="m2-error">
          {error || action.error}
          {unsaved.current.size > 0 && remaining !== 0 && (
            <button
              onClick={() =>
                [...unsaved.current].forEach(([q, a]) => enqueue(q, a))
              }
            >
              <BilingualText
                vi="Thử lưu lại"
                en="Retry saving"
                variant="caption"
              />
            </button>
          )}
        </div>
      )}
      {remaining === 0 && (
        <p>
          <BilingualText
            vi="Đã hết giờ. Nộp bài để chấm các câu trả lời đã lưu trước hạn."
            en="Time is up. Submit to score the answers saved before the deadline."
          />
        </p>
      )}
      <div className="m2-question-dots">
        {a.questions.map((q, i) => {
          const isAnswered = Object.values(answers[q.questionId] || {}).some(v =>
            typeof v === "string" ? v.trim() : Array.isArray(v) ? v.length : Object.keys(v || {}).length
          );
          return (
            <button
              key={q.questionId}
              className={index === i ? "" : isAnswered ? "answered" : "secondary"}
              aria-label={`Câu ${i + 1} / Question ${i + 1}`}
              onClick={() => setIndex(i)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="m2-lesson-nav">
        <button
          className="secondary"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          <BilingualText vi="Trước" en="Previous" variant="caption" />
        </button>
        {index < a.questions.length - 1 && (
          <button className="secondary" onClick={() => setIndex(index + 1)}>
            <BilingualText vi="Tiếp theo" en="Next" variant="caption" />
          </button>
        )}
        <button
          disabled={
            action.busy || (index !== a.questions.length - 1 && remaining !== 0)
          }
          onClick={() => setConfirm(true)}
        >
          <BilingualText vi="Nộp bài" en="Submit Quiz" variant="caption" />
        </button>
      </div>
      {confirm && (
        <Modal
          title={<BilingualText vi="Nộp bài kiểm tra?" en="Submit your quiz?" variant="title" />}
          busy={action.busy}
          onClose={() => setConfirm(false)}
        >
          <p>
            <BilingualText
              vi={`Bạn đã trả lời ${answered} / ${a.questions.length} câu. Còn ${a.questions.length - answered} câu chưa trả lời.`}
              en={`You have answered ${answered} of ${a.questions.length} questions. ${a.questions.length - answered} questions are unanswered.`}
            />
          </p>
          <p>
            <BilingualText
              vi="Bạn không thể sửa câu trả lời sau khi nộp bài."
              en="You cannot change answers after submission."
            />
          </p>
          <button disabled={action.busy} onClick={finish}>
            <BilingualText
              vi="Xác nhận nộp bài"
              en="Confirm submission"
              variant="caption"
            />
          </button>
          {action.error && <p role="alert">{action.error}</p>}
        </Modal>
      )}
    </div>
  );
}
export function QuizResultPage() {
  const { id } = useParams();
  return <QuizResult key={id} id={id} />;
}
export function QuizResult({ id }) {
  const navigate = useNavigate();
  const resource = useLoad(() => quizService.result(id), [id]);
  const action = useAction();
  const [review, setReview] = useState(false);
  return (
    <div className="m2">
      <State resource={resource}>
        {(a) => (
          <>
            <section className={`m2-result-hero ${a.passed ? "passed" : "failed"}`}>
              <BilingualText
                vi={a.passed ? "Chúc mừng!" : "Bạn chưa đạt yêu cầu."}
                en={a.passed ? "Congratulations!" : "You haven’t passed yet."}
                variant="display"
              />
              <h1>
                <BilingualText
                  vi={a.quizTitleVi}
                  en={a.quizTitleEn || a.quizTitle}
                  variant="title"
                />
              </h1>
              <strong className="m2-score">{a.percentage}%</strong>
              <p><BilingualText vi={a.resultBandVi} en={a.resultBandEn} variant="title" /></p>
              <p>
                <BilingualText
                  vi={`${a.score} / ${a.maxScore} điểm · ${a.correctCount} đúng · ${a.incorrectCount} sai · ${a.unansweredCount} chưa trả lời`}
                  en={`${a.score} / ${a.maxScore} points · ${a.correctCount} correct · ${a.incorrectCount} incorrect · ${a.unansweredCount} unanswered`}
                  variant="caption"
                />
              </p>
              <p>
                <BilingualText
                  vi={`Thời gian làm bài: ${a.timeSpentSeconds} giây`}
                  en={`Time spent: ${a.timeSpentSeconds} seconds`}
                  variant="caption"
                />
              </p>
              <p>
                <BilingualText
                  vi={`Điểm đạt: ${a.passingScore}%`}
                  en={`Passing score: ${a.passingScore}%`}
                  variant="caption"
                />
              </p>
              <div className="actions">
                <button onClick={() => setReview((value) => !value)}>
                  <BilingualText
                    vi={review ? "Ẩn đáp án" : "Xem lại đáp án"}
                    en={review ? "Hide review" : "Review Answers"}
                    variant="caption"
                  />
                </button>
                {a.canRetry && (
                  <button
                    disabled={action.busy}
                    onClick={() =>
                      action.run(async () => {
                        navigate(`/quiz/${a.quizId}`);
                      })
                    }
                  >
                    <BilingualText
                      vi="Làm lại"
                      en="Retry Quiz"
                      variant="caption"
                    />
                  </button>
                )}
                {a.lessonId && (
                  <Link className="button" to={`/lesson/${a.lessonId}`}>
                    <BilingualText
                      vi="Tiếp tục bài học"
                      en="Continue Lesson"
                      variant="caption"
                    />
                  </Link>
                )}
                {a.courseId && (
                  <Link to={`/courses/${a.courseId}`}>
                    <BilingualText
                      vi="Về khóa học"
                      en="Back to Course"
                      variant="caption"
                    />
                  </Link>
                )}
              </div>
              {action.error && <p role="alert">{action.error}</p>}
            </section>
            {review && (
              <h2>
                <BilingualText
                  vi="Xem lại bài làm"
                  en="Your answer review"
                  variant="title"
                />
              </h2>
            )}
            {review &&
              a.questions.map((q, i) => (
                <article className={`m2-panel ${q.isCorrect ? "review-correct" : "review-incorrect"}`} key={q.questionId}>
                  <div className="row">
                    <Badge>
                      <BilingualText
                        vi={q.isCorrect ? "Đúng" : "Sai"}
                        en={q.isCorrect ? "Correct" : "Incorrect"}
                        variant="caption"
                      />
                    </Badge>
                    <span>
                      {q.score} / {q.points}
                    </span>
                  </div>
                  <h3>
                    {i + 1}.{" "}
                    <BilingualText
                      vi={q.promptVi}
                      en={q.promptEn || q.prompt}
                      variant="title"
                    />
                  </h3>
                  {q.imageUrl && (
                    <img
                      className="m2-question-image"
                      src={q.imageUrl}
                      alt="Question"
                    />
                  )}
                  {q.audioUrl && <audio controls src={q.audioUrl} />}
                  <p>
                    <BilingualText
                      vi="Câu trả lời của bạn:"
                      en="Your answer:"
                      variant="caption"
                    />
                    <BilingualText vi={answerText(q.answer, q.options)} en={answerText(q.answer, q.options, "en")} />
                  </p>
                  <p>
                    <BilingualText
                      vi="Đáp án đúng:"
                      en="Correct answer:"
                      variant="caption"
                    />
                    <BilingualText vi={answerText(q.correctAnswer, q.options)} en={answerText(q.correctAnswer, q.options, "en")} />
                  </p>
                  <p>
                    <BilingualText
                      vi={q.explanationVi}
                      en={q.explanationEn || q.explanation}
                    />
                  </p>
                </article>
              ))}
          </>
        )}
      </State>
    </div>
  );
}
