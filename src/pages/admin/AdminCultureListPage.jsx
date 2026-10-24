import { BilingualText, vietnameseLabel, bilingualLabel } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminCultureAiService } from '@/services/adminCultureAiService';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';

export function AdminCultureListPage() {
  const { confirm, confirmationDialog } = useConfirmDialog();
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

  const handleDelete = async (id, title) => {
    if (await confirm({
      title: bilingualLabel('Xóa bài viết văn hóa?', 'Delete cultural article?'),
      description: bilingualLabel(`Bài viết “${title}” sẽ bị xóa và không thể khôi phục.`, `Article “${title}” will be deleted and cannot be restored.`),
      confirmLabel: bilingualLabel('Xóa bài viết', 'Delete article'),
    })) {
      adminCultureAiService.deleteArticle(id);
      showToast('Đã xóa bài viết thành công.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="admin-badge admin-badge-success"><BilingualText>{"Đã xuất bản"}</BilingualText></span>;
      case 'IN_REVIEW':
        return <span className="admin-badge admin-badge-warning"><BilingualText>{"Chờ duyệt"}</BilingualText></span>;
      case 'DRAFT':
        return <span className="admin-badge admin-badge-info"><BilingualText>{"Bản nháp"}</BilingualText></span>;
      case 'ARCHIVED':
        return <span className="admin-badge admin-badge-danger"><BilingualText>{"Đã lưu trữ"}</BilingualText></span>;
      default:
        return <span className="admin-badge"><BilingualText>{status}</BilingualText></span>;
    }
  };

  return (
    <div className="admin-content">
      {confirmationDialog}
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: 'var(--color-ink)', color: 'var(--color-surface)', padding: '12px 20px', borderRadius: '10px', zIndex: 9999, fontWeight: 700 }}>
          <BilingualText>{toast}</BilingualText>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary-orange, #F97316)', letterSpacing: '0.08em', textTransform: 'uppercase' }}><BilingualText>{"VĂN HÓA & NỘI DUNG • NGƯỜI 4"}</BilingualText></span>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '30px', fontWeight: 800, color: 'var(--text-primary, #253044)' }}><BilingualText>{"Quản lý bài viết văn hóa"}</BilingualText></h1>
          <p style={{ margin: 0, color: 'var(--text-secondary, #64748B)', fontSize: '14px' }}><BilingualText>{"Tìm kiếm, kiểm duyệt, xuất bản và biên tập các bài viết khám phá văn hóa, ẩm thực và đời sống Việt Nam."}</BilingualText></p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/culture-categories" className="button secondary" style={{ fontSize: '13px' }}><BilingualText>{"Quản lý danh mục"}</BilingualText></Link>
          <Link to="/admin/culture/new" className="button" style={{ fontSize: '13px' }}><BilingualText>{"+ Thêm bài viết mới"}</BilingualText></Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '18px 22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr auto', gap: '14px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder={vietnameseLabel("Tìm theo tiêu đề bài viết hoặc tên tác giả...")}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="all">{vietnameseLabel("Tất cả danh mục")}</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">{vietnameseLabel("Tất cả trạng thái")}</option>
            <option value="PUBLISHED">{vietnameseLabel("Đã xuất bản")}</option>
            <option value="IN_REVIEW">{vietnameseLabel("Chờ duyệt")}</option>
            <option value="DRAFT">{vietnameseLabel("Bản nháp")}</option>
            <option value="ARCHIVED">{vietnameseLabel("Lưu trữ")}</option>
          </select>

          {(search || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <button
              className="button secondary"
              style={{ fontSize: '12px', padding: '10px 14px' }}
              onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); }}
            ><BilingualText>{"Đặt lại"}</BilingualText></button>
          )}
        </div>
      </div>

      {/* Articles Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}><BilingualText>{"Bài viết & Tác giả"}</BilingualText></th>
                <th><BilingualText>{"Danh mục"}</BilingualText></th>
                <th><BilingualText>{"Vùng miền / Điểm đến"}</BilingualText></th>
                <th><BilingualText>{"Lượt xem"}</BilingualText></th>
                <th><BilingualText>{"Trạng thái"}</BilingualText></th>
                <th style={{ textAlign: 'right' }}><BilingualText>{"Thao tác"}</BilingualText></th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}><BilingualText>{"Không tìm thấy bài viết văn hóa nào phù hợp với bộ lọc."}</BilingualText></td>
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
                            <BilingualText vi={article.titleVi || article.title} en={article.title} />
                          </strong>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary, #64748B)' }}><BilingualText>{"Bởi:"}</BilingualText> <strong>{article.author}</strong> <BilingualText>{"• Ngày đăng:"}</BilingualText> {article.publishedAt}
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
                        {article.destination || article.region}
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
                            title={bilingualLabel("Duyệt & Xuất bản", "Approve & Publish")}
                            onClick={() => handleStatusChange(article.id, 'PUBLISHED')}
                          ><BilingualText>{"Duyệt"}</BilingualText></button>
                        ) : (
                          <button
                            className="button secondary"
                            style={{ fontSize: '11px', padding: '5px 9px', color: 'var(--color-red)', borderColor: 'var(--color-red-soft)' }}
                            title={bilingualLabel("Gỡ bài về bản nháp", "Revert to draft")}
                            onClick={() => handleStatusChange(article.id, 'DRAFT')}
                          ><BilingualText>{"Gỡ bài"}</BilingualText></button>
                        )}

                        <Link
                          to={`/admin/culture/${article.id}`}
                          className="button secondary"
                          style={{ fontSize: '11px', padding: '5px 9px' }}
                          title={bilingualLabel("Chỉnh sửa nội dung", "Edit content")}
                        ><BilingualText>{"Sửa"}</BilingualText></Link>

                        <Link
                          to={`/culture/${article.id}`}
                          target="_blank"
                          className="button secondary"
                          style={{ fontSize: '11px', padding: '5px 9px' }}
                          title={bilingualLabel("Xem trên trang học viên", "View as learner")}
                        ><BilingualText>{"Xem"}</BilingualText></Link>

                        <button
                          className="button secondary"
                          style={{ fontSize: '11px', padding: '5px 9px', color: 'var(--color-red)' }}
                          title={bilingualLabel("Xóa bài viết", "Delete article")}
                          onClick={() => handleDelete(article.id, article.title)}
                        >
                          <BilingualText vi="Xóa" en="Delete" />
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
