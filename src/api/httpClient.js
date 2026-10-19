const rawBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

export function resolveApiUrl(path) {
  if (!path) return rawBase ? `${rawBase}/api` : '/api'
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  // If path already starts with /api/ or is /api
  if (cleanPath.startsWith('/api/') || cleanPath === '/api') {
    return rawBase ? `${rawBase}${cleanPath}` : cleanPath
  }

  // If rawBase ends with /api
  if (rawBase.endsWith('/api')) {
    return `${rawBase}${cleanPath}`
  }

  // Otherwise ensure /api prefix is included
  return rawBase ? `${rawBase}/api${cleanPath}` : `/api${cleanPath}`
}

let csrfPromise
export function resetCsrf() { csrfPromise = undefined }

async function csrf() {
  if (!csrfPromise) csrfPromise = httpClient('/csrf').catch(error => { resetCsrf(); throw error })
  return csrfPromise
}

export async function httpClient(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const jwtToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  const csrfToken = (!jwtToken && !['GET', 'HEAD', 'OPTIONS'].includes(method)) ? await csrf() : null

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
  const resolvedUrl = resolveApiUrl(path)

  const response = await fetch(resolvedUrl, {
    ...options,
    credentials: 'include',
    headers: {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
      ...(csrfToken ? { [csrfToken.headerName]: csrfToken.token } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const error = new Error(body?.message || `Request failed (${response.status}). Please try again.`)
    error.status = response.status
    if (response.status === 401 || response.status === 403) resetCsrf()
    throw error
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}
