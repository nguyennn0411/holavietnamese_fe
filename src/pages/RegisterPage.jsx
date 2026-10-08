import { AuthHeader } from '@/components/auth/AuthHeader';
import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import dongSonBg from '@/assets/images/dongson_auth_bg.png';

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
  const { register, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1 fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        // Backend returned code 1000 + auto-generated token
        // AuthContext automatically stored token & user info in localStorage & state
        navigate(result.user ? '/onboarding' : '/verify-email', {
          replace: true,
          state: {
            email: email.trim(),
            message: 'Đăng ký thành công! Hãy hoàn tất thiết lập tài khoản.',
          },
        });
      } else {
        // Backend Error Handling
        if (result.code === 1005) {
          // Trùng tên đăng nhập
          setStep(1);
          setFieldErrors((prev) => ({
            ...prev,
            username: result.message || 'Tên đăng nhập đã được sử dụng',
          }));
        } else if (result.code === 1006) {
          // Trùng Email
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
        <div className="auth-left-content">
          {/* Brand */}
          <AuthHeader />

          {/* Welcome pill */}
          <div className="auth-welcome-pill">
            <span className="auth-welcome-code">VN</span>
            <span className="auth-welcome-text">
              {step === 1 ? 'Tài khoản mới' : 'Lộ trình học'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="auth-heading">
            {step === 1 ? (
              <>
                Bắt đầu hành trình<br /><span>tiếng Việt</span>
              </>
            ) : (
              <>
                Cá nhân hóa<br /><span>lộ trình học</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="auth-subtitle">
            {step === 1
              ? 'Điền thông tin tài khoản để bắt đầu hành trình học tiếng Việt.'
              : 'Chọn ngôn ngữ và mục tiêu để Hola cá nhân hóa bài học cho bạn.'}
          </p>

          {/* Step indicator */}
          <div className="auth-step-indicator">
            <div className={`auth-step-item ${step >= 1 ? 'auth-step-item-active' : ''}`}><span>1</span><small>Tài khoản</small></div>
            <i className={step >= 2 ? 'active' : ''} />
            <div className={`auth-step-item ${step >= 2 ? 'auth-step-item-active' : ''}`}><span>2</span><small>Cá nhân hóa</small></div>
          </div>

          {/* General Error Banner */}
          {error && <div className="auth-message auth-message-error">{error}</div>}

          {/* Step 1 Form */}
          {step === 1 && (
            <form className="auth-form" onSubmit={handleNext} noValidate>
              {/* Username */}
              <div className="auth-field">
                <label className="auth-label" htmlFor="username">
                  Tên đăng nhập <em>*</em>
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
                  <span className="auth-field-error">⚠️ {fieldErrors.username}</span>
                )}
              </div>

              {/* Email */}
              <div className="auth-field">
                <label className="auth-label" htmlFor="email">
                  Email <em>*</em>
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
                  <span className="auth-field-error">⚠️ {fieldErrors.email}</span>
                )}
              </div>

              {/* Password */}
              <div className="auth-field">
                <label className="auth-label" htmlFor="password">
                  Mật khẩu <em>*</em>
                </label>
                <div className="auth-password-row">
                  <input
                    id="password"
                    className={`auth-input auth-password-input ${fieldErrors.password ? 'auth-input-error' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tối thiểu 6 ký tự"
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
                  >
                    {showPassword ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span className="auth-field-error">⚠️ {fieldErrors.password}</span>
                )}
              </div>

              {/* Full Name */}
              <div className="auth-field">
                <label className="auth-label" htmlFor="fullName">
                  Họ và tên <em>*</em>
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
                {fieldErrors.fullName && <span className="auth-field-error">⚠️ {fieldErrors.fullName}</span>}
              </div>

              {/* Phone Number */}
              <div className="auth-field">
                <label className="auth-label" htmlFor="phoneNumber">
                  Số điện thoại <span className="auth-optional">Không bắt buộc</span>
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

              {/* Primary Next Button (Full 2-step onboarding) */}
              <button
                type="submit"
                className="auth-btn auth-btn-primary"
                disabled={loading}
              >
                Tiếp tục <span aria-hidden="true">→</span>
              </button>

              {/* Quick Register Button (Cách 1: Rút gọn) */}
              <button
                type="button"
                className="auth-btn auth-btn-quick"
                onClick={handleQuickRegister}
                disabled={loading}
              >
                {loading ? 'Đang xử lý…' : 'Đăng ký nhanh, bỏ qua cá nhân hóa'}
              </button>
            </form>
          )}

          {/* Step 2 Form (Cá nhân hóa lộ trình học) */}
          {step === 2 && (
            <form className="auth-form" onSubmit={handleStep2Submit}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="nativeLanguage">
                  Ngôn ngữ mẹ đẻ <em>*</em>
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
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="learningGoal">
                  Mục tiêu học tiếng Việt <em>*</em>
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
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="targetLevel">
                  Trình độ muốn đạt <em>*</em>
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
                      {opt.label}
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
                  ← Quay lại
                </button>
                <button
                  type="submit"
                  className="auth-btn auth-btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Đang tạo tài khoản…' : 'Hoàn tất đăng ký'}
                </button>
              </div>
            </form>
          )}

          {/* Footer link */}
          <p className="auth-footer-text">
            Đã có tài khoản?{' '}
            <Link to="/login" className="auth-footer-link">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right-panel">
        <div className="auth-drum-bg">
          <img src={dongSonBg} alt="Hoa văn trống đồng Đông Sơn" className="auth-drum-img" />
        </div>
        <div className="auth-visual-topline"><span /> Khám phá ngôn ngữ · Kết nối văn hóa</div>
        <div className="auth-hero-card">
          <div className="auth-hero-tag">HOLA VIETNAMESE</div>
          <h2 className="auth-hero-title">Một lộ trình được thiết kế riêng cho bạn.</h2>
          <p className="auth-hero-desc">Cho chúng tôi biết mục tiêu của bạn. Hola sẽ biến mỗi buổi học thành một bước tiến vừa sức và đầy cảm hứng.</p>
          <div className="auth-proof-row">
            <div><strong>10+</strong><span>chủ đề thực tế</span></div>
            <div><strong>A1–B2</strong><span>lộ trình rõ ràng</span></div>
            <div><strong>24/7</strong><span>học mọi lúc</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
