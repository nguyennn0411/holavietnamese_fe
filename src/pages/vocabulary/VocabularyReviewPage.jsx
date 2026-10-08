import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useVocabulary } from '@/hooks/useVocabulary';
import { ResourceState } from '@/components/common/ResourceState';
import { PageHeader, SpeakButton, EmptyState } from '@/components/common/Ui';
import { ProgressBar } from '@/components/common/ProgressBar';
import { VocabularyNavigation } from '@/components/vocabulary/VocabularyNavigation';
import '@/components/vocabulary/vocabulary.css';

export function VocabularyReviewPage() {
  const resource = useVocabulary({ search: '', courseId: '', lessonId: '' });
  return <section className="vocabulary-ui vocabulary-review-page"><PageHeader eyebrow="Ôn từng chút một" title="Ôn tập từ vựng" description="Một vài phút để những từ mới trở nên quen thuộc." actions={<Link to={ROUTES.VOCABULARY_NOTEBOOK} className="button secondary">← Sổ từ vựng</Link>} /><VocabularyNavigation active="review" count={!resource.loading && !resource.error ? resource.data?.length : undefined} /><ResourceState resource={resource}>{entries => entries.length ? <ReviewDeck entries={entries} /> : <EmptyState title="Sổ tay của bạn đang chờ từ đầu tiên" description="Thêm từ hoặc lưu từ trong khi học để bắt đầu ôn tập."><Link className="button" to={ROUTES.VOCABULARY_NOTEBOOK}>Thêm từ vựng</Link></EmptyState>}</ResourceState></section>;
}
function ReviewDeck({ entries }) {
  const [index, setIndex] = useState(0), [revealed, setRevealed] = useState(false), [ratings, setRatings] = useState([]);
  const reset = () => { setIndex(0); setRatings([]); setRevealed(false); };
  if (index >= entries.length) return <div className="review-summary card">
    <span className="state-symbol" aria-hidden="true"><span className="vocabulary-icon vocabulary-icon--complete" /></span>
    <p className="eyebrow">Hoàn thành ôn tập</p><h2>Một chút tiến bộ hôm nay.</h2>
    <div className="vocabulary-review-completion"><strong>100%</strong><span>Hoàn thành phiên ôn tập</span></div>
    <p>Bạn đã ôn {entries.length} từ trong phiên này.</p>
    <div className="vocabulary-review-statistics">
      <div><strong>{entries.length}</strong><span>Tổng số từ đã ôn</span></div>
      <div><strong>{ratings.filter(value => value === 'good' || value === 'easy').length}</strong><span>Nhớ được / Dễ</span></div>
      <div><strong>{ratings.filter(value => value === 'again').length}</strong><span>Ôn lại</span></div>
    </div>
    <p className="muted">{ratings.filter(value => value === 'again').length} từ cần ôn lại. Đánh giá trong phiên này không thay đổi dữ liệu học tập.</p>
    <div className="actions"><button onClick={reset}>Ôn lại</button><Link className="button secondary" to={ROUTES.VOCABULARY_NOTEBOOK}>Về sổ tay</Link><Link className="text-link" to={ROUTES.VOCABULARY}>Về từ vựng</Link></div>
    <ul className="vocabulary-review-results">{entries.map((entry, resultIndex) => <li key={entry.id}><span>{entry.word}</span><span className={`vocabulary-rating vocabulary-rating--${ratings[resultIndex]}`}>{({ again: 'Ôn lại', hard: 'Khó', good: 'Nhớ được', easy: 'Dễ' })[ratings[resultIndex]]}</span></li>)}</ul>
  </div>;
  const word = entries[index];
  const rate = value => { setRatings(previous => [...previous, value]); setRevealed(false); setIndex(previous => previous + 1); };
  return <div className="review-workspace"><ProgressBar value={(index / entries.length) * 100} label={`${index + 1} / ${entries.length} từ`} /><article className="review-flashcard card"><p className="eyebrow">{word.courseTitle || 'Sổ tay của bạn'}</p><h2 lang="vi">{word.word}</h2><SpeakButton text={word.word} audioUrl={word.audioUrl} /><p className="muted">{word.pronunciation}</p>{revealed ? <div className="review-answer" aria-live="polite"><p>{word.meaning}</p>{word.exampleSentence && <blockquote>{word.exampleSentence}</blockquote>}</div> : <p className="review-question">Bạn có nhớ từ này không?</p>}<button onClick={() => setRevealed(value => !value)}>{revealed ? 'Ẩn đáp án' : 'Xem đáp án'}</button></article><div className="review-ratings">{[{id:'again',label:'Ôn lại'},{id:'hard',label:'Khó'},{id:'good',label:'Nhớ được'},{id:'easy',label:'Dễ'}].map(item => <button key={item.id} className="secondary" disabled={!revealed} onClick={() => rate(item.id)}>{item.label}</button>)}</div></div>;
}
