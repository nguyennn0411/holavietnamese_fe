import React from 'react';
import { Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Weekly League Leaderboard – shows real data from API.
 * Renders an informative empty state when no data is available.
 */
export function WeeklyLeaderboardCard({ leaderboard = [] }) {
  const { t } = useTranslation('learner');
  return (
    <section
      className="bg-white/92 backdrop-blur-xs border border-[#E8E5DF]/70 rounded-3xl p-6 shadow-[0_8px_30px_rgb(67,25,20,0.04)] space-y-4 text-left"
      aria-label="Weekly leaderboard"
    >
      <div className="flex items-center justify-between border-b border-[#E8E5DF]/40 pb-3">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-amber-500" />
          <h3 className="text-base font-black text-[#253044]">{t('weeklyLeaderboard')}</h3>
        </div>
        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
          {t('liveStandings')}
        </span>
      </div>

      {!leaderboard.length ? (
        <p className="text-xs text-[#64748B] italic text-center py-2 leading-relaxed">
          {t('standingsInfo')}
        </p>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((item) => (
            <div
              key={item.rank}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                item.isUser
                  ? 'bg-[#FFF7E8] border-2 border-[#EA580C] font-bold shadow-2xs'
                  : 'bg-[#FFFCF7] border border-[#E8E5DF]/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 text-center text-xs font-black">{item.badge}</span>
                <span className="font-semibold text-[#253044] flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#FFF0DC] text-[#EA580C] border border-[#E8E5DF]/70">
                    {item.code}
                  </span>
                  <span>{item.name}</span>
                </span>
              </div>
              <span className="font-black text-[#64748B]">{item.xp} XP</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default WeeklyLeaderboardCard;
