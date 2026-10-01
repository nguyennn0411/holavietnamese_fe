import { httpClient, resetCsrf } from '@/api/httpClient'
export const sessionService = {
  current: () => httpClient('/me/session'),
  async login(email, password) {
    await httpClient('/login', { method: 'POST', body: new URLSearchParams({ username: email, password }), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    resetCsrf()
  },
  async logout() { await httpClient('/logout', { method: 'POST' }); resetCsrf() },
}
