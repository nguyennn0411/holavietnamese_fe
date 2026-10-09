import { BilingualText } from '@/components/common/BilingualText';
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
    return <div className="account-empty"><BilingualText>{"Đang tải danh hiệu & thành tích…"}</BilingualText></div>;
  }

  if (error) {
    return (
      <div className="account-page">
        <div className="auth-message auth-message-error" role="alert">
          <BilingualText>{error}</BilingualText>
        </div>
      </div>
    );
  }

  const unlockedCount = data?.badges?.filter((b) => b.unlocked).length || 0;

  return (
    <div className="account-page">
      <div className="account-header">
        <span className="account-pill"><BilingualText>{"🏆 Bộ sưu tập danh hiệu"}</BilingualText></span>
        <h1 className="account-title"><BilingualText>{"Huy hiệu & Thành tích"}</BilingualText></h1>
        <p className="account-desc"><BilingualText>{"Ghi nhận từng cột mốc nỗ lực trên hành trình khám phá ngôn ngữ và văn hóa Việt Nam."}</BilingualText></p>
      </div>

      {/* Overview Banner */}
      <div className="achieve-banner">
        <div>
          <span className="achieve-banner-subtitle"><BilingualText>{"BỘ SƯU TẬP DANH HIỆU"}</BilingualText></span>
          <h2 className="achieve-banner-title"><BilingualText>{"Đã mở khóa"}</BilingualText>{unlockedCount} / {data.badges.length}<BilingualText>{"huy hiệu"}</BilingualText></h2>
        </div>
        <span className="achieve-banner-icon">🏆</span>
      </div>

      {/* Badges Grid */}
      <h3 className="achieve-section-title"><BilingualText>{"Huy hiệu học tập"}</BilingualText></h3>
      <div className="achieve-badge-grid">
        {data.badges.length === 0 ? (
          <div className="account-empty"><BilingualText>{"Chưa có huy hiệu nào trong hệ thống."}</BilingualText></div>
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
                  <span className="achieve-badge-status"><BilingualText>{"✓ Đã mở khóa"}</BilingualText>{badge.unlockedAt ? `· ${badge.unlockedAt}` : ''}
                  </span>
                ) : (
                  <span className="achieve-badge-status locked">
                    🔒 {badge.conditionValue || <BilingualText>Chưa đạt điều kiện</BilingualText>}
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
            <h3><BilingualText>{"Hộ chiếu khám phá Việt Nam"}</BilingualText></h3>
            <p><BilingualText>{"Mỗi khi hoàn thành các bài học gắn liền với địa danh, bạn sẽ nhận được một con tem hộ chiếu đặc trưng!"}</BilingualText></p>
          </div>
        </div>

        <div className="achieve-stamp-grid">
          {data.passportStamps.length === 0 ? (
            <p className="account-desc"><BilingualText>{"Chưa có dữ liệu hành trình."}</BilingualText></p>
          ) : (
            data.passportStamps.map((stamp) => (
              <div
                key={stamp.id}
                className={`achieve-stamp-box ${stamp.unlocked ? 'unlocked' : ''}`}
              >
                <span className="achieve-stamp-city">{stamp.city}</span>
                <p className="achieve-stamp-name">{stamp.stamp}</p>
                {stamp.unlocked ? (
                  <span className="achieve-stamp-tag"><BilingualText>{"Đã đóng dấu ("}</BilingualText>{stamp.date || <BilingualText>Gần đây</BilingualText>})
                  </span>
                ) : (
                  <span className="achieve-stamp-tag locked"><BilingualText>{"Chưa mở khóa"}</BilingualText></span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
