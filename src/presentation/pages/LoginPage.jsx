import { useState, useEffect } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { DongSonDrum } from '@/presentation/components/DongSonDrum';
import '@/presentation/styles/auth.css';

export function LoginPage() {
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  if (isAuthenticated) {
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
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccount = () => {
    setEmail('alex@example.com');
    setPassword('demo123456');
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
            <span className="auth-brand-badge">ĐỒNG SƠN POP</span>
          </div>

          {/* Welcome Pill */}
          <div className="auth-welcome-pill">
            <span className="auth-welcome-code">VN</span>
            <span className="auth-welcome-text">Welcome back</span>
          </div>

          {/* Heading */}
          <h1 className="auth-heading">
            Continue your<br />
            Vietnamese<br />
            journey
          </h1>

          {/* Subtitle */}
          <p className="auth-subtitle">
            Sign in to return to your saved demo progress.
          </p>

          {/* Messages */}
          {successMessage && (
            <div className="auth-message auth-message-success">{successMessage}</div>
          )}
          {error && (
            <div className="auth-message auth-message-error">{error}</div>
          )}

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="auth-input"
                type="text"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <div className="auth-password-row">
                <input
                  id="password"
                  className="auth-input auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-show-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="auth-options-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  className="auth-checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="auth-checkbox-text">Remember me</span>
              </label>
              <a href="#" className="auth-forgot-link">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <button
              type="button"
              className="auth-btn auth-btn-demo"
              onClick={handleDemoAccount}
            >
              Try demo account
            </button>
          </form>

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
          <div className="auth-hero-tag">LEARN VIETNAMESE • LIVE VIETNAM</div>
          <h2 className="auth-hero-title">Vietnamese for real life.</h2>
          <p className="auth-hero-desc">
            Short lessons, practical phrases and guided conversation practice for everyday moments in Vietnam.
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
