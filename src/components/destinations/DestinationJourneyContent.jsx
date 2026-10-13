import { useCallback, useRef, useState } from 'react';
import { useAuth } from '@/application/context/AuthContext';
import { generatePath, Link } from 'react-router-dom';
import { BilingualText } from '@/components/common/BilingualText';
import { ResourceState } from '@/components/common/ResourceState';
import { ProgressBar } from '@/components/common/ProgressBar';
import { EmptyState, Notice, Tabs } from '@/components/common/Ui';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { journeyService } from '@/services/journeyService';
import { ROUTES } from '@/constants/routes';

const tabs = [{ id: 'learn', label: 'Learn' }, { id: 'language', label: 'Local Language' }, { id: 'culture', label: 'Culture' }, { id: 'practice', label: 'Practice' }];
export function DestinationJourneyContent({ destinationId }) {
  const { isAuthenticated, user } = useAuth();
  const viewerId = user?.id ?? user?.userId;
  const [tab, setTab] = useState('learn');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const completing = useRef(false);
  const resource = useAsyncResource(useCallback(signal => {
    if (!isAuthenticated) throw Object.assign(new Error('Đăng nhập để xem tiến độ.'), { status: 401 });
    return journeyService.start(destinationId, { signal });
  }, [destinationId, viewerId, isAuthenticated]));
  async function complete() {
    if (completing.current) return;
    completing.current = true; setPending(true); setError(null);
    try { await journeyService.complete(destinationId); resource.reload(); }
    catch (failure) { setError(failure); }
    finally { completing.current = false; setPending(false); }
  }
  return <section className="card" style={{ marginTop: 20 }}>
    <Tabs items={tabs} value={tab} onChange={setTab} />
    {!isAuthenticated ? <EmptyState title="Đăng nhập để xem tiến độ"><Link className="button" to={ROUTES.LOGIN}><BilingualText>Đăng nhập</BilingualText></Link></EmptyState> : <ResourceState resource={resource}>{data => <>
      {tab === 'learn' && (data.lessons.length ? <ul>{data.lessons.map(lesson => <li key={lesson.id}><Link to={generatePath(ROUTES.LEARN_LESSON, { courseId: String(lesson.courseId), lessonId: String(lesson.id) })}><BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} /></Link>{lesson.completed && <> · <BilingualText vi="Đã hoàn thành" en="Completed" /></>}</li>)}</ul> : <EmptyState title="Chưa có bài học liên kết" />)}
      {tab === 'language' && (data.vocabulary.length ? <ul>{data.vocabulary.map(word => <li key={word.id}><Link to={generatePath(ROUTES.VOCABULARY_CATALOG_DETAIL, { id: String(word.id) })}>{word.word}</Link>{word.pronunciation && ` · ${word.pronunciation}`}</li>)}</ul> : <EmptyState title="Chưa có từ ngữ địa phương liên kết" />)}
      {(tab === 'culture' || tab === 'practice') && <EmptyState title="Nội dung chưa sẵn sàng" description={tab === 'culture' ? 'Chưa có nội dung văn hóa được liên kết với điểm đến này.' : 'Chưa có bài luyện được liên kết với điểm đến này.'} />}
      {data.journey && <>
        <ProgressBar value={data.journey.progressPercent} label="Tiến độ điểm đến" />
        <p className="muted"><BilingualText vi={`${data.journey.completedLessons}/${data.journey.requiredLessons} bài học đã hoàn thành`} en={`${data.journey.completedLessons}/${data.journey.requiredLessons} lessons completed`} /></p>
        {data.journey.passportStamped ? <Notice kind="success"><BilingualText vi="Đã hoàn thành điểm đến và nhận dấu Passport." en="Destination completed and passport stamp earned." /></Notice> : <>
          {data.completionBlockedReason && <p className="muted"><BilingualText>{data.completionBlockedReason}</BilingualText></p>}
          <button type="button" disabled={pending || !data.journey.canComplete} onClick={complete}><BilingualText vi={pending ? 'Đang xác nhận…' : 'Hoàn thành điểm đến'} en={pending ? 'Checking…' : 'Complete destination'} /></button>
        </>}
      </>}
      {error && <Notice><BilingualText>{error.message}</BilingualText></Notice>}
    </>}</ResourceState>}
  </section>;
}
