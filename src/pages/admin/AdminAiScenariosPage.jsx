import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminCultureAiService } from '@/services/adminCultureAiService';
import '@/presentation/styles/admin.css';

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
        return <span className="admin-badge admin-badge-success">Đang hoạt động</span>;
      case 'DRAFT':
        return <span className="admin-badge admin-badge-warning">Bản nháp</span>;
      case 'ARCHIVED':
        return <span className="admin-badge admin-badge-danger">Đã khóa</span>;
      default:
        return <span className="admin-badge">{status}</span>;
    }
  };

  return (
    <div className="admin-content">
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#245c48', color: '#fff', padding: '12px 20px', borderRadius: '10px', zIndex: 9999, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#a62a24', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ROLEPLAY & AI PROMPT DESIGN • NGƯỜI 4
          </span>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '32px' }}>Quản lý kịch bản AI</h1>
          <p style={{ margin: 0, color: '#665349', fontSize: '14px' }}>
            Thiết lập danh mục kịch bản nhập vai giao tiếp thực tế, gán nhân vật AI, kiểm soát độ khó và tiêu chí đánh giá phản xạ.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/ai-settings" className="button secondary" style={{ fontSize: '13px' }}>
            🤖 Cấu hình mô hình AI
          </Link>
          <Link to="/admin/ai-scenarios/new" className="button" style={{ fontSize: '13px' }}>
            + Tạo kịch bản mới (Builder)
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '18px 22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Tìm theo tên kịch bản, địa điểm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select value={topicFilter} onChange={e => setTopicFilter(e.target.value)}>
            <option value="all">Tất cả chủ đề</option>
            <option value="dining">🍜 Ẩm thực & Quán xá</option>
            <option value="shopping">🛍️ Mua sắm & Mặc cả</option>
            <option value="travel">🛵 Di chuyển & Du lịch</option>
            <option value="hospitality">🏨 Khách sạn & Nghỉ dưỡng</option>
            <option value="social">🏡 Gia đình & Bạn bè</option>
            <option value="work">💼 Giao tiếp công sở</option>
          </select>

          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
            <option value="all">Tất cả trình độ</option>
            <option value="A1">A1 - Sơ cấp 1</option>
            <option value="A2">A2 - Sơ cấp 2</option>
            <option value="B1">B1 - Trung cấp 1</option>
            <option value="B2">B2 - Trung cấp 2</option>
            <option value="C1">C1 - Nâng cao</option>
          </select>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="DRAFT">Bản nháp</option>
            <option value="ARCHIVED">Đã khóa</option>
          </select>

          {(search || topicFilter !== 'all' || levelFilter !== 'all' || statusFilter !== 'all') && (
            <button
              className="button secondary"
              style={{ fontSize: '12px', padding: '10px 14px' }}
              onClick={() => { setSearch(''); setTopicFilter('all'); setLevelFilter('all'); setStatusFilter('all'); }}
            >
              Đặt lại
            </button>
          )}
        </div>
      </div>

      {/* Scenarios Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '34%' }}>Kịch bản & Bối cảnh</th>
              <th>Nhân vật AI</th>
              <th>Trình độ</th>
              <th>Địa điểm</th>
              <th>Lượt hoàn thành</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#887266' }}>
                  Không tìm thấy kịch bản AI nào phù hợp.
                </td>
              </tr>
            ) : (
              scenarios.map(sc => (
                <tr key={sc.id}>
                  <td>
                    <div>
                      <strong style={{ fontSize: '14.5px', color: '#321c17', display: 'block' }}>
                        {sc.title}
                      </strong>
                      <span style={{ fontSize: '12px', color: '#7a6053' }}>
                        {sc.topicName || sc.topic} • {sc.difficulty}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{sc.aiRole?.avatar || '🤖'}</span>
                      <div>
                        <strong style={{ fontSize: '13px', color: '#2d1813', display: 'block' }}>
                          {sc.aiRole?.name}
                        </strong>
                        <span style={{ fontSize: '11px', color: '#7a6255' }}>
                          {sc.aiRole?.role}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#9f2d20', color: '#fff', fontSize: '11px', fontWeight: 800 }}>
                      {sc.level}
                    </span>
                  </td>

                  <td>
                    <span style={{ fontSize: '13px', color: '#4a3227' }}>
                      📍 {sc.destination}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontSize: '13px' }}>
                      <strong style={{ color: '#245c48' }}>{sc.completionsCount || 0} lượt</strong>
                      {sc.avgScore > 0 && (
                        <div style={{ fontSize: '11px', color: '#887063' }}>Điểm TB: {sc.avgScore}/100</div>
                      )}
                    </div>
                  </td>

                  <td>{getStatusBadge(sc.status)}</td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      {sc.status !== 'ACTIVE' ? (
                        <button
                          className="button secondary"
                          style={{ fontSize: '11px', padding: '5px 8px', color: '#1b5e20' }}
                          title="Kích hoạt kịch bản"
                          onClick={() => handleStatusChange(sc.id, 'ACTIVE')}
                        >
                          ✓ Bật
                        </button>
                      ) : (
                        <button
                          className="button secondary"
                          style={{ fontSize: '11px', padding: '5px 8px', color: '#b72b25' }}
                          title="Tạm khóa kịch bản"
                          onClick={() => handleStatusChange(sc.id, 'DRAFT')}
                        >
                          Tắt
                        </button>
                      )}

                      <Link
                        to={`/admin/ai-scenarios/${sc.id}`}
                        className="button secondary"
                        style={{ fontSize: '11px', padding: '5px 8px' }}
                        title="Scenario Builder: Chỉnh sửa vai trò, bối cảnh, tiêu chí"
                      >
                        ⚙️ Builder
                      </Link>

                      <Link
                        to={`/ai-roleplay/${sc.id}`}
                        target="_blank"
                        className="button secondary"
                        style={{ fontSize: '11px', padding: '5px 8px' }}
                        title="Thử nghiệm trực tiếp phiên nhập vai"
                      >
                        🎮 Thử
                      </Link>

                      <button
                        className="button secondary"
                        style={{ fontSize: '11px', padding: '5px 8px', color: '#c62828' }}
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
