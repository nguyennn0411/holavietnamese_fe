import React, { useState, useEffect } from 'react';
import { learnerService } from '@/services/learnerService';
import { audioFeedback } from '@/utils/audioFeedback';
import { speakVietnamese } from '@/utils/speech';
import { AmbientWatermark } from '../common/HeritageWatermark';
import {
  DEFAULT_STREAK_DAYS,
  DEFAULT_QUESTS,
  DEFAULT_LEAGUE_LEADERBOARD,
  QUICK_SRS_WORDS,
} from '@/components/home/data/homeData';

import { LearnerHeaderRibbon } from './LearnerHeaderRibbon';
import { StreakTracker } from './StreakTracker';
import { ContinueLessonConsole } from './ContinueLessonConsole';
import { VocabularyGardenSRS } from './VocabularyGardenSRS';
import { LearningModulesHub } from './LearningModulesHub';
import { DailyQuestsCard } from './DailyQuestsCard';
import { WeeklyLeaderboardCard } from './WeeklyLeaderboardCard';
import { WordOfTheDayCard } from './WordOfTheDayCard';
import { RecentActivityFeed } from './RecentActivityFeed';

/**
 * Master Learner Cockpit Dashboard for Authenticated Users
 */
export function LearnerDashboard({ user }) {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('learner_progress');
      if (saved) return JSON.parse(saved);
      const stats = localStorage.getItem('learner_stats');
      if (stats) {
        const s = JSON.parse(stats);
        return { streakCount: s.streak, totalXp: s.xp, hearts: s.hearts };
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 24, seconds: 18 });
  const [hasCheckedInToday, setHasCheckedInToday] = useState(() => {
    try {
      const savedProg = localStorage.getItem('learner_progress');
      if (savedProg) {
        const parsed = JSON.parse(savedProg);
        if (parsed.hasCheckedInToday !== undefined) return Boolean(parsed.hasCheckedInToday);
      }
    } catch {
      // ignore
    }
    return false;
  });

  const todayKey = new Date().toISOString().slice(0, 10);
  const [claimedQuests, setClaimedQuests] = useState(() => {
    try {
      const saved = localStorage.getItem(`claimed_quests_${user?.id || 'me'}_${todayKey}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { q1: false, q2: false, q3: false };
  });
  const [reviewedWords, setReviewedWords] = useState({});

  useEffect(() => {
    learnerService.getProgressData()
      .then((data) => {
        setProgress(data);
        if (data.hasCheckedInToday !== undefined) {
          setHasCheckedInToday(Boolean(data.hasCheckedInToday));
        }
        localStorage.setItem('learner_progress', JSON.stringify(data));
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = Math.max(0, midnight.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Chào buổi sáng'
      : currentHour < 18
      ? 'Chào buổi chiều'
      : 'Chào buổi tối';

  const dailyGoal = progress?.dailyGoalMinutes || 15;
  const today = progress?.todayMinutes || 8;
  const goalPercent = Math.min(100, Math.round((today / dailyGoal) * 100));
  const currentLesson = progress?.currentLesson;
  const activities = progress?.recentActivities || [];

  const leagueLeaderboard = DEFAULT_LEAGUE_LEADERBOARD.map((item) => {
    if (item.isUser) {
      return {
        ...item,
        name: user?.fullName || user?.username || 'Bạn',
      };
    }
    return item;
  });

  const handleDailyCheckIn = async () => {
    if (hasCheckedInToday) return;
    try {
      audioFeedback.playSuccessChime();
      setHasCheckedInToday(true);
      const res = await learnerService.checkInToday();
      if (res) {
        setProgress((prev) => {
          const next = {
            ...prev,
            streakCount: res.streakCount ?? ((prev?.streakCount || 0) + 1),
            totalXp: res.totalXp ?? ((prev?.totalXp || 0) + 10),
            hearts: res.hearts ?? prev?.hearts ?? 5,
            hasCheckedInToday: true,
          };
          localStorage.setItem('learner_progress', JSON.stringify(next));
          return next;
        });
        window.dispatchEvent(new CustomEvent('learner-stats-updated', {
          detail: {
            streakCount: res.streakCount,
            totalXp: res.totalXp,
            hearts: res.hearts,
          }
        }));
      }
    } catch (e) {
      console.error('Check-in failed:', e);
    }
  };

  const handleClaimQuest = async (questId) => {
    audioFeedback.playSuccessChime();
    setClaimedQuests((prev) => {
      const next = { ...prev, [questId]: true };
      localStorage.setItem(`claimed_quests_${user?.id || 'me'}_${todayKey}`, JSON.stringify(next));
      return next;
    });

    const quest = DEFAULT_QUESTS.find((q) => q.id === questId);
    const xpReward = quest?.xp || 20;

    try {
      const res = await learnerService.awardXp(xpReward, 'DAILY_QUEST', quest?.title || 'Nhiệm vụ hàng ngày');
      if (res) {
        setProgress((prev) => {
          const next = {
            ...prev,
            totalXp: res.totalXp ?? ((prev?.totalXp || 0) + xpReward),
          };
          localStorage.setItem('learner_progress', JSON.stringify(next));
          return next;
        });
        window.dispatchEvent(new CustomEvent('learner-stats-updated', {
          detail: {
            totalXp: res.totalXp,
          }
        }));
      }
    } catch (e) {
      console.error('Award quest XP failed:', e);
    }
  };

  const handleWaterWord = (viWord) => {
    audioFeedback.playSuccessChime();
    setReviewedWords((prev) => ({ ...prev, [viWord]: true }));
    speakVietnamese(viWord);
  };

  const handleWaterAll = () => {
    QUICK_SRS_WORDS.forEach((w) => setReviewedWords((prev) => ({ ...prev, [w.vi]: true })));
    audioFeedback.playSuccessChime();
  };

  // Build dynamic 7-day streak calendar based on real current day
  const todayDayNum = new Date().getDay(); // 0: CN, 1: T2, 2: T3, 3: T4, 4: T5, 5: T6, 6: T7
  const streakCount = progress?.streakCount ?? 0;
  const orderedWeekDays = [
    { day: 'T2', num: 1 },
    { day: 'T3', num: 2 },
    { day: 'T4', num: 3 },
    { day: 'T5', num: 4 },
    { day: 'T6', num: 5 },
    { day: 'T7', num: 6 },
    { day: 'CN', num: 0 },
  ];
  const dynamicStreakDays = orderedWeekDays.map((item) => {
    const isToday = item.num === todayDayNum;
    const active = isToday ? hasCheckedInToday : streakCount > 0;
    return {
      day: item.day,
      isToday,
      active,
    };
  });

  return (
    <div className="dashboard-page relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 overflow-hidden">
      {/* Subtle Heritage Watermark Medallions for Learner Cockpit */}
      <AmbientWatermark
        className="absolute -right-24 -top-12 w-[540px] h-[540px] opacity-[0.05]"
      />
      <AmbientWatermark
        className="absolute -left-28 bottom-24 w-[560px] h-[560px] opacity-[0.045]"
      />

      {/* 1. Header & Live Gamification Bar */}
      <LearnerHeaderRibbon
        user={user}
        greeting={greeting}
        streakCount={progress?.streakCount ?? 0}
        totalXp={progress?.totalXp ?? 0}
        hearts={progress?.hearts ?? 5}
        hasCheckedInToday={hasCheckedInToday}
      />

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium" role="alert">
          {error}
        </div>
      )}

      {/* 2. Interactive 7-Day Streak Calendar Tracker Bar */}
      <StreakTracker
        streakDays={dynamicStreakDays}
        hasCheckedInToday={hasCheckedInToday}
        onDailyCheckIn={handleDailyCheckIn}
      />

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Hero Console + Quick Warm-up + Modules */}
        <div className="lg:col-span-8 space-y-6">
          <ContinueLessonConsole currentLesson={currentLesson} />

          <VocabularyGardenSRS
            quickWords={QUICK_SRS_WORDS}
            reviewedWords={reviewedWords}
            onWaterWord={handleWaterWord}
            onWaterAll={handleWaterAll}
          />

          <LearningModulesHub />
        </div>

        {/* Right Column (4 cols): Quests + Leaderboard + Word of Day */}
        <aside className="lg:col-span-4 space-y-6 text-left">
          <DailyQuestsCard
            quests={DEFAULT_QUESTS}
            claimedQuests={claimedQuests}
            timeLeft={timeLeft}
            today={today}
            dailyGoal={dailyGoal}
            goalPercent={goalPercent}
            onClaimQuest={handleClaimQuest}
          />

          <WeeklyLeaderboardCard leaderboard={leagueLeaderboard} />

          <WordOfTheDayCard />
        </aside>
      </div>

      {/* 4. Recent Activity Timeline Feed */}
      <RecentActivityFeed activities={activities} />
    </div>
  );
}

export default LearnerDashboard;
