function safeMediaUrl(value) {
  if (!value) return null
  try { const url = new URL(value, window.location.origin); return ['http:', 'https:'].includes(url.protocol) ? url.href : null } catch { return null }
}
export function MediaPlayer({ videoUrl, audioUrl }) {
  const video = safeMediaUrl(videoUrl), audio = safeMediaUrl(audioUrl)
  return <>{video && <video controls preload="metadata" src={video}>Your browser does not support video playback.</video>}
    {audio && <audio controls preload="metadata" src={audio}>Your browser does not support audio playback.</audio>}</>
}
