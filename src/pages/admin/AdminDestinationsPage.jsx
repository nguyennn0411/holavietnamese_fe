import { useCallback, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { BilingualText, bilingualLabel, useBilingualLabel } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { Modal } from '@/components/common/Modal';
import { ResourceState } from '@/components/common/ResourceState';
import { EmptyState, Notice } from '@/components/common/Ui';
import { DestinationForm } from '@/components/destinations/DestinationForm';
import { DestinationRegion, DestinationStatusBadge } from '@/components/destinations/DestinationMetadata';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { destinationDate, DESTINATION_REGIONS } from '@/models/Destination';
import { adminDestinationService } from '@/services/destinationService';
import { ROUTES } from '@/constants/routes';
<<<<<<< HEAD
import { Eye, Pencil, Plus, Search } from 'lucide-react';
=======
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { canReviewExplore, canWriteExplore } from '@/utils/permissions/contentAccess';
>>>>>>> 8d43116e8293d0a5196eba58e2247eab915417b2
import '@/components/destinations/destinations.css';

const emptyFilters = { keyword: '', status: '', region: '' };

export function AdminDestinationsPage() {
<<<<<<< HEAD
  const label = useBilingualLabel();
=======
  const { user } = useAuth();
  const mayWrite = canWriteExplore(user);
  const mayReview = canReviewExplore(user);
>>>>>>> 8d43116e8293d0a5196eba58e2247eab915417b2
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

<<<<<<< HEAD
  const thStyle = {
    padding: '14px 14px',
    whiteSpace: 'nowrap',
    fontSize: '11.5px',
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--color-ink)',
    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
  };

  const tdStyle = {
    padding: '16px 14px',
    verticalAlign: 'middle',
    borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
  };

  const actionBtnBase = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    height: '32px',
    minHeight: '32px',
    maxHeight: '32px',
    minWidth: 'auto',
    padding: '0 10px',
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '8px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    lineHeight: 1,
    textDecoration: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  };

  return (
    <div className="admin-content admin-destinations-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary-orange, #F97316)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <BilingualText vi="KHÁM PHÁ VIỆT NAM" en="EXPLORE VIETNAM" />
          </span>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '30px', fontWeight: 800, color: 'var(--text-primary, #253044)' }}>
            <BilingualText vi="Quản lý điểm đến" en="Manage destinations" />
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary, #64748B)', fontSize: '14px' }}>
            <BilingualText
              vi="Quản lý danh sách địa danh, vùng miền và nội dung khám phá trên bản đồ Việt Nam."
              en="Manage destinations, regions and discovery content on the Vietnam map."
            />
          </p>
        </div>

        <button
          type="button"
          className="button"
          onClick={() => { setMessage(''); setCreating(true); }}
          style={{ fontSize: '13px', minHeight: '40px', height: '40px', padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={15} strokeWidth={2.5} aria-hidden="true" />
          <span>{label('Thêm điểm đến', 'Add destination')}</span>
        </button>
      </div>

      {message && <Notice kind="success"><BilingualText vi={message} en="Destination created." /></Notice>}

      {/* Filter Toolbar */}
      <form
        className="admin-card"
        style={{ marginBottom: '24px', padding: '18px 22px' }}
        onSubmit={event => {
          event.preventDefault();
          filter('keyword', keyword.trim());
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr auto auto', gap: '12px', alignItems: 'center' }}>
          <input
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            placeholder={label('Tìm theo tên tiếng Việt hoặc tiếng Anh...', 'Search by Vietnamese or English name...')}
          />

          <select value={query.status} onChange={event => filter('status', event.target.value)}>
            <option value="">{label('Tất cả trạng thái', 'All statuses')}</option>
            <option value="PUBLISHED">{label('Đã xuất bản', 'Published')}</option>
            <option value="PENDING_REVIEW">{label('Chờ duyệt', 'Pending Review')}</option>
            <option value="DRAFT">{label('Bản nháp', 'Draft')}</option>
            <option value="ARCHIVED">{label('Đã lưu trữ', 'Archived')}</option>
          </select>

          <select value={query.region} onChange={event => filter('region', event.target.value)}>
            <option value="">{label('Tất cả vùng miền', 'All regions')}</option>
            {DESTINATION_REGIONS.map(region => (
              <option key={region.value} value={region.value}>
                {label(region.vi, region.en)}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="button"
            style={{ fontSize: '12.5px', minHeight: '40px', height: '40px', padding: '0 16px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Search size={14} strokeWidth={2.3} />
            <span>{label('Tìm kiếm', 'Search')}</span>
          </button>

          {(keyword || query.keyword || query.status || query.region) && (
            <button
              type="button"
              className="button secondary"
              style={{ fontSize: '12.5px', minHeight: '40px', height: '40px', padding: '0 14px', whiteSpace: 'nowrap' }}
              onClick={() => {
                setKeyword('');
                setQuery({ ...emptyFilters });
              }}
            >
              <span>{label('Đặt lại', 'Reset')}</span>
            </button>
          )}
        </div>
      </form>

      <ResourceState resource={resource}>
        {items => items.length === 0 ? (
          <EmptyState title={<BilingualText vi="Không có điểm đến phù hợp" en="No matching destinations" />} />
        ) : (
          <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', minWidth: '980px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: '90px', paddingLeft: '20px' }}>
                    {label('Ảnh', 'Image')}
                  </th>
                  <th style={{ ...thStyle, width: '22%' }}>
                    {label('Tên tiếng Việt', 'Vietnamese Name')}
                  </th>
                  <th style={{ ...thStyle, width: '20%' }}>
                    {label('Tên tiếng Anh', 'English Name')}
                  </th>
                  <th style={{ ...thStyle, width: '13%' }}>
                    {label('Vùng miền', 'Region')}
                  </th>
                  <th style={{ ...thStyle, width: '12%', textAlign: 'center' }}>
                    {label('Trạng thái', 'Status')}
                  </th>
                  <th style={{ ...thStyle, width: '14%' }}>
                    {label('Cập nhật lần cuối', 'Last Updated')}
                  </th>
                  <th style={{ ...thStyle, width: '14%', minWidth: '170px', textAlign: 'right', paddingRight: '20px' }}>
                    {label('Thao tác', 'Actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const detailPath = generatePath(ROUTES.ADMIN_DESTINATION_DETAIL, { id: String(item.id) });
                  return (
                    <tr key={item.id}>
                      <td style={{ ...tdStyle, paddingLeft: '20px' }}>
                        <ContentImage
                          src={item.imageUrl}
                          alt={item.nameVi}
                          style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
                        />
                      </td>
                      <td style={tdStyle}>
                        <strong lang="vi" style={{ fontSize: '14px', color: 'var(--color-ink)', display: 'block' }}>
                          {item.nameVi}
                        </strong>
                        {item.slug && (
                          <code style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)' }}>
                            /{item.slug}
                          </code>
                        )}
                      </td>
                      <td style={tdStyle} lang="en">
                        <span style={{ fontSize: '13.5px', color: 'var(--color-ink)', fontWeight: 500 }}>
                          {item.nameEn}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                        <DestinationRegion value={item.region} />
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <DestinationStatusBadge status={item.status} />
                      </td>
                      <td style={{ ...tdStyle, fontSize: '12.5px', color: 'var(--text-secondary, #64748B)', whiteSpace: 'nowrap' }}>
                        {destinationDate(item.updatedAt)}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '20px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', flexWrap: 'nowrap' }}>
                          <Link
                            className="button secondary"
                            to={detailPath}
                            style={{
                              ...actionBtnBase,
                              color: '#0f766e',
                              background: '#f0fdfa',
                              border: '1px solid #99f6e4',
                            }}
                            title={label('Xem chi tiết điểm đến', 'View destination details')}
                          >
                            <Eye size={13} strokeWidth={2.2} />
                            <span>{label('Chi tiết', 'Details')}</span>
                          </Link>
                          <Link
                            className="button secondary"
                            to={`${detailPath}?edit=1`}
                            style={{
                              ...actionBtnBase,
                              color: '#334155',
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                            }}
                            title={label('Chỉnh sửa điểm đến', 'Edit destination')}
                          >
                            <Pencil size={13} strokeWidth={2.1} />
                            <span>{label('Sửa', 'Edit')}</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </ResourceState>

      {creating && (
        <Modal title={<BilingualText vi="Thêm điểm đến" en="Add destination" />} busy={busy} onClose={() => setCreating(false)}>
          <DestinationForm onSaved={saved} onCancel={() => setCreating(false)} onBusyChange={setBusy} />
        </Modal>
      )}
    </div>
  );
=======
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
>>>>>>> 8d43116e8293d0a5196eba58e2247eab915417b2
}
