export const normalizeRole = (role) => {
  const value = (role ?? '').trim().toUpperCase().replace(/[\s-]+/g, '_');

  if (!value) return 'UNKNOWN';
  if (value === 'LEAD' || value === 'TECHLEAD' || value === 'TECH_LEAD') return 'TECH_LEAD';
  if (value === 'EMPLOYEE') return 'EMPLOYEE';
  if (value === 'MANAGER') return 'MANAGER';
  if (value === 'HR') return 'HR';
  if (value === 'MARKETING') return 'MARKETING';
  if (value === 'ADMIN') return 'ADMIN';
  if (value === 'CEO') return 'CEO';

  return 'UNKNOWN';
};

export const getRoleFromToken = (token) => {
  if (!token) return 'UNKNOWN';

  try {
    const [, payload] = token.split('.');
    if (!payload) return 'UNKNOWN';

    const decoded = JSON.parse(window.atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return normalizeRole(decoded.role);
  } catch {
    return 'UNKNOWN';
  }
};

function appendToken(url, token) {
  if (!token) return url;

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}token=${encodeURIComponent(token)}`;
}

export const getRoleDestination = (role, token) => {
  const normalized = normalizeRole(role);

  if (normalized === 'CEO' || normalized === 'ADMIN') {
    return appendToken('http://127.0.0.1:3001', token);
  }

  if (normalized === 'HR') {
    return appendToken('http://127.0.0.1:3005/hr-dashboard', token);
  }

  if (normalized === 'MANAGER') {
    return appendToken('http://127.0.0.1:3005/manager-dashboard', token);
  }

  if (normalized === 'EMPLOYEE') {
    return appendToken('http://127.0.0.1:5173/dashboard', token);
  }

  if (normalized === 'MARKETING') {
    return appendToken('http://127.0.0.1:3005/marketing-hub', token);
  }

  return appendToken('http://127.0.0.1:3003/dashboard', token);
};
