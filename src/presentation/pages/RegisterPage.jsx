import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ko', label: '한국어 (Korean)' },
  { value: 'ja', label: '日本語 (Japanese)' },
  { value: 'zh', label: '中文 (Chinese)' },
  { value: 'fr', label: 'Français (French)' },
  { value: 'es', label: 'Español (Spanish)' },
  { value: 'de', label: 'Deutsch (German)' },
  { value: 'th', label: 'ไทย (Thai)' },
];

const GOAL_OPTIONS = [
  { value: 'travel', label: '✈️ Travel & explore Vietnam' },
  { value: 'work', label: '💼 Work & business' },
  { value: 'exam_vsl', label: '📝 Vietnamese proficiency exam' },
  { value: 'culture', label: '🎭 Culture & daily life' },
];

const LEVEL_OPTIONS = [
  { value: 'A1', label: 'A1 – Beginner' },
  { value: 'A2', label: 'A2 – Elementary' },
  { value: 'B1', label: 'B1 – Intermediate' },
  { value: 'B2', label: 'B2 – Upper Intermediate' },
];

export function RegisterPage() {
  const [step, setStep] = useState(1); // 1: account info, 2: learning preferences
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    nativeLanguage: 'en',
    learningGoal: 'travel',
    targetLevel: 'A1',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.email || !formData.fullName) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await register(formData);

    setIsLoading(false);

    if (result.success) {
      navigate('/login', { state: { message: 'Account created successfully! Please sign in.' } });
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* LEFT PANEL */}
      <div style={styles.leftPanel}>
        <div style={styles.formContainer}>
          {/* Brand */}
          <div style={styles.brandRow}>
            <div style={styles.logoCircle}>H</div>
            <span style={styles.brandName}>HolaVietnamese</span>
          </div>

          <h1 style={styles.heading}>
            {step === 1 ? 'Create your\naccount' : 'Set your\nlearning goals'}
          </h1>
          <p style={styles.subText}>
            {step === 1
              ? 'Start your Vietnamese learning journey today.'
              : 'Help us personalize your experience.'}
          </p>

          {/* Step indicator */}
          <div style={styles.stepRow}>
            <div style={{ ...styles.stepDot, backgroundColor: '#8B1A1A' }} />
            <div style={{ ...styles.stepDot, backgroundColor: step === 2 ? '#8B1A1A' : '#d1d5db' }} />
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          {step === 1 ? (
            <form onSubmit={handleNextStep} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text" name="fullName" value={formData.fullName}
                  onChange={handleChange} required placeholder="David Miller"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} required placeholder="david@example.com"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Username *</label>
                <input
                  type="text" name="username" value={formData.username}
                  onChange={handleChange} required placeholder="david2026"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password *</label>
                <div style={styles.passwordWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password" value={formData.password}
                    onChange={handleChange} required placeholder="Min 6 characters"
                    style={styles.passwordInput}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.showBtn}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="tel" name="phoneNumber" value={formData.phoneNumber}
                  onChange={handleChange} placeholder="0912345678"
                  style={styles.input}
                />
              </div>

              <button type="submit" style={styles.primaryBtn}>
                Next →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Your Native Language</label>
                <select
                  name="nativeLanguage" value={formData.nativeLanguage}
                  onChange={handleChange} style={styles.input}
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Why are you learning Vietnamese?</label>
                <select
                  name="learningGoal" value={formData.learningGoal}
                  onChange={handleChange} style={styles.input}
                >
                  {GOAL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Target Level</label>
                <select
                  name="targetLevel" value={formData.targetLevel}
                  onChange={handleChange} style={styles.input}
                >
                  {LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setStep(1)} style={styles.backBtn}>
                  ← Back
                </button>
                <button type="submit" disabled={isLoading} style={{
                  ...styles.primaryBtn,
                  flex: 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                }}>
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <p style={styles.bottomText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.signInLink}>Sign in</Link>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.rightPanel}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroCard}>
            <p style={styles.heroTag}>JOIN THOUSANDS OF LEARNERS</p>
            <h2 style={styles.heroTitle}>Start speaking Vietnamese today.</h2>
            <p style={styles.heroDesc}>
              Personalized lessons, real-life conversation practice, and AI-powered
              pronunciation feedback — all in one app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  leftPanel: {
    flex: '0 0 50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: '#ffffff',
    overflowY: 'auto',
  },
  formContainer: { width: '100%', maxWidth: '420px' },
  brandRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' },
  logoCircle: {
    width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#8B1A1A',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '1rem',
  },
  brandName: { fontWeight: '700', fontSize: '1.1rem', color: '#1f2937' },
  heading: {
    fontSize: '2rem', fontWeight: '800', lineHeight: '1.2', color: '#111827',
    margin: '0 0 0.5rem 0', whiteSpace: 'pre-line',
  },
  subText: { color: '#6b7280', fontSize: '0.9rem', margin: '0 0 1rem 0' },
  stepRow: { display: 'flex', gap: '6px', marginBottom: '1.5rem' },
  stepDot: { width: '32px', height: '4px', borderRadius: '2px', transition: 'background-color 0.3s' },
  errorBox: {
    backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem',
    borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#374151' },
  input: {
    padding: '0.65rem 0.85rem', border: '1px solid #d1d5db', borderRadius: '0.5rem',
    fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box',
    backgroundColor: '#fff',
  },
  passwordWrapper: {
    display: 'flex', border: '1px solid #d1d5db', borderRadius: '0.5rem', overflow: 'hidden',
  },
  passwordInput: {
    flex: 1, padding: '0.65rem 0.85rem', border: 'none', outline: 'none', fontSize: '0.9rem',
  },
  showBtn: {
    padding: '0 1rem', border: 'none', borderLeft: '1px solid #d1d5db',
    backgroundColor: '#f9fafb', color: '#374151', fontWeight: '600',
    fontSize: '0.8rem', cursor: 'pointer',
  },
  primaryBtn: {
    width: '100%', padding: '0.75rem', borderRadius: '999px', border: 'none',
    backgroundColor: '#8B1A1A', color: '#fff', fontWeight: '600', fontSize: '0.95rem',
    cursor: 'pointer', marginTop: '0.25rem',
  },
  backBtn: {
    padding: '0.75rem 1.5rem', borderRadius: '999px', border: '1px solid #d1d5db',
    backgroundColor: '#fff', color: '#374151', fontWeight: '600', fontSize: '0.9rem',
    cursor: 'pointer',
  },
  bottomText: { textAlign: 'center', color: '#6b7280', fontSize: '0.9rem', marginTop: '1.5rem' },
  signInLink: { color: '#8B1A1A', fontWeight: '600', textDecoration: 'none' },
  rightPanel: {
    flex: '0 0 50%',
    background: 'linear-gradient(135deg, #d4a574 0%, #c9956b 30%, #b8845f 60%, #a67553 100%)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    padding: '2rem', position: 'relative', overflow: 'hidden',
  },
  heroOverlay: { position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px', marginBottom: '3rem' },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '1rem', padding: '2rem',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },
  heroTag: {
    fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: '#d97706',
    margin: '0 0 0.5rem 0',
  },
  heroTitle: {
    fontSize: '1.75rem', fontWeight: '800', color: '#111827', margin: '0 0 0.75rem 0', lineHeight: '1.2',
  },
  heroDesc: {
    color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5', margin: '0',
  },
};
