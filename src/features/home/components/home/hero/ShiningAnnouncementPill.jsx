import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

/**
 * Lucian UX/UI Prompt #252 - Shining expandable announcement pill.
 * Features a periodic light beam sweep and rotating highlight announcements.
 */
export function ShiningAnnouncementPill({
  className,
  items = [
    {
      tagVi: 'MỚI',
      tagEn: 'NEW',
      textVi: 'Luyện phản xạ đàm thoại AI theo 3 miền Bắc - Trung - Nam',
      textEn: 'AI conversational roleplay across 3 Vietnamese dialects',
      link: '/welcome',
    },
    {
      tagVi: 'NỔI BẬT',
      tagEn: 'HOT',
      textVi: 'Sổ tay từ vựng thông minh SRS & Flashcard lật 3D',
      textEn: 'Smart SRS vocabulary notebook with 3D flashcards',
      link: '/welcome',
    },
    {
      tagVi: 'LỘ TRÌNH',
      tagEn: 'PATH',
      textVi: 'Kiểm tra trình độ cá nhân hóa chuẩn khung CEFR A1-B2',
      textEn: 'Personalized placement test mapped to CEFR A1-B2',
      link: '/welcome',
    },
  ],
}) {
  const { i18n } = useTranslation();
  const isVi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('vi');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShining, setIsShining] = useState(false);

  // Rotate items every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsShining(true);
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setTimeout(() => setIsShining(false), 900);
    }, 5200);
    return () => clearInterval(timer);
  }, [items.length]);

  const current = items[currentIndex] || items[0];

  return (
    <div className={cn('inline-flex items-center justify-center', className)}>
      <a
        href={current.link}
        className={cn(
          'group relative flex items-center gap-2.5 px-3 py-1.5 rounded-full overflow-hidden transition-all duration-300',
          'bg-white/90 backdrop-blur-md border border-brand-200 shadow-card-soft hover:shadow-card-hover hover:border-brand-400',
          'text-xs font-medium text-surface-ink'
        )}
      >
        {/* Periodic light beam sweep animation */}
        <span
          className={cn(
            'pointer-events-none absolute inset-0 -left-[100%] w-[60px] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/80 to-transparent',
            isShining && 'animate-[shining-sweep_0.9s_ease-in-out]'
          )}
        />

        {/* Gradient Badge Tag */}
        <span className="flex-none px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-500 to-amber-500 text-white text-[10.5px] font-black tracking-wide uppercase shadow-xs">
          {isVi ? current.tagVi : current.tagEn}
        </span>

        {/* Rolling message text */}
        <span className="truncate max-w-[260px] sm:max-w-[380px] font-semibold text-surface-ink group-hover:text-brand-600 transition-colors">
          {isVi ? current.textVi : current.textEn}
        </span>

        {/* Arrow indicator with nudge animation on hover */}
        <ArrowRight
          size={14}
          className="flex-none text-surface-muted group-hover:text-brand-500 group-hover:translate-x-1 transition-all duration-200"
        />
      </a>
    </div>
  );
}

export default ShiningAnnouncementPill;
