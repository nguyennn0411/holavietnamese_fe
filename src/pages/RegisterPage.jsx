import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthRightPanel } from '@/components/auth/AuthRightPanel';
import { useState } from 'react';
import { useNavigate, Navigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { onboardingService } from '@/features/onboarding/services/onboardingService';
import { Eye, EyeOff } from 'lucide-react';

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
  { value: 'travel', label: '🛵 Du lịch & Khám phá (Travel)' },
  { value: 'work', label: '💼 Công việc & Định cư (Work & Career)' },
  { value: 'exam_vsl', label: '🎓 Thi chứng chỉ VSL (Exam / VSL)' },
  { value: 'culture', label: '🏮 Văn hóa & Đời sống (Culture)' },
];

const LEVEL_OPTIONS = [
  { value: 'A1', label: '🌱 A1 – Người mới bắt đầu (Beginner)' },
  { value: 'A2', label: '🌿 A2 – Sơ cấp (Elementary)' },
  { value: 'B1', label: '🌳 B1 – Trung cấp (Intermediate)' },
  { value: 'B2', label: '🚀 B2 – Trung cấp nâng cao (Upper Intermediate)' },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromOnboarding = searchParams.get('source') === 'onboarding';
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
  const [learningGoal, setLearningGoal] = useState('travel');
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
      errors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (trimmedUsername.length < 3) {
      errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = 'Vui lòng nhập địa chỉ email';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Email không đúng định dạng (VD: alex@example.com)';
    }

    if (!password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
    }

    if (!fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên';
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
        phoneNumber: phoneNumber.trim() || undefined,
        nativeLanguage: isQuickMode ? 'en' : nativeLanguage,
        learningGoal: isQuickMode ? 'travel' : learningGoal,
        targetLevel: isQuickMode ? 'A1' : targetLevel,
      };

      const result = await register(payload);

      if (result.success) {
        const completedGuestOnboarding = onboardingService.hasCompletedExperience();
        if (result.user && completedGuestOnboarding) {
          try {
            await onboardingService.syncGuestProgress();
          } catch {
            // Progress stays local and can be retried when connectivity returns.
          }
        }
        navigate(result.user ? (completedGuestOnboarding ? '/edtech/dashboard' : '/onboarding/reason') : '/verify-email', {
          replace: true,
          state: {
            email: email.trim(),
            message: 'Đăng ký thành công! Hãy hoàn tất thiết lập tài khoản.',
          },
        });
      } else {
        // Backend Error Handling
        if (result.code === 1005) {
          setStep(1);
          setFieldErrors((prev) => ({
            ...prev,
            username: result.message || 'Tên đăng nhập đã được sử dụng',
          }));
        } else if (result.code === 1006) {
          setStep(1);
          setFieldErrors((prev) => ({
            ...prev,
            email: result.message || 'Email đã được sử dụng',
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
          setError(result.message || 'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.');
        }
      }
    } catch {
      setError('Đã xảy ra lỗi kết nối với máy chủ. Vui lòng thử lại sau.');
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
          <h1 className="auth-heading">
            {step === 1 ? (
              <BilingualText vi="Tạo tài khoản" en="Create Account" />
            ) : (
              <BilingualText vi="Cá nhân hóa lộ trình" en="Personalize Your Path" />
            )}
          </h1>

          {/* Subtitle */}
          <p className="auth-subtitle">
            {step === 1 ? (
              <BilingualText
                vi="Bắt đầu học tiếng Việt cùng HolaVietnamese."
                en="Start learning Vietnamese with HolaVietnamese."
              />
            ) : (
              <BilingualText
                vi="Chọn ngôn ngữ và mục tiêu để Hola cá nhân hóa bài học cho bạn."
                en="Select your language and goals so Hola can tailor your lessons."
              />
            )}
          </p>

          {/* Step indicator */}
          <div className="auth-step-indicator">
            <div className={`auth-step-item ${step >= 1 ? 'auth-step-item-active' : ''}`}>
              <span>1</span>
              <small><BilingualText vi="Tài khoản" en="Account" /></small>
            </div>
            <i className={step >= 2 ? 'active' : ''} />
            <div className={`auth-step-item ${step >= 2 ? 'auth-step-item-active' : ''}`}>
              <span>2</span>
              <small><BilingualText vi="Lộ trình" en="Path" /></small>
            </div>
          </div>

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
                    <span className="auth-field-error">⚠️ <BilingualText>{fieldErrors.username}</BilingualText></span>
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
                    <span className="auth-field-error">⚠️ <BilingualText>{fieldErrors.fullName}</BilingualText></span>
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
                    <span className="auth-field-error">⚠️ <BilingualText>{fieldErrors.email}</BilingualText></span>
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
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <span className="auth-field-error">⚠️ <BilingualText>{fieldErrors.password}</BilingualText></span>
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
                      placeholder={bilingualLabel("Nhập lại mật khẩu")}
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
                      aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <span className="auth-field-error">⚠️ <BilingualText>{fieldErrors.confirmPassword}</BilingualText></span>
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
                      {bilingualLabel(opt.label)}
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
                      {bilingualLabel(opt.label)}
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
