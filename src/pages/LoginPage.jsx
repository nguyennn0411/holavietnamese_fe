import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Navigate, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthRightPanel } from '@/components/auth/AuthRightPanel';
import { onboardingService } from '@/features/onboarding/services/onboardingService';
import { Eye, EyeOff } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginWithGoogle, isAuthenticated, user } = useAuth();
  const googleBtnRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleButtonReady, setGoogleButtonReady] = useState(false);
  const [googleUnavailable, setGoogleUnavailable] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  // Google Sign-In callback
  const handleGoogleCallback = useCallback(async (response) => {
    setError('');
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle(response.credential);
      if (!result.success) {
        setError(result.message || 'Google sign-in failed.');
      } else {
        const loggedUser = result.user;
        const roles = loggedUser?.roles || [];
        if (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')) {
          navigate('/admin', { replace: true });
        } else {
          const completedGuestOnboarding = onboardingService.hasCompletedExperience();
          if (completedGuestOnboarding) {
            try {
              await onboardingService.syncGuestProgress();
            } catch {
              // Progress stays local and can be retried when connectivity returns.
            }
          }
          const from = location.state?.from || searchParams.get('from');
          navigate(from || (completedGuestOnboarding ? '/edtech/dashboard' : '/'), { replace: true });
        }
      }
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  }, [loginWithGoogle, navigate]);

  const gsiInitializedRef = useRef(false);

  // Initialize Google Identity Services safely (only once)
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || isAuthenticated || gsiInitializedRef.current) return;

    let intervalId = null;
    let timeoutId = null;

    const initGoogle = () => {
      if (window.google?.accounts?.id && !gsiInitializedRef.current) {
        gsiInitializedRef.current = true;
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
            auto_select: false,
            ux_mode: 'popup',
          });
          if (googleBtnRef.current) {
            googleBtnRef.current.replaceChildren();
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'pill',
              width: 380,
            });
            requestAnimationFrame(() => setGoogleButtonReady(Boolean(googleBtnRef.current?.childElementCount)));
          }
        } catch (err) {
          console.warn('GSI Initialization warning:', err);
          setGoogleUnavailable(true);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      intervalId = setInterval(() => {
        if (window.google?.accounts?.id) {
          if (intervalId) clearInterval(intervalId);
          initGoogle();
        }
      }, 100);
      timeoutId = setTimeout(() => {
        if (!gsiInitializedRef.current) {
          if (intervalId) clearInterval(intervalId);
          setGoogleUnavailable(true);
        }
      }, 8000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [GOOGLE_CLIENT_ID, isAuthenticated, handleGoogleCallback]);

  // If already authenticated, redirect by role
  if (isAuthenticated) {
    const roles = user?.roles || [];
    if (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || 'Login failed. Please try again.');
      } else {
        const loggedUser = result.user;
        const roles = loggedUser?.roles || [];
        if (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')) {
          navigate('/admin', { replace: true });
        } else {
          const completedGuestOnboarding = onboardingService.hasCompletedExperience();
          if (completedGuestOnboarding) {
            try {
              await onboardingService.syncGuestProgress();
            } catch {
              // Progress stays local and can be retried when connectivity returns.
            }
          }
          const from = location.state?.from || searchParams.get('from');
          navigate(from || (completedGuestOnboarding ? '/edtech/dashboard' : '/'), { replace: true });
        }
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container auth-login-page">
      {/* Left Panel */}
      <div className="auth-left-panel">
        <AuthHeader />

        <main className="auth-left-content">
          {/* Heading */}
          <h1 className="auth-heading">
            <BilingualText vi="Đăng nhập" en="Sign In" />
          </h1>

          {/* Subtitle */}
          <p className="auth-subtitle">
            <BilingualText
              vi="Tiếp tục hành trình học tiếng Việt của bạn."
              en="Continue your Vietnamese learning journey."
            />
          </p>

          {/* Error Message */}
          {error && (
            <div className="auth-message auth-message-error" role="alert" aria-live="assertive">
              <BilingualText>{error}</BilingualText>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="auth-message auth-message-success" role="status" aria-live="polite">
              <BilingualText>{successMessage}</BilingualText>
            </div>
          )}

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit} aria-busy={loading}>
            {/* Email Field */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-identity">
                <BilingualText vi="Email hoặc tên đăng nhập" en="Email or username" />
              </label>
              <input
                id="login-identity"
                className="auth-input"
                type="text"
                placeholder={bilingualLabel("Nhập email hoặc tên đăng nhập")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-password">
                <BilingualText vi="Mật khẩu" en="Password" />
              </label>
              <div className="auth-password-wrapper">
                <input
                  id="login-password"
                  className="auth-input auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-show-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="auth-options-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  className="auth-checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span><BilingualText vi="Ghi nhớ đăng nhập" en="Remember me" /></span>
              </label>
              <Link to="/forgot-password" className="auth-forgot-link">
                <BilingualText vi="Quên mật khẩu?" en="Forgot password?" />
              </Link>
            </div>

            {/* Primary Button */}
            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={loading}
            >
              <BilingualText
                vi={loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
                en={loading ? 'Signing in…' : 'Sign In'}
              />
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">
              <BilingualText vi="hoặc tiếp tục với" en="or continue with" />
            </span>
            <span className="auth-divider-line" />
          </div>

          {/* Google Sign-In Button */}
          <div className="auth-google-section">
            {GOOGLE_CLIENT_ID ? (
              <>
                <div ref={googleBtnRef} className={`auth-google-btn-container ${googleButtonReady ? 'is-ready' : ''}`} />
                {!googleButtonReady && (
                  <button type="button" className="auth-btn auth-btn-google auth-google-fallback" disabled>
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <BilingualText
                      vi={googleUnavailable ? 'Không thể tải đăng nhập Google' : 'Đang tải đăng nhập Google…'}
                      en={googleUnavailable ? 'Google sign-in unavailable' : 'Loading Google sign-in…'}
                    />
                  </button>
                )}
                {googleLoading && (
                  <p className="auth-google-loading">
                    <BilingualText vi="Đang đăng nhập với Google…" en="Signing in with Google…" />
                  </p>
                )}
              </>
            ) : (
              <button
                type="button"
                className="auth-btn auth-btn-google"
                disabled
                title="Set VITE_GOOGLE_CLIENT_ID in .env to enable"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <BilingualText vi="Đăng nhập với Google" en="Sign in with Google" />
              </button>
            )}
          </div>

          {/* Footer Link */}
          <p className="auth-footer-text">
            <BilingualText vi="Chưa có tài khoản?" en="Don't have an account?" />{' '}
            <Link to="/welcome" className="auth-footer-link">
              <BilingualText vi="Bắt đầu tại Welcome" en="Start at Welcome" />
            </Link>
            <span className="auth-footer-dot"> · </span>
            <Link to="/register" className="auth-footer-link">
              <BilingualText vi="Đăng ký tài khoản" en="Sign up" />
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
