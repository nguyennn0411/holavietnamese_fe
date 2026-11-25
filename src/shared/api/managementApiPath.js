const normalizedRole = () => {
  if (typeof localStorage === 'undefined') return 'ADMIN';
  const directRole = localStorage.getItem('role');
  if (directRole) return String(directRole).replace(/^ROLE_/, '').toUpperCase();
  try {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    return String(storedUser?.role || '').replace(/^ROLE_/, '').toUpperCase();
  } catch {
    return '';
  }
};

export const managementApiRoot = () => normalizedRole() === 'CONTENT_CREATOR' ? '/api/content' : '/api/admin';
export const managementResourceRoot = () => normalizedRole() === 'CONTENT_CREATOR' ? '/content' : '/admin';

export const managementApiPath = (path = '') => `${managementApiRoot()}${path.startsWith('/') ? path : `/${path}`}`;
export const managementResourcePath = (path = '') => `${managementResourceRoot()}${path.startsWith('/') ? path : `/${path}`}`;
