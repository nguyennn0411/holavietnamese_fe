import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthRightPanel } from '@/components/auth/AuthRightPanel';
import { useState } from 'react';
import { useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { savePendingVerificationEmail, savePostVerificationPath, startResendCooldown } from '@/features/auth/emailVerificationFlow';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated, user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1 fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Field-specific validation and backend error state
  const [fieldErrors, setFieldErrors] = useState({});

  if (isAuthenticated) {
    return <Navigate to={user?.onboardingCompleted === true ? '/' : '/onboarding/reason'} replace />;
  }

  const validateAccount = () => {
    const errors = {};

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      errors.username = bilingualLabel('Vui lòng nhập tên đăng nhập', 'Please enter your username');
    } else if (trimmedUsername.length < 3) {
      errors.username = bilingualLabel('Tên đăng nhập phải có ít nhất 3 ký tự', 'Username must be at least 3 characters');
    }

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = bilingualLabel('Vui lòng nhập địa chỉ email', 'Please enter your email address');
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = bilingualLabel('Email không đúng định dạng (VD: alex@example.com)', 'Invalid email format (e.g. alex@example.com)');
    }

    if (!password) {
      errors.password = bilingualLabel('Vui lòng nhập mật khẩu', 'Please enter your password');
    } else if (password.length < 6) {
      errors.password = bilingualLabel('Mật khẩu phải có ít nhất 6 ký tự', 'Password must be at least 6 characters');
    }

    if (!confirmPassword) {
      errors.confirmPassword = bilingualLabel('Vui lòng xác nhận mật khẩu', 'Please confirm your password');
    } else if (confirmPassword !== password) {
      errors.confirmPassword = bilingualLabel('Mật khẩu xác nhận không trùng khớp', 'Confirmation password does not match');
    }

    if (!fullName.trim()) {
      errors.fullName = bilingualLabel('Vui lòng nhập họ và tên', 'Please enter your full name');
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const executeRegistration = async () => {
    setError('');
    setFieldErrors({});

    if (!validateAccount()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: username.trim(),
        password: password,
        email: email.trim(),
        fullName: fullName.trim() || username.trim(),
        phoneNumber: phoneNumber.trim(),
        nativeLanguage: 'en',
        learningGoal: 'daily_communication',
        targetLevel: null,
      };

      const result = await register(payload);

      if (result.success) {
        const verificationEmail = savePendingVerificationEmail(result.email || email);
        const afterLogin = savePostVerificationPath(location.state?.from || '/onboarding/reason');
        startResendCooldown(60);
        navigate('/verify-email', {
          replace: true,
          state: {
            email: verificationEmail,
            message: result.message || bilingualLabel('Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP.', 'Registration successful. Please check your email for OTP code.'),
            developmentOtp: result.developmentOtp,
            fromRegistration: true,
            afterLogin,
          },
        });
      } else {
        // Backend Error Handling
        if (result.code === 1005) {
          setFieldErrors((prev) => ({
            ...prev,
            username: result.message || bilingualLabel('Tên đăng nhập đã được sử dụng', 'Username is already taken'),
          }));
        } else if (result.code === 1006) {
          setFieldErrors((prev) => ({
            ...prev,
            email: result.message || bilingualLabel('Email đã được sử dụng', 'Email is already in use'),
          }));
        } else if (
          result.message &&
          (result.message.toLowerCase().includes('email') || result.message.toLowerCase().includes('mail'))
        ) {
          setFieldErrors((prev) => ({ ...prev, email: result.message }));
        } else if (
          result.message &&
          (result.message.toLowerCase().includes('mật khẩu') || result.message.toLowerCase().includes('password'))
        ) {
          setFieldErrors((prev) => ({ ...prev, password: result.message }));
        } else if (
          result.message &&
          (result.message.toLowerCase().includes('username') || result.message.toLowerCase().includes('tên đăng nhập'))
        ) {
          setFieldErrors((prev) => ({ ...prev, username: result.message }));
        } else {
          setError(result.message || bilingualLabel('Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.', 'Registration failed. Please check your details.'));
        }
      }
    } catch {
      setError(bilingualLabel('Đã xảy ra lỗi kết nối với máy chủ. Vui lòng thử lại sau.', 'Server connection error. Please try again later.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeRegistration();
  };

  return (
    <div className="auth-container">
      {/* Left Panel */}
      <div className="auth-left-panel">
        <AuthHeader />

        <main className="auth-left-content">
          {/* Heading */}
          <h1 className="auth-heading" style={{ marginBottom: 'clamp(16px, 2.5vh, 24px)' }}>
            <BilingualText vi="Đăng ký" en="Register" />
          </h1>
          <p className="auth-subtitle">
            <BilingualText
              vi="Tạo tài khoản và xác minh email trước. Sau khi đăng nhập, bạn sẽ thiết lập lộ trình học phù hợp."
              en="Create your account and verify your email first. After signing in, you will set up your personalized learning path."
            />
          </p>

          {/* General Error Banner */}
          {error && (
            <div className="auth-message auth-message-error" role="alert" aria-live="assertive">
              <BilingualText>{error}</BilingualText>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate aria-busy={loading}>
              <div className="auth-register-grid">
                {/* Username */}
                <div className="auth-field">
                  <label className="auth-label" htmlFor="username">
                    <BilingualText vi="Tên đăng nhập" en="Username" /><em>*</em>
                  </label>
                  <input
                    id="username"
                    className={`auth-input ${fieldErrors.username ? 'auth-input-error' : ''}`}
                    type="text"
                    placeholder="david2026"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: '' }));
                    }}
                    required
                  />
                  {fieldErrors.username && (
                    <span className="auth-field-error"><AlertCircle size={13} className="shrink-0 inline mr-1" /><BilingualText>{fieldErrors.username}</BilingualText></span>
                  )}
                </div>

                {/* Full Name */}
                <div className="auth-field">
                  <label className="auth-label" htmlFor="fullName">
                    <BilingualText vi="Họ và tên" en="Full Name" /><em>*</em>
                  </label>
                  <input
                    id="fullName"
                    className={`auth-input ${fieldErrors.fullName ? 'auth-input-error' : ''}`}
                    type="text"
                    placeholder="David Miller"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    required
                  />
                  {fieldErrors.fullName && (
                    <span className="auth-field-error"><AlertCircle size={13} className="shrink-0 inline mr-1" /><BilingualText>{fieldErrors.fullName}</BilingualText></span>
                  )}
                </div>

                {/* Email */}
                <div className="auth-field">
                  <label className="auth-label" htmlFor="email">
                    <BilingualText vi="Email" en="Email" /><em>*</em>
                  </label>
                  <input
                    id="email"
                    className={`auth-input ${fieldErrors.email ? 'auth-input-error' : ''}`}
                    type="email"
                    placeholder="david@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    required
                  />
                  {fieldErrors.email && (
                    <span className="auth-field-error"><AlertCircle size={13} className="shrink-0 inline mr-1" /><BilingualText>{fieldErrors.email}</BilingualText></span>
                  )}
                </div>

                {/* Phone Number */}
                <div className="auth-field">
                  <label className="auth-label" htmlFor="phoneNumber">
                    <BilingualText vi="Số điện thoại" en="Phone Number" />
                    <span className="auth-optional"><BilingualText vi="Tùy chọn" en="Optional" /></span>
                  </label>
                  <input
                    id="phoneNumber"
                    className="auth-input"
                    type="tel"
                    placeholder="0912345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="auth-field">
                  <label className="auth-label" htmlFor="password">
                    <BilingualText vi="Mật khẩu" en="Password" /><em>*</em>
                  </label>
                  <div className="auth-password-row">
                    <input
                      id="password"
                      className={`auth-input auth-password-input ${fieldErrors.password ? 'auth-input-error' : ''}`}
                      type={showPassword ? 'text' : 'password'}
                      placeholder={bilingualLabel("Tối thiểu 6 ký tự")}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="auth-show-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? bilingualLabel('Ẩn mật khẩu', 'Hide password') : bilingualLabel('Hiện mật khẩu', 'Show password')}
                      title={showPassword ? bilingualLabel('Ẩn mật khẩu', 'Hide password') : bilingualLabel('Hiện mật khẩu', 'Show password')}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <span className="auth-field-error"><AlertCircle size={13} className="shrink-0 inline mr-1" /><BilingualText>{fieldErrors.password}</BilingualText></span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="auth-field">
                  <label className="auth-label" htmlFor="confirmPassword">
                    <BilingualText vi="Xác nhận mật khẩu" en="Confirm Password" /><em>*</em>
                  </label>
                  <div className="auth-password-row">
                    <input
                      id="confirmPassword"
                      className={`auth-input auth-password-input ${fieldErrors.confirmPassword ? 'auth-input-error' : ''}`}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={bilingualLabel("Nhập lại mật khẩu", "Re-enter your password")}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="auth-show-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? bilingualLabel('Ẩn mật khẩu', 'Hide password') : bilingualLabel('Hiện mật khẩu', 'Show password')}
                      title={showConfirmPassword ? bilingualLabel('Ẩn mật khẩu', 'Hide password') : bilingualLabel('Hiện mật khẩu', 'Show password')}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <span className="auth-field-error"><AlertCircle size={13} className="shrink-0 inline mr-1" /><BilingualText>{fieldErrors.confirmPassword}</BilingualText></span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="auth-btn-row">
                <button
                  type="submit"
                  className="auth-btn auth-btn-primary"
                  disabled={loading}
                >
                  <BilingualText
                    vi={loading ? 'Đang tạo tài khoản…' : 'Đăng ký'}
                    en={loading ? 'Creating account…' : 'Create Account'}
                  />
                  <span aria-hidden="true">→</span>
                </button>
              </div>
          </form>

          {/* Footer link */}
          <p className="auth-footer-text">
            <BilingualText vi="Đã có tài khoản?" en="Already have an account?" />{' '}
            <Link to="/login" className="auth-footer-link">
              <BilingualText vi="Đăng nhập ngay" en="Sign in" />
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
