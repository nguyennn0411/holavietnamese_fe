import { useTranslation } from 'react-i18next';
import { BilingualText } from '@/shared/components/common/BilingualText';
import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useAsyncResource } from '@/shared/hooks/useAsyncResource';
import { vocabularyReviewService } from '@/features/vocabulary/api/vocabularyReviewService';
import { vocabularyService } from '@/features/vocabulary/api/vocabularyService';
import { difficultReviewEntries, reviewSessionEntries } from '@/features/vocabulary/models/ReviewSession';
import { ResourceState } from '@/shared/components/common/ResourceState';
import { PageHeader, SpeakButton, EmptyState } from '@/shared/components/common/Ui';
import { ProgressBar } from '@/shared/components/common/ProgressBar';
import { FlipCard, FireworksBackground, CountingNumber, RippleButton } from '@/shared/components/common/animate';
import '@/features/vocabulary/components/vocabulary.css';
import { CircleCheck, RotateCcw, Gauge, Check, CheckCheck } from 'lucide-react';

export function VocabularyReviewPage() {
  const { user } = useAuth();
  const [practiceEntries, setPracticeEntries] = useState(null);
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceError, setPracticeError] = useState('');
  const storageKey = `vocabulary-review:${user?.userId ?? user?.id ?? user?.username ?? 'current'}`;
  const resource = useAsyncResource(useCallback(async signal => {
    const session = await vocabularyReviewService.session(localStorage.getItem(storageKey) ?? sessionStorage.getItem(storageKey), { signal });
    if (!signal.aborted) {
      if (session.entries.length) {
        localStorage.setItem(storageKey, session.sessionId);
      } else {
        localStorage.removeItem(storageKey);
        sessionStorage.removeItem(storageKey);
      }
    }
    return session;
  }, [storageKey]));
  const completeSession = useCallback(() => {
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
  }, [storageKey]);

  async function startFreePractice() {
    if (practiceLoading) return;
    setPracticeLoading(true);
    setPracticeError('');
    try {
      setPracticeEntries(await vocabularyService.list());
    } catch (failure) {
      setPracticeError(failure.message);
    } finally {
      setPracticeLoading(false);
    }
  }
  return (
    <section className="vocabulary-ui vocabulary-review-page">
      <PageHeader
        eyebrow={<BilingualText vi="Ôn từng chút một" en="A little practice at a time" />}
        title={<BilingualText vi="Ôn tập từ vựng" en="Vocabulary review" />}
        description={<BilingualText vi="Một vài phút để những từ mới trở nên quen thuộc." en="A few minutes to make new words familiar." />}
        actions={
          <>
            <Link to={`${ROUTES.MY_LEARNING}?tab=vocabulary`} className="button secondary">
              <BilingualText vi="← Góc học tập" en="← My learning" />
            </Link>
            <Link to={ROUTES.VOCABULARY_NOTEBOOK} className="button secondary">
              <BilingualText vi="Sổ từ vựng" en="Vocabulary notebook" />
            </Link>
          </>
        }
      />
      <ResourceState resource={resource}>
        {session => practiceEntries?.length ? (
          <ReviewDeck
            key={`practice-${session.sessionId}`}
            session={{ ...session, entries: practiceEntries, reviewedEntries: [], results: [] }}
            onComplete={completeSession}
            practiceOnly
          />
        ) : session.entries.length || session.results.length ? (
          <ReviewDeck key={session.sessionId} session={session} onComplete={completeSession} />
        ) : (
          <EmptyState
            title={session.notebookCount
              ? <BilingualText vi="Bạn đã ôn hết các từ đến hạn" en="You have reviewed every word due today" />
              : <BilingualText vi="Sổ tay của bạn đang chờ từ đầu tiên" en="Your notebook is waiting for its first word" />}
            description={session.notebookCount
              ? <BilingualText vi="Lịch ôn tiếp theo đã được lưu trong sổ tay." en="Your next review schedule has been saved." />
              : <BilingualText vi="Thêm từ hoặc lưu từ trong khi học để bắt đầu ôn tập." en="Add or save a word while learning to begin reviewing." />}
          >
            {session.notebookCount > 0 && (
              <button className="button" disabled={practiceLoading} onClick={startFreePractice}>
                <BilingualText
                  vi={practiceLoading ? 'Đang mở...' : 'Ôn lại ngay'}
                  en={practiceLoading ? 'Loading...' : 'Practice now'}
                />
              </button>
            )}
            <Link className="button secondary" to={ROUTES.VOCABULARY_NOTEBOOK}>
              <BilingualText
                vi={session.notebookCount ? 'Về sổ tay' : 'Thêm từ vựng'}
                en={session.notebookCount ? 'Back to notebook' : 'Add vocabulary'}
              />
            </Link>
            {practiceError && <p role="alert">{practiceError}</p>}
          </EmptyState>
        )}
      </ResourceState>
    </section>
  );
}

function ReviewDeck({ session, onComplete, practiceOnly = false }) {
  const { i18n } = useTranslation();
  const locale = (i18n.resolvedLanguage || i18n.language).startsWith('vi') ? 'vi-VN' : 'en-US';
  const entries = session.entries;
  const sessionEntries = reviewSessionEntries(session);
  const [queue, setQueue] = useState(() => entries.map(entry => ({ entry, practice: practiceOnly })));
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState(session.results);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [practiceTotal, setPracticeTotal] = useState(practiceOnly ? entries.length : 0);
  const [practiceMastered, setPracticeMastered] = useState(() => new Set());
  const submitting = useRef(false);
  const goodCount = results.filter(result => result.rating === 'GOOD' || result.rating === 'EASY').length;
  const moreCount = results.length - goodCount;
  const difficultWords = difficultReviewEntries(sessionEntries, results);
  const nextDueAt = [session.nextDueAt, ...results.map(result => result.nextReviewAt)]
    .filter(Boolean)
    .map(value => new Date(value))
    .filter(value => !Number.isNaN(value.getTime()))
    .sort((left, right) => left.getTime() - right.getTime())[0];

  const labels = {
    AGAIN: { vi: 'Chưa nhớ', en: 'Again' },
    HARD: { vi: 'Khó', en: 'Hard' },
    GOOD: { vi: 'Nhớ được', en: 'Good' },
    EASY: { vi: 'Rất dễ', en: 'Easy' }
  };
  const ratingIcons = { AGAIN: RotateCcw, HARD: Gauge, GOOD: Check, EASY: CheckCheck };

  function startPractice(words) {
    setQueue(words.map(entry => ({ entry, practice: true })));
    setPracticeTotal(words.length);
    setPracticeMastered(new Set());
    setRevealed(false);
    setError('');
  }

  if (!queue.length && practiceOnly) {
    return (
      <div className="review-summary card relative overflow-hidden">
        <FireworksBackground active={true} />
        <span className="state-symbol" aria-hidden="true"><CircleCheck size={36} /></span>
        <p className="eyebrow"><BilingualText vi="Hoàn thành luyện tập" en="Practice complete" /></p>
        <h2><BilingualText vi="Bạn có thể luyện lại bất cứ lúc nào." en="You can practice again at any time." /></h2>
        {nextDueAt && (
          <p className="vocabulary-next-review">
            <BilingualText
              vi={`Lần ôn theo lịch tiếp theo: ${formatRelativeDue(nextDueAt, 'vi-VN')}.`}
              en={`Next scheduled review: ${formatRelativeDue(nextDueAt, 'en-US')}.`}
            />
          </p>
        )}
        <div className="actions">
          <RippleButton variant="primary" size="md" onClick={() => startPractice(entries)}>
            <BilingualText vi="Luyện lại toàn bộ" en="Practice all again" />
          </RippleButton>
          <Link className="button secondary" to={ROUTES.VOCABULARY_NOTEBOOK}>
            <BilingualText vi="Về sổ tay" en="Back to notebook" />
          </Link>
        </div>
      </div>
    );
  }

  if (!queue.length) {
    return (
      <div className="review-summary card relative overflow-hidden">
        <FireworksBackground active={true} />
        <span className="state-symbol" aria-hidden="true"><CircleCheck size={36} /></span>
        <p className="eyebrow"><BilingualText vi="Hoàn thành ôn tập" en="Review complete" /></p>
        <h2><BilingualText vi="Một chút tiến bộ hôm nay." en="A little progress today." /></h2>
        <div className="vocabulary-review-completion">
          <strong>100%</strong>
          <span><BilingualText vi="Hoàn thành phiên ôn tập" en="Review session complete" /></span>
        </div>
        <p>
          <BilingualText
            vi={<>Bạn đã ôn <CountingNumber value={results.length} /> từ trong phiên này.</>}
            en={<>You reviewed <CountingNumber value={results.length} /> words in this session.</>}
          />
        </p>
        <div className="vocabulary-review-statistics">
          <div>
            <strong><CountingNumber value={results.length} /></strong>
            <span><BilingualText vi="Tổng số từ đã ôn" en="Total words reviewed" /></span>
          </div>
          <div>
            <strong><CountingNumber value={goodCount} /></strong>
            <span><BilingualText vi="Nhớ được / Rất dễ" en="Good / Easy" /></span>
          </div>
          <div>
            <strong><CountingNumber value={moreCount} /></strong>
            <span><BilingualText vi="Chưa nhớ / Khó" en="Again / Hard" /></span>
          </div>
        </div>
        <p className="muted">
          <BilingualText
            vi={<>{moreCount} từ cần ôn thêm. Kết quả và lịch ôn đã được lưu.</>}
            en={<>{moreCount} words need more practice. Results and review schedules have been saved.</>}
          />
        </p>
        {nextDueAt && (
          <p className="vocabulary-next-review">
            <BilingualText
              vi={`Lần ôn theo lịch tiếp theo: ${formatRelativeDue(nextDueAt, 'vi-VN')}.`}
              en={`Next scheduled review: ${formatRelativeDue(nextDueAt, 'en-US')}.`}
            />
          </p>
        )}
        <div className="actions">
          {difficultWords.length > 0 && (
            <RippleButton variant="primary" size="md" onClick={() => startPractice(difficultWords)}>
              <BilingualText vi="Luyện lại từ chưa nhớ" en="Practice difficult words" />
            </RippleButton>
          )}
          {sessionEntries.length > 0 && (
            <RippleButton variant={difficultWords.length ? 'secondary' : 'primary'} size="md" onClick={() => startPractice(sessionEntries)}>
              <BilingualText vi="Luyện lại toàn bộ" en="Practice all again" />
            </RippleButton>
          )}
          <Link className="button secondary" to={ROUTES.VOCABULARY_NOTEBOOK}>
            <BilingualText vi="Về sổ tay" en="Back to notebook" />
          </Link>
          <Link className="text-link" to={`${ROUTES.MY_LEARNING}?tab=vocabulary`}>
            <BilingualText vi="Về góc học tập" en="Back to my learning" />
          </Link>
        </div>
        <ul className="vocabulary-review-results">
          {results.map(result => (
            <li key={result.entryId}>
              <span>{result.word}</span>
              <span className={`vocabulary-rating vocabulary-rating--${result.rating.toLowerCase()}`}>
                <BilingualText vi={labels[result.rating]?.vi} en={labels[result.rating]?.en} /><br />
                <time dateTime={result.nextReviewAt}>{new Date(result.nextReviewAt).toLocaleString(locale)}</time>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const current = queue[0];
  const word = current.entry;
  const isPractice = current.practice;
  async function rate(value) {
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError('');
    try {
      if (!isPractice) {
        const result = await vocabularyReviewService.rate(word.id, session.sessionId, value);
        setResults(previous => [...previous, result]);
        if (value === 'AGAIN' || value === 'HARD') {
          setPracticeTotal(previous => previous + 1);
        }
        if (queue.slice(1).every(item => item.practice)) onComplete();
      } else if (value === 'GOOD' || value === 'EASY') {
        setPracticeMastered(previous => new Set(previous).add(word.id));
      }
      setQueue(previous => {
        const remaining = previous.slice(1);
        return value === 'AGAIN' || value === 'HARD'
          ? [...remaining, { entry: word, practice: true }]
          : remaining;
      });
      setRevealed(false);
    } catch (failure) {
      setError(failure.message);
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  const total = entries.length + session.results.length;

  return (
    <div className="review-workspace">
      <ProgressBar
        value={isPractice
          ? (practiceTotal ? (practiceMastered.size / practiceTotal) * 100 : 0)
          : (results.length / total) * 100}
        label={isPractice
          ? `${practiceMastered.size} / ${practiceTotal} ${locale === 'vi-VN' ? 'từ đã nhớ' : 'words mastered'}`
          : `${Math.min(results.length + 1, total)} / ${total} ${locale === 'vi-VN' ? 'từ' : 'words'}`}
      />

      {/* 3D FlipCard for interactive Flashcard experience */}
      <FlipCard
        trigger="click"
        flipped={revealed}
        onFlip={(state) => setRevealed(state)}
        className="vocabulary-review-flipcard w-full max-w-lg mx-auto"
        innerClassName="min-h-[260px]"
        front={
          <article className="review-flashcard card w-full h-full flex flex-col items-center justify-center text-center p-6 sm:p-8 cursor-pointer select-none">
            <p className="eyebrow">{word.courseTitle || <BilingualText vi="Sổ tay của bạn" en="Your notebook" />}</p>
            <h2 lang="vi" className="text-3xl font-black text-surface-ink my-2">{word.word}</h2>
            <div onClick={(e) => e.stopPropagation()}>
              <SpeakButton text={word.word} audioUrl={word.audioUrl} />
            </div>
            <p className="muted text-sm my-1">{word.pronunciation}</p>
            <p className="review-question text-xs text-brand-600 font-semibold mt-3">
              <BilingualText vi="Chạm vào thẻ để lật xem nghĩa ↷" en="Tap card to flip for meaning ↷" />
            </p>
          </article>
        }
        back={
          <article className="review-flashcard card w-full h-full flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-brand-50 border-brand-300 cursor-pointer select-none">
            <p className="eyebrow text-brand-600"><BilingualText vi="Ý nghĩa & Ví dụ" en="Meaning & Example" /></p>
            <h3 className="text-xl font-bold text-surface-ink my-2">{word.meaning}</h3>
            {word.exampleSentence && (
              <blockquote className="text-xs text-surface-muted italic max-w-md bg-white/80 p-3 rounded-xl border border-brand-200 my-2">
                “{word.exampleSentence}”
              </blockquote>
            )}
            <p className="text-xs text-surface-muted mt-2">
              <BilingualText vi="Chạm để lật lại từ vựng ↶" en="Tap to flip back ↶" />
            </p>
          </article>
        }
      />

      {error && <p role="alert" className="text-xs text-red-600 text-center">{error}</p>}

      <div className="review-ratings mt-6">
        {Object.entries(labels).map(([id, item]) => {
          const Icon = ratingIcons[id];
          return (
            <button
              key={id}
              className={`secondary vocabulary-rating-action vocabulary-rating-action--${id.toLowerCase()} transition-transform active:scale-95`}
              disabled={!revealed || pending}
              onClick={() => rate(id)}
            >
              <Icon size={18} aria-hidden="true" />
              <BilingualText vi={item.vi} en={item.en} />
            </button>
          );
        })}
      </div>
      {isPractice && (
        <button className="secondary vocabulary-practice-finish" onClick={() => setQueue([])}>
          <BilingualText vi="Kết thúc luyện tập" en="Finish practice" />
        </button>
      )}
    </div>
  );
}

function formatRelativeDue(value, locale) {
  const milliseconds = value.getTime() - Date.now();
  if (milliseconds <= 0) return locale === 'vi-VN' ? 'ngay bây giờ' : 'now';

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'always' });
  const minutes = Math.ceil(milliseconds / 60_000);
  if (minutes < 60) return formatter.format(minutes, 'minute');

  const hours = Math.ceil(milliseconds / 3_600_000);
  if (hours < 24) return formatter.format(hours, 'hour');

  return formatter.format(Math.ceil(milliseconds / 86_400_000), 'day');
}

export default VocabularyReviewPage;
