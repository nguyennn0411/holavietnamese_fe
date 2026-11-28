import { BilingualText, bilingualLabel, useTextLanguage } from '@/shared/components/common/BilingualText';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { adminService } from '@/features/admin/api/adminService';
import { AdminSearchBar } from '@/shared/components/common/AdminSearchBar';
import { AdminStatusBadge } from '@/shared/components/common/AdminStatusBadge';
import {
  History,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Users,
  Clock,
  RefreshCw,
  Download,
  Filter,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  User,
  Globe,
} from 'lucide-react';

const formatAuditTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const pad = (n) => String(n).padStart(2, '0');
  const d = pad(date.getDate());
  const m = pad(date.getMonth() + 1);
  const y = date.getFullYear();
  const hr = pad(date.getHours());
  const min = pad(date.getMinutes());
  const sec = pad(date.getSeconds());
  return `${d}/${m}/${y} ${hr}:${min}:${sec}`;
};

const getActionColor = (action = '') => {
  const act = String(action).toUpperCase();
  if (act.includes('CREATE') || act.includes('ADD') || act.includes('INSERT')) {
    return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
  }
  if (act.includes('DELETE') || act.includes('REMOVE') || act.includes('BLOCK')) {
    return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' };
  }
  if (act.includes('UPDATE') || act.includes('EDIT') || act.includes('CHANGE') || act.includes('PATCH')) {
    return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
  }
  if (act.includes('LOGIN') || act.includes('AUTH') || act.includes('ROLE')) {
    return { bg: '#FAF5FF', text: '#7C3AED', border: '#E9D5FF' };
  }
  if (act.includes('APPROVE') || act.includes('PUBLISH') || act.includes('REVIEW')) {
    return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
  }
  return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
};

export function AdminAuditLogsPage() {
  useTextLanguage();
  const [logs, setLogs] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionCategory, setActionCategory] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const loadLogs = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const data = await adminService.getAuditLogs();
      const list = Array.isArray(data) ? data : data?.content || [];
      // Sort newest first
      list.sort((a, b) => {
        const timeA = new Date(a.createdAt || a.time || 0).getTime();
        const timeB = new Date(b.createdAt || b.time || 0).getTime();
        return timeB - timeA;
      });
      setLogs(list);
      setState({ loading: false, error: '' });
    } catch (error) {
      setState({ loading: false, error: error.message || 'Không thể tải nhật ký hệ thống.' });
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Derived KPI metrics
  const metrics = useMemo(() => {
    const total = logs.length;
    const success = logs.filter((l) => (l.status || 'SUCCESS').toUpperCase() === 'SUCCESS').length;
    const warning = total - success;
    const uniqueActors = new Set(
      logs.map((l) => l.adminUsername || l.actor || 'system').filter(Boolean),
    ).size;
    return { total, success, warning, uniqueActors };
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Status filter
      const logStatus = (log.status || 'SUCCESS').toUpperCase();
      if (statusFilter === 'SUCCESS' && logStatus !== 'SUCCESS') return false;
      if (statusFilter === 'FAILED' && logStatus === 'SUCCESS') return false;

      // Action category filter
      const actionStr = (log.action || '').toUpperCase();
      if (actionCategory === 'CREATE' && !actionStr.includes('CREATE') && !actionStr.includes('ADD')) return false;
      if (actionCategory === 'UPDATE' && !actionStr.includes('UPDATE') && !actionStr.includes('EDIT')) return false;
      if (actionCategory === 'DELETE' && !actionStr.includes('DELETE') && !actionStr.includes('REMOVE')) return false;
      if (actionCategory === 'AUTH' && !actionStr.includes('LOGIN') && !actionStr.includes('ROLE') && !actionStr.includes('AUTH')) return false;

      // Keyword search
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const actor = (log.adminUsername || log.actor || '').toLowerCase();
      const action = (log.action || '').toLowerCase();
      const target = (log.target || '').toLowerCase();
      const details = (log.details || '').toLowerCase();
      const ip = (log.ipAddress || '').toLowerCase();

      return (
        actor.includes(q) ||
        action.includes(q) ||
        target.includes(q) ||
        details.includes(q) ||
        ip.includes(q)
      );
    });
  }, [logs, search, statusFilter, actionCategory]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const currentPageLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, page, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, actionCategory]);

  // Export CSV
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['ID', 'Thời gian', 'Người thực hiện', 'IP', 'Thao tác', 'Đối tượng', 'Chi tiết', 'Kết quả'];
    const rows = filteredLogs.map((l) => [
      l.id ?? '',
      formatAuditTime(l.createdAt || l.time),
      l.adminUsername || l.actor || 'system',
      l.ipAddress ?? '',
      l.action ?? '',
      l.target ?? '',
      `"${(l.details ?? '').replace(/"/g, '""')}"`,
      l.status || 'SUCCESS',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <History size={20} />
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: '#0F172A', letterSpacing: '-0.02em' }}>
              <BilingualText vi="Nhật ký hệ thống" en="Audit Logs" />
            </h1>
          </div>
          <p style={{ color: '#64748B', margin: 0, fontSize: '0.92rem' }}>
            <BilingualText
              vi="Ghi nhận thao tác thay đổi dữ liệu của quản trị viên, người quản lý nội dung và hệ thống."
              en="Tracks data changes made by administrators, content creators, and the system."
            />
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={loadLogs}
            disabled={state.loading}
            className="admin-btn admin-btn-secondary"
            title={bilingualLabel('Làm mới nhật ký', 'Refresh logs')}
          >
            <RefreshCw size={15} className={state.loading ? 'spin-animation' : ''} />
            <BilingualText vi="Làm mới" en="Refresh" />
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="admin-btn admin-btn-outline"
            title={bilingualLabel('Xuất tệp CSV', 'Export to CSV')}
          >
            <Download size={15} />
            <BilingualText vi="Xuất CSV" en="Export CSV" />
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#F1F5F9',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
              <BilingualText vi="Tổng nhật ký" en="Total Records" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
              {metrics.total.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
              <BilingualText vi="Thành công" en="Successful Actions" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', lineHeight: 1.2 }}>
              {metrics.success.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: metrics.warning > 0 ? '#FEF2F2' : '#F8FAFC',
              color: metrics.warning > 0 ? '#DC2626' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
              <BilingualText vi="Cảnh báo / Lỗi" en="Warnings / Errors" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: metrics.warning > 0 ? '#DC2626' : '#64748B', lineHeight: 1.2 }}>
              {metrics.warning.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
              <BilingualText vi="Quản trị viên tham gia" en="Active Operators" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
              {metrics.uniqueActors}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="admin-card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px', minWidth: '260px' }}>
            <AdminSearchBar
              value={search}
              onChange={setSearch}
              placeholder={bilingualLabel(
                'Tìm kiếm người thực hiện, thao tác, đối tượng, IP...',
                'Search actor, action, target, IP...',
              )}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B', marginRight: '4px' }}>
              <BilingualText vi="Trạng thái:" en="Status:" />
            </span>
            {[
              { id: 'ALL', labelVi: 'Tất cả', labelEn: 'All' },
              { id: 'SUCCESS', labelVi: 'Thành công', labelEn: 'Success' },
              { id: 'FAILED', labelVi: 'Lỗi / Cảnh báo', labelEn: 'Failed' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                className={`admin-btn admin-btn-sm ${statusFilter === st.id ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                style={{ borderRadius: '8px' }}
              >
                <BilingualText vi={st.labelVi} en={st.labelEn} />
              </button>
            ))}
          </div>
        </div>

        {/* Action Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Filter size={14} />
            <BilingualText vi="Loại thao tác:" en="Action Type:" />
          </span>
          {[
            { id: 'ALL', labelVi: 'Tất cả', labelEn: 'All' },
            { id: 'CREATE', labelVi: 'Tạo mới (CREATE)', labelEn: 'Create' },
            { id: 'UPDATE', labelVi: 'Cập nhật (UPDATE)', labelEn: 'Update' },
            { id: 'DELETE', labelVi: 'Xóa (DELETE)', labelEn: 'Delete' },
            { id: 'AUTH', labelVi: 'Bảo mật & Quyền (AUTH)', labelEn: 'Auth & Roles' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActionCategory(cat.id)}
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid',
                cursor: 'pointer',
                backgroundColor: actionCategory === cat.id ? '#1E293B' : '#FFFFFF',
                borderColor: actionCategory === cat.id ? '#1E293B' : '#E2E8F0',
                color: actionCategory === cat.id ? '#FFFFFF' : '#475569',
                transition: 'all 0.15s ease',
              }}
            >
              <BilingualText vi={cat.labelVi} en={cat.labelEn} />
            </button>
          ))}
          {filteredLogs.length > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: '0.82rem', color: '#64748B' }}>
              <BilingualText
                vi={`Hiển thị ${filteredLogs.length} kết quả`}
                en={`Showing ${filteredLogs.length} records`}
              />
            </span>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {state.loading && (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#64748B' }}>
            <RefreshCw size={24} className="spin-animation" style={{ margin: '0 auto 12px' }} />
            <div>
              <BilingualText vi="Đang tải nhật ký…" en="Loading audit logs…" />
            </div>
          </div>
        )}

        {state.error && (
          <div
            role="alert"
            style={{
              padding: '24px',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <AlertTriangle size={20} />
            <div>
              <BilingualText vi={state.error} en={state.error} />
            </div>
          </div>
        )}

        {!state.loading && !state.error && filteredLogs.length === 0 && (
          <div style={{ padding: '64px 24px', textAlign: 'center', color: '#64748B' }}>
            <History size={44} style={{ color: '#CBD5E1', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', margin: '0 0 6px 0' }}>
              <BilingualText vi="Không tìm thấy nhật ký phù hợp" en="No matching audit logs found" />
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0 }}>
              <BilingualText
                vi="Thử điều chỉnh từ khóa tìm kiếm hoặc làm mới bộ lọc trạng thái."
                en="Try adjusting your search query or reset status filters."
              />
            </p>
          </div>
        )}

        {!state.loading && !state.error && currentPageLogs.length > 0 && (
          <div className="admin-table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '160px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={13} />
                      <BilingualText vi="Thời gian" en="Timestamp" />
                    </div>
                  </th>
                  <th style={{ width: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={13} />
                      <BilingualText vi="Người thực hiện" en="Performed by" />
                    </div>
                  </th>
                  <th style={{ width: '150px' }}>
                    <BilingualText vi="Thao tác" en="Action" />
                  </th>
                  <th style={{ width: '140px' }}>
                    <BilingualText vi="Đối tượng tác động" en="Target" />
                  </th>
                  <th>
                    <BilingualText vi="Chi tiết" en="Details" />
                  </th>
                  <th style={{ width: '130px', textAlign: 'center' }}>
                    <BilingualText vi="Kết quả" en="Status" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPageLogs.map((log) => {
                  const actionStyle = getActionColor(log.action);
                  const isSuccess = (log.status || 'SUCCESS').toUpperCase() === 'SUCCESS';
                  const actorInitial = (log.adminUsername || log.actor || 'S').charAt(0).toUpperCase();

                  return (
                    <tr key={log.id || `${log.action}-${log.createdAt || log.time}`}>
                      <td>
                        <time
                          dateTime={log.createdAt || log.time}
                          style={{
                            fontSize: '0.82rem',
                            color: '#475569',
                            fontFamily: 'monospace',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatAuditTime(log.createdAt || log.time)}
                        </time>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '8px',
                              backgroundColor: '#E0E7FF',
                              color: '#4338CA',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {actorInitial}
                          </div>
                          <div>
                            <strong style={{ color: '#0F172A', fontSize: '0.88rem', display: 'block' }}>
                              {log.adminUsername || log.actor || 'system'}
                            </strong>
                            {log.ipAddress && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  fontSize: '0.72rem',
                                  color: '#64748B',
                                  fontFamily: 'monospace',
                                }}
                              >
                                <Globe size={10} />
                                {log.ipAddress}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            backgroundColor: actionStyle.bg,
                            color: actionStyle.text,
                            border: `1px solid ${actionStyle.border}`,
                            letterSpacing: '0.02em',
                          }}
                        >
                          {log.action}
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            background: '#F8FAFC',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: '#334155',
                          }}
                        >
                          {log.target || '—'}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.4 }}>
                          <BilingualText
                            vi={log.details || 'Không có mô tả thêm'}
                            en={log.details || 'No additional details'}
                          />
                        </span>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <AdminStatusBadge
                          status={isSuccess ? 'SUCCESS' : 'FAILED'}
                          labelVi={isSuccess ? 'Thành công' : 'Thất bại'}
                          labelEn={isSuccess ? 'Success' : 'Failed'}
                          size="sm"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!state.loading && !state.error && filteredLogs.length > pageSize && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              borderTop: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '0.84rem', color: '#64748B' }}>
              <BilingualText
                vi={`Trang ${page} trên tổng số ${totalPages}`}
                en={`Page ${page} of ${totalPages}`}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="admin-btn admin-btn-sm admin-btn-secondary"
                style={{ padding: '6px 12px' }}
              >
                <ChevronLeft size={14} />
                <BilingualText vi="Trước" en="Previous" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="admin-btn admin-btn-sm admin-btn-secondary"
                style={{ padding: '6px 12px' }}
              >
                <BilingualText vi="Sau" en="Next" />
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
