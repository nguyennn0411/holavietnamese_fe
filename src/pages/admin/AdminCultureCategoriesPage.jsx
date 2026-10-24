import { BilingualText, vietnameseLabel, bilingualLabel } from '@/components/common/BilingualText';
import { Modal } from '@/components/common/Modal';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminCultureAiService } from '@/services/adminCultureAiService';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';

export function AdminCultureCategoriesPage() {
  const { confirm, confirmationDialog } = useConfirmDialog();
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

  const handleDelete = async (id, name) => {
    if (await confirm({
      title: bilingualLabel('Xóa danh mục văn hóa?', 'Delete cultural category?'),
      description: bilingualLabel(`Danh mục “${name}” sẽ bị xóa khỏi hệ thống.`, `Category “${name}” will be removed from the system.`),
      confirmLabel: bilingualLabel('Xóa danh mục', 'Delete category'),
    })) {
      const remaining = adminCultureAiService.deleteCategory(id);
      setCategories(remaining);
      showToast('Đã xóa danh mục.');
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
          <nav style={{ fontSize: '13px', color: 'var(--text-secondary, #64748B)', marginBottom: '6px' }}>
            <Link to="/admin/culture" style={{ color: 'var(--primary-orange, #F97316)', textDecoration: 'none', fontWeight: 600 }}><BilingualText>{"← Quản lý bài viết văn hóa"}</BilingualText></Link>
          </nav>
          <h1 style={{ margin: 0, fontSize: '30px', fontWeight: 800, color: 'var(--text-primary, #253044)' }}><BilingualText>{"Danh mục văn hóa"}</BilingualText></h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary, #64748B)', fontSize: '14px' }}><BilingualText>{"Quản lý các chủ đề lớn: Food, Festivals, History, Etiquette, Family, Lifestyle và sắp xếp thứ tự hiển thị cho học viên."}</BilingualText></p>
        </div>

        <button
          className="button"
          onClick={() => setEditingCategory({ id: '', name: '', slug: '', icon: '🏮', description: '', order: categories.length + 1 })}
          style={{ fontSize: '13px' }}
        ><BilingualText>{"+ Thêm danh mục mới"}</BilingualText></button>
      </div>

      {/* Categories List */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '80px', textAlign: 'center' }}><BilingualText>{"Thứ tự"}</BilingualText></th>
              <th style={{ width: '60px' }}><BilingualText>{"Biểu tượng"}</BilingualText></th>
              <th><BilingualText>{"Tên danh mục & Slug"}</BilingualText></th>
              <th><BilingualText>{"Mô tả chuyên mục"}</BilingualText></th>
              <th><BilingualText>{"Số bài viết"}</BilingualText></th>
              <th style={{ textAlign: 'right' }}><BilingualText>{"Thao tác"}</BilingualText></th>
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
                      title={bilingualLabel("Chuyển lên trên", "Move up")}
                    >
                      ▲
                    </button>
                    <strong style={{ fontSize: '13px', color: 'var(--color-red-hover)' }}>#{cat.order || idx + 1}</strong>
                    <button
                      type="button"
                      disabled={idx === categories.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      style={{ padding: '2px 6px', fontSize: '11px', background: 'transparent', border: 'none', cursor: idx === categories.length - 1 ? 'default' : 'pointer', color: 'var(--color-ink)' }}
                      title={bilingualLabel("Chuyển xuống dưới", "Move down")}
                    >
                      ▼
                    </button>
                  </div>
                </td>

                <td style={{ fontSize: '26px' }}>{cat.icon}</td>

                <td>
                  <strong style={{ fontSize: '14px', color: 'var(--color-ink)', display: 'block' }}>{cat.name}</strong>
                  <code style={{ fontSize: '11px', color: 'var(--primary-orange, #F97316)', background: 'var(--bg-peach, #FFF0DC)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    /{cat.slug}
                  </code>
                </td>

                <td style={{ fontSize: '13px', color: 'var(--color-ink)' }}><BilingualText vi={cat.descriptionVi || cat.description} en={cat.description} /></td>

                <td>
                  <span className="admin-badge admin-badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
                    {cat.articleCount || 0} <BilingualText>{"bài viết"}</BilingualText></span>
                </td>

                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button
                      className="button secondary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => setEditingCategory(cat)}
                    ><BilingualText>{"✏️ Sửa"}</BilingualText></button>
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
        <Modal title={editingCategory.id ? bilingualLabel("Chỉnh sửa danh mục", "Edit Category") : bilingualLabel("Thêm danh mục văn hóa", "Add Cultural Category")} onClose={()=>setEditingCategory(null)}>
<form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '12px' }}>
                <label><BilingualText>{"Biểu tượng:"}</BilingualText><input
                    type="text"
                    value={editingCategory.icon}
                    onChange={e => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    style={{ textAlign: 'center', fontSize: '18px' }}
                    required
                  />
                </label>

                <label><BilingualText>{"Tên danh mục:"}</BilingualText><input
                    type="text"
                    value={editingCategory.name}
                    onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    placeholder={vietnameseLabel("Food (Ẩm thực)...")}
                    required
                  />
                </label>
              </div>

              <label style={{ marginTop: '12px' }}><BilingualText>{"Slug (Đường dẫn):"}</BilingualText><input
                  type="text"
                  value={editingCategory.slug}
                  onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="culinary, festivals, etiquette..."
                  required
                />
              </label>

              <label style={{ marginTop: '12px' }}><BilingualText>{"Mô tả ngắn:"}</BilingualText><textarea
                  rows={3}
                  value={editingCategory.description}
                  onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder={vietnameseLabel("Mô tả nội dung học viên sẽ khám phá trong danh mục này...")}
                />
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="button secondary" onClick={() => setEditingCategory(null)}><BilingualText>{"Hủy"}</BilingualText></button>
                <button type="submit" className="button"><BilingualText>{"Lưu danh mục"}</BilingualText></button>
              </div>
            </form>
        </Modal>
      )}
    </div>
  );
}
