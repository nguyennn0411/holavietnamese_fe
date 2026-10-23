import { useTranslation } from 'react-i18next';
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
  return <section className="vocabulary-ui vocabulary-review-page"><PageHeader eyebrow={<BilingualText vi="Ôn từng chút một" en="A little practice at a time" />} title={<BilingualText vi="Ôn tập từ vựng" en="Vocabulary review" />} description={<BilingualText vi="Một vài phút để những từ mới trở nên quen thuộc." en="A few minutes to make new words familiar." />} actions={<><Link to={`${ROUTES.MY_LEARNING}?tab=vocabulary`} className="button secondary"><BilingualText vi="← Góc học tập" en="← My learning" /></Link><Link to={ROUTES.VOCABULARY_NOTEBOOK} className="button secondary"><BilingualText vi="Sổ từ vựng" en="Vocabulary notebook" /></Link></>} /><ResourceState resource={resource}>{session => session.entries.length || session.results.length ? <ReviewDeck key={session.sessionId} session={session} onRestart={restart} /> : <EmptyState title={session.notebookCount ? 'Bạn đã ôn hết các từ đến hạn' : 'Sổ tay của bạn đang chờ từ đầu tiên'} description={session.notebookCount ? 'Lịch ôn tiếp theo đã được lưu trong sổ tay.' : 'Thêm từ hoặc lưu từ trong khi học để bắt đầu ôn tập.'}><Link className="button" to={ROUTES.VOCABULARY_NOTEBOOK}><BilingualText>{session.notebookCount ? 'Về sổ tay' : 'Thêm từ vựng'}</BilingualText></Link></EmptyState>}</ResourceState></section>;
}
function ReviewDeck({ session, onRestart }) {
  const { i18n } = useTranslation();
  const locale = (i18n.resolvedLanguage || i18n.language).startsWith('vi') ? 'vi-VN' : 'en-US';
  const entries = session.entries;
  const [index, setIndex] = useState(0), [revealed, setRevealed] = useState(false), [results, setResults] = useState(session.results);
  const [pending, setPending] = useState(false), [error, setError] = useState('');
  const submitting = useRef(false);
  const goodCount = results.filter(result => result.rating === 'GOOD' || result.rating === 'EASY').length;
  const moreCount = results.length - goodCount;
  const labels = {
    AGAIN: { vi: 'Ôn lại', en: 'Again' },
    HARD: { vi: 'Khó', en: 'Hard' },
    GOOD: { vi: 'Nhớ được', en: 'Good' },
    EASY: { vi: 'Dễ', en: 'Easy' }
  };
  const ratingIcons = { AGAIN: RotateCcw, HARD: Gauge, GOOD: Check, EASY: CheckCheck };
  if (index >= entries.length) return <div className="review-summary card">
    <span className="state-symbol" aria-hidden="true"><CircleCheck size={36} /></span>
    <p className="eyebrow"><BilingualText vi="Hoàn thành ôn tập" en="Review complete" /></p><h2><BilingualText vi="Một chút tiến bộ hôm nay." en="A little progress today." /></h2>
    <div className="vocabulary-review-completion"><strong>100%</strong><span><BilingualText vi="Hoàn thành phiên ôn tập" en="Review session complete" /></span></div>
    <p><BilingualText vi={<>Bạn đã ôn {results.length} từ trong phiên này.</>} en={<>You reviewed {results.length} words in this session.</>} /></p>
    <div className="vocabulary-review-statistics">
      <div><strong>{results.length}</strong><span><BilingualText vi="Tổng số từ đã ôn" en="Total words reviewed" /></span></div>
      <div><strong>{goodCount}</strong><span><BilingualText vi="Nhớ được / Dễ" en="Good / Easy" /></span></div>
      <div><strong>{moreCount}</strong><span><BilingualText vi="Ôn lại" en="Again" /></span></div>
    </div>
    <p className="muted"><BilingualText vi={<>{moreCount} từ cần ôn thêm. Kết quả và lịch ôn đã được lưu.</>} en={<>{moreCount} words need more practice. Results and review schedules have been saved.</>} /></p>
    <div className="actions"><button onClick={onRestart}><BilingualText vi="Ôn lại" en="Again" /></button><Link className="button secondary" to={ROUTES.VOCABULARY_NOTEBOOK}><BilingualText vi="Về sổ tay" en="Back to notebook" /></Link><Link className="text-link" to={`${ROUTES.MY_LEARNING}?tab=vocabulary`}><BilingualText vi="Về góc học tập" en="Back to my learning" /></Link></div>
    <ul className="vocabulary-review-results">{results.map(result => <li key={result.entryId}><span>{result.word}</span><span className={`vocabulary-rating vocabulary-rating--${result.rating.toLowerCase()}`}><BilingualText vi={labels[result.rating]?.vi} en={labels[result.rating]?.en} /><br /><time dateTime={result.nextReviewAt}>{new Date(result.nextReviewAt).toLocaleString(locale)}</time></span></li>)}</ul>
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
  return <div className="review-workspace"><ProgressBar value={(results.length / total) * 100} label={`${results.length + 1} / ${total} ${locale === 'vi-VN' ? 'từ' : 'words'}`} /><article className="review-flashcard card" data-revealed={revealed}><p className="eyebrow">{word.courseTitle || <BilingualText vi="Sổ tay của bạn" en="Your notebook" />}</p><h2 lang="vi">{word.word}</h2><SpeakButton text={word.word} audioUrl={word.audioUrl} /><p className="muted">{word.pronunciation}</p>{revealed ? <div className="review-answer" aria-live="polite"><p>{word.meaning}</p>{word.exampleSentence && <blockquote>{word.exampleSentence}</blockquote>}</div> : <p className="review-question"><BilingualText vi="Bạn có nhớ từ này không?" en="Do you remember this word?" /></p>}<button disabled={pending} onClick={() => setRevealed(value => !value)}><BilingualText>{revealed ? 'Ẩn đáp án' : 'Xem đáp án'}</BilingualText></button></article>{error && <p role="alert">{error}</p>}<div className="review-ratings">{Object.entries(labels).map(([id, item]) => { const Icon = ratingIcons[id]; return <button key={id} className={`secondary vocabulary-rating-action vocabulary-rating-action--${id.toLowerCase()}`} disabled={!revealed || pending} onClick={() => rate(id)}><Icon size={18} aria-hidden="true" /><BilingualText vi={item.vi} en={item.en} /></button>; })}</div></div>;
}
