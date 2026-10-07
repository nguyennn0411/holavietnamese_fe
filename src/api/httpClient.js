const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api'

let csrfPromise
export function resetCsrf() { csrfPromise = undefined }

async function csrf() {
  if (!csrfPromise) csrfPromise = httpClient('/csrf').catch(error => { resetCsrf(); throw error })
  return csrfPromise
}

export async function httpClient(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const token = ['GET', 'HEAD', 'OPTIONS'].includes(method) ? null : await csrf()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { [token.headerName]: token.token } : {}),
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
