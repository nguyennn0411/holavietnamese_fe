import React from 'react';
import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import { Calendar } from 'lucide-react';
import { EmptyState } from '@/shared/components/common/Ui';

/**
 * Recent Learning Activity Timeline Feed
 */
export function RecentActivityFeed({ activities = [] }) {
  return (
    <section className="bg-white/92 backdrop-blur-xs border border-[#E8E5DF]/70 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(67,25,20,0.04)] space-y-4 text-left">
      <h3 className="text-lg font-black text-[#253044]"><BilingualText vi="Hoạt động học tập gần đây" en="Recent Learning Activity" /></h3>
      {activities.length ? (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFCF7] border border-[#E8E5DF]/50 shadow-2xs"
            >
              <div className="space-y-0.5">
                <strong className="block text-xs sm:text-sm font-bold text-[#253044]">
                  {activity.titleVi || activity.title || activity.description || activity.eventType}
                </strong>
                <small className="text-[11px] text-[#64748B] flex items-center gap-1">
                  <Calendar size={11} />
                  {activity.time || activity.createdAt}
                </small>
              </div>
              {(activity.xp ?? activity.amount) != null && (
                <span className="px-2.5 py-1 rounded-lg bg-[#F8E6B7] text-[#253044] font-bold text-xs">
                  +{activity.xp ?? activity.amount} XP
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={bilingualLabel("Chưa có hoạt động gần đây", "No recent activity")}
          description={bilingualLabel("Các bài học và lần ôn tập hoàn thành sẽ xuất hiện tại đây.", "Completed lessons and review sessions will appear here.")}
        />
      )}
    </section>
  );
}

export default RecentActivityFeed;
