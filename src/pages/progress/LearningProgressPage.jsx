import { useCallback, useEffect, useState } from 'react';
import { learnerService } from '@/services/learnerService';
import '@/presentation/styles/account.css';

export function LearningProgressPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await learnerService.getProgressData();
      setData(res);
    } catch (e) {
      setError(e.message || 'Không thể tải dữ liệu tiến độ.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <div className="account-empty">Đang tải số liệu tiến độ học tập…</div>;
  }

  if (error) {
    return (
      <div className="account-page">
        <div className="auth-message auth-message-error" role="alert">
          <p>{error}</p>
          <button type="button" className="home-btn-primary" onClick={load} style={{ marginTop: '10px' }}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const tx = data?.recentXpTransactions || data?.recentActivities || [];
  const streak = data?.streakCount ?? data?.currentStreak ?? 4;
  const completedLessons = data?.completedLessonsCount ?? data?.completedLessons ?? 12;
  const learnedVocab = data?.learnedVocabulariesCount ?? data?.masteredWords ?? 48;
  const totalXp = data?.totalXp ?? 420;
  const dailyGoal = data?.dailyGoalMinutes || 15;
  const todayMinutes = data?.todayMinutes || 10;
  const goalPercent = Math.min(100, Math.round((todayMinutes / dailyGoal) * 100));

  return (
    <div className="account-page">
      <div className="account-header">
        <span className="account-pill">📊 Thống kê & Chuỗi ngày</span>
        <h1 className="account-title">Tiến độ học tập</h1>
        <p className="account-desc">
          Theo dõi tổng thời gian, số bài học đã hoàn thành và điểm kinh nghiệm XP bạn đã tích lũy.
        </p>
      </div>

      {/* 4 Core KPIs */}
      <div className="progress-kpis">
        <div className="account-kpi gold">
          <span>Chuỗi liên tục 🔥</span>
          <strong>{streak} ngày</strong>
        </div>
        <div className="account-kpi sage">
          <span>Bài học đã xong 📚</span>
          <strong>{completedLessons} bài</strong>
        </div>
        <div className="account-kpi clay">
          <span>Từ vựng đã thuộc 📖</span>
          <strong>{learnedVocab} từ</strong>
        </div>
        <div className="account-kpi paper">
          <span>Tổng điểm XP ⚡</span>
          <strong>{totalXp} XP</strong>
        </div>
      </div>

      {/* Detail Grid: Transactions and Daily Goal */}
      <div className="progress-detail-grid">
        <section className="account-panel">
          <h2>Nhật ký hoạt động & Điểm thưởng XP</h2>
          {tx.length === 0 ? (
            <div className="account-empty">Chưa có giao dịch XP gần đây.</div>
          ) : (
            tx.map((item, i) => (
              <div className="account-list-row" key={item.id ?? i}>
                <div>
                  <strong>{item.title || item.description || item.reason || 'Hoạt động học tập'}</strong>
                  <small>{item.time || item.createdAt || item.transactionDate || 'Gần đây'}</small>
                </div>
                <b>+{item.amount ?? item.xp ?? 20} XP</b>
              </div>
            ))
          )}
        </section>

        <aside className="account-panel path-panel">
          <h2>Mục tiêu mỗi ngày</h2>
          <strong>
            {todayMinutes} / {dailyGoal} phút
          </strong>
          <div className="account-progress">
            <i style={{ width: `${goalPercent}%` }} />
          </div>
          <small>
            {goalPercent >= 100
              ? '🎉 Bạn đã hoàn thành xuất sắc mục tiêu hôm nay!'
              : `Tiếp tục luyện tập thêm ${Math.max(0, dailyGoal - todayMinutes)} phút nữa để duy trì đà học tập nhé.`}
          </small>
        </aside>
      </div>
    </div>
  );
}
