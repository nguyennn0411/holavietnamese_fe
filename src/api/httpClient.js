import axios from 'axios'
import { API_BASE_URL } from './apiConfig'

let csrfPromise
export const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true })
export function resetCsrf() { csrfPromise = undefined }

async function csrf() {
  if (!csrfPromise) csrfPromise = httpClient('/csrf').catch(error => { resetCsrf(); throw error })
  return csrfPromise
}

export async function httpClient(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const bearer = localStorage.getItem('token')
  const token = bearer || ['GET', 'HEAD', 'OPTIONS'].includes(method) ? null : await csrf()
  const response = await api.request({
    url: path,
    method,
    data: options.body,
    signal: options.signal,
    validateStatus: () => true,
    headers: {
      'Content-Type': 'application/json',
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      ...(token ? { [token.headerName]: token.token } : {}),
      ...options.headers,
    },
  })

  if (response.status < 200 || response.status >= 300) {
    const body = response.data
    const error = new Error(body?.message || `Request failed (${response.status}). Please try again.`)
    error.status = response.status
    error.code = body?.code
    if (response.status === 401 || response.status === 403) resetCsrf()
    throw error
  }

  if (response.status === 204) {
    return null
  }

  return response.data || null
}
