import React, { useState } from 'react';
import { cn } from '@/utils/cn';

/**
 * Animated Ripple Button for primary CTA, quiz submission, and key action buttons.
 */
export function RippleButton({
  children,
  className,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  rippleColor = 'rgba(255, 255, 255, 0.4)',
  disabled,
  onClick,
  ...props
}) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleSize = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - rippleSize / 2;
    const y = e.clientY - rect.top - rippleSize / 2;
    const newRipple = { id: Date.now() + Math.random(), x, y, size: rippleSize };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
    onClick?.(e);
  };

  const variantStyles = {
    primary:
      'bg-brand-500 text-white hover:bg-brand-600 shadow-sm font-semibold border-b-2 border-brand-700 active:translate-y-0.5',
    secondary:
      'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 font-medium',
    accent:
      'bg-accent-streak text-white hover:bg-orange-600 font-semibold shadow-sm border-b-2 border-orange-700 active:translate-y-0.5',
    outline:
      'border border-surface-border text-surface-ink hover:bg-surface-subtle font-medium',
    ghost:
      'text-surface-ink hover:bg-black/5 font-medium',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3.5 text-base rounded-2xl font-bold',
  };

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center gap-2 overflow-hidden transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
        variantStyles[variant] || variantStyles.primary,
        sizeStyles[size] || sizeStyles.md,
        className
      )}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            borderRadius: '50%',
            backgroundColor: rippleColor,
            pointerEvents: 'none',
            transform: 'scale(0)',
            animation: 'rippleAnim 600ms linear',
          }}
        />
      ))}
      {children}
    </button>
  );
}

export default RippleButton;
