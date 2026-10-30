import axiosClient from '@/shared/api/axiosClient';

function resultOf(response) {
  if (response?.success === false || (response?.code != null && response.code !== 1000)) {
    throw new Error(response?.message || 'Không xử lý được nguồn website.');
  }
  return response?.result ?? response;
}

const pathFor = (id, suffix = '') => {
  if (!/^[a-f0-9-]{36}$/i.test(String(id))) throw new Error('Mã website import không hợp lệ.');
  return `/api/admin/website-imports/${encodeURIComponent(String(id))}${suffix}`;
};

export const websiteImportService = {
  async analyze({ sourceUrl, mode, targetCourseId }) {
    return resultOf(await axiosClient.post('/api/admin/website-imports/analyze', {
      sourceUrl,
      mode,
      targetCourseId: targetCourseId ? Number(targetCourseId) : null,
    }));
  },
  async analyzeFile(file, targetCourseId) {
    if (!file || !/\.(xhtml|html|xml)$/i.test(file.name)) throw new Error('Chọn file XHTML, HTML hoặc XML hợp lệ.');
    if (!file.size || file.size > 10 * 1024 * 1024) throw new Error('File phải nhỏ hơn 10 MiB.');
    const form = new FormData();
    form.append('file', file);
    if (targetCourseId) form.append('targetCourseId', String(targetCourseId));
    return resultOf(await axiosClient.post('/api/admin/website-imports/analyze-file', form));
  },
  async update(id, modules) {
    return resultOf(await axiosClient.put(pathFor(id, '/draft'), { modules }));
  },
  async save(id, payload) {
    return resultOf(await axiosClient.post(pathFor(id, '/save'), payload));
  },
  async retryMedia(id) {
    return resultOf(await axiosClient.post(pathFor(id, '/retry-media'), {}));
  },
  async get(id, options = {}) {
    return resultOf(await axiosClient.get(pathFor(id), options));
  },
  async history(options = {}) {
    return resultOf(await axiosClient.get('/api/admin/website-imports', options));
  },
};
