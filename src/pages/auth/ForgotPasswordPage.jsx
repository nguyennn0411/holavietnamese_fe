import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthRightPanel } from '@/components/auth/AuthRightPanel';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';
import { Eye, EyeOff } from 'lucide-react';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    } catch {
      setStatus({ loading: false, message: '', error: 'Không thể gửi mã OTP. Vui lòng kiểm tra lại địa chỉ email hoặc thử lại sau.' });
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
      {/* Left Panel */}
      <div className="auth-left-panel">
        <AuthHeader />

        <main className="auth-left-content">
          {/* Heading */}
          <h1 className="auth-heading">
            {step === 1 && <BilingualText vi="Quên mật khẩu?" en="Forgot Password?" />}
            {step === 2 && <BilingualText vi="Xác thực mã OTP" en="Verify OTP Code" />}
            {step === 3 && <BilingualText vi="Đặt lại mật khẩu" en="Reset Password" />}
          </h1>

          {/* Subtitle */}
          <p className="auth-subtitle">
            {step === 1 && (
              <BilingualText
                vi="Nhập email để nhận hướng dẫn đặt lại mật khẩu."
                en="Enter your email to receive password reset instructions."
              />
            )}
            {step === 2 && (
              <BilingualText
                vi={`Mã xác nhận 6 số đã được gửi tới ${email}.`}
                en={`A 6-digit verification code was sent to ${email}.`}
              />
            )}
            {step === 3 && (
              <BilingualText
                vi="Tạo mật khẩu an toàn mới cho tài khoản của bạn."
                en="Create a new secure password for your account."
              />
            )}
          </p>

          {/* Step indicator */}
          <div className="auth-step-indicator">
            <div className={`auth-step-item ${step >= 1 ? 'auth-step-item-active' : ''}`}>
              <span>1</span>
              <small><BilingualText vi="Email" en="Email" /></small>
            </div>
            <i className={step >= 2 ? 'active' : ''} />
            <div className={`auth-step-item ${step >= 2 ? 'auth-step-item-active' : ''}`}>
              <span>2</span>
              <small><BilingualText vi="Mã OTP" en="OTP" /></small>
            </div>
            <i className={step >= 3 ? 'active' : ''} />
            <div className={`auth-step-item ${step >= 3 ? 'auth-step-item-active' : ''}`}>
              <span>3</span>
              <small><BilingualText vi="Mật khẩu" en="Password" /></small>
            </div>
          </div>

          {/* Messages */}
          {status.error && (
            <div className="auth-message auth-message-error" role="alert" aria-live="assertive">
              <BilingualText>{status.error}</BilingualText>
            </div>
          )}
          {status.message && (
            <div className="auth-message auth-message-success" role="status" aria-live="polite">
              <BilingualText>{status.message}</BilingualText>
            </div>
          )}

          {/* Step 1: Input Email */}
          {step === 1 && (
            <form className="auth-form" onSubmit={handleInitiate} aria-busy={status.loading}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="forgot-email">
                  <BilingualText vi="Địa chỉ Email" en="Email Address" />
                </label>
                <input
                  id="forgot-email"
                  className="auth-input"
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className="auth-btn auth-btn-primary"
                disabled={status.loading}
              >
                <BilingualText
                  vi={status.loading ? 'Đang gửi mã…' : 'Gửi hướng dẫn'}
                  en={status.loading ? 'Sending code…' : 'Send Instructions'}
                />
              </button>
            </form>
          )}

          {/* Step 2: Input OTP */}
          {step === 2 && (
            <form className="auth-form" onSubmit={handleVerifyOtp} aria-busy={status.loading}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="forgot-otp">
                  <BilingualText vi="Mã OTP (6 chữ số)" en="OTP Code (6 digits)" />
                </label>
                <input
                  id="forgot-otp"
                  className="auth-input"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  required
                  style={{ textAlign: 'center', letterSpacing: '6px', fontSize: '1.4rem', fontWeight: 'bold' }}
                />
              </div>

              <button
                type="submit"
                className="auth-btn auth-btn-primary"
                disabled={status.loading}
              >
                <BilingualText
                  vi={status.loading ? 'Đang kiểm tra…' : 'Xác thực mã OTP'}
                  en={status.loading ? 'Verifying…' : 'Verify OTP Code'}
                />
              </button>

              <button
                type="button"
                className="auth-btn auth-btn-secondary"
                onClick={() => setStep(1)}
              >
                <BilingualText vi="← Đổi email khác" en="← Use another email" />
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form className="auth-form" onSubmit={handleResetPassword} aria-busy={status.loading}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="reset-new-password">
                  <BilingualText vi="Mật khẩu mới" en="New Password" />
                </label>
                <div className="auth-password-row">
                  <input
                    id="reset-new-password"
                    className="auth-input auth-password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={bilingualLabel("Tối thiểu 6 ký tự")}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                <label className="auth-label" htmlFor="reset-confirm-password">
                  <BilingualText vi="Xác nhận mật khẩu mới" en="Confirm New Password" />
                </label>
                <div className="auth-password-row">
                  <input
                    id="reset-confirm-password"
                    className="auth-input auth-password-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={bilingualLabel("Nhập lại mật khẩu mới")}
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

              <button
                type="submit"
                className="auth-btn auth-btn-primary"
                disabled={status.loading}
              >
                <BilingualText
                  vi={status.loading ? 'Đang cập nhật…' : 'Lưu mật khẩu mới'}
                  en={status.loading ? 'Updating…' : 'Save New Password'}
                />
              </button>
            </form>
          )}

          {/* Footer link */}
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
