import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flame, Zap, Heart, Compass } from 'lucide-react';

/**
 * Learner Dashboard Top Header and Gamification Stats Ribbon
 */
export function LearnerHeaderRibbon({
  user,
  greeting,
  streakCount = 7,
  totalXp = 145,
  hasCheckedInToday = false,
}) {
  const effectiveStreak = hasCheckedInToday ? streakCount + 1 : streakCount;
  const effectiveXp = totalXp + (hasCheckedInToday ? 10 : 0);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#DECBB4]/60 pb-6">
      <div className="space-y-1 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#F5E1D8] border border-[#E7B59D] text-[#A62A24] text-xs font-bold uppercase tracking-wider">
          <Sparkles size={13} />
          <span>{greeting}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#431914] tracking-tight">
          {user?.fullName || user?.username || 'Học viên'}!
        </h1>
        <p className="text-xs sm:text-sm text-[#78685B]">
          Cấp độ hiện tại: <strong className="text-[#431914]">Sơ cấp A1 • Trạm 3</strong> — Duy trì ngọn lửa học tập mỗi ngày.
        </p>
      </div>

      {/* Gamification Stats Ribbon */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#DECBB4]/60 shadow-[0_4px_16px_rgba(67,25,20,0.03)]">
          <Flame size={22} className="text-[#ff7a00] animate-bounce-subtle shrink-0" fill="currentColor" />
          <div>
            <span className="block text-sm font-black text-[#431914] leading-tight">
              {effectiveStreak}
            </span>
            <span className="block text-[10px] text-[#78685B] font-semibold uppercase">Ngày Streak</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#DECBB4]/60 shadow-[0_4px_16px_rgba(67,25,20,0.03)]">
          <Zap size={22} className="text-[#8b5cf6] shrink-0" fill="currentColor" />
          <div>
            <span className="block text-sm font-black text-[#431914] leading-tight">
              {effectiveXp}
            </span>
            <span className="block text-[10px] text-[#78685B] font-semibold uppercase">Tổng XP</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#DECBB4]/60 shadow-[0_4px_16px_rgba(67,25,20,0.03)]">
          <Heart size={22} className="text-[#ef4444] shrink-0" fill="currentColor" />
          <div>
            <span className="block text-sm font-black text-[#431914] leading-tight">5/5</span>
            <span className="block text-[10px] text-[#78685B] font-semibold uppercase">Trái tim</span>
          </div>
        </div>

        <Link
          to="/edtech/dashboard"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#A62A24] hover:bg-[#89221E] text-white font-black text-xs shadow-[0_4px_0_#89221E] active:translate-y-1 active:shadow-none transition-all"
        >
          <Compass size={16} />
          <span>Vào Lộ trình EdTech →</span>
        </Link>
      </div>
    </div>
  );
}

export default LearnerHeaderRibbon;
