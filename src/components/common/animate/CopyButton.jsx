import React from 'react';
import { CopyButton as BaseCopyButton, CopyButtonIcon } from '@animate-ui/react/primitives/buttons/copy';
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
  return (
    <BaseCopyButton
      content={content}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-surface-border bg-white text-surface-ink hover:bg-surface-subtle transition-colors cursor-pointer select-none',
        className
      )}
      {...props}
    >
      <CopyButtonIcon
        icon={<Copy size={size} className="text-surface-muted" />}
        copiedIcon={<Check size={size} className="text-accent-green" />}
      />
      {label && <span>{label}</span>}
    </BaseCopyButton>
  );
}

export default CopyButton;
