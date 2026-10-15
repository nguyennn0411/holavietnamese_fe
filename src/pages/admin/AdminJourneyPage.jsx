import { useCallback, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { BilingualText, vietnameseLabel } from '@/components/common/BilingualText';
import { Breadcrumb, EmptyState, Notice, PageHeader } from '@/components/common/Ui';
import { ResourceState } from '@/components/common/ResourceState';
import { DestinationRegion } from '@/components/destinations/DestinationMetadata';
import { moveItem } from '@/components/learning/answerUtils';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { adminDestinationService } from '@/services/destinationService';
import { adminJourneyService } from '@/services/journeyService';
import { DESTINATION_STATUSES } from '@/models/Destination';
import { ROUTES } from '@/constants/routes';
import '@/components/destinations/destinations.css';

export function AdminJourneyPage() {
  const resource = useAsyncResource(useCallback(async signal => {
    const [configuration, destinations] = await Promise.all([adminJourneyService.get({ signal }), adminDestinationService.list({}, { signal })]);
    return { configuration, destinations };
  }, []));
  return <section className="admin-destinations-page admin-journey-page">
    <Breadcrumb items={[{ label: 'Điểm đến', to: ROUTES.ADMIN_DESTINATIONS }, { label: 'Thiết lập hành trình' }]} />
    <PageHeader eyebrow="Khám phá Việt Nam" title="Thiết lập hành trình" description="Chọn điểm dừng và lưu thứ tự khám phá Việt Nam." />
    <ResourceState resource={resource}>{data => <JourneyEditor initial={data.configuration.stops} destinations={data.destinations} />}</ResourceState>
  </section>;
}

function JourneyEditor({ initial, destinations }) {
  const [stops, setStops] = useState(initial);
  const [selected, setSelected] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const available = destinations.filter(d => !stops.some(s => s.destination.id === d.id));
  function add() {
    const destination = available.find(d => String(d.id) === selected);
    if (destination) { setStops(current => [...current, { destination, status: 'DRAFT' }]); setSelected(''); setMessage(''); }
  }
  async function save(event) {
    event.preventDefault(); if (pending) return;
    setPending(true); setError(null); setMessage('');
    try { setStops((await adminJourneyService.save(stops)).stops); setMessage('Đã lưu thứ tự hành trình.'); }
    catch (failure) { setError(failure); }
    finally { setPending(false); }
  }
  return <form className="admin-journey-form" onSubmit={save}>
    <fieldset disabled={pending} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
      <section className="admin-card">
        <div className="actions"><label><BilingualText vi="Thêm điểm dừng" en="Add a stop" /><select value={selected} onChange={event => setSelected(event.target.value)}><option value="">Chọn điểm đến</option>{available.map(d => <option key={d.id} value={d.id}>{d.nameVi} · {vietnameseLabel(d.status)}</option>)}</select></label><button type="button" className="secondary" disabled={!selected} onClick={add}><BilingualText>Thêm</BilingualText></button></div>
        <p className="muted"><BilingualText vi="Điểm được xuất bản đầu tiên trong danh sách là điểm khởi đầu. Chỉ điểm dừng và điểm đến cùng được xuất bản mới xuất hiện với học viên." en="The first published stop is the start. Both the stop and its destination must be published to appear for learners." /></p>
        {stops.length === 0 ? <EmptyState title="Chưa có điểm dừng" /> : <div style={{ overflowX: 'auto' }}><table className="admin-table"><thead><tr><th>Thứ tự</th><th>Điểm đến</th><th>Vùng miền</th><th>Trạng thái điểm dừng</th><th>Thao tác</th></tr></thead><tbody>{stops.map((stop, index) => <tr key={stop.destination.id}>
          <td><span className="journey-order">{index + 1}</span></td><td><Link to={generatePath(ROUTES.ADMIN_DESTINATION_DETAIL, { id: String(stop.destination.id) })}>{stop.destination.nameVi}</Link></td><td><DestinationRegion value={stop.destination.region} /></td>
          <td><select aria-label={`Trạng thái ${stop.destination.nameVi}`} value={stop.status} onChange={event => setStops(current => current.map(s => s.destination.id === stop.destination.id ? { ...s, status: event.target.value } : s))}>{DESTINATION_STATUSES.map(status => <option key={status} value={status}>{vietnameseLabel(status)}</option>)}</select></td>
          <td><div className="actions"><button type="button" className="secondary" disabled={index === 0} aria-label={`Đưa ${stop.destination.nameVi} lên`} onClick={() => setStops(current => moveItem(current, index, -1))}>↑</button><button type="button" className="secondary" disabled={index === stops.length - 1} aria-label={`Đưa ${stop.destination.nameVi} xuống`} onClick={() => setStops(current => moveItem(current, index, 1))}>↓</button><button type="button" className="secondary" onClick={() => setStops(current => current.filter(s => s.destination.id !== stop.destination.id))}><BilingualText>Xóa</BilingualText></button></div></td>
        </tr>)}</tbody></table></div>}
      </section>
      <section className="admin-card"><label><BilingualText vi="Quy tắc mở khóa" en="Unlock rule" /><select value="PREVIOUS_COMPLETED" onChange={() => {}}><option value="PREVIOUS_COMPLETED">Hoàn thành điểm đến trước · Complete the previous stop</option></select></label><p className="muted"><BilingualText vi="Hoàn thành toàn bộ Lesson được gắn để nhận dấu Passport và mở điểm kế tiếp. Điểm đến không có Lesson chưa thể hoàn thành." en="Complete all linked lessons to earn a passport stamp and unlock the next stop. Stops without lessons cannot be completed." /></p></section>
      <div className="actions"><Link className="button secondary" to={ROUTES.ADMIN_DESTINATIONS}><BilingualText>Về danh sách điểm đến</BilingualText></Link><button type="submit"><BilingualText vi={pending ? 'Đang lưu…' : 'Lưu hành trình'} en={pending ? 'Saving…' : 'Save journey'} /></button></div>
    </fieldset>
    {error && <Notice><BilingualText>{error.message}</BilingualText></Notice>}
    {message && <Notice kind="success"><BilingualText vi={message} en="Journey order saved." /></Notice>}
  </form>;
}
