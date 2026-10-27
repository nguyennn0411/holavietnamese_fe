import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthRightPanel } from '@/components/auth/AuthRightPanel';
import { useState } from 'react';
import { useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { savePendingVerificationEmail, savePostVerificationPath, startResendCooldown } from '@/features/auth/emailVerificationFlow';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'ko', label: '🇰🇷 Korean (한국어)' },
  { value: 'ja', label: '🇯🇵 Japanese (日本語)' },
  { value: 'zh', label: '🇨🇳 Chinese (中文)' },
  { value: 'fr', label: '🇫🇷 French (Français)' },
  { value: 'es', label: '🇪🇸 Spanish (Español)' },
  { value: 'de', label: '🇩🇪 German (Deutsch)' },
  { value: 'th', label: '🇹🇭 Thai (ไทย)' },
];

const GOAL_OPTIONS = [
  { value: 'daily_communication', labelVi: 'Giao tiếp hằng ngày', labelEn: 'Daily communication' },
  { value: 'travel', labelVi: 'Du lịch & Khám phá', labelEn: 'Travel & Exploration' },
  { value: 'work', labelVi: 'Công việc & Định cư', labelEn: 'Work & Career' },
  { value: 'exam_vsl', labelVi: 'Thi chứng chỉ VSL', labelEn: 'VSL Proficiency Exam' },
  { value: 'culture', labelVi: 'Văn hóa & Đời sống', labelEn: 'Culture & Daily Life' },
];

const LEVEL_OPTIONS = [
  { value: 'A1', labelVi: 'A1 – Người mới bắt đầu', labelEn: 'A1 – Beginner' },
  { value: 'A2', labelVi: 'A2 – Sơ cấp', labelEn: 'A2 – Elementary' },
  { value: 'B1', labelVi: 'B1 – Trung cấp', labelEn: 'B1 – Intermediate' },
  { value: 'B2', labelVi: 'B2 – Trung cấp nâng cao', labelEn: 'B2 – Upper Intermediate' },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
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

  // Step 2 fields
  const [nativeLanguage, setNativeLanguage] = useState('en');
  const [learningGoal, setLearningGoal] = useState('daily_communication');
  const [targetLevel, setTargetLevel] = useState('A1');

  // Field-specific validation and backend error state
  const [fieldErrors, setFieldErrors] = useState({});

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Client-side validation for Step 1 core fields
  const validateStep1 = () => {
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

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    if (!validateStep1()) return;
    setStep(2);
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  // Submit registration (supports both Cách 1 - Rút gọn and Cách 2 - Đầy đủ)
  const executeRegistration = async (isQuickMode = false) => {
    setError('');
    setFieldErrors({});

    if (!validateStep1()) {
      if (step !== 1) setStep(1);
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
        nativeLanguage: isQuickMode ? 'en' : nativeLanguage,
        learningGoal: isQuickMode ? 'daily_communication' : learningGoal,
        targetLevel: isQuickMode ? 'A1' : targetLevel,
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
          setStep(1);
          setFieldErrors((prev) => ({
            ...prev,
            username: result.message || bilingualLabel('Tên đăng nhập đã được sử dụng', 'Username is already taken'),
          }));
        } else if (result.code === 1006) {
          setStep(1);
          setFieldErrors((prev) => ({
            ...prev,
            email: result.message || bilingualLabel('Email đã được sử dụng', 'Email is already in use'),
          }));
        } else if (
          result.message &&
          (result.message.toLowerCase().includes('email') || result.message.toLowerCase().includes('mail'))
        ) {
          setStep(1);
          setFieldErrors((prev) => ({ ...prev, email: result.message }));
        } else if (
          result.message &&
          (result.message.toLowerCase().includes('mật khẩu') || result.message.toLowerCase().includes('password'))
        ) {
          setStep(1);
          setFieldErrors((prev) => ({ ...prev, password: result.message }));
        } else if (
          result.message &&
          (result.message.toLowerCase().includes('username') || result.message.toLowerCase().includes('tên đăng nhập'))
        ) {
          setStep(1);
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

  const handleStep2Submit = (e) => {
    e.preventDefault();
    executeRegistration(false);
  };

  const handleQuickRegister = (e) => {
    e.preventDefault();
    executeRegistration(true);
  };

  return (
    <div className="auth-container">
      {/* Left Panel */}
      <div className="auth-left-panel">
        <AuthHeader />

        <main className="auth-left-content">
          {/* Heading */}
          <h1 className="auth-heading" style={step === 1 ? { marginBottom: 'clamp(16px, 2.5vh, 24px)' } : undefined}>
            {step === 1 ? (
              <BilingualText vi="Đăng ký" en="Register" />
            ) : (
              <BilingualText vi="Cá nhân hóa lộ trình" en="Personalize Your Path" />
            )}
          </h1>

          {/* Subtitle */}
          {step === 2 && (
            <p className="auth-subtitle">
              <BilingualText
                vi="Chọn ngôn ngữ và mục tiêu để Hola cá nhân hóa bài học cho bạn."
                en="Select your language and goals so Hola can tailor your lessons."
              />
            </p>
          )}

          

          {/* General Error Banner */}
          {error && (
            <div className="auth-message auth-message-error" role="alert" aria-live="assertive">
              <BilingualText>{error}</BilingualText>
            </div>
          )}

          {/* Step 1 Form */}
          {step === 1 && (
            <form className="auth-form" onSubmit={handleNext} noValidate aria-busy={loading}>
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
                  <BilingualText vi="Tiếp tục" en="Continue" />
                  <span aria-hidden="true">→</span>
                </button>

                <button
                  type="button"
                  className="auth-btn auth-btn-quick"
                  onClick={handleQuickRegister}
                  disabled={loading}
                >
                  <BilingualText
                    vi={loading ? 'Đang xử lý…' : 'Đăng ký nhanh'}
                    en={loading ? 'Processing…' : 'Quick Register'}
                  />
                </button>
              </div>
            </form>
          )}

          {/* Step 2 Form (Cá nhân hóa lộ trình học) */}
          {step === 2 && (
            <form className="auth-form" onSubmit={handleStep2Submit} aria-busy={loading}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="nativeLanguage">
                  <BilingualText vi="Ngôn ngữ mẹ đẻ" en="Native Language" /><em>*</em>
                </label>
                <select
                  id="nativeLanguage"
                  className="auth-input auth-select"
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  required
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {bilingualLabel(opt.label)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="learningGoal">
                  <BilingualText vi="Mục tiêu học tiếng Việt" en="Learning Goal" /><em>*</em>
                </label>
                <select
                  id="learningGoal"
                  className="auth-input auth-select"
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  required
                >
                  {GOAL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {bilingualLabel(opt.labelVi, opt.labelEn)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="targetLevel">
                  <BilingualText vi="Trình độ muốn đạt" en="Target Level" /><em>*</em>
                </label>
                <select
                  id="targetLevel"
                  className="auth-input auth-select"
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  required
                >
                  {LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {bilingualLabel(opt.labelVi, opt.labelEn)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="auth-btn-group">
                <button
                  type="button"
                  className="auth-btn auth-btn-secondary"
                  onClick={handleBack}
                  disabled={loading}
                >
                  <BilingualText vi="← Quay lại" en="← Back" />
                </button>
                <button
                  type="submit"
                  className="auth-btn auth-btn-primary"
                  disabled={loading}
                >
                  <BilingualText
                    vi={loading ? 'Đang tạo tài khoản…' : 'Hoàn tất đăng ký'}
                    en={loading ? 'Creating account…' : 'Complete Registration'}
                  />
                </button>
              </div>
            </form>
          )}

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
