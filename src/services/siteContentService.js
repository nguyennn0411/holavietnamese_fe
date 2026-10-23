import { httpClient } from '@/api/httpClient';
import axiosClient from '@/infrastructure/api/axiosClient';

const resultOf = (response) => response?.result ?? response;
const listOf = (response) => {
  const value = resultOf(response);
  return Array.isArray(value) ? value : (value?.content ?? []);
};

const enabledBody = (enabled) => ({ enabled: Boolean(enabled) });

export const siteContentService = {
  async getPublic(options = {}) {
    const response = await httpClient('/site-content', { method: 'GET', ...options });
    return resultOf(response) ?? {};
  },

  async getAdminMenus(options = {}) {
    return listOf(await axiosClient.get('/api/admin/site-content/menus', options));
  },

  async getAdminBanners(options = {}) {
    return listOf(await axiosClient.get('/api/admin/site-content/banners', options));
  },

  async getAdminFeatures(options = {}) {
    return listOf(await axiosClient.get('/api/admin/site-content/features', options));
  },

  async setMenuEnabled(id, enabled) {
    return resultOf(await axiosClient.patch(
      `/api/admin/site-content/menus/${encodeURIComponent(String(id))}/enabled`,
      enabledBody(enabled),
    ));
  },

  async setBannerEnabled(id, enabled) {
    return resultOf(await axiosClient.patch(
      `/api/admin/site-content/banners/${encodeURIComponent(String(id))}/enabled`,
      enabledBody(enabled),
    ));
  },

  async setFeatureEnabled(key, enabled) {
    return resultOf(await axiosClient.patch(
      `/api/admin/site-content/features/${encodeURIComponent(String(key))}/enabled`,
      enabledBody(enabled),
    ));
  },
};

export default siteContentService;
