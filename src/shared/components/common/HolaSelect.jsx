import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * HolaSelect: Modern, sleek custom dropdown component
 * Replaces native browser OS <select> with a themed, accessible, elegant dropdown.
 *
 * Props:
 * - value: current selected value (string | number)
 * - onChange: (value) => void
 * - options: Array of { value, label, sublabel?, badge?, icon?, iconColor? }
 * - placeholder: string
 * - ariaLabel: string
 * - minWidth: string (default: '240px')
 * - fullWidth: boolean (default: false)
 * - align: 'left' | 'right' (default: 'right')
 * - disabled: boolean (default: false)
 * - className: string
 * - triggerClassName: string
 */
export function HolaSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Chọn một tùy chọn...',
  ariaLabel,
  minWidth = '240px',
  fullWidth = false,
  align = 'right',
  disabled = false,
  className = '',
  triggerClassName = '',
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selectedOption = options.find((opt) => String(opt.value) === String(value)) || null;

  return (
    <div
      ref={containerRef}
      className={`hola-select-container ${fullWidth ? 'w-full' : ''} ${className}`.trim()}
      style={{
        position: 'relative',
        display: fullWidth ? 'block' : 'inline-block',
        width: fullWidth ? '100%' : 'auto',
        zIndex: open ? 50 : 1,
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`hola-select-trigger ${open ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${triggerClassName}`.trim()}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <div className="hola-select-trigger-content">
          {selectedOption?.icon && (
            <selectedOption.icon
              size={15}
              style={{ color: selectedOption.iconColor || '#EA580C', flexShrink: 0 }}
            />
          )}
          <span className="hola-select-trigger-label">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          size={15}
          className={`hola-select-chevron ${open ? 'rotate-180 text-[#EA580C]' : 'text-[#94A3B8]'}`}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="hola-select-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            ...(align === 'right' ? { right: 0 } : { left: 0 }),
            minWidth: fullWidth ? '100%' : minWidth,
            width: fullWidth ? '100%' : 'max-content',
            maxWidth: 'calc(100vw - 32px)',
          }}
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                className={`hola-select-option ${isSelected ? 'is-selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange(opt.value);
                    setOpen(false);
                  }
                }}
              >
                <div className="hola-select-option-main">
                  <div className="flex items-center gap-2">
                    {opt.icon && (
                      <opt.icon
                        size={15}
                        style={{ color: opt.iconColor || (isSelected ? '#EA580C' : '#64748B'), flexShrink: 0 }}
                      />
                    )}
                    <span className="hola-select-option-label">{opt.label}</span>
                  </div>
                  {opt.sublabel && (
                    <div className="hola-select-option-sublabel">{opt.sublabel}</div>
                  )}
                </div>

                <div className="hola-select-option-right">
                  {opt.badge && (
                    <span className="hola-select-option-badge">
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && (
                    <Check size={15} className="text-[#EA580C] shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HolaSelect;
