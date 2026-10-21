import { BilingualText } from '@/components/common/BilingualText';
import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/application/context/AuthContext';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { vocabularyReviewService } from '@/services/vocabularyReviewService';
import { ResourceState } from '@/components/common/ResourceState';
import { PageHeader, SpeakButton, EmptyState } from '@/components/common/Ui';
import { ProgressBar } from '@/components/common/ProgressBar';
import { VocabularyNavigation } from '@/components/vocabulary/VocabularyNavigation';
import '@/components/vocabulary/vocabulary.css';
import { CircleCheck, RotateCcw, Gauge, Check, CheckCheck } from 'lucide-react';

export function VocabularyReviewPage() {
  const { user } = useAuth();
  const storageKey = `vocabulary-review:${user?.userId ?? user?.id ?? user?.username ?? 'current'}`;
  const resource = useAsyncResource(useCallback(async signal => {
    const session = await vocabularyReviewService.session(localStorage.getItem(storageKey) ?? sessionStorage.getItem(storageKey), { signal });
    if (!signal.aborted) localStorage.setItem(storageKey, session.sessionId);
    return session;
  }, [storageKey]));
  const restart = () => { localStorage.removeItem(storageKey); sessionStorage.removeItem(storageKey); resource.reload(); };
  return <section className="vocabulary-ui vocabulary-review-page"><PageHeader eyebrow="Ôn từng chút một" title="Ôn tập từ vựng" description="Một vài phút để những từ mới trở nên quen thuộc." actions={<Link to={ROUTES.VOCABULARY_NOTEBOOK} className="button secondary"><BilingualText>{"← Sổ từ vựng"}</BilingualText></Link>} /><VocabularyNavigation active="review" count={!resource.loading && !resource.error ? resource.data?.notebookCount : undefined} /><ResourceState resource={resource}>{session => session.entries.length || session.results.length ? <ReviewDeck key={session.sessionId} session={session} onRestart={restart} /> : <EmptyState title={session.notebookCount ? 'Bạn đã ôn hết các từ đến hạn' : 'Sổ tay của bạn đang chờ từ đầu tiên'} description={session.notebookCount ? 'Lịch ôn tiếp theo đã được lưu trong sổ tay.' : 'Thêm từ hoặc lưu từ trong khi học để bắt đầu ôn tập.'}><Link className="button" to={ROUTES.VOCABULARY_NOTEBOOK}><BilingualText>{session.notebookCount ? 'Về sổ tay' : 'Thêm từ vựng'}</BilingualText></Link></EmptyState>}</ResourceState></section>;
}
function ReviewDeck({ session, onRestart }) {
  const entries = session.entries;
  const [index, setIndex] = useState(0), [revealed, setRevealed] = useState(false), [results, setResults] = useState(session.results);
  const [pending, setPending] = useState(false), [error, setError] = useState('');
  const submitting = useRef(false);
  const goodCount = results.filter(result => result.rating === 'GOOD' || result.rating === 'EASY').length;
  const moreCount = results.length - goodCount;
  const labels = { AGAIN: 'Ôn lại', HARD: 'Khó', GOOD: 'Nhớ được', EASY: 'Dễ' };
  const ratingIcons = { AGAIN: RotateCcw, HARD: Gauge, GOOD: Check, EASY: CheckCheck };
  if (index >= entries.length) return <div className="review-summary card">
    <span className="state-symbol" aria-hidden="true"><CircleCheck size={36} /></span>
    <p className="eyebrow"><BilingualText>{"Hoàn thành ôn tập"}</BilingualText></p><h2><BilingualText>{"Một chút tiến bộ hôm nay."}</BilingualText></h2>
    <div className="vocabulary-review-completion"><strong>100%</strong><span><BilingualText>{"Hoàn thành phiên ôn tập"}</BilingualText></span></div>
    <p><BilingualText vi={<>Bạn đã ôn {results.length} từ trong phiên này.</>} en={<>You reviewed {results.length} words in this session.</>} /></p>
    <div className="vocabulary-review-statistics">
      <div><strong>{results.length}</strong><span><BilingualText>{"Tổng số từ đã ôn"}</BilingualText></span></div>
      <div><strong>{goodCount}</strong><span><BilingualText>{"Nhớ được / Dễ"}</BilingualText></span></div>
      <div><strong>{moreCount}</strong><span><BilingualText>{"Ôn lại"}</BilingualText></span></div>
    </div>
    <p className="muted"><BilingualText vi={<>{moreCount} từ cần ôn thêm. Kết quả và lịch ôn đã được lưu.</>} en={<>{moreCount} words need more practice. Results and review schedules have been saved.</>} /></p>
    <div className="actions"><button onClick={onRestart}><BilingualText>{"Ôn lại"}</BilingualText></button><Link className="button secondary" to={ROUTES.VOCABULARY_NOTEBOOK}><BilingualText>{"Về sổ tay"}</BilingualText></Link><Link className="text-link" to={ROUTES.VOCABULARY}><BilingualText>{"Về từ vựng"}</BilingualText></Link></div>
    <ul className="vocabulary-review-results">{results.map(result => <li key={result.entryId}><span>{result.word}</span><span className={`vocabulary-rating vocabulary-rating--${result.rating.toLowerCase()}`}><BilingualText>{labels[result.rating]}</BilingualText><br /><time dateTime={result.nextReviewAt}>{new Date(result.nextReviewAt).toLocaleString()}</time></span></li>)}</ul>
  </div>;
  const word = entries[index];
  async function rate(value) {
    if (submitting.current) return;
    submitting.current = true; setPending(true); setError('');
    try {
      const result = await vocabularyReviewService.rate(word.id, session.sessionId, value);
      setResults(previous => [...previous, result]); setRevealed(false); setIndex(previous => previous + 1);
    } catch (failure) { setError(failure.message); }
    finally { submitting.current = false; setPending(false); }
  }
  const total = entries.length + session.results.length;
  return <div className="review-workspace"><ProgressBar value={(results.length / total) * 100} label={`${results.length + 1} / ${total} từ`} /><article className="review-flashcard card" data-revealed={revealed}><p className="eyebrow">{word.courseTitle || <BilingualText>Sổ tay của bạn</BilingualText>}</p><h2 lang="vi">{word.word}</h2><SpeakButton text={word.word} audioUrl={word.audioUrl} /><p className="muted">{word.pronunciation}</p>{revealed ? <div className="review-answer" aria-live="polite"><p>{word.meaning}</p>{word.exampleSentence && <blockquote>{word.exampleSentence}</blockquote>}</div> : <p className="review-question"><BilingualText>{"Bạn có nhớ từ này không?"}</BilingualText></p>}<button disabled={pending} onClick={() => setRevealed(value => !value)}><BilingualText>{revealed ? 'Ẩn đáp án' : 'Xem đáp án'}</BilingualText></button></article>{error && <p role="alert">{error}</p>}<div className="review-ratings">{Object.entries(labels).map(([id, label]) => { const Icon = ratingIcons[id]; return <button key={id} className={`secondary vocabulary-rating-action vocabulary-rating-action--${id.toLowerCase()}`} disabled={!revealed || pending} onClick={() => rate(id)}><Icon size={18} aria-hidden="true" /><BilingualText>{label}</BilingualText></button>; })}</div></div>;
}
