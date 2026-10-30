import { useCallback, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { BilingualText, vietnameseLabel, bilingualLabel } from '@/shared/components/common/BilingualText';
import { ContentImage } from '@/shared/components/common/ContentImage';
import { Modal } from '@/shared/components/common/Modal';
import { ResourceState } from '@/shared/components/common/ResourceState';
import { Breadcrumb, EmptyState, Notice, PageHeader } from '@/shared/components/common/Ui';
import { DestinationForm } from '@/features/explore/components/DestinationForm';
import { DestinationRegion, DestinationStatusBadge } from '@/features/explore/components/DestinationMetadata';
import { useAsyncResource } from '@/shared/hooks/useAsyncResource';
import { destinationDate, DESTINATION_REGIONS, DESTINATION_STATUSES } from '@/features/explore/models/Destination';
import { adminDestinationService } from '@/features/explore/api/destinationService';
import { ROUTES } from '@/constants/routes';
import { Plus } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { canReviewExplore, canWriteExplore } from '@/utils/permissions/contentAccess';
import '@/features/explore/components/destinations.css';

const emptyFilters = { keyword: '', status: '', region: '' };

export function AdminDestinationsPage() {
  const { user } = useAuth();
  const mayWrite = canWriteExplore(user);
  const mayReview = canReviewExplore(user);
  const [query, setQuery] = useState(emptyFilters);
  const [keyword, setKeyword] = useState('');
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const resource = useAsyncResource(useCallback(signal => adminDestinationService.list(query, { signal }), [query]));
  const filter = (field, value) => setQuery(current => ({ ...current, [field]: value }));

  function saved() {
    setCreating(false);
    setMessage(bilingualLabel('Đã tạo điểm đến.', 'Destination created.'));
    resource.reload();
  }
  async function transition(item, action) {
    if (action === 'SUBMIT') await adminDestinationService.submitReview(item.id);
    else if (action === 'ARCHIVE') await adminDestinationService.archive(item.id);
    else if (action === 'RESTORE') await adminDestinationService.restore(item.id);
    else if (action === 'REVISE') await adminDestinationService.revise(item.id);
    else await adminDestinationService.review(item.id, action);
    setMessage(action === 'SUBMIT' ? bilingualLabel('Đã gửi điểm đến đi duyệt.', 'Destination submitted for review.')
      : action === 'APPROVE' ? bilingualLabel('Đã duyệt và công khai điểm đến.', 'Destination approved and published.')
        : action === 'REJECT' ? bilingualLabel('Đã trả điểm đến về bản nháp.', 'Destination returned to draft.')
          : action === 'ARCHIVE' ? bilingualLabel('Đã lưu trữ điểm đến.', 'Destination archived.')
            : action === 'RESTORE' ? bilingualLabel('Đã khôi phục điểm đến về bản nháp.', 'Destination restored to draft.')
              : bilingualLabel('Đã chuyển điểm đến về bản nháp để chỉnh sửa.', 'Destination returned to draft for revision.'));
    resource.reload();
  }

  return <div className="admin-destinations-page">
    <Breadcrumb items={[{ label: bilingualLabel('Quản trị', 'Administration'), to: ROUTES.ADMIN }, { label: bilingualLabel('Điểm đến', 'Destinations') }]} />
    <PageHeader eyebrow="Khám phá Việt Nam" title={bilingualLabel("Quản lý điểm đến", "Manage destinations")} description="Quản lý nội dung điểm đến Việt Nam." actions={<>
      {mayWrite && <button type="button" onClick={() => { setMessage(''); setCreating(true); }}><Plus size={16} aria-hidden="true" /><BilingualText vi="Thêm điểm đến" en="Add destination" /></button>}
    </>} />
    {message && <Notice kind="success"><BilingualText vi={message} en="Destination created." /></Notice>}
    <form className="admin-card destination-filters" onSubmit={event => { event.preventDefault(); filter('keyword', keyword.trim()); }}>
      <div className="actions">
        <label style={{ flex: '1 1 220px' }}><BilingualText>Tìm kiếm</BilingualText><input value={keyword} onChange={event => setKeyword(event.target.value)} placeholder={bilingualLabel("Tên tiếng Việt hoặc tiếng Anh", "Vietnamese or English name")} /></label>
        <label style={{ flex: '1 1 150px' }}><BilingualText>Trạng thái</BilingualText><select value={query.status} onChange={event => filter('status', event.target.value)}><option value="">{vietnameseLabel('Tất cả trạng thái')}</option>{DESTINATION_STATUSES.map(status => <option key={status} value={status}>{vietnameseLabel(status)}</option>)}</select></label>
        <label style={{ flex: '1 1 150px' }}><BilingualText vi="Vùng miền" en="Region" /><select value={query.region} onChange={event => filter('region', event.target.value)}><option value="">Tất cả vùng miền</option>{DESTINATION_REGIONS.map(region => <option key={region.value} value={region.value}>{region.vi}</option>)}</select></label>
      </div>
      <div className="actions"><button type="submit"><BilingualText>Tìm kiếm</BilingualText></button><button type="button" className="secondary" onClick={() => { setKeyword(''); setQuery({ ...emptyFilters }); }}><BilingualText>Đặt lại bộ lọc</BilingualText></button></div>
    </form>
    <ResourceState resource={resource}>{items => items.length === 0
      ? <EmptyState title={<BilingualText vi="Không có điểm đến phù hợp" en="No matching destinations" />} />
      : <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}><table className="admin-table">
        <thead><tr><th><BilingualText vi="Ảnh" en="Image" /></th><th><BilingualText vi="Tên tiếng Việt" en="Vietnamese name" /></th><th><BilingualText vi="Tên tiếng Anh" en="English name" /></th><th><BilingualText vi="Vùng miền" en="Region" /></th><th><BilingualText>Trạng thái</BilingualText></th><th><BilingualText>Cập nhật lần cuối</BilingualText></th><th><BilingualText>Thao tác</BilingualText></th></tr></thead>
        <tbody>{items.map(item => {
          const detailPath = generatePath(ROUTES.ADMIN_DESTINATION_DETAIL, { id: String(item.id) });
          return <tr key={item.id}>
            <td><ContentImage src={item.imageUrl} alt={item.nameVi} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} /></td>
            <td><strong lang="vi">{item.nameVi}</strong></td><td lang="en">{item.nameEn}</td><td><DestinationRegion value={item.region} /></td>
            <td><DestinationStatusBadge status={item.status} /></td><td>{destinationDate(item.updatedAt)}</td>
            <td><div className="actions"><Link className="button secondary" to={detailPath}><BilingualText>Chi tiết</BilingualText></Link>
              {mayWrite && item.status === 'DRAFT' && <><Link className="button secondary" to={`${detailPath}?edit=1`}><BilingualText>Sửa</BilingualText></Link><button type="button" onClick={() => transition(item, 'SUBMIT')}><BilingualText vi="Gửi duyệt" en="Submit for review" /></button></>}
              {mayWrite && item.status === 'PUBLISHED' && <button type="button" onClick={() => transition(item, 'REVISE')}><BilingualText vi="Chuyển về nháp để sửa" en="Return to draft to revise" /></button>}
              {mayWrite && ['DRAFT', 'PUBLISHED'].includes(item.status) && <button type="button" className="secondary" onClick={() => transition(item, 'ARCHIVE')}><BilingualText vi="Lưu trữ" en="Archive" /></button>}
              {mayWrite && item.status === 'ARCHIVED' && <button type="button" className="secondary" onClick={() => transition(item, 'RESTORE')}><BilingualText vi="Khôi phục bản nháp" en="Restore draft" /></button>}
              {mayReview && item.status === 'PENDING_REVIEW' && <><button type="button" onClick={() => transition(item, 'APPROVE')}><BilingualText vi="Phê duyệt & công khai" en="Approve & publish" /></button><button type="button" className="secondary" onClick={() => transition(item, 'REJECT')}><BilingualText vi="Trả về bản nháp" en="Return to draft" /></button></>}
            </div></td>
          </tr>;
        })}</tbody>
      </table></div>}
    </ResourceState>
    {creating && <Modal title={<BilingualText vi="Thêm điểm đến" en="Add destination" />} busy={busy} onClose={() => setCreating(false)}>
      <DestinationForm onSaved={saved} onCancel={() => setCreating(false)} onBusyChange={setBusy} />
    </Modal>}
  </div>;
}
