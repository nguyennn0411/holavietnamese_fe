import { BilingualText } from '@/components/common/BilingualText';
import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

export function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    adminService.getAuditLogs().then(setLogs).catch(error => setState({ loading: false, error: error.message })).finally(() => setState(s => ({ ...s, loading: false })));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0' }}><BilingualText>{"Nhật ký Quản trị (Audit Logs)"}</BilingualText></h1>
        <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: '0.9rem' }}><BilingualText>{"Ghi nhận toàn bộ thao tác thay đổi dữ liệu, phân quyền và can thiệp bảo mật của ban quản trị và hệ thống."}</BilingualText></p>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {state.loading && <div className="state"><BilingualText>{"Đang tải nhật ký…"}</BilingualText></div>}
        {state.error && <div className="state" role="alert"><BilingualText>{state.error}</BilingualText></div>}
        {!state.loading && !state.error && logs.length === 0 && <div className="state"><BilingualText>{"Chưa có nhật ký hệ thống."}</BilingualText></div>}
        {!state.loading && !state.error && logs.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th><BilingualText>{"Thời gian"}</BilingualText></th>
              <th><BilingualText>{"Admin thực hiện"}</BilingualText></th>
              <th><BilingualText>{"Thao tác"}</BilingualText></th>
              <th><BilingualText>{"Đối tượng tác động"}</BilingualText></th>
              <th><BilingualText>{"Chi tiết"}</BilingualText></th>
              <th><BilingualText>{"Kết quả"}</BilingualText></th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td><span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{log.time}</span></td>
                <td><strong style={{ color: 'var(--color-ink)' }}>{log.actor}</strong></td>
                <td><strong>{log.action}</strong></td>
                <td>
                  <span style={{ background: 'var(--color-surface)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}>
                    {log.target}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-forest)' }}>
                    <BilingualText>{log.details || 'Không có mô tả thêm'}</BilingualText>
                  </span>
                </td>
                <td>
                  <span className={`admin-badge ${log.status === 'SUCCESS' ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                    <BilingualText>{log.status}</BilingualText>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
