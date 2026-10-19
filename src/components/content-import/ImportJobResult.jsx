import { useState } from 'react';
import { Notice, Pagination } from '@/components/common/Ui';
import './content-import.css';

export const IMPORT_STATUS_LABELS = { READY: 'Chờ xác nhận', VALIDATION_FAILED: 'Dữ liệu không hợp lệ', IMPORTED: 'Đã nhập thành công', FAILED: 'Ghi dữ liệu thất bại' };
export function ImportJobResult({ job }) {
  const [rowPage, setRowPage] = useState(0), [errorPage, setErrorPage] = useState(0);
  const rows = job.rows || [], errors = job.errors || [], columns = Object.keys(rows[0]?.values || {}).filter(column => !column.startsWith('_'));
  const badRows = new Set(errors.map(error => error.row));
  return <section className="import-job-result">
    <Notice kind={job.status === 'IMPORTED' ? 'success' : job.canConfirm ? 'info' : 'error'}>
      <strong>{IMPORT_STATUS_LABELS[job.status] || job.status}</strong>{' · '}{job.filename}
      {job.canConfirm && <p>Preview chưa ghi từ vựng. Xem lại dữ liệu trước khi xác nhận; hệ thống sẽ kiểm tra lại trước khi nhập.</p>}
      {job.status === 'FAILED' && <p>Toàn bộ dữ liệu của lần import này đã được hoàn tác.</p>}
    </Notice>
    <dl className="import-statistics"><div><dt>Tổng dòng</dt><dd>{job.totalRows}</dd></div><div><dt>Hợp lệ</dt><dd>{job.validRows}</dd></div><div><dt>Dòng lỗi</dt><dd>{job.errorRows}</dd></div><div><dt>Đã nhập</dt><dd>{job.importedRows}</dd></div></dl>
    {job.module === 'DICTIONARY_JSONL' && <section className="import-dictionary-summary"><h2>Kiểm tra nguồn từ điển</h2><dl className="import-statistics">{[['Đã đọc','recordsRead'],['Khác ngôn ngữ','excludedLanguages'],['Thiếu định nghĩa','missingDefinitions'],['Thiếu từ loại','missingPos'],['JSON/mục lỗi','invalidRecords'],['Bản ghi trùng','duplicateRecords'],['Mục sau chuẩn hóa','normalizedEntries'],['Đã tồn tại, bỏ qua','skippedExisting'],['Nghĩa có tiếng Anh khớp','englishAlignedSenses']].map(([label,key]) => <div key={key}><dt>{label}</dt><dd>{job.summary?.[key] ?? 0}</dd></div>)}</dl>
      <p>Nguồn: {job.summary?.source?.name} · Dump: {job.summary?.source?.dumpDate} · <a href={job.summary?.source?.licenseUrl} target="_blank" rel="noreferrer">{job.summary?.source?.license}</a></p>
      {(job.summary?.warnings || []).map(warning => <p key={warning} className="muted">{warning}</p>)}<p>Nội dung mới chờ kiểm duyệt; mục đã có được giữ nguyên, kể cả nội dung Admin đã chỉnh sửa.</p>
    </section>}
    <p className="muted">Người thực hiện: {job.actorName} · {new Date(job.createdAt).toLocaleString('vi-VN')}{job.completedAt && <> · Hoàn tất: {new Date(job.completedAt).toLocaleString('vi-VN')}</>}</p>
    {errors.length > 0 && <section><h2>Lỗi cần xử lý</h2><div className="import-table-scroll"><table className="admin-table"><thead><tr><th>Sheet</th><th>Dòng nguồn</th><th>Cột</th><th>Lỗi</th></tr></thead><tbody>{errors.slice(errorPage * 20, (errorPage + 1) * 20).map((error, index) => <tr key={`${errorPage}-${index}`}><td>{error.sheet || 'File'}</td><td>{error.row || '—'}</td><td>{error.column}</td><td>{error.message}</td></tr>)}</tbody></table></div><Pagination page={errorPage} totalPages={Math.ceil(errors.length / 20)} onChange={setErrorPage} /></section>}
    {rows.length > 0 && <section><h2>Dữ liệu trong file</h2><div className="import-table-scroll"><table className="admin-table"><thead><tr><th>Dòng nguồn</th>{columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.slice(rowPage * 20, (rowPage + 1) * 20).map(row => <tr key={row.rowNumber} className={badRows.has(row.rowNumber) ? 'import-invalid-row' : ''}><td>{row.rowNumber}</td>{columns.map(column => <td key={column}>{row.values[column] || '—'}</td>)}</tr>)}</tbody></table></div><Pagination page={rowPage} totalPages={Math.ceil(rows.length / 20)} onChange={setRowPage} /></section>}
  </section>;
}
