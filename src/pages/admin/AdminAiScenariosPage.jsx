import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminCultureAiService } from '@/services/adminCultureAiService';

export function AdminAiScenariosPage() {
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState('');

  const scenarios = adminCultureAiService.getScenarios({
    search,
    topic: topicFilter,
    level: levelFilter,
    status: statusFilter,
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleStatusChange = (id, newStatus) => {
    adminCultureAiService.updateScenarioStatus(id, newStatus);
    showToast(`Đã đổi trạng thái kịch bản sang: ${newStatus}`);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa kịch bản "${title}"?`)) {
      adminCultureAiService.deleteScenario(id);
      showToast('Đã xóa kịch bản.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="admin-badge admin-badge-success"><BilingualText>{"Đang hoạt động"}</BilingualText></span>;
      case 'DRAFT':
        return <span className="admin-badge admin-badge-warning"><BilingualText>{"Bản nháp"}</BilingualText></span>;
      case 'ARCHIVED':
        return <span className="admin-badge admin-badge-danger"><BilingualText>{"Đã khóa"}</BilingualText></span>;
      default:
        return <span className="admin-badge"><BilingualText>{status}</BilingualText></span>;
    }
  };

  return (
    <div className="admin-content">
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: 'var(--color-ink)', color: 'var(--color-surface)', padding: '12px 20px', borderRadius: '10px', zIndex: 9999, fontWeight: 700 }}>
          <BilingualText>{toast}</BilingualText>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-red-hover)', letterSpacing: '0.08em', textTransform: 'uppercase' }}><BilingualText>{"ROLEPLAY & AI PROMPT DESIGN • NGƯỜI 4"}</BilingualText></span>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '32px' }}><BilingualText>{"Quản lý kịch bản AI"}</BilingualText></h1>
          <p style={{ margin: 0, color: 'var(--color-forest)', fontSize: '14px' }}><BilingualText>{"Thiết lập danh mục kịch bản nhập vai giao tiếp thực tế, gán nhân vật AI, kiểm soát độ khó và tiêu chí đánh giá phản xạ."}</BilingualText></p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/ai-settings" className="button secondary" style={{ fontSize: '13px' }}><BilingualText>{"🤖 Cấu hình mô hình AI"}</BilingualText></Link>
          <Link to="/admin/ai-scenarios/new" className="button" style={{ fontSize: '13px' }}><BilingualText>{"+ Tạo kịch bản mới (Builder)"}</BilingualText></Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '18px 22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder={bilingualLabel("Tìm theo tên kịch bản, địa điểm...")}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select value={topicFilter} onChange={e => setTopicFilter(e.target.value)}>
            <option value="all">{bilingualLabel("Tất cả chủ đề")}</option>
            <option value="dining">{bilingualLabel("🍜 Ẩm thực & Quán xá")}</option>
            <option value="shopping">{bilingualLabel("🛍️ Mua sắm & Mặc cả")}</option>
            <option value="travel">{bilingualLabel("🛵 Di chuyển & Du lịch")}</option>
            <option value="hospitality">{bilingualLabel("🏨 Khách sạn & Nghỉ dưỡng")}</option>
            <option value="social">{bilingualLabel("🏡 Gia đình & Bạn bè")}</option>
            <option value="work">{bilingualLabel("💼 Giao tiếp công sở")}</option>
          </select>

          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
            <option value="all">{bilingualLabel("Tất cả trình độ")}</option>
            <option value="A1">{bilingualLabel("A1 - Sơ cấp 1")}</option>
            <option value="A2">{bilingualLabel("A2 - Sơ cấp 2")}</option>
            <option value="B1">{bilingualLabel("B1 - Trung cấp 1")}</option>
            <option value="B2">{bilingualLabel("B2 - Trung cấp 2")}</option>
            <option value="C1">{bilingualLabel("C1 - Nâng cao")}</option>
          </select>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">{bilingualLabel("Tất cả trạng thái")}</option>
            <option value="ACTIVE">{bilingualLabel("Đang hoạt động")}</option>
            <option value="DRAFT">{bilingualLabel("Bản nháp")}</option>
            <option value="ARCHIVED">{bilingualLabel("Đã khóa")}</option>
          </select>

          {(search || topicFilter !== 'all' || levelFilter !== 'all' || statusFilter !== 'all') && (
            <button
              className="button secondary"
              style={{ fontSize: '12px', padding: '10px 14px' }}
              onClick={() => { setSearch(''); setTopicFilter('all'); setLevelFilter('all'); setStatusFilter('all'); }}
            ><BilingualText>{"Đặt lại"}</BilingualText></button>
          )}
        </div>
      </div>

      {/* Scenarios Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '34%' }}><BilingualText>{"Kịch bản & Bối cảnh"}</BilingualText></th>
              <th><BilingualText>{"Nhân vật AI"}</BilingualText></th>
              <th><BilingualText>{"Trình độ"}</BilingualText></th>
              <th><BilingualText>{"Địa điểm"}</BilingualText></th>
              <th><BilingualText>{"Lượt hoàn thành"}</BilingualText></th>
              <th><BilingualText>{"Trạng thái"}</BilingualText></th>
              <th style={{ textAlign: 'right' }}><BilingualText>{"Thao tác"}</BilingualText></th>
            </tr>
          </thead>
          <tbody>
            {scenarios.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}><BilingualText>{"Không tìm thấy kịch bản AI nào phù hợp."}</BilingualText></td>
              </tr>
            ) : (
              scenarios.map(sc => (
                <tr key={sc.id}>
                  <td>
                    <div>
                      <strong style={{ fontSize: '14.5px', color: 'var(--color-ink)', display: 'block' }}>
                        <BilingualText vi={sc.titleVi || sc.title} en={sc.title} />
                      </strong>
                      <span style={{ fontSize: '12px', color: 'var(--color-forest)' }}>
                        {sc.topicName || sc.topic} • {sc.difficulty}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{sc.aiRole?.avatar || '🤖'}</span>
                      <div>
                        <strong style={{ fontSize: '13px', color: 'var(--color-ink)', display: 'block' }}>
                          {sc.aiRole?.name}
                        </strong>
                        <span style={{ fontSize: '11px', color: 'var(--color-forest)' }}>
                          {sc.aiRole?.role}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'var(--color-red-hover)', color: 'var(--color-surface)', fontSize: '11px', fontWeight: 800 }}>
                      {sc.level}
                    </span>
                  </td>

                  <td>
                    <span style={{ fontSize: '13px', color: 'var(--color-ink)' }}>
                      📍 {sc.destination}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontSize: '13px' }}>
                      <strong style={{ color: 'var(--color-ink)' }}>{sc.completionsCount || 0}<BilingualText>{"lượt"}</BilingualText></strong>
                      {sc.avgScore > 0 && (
                        <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}><BilingualText>{"Điểm TB:"}</BilingualText>{sc.avgScore}/100</div>
                      )}
                    </div>
                  </td>

                  <td>{getStatusBadge(sc.status)}</td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      {sc.status !== 'ACTIVE' ? (
                        <button
                          className="button secondary"
                          style={{ fontSize: '11px', padding: '5px 8px', color: 'var(--color-ink)' }}
                          title="Kích hoạt kịch bản"
                          onClick={() => handleStatusChange(sc.id, 'ACTIVE')}
                        ><BilingualText>{"✓ Bật"}</BilingualText></button>
                      ) : (
                        <button
                          className="button secondary"
                          style={{ fontSize: '11px', padding: '5px 8px', color: 'var(--color-red)' }}
                          title="Tạm khóa kịch bản"
                          onClick={() => handleStatusChange(sc.id, 'DRAFT')}
                        ><BilingualText>{"Tắt"}</BilingualText></button>
                      )}

                      <Link
                        to={`/admin/ai-scenarios/${sc.id}`}
                        className="button secondary"
                        style={{ fontSize: '11px', padding: '5px 8px' }}
                        title="Scenario Builder: Chỉnh sửa vai trò, bối cảnh, tiêu chí"
                      ><BilingualText>{"⚙️ Builder"}</BilingualText></Link>

                      <Link
                        to={`/ai-roleplay/${sc.id}`}
                        target="_blank"
                        className="button secondary"
                        style={{ fontSize: '11px', padding: '5px 8px' }}
                        title="Thử nghiệm trực tiếp phiên nhập vai"
                      ><BilingualText>{"🎮 Thử"}</BilingualText></Link>

                      <button
                        className="button secondary"
                        style={{ fontSize: '11px', padding: '5px 8px', color: 'var(--color-red)' }}
                        title="Xóa kịch bản"
                        onClick={() => handleDelete(sc.id, sc.title)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
