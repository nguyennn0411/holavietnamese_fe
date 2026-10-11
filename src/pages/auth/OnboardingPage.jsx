import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';
import dongSonBg from '@/assets/images/dongson_heritage.png';

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [preferences, setPreferences] = useState({
    nativeLanguage: 'en',
    learningGoal: 'travel',
    targetLevel: 'A1',
    dailyMinutes: 15,
    country: '',
  });

  const goals = [
    { id: 'travel', title: '✈️ Du lịch & Khám phá', desc: 'Hỏi đường, gọi món, đi taxi, mặc cả chợ đêm' },
    { id: 'work', title: '💼 Công việc & Định cư', desc: 'Giao tiếp văn phòng, phỏng vấn, gặp đối tác' },
    { id: 'exam_vsl', title: '🎓 Thi chứng chỉ VSL', desc: 'Ngữ pháp chuẩn, luyện 6 thanh điệu, đọc hiểu' },
    { id: 'culture', title: '🏮 Văn hóa & Đời sống', desc: 'Xem phim, kết bạn với người Việt, hiểu ca dao' },
  ];

  const levels = [
    { id: 'A1', title: 'Mới bắt đầu (A1)', desc: 'Chưa biết từ nào hoặc chỉ biết Xin chào, Cảm ơn' },
    { id: 'A2', title: 'Sơ cấp (A2)', desc: 'Biết từ vựng cơ bản, ghép câu đơn giản' },
    { id: 'B1', title: 'Trung cấp (B1)', desc: 'Giao tiếp được các tình huống quen thuộc thường nhật' },
  ];

  const times = [
    { minutes: 10, label: 'Thư giãn (10 phút/ngày)', sub: 'Khoảng 1-2 bài học ngắn' },
    { minutes: 15, label: 'Tiêu chuẩn (15 phút/ngày)', sub: 'Lý tưởng để duy trì phản xạ' },
    { minutes: 30, label: 'Nghiêm túc (30 phút/ngày)', sub: 'Tăng tốc độ làm chủ tiếng Việt' },
  ];

  const handleFinish = async () => {
    setLoading(true); setError('');
    try {
      await learnerService.saveOnboarding(preferences);
      navigate('/', { state: { welcomeToast: 'Chào mừng bạn! Lộ trình học cá nhân hóa đã sẵn sàng.' } });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-left-panel" style={{ padding: '36px 48px' }}>
        <div className="auth-left-content" style={{ maxWidth: '520px' }}>
          <AuthHeader />

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: s <= step ? 'var(--color-red-hover)' : 'var(--color-sage-soft)',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>
          {error && <div className="auth-message auth-message-error" role="alert"><BilingualText>{error}</BilingualText></div>}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 8px 0' }}><BilingualText>{"Ngôn ngữ mẹ đẻ của bạn là gì?"}</BilingualText></h2>
              <p style={{ color: 'var(--color-forest)', marginBottom: '24px' }}><BilingualText>{"Chúng tôi sẽ dùng ngôn ngữ này để giải thích từ vựng và ngữ pháp."}</BilingualText></p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                {[
                  { code: 'en', name: 'English 🇺🇸' },
                  { code: 'ko', name: '한국어 🇰🇷' },
                  { code: 'ja', name: '日本語 🇯🇵' },
                  { code: 'zh', name: '中文 🇨🇳' },
                  { code: 'fr', name: 'Français 🇫🇷' },
                  { code: 'es', name: 'Español 🇪🇸' },
                ].map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, nativeLanguage: lang.code })}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: preferences.nativeLanguage === lang.code ? '2px solid var(--color-red)' : '1.5px solid var(--color-border)',
                      background: preferences.nativeLanguage === lang.code ? 'var(--color-cream)' : 'var(--color-surface)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <BilingualText>{lang.name}</BilingualText>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="auth-btn auth-btn-primary"
                onClick={() => setStep(2)}
              ><BilingualText>{"Tiếp tục →"}</BilingualText></button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 8px 0' }}><BilingualText>{"Mục tiêu học của bạn?"}</BilingualText></h2>
              <p style={{ color: 'var(--color-forest)', marginBottom: '20px' }}><BilingualText>{"Chọn định hướng để AI và hệ thống đề xuất bài học thực tế nhất."}</BilingualText></p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {goals.map(g => (
                  <div
                    key={g.id}
                    onClick={() => setPreferences({ ...preferences, learningGoal: g.id })}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: preferences.learningGoal === g.id ? '2px solid var(--color-red)' : '1.5px solid var(--color-border)',
                      background: preferences.learningGoal === g.id ? 'var(--color-cream)' : 'var(--color-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-ink)' }}><BilingualText>{g.title}</BilingualText></strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-forest)' }}><BilingualText>{g.desc}</BilingualText></span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="auth-show-btn" onClick={() => setStep(1)}><BilingualText>{"← Quay lại"}</BilingualText></button>
                <button type="button" className="auth-btn auth-btn-primary" onClick={() => setStep(3)}><BilingualText>{"Tiếp tục →"}</BilingualText></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 8px 0' }}><BilingualText>{"Trình độ tiếng Việt hiện tại?"}</BilingualText></h2>
              <p style={{ color: 'var(--color-forest)', marginBottom: '20px' }}><BilingualText>{"Đừng ngại nếu bạn chưa biết gì, Hola Vietnamese được tạo ra để bắt đầu từ số 0!"}</BilingualText></p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {levels.map(l => (
                  <div
                    key={l.id}
                    onClick={() => setPreferences({ ...preferences, targetLevel: l.id })}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: preferences.targetLevel === l.id ? '2px solid var(--color-red)' : '1.5px solid var(--color-border)',
                      background: preferences.targetLevel === l.id ? 'var(--color-cream)' : 'var(--color-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-ink)' }}><BilingualText>{l.title}</BilingualText></strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-forest)' }}><BilingualText>{l.desc}</BilingualText></span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="auth-show-btn" onClick={() => setStep(2)}><BilingualText>{"← Quay lại"}</BilingualText></button>
                <button type="button" className="auth-btn auth-btn-primary" onClick={() => setStep(4)}><BilingualText>{"Tiếp tục →"}</BilingualText></button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 8px 0' }}><BilingualText>{"Mục tiêu thời gian mỗi ngày?"}</BilingualText></h2>
              <p style={{ color: 'var(--color-forest)', marginBottom: '20px' }}><BilingualText>{"Chỉ cần vài phút kiên trì mỗi ngày để tích lũy XP và duy trì chuỗi Streak rực cháy 🔥."}</BilingualText></p>

              <label className="auth-field" style={{ marginBottom: 18 }}>
                <span className="auth-label"><BilingualText>{"Quốc gia"}</BilingualText></span>
                <input className="auth-input" value={preferences.country} onChange={(e) => setPreferences({ ...preferences, country: e.target.value })} placeholder={bilingualLabel("Ví dụ: United States")} required />
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {times.map(t => (
                  <div
                    key={t.minutes}
                    onClick={() => setPreferences({ ...preferences, dailyMinutes: t.minutes })}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: preferences.dailyMinutes === t.minutes ? '2px solid var(--color-red)' : '1.5px solid var(--color-border)',
                      background: preferences.dailyMinutes === t.minutes ? 'var(--color-cream)' : 'var(--color-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-ink)' }}><BilingualText>{t.label}</BilingualText></strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-forest)' }}><BilingualText>{t.sub}</BilingualText></span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="auth-show-btn" onClick={() => setStep(3)}><BilingualText>{"← Quay lại"}</BilingualText></button>
                <button
                  type="button"
                  className="auth-btn auth-btn-primary"
                  onClick={handleFinish}
                  disabled={loading}
                >
                  <BilingualText>{loading ? 'Đang tạo lộ trình…' : 'Bắt đầu học ngay 🚀'}</BilingualText>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <aside className="auth-right-panel" aria-label="Lộ trình cá nhân hóa">
        <div className="auth-drum-bg">
          <img src={dongSonBg} alt="Hoa văn trống đồng Đông Sơn" className="auth-drum-img" />
        </div>
        <div className="auth-visual-topline"><span /><BilingualText>{"Lộ trình cá nhân hóa · Khởi đầu tự tin"}</BilingualText></div>
        <div className="auth-hero-card">
          <div className="auth-hero-tag"><BilingualText>{"LỘ TRÌNH CÁ NHÂN HÓA"}</BilingualText></div>
          <h2 className="auth-hero-title"><BilingualText>{"Được thiết kế riêng cho mục tiêu của bạn."}</BilingualText></h2>
          <p className="auth-hero-desc"><BilingualText>{"Không học vẹt ngữ pháp khô khan. Hola Vietnamese đưa bạn vào các tình huống thực tế: gọi món ở quán cóc, hỏi đường phố cổ và giao tiếp tự nhiên."}</BilingualText></p>
          <div className="auth-hero-chips">
            <span className="auth-chip">🎯 {preferences.learningGoal}</span>
            <span className="auth-chip">⏱ {preferences.dailyMinutes}<BilingualText>{"phút/ngày"}</BilingualText></span>
            <span className="auth-chip"><BilingualText>{"📊 Cấp độ"}</BilingualText>{preferences.targetLevel}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
