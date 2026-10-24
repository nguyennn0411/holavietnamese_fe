import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';
import dongSonBg from '@/assets/images/dongson_heritage.png';
import { Check } from 'lucide-react';

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
    { id: 'travel', title: '✈️ Du lịch & Khám phá', titleEn: '✈️ Travel & Exploration', desc: 'Hỏi đường, gọi món, đi taxi, mặc cả chợ đêm', descEn: 'Directions, ordering food, taxis, night market bargaining' },
    { id: 'work', title: '💼 Công việc & Định cư', titleEn: '💼 Work & Relocation', desc: 'Giao tiếp văn phòng, phỏng vấn, gặp đối tác', descEn: 'Office communication, interviews, meeting partners' },
    { id: 'exam_vsl', title: '🎓 Thi chứng chỉ VSL', titleEn: '🎓 VSL Certification', desc: 'Ngữ pháp chuẩn, luyện 6 thanh điệu, đọc hiểu', descEn: 'Standard grammar, 6 tones practice, reading comprehension' },
    { id: 'culture', title: '🏮 Văn hóa & Đời sống', titleEn: '🏮 Culture & Daily Life', desc: 'Xem phim, kết bạn với người Việt, hiểu ca dao', descEn: 'Watch movies, make Vietnamese friends, understand folk verses' },
  ];

  const levels = [
    { id: 'A1', title: 'Mới bắt đầu (A1)', titleEn: 'Beginner (A1)', desc: 'Chưa biết từ nào hoặc chỉ biết Xin chào, Cảm ơn', descEn: 'Complete beginner or only know Xin chào, Cảm ơn' },
    { id: 'A2', title: 'Sơ cấp (A2)', titleEn: 'Elementary (A2)', desc: 'Biết từ vựng cơ bản, ghép câu đơn giản', descEn: 'Know basic vocabulary and simple sentence structures' },
    { id: 'B1', title: 'Trung cấp (B1)', titleEn: 'Intermediate (B1)', desc: 'Giao tiếp được các tình huống quen thuộc thường nhật', descEn: 'Can converse in common everyday familiar situations' },
  ];

  const times = [
    { minutes: 10, label: 'Thư giãn (10 phút/ngày)', labelEn: 'Casual (10 min/day)', sub: 'Khoảng 1-2 bài học ngắn', subEn: 'Around 1-2 quick lessons' },
    { minutes: 15, label: 'Tiêu chuẩn (15 phút/ngày)', labelEn: 'Standard (15 min/day)', sub: 'Lý tưởng để duy trì phản xạ', subEn: 'Ideal for keeping up your reflex' },
    { minutes: 30, label: 'Nghiêm túc (30 phút/ngày)', labelEn: 'Intensive (30 min/day)', sub: 'Tăng tốc độ làm chủ tiếng Việt', subEn: 'Fast-track your Vietnamese fluency' },
  ];

  const handleFinish = async () => {
    setLoading(true);
    setError('');
    try {
      await learnerService.saveOnboarding(preferences);
      navigate('/', { state: { welcomeToast: bilingualLabel('Chào mừng bạn! Lộ trình học cá nhân hóa đã sẵn sàng.', 'Welcome! Your personalized learning path is ready.') } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = (isSelected) => ({
    padding: '14px 18px',
    borderRadius: '14px',
    border: isSelected ? '2px solid #F28C45' : '1.5px solid #E5E7EB',
    background: '#FFFFFF',
    color: '#1F2937',
    cursor: 'pointer',
    boxShadow: isSelected ? '0 2px 10px rgba(242, 140, 69, 0.12)' : '0 1px 3px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  });

  return (
    <div className="auth-container" style={{ background: '#FAFAFA' }}>
      <div className="auth-left-panel" style={{ padding: '36px 48px', background: '#FAFAFA' }}>
        <div className="auth-left-content" style={{ maxWidth: '520px' }}>
          <AuthHeader />

          {/* Progress tracker */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '99px',
                  background: s <= step ? '#F28C45' : '#E5E7EB',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>

          {error && <div className="auth-message auth-message-error" role="alert"><BilingualText>{error}</BilingualText></div>}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F2937', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                <BilingualText>{"Ngôn ngữ mẹ đẻ của bạn là gì?"}</BilingualText>
              </h2>
              <p style={{ color: '#6B7280', marginBottom: '24px', fontSize: '0.95rem' }}>
                <BilingualText>{"Chúng tôi sẽ dùng ngôn ngữ này để giải thích từ vựng và ngữ pháp."}</BilingualText>
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                {[
                  { code: 'en', name: 'English 🇺🇸' },
                  { code: 'ko', name: '한국어 🇰🇷' },
                  { code: 'ja', name: '日本語 🇯🇵' },
                  { code: 'zh', name: '中文 🇨🇳' },
                  { code: 'fr', name: 'Français 🇫🇷' },
                  { code: 'es', name: 'Español 🇪🇸' },
                ].map(lang => {
                  const isSelected = preferences.nativeLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setPreferences({ ...preferences, nativeLanguage: lang.code })}
                      className={`answer-card ${isSelected ? 'selected' : ''}`}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid #F28C45' : '1.5px solid #E5E7EB',
                        background: '#FFFFFF',
                        color: '#1F2937',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: isSelected ? '0 2px 10px rgba(242, 140, 69, 0.12)' : '0 1px 3px rgba(0, 0, 0, 0.03)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <BilingualText>{lang.name}</BilingualText>
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #F28C45' : '2px solid #D1D5DB',
                          background: isSelected ? '#F28C45' : '#FFFFFF',
                          color: '#FFFFFF',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="auth-btn"
                style={{
                  background: '#F28C45',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  borderRadius: '12px',
                  padding: '12px 24px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(242, 140, 69, 0.25)',
                }}
                onClick={() => setStep(2)}
              >
                <BilingualText>{"Tiếp tục →"}</BilingualText>
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F2937', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                <BilingualText>{"Mục tiêu học của bạn?"}</BilingualText>
              </h2>
              <p style={{ color: '#6B7280', marginBottom: '20px', fontSize: '0.95rem' }}>
                <BilingualText>{"Chọn định hướng để AI và hệ thống đề xuất bài học thực tế nhất."}</BilingualText>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {goals.map(g => {
                  const isSelected = preferences.learningGoal === g.id;
                  return (
                    <div
                      key={g.id}
                      onClick={() => setPreferences({ ...preferences, learningGoal: g.id })}
                      className={`answer-card ${isSelected ? 'selected' : ''}`}
                      style={cardStyle(isSelected)}
                    >
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#1F2937' }}>
                          <BilingualText vi={g.title} en={g.titleEn} />
                        </strong>
                        <span style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '3px', display: 'block' }}>
                          <BilingualText vi={g.desc} en={g.descEn} />
                        </span>
                      </div>
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #F28C45' : '2px solid #D1D5DB',
                          background: isSelected ? '#F28C45' : '#FFFFFF',
                          color: '#FFFFFF',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1.5px solid #E5E7EB',
                    background: '#FFFFFF',
                    color: '#374151',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  onClick={() => setStep(1)}
                >
                  <BilingualText>{"← Quay lại"}</BilingualText>
                </button>
                <button
                  type="button"
                  className="auth-btn"
                  style={{
                    background: '#F28C45',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    borderRadius: '12px',
                    padding: '12px 24px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(242, 140, 69, 0.25)',
                  }}
                  onClick={() => setStep(3)}
                >
                  <BilingualText>{"Tiếp tục →"}</BilingualText>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F2937', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                <BilingualText>{"Trình độ tiếng Việt hiện tại?"}</BilingualText>
              </h2>
              <p style={{ color: '#6B7280', marginBottom: '20px', fontSize: '0.95rem' }}>
                <BilingualText>{"Đừng ngại nếu bạn chưa biết gì, HolaVietnamese được thiết kế để bắt đầu từ số 0!"}</BilingualText>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {levels.map(l => {
                  const isSelected = preferences.targetLevel === l.id;
                  return (
                    <div
                      key={l.id}
                      onClick={() => setPreferences({ ...preferences, targetLevel: l.id })}
                      className={`answer-card ${isSelected ? 'selected' : ''}`}
                      style={cardStyle(isSelected)}
                    >
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#1F2937' }}>
                          <BilingualText vi={l.title} en={l.titleEn} />
                        </strong>
                        <span style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '3px', display: 'block' }}>
                          <BilingualText vi={l.desc} en={l.descEn} />
                        </span>
                      </div>
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #F28C45' : '2px solid #D1D5DB',
                          background: isSelected ? '#F28C45' : '#FFFFFF',
                          color: '#FFFFFF',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1.5px solid #E5E7EB',
                    background: '#FFFFFF',
                    color: '#374151',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  onClick={() => setStep(2)}
                >
                  <BilingualText>{"← Quay lại"}</BilingualText>
                </button>
                <button
                  type="button"
                  className="auth-btn"
                  style={{
                    background: '#F28C45',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    borderRadius: '12px',
                    padding: '12px 24px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(242, 140, 69, 0.25)',
                  }}
                  onClick={() => setStep(4)}
                >
                  <BilingualText>{"Tiếp tục →"}</BilingualText>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F2937', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                <BilingualText>{"Mục tiêu thời gian mỗi ngày?"}</BilingualText>
              </h2>
              <p style={{ color: '#6B7280', marginBottom: '20px', fontSize: '0.95rem' }}>
                <BilingualText>{"Chỉ cần vài phút kiên trì mỗi ngày để tích lũy XP và duy trì chuỗi Streak rực cháy."}</BilingualText>
              </p>

              <label className="auth-field" style={{ marginBottom: 18 }}>
                <span className="auth-label" style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                  <BilingualText>{"Quốc gia"}</BilingualText>
                </span>
                <input
                  className="auth-input"
                  style={{
                    borderRadius: '12px',
                    border: '1.5px solid #E5E7EB',
                    padding: '12px 16px',
                    background: '#FFFFFF',
                    color: '#1F2937',
                    outline: 'none',
                  }}
                  value={preferences.country}
                  onChange={(e) => setPreferences({ ...preferences, country: e.target.value })}
                  placeholder={bilingualLabel("Ví dụ: United States")}
                  required
                />
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {times.map(t => {
                  const isSelected = preferences.dailyMinutes === t.minutes;
                  return (
                    <div
                      key={t.minutes}
                      onClick={() => setPreferences({ ...preferences, dailyMinutes: t.minutes })}
                      className={`answer-card ${isSelected ? 'selected' : ''}`}
                      style={cardStyle(isSelected)}
                    >
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#1F2937' }}>
                          <BilingualText vi={t.label} en={t.labelEn} />
                        </strong>
                        <span style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '3px', display: 'block' }}>
                          <BilingualText vi={t.sub} en={t.subEn} />
                        </span>
                      </div>
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #F28C45' : '2px solid #D1D5DB',
                          background: isSelected ? '#F28C45' : '#FFFFFF',
                          color: '#FFFFFF',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1.5px solid #E5E7EB',
                    background: '#FFFFFF',
                    color: '#374151',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  onClick={() => setStep(3)}
                >
                  <BilingualText>{"← Quay lại"}</BilingualText>
                </button>
                <button
                  type="button"
                  className="auth-btn"
                  style={{
                    background: '#F28C45',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    borderRadius: '12px',
                    padding: '12px 24px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(242, 140, 69, 0.25)',
                  }}
                  onClick={handleFinish}
                  disabled={loading}
                >
                  <BilingualText>{loading ? 'Đang tạo lộ trình…' : 'Bắt đầu học ngay →'}</BilingualText>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <aside className="auth-right-panel" aria-label={bilingualLabel("Lộ trình cá nhân hóa", "Personalized learning roadmap")}>
        <div className="auth-drum-bg">
          <img src={dongSonBg} alt={bilingualLabel("Hoa văn trống đồng Đông Sơn", "Dong Son bronze drum patterns")} className="auth-drum-img" />
        </div>
        <div className="auth-visual-topline"><span /><BilingualText>{"Lộ trình cá nhân hóa · Khởi đầu tự tin"}</BilingualText></div>
        <div className="auth-hero-card" style={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid #E5E7EB' }}>
          <div className="auth-hero-tag" style={{ background: '#FFF4E8', color: '#F28C45', border: '1px solid #FED7AA' }}>
            <BilingualText>{"LỘ TRÌNH CÁ NHÂN HÓA"}</BilingualText>
          </div>
          <h2 className="auth-hero-title" style={{ color: '#1F2937' }}><BilingualText>{"Được thiết kế riêng cho mục tiêu của bạn."}</BilingualText></h2>
          <p className="auth-hero-desc" style={{ color: '#6B7280' }}><BilingualText>{"Không học vẹt ngữ pháp khô khan. HolaVietnamese đưa bạn vào các tình huống thực tế: gọi món ở quán cóc, hỏi đường phố cổ và giao tiếp tự nhiên."}</BilingualText></p>
          <div className="auth-hero-chips">
            <span className="auth-chip" style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB' }}>🎯 {preferences.learningGoal}</span>
            <span className="auth-chip" style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB' }}>⏱ {preferences.dailyMinutes} <BilingualText>{"phút/ngày"}</BilingualText></span>
            <span className="auth-chip" style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB' }}><BilingualText>{"📊 Cấp độ "}</BilingualText>{preferences.targetLevel}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
