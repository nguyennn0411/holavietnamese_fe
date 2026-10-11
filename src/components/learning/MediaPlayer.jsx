import { BilingualText } from '@/components/common/BilingualText';
import { useState } from 'react';
import { mediaSource } from '@/components/common/mediaSource';

export function MediaPlayer({ videoUrl, audioUrl }) {
  return <>{videoUrl && <MediaAttempt key={`video-${String(videoUrl)}`} value={videoUrl} type="video" />}
    {audioUrl && <MediaAttempt key={`audio-${String(audioUrl)}`} value={audioUrl} type="audio" />}</>;
}

function MediaAttempt({ value, type }) {
  const src = mediaSource(value, type), [failed, setFailed] = useState(false);
  const label = type === 'video' ? 'video' : 'âm thanh';
  if (!src || failed) return <p className="media-error" role="status"><BilingualText>{failed ? `Không tải được ${label}. Vui lòng thử lại sau.` : `Đường dẫn ${label} không hợp lệ.`}</BilingualText></p>;
  const Player = type;
  return <Player src={src} controls preload="metadata" aria-label={type === 'video' ? 'Video bài học' : 'Âm thanh bài học'} onError={() => setFailed(true)}><BilingualText>{"Trình duyệt không hỗ trợ phát"}</BilingualText><BilingualText>{label}</BilingualText>.
  </Player>;
}
