import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';
import dongSonBg from '@/assets/images/dongson_heritage.png';

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
          <AuthHeader />

          <div className="auth-welcome-pill">
            <span className="auth-welcome-code">✉️</span>
            <span className="auth-welcome-text"><BilingualText>{"Xác minh tài khoản"}</BilingualText></span>
          </div>

          <h1 className="auth-heading"><BilingualText vi={<>Kiểm tra<br />hộp thư của bạn</>} en="Check your inbox" /></h1>
          <p className="auth-subtitle">
            <BilingualText>{token
              ? 'Đang kiểm tra liên kết xác minh tài khoản của bạn…'
              : 'Mở liên kết trong email để kích hoạt tài khoản. Bạn có thể gửi lại email xác minh bên dưới.'}</BilingualText>
          </p>

          {status.error && <div className="auth-message auth-message-error"><BilingualText>{status.error}</BilingualText></div>}
          {status.message && <div className="auth-message auth-message-success"><BilingualText>{status.message}</BilingualText></div>}

          <div style={{ marginTop: '24px', padding: '16px', background: 'var(--color-cream)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--color-forest)', fontWeight: '600' }}><BilingualText>{"Chưa nhận được mã hoặc mã đã hết hạn?"}</BilingualText></p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="auth-input"
                type="email"
                placeholder={bilingualLabel("Nhập email của bạn")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ height: '40px', fontSize: '0.85rem', flex: 1, minWidth: 0 }}
              />
              <button
                type="button"
                className="secondary"
                onClick={handleResend}
                disabled={status.loading}
                style={{ height: '40px', minHeight: '40px', padding: '8px 12px', flexShrink: 0 }}
              ><BilingualText>{"Gửi lại"}</BilingualText></button>
            </div>
          </div>

          <p className="auth-footer-text"><BilingualText>{"Đã có tài khoản sẵn sàng?"}</BilingualText><Link to="/login" className="auth-footer-link"><BilingualText>{"Đăng nhập"}</BilingualText></Link>
          </p>
        </div>
      </div>

      <aside className="auth-right-panel" aria-label="Bảo mật & xác thực">
        <div className="auth-drum-bg">
          <img src={dongSonBg} alt="Hoa văn trống đồng Đông Sơn" className="auth-drum-img" />
        </div>
        <div className="auth-visual-topline"><span /><BilingualText>{"Bảo mật & xác thực · HolaVietnamese"}</BilingualText></div>
        <div className="auth-hero-card">
          <div className="auth-hero-tag"><BilingualText>{"BẢO MẬT & XÁC THỰC"}</BilingualText></div>
          <h2 className="auth-hero-title"><BilingualText>{"Bảo vệ tiến trình học của bạn."}</BilingualText></h2>
          <p className="auth-hero-desc"><BilingualText>{"Xác minh email giúp bạn không bao giờ mất chuỗi streak, huy hiệu thành tích và sổ tay từ vựng yêu thích."}</BilingualText></p>
        </div>
      </aside>
    </div>
  );
}
