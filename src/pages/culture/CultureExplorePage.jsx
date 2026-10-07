import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cultureService } from '@/services/cultureService';
import '@/presentation/styles/ai-tutor.css';

export function CultureExplorePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState('all');

  const categories = cultureService.getCategories();
  const destinations = cultureService.getDestinations();
  const articles = cultureService.listArticles({
    search,
    category: selectedCategory,
    destination: selectedDestination,
  });
  const featuredArticles = cultureService.getFeaturedArticles();

  return (
    <div className="p4-container">
      {/* Hero Banner */}
      <div className="culture-banner">
        <span className="p4-header-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffd580' }}>
          Khám phá văn hóa & Đời sống Việt Nam
        </span>
        <h1 className="p4-title" style={{ color: '#ffffff' }}>
          Hòa nhịp vào tâm hồn & bản sắc Việt
        </h1>
        <p className="p4-subtitle" style={{ color: '#eedcd3' }}>
          Học một ngôn ngữ là bước vào một nền văn hóa. Khám phá những câu chuyện ẩm thực trứ danh, phong tục tập quán lâu đời và nếp sống mộc mạc của con người ba miền đất nước.
        </p>

        {/* Search input in hero */}
        <div style={{ maxWidth: '540px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Tìm kiếm bài viết, món ăn, lễ hội hoặc điểm đến..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: '14px',
              border: 'none',
              fontSize: '14.5px',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#321b17',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
          />
        </div>
      </div>

      {/* Featured Spotlight (if no search) */}
      {!search && selectedCategory === 'all' && selectedDestination === 'all' && featuredArticles.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#381e18', margin: 0 }}>
              🌟 Bài viết văn hóa nổi bật
            </h2>
            <span style={{ fontSize: '13px', color: '#7a6053' }}>Được nhiều học viên yêu thích nhất</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {featuredArticles.map(article => (
              <Link
                key={article.id}
                to={`/culture/${article.id}`}
                className="culture-card"
                style={{ border: '2px solid #ecd8c5' }}
              >
                <div className="culture-card__media">
                  <img src={article.coverImage} alt={article.title} />
                  <span className="culture-card__badge">Nổi bật</span>
                  <span className="culture-card__destination">📍 {article.destinationName}</span>
                </div>
                <div className="culture-card__body">
                  <h3 className="culture-card__title">{article.title}</h3>
                  <p className="culture-card__summary">{article.summary}</p>
                  <div className="culture-card__footer">
                    <span>✍️ {article.author}</span>
                    <span>⏱️ {article.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Filters: Category Tabs & Destination Pills */}
      <div className="culture-filters">
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#6d554a', marginBottom: '8px' }}>
            Danh mục chủ đề:
          </div>
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#6d554a', marginBottom: '8px' }}>
            Đề xuất theo điểm đến:
          </div>
          <div className="destination-pills">
            {destinations.map(dest => (
              <button
                key={dest.id}
                className={`destination-pill-btn ${selectedDestination === dest.id ? 'active' : ''}`}
                onClick={() => setSelectedDestination(dest.id)}
              >
                {dest.id === 'all' ? '🌏' : '📍'} {dest.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* All Articles Grid */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#381e18', margin: 0 }}>
            Tất cả bài viết ({articles.length})
          </h2>
          {(search || selectedCategory !== 'all' || selectedDestination !== 'all') && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedDestination('all'); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9f2d20',
                fontSize: '13px',
                fontWeight: 650,
                cursor: 'pointer',
              }}
            >
              ✕ Xóa bộ lọc
            </button>
          )}
        </div>

        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fffdf9', borderRadius: '18px', border: '1px solid #ebd9c8' }}>
            <p style={{ fontSize: '40px', margin: 0 }}>🔍</p>
            <h3 style={{ fontSize: '18px', color: '#4a2c22', margin: '10px 0' }}>Không tìm thấy bài viết phù hợp</h3>
            <p style={{ color: '#8c7367', fontSize: '14px' }}>Hãy thử điều chỉnh từ khóa tìm kiếm hoặc chọn danh mục khác nhé!</p>
          </div>
        ) : (
          <div className="culture-grid">
            {articles.map(article => (
              <Link key={article.id} to={`/culture/${article.id}`} className="culture-card">
                <div className="culture-card__media">
                  <img src={article.coverImage} alt={article.title} />
                  <span className="culture-card__badge">{article.categoryName}</span>
                  <span className="culture-card__destination">📍 {article.destinationName}</span>
                </div>
                <div className="culture-card__body">
                  <h3 className="culture-card__title">{article.title}</h3>
                  <p className="culture-card__summary">{article.summary}</p>
                  <div className="culture-card__footer">
                    <span>📅 {article.publishedDate}</span>
                    <span>⏱️ {article.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
