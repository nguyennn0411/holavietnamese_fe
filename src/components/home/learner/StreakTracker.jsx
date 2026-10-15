import React from 'react';
import { Flame, CheckCircle, Gift, Shield } from 'lucide-react';
import { DEFAULT_STREAK_DAYS } from '@/components/home/data/homeData';

/**
 * 7-Day Interactive Streak Calendar Tracker Bar
 */
export function StreakTracker({
  streakDays = DEFAULT_STREAK_DAYS,
  hasCheckedInToday = false,
  onDailyCheckIn,
}) {
  return (
    <section className="bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(67,25,20,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-1 text-left">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-[#ff7a00]" fill="currentColor" />
          <h2 className="text-sm sm:text-base font-black text-[#431914]">
            Chuỗi 7 ngày liên tục • Weekly Streak Tracker
          </h2>
        </div>
        <p className="text-xs text-[#78685B]">
          Học ít nhất 1 bài mỗi ngày để giữ ngọn lửa không bị tắt.
        </p>
      </div>

      {/* 7-Day Pill Badges */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {streakDays.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center w-11 h-14 rounded-2xl border text-center transition-all ${
              item.isToday
                ? 'bg-[#FFF9EE] border-2 border-[#A62A24] shadow-md ring-2 ring-[#A62A24]/10 scale-105'
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
        <button
          type="button"
          onClick={onDailyCheckIn}
          disabled={hasCheckedInToday}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            hasCheckedInToday
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
              : 'bg-[#A62A24] hover:bg-[#89221E] text-white shadow-[0_3px_0_#89221E] active:translate-y-0.5'
          }`}
        >
          {hasCheckedInToday ? (
            <>
              <CheckCircle size={15} className="text-emerald-700" />
              <span>Đã điểm danh (+10 XP)</span>
            </>
          ) : (
            <>
              <Gift size={15} />
              <span>Điểm danh hôm nay (+10 XP)</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#FAF8F5] border border-[#DECBB4]/60 text-xs text-[#78685B]">
          <Shield size={16} className="text-emerald-600 shrink-0" />
          <span>1 Khiên bảo vệ sẵn sàng</span>
        </div>
      </div>
    </section>
  );
}

export default StreakTracker;
