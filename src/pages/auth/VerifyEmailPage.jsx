import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthRightPanel } from '@/components/auth/AuthRightPanel';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MailCheck, RefreshCw, ShieldCheck } from 'lucide-react';
import authApi from '@/api/authApi';
import {
  clearPendingVerification,
  getDevelopmentOtp,
  getRemainingCooldown,
  getVerificationErrorMessage,
  isSuccessfulAuthResponse,
  isValidOtp,
  loadPostVerificationPath,
  loadPendingVerificationEmail,
  sanitizeOtp,
  savePendingVerificationEmail,
  startResendCooldown,
} from '@/features/auth/emailVerificationFlow';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTimerRef = useRef(null);
  const [email, setEmail] = useState(() => location.state?.email || loadPendingVerificationEmail());
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');
  const [developmentOtp, setDevelopmentOtp] = useState(() => (
    import.meta.env.DEV ? location.state?.developmentOtp || '' : ''
  ));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(() => getRemainingCooldown());
  const afterLogin = location.state?.afterLogin || loadPostVerificationPath();

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const interval = window.setInterval(() => setCooldown(getRemainingCooldown()), 1000);
    return () => window.clearInterval(interval);
  }, [cooldown > 0]);

  useEffect(() => () => {
    if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
  }, []);

  const normalizedEmail = email.trim();
  const emailIsValid = EMAIL_PATTERN.test(normalizedEmail);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setFormError('');
  };

  const handleOtpChange = (event) => {
    setOtp(sanitizeOtp(event.target.value));
    setOtpError('');
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    if (verifying || verified) return;
    if (!emailIsValid) {
      setFormError(bilingualLabel('Vui lòng nhập đúng email đã dùng để đăng ký.', 'Please enter the email address used during registration.'));
      return;
    }
    if (!isValidOtp(otp)) {
      setOtpError(bilingualLabel('Mã OTP phải gồm đúng 6 chữ số.', 'OTP must consist of exactly 6 digits.'));
      return;
    }

    setVerifying(true);
    setOtpError('');
    setFormError('');
    try {
      const response = await authApi.verifyEmailOtp(normalizedEmail, otp);
      if (!isSuccessfulAuthResponse(response)) {
        const error = new Error(response?.message || bilingualLabel('Không thể xác minh email.', 'Unable to verify email.'));
        error.code = response?.code;
        throw error;
      }
      clearPendingVerification();
      setVerified(true);
      setMessage(response.message || bilingualLabel('Xác minh email thành công', 'Email verified successfully'));
      toast.success(response.message || bilingualLabel('Xác minh email thành công', 'Email verified successfully'));
      redirectTimerRef.current = window.setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: {
            from: afterLogin,
            message: bilingualLabel('Xác minh email thành công. Hãy đăng nhập để bắt đầu bài kiểm tra đầu vào.', 'Email verified successfully. Please sign in to begin your placement test.'),
          },
        });
      }, 1500);
    } catch (error) {
      setOtpError(getVerificationErrorMessage(error));
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resending || cooldown > 0) return;
    if (!emailIsValid) {
      setFormError(bilingualLabel('Vui lòng nhập đúng email đã dùng để đăng ký.', 'Please enter the email address used during registration.'));
      return;
    }

    setResending(true);
    setFormError('');
    try {
      const response = await authApi.resendVerificationOtp(normalizedEmail);
      if (!isSuccessfulAuthResponse(response)) throw new Error(response?.message || bilingualLabel('Không thể gửi lại mã OTP.', 'Unable to resend OTP code.'));
      savePendingVerificationEmail(normalizedEmail);
      setOtp('');
      setOtpError('');
      setMessage(bilingualLabel('Mã OTP mới đã được gửi. Vui lòng kiểm tra Gmail của bạn.', 'A new OTP has been sent. Please check your Gmail.'));
      setDevelopmentOtp(getDevelopmentOtp(response, import.meta.env.DEV));
      startResendCooldown(60);
      setCooldown(60);
      toast.success(bilingualLabel('Đã gửi mã OTP mới. Vui lòng kiểm tra Gmail.', 'A new OTP code has been sent. Please check Gmail.'));
    } catch (error) {
      setFormError(error?.message || bilingualLabel('Không thể gửi lại mã OTP. Vui lòng thử lại.', 'Unable to resend OTP code. Please try again.'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container auth-verify-page">
      <div className="auth-left-panel">
        <AuthHeader />

        <main className="auth-left-content">
          <div className="auth-verify-icon" aria-hidden="true"><MailCheck size={26} /></div>
          <h1 className="auth-heading"><BilingualText vi="Xác minh email" en="Verify your email" /></h1>
          <p className="auth-subtitle">
            <BilingualText
              vi="Nhập mã OTP 6 chữ số được gửi đến email đăng ký. Mã có hiệu lực trong 10 phút."
              en="Enter the 6-digit OTP sent to your registered email. The code is valid for 10 minutes."
            />
          </p>

          {message && (
            <div className="auth-message auth-message-success" role="status" aria-live="polite">
              <BilingualText>{message}</BilingualText>
            </div>
          )}

          {developmentOtp && import.meta.env.DEV && (
            <div className="auth-dev-otp" role="status">
              <span>Development OTP</span>
              <strong>{developmentOtp}</strong>
            </div>
          )}

          <form className="auth-form" onSubmit={handleVerify} aria-busy={verifying}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="verification-email">
                <BilingualText vi="Email đăng ký" en="Registered email" />
              </label>
              <input
                id="verification-email"
                className={`auth-input ${formError ? 'auth-input-error' : ''}`}
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => emailIsValid && savePendingVerificationEmail(normalizedEmail)}
                placeholder={bilingualLabel('Nhập email đã đăng ký')}
                autoComplete="email"
                disabled={verifying || verified}
                required
              />
              {formError && <span className="auth-field-error" role="alert">{formError}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="verification-otp">
                <BilingualText vi="Mã OTP" en="OTP code" />
                <span className="auth-otp-count">{otp.length}/6</span>
              </label>
              <input
                id="verification-otp"
                className={`auth-input auth-otp-input ${otpError ? 'auth-input-error' : ''}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                autoComplete="one-time-code"
                aria-describedby={otpError ? 'verification-otp-error' : undefined}
                disabled={verifying || verified}
              />
              {otpError && <span id="verification-otp-error" className="auth-field-error" role="alert">{otpError}</span>}
            </div>

            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={!emailIsValid || !isValidOtp(otp) || verifying || resending || verified}
            >
              <ShieldCheck size={18} />
              <BilingualText
                vi={verified ? 'Đã xác minh' : verifying ? 'Đang xác minh…' : 'Xác minh'}
                en={verified ? 'Verified' : verifying ? 'Verifying…' : 'Verify'}
              />
            </button>

            <button
              type="button"
              className="auth-btn auth-btn-secondary"
              onClick={handleResend}
              disabled={!emailIsValid || resending || verifying || verified || cooldown > 0}
            >
              <RefreshCw size={17} className={resending ? 'auth-spin' : ''} />
              <BilingualText
                vi={resending ? 'Đang gửi…' : cooldown > 0 ? `Gửi lại mã (${cooldown}s)` : 'Gửi lại mã'}
                en={resending ? 'Sending…' : cooldown > 0 ? `Resend code (${cooldown}s)` : 'Resend code'}
              />
            </button>
          </form>

          <p className="auth-footer-text">
            {!loadPendingVerificationEmail() && (
              <><BilingualText vi="Chưa đăng ký?" en="Not registered?" />{' '}<Link to="/register" className="auth-footer-link"><BilingualText vi="Tạo tài khoản" en="Create account" /></Link><span className="auth-footer-dot"> · </span></>
            )}
            <Link to="/login" className="auth-footer-link"><BilingualText vi="Quay lại đăng nhập" en="Back to sign in" /></Link>
          </p>
        </main>

        <AuthFooter />
      </div>

      <AuthRightPanel />
    </div>
  );
}
