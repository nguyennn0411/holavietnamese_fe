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
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 24, seconds: 18 });
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [claimedQuests, setClaimedQuests] = useState({ q1: false, q2: false, q3: false });
  const [reviewedWords, setReviewedWords] = useState({});

  useEffect(() => {
    learnerService.getProgressData().then(setProgress).catch((err) => setError(err.message));
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

  const handleDailyCheckIn = () => {
    if (hasCheckedInToday) return;
    audioFeedback.playSuccessChime();
    setHasCheckedInToday(true);
  };

  const handleClaimQuest = (questId) => {
    audioFeedback.playSuccessChime();
    setClaimedQuests((prev) => ({ ...prev, [questId]: true }));
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
        streakCount={progress?.streakCount ?? progress?.currentStreak ?? 7}
        totalXp={progress?.totalXp ?? 145}
        hasCheckedInToday={hasCheckedInToday}
      />

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium" role="alert">
          {error}
        </div>
      )}

      {/* 2. Interactive 7-Day Streak Calendar Tracker Bar */}
      <StreakTracker
        streakDays={DEFAULT_STREAK_DAYS}
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
