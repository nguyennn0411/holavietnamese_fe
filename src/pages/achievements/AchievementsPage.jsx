import { BilingualText } from '@/components/common/BilingualText';
import { useState, useEffect } from 'react';
import { learnerService } from '@/services/learnerService';
import { Trophy } from 'lucide-react';

export function AchievementsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    learnerService
      .getAchievements()
      .then((res) => {
        if (!active) return;
        setData({ badges: Array.isArray(res) ? res : res?.badges ?? [] });
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Không thể tải thành tích.');
        setLoading(false);
      });
    return () => { active = false; };
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
        <span className="account-pill"><BilingualText>{"Bộ sưu tập danh hiệu"}</BilingualText></span>
        <h1 className="account-title"><BilingualText>{"Huy hiệu & Thành tích"}</BilingualText></h1>
        <p className="account-desc"><BilingualText>{"Ghi nhận từng cột mốc nỗ lực trên hành trình khám phá ngôn ngữ và văn hóa Việt Nam."}</BilingualText></p>
      </div>

      {/* Overview Banner */}
      <div className="achieve-banner">
        <div>
          <span className="achieve-banner-subtitle"><BilingualText>{"BỘ SƯU TẬP DANH HIỆU"}</BilingualText></span>
          <h2 className="achieve-banner-title"><BilingualText>{"Đã mở khóa"}</BilingualText>{unlockedCount} / {data.badges.length}<BilingualText>{"huy hiệu"}</BilingualText></h2>
        </div>
        <Trophy size={40} className="text-[#FF7A00]" />
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
                {badge.unlocked ? 'ĐẠT' : 'CHƯA'}
              </div>
              <div className="achieve-badge-info">
                <strong>{badge.name || badge.title}</strong>
                <p>{badge.description || badge.desc || badge.criteria}</p>
                {badge.unlocked ? (
                  <span className="achieve-badge-status"><BilingualText>{"Đã mở khóa"}</BilingualText>{badge.unlockedAt ? `· ${badge.unlockedAt}` : ''}
                  </span>
                ) : (
                  <span className="achieve-badge-status locked">
                    {badge.conditionValue || <BilingualText>Chưa đạt điều kiện</BilingualText>}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
