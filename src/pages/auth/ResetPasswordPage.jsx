import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';
import dongSonBg from '@/assets/images/dongson_heritage.png';

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
          <AuthHeader />

          <div className="auth-welcome-pill">
            <span className="auth-welcome-code">🔒</span>
            <span className="auth-welcome-text"><BilingualText>{"Mật khẩu mới"}</BilingualText></span>
          </div>

          <h1 className="auth-heading"><BilingualText vi={<>Tạo mật khẩu<br />mới</>} en="Create a new password" /></h1>
          <p className="auth-subtitle"><BilingualText>{"Nhập mật khẩu mới cho tài khoản của bạn để hoàn tất đặt lại."}</BilingualText></p>

          {status.error && <div className="auth-message auth-message-error"><BilingualText>{status.error}</BilingualText></div>}
          {status.message && <div className="auth-message auth-message-success"><BilingualText>{status.message}</BilingualText></div>}

          <form className="auth-form" onSubmit={handleReset}>
            <div className="auth-field">
              <label className="auth-label"><BilingualText>{"Email"}</BilingualText></label>
              <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label className="auth-label"><BilingualText>{"Mã OTP"}</BilingualText></label>
              <input className="auth-input" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label className="auth-label"><BilingualText>{"Mật khẩu mới"}</BilingualText></label>
              <input
                className="auth-input"
                type="password"
                placeholder={bilingualLabel("Tối thiểu 6 ký tự")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label"><BilingualText>{"Xác nhận mật khẩu"}</BilingualText></label>
              <input
                className="auth-input"
                type="password"
                placeholder={bilingualLabel("Nhập lại mật khẩu mới")}
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
              <BilingualText>{status.loading ? 'Đang cập nhật…' : 'Lưu mật khẩu mới'}</BilingualText>
            </button>
          </form>

          <p className="auth-footer-text"><BilingualText>{"Quay lại"}</BilingualText><Link to="/login" className="auth-footer-link"><BilingualText>{"Đăng nhập"}</BilingualText></Link>
          </p>
        </div>
      </div>

      <aside className="auth-right-panel" aria-label="Bảo mật tài khoản">
        <div className="auth-drum-bg">
          <img src={dongSonBg} alt="Hoa văn trống đồng Đông Sơn" className="auth-drum-img" />
        </div>
        <div className="auth-visual-topline"><span /><BilingualText>{"Bảo mật tài khoản · Khôi phục nhanh"}</BilingualText></div>
        <div className="auth-hero-card">
          <div className="auth-hero-tag"><BilingualText>{"BẢO MẬT TÀI KHOẢN"}</BilingualText></div>
          <h2 className="auth-hero-title"><BilingualText>{"Khởi động lại an toàn."}</BilingualText></h2>
          <p className="auth-hero-desc"><BilingualText>{"Sau khi đổi mật khẩu, bạn có thể đăng nhập ngay trên mọi thiết bị và đồng bộ tiến độ tức thì."}</BilingualText></p>
        </div>
      </aside>
    </div>
  );
}
