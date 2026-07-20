const STORAGE_KEY = 'acs-pass-request'

export function getStoredRequestId() {
  return typeof window === 'undefined'
    ? null
    : localStorage.getItem(STORAGE_KEY)
}

export function storeRequestId(requestId: string) {
  localStorage.setItem(STORAGE_KEY, requestId)
}

export function clearStoredRequestId() {
  localStorage.removeItem(STORAGE_KEY)
}
