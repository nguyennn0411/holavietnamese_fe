import { useCallback, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { BilingualText } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { ResourceState } from '@/components/common/ResourceState';
import { Breadcrumb, EmptyState, Notice, PageHeader } from '@/components/common/Ui';
import { DestinationForm } from '@/components/destinations/DestinationForm';
import { DestinationMetadata, DestinationRegion, DestinationStatusBadge } from '@/components/destinations/DestinationMetadata';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { adminDestinationService } from '@/services/destinationService';
import { ROUTES } from '@/constants/routes';

export function AdminDestinationDetailPage() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const editing = params.get('edit') === '1';
  const [message, setMessage] = useState('');
  const resource = useAsyncResource(useCallback(signal => adminDestinationService.get(id, { signal }), [id]));
  function saved() {
    setMessage('Đã lưu điểm đến.');
    setParams({});
    resource.reload();
  }

  if (resource.error?.status === 404) return <EmptyState title="Không tìm thấy điểm đến"><Link className="button secondary" to={ROUTES.ADMIN_DESTINATIONS}><BilingualText vi="Về danh sách điểm đến" en="Back to destinations" /></Link></EmptyState>;

  return <div>
    <Breadcrumb items={[{ label: 'Điểm đến', to: ROUTES.ADMIN_DESTINATIONS }, { label: editing ? 'Chỉnh sửa' : 'Chi tiết' }]} />
    <ResourceState resource={resource}>{entry => <>
      <PageHeader title={<BilingualText vi={entry.nameVi} en={entry.nameEn} />} actions={!editing && <button type="button" onClick={() => { setMessage(''); setParams({ edit: '1' }); }}><BilingualText vi="Chỉnh sửa điểm đến" en="Edit destination" /></button>} />
      {message && <Notice kind="success"><BilingualText vi={message} en="Destination saved." /></Notice>}
      <section className="admin-card">
        {editing ? <DestinationForm key={entry.id} entry={entry} onSaved={saved} onCancel={() => setParams({})} /> : <>
          <ContentImage src={entry.imageUrl} alt={entry.nameVi} className="figma-art" style={{ maxHeight: 280, objectFit: 'cover', borderRadius: 8 }} loading="eager" />
          <dl><dt><BilingualText vi="Tên tiếng Việt" en="Vietnamese name" /></dt><dd lang="vi">{entry.nameVi}</dd><dt><BilingualText vi="Tên tiếng Anh" en="English name" /></dt><dd lang="en">{entry.nameEn}</dd><dt>Slug</dt><dd>{entry.slug}</dd><dt><BilingualText vi="Vùng miền" en="Region" /></dt><dd><DestinationRegion value={entry.region} /></dd><dt><BilingualText>Trạng thái</BilingualText></dt><dd><DestinationStatusBadge status={entry.status} /></dd><dt><BilingualText vi="Đường dẫn ảnh" en="Image URL" /></dt><dd style={{ overflowWrap: 'anywhere' }}>{entry.imageUrl || '—'}</dd></dl>
          {[['shortDescriptionVi', 'Mô tả ngắn tiếng Việt', 'Short description in Vietnamese', 'vi'], ['shortDescriptionEn', 'Mô tả ngắn tiếng Anh', 'Short description in English', 'en'], ['descriptionVi', 'Mô tả tiếng Việt', 'Vietnamese description', 'vi'], ['descriptionEn', 'Mô tả tiếng Anh', 'English description', 'en']].map(([field, vi, en, lang]) => <section key={field}><h2><BilingualText vi={vi} en={en} /></h2><p lang={lang} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{entry[field] || '—'}</p></section>)}
        </>}
      </section>
      <section className="admin-card" style={{ marginTop: 20 }}><DestinationMetadata entry={entry} /></section>
      <div className="actions" style={{ marginTop: 20 }}><Link className="button secondary" to={ROUTES.ADMIN_DESTINATIONS}><BilingualText vi="Về danh sách điểm đến" en="Back to destinations" /></Link></div>
    </>}</ResourceState>
  </div>;
}
