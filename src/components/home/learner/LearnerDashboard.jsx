import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, CircleAlert, Clock3, Play, RefreshCw, Target, Trophy, Volume2 } from 'lucide-react';
import { learnerService } from '@/services/learnerService';
import { WORD_OF_THE_DAY } from '@/components/home/data/homeData';
import { speakVietnamese } from '@/utils/speech';
import { LearnerHeroCarousel } from './LearnerHeroCarousel';
import { LearnerMotivationStrip } from './LearnerMotivationStrip';
import '@/presentation/styles/learner-dashboard.css';
import { BuffaloMascot, MascotOnboarding, MascotSpeechBubble } from '@/components/mascot';

const clampPercent = (value) => Math.min(100, Math.max(0, Number(value) || 0));

function DashboardSkeleton() {
  return (
    <div className="learner-dashboard learner-dashboard--loading" aria-label="Loading dashboard" aria-busy="true">
      <div className="ld-skeleton ld-skeleton--welcome" />
      <div className="ld-skeleton-grid">{[1, 2, 3, 4].map((item) => <div className="ld-skeleton" key={item} />)}</div>
      <div className="ld-skeleton ld-skeleton--main" />
    </div>
  );
}

function StatCard({ label, value, detail, tone }) {
  return (
    <article className={`ld-stat ld-stat--${tone}`}>
      <div><span>{label}</span><strong>{value ?? '—'}</strong><small>{detail}</small></div>
    </article>
  );
}

export function LearnerDashboard({ user }) {
  const { t } = useTranslation('learner');
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    learnerService.getProgressData()
      .then((data) => { if (active) setProgress(data || {}); })
      .catch((requestError) => { if (active) setError(requestError.message || t('dashboard.loadError')); });
    return () => { active = false; };
  }, [t]);

  const currentLesson = progress?.currentLesson;
  const lessonProgress = clampPercent(currentLesson?.progressPercent ?? currentLesson?.progress);
  const dailyGoal = Number(progress?.dailyGoalMinutes) || 0;
  const todayMinutes = Number(progress?.todayMinutes) || 0;
  const dailyPercent = dailyGoal ? clampPercent((todayMinutes / dailyGoal) * 100) : 0;
  const displayName = user?.fullName || user?.username || t('dashboard.learner');
  const lessonId = currentLesson?.lessonId ?? currentLesson?.id;
  const courseId = currentLesson?.courseId;
  const continueTo = courseId && lessonId ? `/learn/${courseId}/lesson/${lessonId}` : courseId ? `/learn/${courseId}` : '/edtech/dashboard';
  const activities = Array.isArray(progress?.recentActivities) ? progress.recentActivities : [];
  const quests = Array.isArray(progress?.dailyChallenges) ? progress.dailyChallenges : [];
  const leaderboard = Array.isArray(progress?.weeklyLeaderboard) ? progress.weeklyLeaderboard : [];

  const modules = useMemo(() => [
    { to: '/edtech/dashboard', title: 'Lộ trình học', text: 'Bản đồ bài học tương tác từng bước', tone: 'red' },
    { to: '/vocabulary', title: t('dashboard.modules.vocabulary'), text: t('dashboard.modules.vocabularyText'), tone: 'gold' },
    { to: '/courses', title: t('dashboard.modules.courses', { defaultValue: 'Khóa học' }), text: t('dashboard.modules.coursesText', { defaultValue: 'Danh mục khóa học đa dạng theo chủ đề' }), tone: 'blue' },
    { to: '/ai-tutor', title: t('dashboard.modules.practice'), text: t('dashboard.modules.practiceText'), tone: 'green' },
  ], [t]);

  if (!progress && !error) return <DashboardSkeleton />;

  const entrance = reduceMotion ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="learner-dashboard">
      <MascotOnboarding />
      {error && <div className="ld-alert" role="alert"><CircleAlert size={18} /><span>{error}</span></div>}

      <LearnerMotivationStrip continueTo={continueTo} />

      <LearnerHeroCarousel continueTo={continueTo} />

      <motion.header className="ld-welcome" {...entrance}>
        <div>
          <span className="ld-eyebrow">{t('dashboard.welcome')}</span>
          <h1>{t('dashboard.welcomeName', { name: displayName })}</h1>
          <p>{t('dashboard.welcomeSubtitle')}</p>
        </div>
        <Link to={continueTo} className="ld-button ld-button--primary"><Play size={16} fill="currentColor" />{currentLesson ? t('dashboard.continueLearning') : 'Xem lộ trình học'}</Link>
        <div className="ld-nghe"><MascotSpeechBubble>{currentLesson ? t('mascot.dashboard.continue') : t('mascot.dashboard.start')}</MascotSpeechBubble><BuffaloMascot variant={currentLesson ? 'encouraging' : 'teaching'} size="medium" animated accessibilityLabel={t('mascot.alt')} /></div>
      </motion.header>

      <motion.section className="ld-stats" aria-label={t('dashboard.progressOverview')} {...entrance} transition={{ delay: reduceMotion ? 0 : .05 }}>
        <StatCard tone="orange" label={t('dashboard.streak')} value={progress?.streakCount ?? progress?.currentStreak} detail={t('dashboard.days')} />
        <StatCard tone="gold" label={t('dashboard.totalXp')} value={progress?.totalXp} detail="XP" />
        <StatCard tone="green" label={t('dashboard.completedLessons')} value={progress?.completedLessons ?? progress?.lessonsCompleted} detail={t('dashboard.lessons')} />
        <StatCard tone="red" label={t('dashboard.learningProgress')} value={currentLesson ? `${Math.round(lessonProgress)}%` : null} detail={currentLesson ? t('dashboard.currentLesson') : t('dashboard.noData')} />
      </motion.section>

      <div className="ld-layout">
        <main className="ld-main-column">
          <motion.section className="ld-continue" {...entrance} transition={{ delay: reduceMotion ? 0 : .1 }}>
            <div className="ld-section-label"><span>{t('dashboard.continueSection')}</span><small>{currentLesson?.courseTitle || 'Lộ trình học của bạn'}</small></div>
            {currentLesson ? (
              <>
                <h2>{currentLesson.titleVi || currentLesson.title}</h2>
                <p>{currentLesson.description || t('dashboard.continueDescription')}</p>
                <div className="ld-progress-copy"><span>{t('dashboard.lessonProgress')}</span><strong>{Math.round(lessonProgress)}%</strong></div>
                <div className="ld-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(lessonProgress)}><span style={{ '--progress': `${lessonProgress}%` }} /></div>
                <div className="ld-continue__footer">
                  <span><Clock3 size={15} />{t('dashboard.resumeHint')}</span>
                  <Link to={continueTo} className="ld-button ld-button--primary">{t('dashboard.continueLearning')}<ArrowRight size={16} /></Link>
                </div>
              </>
            ) : (
              <div className="ld-empty">
                <h2>Lộ trình học tập cá nhân hóa</h2>
                <p>Khám phá bản đồ học tập tiếng Việt theo từng chặng, tích lũy XP và mở khóa các bài học tương tác tiếp theo.</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.25rem' }}>
                  <Link to="/edtech/dashboard" className="ld-button ld-button--primary">
                    Vào lộ trình học<ArrowRight size={16} />
                  </Link>
                  <Link to="/courses" className="ld-button" style={{ background: '#f5efe6', color: '#EA580C', border: '1px solid #ebdccb' }}>
                    {t('dashboard.exploreCourses')}<ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </motion.section>

          <motion.section className="ld-section" {...entrance} transition={{ delay: reduceMotion ? 0 : .15 }}>
            <div className="ld-heading"><div><span>{t('dashboard.quickAccess')}</span><h2>{t('dashboard.learningModules')}</h2></div><Link to="/courses">{t('dashboard.viewAll')}<ArrowRight size={14} /></Link></div>
            <div className="ld-modules">{modules.map((module) => <Link key={module.to} to={module.to} className={`ld-module ld-module--${module.tone}`}><div><h3>{module.title}</h3><p>{module.text}</p></div><ArrowRight size={16} /></Link>)}</div>
          </motion.section>

          <motion.section className="ld-card ld-activity" {...entrance} transition={{ delay: reduceMotion ? 0 : .2 }}>
            <div className="ld-heading"><div><span>{t('dashboard.history')}</span><h2>{t('dashboard.recentActivity')}</h2></div></div>
            {activities.length ? <div className="ld-activity__list">{activities.slice(0, 5).map((activity, index) => <div key={activity.id ?? index}><span className="ld-activity__dot"><Check size={12} /></span><div><strong>{activity.titleVi || activity.title}</strong><small>{activity.time}</small></div>{activity.xp != null && <b>+{activity.xp} XP</b>}</div>)}</div> : <div className="ld-empty ld-empty--compact"><Clock3 size={24} /><p>{t('dashboard.noActivity')}</p></div>}
          </motion.section>
        </main>

        <aside className="ld-side-column">
          <section className="ld-card ld-daily">
            <div className="ld-heading"><div><span>{t('dashboard.today')}</span><h2>{t('todayChallenges')}</h2></div><Target size={20} /></div>
            <div className="ld-daily__goal"><div><span>{t('dailyGoal')}</span><strong>{todayMinutes}{dailyGoal ? ` / ${dailyGoal}` : ''} {t('minutes')}</strong></div><div className="ld-progress"><span style={{ '--progress': `${dailyPercent}%` }} /></div></div>
            {quests.length ? <div className="ld-quest-list">{quests.slice(0, 4).map((quest, index) => <div key={quest.id ?? index} className={quest.done ? 'is-done' : ''}><span>{quest.done ? <Check size={12} /> : index + 1}</span><div><strong>{quest.title}</strong>{quest.progress && <small>{quest.progress}</small>}</div>{quest.xp != null && <b>+{quest.xp} XP</b>}</div>)}</div> : <div className="ld-empty ld-empty--compact"><Target size={23} /><p>{t('challengeEmpty')}</p></div>}
          </section>

          <section className="ld-card ld-leaderboard">
            <div className="ld-heading"><div><span>{t('dashboard.community')}</span><h2>{t('weeklyLeaderboard')}</h2></div><Trophy size={20} /></div>
            {leaderboard.length ? <div className="ld-leaderboard__list">{leaderboard.slice(0, 5).map((item, index) => <div key={item.id ?? item.rank ?? index} className={item.isUser ? 'is-user' : ''}><span>{item.rank ?? index + 1}</span><strong>{item.name}</strong><b>{item.xp} XP</b></div>)}</div> : <div className="ld-empty ld-empty--compact"><Trophy size={23} /><p>{t('noLeaderboard')}</p></div>}
          </section>

          <section className="ld-review-card">
            <span><RefreshCw size={18} /></span><div><h2>{t('dashboard.reviewTitle')}</h2><p>{t('dashboard.reviewText')}</p></div><Link to="/vocabulary/review" aria-label={t('dashboard.reviewAction')}><ArrowRight size={17} /></Link>
          </section>

          <section className="ld-card ld-word">
            <div className="ld-heading"><div><span>{t('dashboard.discovery')}</span><h2>{t('dashboard.wordOfDay')}</h2></div><button type="button" onClick={() => speakVietnamese(WORD_OF_THE_DAY.speechText || WORD_OF_THE_DAY.word)} aria-label={t('dashboard.listenWord', { word: WORD_OF_THE_DAY.word })}><Volume2 size={17} /></button></div>
            <strong>{WORD_OF_THE_DAY.word}</strong>
            <p>{WORD_OF_THE_DAY.description}</p>
            <small>{WORD_OF_THE_DAY.example}</small>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default LearnerDashboard;
