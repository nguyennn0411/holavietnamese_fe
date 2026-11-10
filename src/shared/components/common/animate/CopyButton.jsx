import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Animated Copy Button with checkmark transition for copying vocabulary, lesson links, or codes.
 */
export function CopyButton({
  content,
  className,
  size = 16,
  label,
  copiedLabel,
  ...props
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-surface-border bg-white text-surface-ink hover:bg-surface-subtle transition-colors cursor-pointer select-none',
        className
      )}
      onClick={handleCopy}
      {...props}
    >
      {copied ? (
        <Check size={size} className="text-green-600" />
      ) : (
        <Copy size={size} className="text-surface-muted" />
      )}
      {label && <span>{copied ? (copiedLabel || label) : label}</span>}
    </button>
  );
}

export default CopyButton;
