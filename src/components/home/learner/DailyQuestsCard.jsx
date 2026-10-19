import React from 'react';
import { Gift, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Daily Quests Card with Tiered Chests and Countdown Timer
 */
export function DailyQuestsCard({
  quests = [],
  claimedQuests = {},
  timeLeft = { hours: 5, minutes: 24, seconds: 18 },
  today = 8,
  dailyGoal = 15,
  goalPercent = 53,
  onClaimQuest,
}) {
  const { t } = useTranslation('learner');
  return (
    <section className="bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 shadow-[0_8px_30px_rgb(67,25,20,0.04)] space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-[#DECBB4]/40 pb-3">
        <div className="flex items-center gap-2">
          <Gift size={18} className="text-[#A62A24]" />
          <h3 className="text-base font-black text-[#431914]">{t('todayChallenges')}</h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#78685B] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#DECBB4]/50">
          <Clock size={12} className="text-[#A62A24]" />
          <span>
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {!quests.length && (
          <div className="rounded-2xl bg-[#FFF9EE] border border-[#DECBB4]/60 p-4 text-center space-y-2">
            <p className="text-xs text-[#78685B] leading-5">{t('challengeEmpty')}</p>
            <a href="/courses" className="inline-block text-[11px] font-bold text-[#A62A24] hover:underline">
              Start a lesson to unlock challenges →
            </a>
          </div>
        )}
        {quests.map((quest) => {
          const isClaimed = claimedQuests[quest.id];
          return (
            <div
              key={quest.id}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
                isClaimed
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : quest.done
                  ? 'bg-amber-50/60 border-amber-200 text-[#431914]'
                  : 'bg-[#FAF8F5] border-[#DECBB4]/70 text-[#431914]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                    quest.done || isClaimed ? 'bg-emerald-600 text-white' : 'border border-stone-300'
                  }`}
                >
                  {quest.done || isClaimed ? '✓' : ''}
                </span>
                <div className="truncate">
                  <span className={`block font-bold ${isClaimed ? 'line-through opacity-80' : ''}`}>
                    {quest.title}
                  </span>
                  <span className="text-[10px] text-[#78685B]">{quest.progress}</span>
                </div>
              </div>
              {quest.done && !isClaimed && onClaimQuest ? (
                <button
                  type="button"
                  onClick={() => onClaimQuest(quest.id)}
                  className="px-2.5 py-1 rounded-xl bg-[#A62A24] hover:bg-[#89221E] text-white font-black text-[11px] shrink-0 shadow-2xs cursor-pointer"
                >
                  Nhận {quest.xp} XP
                </button>
              ) : (
                <span className="font-black text-[#A62A24] shrink-0">
                  +{quest.xp} XP
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Daily Goal Time Progress */}
      <div className="pt-2 border-t border-[#DECBB4]/40 space-y-2">
        <div className="flex items-center justify-between text-xs text-[#78685B]">
          <span>{t('dailyGoal')}</span>
          <strong className="text-[#431914]">{today}/{dailyGoal} {t('minutes')}</strong>
        </div>
        <div className="w-full bg-[#EEE3D1] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#A62A24] h-full rounded-full transition-all duration-500"
            style={{ width: `${goalPercent}%` }}
          />
        </div>
      </div>
    </section>
  );
}

export default DailyQuestsCard;
