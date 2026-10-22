import { useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumb, EmptyState, PageHeader, Pagination } from '@/components/common/Ui';
import { Modal } from '@/components/common/Modal';
import { ResourceState } from '@/components/common/ResourceState';
import { ImportJobResult, IMPORT_STATUS_LABELS } from '@/components/content-import/ImportJobResult';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { contentImportService } from '@/services/contentImportService';
import { ROUTES } from '@/constants/routes';
import '@/components/content-import/content-import.css';

export function AdminImportHistoryPage() {
  const [params, setParams] = useSearchParams();
  const rawPage = Number(params.get('page') || 0), page = Number.isInteger(rawPage) && rawPage >= 0 ? rawPage : 0;
  const selected = params.get('id');
  const resource = useAsyncResource(useCallback(signal => contentImportService.history(page, { signal }), [page]));
  return <section className="content-import-page content-import-detail">
    <Breadcrumb items={[{ label: 'Từ vựng', to: ROUTES.ADMIN_VOCABULARY }, { label: 'Nhập dữ liệu', to: ROUTES.ADMIN_IMPORT }, { label: 'Lịch sử' }]} />
    <PageHeader eyebrow="Quản lý nội dung" title="Lịch sử import" description="Xem bản xem trước, kết quả và lỗi của những lần nhập dữ liệu." actions={<Link className="button" to={ROUTES.ADMIN_IMPORT}>Nhập dữ liệu</Link>} />
    <ResourceState resource={resource}>{data => data.content.length ? <><div className="admin-card import-history-card"><div className="import-table-scroll"><table className="admin-table"><thead><tr><th>Thời gian</th><th>Người thực hiện</th><th>Loại</th><th>File</th><th>Trạng thái</th><th>Đã nhập / lỗi</th><th>Chi tiết</th></tr></thead><tbody>{data.content.map(job => <tr key={job.id}><td>{new Date(job.createdAt).toLocaleString('vi-VN')}</td><td>{job.actorName}</td><td>{job.module === 'VOCABULARY' ? 'Từ vựng chuẩn' : job.module}</td><td>{job.filename}</td><td>{IMPORT_STATUS_LABELS[job.status] || job.status}</td><td>{job.importedRows} / {job.failedRows}</td><td><button className="secondary" onClick={() => setParams({ page: String(page), id: job.id })}>Xem chi tiết</button></td></tr>)}</tbody></table></div></div><Pagination page={page} totalPages={data.totalPages} onChange={next => setParams({ page: String(next) })} /></> : <EmptyState title="Chưa có lịch sử import" />}</ResourceState>
    {selected && <ImportDetail key={selected} id={selected} onClose={() => setParams({ page: String(page) })} />}
  </section>;
}
function ImportDetail({ id, onClose }) {
  const resource = useAsyncResource(useCallback(signal => contentImportService.get(id, { signal }), [id]));
  return <Modal title="Chi tiết lần import" onClose={onClose}><ResourceState resource={resource}>{job => <ImportJobResult job={job} />}</ResourceState></Modal>;
}
