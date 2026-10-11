import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';
import dongSonBg from '@/assets/images/dongson_heritage.png';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  // Step 1: Initiate (Send OTP)
  const handleInitiate = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus({ loading: true, message: '', error: '' });

    try {
      const res = await learnerService.forgotPasswordInitiate(email);
      setStatus({ loading: false, message: res.message || 'Mã OTP 6 số đã được gửi vào email của bạn!', error: '' });
      setStep(2);
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.message || 'Không tìm thấy tài khoản với email này.' });
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setStatus({ loading: true, message: '', error: '' });

    try {
      const res = await learnerService.forgotPasswordVerifyOtp(email, otp);
      setStatus({ loading: false, message: res.message || 'Mã OTP hợp lệ! Vui lòng nhập mật khẩu mới.', error: '' });
      setStep(3);
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.message || 'Mã OTP không chính xác hoặc đã hết hạn.' });
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setStatus({ loading: false, message: '', error: 'Mật khẩu phải từ 6 ký tự trở lên.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ loading: false, message: '', error: 'Mật khẩu xác nhận không trùng khớp.' });
      return;
    }

    setStatus({ loading: true, message: '', error: '' });
    try {
      const res = await learnerService.forgotPasswordReset(email, otp, newPassword);
      setStatus({ loading: false, message: res.message || 'Đổi mật khẩu thành công! Đang chuyển đến trang đăng nhập…', error: '' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.message || 'Không thể đặt lại mật khẩu.' });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <div className="auth-left-content">
          <AuthHeader />

          <div className="auth-welcome-pill">
            <span className="auth-welcome-code">🔑</span>
            <span className="auth-welcome-text">
              <BilingualText>{step === 1 ? 'Bước 1: Nhập Email' : step === 2 ? 'Bước 2: Xác thực OTP' : 'Bước 3: Mật khẩu mới'}</BilingualText>
            </span>
          </div>

          <h1 className="auth-heading">
            <BilingualText>{step === 1 ? 'Quên mật khẩu?' : step === 2 ? 'Nhập mã OTP' : 'Tạo mật khẩu mới'}</BilingualText>
          </h1>
          <p className="auth-subtitle">
            <BilingualText>{step === 1 && 'Nhập email tài khoản, chúng tôi sẽ gửi mã OTP xác nhận.'}</BilingualText>
            <BilingualText>{step === 2 && `Mã xác nhận 6 số đã được gửi tới ${email}.`}</BilingualText>
            <BilingualText>{step === 3 && 'Tạo mật khẩu an toàn mới để tiếp tục hành trình học tiếng Việt.'}</BilingualText>
          </p>

          {status.error && <div className="auth-message auth-message-error"><BilingualText>{status.error}</BilingualText></div>}
          {status.message && <div className="auth-message auth-message-success"><BilingualText>{status.message}</BilingualText></div>}

          {/* Step 1: Input Email */}
          {step === 1 && (
            <form className="auth-form" onSubmit={handleInitiate}>
              <div className="auth-field">
                <label className="auth-label"><BilingualText>{"Địa chỉ Email"}</BilingualText></label>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-btn auth-btn-primary"
                disabled={status.loading}
              >
                <BilingualText>{status.loading ? 'Đang gửi mã…' : 'Gửi mã OTP qua email'}</BilingualText>
              </button>
            </form>
          )}

          {/* Step 2: Input OTP */}
          {step === 2 && (
            <form className="auth-form" onSubmit={handleVerifyOtp}>
              <div className="auth-field">
                <label className="auth-label"><BilingualText>{"Mã OTP (6 chữ số)"}</BilingualText></label>
                <input
                  className="auth-input"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  required
                  style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.4rem', fontWeight: 'bold' }}
                />
              </div>

              <button
                type="submit"
                className="auth-btn auth-btn-primary"
                disabled={status.loading}
              >
                <BilingualText>{status.loading ? 'Đang kiểm tra…' : 'Xác thực mã OTP'}</BilingualText>
              </button>

              <button
                type="button"
                className="auth-show-btn"
                onClick={() => setStep(1)}
                style={{ marginTop: '8px' }}
              ><BilingualText>{"← Đổi email khác"}</BilingualText></button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form className="auth-form" onSubmit={handleResetPassword}>
              <div className="auth-field">
                <label className="auth-label"><BilingualText>{"Mật khẩu mới"}</BilingualText></label>
                <input
                  className="auth-input"
                  type="password"
                  placeholder={bilingualLabel("Tối thiểu 6 ký tự")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                disabled={status.loading}
              >
                <BilingualText>{status.loading ? 'Đang cập nhật…' : 'Lưu mật khẩu mới & Đăng nhập'}</BilingualText>
              </button>
            </form>
          )}

          <p className="auth-footer-text"><BilingualText>{"Nhớ lại mật khẩu rồi?"}</BilingualText><Link to="/login" className="auth-footer-link"><BilingualText>{"Quay lại đăng nhập"}</BilingualText></Link>
          </p>
        </div>
      </div>

      <aside className="auth-right-panel" aria-label="Bảo mật tài khoản">
        <div className="auth-drum-bg">
          <img src={dongSonBg} alt="Hoa văn trống đồng Đông Sơn" className="auth-drum-img" />
        </div>
        <div className="auth-visual-topline"><span /><BilingualText>{"Bảo mật tài khoản · Đồng bộ tiến độ"}</BilingualText></div>
        <div className="auth-hero-card">
          <div className="auth-hero-tag"><BilingualText>{"BẢO MẬT TÀI KHOẢN"}</BilingualText></div>
          <h2 className="auth-hero-title"><BilingualText>{"Khôi phục mật khẩu 3 bước chuẩn an toàn."}</BilingualText></h2>
          <p className="auth-hero-desc"><BilingualText>{"Xác thực OTP 2 lớp qua email đảm bảo quyền sở hữu tài khoản và giữ nguyên mọi dữ liệu khóa học đã lưu."}</BilingualText></p>
        </div>
      </aside>
    </div>
  );
}
