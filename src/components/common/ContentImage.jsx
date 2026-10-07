import { useState } from 'react';
import { mediaSource } from './mediaSource';

export function ContentImage({ src, ...props }) {
  const source = mediaSource(src);
  const invalid = src != null && src !== '' && !source;
  // A changed URL gets a fresh load attempt, including after a failed preview.
  return <ImageAttempt key={`${source || ''}-${invalid}`} src={source} invalid={invalid} {...props} />;
}

function ImageAttempt({ src, invalid, alt = '', fallback, className = '', loading = 'lazy', ...props }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return fallback ?? <span
    className={`media-image-placeholder ${className}`}
    style={props.style}
    role="img"
    aria-label={alt ? `${alt} — ảnh không khả dụng` : 'Ảnh không khả dụng'}
    data-media-state={failed ? 'error' : invalid ? 'invalid' : 'missing'}
  ><span aria-hidden="true">▧</span><small>{failed ? 'Không tải được ảnh' : invalid ? 'Đường dẫn ảnh không hợp lệ' : 'Chưa có ảnh'}</small></span>;
  return <img {...props} src={src} alt={alt} className={className} loading={loading}
    decoding="async" onError={() => setFailed(true)} />;
}
