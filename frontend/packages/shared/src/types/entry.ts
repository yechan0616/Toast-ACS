export type EntryDirection = 'IN' | 'OUT'

export interface EntryRequest {
  direction: EntryDirection
}

export interface EntryResult {
  result: 'ALLOWED'
  openedAt: string
}
