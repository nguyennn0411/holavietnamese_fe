import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { aiRoleplayService } from '@/services/aiRoleplayService';
import { vocabularyService } from '@/services/vocabularyService';
import '@/presentation/styles/ai-tutor.css';

export function RoleplayResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const result = aiRoleplayService.getResult(id);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSaveExpression = async (item) => {
    try {
      await vocabularyService.add({
        word: item.phrase,
        meaning: item.meaning,
        notes: `Biểu thức Roleplay: ${result.scenarioTitle}`,
      });
      showToast(`Đã lưu "${item.phrase}" vào Sổ từ vựng!`);
    } catch (e) {
      showToast(`Lưu từ vựng: ${e.message || 'Thành công'}`);
    }
  };

  const handleRetry = () => {
    aiRoleplayService.resetRoleplaySession(id);
    navigate(`/ai-roleplay/${id}`);
  };

  if (!result) return null;

  return (
    <div className="p4-container">
      {toastMessage && (
        <div className="p4-toast">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7a6458', marginBottom: '16px' }}>
        <Link to="/ai-scenarios" style={{ color: '#9f2d20', textDecoration: 'none' }}>← Danh sách kịch bản</Link>
        <span>/</span>
        <span>{result.scenarioTitle}</span>
        <span>/</span>
        <span style={{ color: '#381e18', fontWeight: 600 }}>Kết quả đánh giá</span>
      </nav>

      {/* Screen Title */}
      <div style={{ marginBottom: '24px' }}>
        <span className="p4-header-badge">Đánh giá phiên hội thoại</span>
        <h1 className="p4-title">Kết quả phiên Roleplay</h1>
        <p className="p4-subtitle">
          Kịch bản: <strong>{result.scenarioTitle}</strong> • Hoàn thành ngày {result.completedDate}
        </p>
      </div>

      {/* Hero Scorecard */}
      <div className="result-card-hero">
        <div className="score-circle-box">
          <div className="score-number">{result.totalScore}</div>
          <div className="score-rating">Xếp loại: {result.rating}</div>
          <div style={{ fontSize: '12px', color: '#7a5a4a', marginTop: '6px' }}>
            Nhiệm vụ: {result.completedTasksRatio}
          </div>
        </div>

        <div>
          <h2 style={{ margin: '0 0 12px', fontSize: '20px', color: '#321b17' }}>
            Chi tiết các chỉ số năng lực:
          </h2>

          <div className="score-breakdown-grid">
            <div className="score-bar-item">
              <div className="score-bar-header">
                <span>🗣️ Độ lưu loát (Fluency)</span>
                <span>{result.stats.fluency}%</span>
              </div>
              <div className="score-progress-track">
                <div className="score-progress-fill" style={{ width: `${result.stats.fluency}%` }} />
              </div>
            </div>

            <div className="score-bar-item">
              <div className="score-bar-header">
                <span>📚 Vốn từ vựng (Vocabulary)</span>
                <span>{result.stats.vocabulary}%</span>
              </div>
              <div className="score-progress-track">
                <div className="score-progress-fill" style={{ width: `${result.stats.vocabulary}%` }} />
              </div>
            </div>

            <div className="score-bar-item">
              <div className="score-bar-header">
                <span>📝 Ngữ pháp (Grammar)</span>
                <span>{result.stats.grammar}%</span>
              </div>
              <div className="score-progress-track">
                <div className="score-progress-fill" style={{ width: `${result.stats.grammar}%` }} />
              </div>
            </div>

            <div className="score-bar-item">
              <div className="score-bar-header">
                <span>🏮 Phù hợp văn hóa (Culture)</span>
                <span>{result.stats.culture}%</span>
              </div>
              <div className="score-progress-track">
                <div className="score-progress-fill" style={{ width: `${result.stats.culture}%` }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', padding: '14px 18px', background: '#ffffff', borderRadius: '14px', border: '1px solid #ebd9c8', fontSize: '13.5px', color: '#4a2f24', lineHeight: 1.6 }}>
            <strong>🤖 Nhận xét từ AI Tutor:</strong> {result.aiFeedback}
          </div>
        </div>
      </div>

      {/* 2-Column Section: Corrections & Practiced Expressions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '36px' }}>
        {/* Errors & Native Suggestions */}
        <div style={{ background: '#ffffff', border: '1px solid #ebd9c8', borderRadius: '20px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 16px', color: '#9f2d20', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔍</span> Lỗi cần sửa & Cách nói tự nhiên hơn
          </h2>

          <div>
            {result.corrections?.map((cor, idx) => (
              <div key={idx} className="correction-card">
                <div className="correction-original">✕ Bạn đã nói: "{cor.original}"</div>
                <div className="correction-native">✓ Người bản xứ nói: "{cor.nativeSuggestion}"</div>
                <div className="correction-reason">💡 <em>Lý do:</em> {cor.reason}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Practiced Key Expressions */}
        <div style={{ background: '#ffffff', border: '1px solid #ebd9c8', borderRadius: '20px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 16px', color: '#245c48', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📖</span> Biểu thức & Cấu trúc đã luyện tập
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.practicedExpressions?.map((expr, idx) => (
              <div
                key={idx}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#fcf8f2', border: '1px solid #eddcca', borderRadius: '12px' }}
              >
                <div>
                  <strong style={{ fontSize: '14px', color: '#2e1913' }}>"{expr.phrase}"</strong>
                  <div style={{ fontSize: '12px', color: '#685044' }}>{expr.meaning}</div>
                </div>

                <button
                  className="message-action-btn"
                  onClick={() => handleSaveExpression(expr)}
                  style={{ background: '#fff', borderColor: '#d8aa54', color: '#7a4e1d' }}
                >
                  <span>⭐</span> Lưu từ
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer: Retry & Next Scenario */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#faf3e8', border: '1px solid #eddcca', borderRadius: '18px', padding: '20px 24px', flexWrap: 'wrap', gap: '16px' }}>
        <button className="button secondary" onClick={handleRetry} style={{ fontSize: '14px', padding: '12px 20px' }}>
          🔄 Thử lại kịch bản này
        </button>

        {result.nextScenario && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '13px', color: '#7a5a4a' }}>
              Kịch bản đề xuất tiếp theo: <strong>{result.nextScenario.title}</strong>
            </span>
            <Link
              to={`/ai-roleplay/${result.nextScenario.id}`}
              className="button"
              style={{ background: '#9f2d20', borderColor: '#9f2d20', fontSize: '14px', padding: '12px 22px' }}
            >
              Tiếp tục kịch bản mới ➔
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
