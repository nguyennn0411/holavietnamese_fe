import { ContentImage } from '@/components/common/ContentImage';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminCultureAiService } from '@/services/adminCultureAiService';

export function AdminCultureListPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState('');

  const categories = adminCultureAiService.getCategories();
  const articles = adminCultureAiService.getArticles({
    search,
    category: categoryFilter,
    status: statusFilter,
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleStatusChange = (id, newStatus) => {
    adminCultureAiService.updateArticleStatus(id, newStatus);
    showToast(`Đã cập nhật trạng thái bài viết thành: ${newStatus}`);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      adminCultureAiService.deleteArticle(id);
      showToast('Đã xóa bài viết thành công.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="admin-badge admin-badge-success">Đã xuất bản</span>;
      case 'IN_REVIEW':
        return <span className="admin-badge admin-badge-warning">Chờ duyệt</span>;
      case 'DRAFT':
        return <span className="admin-badge admin-badge-info">Bản nháp</span>;
      case 'ARCHIVED':
        return <span className="admin-badge admin-badge-danger">Đã lưu trữ</span>;
      default:
        return <span className="admin-badge">{status}</span>;
    }
  };

  return (
    <div className="admin-content">
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: 'var(--color-ink)', color: 'var(--color-surface)', padding: '12px 20px', borderRadius: '10px', zIndex: 9999, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-red-hover)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            VĂN HÓA & NỘI DUNG • NGƯỜI 4
          </span>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '32px' }}>Quản lý bài viết văn hóa</h1>
          <p style={{ margin: 0, color: 'var(--color-sage)', fontSize: '14px' }}>
            Tìm kiếm, kiểm duyệt, xuất bản và biên tập các bài viết khám phá văn hóa, ẩm thực và đời sống Việt Nam.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/culture-categories" className="button secondary" style={{ fontSize: '13px' }}>
            📑 Quản lý danh mục
          </Link>
          <Link to="/admin/culture/new" className="button" style={{ fontSize: '13px' }}>
            + Thêm bài viết mới
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '18px 22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr auto', gap: '14px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Tìm theo tiêu đề bài viết hoặc tên tác giả..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="all">Tất cả danh mục</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="PUBLISHED">Đã xuất bản (Published)</option>
            <option value="IN_REVIEW">Chờ duyệt (In Review)</option>
            <option value="DRAFT">Bản nháp (Draft)</option>
            <option value="ARCHIVED">Lưu trữ (Archived)</option>
          </select>

          {(search || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <button
              className="button secondary"
              style={{ fontSize: '12px', padding: '10px 14px' }}
              onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); }}
            >
              Đặt lại
            </button>
          )}
        </div>
      </div>

      {/* Articles Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>Bài viết & Tác giả</th>
                <th>Danh mục</th>
                <th>Vùng miền / Điểm đến</th>
                <th>Lượt xem</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
                    Không tìm thấy bài viết văn hóa nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                articles.map(article => (
                  <tr key={article.id}>
                    <td>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <ContentImage
                          src={article.coverImage}
                          alt={article.title}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ display: 'block', color: 'var(--color-ink)', fontSize: '14px', lineHeight: 1.3 }}>
                            {article.title}
                          </strong>
                          <span style={{ fontSize: '12px', color: 'var(--color-sage)' }}>
                            Bởi: <strong>{article.author}</strong> • Ngày đăng: {article.publishedAt}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '13px', fontWeight: 650, color: 'var(--color-ink)' }}>
                        {article.categoryName}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '13px', color: 'var(--color-ink)' }}>
                        📍 {article.destination || article.region}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ink)' }}>
                        {article.views.toLocaleString()}
                      </span>
                    </td>

                    <td>{getStatusBadge(article.status)}</td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {article.status !== 'PUBLISHED' ? (
                          <button
                            className="button secondary"
                            style={{ fontSize: '11px', padding: '5px 9px', color: 'var(--color-ink)', borderColor: 'var(--color-border)' }}
                            title="Duyệt & Xuất bản"
                            onClick={() => handleStatusChange(article.id, 'PUBLISHED')}
                          >
                            ✓ Duyệt
                          </button>
                        ) : (
                          <button
                            className="button secondary"
                            style={{ fontSize: '11px', padding: '5px 9px', color: 'var(--color-red)', borderColor: 'var(--color-red-soft)' }}
                            title="Gỡ bài về bản nháp"
                            onClick={() => handleStatusChange(article.id, 'DRAFT')}
                          >
                            Gỡ bài
                          </button>
                        )}

                        <Link
                          to={`/admin/culture/${article.id}`}
                          className="button secondary"
                          style={{ fontSize: '11px', padding: '5px 9px' }}
                          title="Chỉnh sửa nội dung"
                        >
                          ✏️ Sửa
                        </Link>

                        <Link
                          to={`/culture/${article.id}`}
                          target="_blank"
                          className="button secondary"
                          style={{ fontSize: '11px', padding: '5px 9px' }}
                          title="Xem trên trang học viên"
                        >
                          👁️ Xem
                        </Link>

                        <button
                          className="button secondary"
                          style={{ fontSize: '11px', padding: '5px 9px', color: 'var(--color-red)' }}
                          title="Xóa bài viết"
                          onClick={() => handleDelete(article.id, article.title)}
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
    </div>
  );
}
