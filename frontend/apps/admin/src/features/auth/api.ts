import type {
  AdminLoginRequest,
  AdminProfile,
  AdminProfileUpdate,
} from '@toast-acs/shared'
import { api } from '@toast-acs/shared'

export function adminLogin(body: AdminLoginRequest) {
  return api.post<void>('/api/admin/login', body)
}

export function adminLogout() {
  return api.post<void>('/api/admin/logout')
}

export function fetchAdminProfile(signal?: AbortSignal) {
  return api.get<AdminProfile>('/api/admin/me', signal)
}

export function updateAdminProfile(body: AdminProfileUpdate) {
  return api.patch<AdminProfile>('/api/admin/me', body)
}
