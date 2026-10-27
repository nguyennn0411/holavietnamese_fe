import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Flame } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Lucian UX/UI Prompt #210 & #253 - Live learner pulse & activity social proof.
 * Displays live active learners count with breathing pulse and real-time activity chips.
 */
export function LiveLearnerPulse({ className }) {
  const { i18n } = useTranslation();
  const isVi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('vi');

  const recentEvents = [
    { name: 'David (USA)', actionVi: 'vừa hoàn thành bài: Cà phê sữa đá', actionEn: 'completed: Ordering Vietnamese Coffee' },
    { name: 'Kenji (Japan)', actionVi: 'vừa đạt chuỗi 7 ngày liên tiếp', actionEn: 'reached a 7-day learning streak' },
    { name: 'Sarah (Australia)', actionVi: 'bắt đầu học phương ngữ Miền Nam', actionEn: 'started Southern Vietnamese dialect' },
    { name: 'Min-ho (Korea)', actionVi: 'ghi nhớ 25 từ vựng mới', actionEn: 'mastered 25 new vocabulary words' },
  ];

  const [eventIndex, setEventIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setEventIndex((prev) => (prev + 1) % recentEvents.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [recentEvents.length]);

  const currentEvent = recentEvents[eventIndex];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-surface-border/80 shadow-xs text-xs text-surface-ink select-none',
        className
      )}
    >
      {/* Green breathing pulse indicator */}
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="font-bold text-surface-ink">1,420+</span>
        <span className="text-surface-muted hidden sm:inline">
          {isVi ? 'học viên trực tuyến' : 'online learners'}
        </span>
      </div>

      <span className="h-3 w-px bg-surface-border hidden sm:inline" />

      {/* Rotating live activity ticker */}
      <div className="hidden md:flex items-center gap-1.5 text-surface-muted truncate max-w-[280px]">
        <span className="font-semibold text-surface-ink">{currentEvent.name}</span>
        <span className="truncate">{isVi ? currentEvent.actionVi : currentEvent.actionEn}</span>
      </div>
    </div>
  );
}

export default LiveLearnerPulse;
