import type { EntryDirection, EntryResult } from '@toast-acs/shared'
import { api } from '@toast-acs/shared'

export function requestEntry(direction: EntryDirection) {
  return api.post<EntryResult>('/api/entries', { direction })
}
