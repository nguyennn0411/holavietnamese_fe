import { BilingualText } from '@/shared/components/common/BilingualText';
﻿import React from 'react';
import { Flame, CheckCircle, Gift, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * 7-Day Interactive Streak Calendar Tracker Bar
 */
export function StreakTracker({
  streakDays = [],
  hasCheckedInToday = false,
  onDailyCheckIn,
  streakShieldCount,
}) {
  const { t } = useTranslation('learner');
  return (
    <section className="bg-white/92 backdrop-blur-xs border border-[#E8E5DF]/70 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(67,25,20,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-1 text-left">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-[#ff7a00]" fill="currentColor" />
          <h2 className="text-sm sm:text-base font-black text-[#253044]">
            {t('weeklyStreak')}
          </h2>
        </div>
        <p className="text-xs text-[#64748B]">
          {t('streakHint')}
        </p>
      </div>

      {/* 7-Day Pill Badges */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {streakDays.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center w-11 h-14 rounded-2xl border text-center transition-all ${
              item.isToday
                ? 'bg-[#FFF7E8] border-2 border-[#EA580C] shadow-md ring-2 ring-[#EA580C]/10 scale-105'
                : item.active
                ? 'bg-amber-50/80 border-amber-200 text-amber-800'
                : 'bg-stone-50 border-stone-200 text-stone-400'
            }`}
          >
            <span className="text-[10px] font-bold">{item.day}</span>
            <div className="mt-1">
              {item.active ? (
                <Flame size={15} className="text-[#ff7a00]" fill="currentColor" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-stone-300 block my-1" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Streak Check-in & Shield Status */}
      <div className="flex items-center gap-3 flex-wrap">
        {onDailyCheckIn ? <button
          type="button"
          onClick={onDailyCheckIn}
          disabled={hasCheckedInToday}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            hasCheckedInToday
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
              : 'bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-[0_3px_0_#C2410C] active:translate-y-0.5'
          }`}
        >
          {hasCheckedInToday ? (
            <>
              <CheckCircle size={15} className="text-emerald-700" />
              <span><BilingualText vi="Đã điểm danh (+10 XP)" en="Checked in (+10 XP)" /></span>
            </>
          ) : (
            <>
              <Gift size={15} />
              <span><BilingualText vi="Điểm danh hôm nay (+10 XP)" en="Check in today (+10 XP)" /></span>
            </>
          )}
        </button> : null}

        {streakShieldCount != null ? <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#FFFCF7] border border-[#E8E5DF]/60 text-xs text-[#64748B]">
          <Shield size={16} className="text-emerald-600 shrink-0" />
          <span><BilingualText vi="1 Khiên bảo vệ sẵn sàng" en="1 Streak Freeze ready" /></span>
        </div> : null}
      </div>
    </section>
  );
}

export default StreakTracker;
