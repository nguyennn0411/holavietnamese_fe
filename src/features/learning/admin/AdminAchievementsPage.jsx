import { useState, useEffect, useMemo } from 'react';
import { BilingualText, bilingualLabel, useTextLanguage } from '@/shared/components/common/BilingualText';
import { Modal } from '@/shared/components/common/Modal';
import { adminService } from '@/features/admin/api/adminService';
import { useConfirmDialog } from '@/shared/components/common/ConfirmDialog';
import { Trophy, Award, Flame, BookOpen, Sparkles, Plus, Power, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AdminActionButton, AdminActionGroup } from '@/shared/components/common/AdminTableActions';
import { AdminPagination } from '@/shared/components/common/AdminPagination';
import { AdminStatusBadge } from '@/shared/components/common/AdminStatusBadge';
import { AdminSearchBar } from '@/shared/components/common/AdminSearchBar';

const PAGE_SIZE = 10;

const CATEGORIES = [
  { value: 'LESSON', label: 'Bài học', labelEn: 'Lessons', icon: BookOpen, color: '#2563EB' },
  { value: 'STREAK', label: 'Chuỗi học', labelEn: 'Streaks', icon: Flame, color: '#EA580C' },
  { value: 'VOCABULARY', label: 'Từ vựng', labelEn: 'Vocabulary', icon: BookOpen, color: '#059669' },
  { value: 'QUIZ', label: 'Kiểm tra', labelEn: 'Quizzes', icon: Award, color: '#7C3AED' },
  { value: 'AI_TUTOR', label: 'Hội thoại AI', labelEn: 'AI Tutor', icon: Sparkles, color: '#D97706' },
  { value: 'GENERAL', label: 'Chung', labelEn: 'General', icon: Trophy, color: '#4B5563' },
];

const CONDITION_TYPES = [
  { value: 'LESSON_COMPLETED', label: 'Số bài học hoàn thành', labelEn: 'Lessons completed', unit: 'bài' },
  { value: 'STREAK_DAYS', label: 'Chuỗi ngày học liên tục', labelEn: 'Streak days', unit: 'ngày' },
  { value: 'VOCAB_LEARNED', label: 'Số từ vựng ghi nhớ', labelEn: 'Words mastered', unit: 'từ' },
  { value: 'QUIZ_PERFECT', label: 'Số bài quiz đạt điểm tối đa', labelEn: 'Perfect score quizzes', unit: 'bài' },
  { value: 'AI_ROLEPLAY_COMPLETED', label: 'Số lượt hội thoại AI hoàn thành', labelEn: 'AI roleplays finished', unit: 'lượt' },
];

const initialBadge = {
  code: '',
  name: '',
  description: '',
  iconUrl: '',
  category: 'LESSON',
  conditionType: 'LESSON_COMPLETED',
  conditionValue: 1,
  xpReward: 50,
  status: 'ACTIVE',
};

export function AdminAchievementsPage() {
  useTextLanguage();
  const [achievements, setAchievements] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialBadge);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { confirm, confirmationDialog } = useConfirmDialog();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAchievements();
      setAchievements(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách thành tích.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(initialBadge);
    setShowModal(true);
  };

  const handleOpenEdit = (badge) => {
    setEditingId(badge.id);
    setForm({
      code: badge.code || '',
      name: badge.name || badge.title || '',
      description: badge.description || badge.desc || '',
      iconUrl: badge.iconUrl || '',
      category: badge.category || 'LESSON',
      conditionType: badge.conditionType || 'LESSON_COMPLETED',
      conditionValue: badge.conditionValue ?? 1,
      xpReward: badge.xpReward ?? 50,
      status: badge.status || (badge.active ? 'ACTIVE' : 'INACTIVE'),
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      code: form.code.trim().toUpperCase().replace(/\s+/g, '_'),
      name: form.name.trim(),
      description: form.description ? form.description.trim() : '',
      iconUrl: form.iconUrl ? form.iconUrl.trim() : '',
      category: form.category || 'GENERAL',
      conditionType: form.conditionType,
      conditionValue: parseInt(form.conditionValue, 10) || 1,
      xpReward: parseInt(form.xpReward, 10) || 0,
      status: form.status || 'ACTIVE',
      active: form.status === 'ACTIVE',
    };

    try {
      if (editingId) {
        await adminService.updateAchievement(editingId, payload);
        setMsg(bilingualLabel('Cập nhật huy hiệu thành công!', 'Badge updated successfully!'));
      } else {
        await adminService.createAchievement(payload);
        setMsg(bilingualLabel('Khởi tạo huy hiệu mới thành công!', 'New badge created successfully!'));
      }
      setShowModal(false);
      setEditingId(null);
      setForm(initialBadge);
      await loadData();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Lỗi lưu thông tin huy hiệu.');
    }
  };

  const handleToggleStatus = async (badge) => {
    const isCurrentlyActive = badge.status === 'ACTIVE' || badge.active === true;
    const nextStatus = isCurrentlyActive ? 'INACTIVE' : 'ACTIVE';

    try {
      await adminService.updateAchievement(badge.id, {
        code: badge.code,
        name: badge.name || badge.title,
        description: badge.description || badge.desc || '',
        iconUrl: badge.iconUrl || '',
        category: badge.category || 'GENERAL',
        conditionType: badge.conditionType || 'LESSON_COMPLETED',
        conditionValue: badge.conditionValue ?? 1,
        xpReward: badge.xpReward ?? 50,
        status: nextStatus,
        active: nextStatus === 'ACTIVE',
      });
      setMsg(nextStatus === 'ACTIVE' ? 'Đã bật huy hiệu hoạt động.' : 'Đã tạm ẩn huy hiệu.');
      await loadData();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Lỗi cập nhật trạng thái huy hiệu.');
    }
  };

  const handleDelete = async (id, name) => {
    const ok = await confirm({
      title: bilingualLabel('Xóa huy hiệu?', 'Delete badge?'),
      description: bilingualLabel(
        `Bạn có chắc muốn xóa huy hiệu "${name}"? Hành động này không thể hoàn tác.`,
        `Are you sure you want to delete badge "${name}"? This action cannot be undone.`
      ),
      confirmLabel: bilingualLabel('Xóa huy hiệu', 'Delete badge'),
      tone: 'danger',
    });
    if (!ok) return;

    try {
      await adminService.deleteAchievement(id);
      setMsg('Đã xóa huy hiệu thành công.');
      await loadData();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Lỗi khi xóa huy hiệu.');
    }
  };

  const stats = useMemo(() => {
    const total = achievements.length;
    const active = achievements.filter((a) => a.status === 'ACTIVE' || a.active === true).length;
    const totalXp = achievements.reduce((acc, a) => acc + (a.xpReward || 0), 0);
    return { total, active, totalXp };
  }, [achievements]);

  const filteredAchievements = useMemo(() => {
    return achievements.filter((badge) => {
      const matchSearch =
        !search.trim() ||
        (badge.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (badge.code || '').toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'ALL' || badge.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [achievements, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAchievements.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);

  const paginatedAchievements = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    return filteredAchievements.slice(start, start + PAGE_SIZE);
  }, [filteredAchievements, currentPage]);

  return (
    <div className="admin-achievements-page" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {confirmationDialog}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: '999px', background: '#FFFBEB', border: '1px solid #FDE68A', color: '#B45309', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>
            <Trophy size={13} />
            <BilingualText vi="HỆ THỐNG · GAMIFICATION & HUY HIỆU" en="SYSTEM · GAMIFICATION & BADGES" />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
            <BilingualText vi="Quản lý Thành tích & Huy hiệu" en="Achievements & Badges Management" />
          </h1>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.92rem' }}>
            <BilingualText
              vi="Cấu hình danh mục huy hiệu, điều kiện mở khóa và điểm thưởng XP tự động cho học viên."
              en="Configure badges, unlocking conditions, and automatic XP rewards for learners."
            />
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="admin-btn admin-btn-primary"
        >
          <Plus size={16} />
          <BilingualText vi="Thêm huy hiệu mới" en="Add New Badge" />
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="admin-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={22} />
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <BilingualText vi="Tổng số huy hiệu" en="Total Badges" />
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
              <BilingualText vi="Đang hoạt động" en="Active Badges" />
            </span>
            <div style={{ fontSize: '1.65rem', fontWeight: 850, color: '#15803D', lineHeight: 1.2, marginTop: 2 }}>
              {stats.active}
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <BilingualText vi="Tổng điểm thưởng XP" en="Total XP Rewards" />
            </span>
            <div style={{ fontSize: '1.65rem', fontWeight: 850, color: '#B45309', lineHeight: 1.2, marginTop: 2 }}>
              +{stats.totalXp} XP
            </div>
          </div>
        </div>
      </div>

      {/* Notices */}
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

      {/* Filter Bar */}
      <div className="admin-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <AdminSearchBar
          value={search}
          onChange={(val) => { setSearch(val); setPage(0); }}
          placeholderVi="Tìm huy hiệu theo tên, mã code…"
          placeholderEn="Search by name, code…"
          maxWidth="340px"
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginLeft: 'auto' }}>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
            style={{ height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#1E293B', fontSize: 13, fontWeight: 600 }}
          >
            <option value="ALL">Tất cả danh mục (All)</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label} ({cat.labelEn})
              </option>
            ))}
          </select>

          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={loadData}
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={14} className={loading ? 'spin-animation' : ''} />
            <BilingualText vi="Tải lại" en="Reload" />
          </button>
        </div>
      </div>

      {/* Achievements Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th><BilingualText vi="Mã Code & Biểu tượng" en="Code & Icon" /></th>
              <th><BilingualText vi="Tên & Mô tả huy hiệu" en="Name & Description" /></th>
              <th><BilingualText vi="Danh mục" en="Category" /></th>
              <th><BilingualText vi="Điều kiện mở khóa" en="Unlock Condition" /></th>
              <th><BilingualText vi="Thưởng XP" en="XP Reward" /></th>
              <th style={{ textAlign: 'center' }}><BilingualText vi="Trạng thái" en="Status" /></th>
              <th style={{ textAlign: 'right', paddingRight: 20 }}><BilingualText vi="Thao tác" en="Actions" /></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
                  <RefreshCw size={24} className="spin-animation" style={{ color: '#EA580C', margin: '0 auto 8px' }} />
                  <BilingualText vi="Đang tải danh sách huy hiệu…" en="Loading badges…" />
                </td>
              </tr>
            ) : paginatedAchievements.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '50px 0', color: '#64748B' }}>
                  <BilingualText vi="Không có huy hiệu nào phù hợp với bộ lọc." en="No badges match the current filters." />
                </td>
              </tr>
            ) : (
              paginatedAchievements.map((badge) => {
                const isActive = badge.status === 'ACTIVE' || badge.active === true;
                const categoryMeta = CATEGORIES.find((c) => c.value === badge.category) || CATEGORIES[5];
                const conditionMeta = CONDITION_TYPES.find((c) => c.value === badge.conditionType) || { label: badge.conditionType, unit: '' };

                return (
                  <tr key={badge.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 36, height: 36, borderRadius: 10, background: '#FFF7ED', border: '1px solid #FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                          {badge.iconUrl && badge.iconUrl.startsWith('http') ? (
                            <img src={badge.iconUrl} alt={badge.name} style={{ width: 22, height: 22, objectFit: 'contain' }} />
                          ) : (
                            '🏆'
                          )}
                        </span>
                        <div>
                          <code style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{badge.code}</code>
                        </div>
                      </div>
                    </td>

                    <td style={{ maxWidth: 280 }}>
                      <strong style={{ display: 'block', color: '#0F172A', marginBottom: 2 }}>{badge.name || badge.title}</strong>
                      <span style={{ fontSize: 12, color: '#64748B', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {badge.description || badge.desc || '—'}
                      </span>
                    </td>

                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 11.5, fontWeight: 650, color: '#334155' }}>
                        <BilingualText vi={categoryMeta.label} en={categoryMeta.labelEn} />
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: 12.5 }}>
                        <span style={{ color: '#64748B' }}>{conditionMeta.label}:</span>{' '}
                        <strong style={{ color: '#0F172A' }}>{badge.conditionValue ?? 1} {conditionMeta.unit}</strong>
                      </div>
                    </td>

                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 999, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: 11.5, fontWeight: 750 }}>
                        +{badge.xpReward ?? 0} XP
                      </span>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(badge)}
                        title={isActive ? 'Nhấn để tạm ẩn' : 'Nhấn để kích hoạt'}
                        style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
                      >
                        <AdminStatusBadge status={isActive ? 'ACTIVE' : 'INACTIVE'} />
                      </button>
                    </td>

                    <td style={{ textAlign: 'right', paddingRight: 20 }}>
                      <AdminActionGroup>
                        <AdminActionButton tone="neutral" onClick={() => handleOpenEdit(badge)}>
                          <BilingualText vi="Sửa" en="Edit" />
                        </AdminActionButton>
                        <AdminActionButton
                          tone="delete"
                          iconOnly
                          onClick={() => handleDelete(badge.id, badge.name || badge.title)}
                          title="Xóa huy hiệu"
                          aria-label="Xóa huy hiệu"
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

      <AdminPagination
        currentPage={currentPage + 1}
        pageSize={PAGE_SIZE}
        totalItems={filteredAchievements.length}
        onPageChange={(nextPage) => setPage(nextPage - 1)}
      />

      {/* Modal Create / Edit */}
      {showModal && (
        <Modal
          title={bilingualLabel(editingId ? 'Chỉnh sửa Huy hiệu' : 'Tạo Huy hiệu mới', editingId ? 'Edit Badge' : 'Create New Badge')}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 5 }}>
                  <BilingualText vi="Mã Code duy nhất *" en="Unique Code *" />
                </label>
                <input
                  type="text"
                  placeholder="VD: STREAK_30_DAYS"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                  style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 5 }}>
                  <BilingualText vi="Tên huy hiệu *" en="Badge Name *" />
                </label>
                <input
                  type="text"
                  placeholder="VD: Chiến Binh Kiên Trì"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 5 }}>
                <BilingualText vi="Mô tả huy hiệu" en="Badge Description" />
              </label>
              <textarea
                placeholder="Mô tả ý nghĩa và hướng dẫn học viên cách nhận huy hiệu này…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 5 }}>
                  <BilingualText vi="Danh mục" en="Category" />
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', height: 38, padding: '0 10px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, background: '#FFF' }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label} ({cat.labelEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 5 }}>
                  <BilingualText vi="Trạng thái" en="Status" />
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  style={{ width: '100%', height: 38, padding: '0 10px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, background: '#FFF' }}
                >
                  <option value="ACTIVE">Hoạt động (Active)</option>
                  <option value="INACTIVE">Tạm ẩn (Inactive)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 5 }}>
                  <BilingualText vi="Loại điều kiện mở khóa *" en="Unlock Condition *" />
                </label>
                <select
                  value={form.conditionType}
                  onChange={(e) => setForm({ ...form, conditionType: e.target.value })}
                  style={{ width: '100%', height: 38, padding: '0 10px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, background: '#FFF' }}
                >
                  {CONDITION_TYPES.map((cond) => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label} ({cond.labelEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 5 }}>
                  <BilingualText vi="Giá trị cần đạt *" en="Required Target Value *" />
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.conditionValue}
                  onChange={(e) => setForm({ ...form, conditionValue: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                  style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 5 }}>
                  <BilingualText vi="Điểm thưởng XP *" en="XP Reward *" />
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={form.xpReward}
                  onChange={(e) => setForm({ ...form, xpReward: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                  style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 5 }}>
                  <BilingualText vi="Icon URL / Ảnh huy hiệu" en="Badge Icon URL" />
                </label>
                <input
                  type="text"
                  placeholder="https://... hoặc /badges/icon.png"
                  value={form.iconUrl}
                  onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
                  style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, paddingTop: 14, borderTop: '1px solid #E2E8F0', marginTop: 6 }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="admin-btn admin-btn-secondary"
              >
                <BilingualText vi="Hủy" en="Cancel" />
              </button>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
              >
                <BilingualText vi={editingId ? 'Lưu thay đổi' : 'Tạo huy hiệu'} en={editingId ? 'Save Changes' : 'Create Badge'} />
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default AdminAchievementsPage;
