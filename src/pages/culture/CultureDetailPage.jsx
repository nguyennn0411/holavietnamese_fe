import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cultureService } from '@/services/cultureService';
import { vocabularyService } from '@/services/vocabularyService';
import { aiTutorService } from '@/services/aiTutorService';
import '@/presentation/styles/ai-tutor.css';

export function CultureDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = cultureService.getArticle(id);
  const relatedArticles = cultureService.getRelatedArticles(id);
  const [toastMessage, setToastMessage] = useState('');

  if (!article) {
    return (
      <div className="p4-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Không tìm thấy bài viết văn hóa</h2>
        <p style={{ color: '#7a6458', margin: '14px 0 24px' }}>Bài viết này không tồn tại hoặc đã được cập nhật đường dẫn.</p>
        <Link to="/culture" className="button">
          Quay lại Khám phá văn hóa
        </Link>
      </div>
    );
  }

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) {
      showToast('Trình duyệt của bạn không hỗ trợ phát âm.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    showToast(`Đang phát âm: "${text}"`);
  };

  const handleSaveToVocabulary = async (phrase) => {
    try {
      await vocabularyService.add({
        word: phrase.word,
        meaning: phrase.meaning,
        notes: `Từ vựng văn hóa: ${article.title} (${phrase.context || ''})`,
      });
      showToast(`Đã lưu "${phrase.word}" vào Sổ từ vựng!`);
    } catch (err) {
      showToast(`Lưu từ vựng: ${err.message || 'Thành công'}`);
    }
  };

  const handleAskAiTutor = () => {
    // Create new AI session in Culture Guide mode preloaded with this topic
    const newSession = aiTutorService.createSession(
      'culture_guide',
      `Tìm hiểu: ${article.title.slice(0, 24)}...`
    );
    navigate('/ai-tutor');
  };

  return (
    <div className="p4-container">
      {toastMessage && (
        <div className="p4-toast">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7a6458', marginBottom: '20px' }}>
        <Link to="/culture" style={{ color: '#9f2d20', textDecoration: 'none' }}>
          ← Khám phá văn hóa
        </Link>
        <span>/</span>
        <span>{article.categoryName}</span>
        <span>/</span>
        <span style={{ color: '#381e18', fontWeight: 600 }}>{article.title}</span>
      </nav>

      {/* Article Header */}
      <div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span className="p4-header-badge">{article.categoryName}</span>
          <span style={{ padding: '4px 12px', background: '#f4e9de', color: '#684a3d', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>
            📍 {article.destinationName}
          </span>
          <span style={{ padding: '4px 12px', background: '#fbf5ee', color: '#8c7367', borderRadius: '999px', fontSize: '12px' }}>
            ⏱️ {article.readTime}
          </span>
        </div>

        <h1 className="p4-title" style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)' }}>
          {article.title}
        </h1>
        <p className="p4-subtitle" style={{ fontSize: '18px', color: '#574239', maxWidth: '820px' }}>
          {article.subtitle}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '24px', borderBottom: '1px solid #ebd9c8', fontSize: '13px', color: '#7a6053' }}>
          <span>✍️ <strong>{article.author}</strong> ({article.authorRole})</span>
          <span>•</span>
          <span>📅 {article.publishedDate}</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="culture-detail-layout">
        {/* Left Column: Article Body & Useful Phrases */}
        <article>
          {/* Cover Media */}
          <div style={{ borderRadius: '20px', overflow: 'hidden', height: '420px', marginBottom: '28px', border: '1px solid #ebd9c8' }}>
            <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div className="culture-article-body">
            <div style={{ whiteSpace: 'pre-line', fontSize: '16.5px', lineHeight: 1.85, color: '#321f19' }}>
              {article.content}
            </div>

            {/* Useful Phrases Box */}
            <div className="useful-phrases-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#9f2d20' }}>
                    📖 Cụm từ hữu ích & Cách diễn đạt
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#7a6256' }}>
                    Lắng nghe phát âm chuẩn và lưu trực tiếp vào Sổ từ vựng của bạn để ôn tập!
                  </p>
                </div>
              </div>

              {article.usefulPhrases?.map((phrase, idx) => (
                <div key={idx} className="phrase-item">
                  <div className="phrase-left">
                    <span className="phrase-word">{phrase.word}</span>
                    <span className="phrase-pronun">[{phrase.pronunciation}]</span>
                    <span className="phrase-meaning">{phrase.meaning}</span>
                    {phrase.context && (
                      <span style={{ fontSize: '11.5px', color: '#886d60' }}>
                        💡 Ngữ cảnh: {phrase.context}
                      </span>
                    )}
                  </div>

                  <div className="phrase-actions">
                    <button
                      className="message-action-btn"
                      onClick={() => handleSpeak(phrase.word)}
                      title="Nghe phát âm"
                    >
                      <span>🔊</span> Nghe
                    </button>
                    <button
                      className="message-action-btn"
                      onClick={() => handleSaveToVocabulary(phrase)}
                      title="Lưu vào Sổ từ vựng"
                      style={{ background: '#fcf6ee', borderColor: '#d8aa54', color: '#7a4e1d' }}
                    >
                      <span>⭐</span> Lưu từ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Callout to AI Tutor */}
            <div style={{ background: '#f5ebe0', border: '1px solid #dfc7b0', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#381e18' }}>
                  🤖 Muốn tìm hiểu sâu hơn về nét văn hóa này?
                </h4>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#684d40' }}>
                  Hỏi ngay Hola AI Tutor ở chế độ <strong>Culture Guide</strong> để được giải đáp mọi phong tục và cách xưng hô tinh tế.
                </p>
              </div>
              <button
                className="button"
                onClick={handleAskAiTutor}
                style={{ background: '#9f2d20', color: '#fff', border: 'none', whiteSpace: 'nowrap' }}
              >
                Hỏi AI Tutor ngay ➔
              </button>
            </div>
          </div>
        </article>

        {/* Right Sidebar: Related Info */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Destination Info Box */}
          <div style={{ background: '#fffdfa', border: '1px solid #ebd9c8', borderRadius: '18px', padding: '22px' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 12px', color: '#381e18' }}>
              📍 Điểm đến liên quan
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fcf6ed', padding: '12px', borderRadius: '12px' }}>
              <span style={{ fontSize: '24px' }}>🏮</span>
              <div>
                <strong style={{ fontSize: '14px', color: '#2d1813' }}>{article.destinationName}</strong>
                <p style={{ margin: 0, fontSize: '12px', color: '#7b6255' }}>
                  Điểm hẹn văn hóa và ẩm thực đặc trưng
                </p>
              </div>
            </div>
          </div>

          {/* Related Articles Box */}
          {relatedArticles.length > 0 && (
            <div style={{ background: '#fffdfa', border: '1px solid #ebd9c8', borderRadius: '18px', padding: '22px' }}>
              <h3 style={{ fontSize: '16px', margin: '0 0 16px', color: '#381e18' }}>
                📚 Bài viết văn hóa liên quan
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {relatedArticles.map(rel => (
                  <Link
                    key={rel.id}
                    to={`/culture/${rel.id}`}
                    style={{ display: 'flex', gap: '12px', textDecoration: 'none', color: 'inherit', alignItems: 'center' }}
                  >
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#321c17', lineHeight: 1.35 }}>
                        {rel.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#8a6e60', marginTop: '4px' }}>
                        {rel.categoryName} • {rel.readTime}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
