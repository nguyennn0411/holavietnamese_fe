import { Modal } from '@/components/common/Modal';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminCultureAiService } from '@/services/adminCultureAiService';

export function AdminCultureCategoriesPage() {
  const [categories, setCategories] = useState(() => adminCultureAiService.getCategories());
  const [editingCategory, setEditingCategory] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const list = [...categories];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    setCategories(reordered);
    adminCultureAiService.reorderCategories(reordered);
    showToast('Đã cập nhật thứ tự danh mục!');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) return;

    const updated = adminCultureAiService.saveCategory(editingCategory);
    setCategories(updated);
    setEditingCategory(null);
    showToast('Đã lưu thông tin danh mục thành công!');
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) {
      const remaining = adminCultureAiService.deleteCategory(id);
      setCategories(remaining);
      showToast('Đã xóa danh mục.');
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
          <nav style={{ fontSize: '13px', color: 'var(--color-sage)', marginBottom: '6px' }}>
            <Link to="/admin/culture" style={{ color: 'var(--color-red-hover)', textDecoration: 'none' }}>← Quản lý bài viết văn hóa</Link>
          </nav>
          <h1 style={{ margin: 0, fontSize: '32px' }}>Danh mục văn hóa</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--color-sage)', fontSize: '14px' }}>
            Quản lý các chủ đề lớn: Food, Festivals, History, Etiquette, Family, Lifestyle và sắp xếp thứ tự hiển thị cho học viên.
          </p>
        </div>

        <button
          className="button"
          onClick={() => setEditingCategory({ id: '', name: '', slug: '', icon: '🏮', description: '', order: categories.length + 1 })}
          style={{ fontSize: '13px' }}
        >
          + Thêm danh mục mới
        </button>
      </div>

      {/* Categories List */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '80px', textAlign: 'center' }}>Thứ tự</th>
              <th style={{ width: '60px' }}>Icon</th>
              <th>Tên danh mục & Slug</th>
              <th>Mô tả chuyên mục</th>
              <th>Số bài viết</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <tr key={cat.id}>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, -1)}
                      style={{ padding: '2px 6px', fontSize: '11px', background: 'transparent', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', color: 'var(--color-ink)' }}
                      title="Chuyển lên trên"
                    >
                      ▲
                    </button>
                    <strong style={{ fontSize: '13px', color: 'var(--color-red-hover)' }}>#{cat.order || idx + 1}</strong>
                    <button
                      type="button"
                      disabled={idx === categories.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      style={{ padding: '2px 6px', fontSize: '11px', background: 'transparent', border: 'none', cursor: idx === categories.length - 1 ? 'default' : 'pointer', color: 'var(--color-ink)' }}
                      title="Chuyển xuống dưới"
                    >
                      ▼
                    </button>
                  </div>
                </td>

                <td style={{ fontSize: '26px' }}>{cat.icon}</td>

                <td>
                  <strong style={{ fontSize: '14px', color: 'var(--color-ink)', display: 'block' }}>{cat.name}</strong>
                  <code style={{ fontSize: '11px', color: 'var(--color-sage)', background: 'var(--color-red-soft)', padding: '2px 6px', borderRadius: '4px' }}>
                    /{cat.slug}
                  </code>
                </td>

                <td style={{ fontSize: '13px', color: 'var(--color-ink)' }}>{cat.description}</td>

                <td>
                  <span className="admin-badge admin-badge-info">
                    {cat.articleCount || 0} bài viết
                  </span>
                </td>

                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button
                      className="button secondary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => setEditingCategory(cat)}
                    >
                      ✏️ Sửa
                    </button>
                    {categories.length > 2 && (
                      <button
                        className="button secondary"
                        style={{ fontSize: '12px', padding: '6px 10px', color: 'var(--color-red)' }}
                        onClick={() => handleDelete(cat.id, cat.name)}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Modal */}
      {editingCategory && (
        <Modal title={editingCategory.id ? "Chỉnh sửa danh mục" : "Thêm danh mục văn hóa"} onClose={()=>setEditingCategory(null)}>
<form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '12px' }}>
                <label>
                  Icon:
                  <input
                    type="text"
                    value={editingCategory.icon}
                    onChange={e => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    style={{ textAlign: 'center', fontSize: '18px' }}
                    required
                  />
                </label>

                <label>
                  Tên danh mục:
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    placeholder="Food (Ẩm thực)..."
                    required
                  />
                </label>
              </div>

              <label style={{ marginTop: '12px' }}>
                Slug (Đường dẫn):
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="culinary, festivals, etiquette..."
                  required
                />
              </label>

              <label style={{ marginTop: '12px' }}>
                Mô tả ngắn:
                <textarea
                  rows={3}
                  value={editingCategory.description}
                  onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Mô tả nội dung học viên sẽ khám phá trong danh mục này..."
                />
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="button secondary" onClick={() => setEditingCategory(null)}>
                  Hủy
                </button>
                <button type="submit" className="button">
                  Lưu danh mục
                </button>
              </div>
            </form>
        </Modal>
      )}
    </div>
  );
}
