// Isolated UI QA only. Production Destination pages always use the backend service.
const records = [
  { id: 1, nameVi: 'Hà Nội', nameEn: 'Hanoi', slug: 'hanoi', region: 'NORTH', status: 'PUBLISHED', imageUrl: '/design/coffee.svg' },
  { id: 2, nameVi: 'Huế', nameEn: 'Hue', slug: 'hue', region: 'CENTRAL', status: 'PUBLISHED', imageUrl: '/design/village.svg' },
  { id: 3, nameVi: 'Cần Thơ', nameEn: 'Can Tho', slug: 'can-tho', region: 'SOUTH', status: 'DRAFT', imageUrl: null },
  { id: 4, nameVi: 'Đà Nẵng', nameEn: 'Da Nang', slug: 'da-nang', region: 'CENTRAL', status: 'PENDING_REVIEW', imageUrl: '/design/coast.svg' },
  { id: 5, nameVi: 'Sa Pa', nameEn: 'Sapa', slug: 'sapa', region: 'NORTH', status: 'ARCHIVED', imageUrl: '/design/village.svg' },
].map(entry => ({ ...entry, shortDescriptionVi: 'Mô tả ngắn điểm đến để kiểm tra giao diện.', shortDescriptionEn: 'A short destination description for visual QA.', descriptionVi: 'Nội dung tiếng Việt từ API kiểm thử.\n\nĐoạn văn thứ hai để kiểm tra cách trình bày nội dung nhiều dòng.', descriptionEn: 'English description from the test API.\n\nA second paragraph to check multiline content.', createdAt: '2026-10-09T00:00:00Z', updatedAt: '2026-10-09T01:00:00Z', publishedAt: entry.status === 'PUBLISHED' ? '2026-10-09T01:00:00Z' : null, archivedAt: entry.status === 'ARCHIVED' ? '2026-10-09T02:00:00Z' : null }));

const fail = (status, message) => { const error = new Error(message); error.status = status; throw error; };
export function requestDestination(path, body, options, fixtureMode) {
  const admin = path.startsWith('/api/admin/');
  const id = path.match(/\/(\d+)$/)?.[1];
  if (body) {
    if (fixtureMode === 'save-error') fail(500, 'Không thể lưu điểm đến. Vui lòng thử lại.');
    if (records.some(item => item.slug === body.slug.trim().toLowerCase() && String(item.id) !== id)) fail(409, 'Destination slug already exists.');
    const current = id ? records.find(item => String(item.id) === id) : null;
    if (id && !current) fail(404, 'Không tìm thấy điểm đến.');
    const entry = { ...current, ...body, slug: body.slug.trim().toLowerCase(), id: current?.id ?? Math.max(0, ...records.map(item => item.id)) + 1, createdAt: current?.createdAt ?? new Date().toISOString(), updatedAt: new Date().toISOString() };
    if (entry.status === 'PUBLISHED') entry.publishedAt ??= new Date().toISOString();
    if (entry.status === 'ARCHIVED') entry.archivedAt ??= new Date().toISOString();
    if (current) records.splice(records.indexOf(current), 1, entry); else records.push(entry);
    return { code: 1000, success: true, result: entry };
  }
  if (id) {
    const entry = records.find(item => String(item.id) === id && (admin || item.status === 'PUBLISHED'));
    if (!entry) fail(404, 'Không tìm thấy điểm đến.');
    return { code: 1000, success: true, result: entry };
  }
  const filters = options.params || {};
  return { code: 1000, success: true, result: fixtureMode === 'empty' ? [] : records.filter(item => (admin || item.status === 'PUBLISHED')
    && (!filters.keyword || (item.nameVi + ' ' + item.nameEn).toLowerCase().includes(filters.keyword.toLowerCase()))
    && (!filters.region || item.region === filters.region) && (!filters.status || item.status === filters.status)) };
}
