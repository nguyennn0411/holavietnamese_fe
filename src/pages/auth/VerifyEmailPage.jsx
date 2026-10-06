import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';
import dongSonBg from '@/assets/images/dongson_auth_bg.png';
import '@/presentation/styles/auth.css';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
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
              : 'Mở liên kết trong email để kích hoạt tài khoản. Bạn có thể gửi lại email xác minh bên dưới.'}
          </p>

          {status.error && <div className="auth-message auth-message-error">{status.error}</div>}
          {status.message && <div className="auth-message auth-message-success">{status.message}</div>}

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
                disabled={status.loading}
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

      <aside className="auth-right-panel" aria-label="Bảo mật & xác thực">
        <div className="auth-drum-bg">
          <img src={dongSonBg} alt="Hoa văn trống đồng Đông Sơn" className="auth-drum-img" />
        </div>
        <div className="auth-visual-topline"><span /> Bảo mật & xác thực · HolaVietnamese</div>
        <div className="auth-hero-card">
          <div className="auth-hero-tag">BẢO MẬT & XÁC THỰC</div>
          <h2 className="auth-hero-title">Bảo vệ tiến trình học của bạn.</h2>
          <p className="auth-hero-desc">
            Xác minh email giúp bạn không bao giờ mất chuỗi streak, huy hiệu thành tích và sổ tay từ vựng yêu thích.
          </p>
        </div>
      </aside>
    </div>
  );
}
