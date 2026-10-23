import { BilingualText, bilingualLabel, useBilingualLabel } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { Modal } from '@/components/common/Modal';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, Eye, Pencil, Power, Trash2 } from 'lucide-react';
import { adminCultureAiService } from '@/services/adminCultureAiService';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';

const DESTINATION_LABELS = {
  all: { vi: 'Toàn quốc', en: 'All Vietnam' },
  'Toàn quốc': { vi: 'Toàn quốc', en: 'All Vietnam' },
  hanoi: { vi: 'Hà Nội', en: 'Hanoi' },
  'Hà Nội': { vi: 'Hà Nội', en: 'Hanoi' },
  hue: { vi: 'Huế', en: 'Hue' },
  'Huế': { vi: 'Huế', en: 'Hue' },
  hoian: { vi: 'Hội An', en: 'Hoi An' },
  'Hội An': { vi: 'Hội An', en: 'Hoi An' },
  saigon: { vi: 'TP.HCM', en: 'Ho Chi Minh City' },
  'TP.HCM': { vi: 'TP.HCM', en: 'Ho Chi Minh City' },
  'Hà Nội & TP.HCM': { vi: 'Hà Nội & TP.HCM', en: 'Hanoi & HCMC' },
};

export function AdminCultureListPage() {
  const { confirm, confirmationDialog } = useConfirmDialog();
  const label = useBilingualLabel();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'categories' ? 'categories' : 'articles';

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingCategory, setEditingCategory] = useState(null);
  const [toast, setToast] = useState('');
  const [, setRefreshKey] = useState(0);

  useEffect(() => {
    const refresh = () => setRefreshKey(v => v + 1);
    window.addEventListener('hola-culture-updated', refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('hola-culture-updated', refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

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

  const switchTab = (tab) => {
    if (tab === 'categories') {
      setSearchParams({ tab: 'categories' }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleStatusChange = (id, newStatus) => {
    adminCultureAiService.updateArticleStatus(id, newStatus);
    setRefreshKey(v => v + 1);
    showToast(label(`Đã cập nhật trạng thái bài viết: ${newStatus}`, `Article status updated to: ${newStatus}`));
  };

  const handleDelete = async (id, title) => {
    if (await confirm({
      title: bilingualLabel('Xóa bài viết văn hóa?', 'Delete cultural article?'),
      description: bilingualLabel(`Bài viết “${title}” sẽ bị xóa và không thể khôi phục.`, `Article “${title}” will be deleted and cannot be restored.`),
      confirmLabel: bilingualLabel('Xóa bài viết', 'Delete article'),
    })) {
      adminCultureAiService.deleteArticle(id);
      setRefreshKey(v => v + 1);
      showToast(label('Đã xóa bài viết thành công.', 'Article deleted successfully.'));
    }
  };

  const handleMoveCategory = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const list = [...categories];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    adminCultureAiService.reorderCategories(reordered);
    setRefreshKey(v => v + 1);
    showToast(label('Đã cập nhật thứ tự danh mục!', 'Category order updated!'));
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) return;

    adminCultureAiService.saveCategory(editingCategory);
    setEditingCategory(null);
    setRefreshKey(v => v + 1);
    showToast(label('Đã lưu thông tin danh mục thành công!', 'Category saved successfully!'));
  };

  const handleDeleteCategory = async (id, name) => {
    if (await confirm({
      title: bilingualLabel('Xóa danh mục văn hóa?', 'Delete cultural category?'),
      description: bilingualLabel(`Danh mục “${name}” sẽ bị xóa khỏi hệ thống.`, `Category “${name}” will be removed from the system.`),
      confirmLabel: bilingualLabel('Xóa danh mục', 'Delete category'),
    })) {
      adminCultureAiService.deleteCategory(id);
      setRefreshKey(v => v + 1);
      showToast(label('Đã xóa danh mục.', 'Category deleted.'));
    }
  };

  const getDestinationDisplay = (article) => {
    const raw = article.destination || article.region || 'all';
    const mapped = DESTINATION_LABELS[raw];
    return mapped ? label(mapped.vi, mapped.en) : raw;
  };

  const getStatusBadge = (status) => {
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      height: '28px',
      padding: '0 11px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 700,
      whiteSpace: 'nowrap',
      lineHeight: 1,
    };

    switch (status) {
      case 'PUBLISHED':
        return (
          <span
            style={{
              ...baseStyle,
              background: '#dcfce7',
              color: '#15803d',
              border: '1px solid #bbf7d0',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
            <span>{label('Đã xuất bản', 'Published')}</span>
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span
            style={{
              ...baseStyle,
              background: '#e0f2fe',
              color: '#0369a1',
              border: '1px solid #bae6fd',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7', display: 'inline-block' }} />
            <span>{label('Chờ duyệt', 'In Review')}</span>
          </span>
        );
      case 'DRAFT':
        return (
          <span
            style={{
              ...baseStyle,
              background: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706', display: 'inline-block' }} />
            <span>{label('Bản nháp', 'Draft')}</span>
          </span>
        );
      case 'ARCHIVED':
        return (
          <span
            style={{
              ...baseStyle,
              background: '#fee2e2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
            <span>{label('Đã lưu trữ', 'Archived')}</span>
          </span>
        );
      default:
        return (
          <span
            style={{
              ...baseStyle,
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #e2e8f0',
            }}
          >
            <span>{status}</span>
          </span>
        );
    }
  };

  const thStyle = {
    padding: '14px 14px',
    whiteSpace: 'nowrap',
    fontSize: '11.5px',
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--color-ink)',
    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
  };

  const tdStyle = {
    padding: '16px 14px',
    verticalAlign: 'middle',
    borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
  };

  // Override global heritage.css button min-height: 46px/54px & min-width: 64px
  const actionBtnBase = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    height: '32px',
    minHeight: '32px',
    maxHeight: '32px',
    minWidth: 'auto',
    padding: '0 10px',
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '8px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    lineHeight: 1,
    textDecoration: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  };

  return (
    <div className="admin-content">
      {confirmationDialog}
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: 'var(--color-ink)', color: 'var(--color-surface)', padding: '12px 20px', borderRadius: '10px', zIndex: 9999, fontWeight: 700 }}>
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary-orange, #F97316)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <BilingualText vi="VĂN HÓA & NỘI DUNG" en="CULTURE & CONTENT" />
          </span>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '30px', fontWeight: 800, color: 'var(--text-primary, #253044)' }}>
            <BilingualText
              vi={activeTab === 'categories' ? 'Quản lý danh mục văn hóa' : 'Quản lý bài viết văn hóa'}
              en={activeTab === 'categories' ? 'Manage cultural categories' : 'Manage cultural articles'}
            />
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary, #64748B)', fontSize: '14px' }}>
            <BilingualText
              vi={
                activeTab === 'categories'
                  ? 'Quản lý các chủ đề văn hóa (Ẩm thực, Lễ hội, Lịch sử, Ứng xử, Gia đình, Đời sống) và sắp xếp thứ tự hiển thị cho học viên.'
                  : 'Tìm kiếm, kiểm duyệt, xuất bản và biên tập các bài viết khám phá văn hóa, ẩm thực và đời sống Việt Nam.'
              }
              en={
                activeTab === 'categories'
                  ? 'Manage cultural categories (Food, Festivals, History, Etiquette, Family, Lifestyle) and display order for learners.'
                  : 'Search, review, publish and edit articles exploring Vietnamese culture, cuisine and daily life.'
              }
            />
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {activeTab === 'categories' ? (
            <button
              type="button"
              className="button"
              onClick={() => setEditingCategory({ id: '', name: '', slug: '', icon: '🏮', description: '', order: categories.length + 1 })}
              style={{ fontSize: '13px', minHeight: '40px', height: '40px', padding: '0 16px' }}
            >
              <span>{label('+ Thêm danh mục mới', '+ Add new category')}</span>
            </button>
          ) : (
            <Link
              to="/admin/culture/new"
              className="button"
              style={{ fontSize: '13px', minHeight: '40px', height: '40px', padding: '0 16px' }}
            >
              <span>{label('+ Thêm bài viết mới', '+ Add new article')}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Integrated Sub-Navigation Tabs (Bài viết & Danh mục) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
        <button
          type="button"
          className={`button ${activeTab === 'articles' ? '' : 'secondary'}`}
          onClick={() => switchTab('articles')}
          style={{ fontSize: '13px', minHeight: '38px', height: '38px', padding: '0 16px' }}
        >
          <span>{label(`📄 Bài viết văn hóa (${articles.length})`, `📄 Cultural articles (${articles.length})`)}</span>
        </button>
        <button
          type="button"
          className={`button ${activeTab === 'categories' ? '' : 'secondary'}`}
          onClick={() => switchTab('categories')}
          style={{ fontSize: '13px', minHeight: '38px', height: '38px', padding: '0 16px' }}
        >
          <span>{label(`🏷️ Danh mục văn hóa (${categories.length})`, `🏷️ Cultural categories (${categories.length})`)}</span>
        </button>
      </div>

      {activeTab === 'articles' ? (
        <>
          {/* Filter Toolbar */}
          <div className="admin-card" style={{ marginBottom: '24px', padding: '18px 22px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr auto', gap: '14px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder={label('Tìm theo tiêu đề bài viết hoặc tên tác giả...', 'Search by article title or author...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="all">{label('Tất cả danh mục', 'All categories')}</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>

              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">{label('Tất cả trạng thái', 'All statuses')}</option>
                <option value="PUBLISHED">{label('Đã xuất bản', 'Published')}</option>
                <option value="IN_REVIEW">{label('Chờ duyệt', 'In Review')}</option>
                <option value="DRAFT">{label('Bản nháp', 'Draft')}</option>
                <option value="ARCHIVED">{label('Lưu trữ', 'Archived')}</option>
              </select>

              {(search || categoryFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  className="button secondary"
                  style={{ fontSize: '12px', minHeight: '40px', height: '40px', padding: '0 14px', whiteSpace: 'nowrap' }}
                  onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); }}
                >
                  <span>{label('Đặt lại', 'Reset')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Articles Table */}
          <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', minWidth: '1040px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: '36%', paddingLeft: '20px' }}>
                    {label('Bài viết & Tác giả', 'Article and Author')}
                  </th>
                  <th style={{ ...thStyle, width: '18%' }}>
                    {label('Danh mục', 'Category')}
                  </th>
                  <th style={{ ...thStyle, width: '12%' }}>
                    {label('Vùng miền / Điểm đến', 'Region / Destination')}
                  </th>
                  <th style={{ ...thStyle, width: '9%', textAlign: 'center' }}>
                    {label('Lượt xem', 'Views')}
                  </th>
                  <th style={{ ...thStyle, width: '10%', textAlign: 'center' }}>
                    {label('Trạng thái', 'Status')}
                  </th>
                  <th style={{ ...thStyle, width: '15%', minWidth: '250px', textAlign: 'right', paddingRight: '20px' }}>
                    {label('Thao tác', 'Actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
                      {label('Không tìm thấy bài viết văn hóa nào phù hợp với bộ lọc.', 'No cultural articles match the current filters.')}
                    </td>
                  </tr>
                ) : (
                  articles.map(article => (
                    <tr key={article.id}>
                      <td style={{ ...tdStyle, paddingLeft: '20px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <ContentImage
                            src={article.coverImage}
                            alt={article.title}
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                          />
                          <div>
                            <strong style={{ display: 'block', color: 'var(--color-ink)', fontSize: '14px', lineHeight: 1.35, marginBottom: '3px' }}>
                              <BilingualText vi={article.titleVi || article.title} en={article.title} />
                            </strong>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary, #64748B)' }}>
                              {label('Bởi:', 'By:')} <strong>{article.author}</strong> • {label('Ngày đăng:', 'Published:')} {article.publishedAt}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={tdStyle}>
                        <span style={{ fontSize: '13px', fontWeight: 650, color: 'var(--color-ink)' }}>
                          {article.categoryName}
                        </span>
                      </td>

                      <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '13px', color: 'var(--color-ink)', fontWeight: 500 }}>
                          📍 {getDestinationDisplay(article)}
                        </span>
                      </td>

                      <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '28px',
                            padding: '0 11px',
                            borderRadius: '999px',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            fontSize: '12px',
                            fontWeight: 700,
                            lineHeight: 1,
                          }}
                        >
                          {(article.views || 0).toLocaleString()}
                        </span>
                      </td>

                      <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {getStatusBadge(article.status)}
                      </td>

                      <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '20px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', flexWrap: 'nowrap' }}>
                          {article.status !== 'PUBLISHED' ? (
                            <button
                              type="button"
                              className="button secondary"
                              style={{
                                ...actionBtnBase,
                                color: '#15803d',
                                background: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                              }}
                              title={label('Duyệt & Xuất bản', 'Approve & Publish')}
                              onClick={() => handleStatusChange(article.id, 'PUBLISHED')}
                            >
                              <Check size={13} strokeWidth={2.4} />
                              <span>{label('Duyệt', 'Publish')}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="button secondary"
                              style={{
                                ...actionBtnBase,
                                color: '#c2410c',
                                background: '#fff7ed',
                                border: '1px solid #fed7aa',
                              }}
                              title={label('Gỡ bài về bản nháp', 'Revert to draft')}
                              onClick={() => handleStatusChange(article.id, 'DRAFT')}
                            >
                              <Power size={13} strokeWidth={2.2} />
                              <span>{label('Gỡ bài', 'Unpublish')}</span>
                            </button>
                          )}

                          <Link
                            to={`/admin/culture/${article.id}`}
                            className="button secondary"
                            style={{
                              ...actionBtnBase,
                              color: '#334155',
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                            }}
                            title={label('Chỉnh sửa nội dung', 'Edit content')}
                          >
                            <Pencil size={13} strokeWidth={2.1} />
                            <span>{label('Sửa', 'Edit')}</span>
                          </Link>

                          <Link
                            to={`/culture/${article.id}`}
                            target="_blank"
                            className="button secondary"
                            style={{
                              ...actionBtnBase,
                              color: '#0f766e',
                              background: '#f0fdfa',
                              border: '1px solid #99f6e4',
                            }}
                            title={label('Xem trên trang học viên', 'View as learner')}
                          >
                            <Eye size={13} strokeWidth={2.2} />
                            <span>{label('Xem', 'View')}</span>
                          </Link>

                          <button
                            type="button"
                            className="button secondary"
                            style={{
                              ...actionBtnBase,
                              width: '32px',
                              minWidth: '32px',
                              padding: 0,
                              color: '#dc2626',
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                            }}
                            title={label('Xóa bài viết', 'Delete article')}
                            onClick={() => handleDelete(article.id, article.title)}
                          >
                            <Trash2 size={14} strokeWidth={2.1} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Categories Management Tab */
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', minWidth: '880px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '80px', textAlign: 'center', paddingLeft: '20px' }}>
                  {label('Thứ tự', 'Order')}
                </th>
                <th style={{ ...thStyle, width: '70px', textAlign: 'center' }}>
                  {label('Biểu tượng', 'Icon')}
                </th>
                <th style={{ ...thStyle, width: '25%' }}>
                  {label('Tên danh mục & Slug', 'Category Name & Slug')}
                </th>
                <th style={{ ...thStyle }}>
                  {label('Mô tả chuyên mục', 'Description')}
                </th>
                <th style={{ ...thStyle, width: '130px', textAlign: 'center' }}>
                  {label('Số bài viết', 'Articles')}
                </th>
                <th style={{ ...thStyle, width: '150px', textAlign: 'right', paddingRight: '20px' }}>
                  {label('Thao tác', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr key={cat.id}>
                  <td style={{ ...tdStyle, textAlign: 'center', paddingLeft: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveCategory(idx, -1)}
                        style={{ padding: '2px 6px', fontSize: '11px', background: 'transparent', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', color: 'var(--color-ink)' }}
                        title={label('Chuyển lên trên', 'Move up')}
                      >
                        ▲
                      </button>
                      <strong style={{ fontSize: '13px', color: 'var(--color-red-hover)' }}>#{cat.order || idx + 1}</strong>
                      <button
                        type="button"
                        disabled={idx === categories.length - 1}
                        onClick={() => handleMoveCategory(idx, 1)}
                        style={{ padding: '2px 6px', fontSize: '11px', background: 'transparent', border: 'none', cursor: idx === categories.length - 1 ? 'default' : 'pointer', color: 'var(--color-ink)' }}
                        title={label('Chuyển xuống dưới', 'Move down')}
                      >
                        ▼
                      </button>
                    </div>
                  </td>

                  <td style={{ ...tdStyle, fontSize: '26px', textAlign: 'center' }}>{cat.icon}</td>

                  <td style={tdStyle}>
                    <strong style={{ fontSize: '14px', color: 'var(--color-ink)', display: 'block', marginBottom: '2px' }}>{cat.name}</strong>
                    <code style={{ fontSize: '11px', color: 'var(--primary-orange, #F97316)', background: 'var(--bg-peach, #FFF0DC)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      /{cat.slug}
                    </code>
                  </td>

                  <td style={{ ...tdStyle, fontSize: '13px', color: 'var(--color-ink)' }}>
                    <BilingualText vi={cat.descriptionVi || cat.description} en={cat.description} />
                  </td>

                  <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        height: '28px',
                        padding: '0 11px',
                        borderRadius: '999px',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      <span>{cat.articleCount || 0}</span>
                      <span>{label('bài viết', (cat.articleCount || 0) === 1 ? 'article' : 'articles')}</span>
                    </span>
                  </td>

                  <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '20px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        type="button"
                        className="button secondary"
                        style={{
                          ...actionBtnBase,
                          color: '#334155',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                        }}
                        onClick={() => setEditingCategory(cat)}
                      >
                        <Pencil size={13} strokeWidth={2.1} />
                        <span>{label('Sửa', 'Edit')}</span>
                      </button>
                      {categories.length > 2 && (
                        <button
                          type="button"
                          className="button secondary"
                          style={{
                            ...actionBtnBase,
                            width: '32px',
                            minWidth: '32px',
                            padding: 0,
                            color: '#dc2626',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                          }}
                          title={label('Xóa danh mục', 'Delete category')}
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        >
                          <Trash2 size={14} strokeWidth={2.1} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / Create Category Modal */}
      {editingCategory && (
        <Modal
          title={editingCategory.id ? bilingualLabel('Chỉnh sửa danh mục', 'Edit Category') : bilingualLabel('Thêm danh mục văn hóa', 'Add Cultural Category')}
          onClose={() => setEditingCategory(null)}
        >
          <form onSubmit={handleSaveCategory}>
            <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '12px' }}>
              <label>
                <span>{label('Biểu tượng:', 'Icon:')}</span>
                <input
                  type="text"
                  value={editingCategory.icon}
                  onChange={e => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  style={{ textAlign: 'center', fontSize: '18px' }}
                  required
                />
              </label>

              <label>
                <span>{label('Tên danh mục:', 'Category Name:')}</span>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder={label('Ẩm thực (Food & Cuisine)...', 'Food & Cuisine...')}
                  required
                />
              </label>
            </div>

            <label style={{ marginTop: '12px' }}>
              <span>{label('Slug (Đường dẫn):', 'Slug:')}</span>
              <input
                type="text"
                value={editingCategory.slug}
                onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="culinary, festivals, etiquette..."
                required
              />
            </label>

            <label style={{ marginTop: '12px' }}>
              <span>{label('Mô tả ngắn:', 'Description:')}</span>
              <textarea
                rows={3}
                value={editingCategory.description}
                onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                placeholder={label('Mô tả nội dung học viên sẽ khám phá trong danh mục này...', 'Describe what learners will explore in this category...')}
              />
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="button secondary" onClick={() => setEditingCategory(null)}>
                <span>{label('Hủy', 'Cancel')}</span>
              </button>
              <button type="submit" className="button">
                <span>{label('Lưu danh mục', 'Save category')}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
