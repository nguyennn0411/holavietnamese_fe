import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthRightPanel } from '@/components/auth/AuthRightPanel';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';
import { Eye, EyeOff } from 'lucide-react';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const initialOtp = searchParams.get('otp') || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(initialOtp);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      {/* Left Panel */}
      <div className="auth-left-panel">
        <AuthHeader />

        <main className="auth-left-content">
          <h1 className="auth-heading">
            <BilingualText vi="Đặt lại mật khẩu" en="Reset Password" />
          </h1>
          <p className="auth-subtitle">
            <BilingualText
              vi="Nhập mật khẩu mới cho tài khoản của bạn để hoàn tất đặt lại."
              en="Enter a new password for your account to complete the reset."
            />
          </p>

          {status.error && (
            <div className="auth-message auth-message-error">
              <BilingualText>{status.error}</BilingualText>
            </div>
          )}
          {status.message && (
            <div className="auth-message auth-message-success">
              <BilingualText>{status.message}</BilingualText>
            </div>
          )}

          <form className="auth-form" onSubmit={handleReset}>
            <div className="auth-form-grid">
              <div className="auth-field">
                <label className="auth-label" htmlFor="reset-direct-email">
                  <BilingualText vi="Email" en="Email" />
                </label>
                <input
                  id="reset-direct-email"
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="reset-direct-otp">
                  <BilingualText vi="Mã OTP" en="OTP Code" />
                </label>
                <input
                  id="reset-direct-otp"
                  className="auth-input"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="reset-direct-pass">
                  <BilingualText vi="Mật khẩu mới" en="New Password" />
                </label>
                <div className="auth-password-row">
                  <input
                    id="reset-direct-pass"
                    className="auth-input auth-password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={bilingualLabel("Tối thiểu 6 ký tự")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-show-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="reset-direct-confirm">
                  <BilingualText vi="Xác nhận mật khẩu" en="Confirm Password" />
                </label>
                <div className="auth-password-row">
                  <input
                    id="reset-direct-confirm"
                    className="auth-input auth-password-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={bilingualLabel("Nhập lại mật khẩu")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-show-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={status.loading || !!status.message}
            >
              <BilingualText
                vi={status.loading ? 'Đang cập nhật…' : 'Lưu mật khẩu mới'}
                en={status.loading ? 'Updating…' : 'Save New Password'}
              />
            </button>
          </form>

          <p className="auth-footer-text">
            <Link to="/login" className="auth-footer-link">
              <BilingualText vi="← Quay lại đăng nhập" en="← Back to Sign In" />
            </Link>
          </p>
        </main>

        <AuthFooter />
      </div>

      {/* Right Panel: Exact Dong Son Visual from Figma Reference */}
      <AuthRightPanel />
    </div>
  );
}
