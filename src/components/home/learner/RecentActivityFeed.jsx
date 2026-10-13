import React from 'react';
import { Calendar } from 'lucide-react';
import { EmptyState } from '@/components/common/Ui';

/**
 * Recent Learning Activity Timeline Feed
 */
export function RecentActivityFeed({ activities = [] }) {
  return (
    <section className="bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(67,25,20,0.04)] space-y-4 text-left">
      <h2 className="text-lg font-black text-[#431914]">Hoạt động học tập gần đây</h2>
      {activities.length ? (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] border border-[#DECBB4]/50 shadow-2xs"
            >
              <div className="space-y-0.5">
                <strong className="block text-xs sm:text-sm font-bold text-[#431914]">
                  {activity.titleVi || activity.title}
                </strong>
                <small className="text-[11px] text-[#78685B] flex items-center gap-1">
                  <Calendar size={11} />
                  {activity.time}
                </small>
              </div>
              {activity.xp != null && (
                <span className="px-2.5 py-1 rounded-lg bg-[#F8E6B7] text-[#431914] font-bold text-xs">
                  +{activity.xp} XP
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Chưa có hoạt động gần đây"
          description="Các bài học và lần ôn tập hoàn thành sẽ xuất hiện tại đây."
        />
      )}
    </section>
  );
}

export default RecentActivityFeed;
