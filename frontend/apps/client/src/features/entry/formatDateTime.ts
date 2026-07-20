const pad = (value: number) => String(value).padStart(2, '0')

export function formatDateTime(iso: string) {
  const date = new Date(iso)
  return `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
