import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { DongSonDrum } from '@/presentation/components/DongSonDrum';
import '@/presentation/styles/auth.css';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ko', label: 'Korean' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'th', label: 'Thai' },
];

const GOAL_OPTIONS = [
  { value: 'travel', label: 'Travel' },
  { value: 'work', label: 'Work' },
  { value: 'exam_vsl', label: 'Exam / VSL' },
  { value: 'culture', label: 'Culture' },
];

const LEVEL_OPTIONS = [
  { value: 'A1', label: 'A1 – Beginner' },
  { value: 'A2', label: 'A2 – Elementary' },
  { value: 'B1', label: 'B1 – Intermediate' },
  { value: 'B2', label: 'B2 – Upper Intermediate' },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1 fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2 fields
  const [nativeLanguage, setNativeLanguage] = useState('en');
  const [learningGoal, setLearningGoal] = useState('travel');
  const [targetLevel, setTargetLevel] = useState('A1');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    setStep(2);
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        fullName,
        email,
        username,
        password,
        phone,
        nativeLanguage,
        learningGoal,
        targetLevel,
      };

      const result = await register(payload);
      if (result.success) {
        navigate('/login', { state: { message: 'Account created! Please sign in.' } });
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Panel */}
      <div className="auth-left-panel">
        <div className="auth-left-content">
          {/* Brand */}
          <div className="auth-brand-row">
            <div className="auth-brand-logo">
              <span className="auth-logo-text">H</span>
              <span className="auth-logo-star">★</span>
            </div>
            <span className="auth-brand-name">HolaVietnamese</span>
            <span className="auth-brand-badge">ĐỒNG SƠN POP</span>
          </div>

          {/* Welcome pill */}
          <div className="auth-welcome-pill">
            {step === 1 ? '✨ Get started' : '📝 Almost there'}
          </div>

          {/* Heading */}
          <h1 className="auth-heading">
            {step === 1 ? (
              <>Create your<br />account</>
            ) : (
              <>Personalize<br />your learning</>
            )}
          </h1>

          {/* Subtitle */}
          <p className="auth-subtitle">
            {step === 1
              ? 'Fill in your details to begin your Vietnamese learning journey.'
              : 'Help us tailor the experience to your goals.'}
          </p>

          {/* Step indicator */}
          <div className="auth-step-indicator">
            <span className={`auth-step-dot ${step === 1 ? 'auth-step-dot-active' : ''}`} />
            <span className={`auth-step-dot ${step === 2 ? 'auth-step-dot-active' : ''}`} />
          </div>

          {/* Error */}
          {error && (
            <div className="auth-message auth-message-error">{error}</div>
          )}

          {/* Step 1 Form */}
          {step === 1 && (
            <form className="auth-form" onSubmit={handleNext}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  className="auth-input"
                  type="text"
                  placeholder="Alex Nguyen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  className="auth-input"
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  className="auth-input"
                  type="text"
                  placeholder="alexnguyen"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="password">Password</label>
                <div className="auth-input-wrapper">
                  <input
                    id="password"
                    className="auth-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  className="auth-input"
                  type="tel"
                  placeholder="+84 912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <button type="submit" className="auth-btn auth-btn-primary">
                Next →
              </button>
            </form>
          )}

          {/* Step 2 Form */}
          {step === 2 && (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="nativeLanguage">Native Language</label>
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
                <label className="auth-label" htmlFor="learningGoal">Learning Goal</label>
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
                <label className="auth-label" htmlFor="targetLevel">Target Level</label>
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
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="auth-btn auth-btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating…' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          {/* Footer link */}
          <p className="auth-footer-text">
            Already have an account? <Link to="/login" className="auth-footer-link">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right-panel">
        <div className="auth-drum-bg">
          <DongSonDrum className="auth-drum-svg" />
        </div>

        <div className="auth-hero-card">
          <span className="auth-hero-tag">JOIN THOUSANDS OF LEARNERS</span>
          <h2 className="auth-hero-title">Start speaking Vietnamese today.</h2>
          <p className="auth-hero-desc">
            Join a growing community of learners mastering Vietnamese through
            structured lessons, real-life conversation practice, and AI-powered
            guidance — all in one place.
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
