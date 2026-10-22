import { BilingualText, vietnameseLabel } from '@/components/common/BilingualText';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminCultureAiService } from '@/services/adminCultureAiService';
import { toast } from 'sonner';
import { Pencil, Play, Power, Trash2 } from 'lucide-react';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';

export function AdminAiScenariosPage() {
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirm, confirmationDialog } = useConfirmDialog();

  useEffect(() => {
    adminCultureAiService.listScenarioRecords().then(setScenarios).catch(error => toast.error(error.message)).finally(() => setLoading(false));
  }, []);

  const filteredScenarios = scenarios.filter(sc => {
    const q = search.trim().toLowerCase();
    return (!q || `${sc.title} ${sc.destination || ''}`.toLowerCase().includes(q)) && (topicFilter === 'all' || sc.topic === topicFilter) && (levelFilter === 'all' || sc.level === levelFilter) && (statusFilter === 'all' || sc.status === statusFilter);
  });

  const handleStatusChange = (id, newStatus) => {
    adminCultureAiService.updateScenarioRecordStatus(id, newStatus)
      .then(updated => setScenarios(current => current.map(item => item.id === id ? updated : item)))
      .catch(error => toast.error(error.message));
    toast.success(`Đã đổi trạng thái kịch bản sang: ${newStatus}`);
  };

  const handleDelete = async (id, title) => {
    const accepted = await confirm({ title: 'Xóa kịch bản AI?', description: `Kịch bản “${title}” sẽ bị xóa và không thể khôi phục.`, confirmLabel: 'Xóa kịch bản' });
    if (!accepted) return;
    await adminCultureAiService.deleteScenarioRecord(id);
    setScenarios(current => current.filter(item => item.id !== id));
    toast.success('Đã xóa kịch bản.');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="admin-badge admin-badge-success admin-scenario-status"><span className="admin-scenario-status-dot" aria-hidden="true" /><BilingualText>{"Đang hoạt động"}</BilingualText></span>;
      case 'DRAFT':
        return <span className="admin-badge admin-badge-warning admin-scenario-status"><span className="admin-scenario-status-dot" aria-hidden="true" /><BilingualText>{"Bản nháp"}</BilingualText></span>;
      case 'ARCHIVED':
        return <span className="admin-badge admin-badge-danger admin-scenario-status"><span className="admin-scenario-status-dot" aria-hidden="true" /><BilingualText>{"Đã khóa"}</BilingualText></span>;
      default:
        return <span className="admin-badge admin-scenario-status"><span className="admin-scenario-status-dot" aria-hidden="true" /><BilingualText>{status}</BilingualText></span>;
    }
  };

  return (
    <div className="admin-content admin-ai-scenarios-page">
      {confirmationDialog}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-red-hover)', letterSpacing: '0.08em', textTransform: 'uppercase' }}><BilingualText>{"ROLEPLAY & AI PROMPT DESIGN • NGƯỜI 4"}</BilingualText></span>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '32px' }}><BilingualText>{"Quản lý kịch bản AI"}</BilingualText></h1>
          <p style={{ margin: 0, color: 'var(--color-forest)', fontSize: '14px' }}><BilingualText>{"Thiết lập danh mục kịch bản nhập vai giao tiếp thực tế, gán nhân vật AI, kiểm soát độ khó và tiêu chí đánh giá phản xạ."}</BilingualText></p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/ai-settings" className="button secondary" style={{ fontSize: '13px' }}><BilingualText>{"Cấu hình mô hình AI"}</BilingualText></Link>
          <Link to="/admin/ai-scenarios/new" className="button" style={{ fontSize: '13px' }}><BilingualText>{"+ Tạo kịch bản mới"}</BilingualText></Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '18px 22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder={vietnameseLabel("Tìm theo tên kịch bản, địa điểm...")}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select value={topicFilter} onChange={e => setTopicFilter(e.target.value)}>
            <option value="all">{vietnameseLabel("Tất cả chủ đề")}</option>
            <option value="dining">{vietnameseLabel("Ẩm thực & Quán xá")}</option>
            <option value="shopping">{vietnameseLabel("Mua sắm & Mặc cả")}</option>
            <option value="travel">{vietnameseLabel("Di chuyển & Du lịch")}</option>
            <option value="hospitality">{vietnameseLabel("Khách sạn & Nghỉ dưỡng")}</option>
            <option value="social">{vietnameseLabel("Gia đình & Bạn bè")}</option>
            <option value="work">{vietnameseLabel("Giao tiếp công sở")}</option>
          </select>

          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
            <option value="all">{vietnameseLabel("Tất cả trình độ")}</option>
            <option value="A1">{vietnameseLabel("A1 - Sơ cấp 1")}</option>
            <option value="A2">{vietnameseLabel("A2 - Sơ cấp 2")}</option>
            <option value="B1">{vietnameseLabel("B1 - Trung cấp 1")}</option>
            <option value="B2">{vietnameseLabel("B2 - Trung cấp 2")}</option>
            <option value="C1">{vietnameseLabel("C1 - Nâng cao")}</option>
          </select>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">{vietnameseLabel("Tất cả trạng thái")}</option>
            <option value="ACTIVE">{vietnameseLabel("Đang hoạt động")}</option>
            <option value="DRAFT">{vietnameseLabel("Bản nháp")}</option>
            <option value="ARCHIVED">{vietnameseLabel("Đã khóa")}</option>
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
              <th className="admin-scenario-col-title"><BilingualText>{"Kịch bản & Bối cảnh"}</BilingualText></th>
              <th className="admin-scenario-col-role"><BilingualText>{"Nhân vật AI"}</BilingualText></th>
              <th className="admin-scenario-col-level"><BilingualText>{"Trình độ"}</BilingualText></th>
              <th className="admin-scenario-col-location"><BilingualText>{"Địa điểm"}</BilingualText></th>
              <th className="admin-scenario-col-completions"><BilingualText>{"Lượt hoàn thành"}</BilingualText></th>
              <th className="admin-scenario-col-status"><BilingualText>{"Trạng thái"}</BilingualText></th>
              <th className="admin-scenario-col-actions"><BilingualText>{"Thao tác"}</BilingualText></th>
            </tr>
          </thead>
          <tbody>
            {loading || filteredScenarios.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}><BilingualText>{"Không tìm thấy kịch bản AI nào phù hợp."}</BilingualText></td>
              </tr>
            ) : (
              filteredScenarios.map(sc => (
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
                      <strong style={{ color: 'var(--color-ink)' }}>{sc.completionsCount || 0} <BilingualText>{"lượt"}</BilingualText></strong>
                      {sc.avgScore > 0 && (
                        <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}><BilingualText>{"Điểm TB: "}</BilingualText>{sc.avgScore}/100</div>
                      )}
                    </div>
                  </td>

                  <td>{getStatusBadge(sc.status)}</td>

                  <td style={{ textAlign: 'right' }}>
                    <div className="admin-scenario-actions">
                      {sc.status !== 'ACTIVE' ? (
                        <button
                          className="button secondary admin-scenario-action admin-scenario-action--activate"
                          title="Kích hoạt kịch bản"
                          onClick={() => handleStatusChange(sc.id, 'ACTIVE')}
                        ><Power size={14} aria-hidden="true" /><BilingualText>{"Bật"}</BilingualText></button>
                      ) : (
                        <button
                          className="button secondary admin-scenario-action admin-scenario-action--disable"
                          title="Tạm khóa kịch bản"
                          onClick={() => handleStatusChange(sc.id, 'DRAFT')}
                        ><Power size={14} aria-hidden="true" /><BilingualText>{"Tắt"}</BilingualText></button>
                      )}

                      <Link
                        to={`/admin/ai-scenarios/${sc.id}`}
                        className="button secondary admin-scenario-action admin-scenario-action--edit"
                        title="Chỉnh sửa vai trò, bối cảnh, tiêu chí"
                      ><Pencil size={14} aria-hidden="true" /><BilingualText>{"Sửa"}</BilingualText></Link>

                      <Link
                        to={`/ai-roleplay/${sc.id}`}
                        target="_blank"
                        className="button secondary admin-scenario-action admin-scenario-action--try"
                        title="Thử nghiệm trực tiếp phiên nhập vai"
                      ><Play size={14} aria-hidden="true" /><BilingualText>{"Thử"}</BilingualText></Link>

                      <button
                        className="button secondary admin-scenario-action admin-scenario-action--delete"
                        title="Xóa kịch bản"
                        onClick={() => handleDelete(sc.id, sc.title)}
                      >
                        <Trash2 size={15} aria-hidden="true" />
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
