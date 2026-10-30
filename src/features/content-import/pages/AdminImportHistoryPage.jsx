import { useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumb, EmptyState, PageHeader, Pagination } from '@/shared/components/common/Ui';
import { Modal } from '@/shared/components/common/Modal';
import { ResourceState } from '@/shared/components/common/ResourceState';
import { ImportJobResult, IMPORT_STATUS_LABELS } from '@/features/content-import/components/ImportJobResult';
import { useAsyncResource } from '@/shared/hooks/useAsyncResource';
import { contentImportService } from '@/features/content-import/api/contentImportService';
import { websiteImportService } from '@/features/content-import/api/websiteImportService';
import { ROUTES } from '@/constants/routes';
import { BilingualText, useBilingualLabel } from '@/shared/components/common/BilingualText';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/context/AuthContext';
import { isAdministrator } from '@/utils/permissions/contentAccess';
import '@/features/content-import/components/content-import.css';

export function AdminImportHistoryPage() {
  const { user } = useAuth();
  const mayViewWebsiteImports = isAdministrator(user);
  const label = useBilingualLabel();
  const { i18n } = useTranslation();
  const locale = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('vi') ? 'vi-VN' : 'en-US';
  const [params, setParams] = useSearchParams();
  const rawPage = Number(params.get('page') || 0), page = Number.isInteger(rawPage) && rawPage >= 0 ? rawPage : 0;
  const selected = params.get('id');
  const resource = useAsyncResource(useCallback(signal => contentImportService.history(page, { signal }), [page]));
  const websiteResource = useAsyncResource(useCallback(
    signal => mayViewWebsiteImports ? websiteImportService.history({ signal }) : Promise.resolve([]),
    [mayViewWebsiteImports],
  ));

  return <section className="content-import-page content-import-detail">
    <Breadcrumb items={[{ label: label('Từ vựng', 'Vocabulary'), to: ROUTES.ADMIN_VOCABULARY }, { label: label('Nhập dữ liệu', 'Import Data'), to: ROUTES.ADMIN_IMPORT }, { label: label('Lịch sử', 'History') }]} />
    <PageHeader
      eyebrow={<BilingualText vi="Quản lý nội dung" en="Content Management" />}
      title={<BilingualText vi="Lịch sử import" en="Import History" />}
      description={<BilingualText vi="Xem bản xem trước, kết quả và lỗi của những lần nhập dữ liệu." en="View previews, results, and logs of data import operations." />}
      actions={<Link className="button" to={ROUTES.ADMIN_IMPORT}><BilingualText vi="Nhập dữ liệu" en="Import Data" /></Link>}
    />
    {mayViewWebsiteImports && <ResourceState resource={websiteResource}>{jobs => jobs.length ? <div className="admin-card import-history-card">
      <h2><BilingualText vi="Website → Course" en="Website → Course" /></h2>
      <div className="import-table-scroll"><table className="admin-table"><thead><tr>
        <th><BilingualText>{"Thời gian"}</BilingualText></th><th><BilingualText vi="Nguồn" en="Source" /></th><th><BilingualText vi="Chế độ" en="Mode" /></th><th><BilingualText>{"Lesson / Block"}</BilingualText></th><th><BilingualText>{"Trạng thái"}</BilingualText></th><th><BilingualText vi="Kết quả" en="Result" /></th>
      </tr></thead><tbody>{jobs.map(job => <tr key={job.id}>
        <td>{new Date(job.createdAt).toLocaleString(locale)}</td><td>{job.title}<small className="history-source-url">{job.sourceUrl || job.sourceFilename}</small></td><td>{job.mode}</td><td>{job.stats?.lessons || 0} / {job.stats?.blocks || 0}</td><td>{job.status}</td>
        <td>{job.resultCourseId ? <Link className="text-link" to={`/admin/courses/${job.resultCourseId}`}><BilingualText vi="Mở khóa học" en="Open course" /></Link> : <Link className="text-link" to={ROUTES.ADMIN_IMPORT}><BilingualText vi="Tiếp tục rà soát" en="Continue review" /></Link>}</td>
      </tr>)}</tbody></table></div>
    </div> : null}</ResourceState>}
    <ResourceState resource={resource}>{data => data.content.length ? <>
      <div className="admin-card import-history-card">
        <div className="import-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th><BilingualText>{"Thời gian"}</BilingualText></th>
                <th><BilingualText>{"Người thực hiện"}</BilingualText></th>
                <th><BilingualText>{"Loại"}</BilingualText></th>
                <th><BilingualText>{"File"}</BilingualText></th>
                <th><BilingualText>{"Trạng thái"}</BilingualText></th>
                <th><BilingualText>{"Đã nhập / lỗi"}</BilingualText></th>
                <th><BilingualText>{"Chi tiết"}</BilingualText></th>
              </tr>
            </thead>
            <tbody>
              {data.content.map(job => <tr key={job.id}>
                <td>{new Date(job.createdAt).toLocaleString(locale)}</td>
                <td>{job.actorName}</td>
                <td>{job.module === 'VOCABULARY' ? label('Từ vựng chuẩn', 'Standard Vocabulary') : job.module}</td>
                <td>{job.filename}</td>
                <td><BilingualText>{IMPORT_STATUS_LABELS[job.status] || job.status}</BilingualText></td>
                <td>{job.importedRows} / {job.failedRows}</td>
                <td><button className="secondary" onClick={() => setParams({ page: String(page), id: job.id })}><BilingualText vi="Xem chi tiết" en="View Details" /></button></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} totalPages={data.totalPages} onChange={next => setParams({ page: String(next) })} />
    </> : <EmptyState title={<BilingualText vi="Chưa có lịch sử import" en="No import history yet" />} />}</ResourceState>
    {selected && <ImportDetail key={selected} id={selected} onClose={() => setParams({ page: String(page) })} />}
  </section>;
}

function ImportDetail({ id, onClose }) {
  const label = useBilingualLabel();
  const resource = useAsyncResource(useCallback(signal => contentImportService.get(id, { signal }), [id]));
  return <Modal title={label("Chi tiết lần import", "Import Details")} onClose={onClose}><ResourceState resource={resource}>{job => <ImportJobResult job={job} />}</ResourceState></Modal>;
}
