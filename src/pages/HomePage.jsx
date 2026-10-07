import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { learnerService } from '@/services/learnerService';
import { DongSonDrum } from '@/presentation/components/DongSonDrum';
import '@/presentation/styles/home.css';

export function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      learnerService.getProgressData().then(setProgress).catch(() => setProgress(null));
    }
  }, [isAuthenticated]);

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="home-hero">
        <div className="home-hero-inner">
          {/* Left: Heading + CTA */}
          <div className="home-hero-left">
            <div className="home-pill">
              <span>👋</span> {isAuthenticated ? `CHÀO MỪNG TRỞ LẠI, ${user?.fullName || user?.username}!` : 'YOUR VIETNAMESE ERA STARTS HERE'}
            </div>

            <h1 className="home-heading">
              Speak{' '}
              <span className="home-heading-highlight">Vietnamese</span>
              <br />
              without the
              <br />
              textbook vibe.
            </h1>

            <p className="home-subtitle">
              Fast lessons, colorful practice and playful AI scenarios built
              for everyday life in Vietnam.
            </p>

            <div className="home-cta-row">
              <Link to="/courses" className="home-btn-start" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Start learning ↗
              </Link>
              <Link to="/my-learning" className="home-btn-demo" style={{ textDecoration: 'none', display: 'inline-block' }}>
                {isAuthenticated ? 'Góc học tập của tôi' : 'Jump into demo'}
              </Link>
            </div>

            <div className="home-chips">
              <span className="home-chip">⚡ 10-min missions</span>
              <span className="home-chip">🌍 Real-life phrases</span>
              <span className="home-chip">+ AI demo chat</span>
            </div>

            {/* Drum decoration */}
            <div className="home-drum-deco">
              <DongSonDrum style={{ width: '200px', height: '120px' }} />
            </div>
          </div>

          {/* Right: Today's Mission Card */}
          <div className="home-hero-right">
            <div className="home-mission-card">
              <div className="home-mission-header">
                <span className="home-mission-label">TODAY'S MISSION</span>
                <span className="home-mission-xp">+80 XP</span>
              </div>

              <h3 className="home-mission-title">
                Order your first cà phê sữa đá ☕
              </h3>

              <div className="home-mission-progress">
                <div
                  className="home-mission-progress-bar"
                  style={{ width: '65%' }}
                />
              </div>

              <div className="home-mission-phrase">
                <div className="home-phrase-text">
                  <p className="home-phrase-vi">Cho tôi một cà phê sữa đá.</p>
                  <p className="home-phrase-en">One iced milk coffee, please.</p>
                </div>
                <button className="home-play-btn" type="button">▶</button>
              </div>

              <div className="home-stats-row">
                <div className="home-stat">
                  <span className="home-stat-number">{progress?.masteredWords ?? '—'}</span>
                  <span className="home-stat-label">WORDS</span>
                </div>
                <div className="home-stat">
                  <span className="home-stat-number">{progress?.completedLessons ?? 0}</span>
                  <span className="home-stat-label">LESSONS</span>
                </div>
                <div className="home-stat">
                  <span className="home-stat-number">{progress?.currentStreak ?? '—'} 🔥</span>
                  <span className="home-stat-label">STREAK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOGGED-IN LEARNER DASHBOARD QUICK WIDGETS ===== */}
      {isAuthenticated && (
        <section style={{ background: '#f5f0e8', padding: '0 2rem 2.5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Continue Learning Card */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8B1A1A', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  BÀI HỌC DỞ DANG
                </span>
                <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>
                  {progress?.currentLesson?.progressPercent ?? 0}%
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
                {progress?.currentLesson?.title || 'Chọn bài học tiếp theo'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 16px 0' }}>
                {progress?.currentLesson?.courseTitle || 'Mở khóa học của bạn để tiếp tục'}
              </p>
              <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ height: '100%', width: `${progress?.currentLesson?.progressPercent ?? 0}%`, background: '#8B1A1A' }} />
              </div>
              <Link
                to="/courses"
                style={{
                  display: 'inline-block',
                  padding: '8px 18px',
                  borderRadius: '999px',
                  background: '#8B1A1A',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                Tiếp tục học ngay →
              </Link>
            </div>

            {/* Daily Goal & Quick Shortcuts */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    MỤC TIÊU HÔM NAY
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>
                    10 / 15 phút
                  </span>
                </div>
                <div style={{ height: '8px', background: '#fef3c7', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ height: '100%', width: '66%', background: '#d97706', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                  Lối tắt nhanh
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Link
                    to="/vocabulary"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#fdfaf5',
                      border: '1px solid #ded5cb',
                      color: '#2d1810',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    📖 Ôn từ vựng
                  </Link>
                  <Link
                    to="/achievements"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#fdfaf5',
                      border: '1px solid #ded5cb',
                      color: '#2d1810',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    🏮 Điểm đến hành trình
                  </Link>
                  <Link
                    to="/my-learning"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#fdfaf5',
                      border: '1px solid #ded5cb',
                      color: '#2d1810',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    💬 AI Tutor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== FEATURES SECTION ===== */}
      <section className="home-features">
        <div className="home-features-inner">
          <div className="home-features-header">
            <div>
              <p className="home-section-tag">LEARN YOUR WAY</p>
              <h2 className="home-section-heading">
                Less classroom.
                <br />
                More Vietnam.
              </h2>
            </div>
            <p className="home-section-subtitle">
              Pick a mission, practice it, then use it in a scenario.
            </p>
          </div>

          {/* Feature cards */}
          <div className="home-feature-grid">
            {/* Real-life Vietnamese – tall card */}
            <div className="home-feature-card home-feature-card--reallife">
              <div className="home-feature-icon">🛵</div>
              <h3 className="home-feature-title">Real-life Vietnamese</h3>
              <p className="home-feature-desc">
                Navigate cafés, streets, shops and conversations with phrases
                people actually use.
              </p>
            </div>

            {/* Micro lessons */}
            <div className="home-feature-card home-feature-card--micro">
              <div className="home-feature-icon">⚡</div>
              <h3 className="home-feature-title">Micro lessons</h3>
              <p className="home-feature-desc">
                Small wins designed for quick, focused practice.
              </p>
            </div>

            {/* AI practice */}
            <div className="home-feature-card home-feature-card--ai">
              <div className="home-feature-icon">✦</div>
              <h3 className="home-feature-title">AI practice</h3>
              <p className="home-feature-desc">
                Scripted demo scenarios with hints and English meaning when you
                need it.
              </p>
            </div>

            {/* Remember more – wide card */}
            <div className="home-feature-card home-feature-card--remember">
              <div className="home-feature-icon">🧠</div>
              <h3 className="home-feature-title">Remember more</h3>
              <p className="home-feature-desc">
                Save vocab, review flashcards and watch progress move.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STEPS SECTION ===== */}
      <section className="home-steps">
        <div className="home-steps-inner">
          <div className="home-step-card">
            <span className="home-step-number">01</span>
            <h3 className="home-step-title">Pick a mission</h3>
            <p className="home-step-desc">Cafe, greetings, directions</p>
          </div>
          <div className="home-step-card">
            <span className="home-step-number">02</span>
            <h3 className="home-step-title">Learn the phrase</h3>
            <p className="home-step-desc">Vietnamese + English meaning</p>
          </div>
          <div className="home-step-card">
            <span className="home-step-number">03</span>
            <h3 className="home-step-title">Try it for real</h3>
            <p className="home-step-desc">Practice in a guided scenario</p>
          </div>
        </div>
      </section>
    </div>
  );
}
