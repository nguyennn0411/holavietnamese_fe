import cloudinaryAudioUrls from './cloudinaryAudioUrls.js';

const configuredApiOrigin = (import.meta.env?.VITE_API_BASE_URL || '')
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

export function cloudinaryAudioSource(source, urls = cloudinaryAudioUrls) {
  return urls[source] || source;
}

// Normalize only at render time; the original form/API values remain untouched.
export function mediaSource(value, type = 'image') {
  if (typeof value !== 'string') return null;
  const source = value.trim();
  if (!source || /^(?:null|undefined|\[object Object\])$/i.test(source) || /[\u0000-\u001f\u007f]/.test(source)) return null;
  const scheme = source.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();
  if (!scheme) {
    const localSource = type === 'audio' ? cloudinaryAudioSource(source) : source;
    if (localSource.startsWith('/media/') && configuredApiOrigin) return `${configuredApiOrigin}${localSource}`;
    return localSource;
  }
  if (scheme === 'http' || scheme === 'https') {
    try { return new URL(source).hostname ? source : null; } catch { return null; }
  }
  if (scheme === 'blob') return source;
  if (scheme === 'data' && new RegExp(`^data:${type}/`, 'i').test(source)) return source;
  return null;
}
