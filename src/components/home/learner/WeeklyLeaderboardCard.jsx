import React from 'react';
import { Trophy } from 'lucide-react';
import { DEFAULT_LEAGUE_LEADERBOARD } from '@/components/home/data/homeData';

/**
 * Weekly League Leaderboard (Bảng Xếp Hạng Giải Đấu Vàng)
 */
export function WeeklyLeaderboardCard({ leaderboard = DEFAULT_LEAGUE_LEADERBOARD }) {
  return (
    <section className="bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 shadow-[0_8px_30px_rgb(67,25,20,0.04)] space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-[#DECBB4]/40 pb-3">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-amber-500" />
          <h3 className="text-base font-black text-[#431914]">Bảng xếp hạng tuần</h3>
        </div>
        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
          Giải Vàng
        </span>
      </div>

      <p className="text-[11px] text-[#78685B]">
        Top 10 sẽ thăng hạng lên <strong>Giải Ruby</strong> sau 2 ngày nữa! Bạn chỉ còn thiếu 60 XP để vào Top 3.
      </p>

      <div className="space-y-2">
        {leaderboard.map((item) => (
          <div
            key={item.rank}
            className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
              item.isUser
                ? 'bg-[#FFF9EE] border-2 border-[#A62A24] font-bold shadow-2xs'
                : 'bg-[#FAF8F5] border border-[#DECBB4]/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-5 text-center text-xs font-black">{item.badge}</span>
              <span className="font-semibold text-[#431914] flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#F5E1D8] text-[#A62A24] border border-[#DECBB4]/70">
                  {item.code}
                </span>
                <span>{item.name}</span>
              </span>
            </div>
            <span className="font-black text-[#78685B]">{item.xp} XP</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WeeklyLeaderboardCard;
