import React, { ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  is3D?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  is3D = true,
  className = '',
  onClick,
  ...props
}) => {
  // Base classes with WCAG AA focus rings and smooth transitions
  let baseClasses =
    'relative inline-flex items-center justify-center font-bold tracking-wide select-none transition-all duration-150 rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none';

  // Size styling
  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-5 py-2.5 gap-2 min-h-[46px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[52px]',
    xl: 'text-lg px-8 py-4 gap-3 min-h-[60px]',
  }[size];

  // Variant styling with 3D tactile elevation
  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = is3D
        ? 'bg-[#EA580C] text-white shadow-[0_4px_0_#C2410C] hover:bg-[#C2410C] hover:shadow-[0_4px_0_#C2410C] active:translate-y-1 active:shadow-[0_0_0_#C2410C] focus-visible:ring-[#EA580C]/30'
        : 'bg-[#EA580C] text-white hover:bg-[#C2410C] shadow-sm focus-visible:ring-[#EA580C]/30';
      break;
    case 'accent':
      variantClasses = is3D
        ? 'bg-amber-500 text-slate-900 shadow-[0_4px_0_#b45309] hover:bg-amber-400 active:translate-y-1 active:shadow-[0_0_0_#b45309] focus-visible:ring-amber-300'
        : 'bg-amber-500 text-slate-900 hover:bg-amber-400 focus-visible:ring-amber-300';
      break;
    case 'danger':
      variantClasses = is3D
        ? 'bg-rose-500 text-white shadow-[0_4px_0_#be123c] hover:bg-rose-400 active:translate-y-1 active:shadow-[0_0_0_#be123c] focus-visible:ring-rose-300'
        : 'bg-rose-500 text-white hover:bg-rose-400 focus-visible:ring-rose-300';
      break;
    case 'secondary':
      variantClasses = is3D
        ? 'bg-white text-slate-700 border-2 border-slate-200 shadow-[0_4px_0_#e2e8f0] hover:bg-slate-50 hover:border-slate-300 active:translate-y-1 active:shadow-[0_0_0_#e2e8f0] focus-visible:ring-slate-300'
        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-300';
      break;
    case 'outline':
      variantClasses =
        'bg-transparent text-emerald-700 border-2 border-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 focus-visible:ring-emerald-400';
      break;
    case 'ghost':
      variantClasses =
        'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-300';
      break;
    case 'subtle':
      variantClasses =
        'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-200 focus-visible:ring-emerald-300';
      break;
  }

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Đang tải...
        </span>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
