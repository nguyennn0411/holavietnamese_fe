import { BilingualText } from '@/components/common/BilingualText';
import { useState } from 'react';
import { mediaSource } from './mediaSource';
import { Image as ImageIcon } from 'lucide-react';

export function ContentImage({ src, ...props }) {
  const source = mediaSource(src);
  const invalid = src != null && src !== '' && !source;
  // A changed URL gets a fresh load attempt, including after a failed preview.
  return <ImageAttempt key={`${source || ''}-${invalid}`} src={source} invalid={invalid} {...props} />;
}

function ImageAttempt({ src, invalid, alt = '', fallback, className = '', loading = 'lazy', ...props }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return fallback ?? <span
    className={`media-image-placeholder inline-flex flex-col items-center justify-center p-3 rounded-xl bg-[#FFFDF9] border border-[#DECBB4]/60 text-stone-500 min-h-[80px] gap-1 ${className}`}
    style={props.style}
    role="img"
    aria-label={alt ? `${alt} — ảnh không khả dụng` : 'Ảnh không khả dụng'}
    data-media-state={failed ? 'error' : invalid ? 'invalid' : 'missing'}
  >
    <ImageIcon size={22} className="text-[#A62A24]/50 shrink-0" aria-hidden="true" />
    <small className="text-[11px] font-semibold text-[#78685B]">
      <BilingualText>{failed ? 'Không tải được ảnh' : invalid ? 'Đường dẫn ảnh không hợp lệ' : 'Chưa có ảnh'}</BilingualText>
    </small>
  </span>;
  return <img {...props} src={src} alt={alt} className={className} loading={loading}
    decoding="async" onError={() => setFailed(true)} />;
}
