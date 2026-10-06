import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';
import dongSonBg from '@/assets/images/dongson_auth_bg.png';
import '@/presentation/styles/auth.css';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const initialOtp = searchParams.get('otp') || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(initialOtp);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus({ loading: false, message: '', error: 'Mật khẩu xác nhận không trùng khớp.' });
      return;
    }
    if (password.length < 6) {
      setStatus({ loading: false, message: '', error: 'Mật khẩu phải từ 6 ký tự trở lên.' });
      return;
    }

    setStatus({ loading: true, message: '', error: '' });
    try {
      const res = await learnerService.forgotPasswordReset(email, otp, password);
      setStatus({ loading: false, message: res.message || 'Đặt lại mật khẩu thành công!', error: '' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.message || 'Mã xác thực không hợp lệ.' });
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
            <span className="auth-welcome-code">🔒</span>
            <span className="auth-welcome-text">Mật khẩu mới</span>
          </div>

          <h1 className="auth-heading">Tạo mật khẩu<br />mới</h1>
          <p className="auth-subtitle">
            Nhập mật khẩu mới cho tài khoản của bạn để hoàn tất đặt lại.
          </p>

          {status.error && <div className="auth-message auth-message-error">{status.error}</div>}
          {status.message && <div className="auth-message auth-message-success">{status.message}</div>}

          <form className="auth-form" onSubmit={handleReset}>
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label className="auth-label">Mã OTP</label>
              <input className="auth-input" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label className="auth-label">Mật khẩu mới</label>
              <input
                className="auth-input"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Xác nhận mật khẩu</label>
              <input
                className="auth-input"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={status.loading || !!status.message}
            >
              {status.loading ? 'Đang cập nhật…' : 'Lưu mật khẩu mới'}
            </button>
          </form>

          <p className="auth-footer-text">
            Quay lại <Link to="/login" className="auth-footer-link">Đăng nhập</Link>
          </p>
        </div>
      </div>

      <aside className="auth-right-panel" aria-label="Bảo mật tài khoản">
        <div className="auth-drum-bg">
          <img src={dongSonBg} alt="Hoa văn trống đồng Đông Sơn" className="auth-drum-img" />
        </div>
        <div className="auth-visual-topline"><span /> Bảo mật tài khoản · Khôi phục nhanh</div>
        <div className="auth-hero-card">
          <div className="auth-hero-tag">BẢO MẬT TÀI KHOẢN</div>
          <h2 className="auth-hero-title">Khởi động lại an toàn.</h2>
          <p className="auth-hero-desc">
            Sau khi đổi mật khẩu, bạn có thể đăng nhập ngay trên mọi thiết bị và đồng bộ tiến độ tức thì.
          </p>
        </div>
      </aside>
    </div>
  );
}
