import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';
import { DongSonDrum } from '@/presentation/components/DongSonDrum';
import '@/presentation/styles/auth.css';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, success: false, message: '', error: '' });
  const navigate = useNavigate();

  // Automatically verify if ?token=xxx is in URL
  useEffect(() => {
    if (token) {
      setStatus({ loading: true, success: false, message: '', error: '' });
      learnerService.verifyEmailByToken(token)
        .then((res) => {
          setStatus({ loading: false, success: true, message: res.message || 'Xác minh email thành công!', error: '' });
          setTimeout(() => navigate('/onboarding'), 2000);
        })
        .catch((err) => {
          setStatus({ loading: false, success: false, message: '', error: err.message || 'Liên kết xác minh không hợp lệ hoặc đã hết hạn.' });
        });
    }
  }, [token, navigate]);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code) return;
    setStatus({ loading: true, success: false, message: '', error: '' });

    try {
      const res = await learnerService.verifyEmailByCode(code);
      setStatus({ loading: false, success: true, message: res.message || 'Xác minh thành công!', error: '' });
      setTimeout(() => navigate('/onboarding'), 1500);
    } catch (err) {
      setStatus({ loading: false, success: false, message: '', error: err.message || 'Mã xác minh không chính xác.' });
    }
  };

  const handleResend = async () => {
    if (!email) {
      setStatus(s => ({ ...s, error: 'Vui lòng nhập email để gửi lại mã.' }));
      return;
    }
    try {
      const res = await learnerService.resendVerificationEmail(email);
      setStatus(s => ({ ...s, message: res.message, error: '' }));
    } catch (err) {
      setStatus(s => ({ ...s, error: err.message }));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <div className="auth-left-content">
          <div className="auth-brand-row">
            <div className="auth-brand-logo">
              <span className="auth-logo-text">H</span>
              <span className="auth-logo-star">★</span>
            </div>
            <span className="auth-brand-name">HolaVietnamese</span>
            <span className="auth-brand-badge">ĐỐNG SƠN POP</span>
          </div>

          <div className="auth-welcome-pill">
            <span className="auth-welcome-code">✉️</span>
            <span className="auth-welcome-text">Xác minh tài khoản</span>
          </div>

          <h1 className="auth-heading">Kiểm tra<br />hộp thư của bạn</h1>
          <p className="auth-subtitle">
            {token
              ? 'Đang kiểm tra liên kết xác minh tài khoản của bạn…'
              : 'Chúng tôi đã gửi mã xác minh 6 số đến email đăng ký. Vui lòng nhập mã để kích hoạt tài khoản.'}
          </p>

          {status.error && <div className="auth-message auth-message-error">{status.error}</div>}
          {status.message && <div className="auth-message auth-message-success">{status.message}</div>}

          {!token && (
            <form className="auth-form" onSubmit={handleVerifyCode}>
              <div className="auth-field">
                <label className="auth-label">Mã xác minh (6 chữ số)</label>
                <input
                  className="auth-input"
                  type="text"
                  maxLength={6}
                  placeholder="Ví dụ: 123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim())}
                  required
                  style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.4rem', fontWeight: 'bold' }}
                />
              </div>

              <button
                type="submit"
                className="auth-btn auth-btn-primary"
                disabled={status.loading || status.success}
              >
                {status.loading ? 'Đang kiểm tra…' : status.success ? '✓ Đã xác minh' : 'Xác minh ngay'}
              </button>
            </form>
          )}

          <div style={{ marginTop: '24px', padding: '16px', background: '#faf8f5', borderRadius: '12px', border: '1px solid #ded5cb' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#695a50', fontWeight: '600' }}>
              Chưa nhận được mã hoặc mã đã hết hạn?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="auth-input"
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ height: '40px', fontSize: '0.85rem' }}
              />
              <button
                type="button"
                className="auth-show-btn"
                onClick={handleResend}
                style={{ height: '40px' }}
              >
                Gửi lại
              </button>
            </div>
          </div>

          <p className="auth-footer-text">
            Đã có tài khoản sẵn sàng? <Link to="/login" className="auth-footer-link">Đăng nhập</Link>
          </p>
        </div>
      </div>

      <div className="auth-right-panel">
        <div className="auth-drum-bg">
          <DongSonDrum className="auth-drum-svg" />
        </div>
        <div className="auth-hero-card">
          <div className="auth-hero-tag">BẢO MẬT & XÁC THỰC</div>
          <h2 className="auth-hero-title">Bảo vệ tiến trình học của bạn.</h2>
          <p className="auth-hero-desc">
            Xác minh email giúp bạn không bao giờ mất chuỗi streak, huy hiệu thành tích và sổ tay từ vựng yêu thích.
          </p>
        </div>
      </div>
    </div>
  );
}
