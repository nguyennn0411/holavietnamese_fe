import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminCultureAiService } from '@/services/adminCultureAiService';
import '@/presentation/styles/admin.css';

export function AdminCultureEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const categories = adminCultureAiService.getCategories();

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    subtitle: '',
    category: 'culinary',
    categoryName: 'Food (Ẩm thực)',
    region: 'Toàn quốc',
    destination: 'Hà Nội',
    author: 'Biên tập viên Hola',
    authorRole: 'Chuyên gia văn hóa ẩm thực',
    readTime: '5 phút đọc',
    status: 'PUBLISHED',
    coverImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    summary: '',
    content: '',
    usefulPhrases: [
      { word: '', pronunciation: '', meaning: '', context: '' },
    ],
  });

  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!isNew) {
      const existing = adminCultureAiService.getArticle(id);
      if (existing) {
        setFormData({
          ...existing,
          usefulPhrases: existing.usefulPhrases || [],
        });
      }
    }
  }, [id, isNew]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleCategoryChange = (catId) => {
    const selected = categories.find(c => c.id === catId);
    setFormData(prev => ({
      ...prev,
      category: catId,
      categoryName: selected?.name || 'Khác',
    }));
  };

  const handlePhraseChange = (index, field, value) => {
    const list = [...formData.usefulPhrases];
    list[index][field] = value;
    setFormData(prev => ({ ...prev, usefulPhrases: list }));
  };

  const handleAddPhrase = () => {
    setFormData(prev => ({
      ...prev,
      usefulPhrases: [
        ...prev.usefulPhrases,
        { word: '', pronunciation: '', meaning: '', context: '' },
      ],
    }));
  };

  const handleRemovePhrase = (index) => {
    setFormData(prev => ({
      ...prev,
      usefulPhrases: prev.usefulPhrases.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết!');
      return;
    }

    const payload = {
      ...formData,
      id: formData.id || `culture-${Date.now()}`,
    };

    adminCultureAiService.saveArticle(payload);
    showToast('Đã lưu bài viết văn hóa thành công!');
    setTimeout(() => {
      navigate('/admin/culture');
    }, 800);
  };

  return (
    <div className="admin-content">
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#245c48', color: '#fff', padding: '12px 20px', borderRadius: '10px', zIndex: 9999, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <nav style={{ fontSize: '13px', color: '#7a6458', marginBottom: '6px' }}>
            <Link to="/admin/culture" style={{ color: '#a62a24', textDecoration: 'none' }}>← Quay lại danh sách bài viết</Link>
          </nav>
          <h1 style={{ margin: 0, fontSize: '30px' }}>
            {isNew ? 'Soạn thảo bài viết văn hóa mới' : `Biên tập: ${formData.title}`}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className={`button ${activeTab === 'editor' ? '' : 'secondary'}`}
            onClick={() => setActiveTab('editor')}
            style={{ fontSize: '13px' }}
          >
            ✏️ Trình biên tập
          </button>
          <button
            type="button"
            className={`button ${activeTab === 'preview' ? '' : 'secondary'}`}
            onClick={() => setActiveTab('preview')}
            style={{ fontSize: '13px' }}
          >
            👁️ Xem trước (Preview)
          </button>
          <button
            type="button"
            className="button"
            onClick={handleSubmit}
            style={{ background: '#245c48', borderColor: '#245c48', fontSize: '13px' }}
          >
            💾 Lưu bài viết
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
            {/* Left Column: Title, Content, Phrases */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="admin-card">
                <label>
                  Tiêu đề bài viết:
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ví dụ: Văn hóa cà phê Việt Nam: Từ Cà phê phin đến Cà phê trứng..."
                  />
                </label>

                <label style={{ marginTop: '14px' }}>
                  Tiêu đề phụ / Mô tả ngắn:
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Mô tả tóm lược nét hấp dẫn của bài viết..."
                  />
                </label>

                <label style={{ marginTop: '14px' }}>
                  Tóm tắt mở đầu (Summary):
                  <textarea
                    rows={3}
                    value={formData.summary}
                    onChange={e => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Đoạn văn ngắn làm nổi bật ý nghĩa văn hóa..."
                  />
                </label>
              </div>

              {/* Markdown Content */}
              <div className="admin-card">
                <label>
                  Nội dung chi tiết bài viết (Hỗ trợ Markdown):
                  <textarea
                    rows={16}
                    required
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Soạn nội dung bài viết với các đề mục ###, đoạn văn, và hình ảnh..."
                    style={{ fontFamily: 'monospace', fontSize: '13.5px', lineHeight: 1.6 }}
                  />
                </label>
              </div>

              {/* Useful phrases builder */}
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#381e18' }}>
                      Từ vựng & Cụm từ liên quan (Useful Phrases)
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#7a6458' }}>
                      Học viên có thể nghe phát âm và lưu trực tiếp vào Sổ từ vựng khi đọc bài viết này.
                    </p>
                  </div>
                  <button type="button" className="button secondary" onClick={handleAddPhrase} style={{ fontSize: '12px', padding: '6px 12px' }}>
                    + Thêm từ
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {formData.usefulPhrases.map((phrase, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr auto', gap: '10px', alignItems: 'center', background: '#faf3e8', padding: '10px', borderRadius: '10px' }}>
                      <input
                        type="text"
                        placeholder="Từ tiếng Việt (vd: Cà phê phin)"
                        value={phrase.word}
                        onChange={e => handlePhraseChange(idx, 'word', e.target.value)}
                        style={{ fontSize: '13px' }}
                      />
                      <input
                        type="text"
                        placeholder="Phiên âm (vd: kà-phê-phin)"
                        value={phrase.pronunciation}
                        onChange={e => handlePhraseChange(idx, 'pronunciation', e.target.value)}
                        style={{ fontSize: '13px' }}
                      />
                      <input
                        type="text"
                        placeholder="Nghĩa tiếng Anh / Diễn giải"
                        value={phrase.meaning}
                        onChange={e => handlePhraseChange(idx, 'meaning', e.target.value)}
                        style={{ fontSize: '13px' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhrase(idx)}
                        style={{ background: 'transparent', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '16px' }}
                        title="Xóa cụm từ này"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Settings & Metadata */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#381e18' }}>Phân loại & Trạng thái</h3>

                <label>
                  Trạng thái xuất bản:
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="PUBLISHED">Đã xuất bản (Published)</option>
                    <option value="IN_REVIEW">Chờ duyệt (In Review)</option>
                    <option value="DRAFT">Bản nháp (Draft)</option>
                    <option value="ARCHIVED">Lưu trữ (Archived)</option>
                  </select>
                </label>

                <label style={{ marginTop: '12px' }}>
                  Danh mục văn hóa:
                  <select
                    value={formData.category}
                    onChange={e => handleCategoryChange(e.target.value)}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={{ marginTop: '12px' }}>
                  Vùng miền:
                  <select
                    value={formData.region}
                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                  >
                    <option value="Toàn quốc">Toàn quốc (National)</option>
                    <option value="Miền Bắc">Miền Bắc (Northern)</option>
                    <option value="Miền Trung">Miền Trung (Central)</option>
                    <option value="Miền Nam">Miền Nam (Southern)</option>
                  </select>
                </label>

                <label style={{ marginTop: '12px' }}>
                  Điểm đến cụ thể:
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Ví dụ: Hà Nội, Hội An, Huế..."
                  />
                </label>
              </div>

              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#381e18' }}>Ảnh bìa bài viết</h3>

                <label>
                  URL hình ảnh:
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                  />
                </label>

                {formData.coverImage && (
                  <div style={{ marginTop: '12px', borderRadius: '12px', overflow: 'hidden', height: '160px', border: '1px solid #ebd9c8' }}>
                    <img
                      src={formData.coverImage}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>

              <div className="admin-card">
                <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#381e18' }}>Thông tin tác giả</h3>

                <label>
                  Tên tác giả:
                  <input
                    type="text"
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                  />
                </label>

                <label style={{ marginTop: '12px' }}>
                  Chức danh tác giả:
                  <input
                    type="text"
                    value={formData.authorRole}
                    onChange={e => setFormData({ ...formData, authorRole: e.target.value })}
                  />
                </label>

                <label style={{ marginTop: '12px' }}>
                  Thời lượng ước tính:
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={e => setFormData({ ...formData, readTime: e.target.value })}
                  />
                </label>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* Live Preview Mode */
        <div className="admin-card" style={{ padding: '36px', background: '#ffffff' }}>
          <div style={{ borderBottom: '1px solid #ebd9c8', paddingBottom: '18px', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#a62a24', textTransform: 'uppercase' }}>
              PREVIEW TRÊN GIAO DIỆN HỌC VIÊN
            </span>
            <h1 style={{ fontSize: '32px', margin: '8px 0', color: '#2d1813' }}>{formData.title || 'Chưa có tiêu đề'}</h1>
            <p style={{ fontSize: '16px', color: '#685044' }}>{formData.subtitle}</p>
            <div style={{ fontSize: '13px', color: '#887063' }}>
              Tác giả: <strong>{formData.author}</strong> • Điểm đến: 📍 {formData.destination}
            </div>
          </div>

          {formData.coverImage && (
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '320px', marginBottom: '28px' }}>
              <img src={formData.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <div style={{ whiteSpace: 'pre-line', fontSize: '16px', lineHeight: 1.8, color: '#321d17' }}>
            {formData.content || '(Nội dung bài viết chưa được nhập)'}
          </div>

          {formData.usefulPhrases?.length > 0 && (
            <div style={{ marginTop: '36px', padding: '24px', background: '#faf3e8', borderRadius: '16px' }}>
              <h3 style={{ margin: '0 0 14px 0', color: '#a62a24' }}>📖 Cụm từ hữu ích kèm theo bài viết:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {formData.usefulPhrases.filter(p => p.word).map((p, idx) => (
                  <div key={idx} style={{ background: '#fff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ebd9c8' }}>
                    <strong style={{ color: '#a62a24' }}>{p.word}</strong>
                    <div style={{ fontSize: '12px', color: '#7a6053' }}>{p.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
