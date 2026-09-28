import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';

export function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(formData.username, formData.password);

    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 600);
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* ===== LEFT PANEL: Form ===== */}
      <div style={styles.leftPanel}>
        <div style={styles.formContainer}>
          {/* Logo & brand */}
          <div style={styles.brandRow}>
            <div style={styles.logoCircle}>H</div>
            <span style={styles.brandName}>HolaVietnamese</span>
            <span style={styles.badge}>BỐNG SÌN POP</span>
          </div>

          {/* Welcome pill */}
          <div style={styles.welcomePill}>
            <span style={{ marginRight: '6px' }}>👋</span>Welcome back
          </div>

          {/* Heading */}
          <h1 style={styles.heading}>
            Continue your<br />Vietnamese<br />journey
          </h1>
          <p style={styles.subText}>
            Sign in to return to your saved demo progress.
          </p>

          {/* Error message */}
          {error && <div style={styles.errorBox}>{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email/Username */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder="alex@example.com"
                style={styles.input}
              />
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  style={styles.passwordInput}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.showBtn}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div style={styles.optionsRow}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                />
                Remember me
              </label>
              <a href="#" style={styles.forgotLink}>Forgot password?</a>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              style={{
                ...styles.signInBtn,
                backgroundColor: isSuccess ? '#16a34a' : (isLoading ? '#b08968' : '#8B1A1A'),
                cursor: (isLoading || isSuccess) ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Signing in...' : isSuccess ? '✓ Success!' : 'Sign in'}
            </button>

            {/* Try demo button */}
            <button
              type="button"
              style={styles.demoBtn}
              onClick={() => {
                setFormData({ username: 'learner', password: 'learner123' });
              }}
            >
              Try demo account
            </button>
          </form>

          {/* Bottom link */}
          <p style={styles.bottomText}>
            New here?{' '}
            <Link to="/register" style={styles.createLink}>Create an account</Link>
          </p>
        </div>
      </div>

      {/* ===== RIGHT PANEL: Hero ===== */}
      <div style={styles.rightPanel}>
        {/* Pattern background via CSS gradient */}
        <div style={styles.heroOverlay}>
          <div style={styles.heroCard}>
            <p style={styles.heroTag}>LEARN VIETNAMESE · LIVE VIETNAM</p>
            <h2 style={styles.heroTitle}>Vietnamese for real life.</h2>
            <p style={styles.heroDesc}>
              Short lessons, practical phrases and guided conversation practice
              for everyday moments in Vietnam.
            </p>
            <div style={styles.heroChips}>
              <span style={styles.chip}>Structured lessons</span>
              <span style={styles.chip}>Real-life practice</span>
              <span style={styles.chip}>AI assistance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================
   Inline styles matching mockup
   ============================ */
const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },

  /* --- LEFT --- */
  leftPanel: {
    flex: '0 0 50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: '#ffffff',
  },
  formContainer: {
    width: '100%',
    maxWidth: '420px',
  },

  /* Brand */
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '1.5rem',
  },
  logoCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#8B1A1A',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1rem',
  },
  brandName: {
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#1f2937',
  },
  badge: {
    backgroundColor: '#fee2e2',
    color: '#8B1A1A',
    padding: '2px 10px',
    borderRadius: '999px',
    fontSize: '0.7rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },

  /* Welcome pill */
  welcomePill: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#fef9c3',
    color: '#92400e',
    padding: '6px 14px',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginBottom: '1rem',
    border: '1px solid #fde68a',
  },

  /* Heading */
  heading: {
    fontSize: '2.25rem',
    fontWeight: '800',
    lineHeight: '1.15',
    color: '#111827',
    margin: '0 0 0.75rem 0',
  },
  subText: {
    color: '#6b7280',
    fontSize: '0.95rem',
    margin: '0 0 1.75rem 0',
  },

  /* Error */
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },

  /* Form */
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '0.7rem 0.85rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },

  /* Password */
  passwordWrapper: {
    display: 'flex',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    overflow: 'hidden',
  },
  passwordInput: {
    flex: 1,
    padding: '0.7rem 0.85rem',
    border: 'none',
    outline: 'none',
    fontSize: '0.95rem',
  },
  showBtn: {
    padding: '0 1rem',
    border: 'none',
    borderLeft: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    color: '#374151',
    fontWeight: '600',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },

  /* Options row */
  optionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '-0.25rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    color: '#374151',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#8B1A1A',
    width: '16px',
    height: '16px',
  },
  forgotLink: {
    fontSize: '0.85rem',
    color: '#8B1A1A',
    fontWeight: '600',
    textDecoration: 'none',
  },

  /* Buttons */
  signInBtn: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '999px',
    border: 'none',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.95rem',
    marginTop: '0.5rem',
    transition: 'background-color 0.2s',
  },
  demoBtn: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '999px',
    border: '2px solid #d97706',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  bottomText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '0.9rem',
    marginTop: '1.5rem',
  },
  createLink: {
    color: '#8B1A1A',
    fontWeight: '600',
    textDecoration: 'none',
  },

  /* --- RIGHT PANEL --- */
  rightPanel: {
    flex: '0 0 50%',
    background: 'linear-gradient(135deg, #d4a574 0%, #c9956b 30%, #b8845f 60%, #a67553 100%)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '480px',
    marginBottom: '3rem',
  },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },
  heroTag: {
    fontSize: '0.7rem',
    letterSpacing: '1px',
    fontWeight: '700',
    color: '#d97706',
    margin: '0 0 0.5rem 0',
  },
  heroTitle: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#111827',
    margin: '0 0 0.75rem 0',
    lineHeight: '1.2',
  },
  heroDesc: {
    color: '#6b7280',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    margin: '0 0 1.25rem 0',
  },
  heroChips: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  chip: {
    padding: '6px 14px',
    borderRadius: '999px',
    border: '1px solid #d1d5db',
    fontSize: '0.78rem',
    fontWeight: '500',
    color: '#374151',
    backgroundColor: '#ffffff',
  },
};
