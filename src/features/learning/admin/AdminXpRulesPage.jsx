import { useCallback, useEffect, useMemo, useState } from 'react';
import { BilingualText, bilingualLabel, useTextLanguage } from '@/shared/components/common/BilingualText';
import { adminService } from '@/features/admin/api/adminService';
import { useConfirmDialog } from '@/shared/components/common/ConfirmDialog';
import { Zap, Power, Sparkles, BookOpen, Flame, Award, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';
import { AdminActionButton, AdminActionGroup } from '@/shared/components/common/AdminTableActions';
import { AdminPagination } from '@/shared/components/common/AdminPagination';
import { AdminStatusBadge } from '@/shared/components/common/AdminStatusBadge';

const PAGE_SIZE = 10;

const PRESETS = [
  { eventType: 'LESSON_COMPLETE', eventName: 'Hoàn thành 1 bài học', xpReward: 20, dailyCap: 200, icon: BookOpen },
  { eventType: 'DAILY_LOGIN', eventName: 'Đăng nhập mỗi ngày', xpReward: 10, dailyCap: 10, icon: CheckCircle2 },
  { eventType: 'DAILY_CHECKIN', eventName: 'Điểm danh hàng ngày', xpReward: 10, dailyCap: 10, icon: Flame },
  { eventType: 'QUIZ_PASS', eventName: 'Đạt bài kiểm tra', xpReward: 15, dailyCap: 150, icon: Award },
  { eventType: 'VOCAB_LEARNED', eventName: 'Học 1 từ mới', xpReward: 5, dailyCap: 50, icon: BookOpen },
  { eventType: 'AI_ROLEPLAY_COMPLETE', eventName: 'Hoàn thành hội thoại AI', xpReward: 25, dailyCap: 100, icon: Sparkles },
  { eventType: 'STREAK_MAINTAIN', eventName: 'Duy trì chuỗi học tập', xpReward: 30, dailyCap: 30, icon: Flame },
];

const emptyDraft = {
  eventType: '',
  eventName: '',
  xpReward: 10,
  dailyCap: 100,
  active: true,
};

export function AdminXpRulesPage() {
  useTextLanguage();
  const { confirm, confirmationDialog } = useConfirmDialog();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getXpRules();
      setItems(Array.isArray(data) ? data : []);
      setError('');
    } catch (e) {
      setError(e.message || 'Không thể tải danh sách quy tắc XP.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const applyPreset = (preset) => {
    setDraft({
      eventType: preset.eventType,
      eventName: preset.eventName,
      xpReward: preset.xpReward,
      dailyCap: preset.dailyCap,
      active: true,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      eventType: draft.eventType.trim().toUpperCase().replace(/\s+/g, '_'),
      eventName: draft.eventName.trim(),
      xpReward: parseInt(draft.xpReward, 10) || 0,
      dailyCap: draft.dailyCap !== '' && draft.dailyCap !== null ? parseInt(draft.dailyCap, 10) : null,
      active: Boolean(draft.active),
    };

    try {
      if (editingId) {
        await adminService.updateXpRule(editingId, payload);
        setMsg(bilingualLabel('Đã cập nhật quy tắc XP thành công!', 'XP rule updated successfully!'));
      } else {
        await adminService.createXpRule(payload);
        setMsg(bilingualLabel('Đã khởi tạo quy tắc XP mới!', 'New XP rule created successfully!'));
      }
      setEditingId(null);
      setDraft(emptyDraft);
      await load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu quy tắc XP.');
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setDraft({
      eventType: item.eventType || '',
      eventName: item.eventName || '',
      xpReward: item.xpReward ?? 0,
      dailyCap: item.dailyCap ?? 0,
      active: item.active !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(emptyDraft);
  };

  const toggleActive = async (item) => {
    const nextActive = !item.active;
    try {
      await adminService.updateXpRule(item.id, {
        eventType: item.eventType,
        eventName: item.eventName,
        xpReward: item.xpReward,
        dailyCap: item.dailyCap,
        active: nextActive,
      });
      setMsg(nextActive ? 'Đã kích hoạt quy tắc XP.' : 'Đã tạm dừng quy tắc XP.');
      await load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Lỗi cập nhật trạng thái quy tắc XP.');
    }
  };

  const remove = async (id, eventName) => {
    const ok = await confirm({
      title: bilingualLabel('Xóa quy tắc XP?', 'Delete XP rule?'),
      description: bilingualLabel(
        `Quy tắc tính điểm "${eventName}" sẽ bị xóa khỏi hệ thống. Bạn có chắc chắn?`,
        `The scoring rule "${eventName}" will be deleted. Are you sure?`
      ),
      confirmLabel: bilingualLabel('Xóa quy tắc', 'Delete rule'),
      tone: 'danger',
    });
    if (!ok) return;

    try {
      await adminService.deleteXpRule(id);
      setMsg('Đã xóa quy tắc XP thành công.');
      await load();
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      setError(e.message || 'Lỗi xóa quy tắc XP.');
    }
  };

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((i) => i.active !== false).length;
    const maxDailyPotential = items
      .filter((i) => i.active !== false)
      .reduce((acc, i) => acc + (i.dailyCap || 0), 0);
    return { total, active, maxDailyPotential };
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);

  const paginatedItems = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, currentPage]);

  return (
    <div className="admin-xp-rules-page" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {confirmationDialog}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: '999px', background: '#FFF7ED', border: '1px solid #FFEDD5', color: '#EA580C', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>
            <Zap size={13} />
            <BilingualText vi="HỆ THỐNG · QUY TẮC TÍNH ĐIỂM" en="SYSTEM · SCORING RULES" />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
            <BilingualText vi="Quy tắc cộng điểm XP" en="XP Reward Rules" />
          </h1>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.92rem' }}>
            <BilingualText
              vi="Quản lý cơ chế thưởng XP cho từng hoạt động học tập và cấu hình giới hạn chống cày điểm lạm phát."
              en="Manage XP reward amounts for learner activities and configure daily anti-farming caps."
            />
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          className="admin-btn admin-btn-secondary"
        >
          <RefreshCw size={15} className={loading ? 'spin-animation' : ''} />
          <BilingualText vi="Tải lại dữ liệu" en="Reload Data" />
        </button>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="admin-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} />
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <BilingualText vi="Tổng số quy tắc" en="Total Rules" />
            </span>
            <div style={{ fontSize: '1.65rem', fontWeight: 850, color: '#0F172A', lineHeight: 1.2, marginTop: 2 }}>
              {stats.total}
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <BilingualText vi="Đang áp dụng (Bật)" en="Active Rules" />
            </span>
            <div style={{ fontSize: '1.65rem', fontWeight: 850, color: '#15803D', lineHeight: 1.2, marginTop: 2 }}>
              {stats.active}
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={22} />
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <BilingualText vi="Giới hạn tối đa/ngày" en="Max Daily Potential" />
            </span>
            <div style={{ fontSize: '1.65rem', fontWeight: 850, color: '#B45309', lineHeight: 1.2, marginTop: 2 }}>
              ~{stats.maxDailyPotential} XP
            </div>
          </div>
        </div>
      </div>

      {/* Alert Notices */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', fontSize: 13, fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#991B1B', fontWeight: 700 }}>×</button>
        </div>
      )}
      {msg && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: 13, fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} />
            <span>{msg}</span>
          </div>
          <button type="button" onClick={() => setMsg('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#065F46', fontWeight: 700 }}>×</button>
        </div>
      )}

      {/* Form Add / Edit */}
      <div className="admin-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 2px', color: '#0F172A' }}>
              <BilingualText vi={editingId ? 'Chỉnh sửa quy tắc XP' : 'Thêm quy tắc XP mới'} en={editingId ? 'Edit XP Rule' : 'Add New XP Rule'} />
            </h2>
            <span style={{ fontSize: 12, color: '#64748B' }}>
              <BilingualText vi="Thiết lập sự kiện kích hoạt và điểm XP thưởng tương ứng." en="Configure event triggers and corresponding XP rewards." />
            </span>
          </div>

          {!editingId && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B', marginRight: 4 }}>Mẫu nhanh:</span>
              {PRESETS.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.eventType}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    style={{ height: 28, padding: '0 8px', fontSize: 11.5, gap: 5 }}
                    title={`Điền mẫu: ${p.eventName}`}
                  >
                    <Icon size={12} style={{ color: '#EA580C' }} />
                    <span>{p.eventName}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 5 }}>
                <BilingualText vi="Mã sự kiện (Event Type) *" en="Event Type Code *" />
              </label>
              <input
                type="text"
                placeholder="VD: LESSON_COMPLETE"
                value={draft.eventType}
                onChange={(e) => setDraft({ ...draft, eventType: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'monospace' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 5 }}>
                <BilingualText vi="Tên sự kiện hiển thị *" en="Event Name Display *" />
              </label>
              <input
                type="text"
                placeholder="VD: Hoàn thành 1 bài học"
                value={draft.eventName}
                onChange={(e) => setDraft({ ...draft, eventName: e.target.value })}
                style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 5 }}>
                <BilingualText vi="Điểm thưởng (XP) *" en="XP Reward Points *" />
              </label>
              <input
                type="number"
                min="0"
                step="5"
                placeholder="20"
                value={draft.xpReward}
                onChange={(e) => setDraft({ ...draft, xpReward: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 5 }}>
                <BilingualText vi="Giới hạn ngày (Daily Cap)" en="Daily Cap Limit" />
              </label>
              <input
                type="number"
                min="0"
                step="10"
                placeholder="200 (để trống = vô hạn)"
                value={draft.dailyCap ?? ''}
                onChange={(e) => setDraft({ ...draft, dailyCap: e.target.value === '' ? null : Math.max(0, parseInt(e.target.value, 10) || 0) })}
                style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, paddingTop: 14, borderTop: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                style={{ width: 17, height: 17, accentColor: '#EA580C' }}
              />
              <BilingualText vi="Kích hoạt áp dụng quy tắc này ngay" en="Activate this rule immediately" />
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="admin-btn admin-btn-secondary"
                >
                  <BilingualText vi="Hủy chỉnh sửa" en="Cancel" />
                </button>
              )}
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
              >
                <BilingualText vi={editingId ? 'Lưu thay đổi quy tắc' : '+ Thêm quy tắc XP'} en={editingId ? 'Save Changes' : '+ Add XP Rule'} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Rules Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th><BilingualText vi="Mã sự kiện (Event Type)" en="Event Type Code" /></th>
              <th><BilingualText vi="Tên hoạt động" en="Activity Name" /></th>
              <th><BilingualText vi="Điểm XP thưởng" en="XP Reward" /></th>
              <th><BilingualText vi="Giới hạn / ngày (Chống spam)" en="Daily Cap (Anti-farming)" /></th>
              <th style={{ textAlign: 'center' }}><BilingualText vi="Trạng thái" en="Status" /></th>
              <th style={{ textAlign: 'right', paddingRight: 20 }}><BilingualText vi="Thao tác" en="Actions" /></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
                  <RefreshCw size={24} className="spin-animation" style={{ color: '#EA580C', margin: '0 auto 8px' }} />
                  <BilingualText vi="Đang tải danh sách quy tắc XP…" en="Loading XP rules…" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '50px 0', color: '#64748B' }}>
                  <BilingualText vi="Chưa có quy tắc XP nào. Hãy chọn mẫu nhanh phía trên để tạo." en="No XP rules configured yet." />
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => {
                const isActive = item.active !== false;

                return (
                  <tr key={item.id}>
                    <td>
                      <code style={{ fontSize: 12, fontWeight: 700, color: '#EA580C' }}>
                        {item.eventType}
                      </code>
                    </td>

                    <td>
                      <strong style={{ color: '#0F172A' }}>{item.eventName}</strong>
                    </td>

                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 999, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: 11.5, fontWeight: 750 }}>
                        +{item.xpReward} XP
                      </span>
                    </td>

                    <td>
                      {item.dailyCap && item.dailyCap > 0 ? (
                        <span style={{ fontSize: 12.5, fontWeight: 650, color: '#1E293B' }}>
                          Tối đa {item.dailyCap} XP/ngày
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic' }}>Không giới hạn</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => toggleActive(item)}
                        title={isActive ? 'Nhấn để tạm dừng' : 'Nhấn để kích hoạt'}
                        style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
                      >
                        <AdminStatusBadge status={isActive ? 'ACTIVE' : 'INACTIVE'} />
                      </button>
                    </td>

                    <td style={{ textAlign: 'right', paddingRight: 20 }}>
                      <AdminActionGroup>
                        <AdminActionButton tone="neutral" onClick={() => startEdit(item)}>
                          <BilingualText vi="Sửa" en="Edit" />
                        </AdminActionButton>
                        <AdminActionButton
                          tone="delete"
                          iconOnly
                          onClick={() => remove(item.id, item.eventName)}
                          title="Xóa quy tắc"
                          aria-label="Xóa quy tắc"
                        />
                      </AdminActionGroup>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {items.length > 0 && (
        <AdminPagination
          currentPage={currentPage + 1}
          pageSize={PAGE_SIZE}
          totalItems={items.length}
          onPageChange={(nextPage) => setPage(nextPage - 1)}
        />
      )}
    </div>
  );
}

export default AdminXpRulesPage;
