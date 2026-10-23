import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BUNDLED_BANNER_IMAGES, DEFAULT_BANNERS, DEFAULT_MENU_ITEMS } from '@/config/siteContentDefaults';
import { siteContentService } from '@/services/siteContentService';

const SiteContentContext = createContext(null);
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const normalizedKey = (value) => String(value || '').trim().toUpperCase();
const byDisplayOrder = (left, right) => (
  (Number(left?.displayOrder) || 0) - (Number(right?.displayOrder) || 0)
  || String(left?.code || '').localeCompare(String(right?.code || ''))
);

const fallbackMenusByCode = new Map(DEFAULT_MENU_ITEMS.map((item) => [normalizedKey(item.code), item]));
const fallbackBannersByCode = new Map(DEFAULT_BANNERS.map((item) => [normalizedKey(item.code), item]));
const fallbackBannersBySlot = new Map(DEFAULT_BANNERS.map((item) => [`${item.placement}:${item.displayOrder}`, item]));

function normalizeFeatures(value) {
  const source = Array.isArray(value) ? value : (Array.isArray(value?.content) ? value.content : value);
  if (Array.isArray(source)) {
    return Object.fromEntries(source.flatMap((item) => {
      const key = normalizedKey(item?.key ?? item?.code ?? item?.featureKey);
      return key ? [[key, item?.enabled !== false]] : [];
    }));
  }
  if (!source || typeof source !== 'object') return {};
  return Object.fromEntries(Object.entries(source).map(([key, setting]) => [
    normalizedKey(key),
    typeof setting === 'object' && setting !== null ? setting.enabled !== false : setting !== false,
  ]));
}

function normalizeMenuItems(value, fallback = DEFAULT_MENU_ITEMS) {
  if (!Array.isArray(value)) return [...fallback];
  return value.map((item) => {
    const defaults = fallbackMenusByCode.get(normalizedKey(item?.code)) || {};
    return { ...defaults, ...item };
  }).sort(byDisplayOrder);
}

function normalizeBanners(value, fallback = DEFAULT_BANNERS) {
  if (!Array.isArray(value)) return [...fallback];
  return value.map((item) => {
    const defaults = fallbackBannersByCode.get(normalizedKey(item?.code))
      || fallbackBannersBySlot.get(`${item?.placement}:${item?.displayOrder}`)
      || {};
    return {
      ...defaults,
      ...item,
      bundledImageUrl: defaults.imageUrl || BUNDLED_BANNER_IMAGES[normalizedKey(item?.code)] || null,
    };
  }).sort(byDisplayOrder);
}

function featureEnabled(features, keyOrKeys, fallback = true) {
  const keys = (Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys]).map(normalizedKey).filter(Boolean);
  for (const key of keys) {
    if (hasOwn(features, key)) return features[key] !== false;
  }
  return fallback;
}

function scheduledNow(item, now = Date.now()) {
  const startsAt = item?.startsAt ? Date.parse(item.startsAt) : Number.NaN;
  const endsAt = item?.endsAt ? Date.parse(item.endsAt) : Number.NaN;
  if (Number.isFinite(startsAt) && startsAt > now) return false;
  if (Number.isFinite(endsAt) && endsAt <= now) return false;
  return true;
}

export function localizedSiteField(item, field, language = 'en') {
  if (!item) return '';
  const vietnamese = String(language || '').toLowerCase().startsWith('vi');
  const preferred = item[`${field}${vietnamese ? 'Vi' : 'En'}`];
  const alternate = item[`${field}${vietnamese ? 'En' : 'Vi'}`];
  return preferred ?? alternate ?? item[field] ?? '';
}

export function safeInternalPath(value) {
  if (typeof value !== 'string') return null;
  const path = value.trim();
  const hasUnsafeCharacter = [...path].some((character) => {
    const code = character.charCodeAt(0);
    return character === '\\' || code <= 31 || code === 127;
  });
  if (!path.startsWith('/') || path.startsWith('//') || hasUnsafeCharacter) return null;
  return path;
}

export function safeExternalUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function resolveBannerImage(banner) {
  const source = typeof banner?.imageUrl === 'string' ? banner.imageUrl.trim() : '';
  const isSourceAssetToken = /^(?:\/?src\/|@\/)assets\//i.test(source)
    || /^\/assets\/images\/(?:guest|learner)-carousel\//i.test(source);
  if (source && !isSourceAssetToken) return source;
  return banner?.bundledImageUrl || BUNDLED_BANNER_IMAGES[normalizedKey(banner?.code)] || source || null;
}

const fallbackState = Object.freeze({
  menuItems: [...DEFAULT_MENU_ITEMS],
  banners: DEFAULT_BANNERS.map((banner) => ({ ...banner, bundledImageUrl: banner.imageUrl })),
  features: {},
  source: 'fallback',
});

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(fallbackState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestRef = useRef(0);

  const refresh = useCallback(async (options = {}) => {
    const requestId = ++requestRef.current;
    setLoading(true);
    try {
      const result = await siteContentService.getPublic(options);
      if (requestId !== requestRef.current) return null;
      const next = {
        menuItems: normalizeMenuItems(result?.menuItems),
        banners: normalizeBanners(result?.banners),
        features: normalizeFeatures(result?.features),
        source: 'remote',
      };
      setContent(next);
      setError(null);
      return next;
    } catch (requestError) {
      if (requestError?.name === 'AbortError' || requestError?.name === 'CanceledError') return null;
      if (requestId === requestRef.current) {
        setContent(fallbackState);
        setError(requestError);
      }
      return null;
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refresh({ signal: controller.signal });
    return () => {
      controller.abort();
      requestRef.current += 1;
    };
  }, [refresh]);

  const isFeatureEnabled = useCallback(
    (keyOrKeys, fallback = true) => featureEnabled(content.features, keyOrKeys, fallback),
    [content.features],
  );

  const getMenuItems = useCallback((placement, { includeDisabled = false } = {}) => (
    content.menuItems.filter((item) => (
      item?.placement === placement
      && item?.path !== '/blog'
      && normalizedKey(item?.featureKey) !== 'BLOG'
      && normalizedKey(item?.code) !== 'GUEST_BLOG'
      && normalizedKey(item?.code) !== 'LEARNER_BLOG'
      && (includeDisabled || item?.enabled !== false)
      && (includeDisabled || featureEnabled(content.features, item?.featureKey, true))
    )).sort(byDisplayOrder)
  ), [content.features, content.menuItems]);

  const getBanners = useCallback((placement, { includeDisabled = false } = {}) => {
    const now = Date.now();
    return content.banners.filter((item) => (
      item?.placement === placement
      && item?.path !== '/blog'
      && normalizedKey(item?.featureKey) !== 'BLOG'
      && normalizedKey(item?.code) !== 'GUEST_BLOG'
      && normalizedKey(item?.code) !== 'LEARNER_BLOG'
      && (includeDisabled || item?.enabled !== false)
      && (includeDisabled || featureEnabled(content.features, item?.featureKey, true))
      && (includeDisabled || scheduledNow(item, now))
    )).sort(byDisplayOrder);
  }, [content.banners, content.features]);

  const value = useMemo(() => ({
    ...content,
    loading,
    error,
    refresh,
    getMenuItems,
    getBanners,
    isFeatureEnabled,
  }), [content, error, getBanners, getMenuItems, isFeatureEnabled, loading, refresh]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error('useSiteContent must be used within a SiteContentProvider');
  return context;
}

export default SiteContentContext;
