import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, EmptyState, PageHeader, Notice } from '@/components/common/Ui';
import { ResourceState } from '@/components/common/ResourceState';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';
import { ImportJobResult } from '@/components/content-import/ImportJobResult';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { contentImportService } from '@/services/contentImportService';
import { ROUTES } from '@/constants/routes';
import '@/components/content-import/content-import.css';

export function AdminImportPage() {
  const types = useAsyncResource(useCallback(signal => contentImportService.types({ signal }), []));
  return <section className="content-import-page">
    <Breadcrumb items={[{ label: 'Từ vựng', to: ROUTES.ADMIN_VOCABULARY }, { label: 'Nhập dữ liệu' }]} />
    <PageHeader eyebrow="Quản lý nội dung" title="Nhập dữ liệu từ vựng" description="Nhập mục từ nhiều nghĩa, ví dụ Việt–Anh và thông tin cách dùng từ Excel." actions={<Link className="button secondary" to={ROUTES.ADMIN_IMPORT_HISTORY}>Lịch sử import</Link>} />
    <ResourceState resource={types}>{items => items.length ? <ImportUpload types={items} /> : <EmptyState title="Chưa có loại dữ liệu được hỗ trợ" />}</ResourceState>
  </section>;
}
function ImportUpload({ types }) {
  const [module, setModule] = useState(types[0].id), [file, setFile] = useState(null), [job, setJob] = useState(null), [error, setError] = useState(null), [pending, setPending] = useState(false), [downloading, setDownloading] = useState(false);
  const writing = useRef(false); const { confirm, confirmationDialog } = useConfirmDialog();
  const type = types.find(item => item.id === module);
  async function preview(event) {
    event.preventDefault(); if (writing.current) return;
    writing.current = true; setPending(true); setError(null); setJob(null);
    try { setJob(await contentImportService.preview(module, file)); }
    catch (failure) { setError(failure); } finally { writing.current = false; setPending(false); }
  }
  async function importData() {
    const description = `Nhập ${job?.validRows} dòng Excel từ “${job?.filename}”? Các dòng cùng từ được gom theo nghĩa và ví dụ; mục từ đã có không bị ghi đè.`;
    if (!job?.canConfirm || writing.current || !await confirm({ title: 'Xác nhận nhập dữ liệu', description, confirmLabel: 'Nhập dữ liệu', tone: 'warning' })) return;
    writing.current = true; setPending(true); setError(null);
    try { setJob(await contentImportService.confirm(job.id)); }
    catch (failure) { setError(failure); } finally { writing.current = false; setPending(false); }
  }
  async function template() {
    if (downloading) return; setDownloading(true); setError(null);
    try {
      const blob = await contentImportService.template(module), url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = `${module.toLowerCase()}-template.xlsx`; link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (failure) { setError(failure); } finally { setDownloading(false); }
  }
  return <>
    <form className="admin-card import-upload" onSubmit={preview}><fieldset disabled={pending}>
      <label>Loại dữ liệu<select value={module} onChange={event => { setModule(event.target.value); setFile(null); setJob(null); setError(null); }}>{types.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <div className="import-template-info"><p>{type.description}</p><p>Sheet: <strong>{type.sheet}</strong>. Cột bắt buộc: {type.requiredColumns.join(', ')}.</p><p>Mỗi nghĩa cần definition_vi, translation_en hoặc definition_en. Bản dịch ví dụ là tùy chọn; hệ thống không tự dịch.</p><p>Ghi word và part_of_speech trên mỗi dòng. Các dòng cùng từ/từ loại được gom thành một mục. meaning_order phân biệt nghĩa; example_order sắp xếp ví dụ, bắt đầu từ 0. Nội dung lặp được để trống hoặc phải thống nhất.</p><p>Trạng thái trống là DRAFT. labels: mỗi nhãn một dòng trong ô Excel.</p><button type="button" className="secondary" onClick={template} disabled={downloading}>{downloading ? 'Đang tải…' : 'Tải mẫu Excel'}</button></div>
      <label>File Excel (tối đa 10 MiB)<input key={module} type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" required onChange={event => { setFile(event.target.files?.[0] || null); setJob(null); setError(null); }} /></label>
      {file && <p className="muted">File đã chọn: {file.name}</p>}
      <div className="actions"><button disabled={!file || pending}>{pending ? 'Đang xử lý…' : 'Kiểm tra và xem trước'}</button></div>
    </fieldset></form>
    {error && <Notice kind="error">{error.message}</Notice>}
    {job && <div className="admin-card"><ImportJobResult key={`${job.id}-${job.status}`} job={job} />{job.canConfirm && <button className="import-confirm" disabled={pending} onClick={importData}>{pending ? 'Đang nhập…' : 'Xác nhận nhập Excel'}</button>}<p><Link className="text-link" to={`${ROUTES.ADMIN_IMPORT_HISTORY}?id=${encodeURIComponent(job.id)}`}>Xem lại trong lịch sử →</Link></p></div>}
    {confirmationDialog}
  </>;
}
