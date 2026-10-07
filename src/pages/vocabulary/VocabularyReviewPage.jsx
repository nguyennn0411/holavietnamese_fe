import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useVocabulary } from '@/hooks/useVocabulary';
import { ResourceState } from '@/components/common/ResourceState';
import { PageHeader, SpeakButton, EmptyState } from '@/components/common/Ui';
import { ProgressBar } from '@/components/common/ProgressBar';

export function VocabularyReviewPage() {
  const resource = useVocabulary({ search: '', courseId: '', lessonId: '' });
  return <section><PageHeader eyebrow="Ôn từng chút một" title="Ôn tập từ vựng" description="Một vài phút để những từ mới trở nên quen thuộc." actions={<Link to={ROUTES.VOCABULARY_NOTEBOOK} className="button secondary">← Sổ từ vựng</Link>} /><ResourceState resource={resource}>{entries => entries.length ? <ReviewDeck entries={entries} /> : <EmptyState title="Sổ tay của bạn đang chờ từ đầu tiên" description="Thêm từ hoặc lưu từ trong khi học để bắt đầu ôn tập."><Link className="button" to={ROUTES.VOCABULARY_NOTEBOOK}>Thêm từ vựng</Link></EmptyState>}</ResourceState></section>;
}
function ReviewDeck({ entries }) {
  const [index, setIndex] = useState(0), [revealed, setRevealed] = useState(false), [ratings, setRatings] = useState([]);
  const reset = () => { setIndex(0); setRatings([]); setRevealed(false); };
  if (index >= entries.length) return <div className="review-summary card"><span className="state-symbol">✧</span><h2>Một chút tiến bộ hôm nay.</h2><p>Bạn đã ôn {entries.length} từ trong phiên này.</p><p className="muted">{ratings.filter(value => value === 'again').length} từ cần ôn lại. Đánh giá trong phiên này không thay đổi dữ liệu học tập.</p><div className="actions"><button onClick={reset}>Ôn lại</button><Link className="button secondary" to={ROUTES.VOCABULARY_NOTEBOOK}>Về sổ tay</Link></div></div>;
  const word = entries[index];
  const rate = value => { setRatings(previous => [...previous, value]); setRevealed(false); setIndex(previous => previous + 1); };
  return <div className="review-workspace"><ProgressBar value={(index / entries.length) * 100} label={`${index + 1} / ${entries.length} từ`} /><article className="review-flashcard card"><p className="eyebrow">{word.courseTitle || 'Sổ tay của bạn'}</p><h2 lang="vi">{word.word}</h2><SpeakButton text={word.word} audioUrl={word.audioUrl} /><p className="muted">{word.pronunciation}</p>{revealed ? <div className="review-answer" aria-live="polite"><p>{word.meaning}</p>{word.exampleSentence && <blockquote>{word.exampleSentence}</blockquote>}</div> : <p className="review-question">Bạn có nhớ từ này không?</p>}<button onClick={() => setRevealed(value => !value)}>{revealed ? 'Ẩn đáp án' : 'Xem đáp án'}</button></article><div className="review-ratings">{[{id:'again',label:'Ôn lại'},{id:'hard',label:'Khó'},{id:'good',label:'Nhớ được'},{id:'easy',label:'Dễ'}].map(item => <button key={item.id} className="secondary" disabled={!revealed} onClick={() => rate(item.id)}>{item.label}</button>)}</div></div>;
}
