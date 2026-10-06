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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0' }}>Nhật ký Quản trị (Audit Logs)</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
          Ghi nhận toàn bộ thao tác thay đổi dữ liệu, phân quyền và can thiệp bảo mật của ban quản trị và hệ thống.
        </p>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {state.loading && <div className="state">Đang tải nhật ký…</div>}
        {state.error && <div className="state" role="alert">{state.error}</div>}
        {!state.loading && !state.error && logs.length === 0 && <div className="state">Chưa có nhật ký hệ thống.</div>}
        {!state.loading && !state.error && logs.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Admin thực hiện</th>
              <th>Thao tác</th>
              <th>Đối tượng tác động</th>
              <th>Chi tiết</th>
              <th>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td><span style={{ fontSize: '0.8rem', color: '#64748b' }}>{log.time}</span></td>
                <td><strong style={{ color: '#0f172a' }}>{log.actor}</strong></td>
                <td><strong>{log.action}</strong></td>
                <td>
                  <span style={{ background: '#f8fafc', padding: '3px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                    {log.target}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                    {log.details || 'Không có mô tả thêm'}
                  </span>
                </td>
                <td>
                  <span className={`admin-badge ${log.status === 'SUCCESS' ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                    {log.status}
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
