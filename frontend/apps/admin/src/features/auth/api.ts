import type { AdminLoginRequest } from '@toast-acs/shared'
import { api } from '@toast-acs/shared'

export function adminLogin(body: AdminLoginRequest) {
  return api.post<void>('/api/admin/login', body)
}

export function adminLogout() {
  return api.post<void>('/api/admin/logout')
}
