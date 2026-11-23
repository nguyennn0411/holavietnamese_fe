import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { learnerService } from '@/features/learning/api/learnerService';
import { useAsyncResource } from '@/shared/hooks/useAsyncResource';
import { ResourceState } from '@/shared/components/common/ResourceState';
import { PageHeader, EmptyState } from '@/shared/components/common/Ui';
import { ProgressBar } from '@/shared/components/common/ProgressBar';
import { formatRelativeTime } from '@/constants/notifications';

function formatDayLabel(dayStr, isVi) {
  if (!dayStr) return '';
  if (isVi) return dayStr;
  const d = String(dayStr).trim().toUpperCase();
  if (d === 'T2' || d.includes('THỨ 2') || d === 'THU 2') return 'Mon';
  if (d === 'T3' || d.includes('THỨ 3') || d === 'THU 3') return 'Tue';
  if (d === 'T4' || d.includes('THỨ 4') || d === 'THU 4') return 'Wed';
  if (d === 'T5' || d.includes('THỨ 5') || d === 'THU 5') return 'Thu';
  if (d === 'T6' || d.includes('THỨ 6') || d === 'THU 6') return 'Fri';
  if (d === 'T7' || d.includes('THỨ 7') || d === 'THU 7') return 'Sat';
  if (d === 'CN' || d.includes('CHỦ NHẬT') || d === 'CHU NHAT') return 'Sun';
  return dayStr;
}

function formatProgressActivityTitle(item, isVi) {
  if (isVi) {
    return item.titleVi || item.title || item.description || item.reason || 'Hoạt động học tập';
  }
  if (item.titleEn) return item.titleEn;
  if (item.descriptionEn) return item.descriptionEn;
  const raw = String(item.title || item.description || item.reason || '').trim();
  if (/onboarding/i.test(raw)) {
    if (/khởi đầu|bắt đầu|initial|start/i.test(raw)) {
      return 'Completed initial onboarding';
    }
    return 'Completed onboarding';
  }
  if (/điểm danh|checkin|daily/i.test(raw)) {
    return 'Daily learning check-in';
  }
  if (/bài học|lesson/i.test(raw)) {
    return 'Completed a lesson';
  }
  if (/kiểm tra|quiz/i.test(raw)) {
    return 'Completed a quiz';
  }
  if (/từ vựng|vocab/i.test(raw)) {
    return 'Learned new vocabulary';
  }
  if (/vai|tình huống|giao tiếp|roleplay|ai/i.test(raw)) {
    return 'Completed AI conversation';
  }
  return raw || 'Learning activity';
}

export function LearningProgressPage() {
  const { i18n } = useTranslation();
  const isVi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('vi');
  const resource = useAsyncResource(useCallback(() => learnerService.getProgressData(), []));

  return (
    <section>
      <PageHeader
        eyebrow={<BilingualText vi="Từng bước nhỏ đều có ý nghĩa" en="Every small step counts" />}
        title={<BilingualText vi="Tiến độ học tập" en="Learning Progress" />}
        description={<BilingualText vi="Nhìn lại những điều bạn đã học và tìm nhịp học của riêng mình." en="Look back at what you've learned and discover your own study rhythm." />}
      />
      <ResourceState resource={resource}>
        {data => {
          const streak = data?.streakCount ?? data?.currentStreak ?? 0;
          const completed = data?.completedLessonsCount ?? data?.completedLessons ?? 0;
          const vocab = data?.learnedVocabulariesCount ?? data?.masteredWords ?? 0;
          const xp = data?.totalXp ?? 0;
          const goal = data?.dailyGoalMinutes || 15;
          const today = data?.todayMinutes || 10;
          const transactions = data?.recentXpTransactions || data?.recentActivities || [];
          const weekly = data?.weeklyActivity || [];
          const max = Math.max(...weekly.map(day => Number(day.minutes ?? day.value ?? 0)), goal);

          const kpis = [
            {
              label: <BilingualText vi="Thời gian học" en="Learning time" />,
              value: data.totalTimeMinutes != null
                ? (isVi ? `${data.totalTimeMinutes} phút` : `${data.totalTimeMinutes} ${data.totalTimeMinutes === 1 ? 'min' : 'mins'}`)
                : '—',
            },
            {
              label: <BilingualText vi="Bài học hoàn thành" en="Lessons completed" />,
              value: isVi ? `${completed} bài` : `${completed} ${completed === 1 ? 'lesson' : 'lessons'}`,
            },
            {
              label: <BilingualText vi="Từ vựng đã thuộc" en="Vocabulary mastered" />,
              value: isVi ? `${vocab} từ` : `${vocab} ${vocab === 1 ? 'word' : 'words'}`,
            },
            {
              label: <BilingualText vi="Chuỗi liên tục" en="Current streak" />,
              value: isVi ? `${streak} ngày` : `${streak} ${streak === 1 ? 'day' : 'days'}`,
            },
            {
              label: <BilingualText vi="Điểm kinh nghiệm" en="Experience points" />,
              value: `${xp} XP`,
            },
          ];

          return (
            <>
              <div className="progress-kpis">
                {kpis.map((kpi, idx) => (
                  <div className="account-kpi" key={idx}>
                    <span>{kpi.label}</span>
                    <strong>{kpi.value}</strong>
                  </div>
                ))}
              </div>
              <div className="progress-panels">
                <section className="card">
                  <h2><BilingualText vi="Nhịp học trong tuần" en="Your weekly learning rhythm" /></h2>
                  <p className="muted"><BilingualText vi="Một chút mỗi ngày, một chặng đường dài." en="A little each day goes a long way." /></p>
                  {weekly.length ? (
                    <div className="weekly-chart">
                      {weekly.map((day, index) => {
                        const dayMinutes = Number(day.minutes ?? day.value ?? 0);
                        return (
                          <div key={index}>
                            <span>{dayMinutes} {isVi ? 'phút' : 'minutes'}</span>
                            <i style={{ height: `${Math.max(4, Number(dayMinutes) / max * 140)}px` }} />
                            <small>{formatDayLabel(day.day || day.label || day.date, isVi)}</small>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState title={bilingualLabel("Chưa có dữ liệu học trong tuần", "No study data this week")} />
                  )}
                </section>
                <section className="card">
                  <h2><BilingualText vi="Mục tiêu hôm nay" en="Today's goal" /></h2>
                  <strong className="daily-minutes">{today}<small> / {goal} {isVi ? 'phút' : 'minutes'}</small></strong>
                  <ProgressBar value={Math.min(100, Math.round(today / goal * 100))} label={bilingualLabel("Mục tiêu mỗi ngày", "Daily goal")} />
                  <p className="muted">
                    <BilingualText
                      vi={today >= goal ? 'Bạn đã hoàn thành mục tiêu hôm nay.' : `Thêm ${Math.max(0, goal - today)} phút cho hành trình của bạn.`}
                      en={today >= goal ? 'You have reached today’s goal.' : `Add ${Math.max(0, goal - today)} minutes to your journey.`}
                    />
                  </p>
                  <Link className="text-link" to="/courses">
                    <BilingualText vi="Tiếp tục học →" en="Continue learning →" />
                  </Link>
                </section>
                <section className="card">
                  <h2><BilingualText vi="Tiến độ khóa học" en="Course progress" /></h2>
                  {data.enrolledCourses?.length ? (
                    data.enrolledCourses.map(course => (
                      <div className="progress-course" key={course.id}>
                        <Link to={`/courses/${course.id}`}>
                          <BilingualText vi={course.titleVi || course.title} en={course.titleEn || course.title} />
                        </Link>
                        <ProgressBar value={course.progress} label={bilingualLabel("Hoàn thành", "Completed")} />
                      </div>
                    ))
                  ) : (
                    <EmptyState title={bilingualLabel("Bắt đầu khóa học đầu tiên", "Start your first course")}>
                      <Link className="text-link" to="/courses">
                        <BilingualText vi="Khám phá khóa học →" en="Explore courses →" />
                      </Link>
                    </EmptyState>
                  )}
                </section>
                <section className="card">
                  <h2><BilingualText vi="Hoạt động gần đây" en="Recent activity" /></h2>
                  {transactions.length ? (
                    transactions.map((item, index) => {
                      const activityTitle = formatProgressActivityTitle(item, isVi);
                      const activityTime = item.time || (item.createdAt ? formatRelativeTime(item.createdAt, isVi ? 'vi' : 'en') : null) || item.transactionDate || (isVi ? 'Gần đây' : 'Recently');
                      return (
                        <div className="account-list-row" key={item.id ?? index}>
                          <div>
                            <strong>{activityTitle}</strong>
                            <small>{activityTime}</small>
                          </div>
                          <b>{item.amount ?? item.xp ?? 0} XP</b>
                        </div>
                      );
                    })
                  ) : (
                    <EmptyState title={bilingualLabel("Chưa có giao dịch XP gần đây", "No recent XP transactions")} />
                  )}
                </section>
              </div>
            </>
          );
        }}
      </ResourceState>
    </section>
  );
}
