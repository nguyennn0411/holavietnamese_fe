import { useState, useEffect, useRef, useCallback } from 'react';
import { Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { DongSonDrum } from '@/presentation/components/DongSonDrum';
import '@/presentation/styles/auth.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
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
        if (roles.includes('ADMIN') || loggedUser?.username === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  }, [loginWithGoogle, navigate]);

  // Initialize Google Identity Services
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || isAuthenticated) return;

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
          ux_mode: 'popup',
        });
        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            width: 380,
          });
        }
      }
    };

    // Google script may not be loaded yet
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGoogle();
        }
      }, 100);
      // Cleanup after 10 seconds
      setTimeout(() => clearInterval(interval), 10000);
    }
  }, [GOOGLE_CLIENT_ID, isAuthenticated, handleGoogleCallback]);

  // If already authenticated, redirect by role
  if (isAuthenticated) {
    const roles = user?.roles || [];
    if (roles.includes('ADMIN') || user?.username === 'admin') {
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
        if (roles.includes('ADMIN') || loggedUser?.username === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          const from = location.state?.from;
          navigate(from || '/', { replace: true });
        }
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLearner = () => {
    setEmail('learner');
    setPassword('learner123');
    setError('');
    setSuccessMessage('');
  };

  const handleDemoAdmin = () => {
    setEmail('admin');
    setPassword('admin123');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="auth-container">
      {/* Left Panel */}
      <div className="auth-left-panel">
        <div className="auth-left-content">
          {/* Brand Row */}
          <div className="auth-brand-row">
            <div className="auth-brand-logo">
              <span className="auth-logo-text">H</span>
              <span className="auth-logo-star">★</span>
            </div>
            <span className="auth-brand-name">HolaVietnamese</span>
            <span className="auth-brand-badge">ĐỐNG SƠN POP</span>
          </div>

          {/* Welcome Pill */}
          <div className="auth-welcome-pill">
            <span className="auth-welcome-code">👋</span>
            <span className="auth-welcome-text">Welcome back</span>
          </div>

          {/* Heading */}
          <h1 className="auth-heading">
            Continue your<br />Vietnamese<br />journey
          </h1>
          <p className="auth-subtitle">
            Sign in to return to your saved learning progress.
          </p>

          {/* Error Message */}
          {error && <div className="auth-message auth-message-error">{error}</div>}

          {/* Success Message */}
          {successMessage && (
            <div className="auth-message auth-message-success">
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="auth-field">
              <label className="auth-label">Tài khoản hoặc Email</label>
              <input
                className="auth-input"
                type="text"
                placeholder="learner hoặc admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div className="auth-field">
              <label className="auth-label">Mật khẩu</label>
              <div className="auth-password-wrapper">
                <input
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
                >
                  {showPassword ? 'Ẩn' : 'Hiện'}
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
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Primary Button */}
            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập…' : 'Sign in'}
            </button>

            {/* Demo Accounts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                className="auth-btn auth-btn-demo"
                onClick={handleDemoLearner}
                title="Tài khoản học viên mẫu (learner/learner123)"
                style={{ fontSize: '0.8rem', padding: '10px 4px' }}
              >
                🎒 Demo Learner
              </button>
              <button
                type="button"
                className="auth-btn auth-btn-demo"
                onClick={handleDemoAdmin}
                title="Tài khoản quản trị viên (admin/admin123)"
                style={{ fontSize: '0.8rem', padding: '10px 4px', borderColor: '#8B1A1A', color: '#8B1A1A' }}
              >
                🛡️ Demo Admin
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">or continue with</span>
            <span className="auth-divider-line" />
          </div>

          {/* Google Sign-In Button */}
          <div className="auth-google-section">
            {GOOGLE_CLIENT_ID ? (
              <>
                <div ref={googleBtnRef} className="auth-google-btn-container" />
                {googleLoading && (
                  <p className="auth-google-loading">Signing in with Google…</p>
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
                Sign in with Google
              </button>
            )}
          </div>

          {/* Footer Link */}
          <p className="auth-footer-text">
            New here?{' '}
            <Link to="/register" className="auth-footer-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right-panel">
        <div className="auth-drum-bg">
          <DongSonDrum className="auth-drum-svg" />
        </div>
        <div className="auth-hero-card">
          <div className="auth-hero-tag">LEARN VIETNAMESE · LIVE VIETNAM</div>
          <h2 className="auth-hero-title">Vietnamese for real life.</h2>
          <p className="auth-hero-desc">
            Short, colorful lessons focused on food, travel, and day-to-day
            conversations with locals.
          </p>
          <div className="auth-hero-chips">
            <span className="auth-chip">Structured lessons</span>
            <span className="auth-chip">Real-life practice</span>
            <span className="auth-chip">AI assistance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
