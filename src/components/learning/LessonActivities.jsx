import { useCallback, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { contentService } from '@/services/contentService';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { ResourceState } from '@/components/common/ResourceState';
import { Artwork, SpeakButton, Notice, EmptyState } from '@/components/common/Ui';
import { RichText } from '@/components/common/RichText';
import { ProgressBar } from '@/components/common/ProgressBar';
import { QuestionInput } from './QuestionInput';
import { answerPresent } from './answerUtils';
import { vocabularyService } from '@/services/vocabularyService';
import { ContentImage } from '@/components/common/ContentImage';
import { MediaPlayer } from './MediaPlayer';

const practiceTypes = ['MULTIPLE_CHOICE','FILL_BLANK','MATCHING','REORDER_SENTENCE','LISTEN_AND_CHOOSE','LISTEN_AND_TYPE','LISTENING','TRANSLATION','PRACTICE'];
const externalTypes = ['AI_CONVERSATION','AI_ROLEPLAY','PRONUNCIATION'];

export function LessonActivities({ lessonId, fallback, onProgress, previewLesson }) {
  const resource = useAsyncResource(useCallback(signal => previewLesson ? Promise.resolve(previewLesson) : contentService.lesson(lessonId, signal), [lessonId, previewLesson]));
  return <ResourceState resource={resource}>{lesson => lesson.activities?.length ? <ActivityWorkspace key={lesson.id} lesson={lesson} preview={!!previewLesson} onProgress={onProgress} /> : fallback}</ResourceState>;
}
function ActivityWorkspace({ lesson, preview, onProgress }) {
  const [params,setParams] = useSearchParams();
  const activities = lesson.activities;
  const requested = activities.findIndex(activity => String(activity.id) === params.get('activity'));
  const [index,setIndex] = useState(requested >= 0 ? requested : 0), [busy,setBusy] = useState(false), [error,setError] = useState(''), [feedback,setFeedback] = useState(''), [progress,setProgress] = useState(lesson.progress);
  const activity = activities[index];
  const [answer,setAnswer] = useState({});
  const exercise = practiceTypes.includes(activity.activityType), external = externalTypes.includes(activity.activityType);
  const change = next => { setIndex(next); setAnswer({}); setError(''); setFeedback(''); if (!preview) setParams({ activity: String(activities[next].id) }, { replace: true }); };
  async function complete() {
    setBusy(true); setError(''); setFeedback('');
    try {
      const result = await contentService.completeActivity(activity.id, exercise ? answer : undefined);
      setProgress(result); onProgress?.(result);
      if (!result.activityCompleted) { setFeedback('Chưa đúng. Hãy thử lại câu trả lời.'); return; }
      setFeedback('Đã ghi nhận hoạt động.');
      if (index + 1 < activities.length) change(index + 1);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  const completed = progress?.activities?.some(item => String(item.activityId) === String(activity.id) && item.status === 'COMPLETED');
  return <div className="activity-workspace">{preview && <Notice>Chế độ xem trước. Các thao tác ở đây không ghi nhận điểm hoặc tiến độ học viên.</Notice>}<ProgressBar value={progress?.progressPercent ?? 0} label={`${index + 1} / ${activities.length} hoạt động`} /><nav className="activity-steps" aria-label="Các hoạt động trong bài học">{activities.map((item,i) => <button key={item.id} className={i === index ? 'active' : ''} aria-current={i === index ? 'step' : undefined} onClick={() => change(i)}><span>{i + 1}</span>{item.titleVi || item.title}</button>)}</nav><article className={`activity-card card activity-${activity.activityType.toLowerCase()}`}><p className="eyebrow">Hoạt động {index + 1} · {activity.activityType.replaceAll('_',' ')}</p><h2>{activity.titleVi || activity.title}</h2>{activity.instruction && <p className="lead">{activity.instructionVi || activity.instruction}</p>}<ActivityBody key={activity.id} activity={activity} lessonId={lesson.id} answer={answer} setAnswer={setAnswer} busy={busy} preview={preview} />{feedback && <Notice kind={feedback.startsWith('Đã') ? 'success' : 'info'}>{feedback}</Notice>}{error && <Notice kind="error">{error}</Notice>}</article><div className="lesson-navigation"><button className="secondary" disabled={index === 0 || busy} onClick={() => change(index - 1)}>← Trước</button><span className="muted">{preview ? 'Xem trước bài học' : 'Tiến độ được lưu khi hoàn thành hoạt động.'}</span>{preview ? <button disabled={index + 1 >= activities.length} onClick={() => change(index + 1)}>Tiếp tục →</button> : external ? <button className="secondary" disabled={index + 1 >= activities.length} onClick={() => change(index + 1)}>Hoạt động tiếp theo →</button> : <button disabled={busy || (exercise && !answerPresent(answer))} onClick={complete}>{busy ? 'Đang lưu…' : completed ? 'Tiếp tục →' : exercise ? 'Kiểm tra đáp án →' : index + 1 === activities.length ? 'Hoàn thành hoạt động' : 'Tiếp tục →'}</button>}</div></div>;
}
function ActivityBody({ activity, lessonId, answer, setAnswer, busy, preview }) {
  const content = typeof activity.contentJson === 'string' ? JSON.parse(activity.contentJson) : activity.contentJson || {};
  const [translations,setTranslations] = useState(true), [saved,setSaved] = useState(''), [saveError,setSaveError] = useState('');
  const type = activity.activityType;
  async function saveWord(item) {
    try { await vocabularyService.saveWord(item, lessonId); setSaved(item.wordVi); } catch (error) { setSaveError(error.message); }
  }
  if (type === 'QUIZ') return <div className="quiz-gate"><span className="state-symbol">✧</span><h2>Nhìn xem bạn đã nói được gì.</h2><p className="lead">Củng cố kiến thức bằng một bài kiểm tra ngắn.</p>{activity.quizId ? <Link className="button" to={preview ? `/admin/quizzes/${activity.quizId}/preview` : `/quizzes/${activity.quizId}`}>Bắt đầu quiz →</Link> : <EmptyState title="Quiz chưa được liên kết" />}</div>;
  if (externalTypes.includes(type)) return <div className="quiz-gate"><span className="state-symbol">✣</span><h2>Đến lượt bạn trò chuyện.</h2><p className="muted">Hoạt động luyện tập này chưa ghi nhận tiến độ tự động.</p><Link className="button" to={type === 'AI_ROLEPLAY' && content.scenarioId ? `/ai-roleplay/${content.scenarioId}` : type === 'AI_ROLEPLAY' ? '/ai-scenarios' : '/ai-tutor'}>Bắt đầu luyện tập →</Link></div>;
  if (type === 'VOCABULARY' || type === 'FLASHCARD') return <>{content.items?.length ? <div className="activity-vocabulary-grid">{content.items.map((item,index) => <div className="card activity-word" key={index}><div className="row"><span className="badge">{item.wordType || 'Từ vựng'}</span><SpeakButton text={item.wordVi} audioUrl={item.audioUrl} /></div>{item.imageUrl && <ContentImage className="activity-word-image" src={item.imageUrl} alt={item.wordVi || 'Hình minh họa từ vựng'} />}<h3>{item.wordVi}</h3><small>{item.pronunciation}</small><p>{item.meaningEn}</p>{item.exampleVi && <p className="muted">{item.exampleVi}</p>}{!preview && <button className="secondary" onClick={() => saveWord(item)}>Lưu vào sổ tay</button>}</div>)}</div> : <EmptyState title="Chưa có nội dung từ vựng để hiển thị" description="Bạn có thể mở sổ tay để ôn lại các từ đã lưu."><Link className="button secondary" to={ROUTES.VOCABULARY_NOTEBOOK}>Mở sổ tay</Link></EmptyState>}{saved && <Notice kind="success">Đã lưu “{saved}” vào sổ tay.</Notice>}{saveError && <Notice kind="error">{saveError}</Notice>}</>;
  if (type === 'DIALOGUE') return <><div className="actions dialogue-actions"><button className="secondary" onClick={() => setTranslations(value => !value)}>{translations ? 'Ẩn bản dịch' : 'Hiện bản dịch'}</button></div><div className="dialogue-lines">{content.lines?.map((line,index) => <div className={`dialogue-line ${index % 2 ? 'dialogue-line--right' : ''}`} key={index}><span className="dialogue-avatar">{line.speaker?.[0] || (index % 2 ? 'A' : 'B')}</span><div><small>{line.speaker}</small><strong>{line.textVi || line.text}</strong>{translations && <p>{line.textEn || line.translation}</p>}</div><SpeakButton text={line.textVi || line.text} audioUrl={line.audioUrl} /></div>)}</div></>;
  if (type === 'GRAMMAR') return <>{activity.grammarTopics?.map(topic => <div key={topic.id}><h3>{topic.titleVi || topic.title}</h3><div className="ui-notice">{topic.structurePattern}</div><RichText text={topic.explanationVi || topic.explanation} />{topic.examples?.map((example,i) => <blockquote key={i}>{example.vietnameseText}<p className="muted">{example.translation}</p></blockquote>)}</div>)}</>;
  const questionType = ['LISTEN_AND_CHOOSE','LISTEN_AND_TYPE'].includes(type) ? 'LISTENING' : type === 'PRACTICE' ? content.questionType || 'FILL_BLANK' : type;
  const isPractice = practiceTypes.includes(type);
  return <><div className={isPractice || ['AUDIO','LISTENING','SOUND_PATTERN'].includes(type) ? 'activity-prompt' : 'activity-intro'}><div>{content.textVi && <h3 className="editorial-phrase">{content.textVi}</h3>}{(content.promptVi || content.prompt || content.promptEn) && <h3 className="editorial-phrase">{content.promptVi || content.prompt || content.promptEn}</h3>}<RichText text={content.body || content.textEn || content.translation || ''} /><MediaPlayer audioUrl={content.audioUrl} videoUrl={content.videoUrl} />{content.imageUrl && <ContentImage className="activity-content-image" src={content.imageUrl} alt={content.captionVi || content.caption || content.captionEn || activity.titleVi || activity.title || 'Nội dung bài học'} />}{(content.captionVi || content.caption || content.captionEn) && <p className="muted">{content.captionVi || content.caption || content.captionEn}</p>}{(content.transcriptVi || content.transcript || content.transcriptEn) && <details><summary>Xem lời thoại</summary><p>{content.transcriptVi || content.transcript || content.transcriptEn}</p></details>}</div>{!isPractice && type === 'TEXT' && !content.imageUrl && <Artwork kind="food-hero" />}</div>{isPractice && <QuestionInput question={{id:activity.id,questionType,options:content.options||[]}} answer={answer} onChange={setAnswer} disabled={busy} />}</>;
}
