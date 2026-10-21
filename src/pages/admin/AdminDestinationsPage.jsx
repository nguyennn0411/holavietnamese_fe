import { useCallback, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { BilingualText, vietnameseLabel } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { Modal } from '@/components/common/Modal';
import { ResourceState } from '@/components/common/ResourceState';
import { Breadcrumb, EmptyState, Notice, PageHeader } from '@/components/common/Ui';
import { DestinationForm } from '@/components/destinations/DestinationForm';
import { DestinationRegion, DestinationStatusBadge } from '@/components/destinations/DestinationMetadata';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { destinationDate, DESTINATION_REGIONS, DESTINATION_STATUSES } from '@/models/Destination';
import { adminDestinationService } from '@/services/destinationService';
import { ROUTES } from '@/constants/routes';
import { Plus } from 'lucide-react';
import '@/components/destinations/destinations.css';

const emptyFilters = { keyword: '', status: '', region: '' };

export function AdminDestinationsPage() {
  const [query, setQuery] = useState(emptyFilters);
  const [keyword, setKeyword] = useState('');
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const resource = useAsyncResource(useCallback(signal => adminDestinationService.list(query, { signal }), [query]));
  const filter = (field, value) => setQuery(current => ({ ...current, [field]: value }));

  function saved() {
    setCreating(false);
    setMessage('Đã tạo điểm đến.');
    resource.reload();
  }

  return <div className="admin-destinations-page">
    <Breadcrumb items={[{ label: 'Quản trị', to: ROUTES.ADMIN }, { label: 'Điểm đến' }]} />
    <PageHeader eyebrow="Khám phá Việt Nam" title="Quản lý điểm đến" description="Quản lý nội dung điểm đến Việt Nam." actions={<>
      <button type="button" onClick={() => { setMessage(''); setCreating(true); }}><Plus size={16} aria-hidden="true" /><BilingualText vi="Thêm điểm đến" en="Add destination" /></button>
    </>} />
    {message && <Notice kind="success"><BilingualText vi={message} en="Destination created." /></Notice>}
    <form className="admin-card destination-filters" onSubmit={event => { event.preventDefault(); filter('keyword', keyword.trim()); }}>
      <div className="actions">
        <label style={{ flex: '1 1 220px' }}><BilingualText>Tìm kiếm</BilingualText><input value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="Tên tiếng Việt hoặc tiếng Anh" /></label>
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
            <td><div className="actions"><Link className="button secondary" to={detailPath}><BilingualText>Chi tiết</BilingualText></Link><Link className="button secondary" to={`${detailPath}?edit=1`}><BilingualText>Sửa</BilingualText></Link></div></td>
          </tr>;
        })}</tbody>
      </table></div>}
    </ResourceState>
    {creating && <Modal title={<BilingualText vi="Thêm điểm đến" en="Add destination" />} busy={busy} onClose={() => setCreating(false)}>
      <DestinationForm onSaved={saved} onCancel={() => setCreating(false)} onBusyChange={setBusy} />
    </Modal>}
  </div>;
}
