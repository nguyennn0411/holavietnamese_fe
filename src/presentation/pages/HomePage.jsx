import { useAuth } from '@/application/context/AuthContext';
import { DongSonDrum } from '@/presentation/components/DongSonDrum';
import '@/presentation/styles/home.css';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="home-hero">
        <div className="home-hero-inner">
          {/* Left: Heading + CTA */}
          <div className="home-hero-left">
            <div className="home-pill">
              <span>👋</span> YOUR VIETNAMESE ERA STARTS HERE
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
              <button className="home-btn-start">Start learning ↗</button>
              <button className="home-btn-demo">Jump into demo</button>
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
                <button className="home-play-btn">▶</button>
              </div>

              <div className="home-stats-row">
                <div className="home-stat">
                  <span className="home-stat-number">24</span>
                  <span className="home-stat-label">WORDS</span>
                </div>
                <div className="home-stat">
                  <span className="home-stat-number">3</span>
                  <span className="home-stat-label">LESSONS</span>
                </div>
                <div className="home-stat">
                  <span className="home-stat-number">4 🔥</span>
                  <span className="home-stat-label">STREAK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
