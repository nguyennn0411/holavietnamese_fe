import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { MediaPlayer } from '@/components/learning/MediaPlayer';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { contentService } from '@/services/contentService';
import { ResourceState } from '@/components/common/ResourceState';
import { PageHeader, Notice, EmptyState, Artwork } from '@/components/common/Ui';
import { ProgressBar } from '@/components/common/ProgressBar';
import { QuestionInput } from '@/components/learning/QuestionInput';
import { answerLabel, answerPresent } from '@/components/learning/answerUtils';
import { Modal } from '@/components/common/Modal';
import { FireworksBackground, CountingNumber } from '@/components/common/animate';
import { Award, Clock, RotateCcw, BookOpen, CheckCircle2, ArrowRight, ArrowLeft, Check, AlertCircle, Play } from 'lucide-react';

/**
 * =========================================================================
 * 1. QUIZ OVERVIEW / START SCREEN (QuizPage)
 * =========================================================================
 */
export function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const resource = useAsyncResource(
    useCallback((signal) => contentService.quiz(quizId, signal), [quizId])
  );

  async function start() {
    setBusy(true);
    setError('');
    try {
      const attempt = await contentService.startQuiz(quizId);
      navigate(`/quiz-attempts/${attempt.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ResourceState resource={resource}>
      {(quiz) => {
        const backUrl = quiz.courseId ? `/courses/${quiz.courseId}` : '/my-learning';

        return (
          <section className="quiz-start-screen w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
              <Link
                to={backUrl}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#253044] transition-colors no-underline"
              >
                <ArrowLeft size={14} />
                <span>
                  <BilingualText>{quiz.courseId ? 'Về khóa học' : 'Về góc học tập'}</BilingualText>
                </span>
              </Link>
            </div>

            {/* Main Quiz Hero Card */}
            <div className="quiz-gate card relative overflow-hidden rounded-3xl bg-white border border-[#E5E7EB] p-6 sm:p-10 shadow-sm space-y-8">
              {/* Dong Son background watermark */}
              <div className="absolute -right-10 -bottom-10 w-64 h-64 opacity-5 pointer-events-none select-none hidden sm:block">
                <Artwork kind="dong-son" className="w-full h-full object-contain" />
              </div>

              {/* Title & Badge */}
              <div className="text-center space-y-3 max-w-2xl mx-auto relative z-10">
                <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#FFF4E8] text-[#F28C45] border border-[#FED7AA] font-bold text-xs uppercase tracking-wider shadow-2xs">
                  <BilingualText>{"Kiểm tra năng lực • Knowledge Check"}</BilingualText>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#253044] tracking-tight leading-tight">
                  <BilingualText vi={quiz.titleVi || quiz.title} en={quiz.title} />
                </h1>

                <p className="lead text-sm sm:text-base text-[#64748B] leading-relaxed">
                  <BilingualText
                    vi={quiz.descriptionVi || quiz.description || 'Một cơ hội để nhìn lại những điều bạn đã học và củng cố phản xạ ngôn ngữ.'}
                    en={quiz.description || 'A chance to review what you have learned and reinforce your language skills.'}
                  />
                </p>
              </div>

              {/* Key Exam Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 relative z-10">
                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs text-center space-y-1">
                  <span className="text-[11px] font-bold text-[#6B7280] block uppercase tracking-wider">
                    <BilingualText vi="Số câu hỏi" en="Total questions" />
                  </span>
                  <strong className="text-base sm:text-lg font-black text-[#1F2937]">
                    <BilingualText vi={`${quiz.questionCount} câu`} en={`${quiz.questionCount} questions`} />
                  </strong>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs text-center space-y-1">
                  <span className="text-[11px] font-bold text-[#6B7280] block uppercase tracking-wider">
                    <BilingualText vi="Điểm đạt" en="Passing score" />
                  </span>
                  <strong className="text-base sm:text-lg font-black text-emerald-700">
                    {quiz.passingScore}%
                  </strong>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs text-center space-y-1">
                  <span className="text-[11px] font-bold text-[#6B7280] block uppercase tracking-wider">
                    <BilingualText vi="Thời gian" en="Time limit" />
                  </span>
                  <strong className="text-base sm:text-lg font-black text-[#1F2937]">
                    {quiz.timeLimitMinutes ? <BilingualText vi={`${quiz.timeLimitMinutes} phút`} en={`${quiz.timeLimitMinutes} min`} /> : <BilingualText vi="Tự do" en="Untimed" />}
                  </strong>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs text-center space-y-1">
                  <span className="text-[11px] font-bold text-[#6B7280] block uppercase tracking-wider">
                    <BilingualText vi="Lần làm bài" en="Max attempts" />
                  </span>
                  <strong className="text-base sm:text-lg font-black text-[#1F2937]">
                    {quiz.maxAttempts ? <BilingualText vi={`${quiz.maxAttempts} lần`} en={`${quiz.maxAttempts} attempts`} /> : <BilingualText vi="Vô hạn" en="Unlimited" />}
                  </strong>
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2 relative z-10 text-xs sm:text-sm text-[#1F2937]">
                <strong className="font-bold text-[#F28C45] flex items-center gap-1.5">
                  <BilingualText>{"Lưu ý trước khi làm bài:"}</BilingualText>
                </strong>
                <ul className="space-y-1 text-xs text-[#6B7280] pl-5 list-disc">
                  <li>
                    <BilingualText>{"Hệ thống tự động lưu câu trả lời mỗi khi bạn chuyển câu."}</BilingualText>
                  </li>
                  <li>
                    <BilingualText>{"Bạn có thể tự do bấm chọn lại các câu trước để kiểm tra đáp án."}</BilingualText>
                  </li>
                  <li>
                    <BilingualText>{"Khi hoàn thành tất cả các câu, bấm nút Nộp bài để xem ngay kết quả chi tiết."}</BilingualText>
                  </li>
                </ul>
              </div>

              {error && (
                <Notice kind="error">
                  <BilingualText>{error}</BilingualText>
                </Notice>
              )}

              {/* CTA Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
                <button
                  type="button"
                  onClick={start}
                  disabled={busy}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-xl bg-[#F28C45] hover:bg-[#EA580C] text-white font-bold text-sm shadow-sm hover:shadow transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                >
                  {busy ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <BilingualText>{"Đang chuẩn bị đề thi…"}</BilingualText>
                    </>
                  ) : (
                    <>
                      <Play size={16} fill="white" />
                      <BilingualText>{"Bắt đầu quiz ngay →"}</BilingualText>
                    </>
                  )}
                </button>

                {quiz.courseId && (
                  <Link
                    to={`/courses/${quiz.courseId}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-white hover:bg-stone-50 text-[#1F2937] border border-[#E5E7EB] font-bold text-xs shadow-2xs transition-all no-underline"
                  >
                    <BilingualText>{"← Về khóa học"}</BilingualText>
                  </Link>
                )}
              </div>
            </div>
          </section>
        );
      }}
    </ResourceState>
  );
}

/**
 * =========================================================================
 * 2. QUIZ ATTEMPT SCREEN (QuizAttemptPage)
 * =========================================================================
 */
export function QuizAttemptPage() {
  const { attemptId } = useParams();
  const resource = useAsyncResource(
    useCallback((signal) => contentService.attempt(attemptId, signal), [attemptId])
  );

  return (
    <ResourceState resource={resource}>
      {(attempt) =>
        attempt.status === 'SUBMITTED' ? (
          <Navigate to={`/quiz-attempts/${attempt.id}/result`} replace />
        ) : (
          <Attempt key={attempt.id} attempt={attempt} />
        )
      }
    </ResourceState>
  );
}

function Attempt({ attempt }) {
  const navigate = useNavigate();
  const questions = attempt.questions || [];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(
    Object.fromEntries(questions.map((question) => [question.questionId, question.answer]))
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [remaining, setRemaining] = useState(null);

  // Timer countdown
  useEffect(() => {
    if (!attempt.expiresAt) return;
    const offset = new Date(attempt.serverTime).getTime() - Date.now();
    const update = () =>
      setRemaining(
        Math.max(
          0,
          Math.ceil((new Date(attempt.expiresAt).getTime() - Date.now() - offset) / 1000)
        )
      );
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [attempt.expiresAt, attempt.serverTime]);

  if (!questions.length) {
    return (
      <EmptyState title={bilingualLabel("Quiz chưa có câu hỏi", "Quiz has no questions")}>
        <Link className="button secondary" to="/my-learning">
          <BilingualText>{"Về góc học tập"}</BilingualText>
        </Link>
      </EmptyState>
    );
  }

  const question = questions[index];
  const expired = remaining === 0;

  async function saveCurrent() {
    const answer = answers[question.questionId];
    if (answer !== question.answer) {
      await contentService.answer(
        attempt.id,
        question.questionId,
        answerPresent(answer) ? answer : {}
      );
    }
  }

  async function changeQuestion(next) {
    setBusy(true);
    setError('');
    try {
      if (!expired) await saveCurrent();
      setIndex(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function finish() {
    setBusy(true);
    setError('');
    try {
      if (!expired) await saveCurrent();
      const result = await contentService.submit(attempt.id);
      navigate(`/quiz-attempts/${result.id}/result`);
    } catch (err) {
      setError(err.message);
      setConfirm(false);
    } finally {
      setBusy(false);
    }
  }

  const answeredCount = Object.values(answers).filter(answerPresent).length;
  const isLastQuestion = index + 1 === questions.length;
  const isUrgentTimer = remaining !== null && remaining <= 60;
  const isCriticalTimer = remaining !== null && remaining <= 20;

  return (
    <section className="quiz-workspace-container w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Sticky Header with Title and Countdown Timer */}
      <header className="sticky top-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E5E7EB] p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-xl bg-[#FFF4E8] text-[#F28C45] flex items-center justify-center shrink-0 border border-[#FED7AA] shadow-2xs font-bold text-xs">
            <Award size={16} />
          </span>
          <div className="truncate">
            <h1 className="text-sm sm:text-base font-black text-[#1F2937] truncate m-0">
              <BilingualText vi={attempt.quizTitleVi || attempt.quizTitle} en={attempt.quizTitle} />
            </h1>
            <p className="text-[11px] text-[#6B7280] m-0 font-medium">
              <BilingualText
                vi={`Câu ${index + 1} / ${questions.length} · Đã làm: ${answeredCount}/${questions.length} câu`}
                en={`Question ${index + 1} / ${questions.length} · Answered: ${answeredCount}/${questions.length}`}
              />
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          {remaining !== null && (
            <div
              className={`badge flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                isCriticalTimer
                  ? 'bg-rose-600 text-white animate-pulse shadow-md'
                  : isUrgentTimer
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-stone-100 text-stone-700 border border-stone-200'
              }`}
              title={bilingualLabel("Thời gian còn lại", "Remaining time")}
            >
              <Clock size={13} className={isCriticalTimer ? 'text-white' : 'text-stone-500'} />
              <span>
                {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setConfirm(true)}
            disabled={busy}
            className="px-4 py-2 rounded-xl bg-[#F28C45] hover:bg-[#EA580C] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <BilingualText>{"Nộp bài"}</BilingualText>
          </button>
        </div>
      </header>

      {/* Progress Bar & Question Jump Palette */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#6B7280]">
          <span><BilingualText vi="Tiến độ làm bài" en="Quiz progress" /></span>
          <span className="text-[#F28C45]">{Math.round((answeredCount / questions.length) * 100)}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#F28C45] transition-all duration-300"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Quick Jump Pills */}
        <div className="pt-2 flex flex-wrap gap-2 items-center">
          <span className="text-[11px] font-bold text-[#6B7280] mr-1 hidden sm:inline">
            <BilingualText vi="Chọn câu:" en="Jump to:" />
          </span>
          {questions.map((q, qIdx) => {
            const isCurrent = qIdx === index;
            const isAnswered = answerPresent(answers[q.questionId]);

            return (
              <button
                key={q.questionId || qIdx}
                type="button"
                disabled={busy}
                onClick={() => changeQuestion(qIdx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#F28C45] text-white shadow-xs scale-105 ring-2 ring-[#F28C45]/20'
                    : isAnswered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-white text-[#1F2937] border border-[#E5E7EB] hover:border-[#FDBA74]'
                }`}
                title={bilingualLabel(`Chuyển đến câu ${qIdx + 1}${isAnswered ? ' (Đã trả lời)' : ''}`, `Go to question ${qIdx + 1}${isAnswered ? ' (Answered)' : ''}`)}
              >
                {qIdx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <Notice kind="error">
          <BilingualText>{error}</BilingualText>
        </Notice>
      )}

      {expired && (
        <Notice kind="error">
          <BilingualText>
            {"Đã hết thời gian làm bài! Vui lòng nộp các câu trả lời đã lưu để hệ thống chấm điểm."}
          </BilingualText>
        </Notice>
      )}

      {/* Main Question Card */}
      <article className="quiz-question card bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm space-y-6">
        {/* Question Header & Type Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FFF4E8] text-[#F28C45] font-bold text-xs uppercase tracking-wider border border-[#FED7AA]">
              <BilingualText vi={`Câu ${index + 1}`} en={`Question ${index + 1}`} /> · {question.questionType?.replaceAll('_', ' ') || <BilingualText vi="TRẮC NGHIỆM" en="MULTIPLE CHOICE" />}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-stone-100 text-[#6B7280] font-bold text-xs">
              {question.points || 1} <BilingualText>{"điểm"}</BilingualText>
            </span>
          </div>

          <span className="text-xs text-[#6B7280] font-medium">
            <BilingualText vi={`${answeredCount}/${questions.length} câu đã trả lời`} en={`${answeredCount}/${questions.length} answered`} />
          </span>
        </div>

        {/* Prompt */}
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#1F2937] leading-snug">
            <BilingualText vi={question.promptVi || question.prompt} en={question.prompt} />
          </h2>

          {question.imageUrl && (
            <div className="rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white p-3 max-h-80 flex justify-center shadow-2xs">
              <ContentImage
                className="question-media max-h-72 w-auto object-contain rounded-xl"
                src={question.imageUrl}
                alt={bilingualLabel("Hình minh họa câu hỏi", "Question illustration")}
              />
            </div>
          )}

          {question.audioUrl && (
            <div className="pt-1">
              <MediaPlayer audioUrl={question.audioUrl} />
            </div>
          )}
        </div>

        {/* Interactive Answer Inputs */}
        <div className="pt-2">
          <QuestionInput
            question={question}
            answer={answers[question.questionId]}
            disabled={busy || expired}
            onChange={(answer) =>
              setAnswers((previous) => ({
                ...previous,
                [question.questionId]: answer,
              }))
            }
          />
        </div>
      </article>

      {/* Navigation Dock at Bottom */}
      <div className="lesson-navigation flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
        <button
          type="button"
          disabled={busy || index === 0}
          onClick={() => changeQuestion(index - 1)}
          className="button secondary inline-flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#1F2937] bg-white hover:bg-stone-50 border border-[#E5E7EB] disabled:opacity-40 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <BilingualText>{"Câu trước"}</BilingualText>
        </button>

        <span className="text-xs text-[#6B7280] font-medium hidden sm:inline-block text-center">
          <BilingualText>{"Đáp án được tự động lưu mỗi khi chuyển câu"}</BilingualText>
        </span>

        {isLastQuestion || expired ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirm(true)}
            className="button inline-flex items-center gap-2 py-2.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#F28C45] hover:bg-[#EA580C] shadow-sm transition-all cursor-pointer"
          >
            <CheckCircle2 size={15} />
            <BilingualText>{"Nộp bài thi →"}</BilingualText>
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => changeQuestion(index + 1)}
            className="button inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#F28C45] hover:bg-[#EA580C] shadow-sm transition-all cursor-pointer"
          >
            <BilingualText>{"Câu tiếp theo"}</BilingualText>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirm && (
        <Modal title={bilingualLabel("Xác nhận nộp bài kiểm tra?", "Confirm quiz submission?")} busy={busy} onClose={() => setConfirm(false)}>
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-[#FFFCF7] border border-[#E8E5DF] text-xs sm:text-sm text-[#253044] space-y-2">
              <p className="m-0 font-semibold">
                <BilingualText
                  vi={`Bạn đã trả lời ${answeredCount} / ${questions.length} câu hỏi.`}
                  en={`You have answered ${answeredCount} / ${questions.length} questions.`}
                />
              </p>
              {answeredCount < questions.length && (
                <p className="m-0 text-amber-800 font-medium flex items-center gap-1.5 text-xs">
                  <AlertCircle size={14} className="shrink-0 text-amber-600" />
                  <span>
                    <BilingualText
                      vi={`Vẫn còn ${questions.length - answeredCount} câu chưa có câu trả lời. Bạn có chắc muốn nộp ngay?`}
                      en={`There are still ${questions.length - answeredCount} unanswered questions. Are you sure you want to submit now?`}
                    />
                  </span>
                </p>
              )}
            </div>

            <p className="text-xs text-[#64748B] m-0">
              <BilingualText>
                {"Sau khi nộp, hệ thống sẽ tự động chấm điểm và cung cấp giải thích chi tiết cho từng câu."}
              </BilingualText>
            </p>

            <div className="actions flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                className="button secondary px-4 py-2 rounded-xl text-xs font-bold text-[#253044] bg-stone-100 hover:bg-stone-200 border border-stone-300 cursor-pointer"
                disabled={busy}
                onClick={() => setConfirm(false)}
              >
                <BilingualText>{"Kiểm tra lại bài"}</BilingualText>
              </button>
              <button
                type="button"
                className="button px-5 py-2 rounded-xl text-xs font-black text-white bg-[#F97316] hover:bg-[#C2410C] shadow-sm cursor-pointer"
                disabled={busy}
                onClick={finish}
              >
                <BilingualText>{busy ? 'Đang nộp…' : 'Xác nhận nộp'}</BilingualText>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}

/**
 * =========================================================================
 * 3. QUIZ RESULT SCREEN (QuizResultPage)
 * =========================================================================
 */
export function QuizResultPage() {
  const { attemptId } = useParams();
  const resource = useAsyncResource(
    useCallback((signal) => contentService.result(attemptId, signal), [attemptId])
  );

  return (
    <ResourceState resource={resource}>
      {(result) => <Result result={result} />}
    </ResourceState>
  );
}

function Result({ result }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function retry() {
    setBusy(true);
    try {
      const attempt = await contentService.startQuiz(result.quizId);
      navigate(`/quiz-attempts/${attempt.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const back =
    result.lessonId && result.courseId
      ? `/learn/${result.courseId}/lesson/${result.lessonId}`
      : result.courseId
      ? `/courses/${result.courseId}`
      : '/my-learning';

  const percentage = Math.round(Number(result.percentage || 0));
  const passed = Boolean(result.passed);

  return (
    <section className="quiz-result-screen w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to={back}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#253044] transition-colors no-underline"
        >
          <ArrowLeft size={14} />
          <span>
            <BilingualText>{result.courseId ? 'Về khóa học' : 'Về góc học tập'}</BilingualText>
          </span>
        </Link>
      </div>

      {/* Main Result Celebration Card */}
      <div className="quiz-result card relative overflow-hidden rounded-3xl bg-white border border-[#E5E7EB] p-6 sm:p-10 shadow-sm text-center space-y-6">
        {passed && <FireworksBackground active={true} />}
        {/* Celebration / Outcome Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs mx-auto border"
          style={{
            backgroundColor: passed ? '#F0FDF4' : '#FEF2F2',
            color: passed ? '#16A34A' : '#EF4444',
            borderColor: passed ? '#BBF7D0' : '#FECACA',
          }}
        >
          {passed ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <BilingualText>{passed ? 'Hoàn thành xuất sắc • Passed' : 'Cần ôn tập thêm • Keep Trying'}</BilingualText>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] tracking-tight">
          <BilingualText vi={result.quizTitleVi || result.quizTitle} en={result.quizTitle} />
        </h1>

        <p className="text-sm text-[#6B7280] max-w-xl mx-auto">
          <BilingualText
            vi={passed
              ? 'Tuyệt vời! Bạn đã làm chủ tốt các kiến thức trong bài học này.'
              : 'Từng bước nhỏ đều có ý nghĩa. Hãy xem lại các câu trả lời để củng cố kiến thức nhé!'}
            en={passed
              ? 'Great job! You have successfully mastered the knowledge in this lesson.'
              : 'Every small step counts. Review your answers to strengthen your knowledge!'}
          />
        </p>

        {/* Circular Score Badge */}
        <div className="flex justify-center my-4">
          <div
            className={`quiz-score relative flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 shadow-sm transition-all ${
              passed
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                : 'bg-amber-50 border-amber-500 text-amber-800'
            }`}
          >
            <span className="text-4xl font-black tracking-tight"><CountingNumber number={percentage} />%</span>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-80">
              <BilingualText vi={passed ? 'Đạt chuẩn' : 'Chưa đạt'} en={passed ? 'Passed' : 'Needs Practice'} />
            </span>
          </div>
        </div>

        {/* 3 KPI Breakdown Cards */}
        <div className="grid grid-cols-3 gap-3.5 max-w-lg mx-auto">
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 text-center shadow-2xs space-y-0.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block tracking-wider">
              <BilingualText vi="Câu đúng" en="Correct" />
            </span>
            <strong className="text-xl font-black text-emerald-800"><CountingNumber value={result.correctCount} /></strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-rose-200 text-center shadow-2xs space-y-0.5">
            <span className="text-[10px] font-bold text-rose-700 uppercase block tracking-wider">
              <BilingualText vi="Câu sai" en="Incorrect" />
            </span>
            <strong className="text-xl font-black text-rose-800"><CountingNumber value={result.incorrectCount} /></strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 text-center shadow-2xs space-y-0.5">
            <span className="text-[10px] font-bold text-stone-500 uppercase block tracking-wider">
              <BilingualText vi="Chưa làm" en="Unanswered" />
            </span>
            <strong className="text-xl font-black text-stone-700">{result.unansweredCount}</strong>
          </div>
        </div>

        {error && (
          <Notice kind="error">
            <BilingualText>{error}</BilingualText>
          </Notice>
        )}

        {/* Action Buttons */}
        <div className="quiz-result-actions flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#E5E7EB]">
          <Link
            to={back}
            className="button inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#F28C45] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-sm transition-all no-underline cursor-pointer"
          >
            <BilingualText>{"Tiếp tục học ngay →"}</BilingualText>
          </Link>

          <a
            href="#review-answers"
            className="button secondary inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-white hover:bg-stone-50 text-[#1F2937] border border-[#E5E7EB] font-bold text-xs sm:text-sm shadow-2xs transition-all no-underline"
          >
            <BilingualText>{"Xem chi tiết đáp án ↓"}</BilingualText>
          </a>

          <button
            type="button"
            disabled={busy || !result.canRetry}
            onClick={retry}
            className="secondary inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-white hover:bg-[#FFF4E8] text-[#1F2937] border border-[#E5E7EB] font-bold text-xs sm:text-sm disabled:opacity-40 transition-all cursor-pointer"
          >
            <RotateCcw size={14} className={busy ? 'animate-spin' : ''} />
            <BilingualText>{busy ? 'Đang chuẩn bị…' : 'Làm lại quiz'}</BilingualText>
          </button>
        </div>
      </div>

      {/* Review Answers Section */}
      <section className="quiz-workspace space-y-4" id="review-answers">
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
          <BookOpen size={20} className="text-[#F28C45]" />
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#1F2937] m-0">
              <BilingualText>{"Xem lại câu trả lời và giải thích chi tiết"}</BilingualText>
            </h2>
            <p className="text-xs text-[#6B7280] m-0">
              <BilingualText>{"Đối chiếu câu trả lời của bạn với đáp án chính xác của hệ thống."}</BilingualText>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {result.questions?.map((question, qIdx) => {
            const isCorrect = Boolean(question.isCorrect);

            return (
              <details
                className="answer-review card group rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs open:shadow-xs transition-all"
                key={question.questionId || qIdx}
                open
              >
                <summary className="flex items-start justify-between gap-3 cursor-pointer select-none list-none font-bold text-sm sm:text-base text-[#1F2937]">
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`answer-mark w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs ${
                        isCorrect
                          ? 'correct bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? '✓' : '✕'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#F28C45]">
                          <BilingualText vi={`Câu ${qIdx + 1}`} en={`Question ${qIdx + 1}`} />
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isCorrect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <BilingualText vi={isCorrect ? 'Chính xác' : 'Chưa đúng'} en={isCorrect ? 'Correct' : 'Incorrect'} />
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-[#1F2937] leading-snug">
                        <BilingualText vi={question.promptVi || question.prompt} en={question.prompt} />
                      </h3>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-stone-400 group-open:rotate-180 transition-transform mt-1">
                    ▼
                  </span>
                </summary>

                {/* Question Details Body */}
                <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-3 text-xs sm:text-sm pl-10">
                  {/* Learner's Answer */}
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <strong className="text-stone-600 block text-[11px] uppercase tracking-wider mb-0.5">
                      <BilingualText>{"Bạn trả lời:"}</BilingualText>
                    </strong>
                    <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {answerLabel(question.answer, question.options)}
                    </span>
                  </div>

                  {/* Correct Answer */}
                  {!isCorrect && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <strong className="text-emerald-800 block text-[11px] uppercase tracking-wider mb-0.5">
                        <BilingualText>{"Đáp án chính xác:"}</BilingualText>
                      </strong>
                      <span className="font-bold text-emerald-900">
                        {answerLabel(question.correctAnswer, question.options)}
                      </span>
                    </div>
                  )}

                  {/* Explanation */}
                  {(question.explanationVi || question.explanation) && (
                    <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] text-[#1F2937] flex items-start gap-2.5">
                        <div className="space-y-0.5">
                        <strong className="text-xs font-bold text-[#F28C45] block">
                          <BilingualText vi="Giải thích:" en="Explanation:" />
                        </strong>
                        <p className="text-xs text-[#6B7280] m-0 leading-relaxed">
                          {question.explanationVi || question.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </section>
  );
}

export default QuizPage;
