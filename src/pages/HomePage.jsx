import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { learnerService } from '@/services/learnerService';
import { DongSonDrum } from '@/presentation/components/DongSonDrum';
import dongSonBg from '@/assets/images/dongson_auth_bg.png';
import '@/presentation/styles/home.css';

export function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(null);
  const [dashboardError, setDashboardError] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      learnerService
        .getProgressData()
        .then(setProgress)
        .catch((error) => setDashboardError(error.message));
    }
  }, [isAuthenticated]);

  const handleSimulateAudio = () => {
    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Cho tôi một cà phê sữa đá');
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 1500);
    }
  };

  /* =====================================================================
     1. LOGGED-IN LEARNER DASHBOARD EXPERIENCE
     ===================================================================== */
  if (isAuthenticated) {
    const dailyGoal = progress?.dailyGoalMinutes || 15;
    const today = progress?.todayMinutes || 10;
    const goalPercent = Math.min(100, Math.round((today / dailyGoal) * 100));
    const streak = progress?.streakCount ?? progress?.currentStreak ?? 4;
    const totalXp = progress?.totalXp ?? 420;
    const currentLesson = progress?.currentLesson || {
      title: 'Order your first cà phê sữa đá ☕',
      courseTitle: 'Tiếng Việt Giao Tiếp Đời Sống A1',
      progressPercent: 65,
      phraseVi: 'Cho tôi một cà phê sữa đá.',
    };

    return (
      <div className="home-dashboard-wrapper">
        {/* Top greeting bar */}
        <header className="home-dash-header">
          <div className="home-dash-welcome">
            <span className="home-dash-pill">👋 Chào mừng trở lại</span>
            <h1 className="home-dash-title">
              Xin chào, <span>{user?.fullName || user?.username || 'Học viên'}</span>!
            </h1>
            <p className="home-dash-subtitle">
              Hôm nay là một ngày tuyệt vời để học thêm vài câu tiếng Việt thú vị.
            </p>
          </div>

          <div className="home-dash-badges">
            <div className="home-badge-chip home-badge-streak" title="Chuỗi ngày học liên tục">
              <span className="home-streak-flame">🔥</span>
              <div>
                <strong>{streak} ngày</strong>
                <small>Streak liên tục</small>
              </div>
            </div>
            <div className="home-badge-chip home-badge-xp" title="Điểm kinh nghiệm tích lũy">
              <span className="home-xp-icon">⚡</span>
              <div>
                <strong>{totalXp} XP</strong>
                <small>Kinh nghiệm</small>
              </div>
            </div>
          </div>
        </header>

        {dashboardError && (
          <div className="auth-message auth-message-error" role="alert">
            {dashboardError}
          </div>
        )}

        {/* Hero split: Continue Lesson & Daily Goal */}
        <div className="home-dash-hero-grid">
          {/* Main Card: Continue Learning */}
          <section className="home-dash-card home-dash-card--continue">
            <div className="home-card-drum-overlay" style={{ backgroundImage: `url(${dongSonBg})` }} />
            <div className="home-continue-tag">BÀI HỌC DỞ DANG</div>
            <span className="home-continue-course">{currentLesson.courseTitle}</span>
            <h2 className="home-continue-title">{currentLesson.title}</h2>
            <p className="home-continue-desc">
              Khẩu ngữ thực tế: <em>“{currentLesson.phraseVi || 'Cho tôi một cà phê sữa đá.'}”</em>
            </p>

            <div className="home-continue-progress-wrap">
              <div className="home-continue-progress-labels">
                <span>Tiến độ bài học</span>
                <strong>{currentLesson.progressPercent}%</strong>
              </div>
              <div className="home-continue-progress-bar">
                <div
                  className="home-continue-progress-fill"
                  style={{ width: `${currentLesson.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="home-continue-actions">
              <Link to="/my-learning" className="home-btn-primary">
                Tiếp tục học ngay →
              </Link>
              <Link to="/courses" className="home-btn-ghost">
                Xem khóa học khác
              </Link>
            </div>
          </section>

          {/* Goal & Milestone Tracker Card */}
          <aside className="home-dash-card home-dash-card--goal">
            <div className="home-goal-header">
              <span className="home-goal-tag">MỤC TIÊU HÔM NAY</span>
              <span className="home-goal-ratio">
                {today} / {dailyGoal} phút
              </span>
            </div>

            <div className="home-goal-ring-container">
              <div className="home-goal-circle" style={{ '--percent': `${goalPercent}%` }}>
                <div className="home-goal-circle-inner">
                  <strong>{goalPercent}%</strong>
                  <small>{today} phút</small>
                </div>
              </div>
            </div>

            <p className="home-goal-note">
              {goalPercent >= 100
                ? '🎉 Xuất sắc! Bạn đã hoàn thành mục tiêu ngày.'
                : `Còn ${Math.max(0, dailyGoal - today)} phút nữa để đạt mục tiêu và giữ vững chuỗi Streak!`}
            </p>

            <Link to="/progress" className="home-goal-link">
              Xem báo cáo tiến độ chi tiết ↗
            </Link>
          </aside>
        </div>

        {/* Quick Practice Shortcuts */}
        <section className="home-dash-quick-section">
          <div className="home-quick-header">
            <div>
              <h2 className="home-quick-title">Luyện tập nhanh hôm nay</h2>
              <p className="home-quick-desc">Dành 3-5 phút cho các hoạt động thực hành ngắn gọn.</p>
            </div>
          </div>

          <div className="home-quick-grid">
            <Link to="/vocabulary" className="home-quick-card">
              <div className="home-quick-icon home-quick-icon--vocab">📖</div>
              <div className="home-quick-info">
                <strong>Sổ tay từ vựng</strong>
                <p>{progress?.savedVocabCount || 48} từ vựng đã lưu để ôn tập</p>
              </div>
              <span className="home-quick-arrow">→</span>
            </Link>

            <Link to="/courses" className="home-quick-card">
              <div className="home-quick-icon home-quick-icon--audio">🎧</div>
              <div className="home-quick-info">
                <strong>Phát âm & Thanh điệu</strong>
                <p>Luyện 6 thanh điệu chuẩn người bản xứ</p>
              </div>
              <span className="home-quick-arrow">→</span>
            </Link>

            <Link to="/achievements" className="home-quick-card">
              <div className="home-quick-icon home-quick-icon--culture">🏮</div>
              <div className="home-quick-info">
                <strong>Hành trình Việt Nam</strong>
                <p>Khám phá văn hóa & tem du lịch</p>
              </div>
              <span className="home-quick-arrow">→</span>
            </Link>

            <Link to="/my-learning" className="home-quick-card">
              <div className="home-quick-icon home-quick-icon--ai">✦</div>
              <div className="home-quick-info">
                <strong>Hội thoại AI Tutor</strong>
                <p>Thực hành phản xạ với tình huống giả lập</p>
              </div>
              <span className="home-quick-arrow">→</span>
            </Link>
          </div>
        </section>

        {/* Recent activities overview */}
        <section className="home-dash-recent-section">
          <h3 className="home-recent-title">Hoạt động gần đây của bạn</h3>
          <div className="home-recent-list">
            {(progress?.recentActivities || [
              { id: 1, title: 'Hoàn thành bài học: Gọi cà phê sữa đá', xp: 50, time: '2 giờ trước' },
              { id: 2, title: 'Ôn tập 10 từ vựng: Chào hỏi hàng ngày', xp: 20, time: 'Hôm qua' },
              { id: 3, title: 'Đạt chuỗi học 4 ngày liên tiếp 🔥', xp: 30, time: 'Hôm qua' },
            ]).map((act) => (
              <div key={act.id} className="home-recent-item">
                <span className="home-recent-dot" />
                <div className="home-recent-info">
                  <strong>{act.title}</strong>
                  <small>{act.time}</small>
                </div>
                <span className="home-recent-xp">+{act.xp} XP</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  /* =====================================================================
     2. GUEST LANDING EXPERIENCE
     ===================================================================== */
  return (
    <div className="home-landing-wrapper">
      {/* ===== HERO SECTION ===== */}
      <section className="home-hero">
        <div className="home-hero-inner">
          {/* Left: Heading + CTA */}
          <div className="home-hero-left">
            <div className="home-pill">
              <span className="home-pill-badge">HỌC TIẾNG VIỆT THẬT VUI</span>
              <span>ĐỜI SỐNG · DU LỊCH · PHẢN XẠ</span>
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
              Bài học ngắn gọn, ngữ cảnh gần gũi và các tình huống giao tiếp đời thực
              tại Việt Nam. Giúp bạn tự tin nói tiếng Việt ngay từ ngày đầu tiên.
            </p>

            <div className="home-cta-row">
              <Link to="/register" className="home-btn-start">
                Bắt đầu học miễn phí ↗
              </Link>
              <Link to="/courses" className="home-btn-demo">
                Khám phá khóa học
              </Link>
            </div>

            <div className="home-chips">
              <span className="home-chip">⚡ 10 phút mỗi ngày</span>
              <span className="home-chip">🛵 Tình huống thực tế</span>
              <span className="home-chip">✦ Trợ lý AI bản xứ</span>
            </div>

            {/* Drum decoration */}
            <div className="home-drum-deco">
              <DongSonDrum style={{ width: '220px', height: '140px' }} />
            </div>
          </div>

          {/* Right: Today's Mission Interactive Preview Card */}
          <div className="home-hero-right">
            <div className="home-mission-card">
              <div className="home-mission-header">
                <span className="home-mission-label">NHIỆM VỤ ĐẦU TIÊN</span>
                <span className="home-mission-xp">+80 XP</span>
              </div>

              <h3 className="home-mission-title">
                Order your first cà phê sữa đá ☕
              </h3>

              <div className="home-mission-progress">
                <div className="home-mission-progress-bar" style={{ width: '65%' }} />
              </div>

              <div className="home-mission-phrase">
                <div className="home-phrase-text">
                  <p className="home-phrase-vi">Cho tôi một cà phê sữa đá.</p>
                  <p className="home-phrase-en">One iced milk coffee, please.</p>
                </div>
                <button
                  className={`home-play-btn ${isPlayingAudio ? 'is-playing' : ''}`}
                  type="button"
                  onClick={handleSimulateAudio}
                  title="Nghe phát âm mẫu"
                >
                  {isPlayingAudio ? '🔊' : '▶'}
                </button>
              </div>

              <div className="home-stats-row">
                <div className="home-stat">
                  <span className="home-stat-number">48+</span>
                  <span className="home-stat-label">TỪ VỰNG</span>
                </div>
                <div className="home-stat">
                  <span className="home-stat-number">12</span>
                  <span className="home-stat-label">BÀI HỌC A1</span>
                </div>
                <div className="home-stat">
                  <span className="home-stat-number">4 🔥</span>
                  <span className="home-stat-label">CHUỖI NGÀY</span>
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
              <p className="home-section-tag">HỌC TIẾNG VIỆT THEO CÁCH CỦA BẠN</p>
              <h2 className="home-section-heading">
                Ít lý thuyết sách vở.<br />
                Nhiều Việt Nam thực tế hơn.
              </h2>
            </div>
            <p className="home-section-subtitle">
              Chọn chủ đề bạn thích, luyện phát âm chuẩn ngữ điệu và áp dụng ngay trong đời sống hàng ngày.
            </p>
          </div>

          {/* Feature cards */}
          <div className="home-feature-grid">
            <div className="home-feature-card home-feature-card--reallife">
              <div className="home-feature-icon">🛵</div>
              <h3 className="home-feature-title">Tiếng Việt đời sống</h3>
              <p className="home-feature-desc">
                Tự tin đi cà phê cóc, trả giá ở chợ truyền thống, gọi xe công nghệ và trò chuyện thân mật với người địa phương.
              </p>
            </div>

            <div className="home-feature-card home-feature-card--micro">
              <div className="home-feature-icon">⚡</div>
              <h3 className="home-feature-title">Bài học vi mô (Micro-learning)</h3>
              <p className="home-feature-desc">
                Thiết kế thông minh chỉ từ 5 đến 10 phút, dễ dàng học trong giờ giải lao hay trên đường đi làm.
              </p>
            </div>

            <div className="home-feature-card home-feature-card--ai">
              <div className="home-feature-icon">✦</div>
              <h3 className="home-feature-title">Thực hành cùng AI Tutor</h3>
              <p className="home-feature-desc">
                Giả lập trò chuyện ngữ cảnh thực tế với gợi ý ngữ pháp và dịch nghĩa song ngữ tức thì.
              </p>
            </div>

            <div className="home-feature-card home-feature-card--remember">
              <div className="home-feature-icon">🏮</div>
              <h3 className="home-feature-title">Hành trình & Hộ chiếu văn hóa</h3>
              <p className="home-feature-desc">
                Mở khóa tem du lịch các thành phố Hà Nội, Đà Nẵng, Hội An, TP.HCM và tích lũy huy hiệu thành tích độc đáo.
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
            <h3 className="home-step-title">Chọn mục tiêu học</h3>
            <p className="home-step-desc">Ẩm thực, du lịch, công việc hay định cư.</p>
          </div>
          <div className="home-step-card">
            <span className="home-step-number">02</span>
            <h3 className="home-step-title">Luyện phản xạ tự nhiên</h3>
            <p className="home-step-desc">Học từ vựng song ngữ và nghe giọng chuẩn.</p>
          </div>
          <div className="home-step-card">
            <span className="home-step-number">03</span>
            <h3 className="home-step-title">Tự tin trò chuyện</h3>
            <p className="home-step-desc">Áp dụng ngay ngoài đời thực với người Việt.</p>
          </div>
        </div>
      </section>

      {/* ===== CALL TO ACTION BANNER ===== */}
      <section className="home-cta-banner">
        <div className="home-cta-banner-inner">
          <h2>Sẵn sàng bắt đầu hành trình tiếng Việt của bạn?</h2>
          <p>Tạo tài khoản miễn phí chỉ trong 30 giây và bắt đầu bài học đầu tiên hôm nay.</p>
          <Link to="/register" className="home-cta-banner-btn">
            Đăng ký học miễn phí →
          </Link>
        </div>
      </section>
    </div>
  );
}
