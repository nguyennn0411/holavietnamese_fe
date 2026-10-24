import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useState, useEffect } from 'react';
import { learnerService } from '@/services/learnerService';
import { Trophy } from 'lucide-react';
import { StarsBackground, CountingNumber, SpotlightCard, ShimmeringText } from '@/components/common/animate';

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
        setError(err.message || bilingualLabel('Không thể tải thành tích.', 'Unable to load achievements.'));
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

      {/* Overview Banner with subtle StarsBackground */}
      <div className="achieve-banner relative overflow-hidden">
        <StarsBackground className="opacity-40" starCount={35} />
        <div className="relative z-10">
          <span className="achieve-banner-subtitle"><BilingualText vi="BỘ SƯU TẬP DANH HIỆU" en="ACHIEVEMENT COLLECTION" /></span>
          <h2 className="achieve-banner-title">
            <BilingualText
              vi={<>Đã mở khóa <CountingNumber value={unlockedCount} /> / {data.badges.length} huy hiệu</>}
              en={<>Unlocked <CountingNumber value={unlockedCount} /> / {data.badges.length} badges</>}
            />
          </h2>
        </div>
        <Trophy size={40} className="text-[#FF7A00] relative z-10" />
      </div>

      {/* Badges Grid with SpotlightCard */}
      <h3 className="achieve-section-title"><BilingualText vi="Huy hiệu học tập" en="Learning Badges" /></h3>
      <div className="achieve-badge-grid">
        {data.badges.length === 0 ? (
          <div className="account-empty"><BilingualText vi="Chưa có huy hiệu nào trong hệ thống." en="No badges available in the system." /></div>
        ) : (
          data.badges.map((badge) => (
            <SpotlightCard
              key={badge.id}
              className={`achieve-badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
              maxTilt={4}
            >
              <div className="achieve-badge-icon">
                {badge.unlocked ? <BilingualText vi="ĐẠT" en="EARNED" /> : <BilingualText vi="CHƯA" en="LOCKED" />}
              </div>
              <div className="achieve-badge-info">
                {badge.unlocked ? (
                  <strong className="block"><ShimmeringText text={badge.name || badge.title} /></strong>
                ) : (
                  <strong>{badge.name || badge.title}</strong>
                )}
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
            </SpotlightCard>
          ))
        )}
      </div>

    </div>
  );
}

export default AchievementsPage;
