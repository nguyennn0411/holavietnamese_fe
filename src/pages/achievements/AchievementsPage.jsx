import { useState, useEffect } from 'react';
import { learnerService } from '@/services/learnerService';

export function AchievementsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    learnerService
      .getAchievements()
      .then((res) => {
        setData(
          Array.isArray(res)
            ? { badges: res, passportStamps: [] }
            : { badges: res?.badges ?? [], passportStamps: res?.passportStamps ?? [] }
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải thành tích.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="account-empty">Đang tải danh hiệu & thành tích…</div>;
  }

  if (error) {
    return (
      <div className="account-page">
        <div className="auth-message auth-message-error" role="alert">
          {error}
        </div>
      </div>
    );
  }

  const unlockedCount = data?.badges?.filter((b) => b.unlocked).length || 0;

  return (
    <div className="account-page">
      <div className="account-header">
        <span className="account-pill">🏆 Bộ sưu tập danh hiệu</span>
        <h1 className="account-title">Huy hiệu & Thành tích</h1>
        <p className="account-desc">
          Ghi nhận từng cột mốc nỗ lực trên hành trình khám phá ngôn ngữ và văn hóa Việt Nam.
        </p>
      </div>

      {/* Overview Banner */}
      <div className="achieve-banner">
        <div>
          <span className="achieve-banner-subtitle">BỘ SƯU TẬP DANH HIỆU</span>
          <h2 className="achieve-banner-title">
            Đã mở khóa {unlockedCount} / {data.badges.length} huy hiệu
          </h2>
        </div>
        <span className="achieve-banner-icon">🏆</span>
      </div>

      {/* Badges Grid */}
      <h3 className="achieve-section-title">Huy hiệu học tập</h3>
      <div className="achieve-badge-grid">
        {data.badges.length === 0 ? (
          <div className="account-empty">Chưa có huy hiệu nào trong hệ thống.</div>
        ) : (
          data.badges.map((badge) => (
            <div
              key={badge.id}
              className={`achieve-badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achieve-badge-icon">
                {badge.icon || (badge.unlocked ? '🏆' : '🔒')}
              </div>
              <div className="achieve-badge-info">
                <strong>{badge.name || badge.title}</strong>
                <p>{badge.description || badge.desc || badge.criteria}</p>
                {badge.unlocked ? (
                  <span className="achieve-badge-status">
                    ✓ Đã mở khóa {badge.unlockedAt ? `· ${badge.unlockedAt}` : ''}
                  </span>
                ) : (
                  <span className="achieve-badge-status locked">
                    🔒 {badge.conditionValue || 'Chưa đạt điều kiện'}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Passport Stamps Section */}
      <div className="achieve-passport-card">
        <div className="achieve-passport-header">
          <span className="achieve-passport-icon">🛂</span>
          <div>
            <h3>Hộ chiếu khám phá Việt Nam</h3>
            <p>
              Mỗi khi hoàn thành các bài học gắn liền với địa danh, bạn sẽ nhận được một con tem hộ chiếu đặc trưng!
            </p>
          </div>
        </div>

        <div className="achieve-stamp-grid">
          {data.passportStamps.length === 0 ? (
            <p className="account-desc">Chưa có dữ liệu hành trình.</p>
          ) : (
            data.passportStamps.map((stamp) => (
              <div
                key={stamp.id}
                className={`achieve-stamp-box ${stamp.unlocked ? 'unlocked' : ''}`}
              >
                <span className="achieve-stamp-city">{stamp.city}</span>
                <p className="achieve-stamp-name">{stamp.stamp}</p>
                {stamp.unlocked ? (
                  <span className="achieve-stamp-tag">
                    Đã đóng dấu ({stamp.date || 'Gần đây'})
                  </span>
                ) : (
                  <span className="achieve-stamp-tag locked">Chưa mở khóa</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
