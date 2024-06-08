export function formatDateAndTime(dateStr) {
  const date = new Date(dateStr)

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  const utcHours = date.getUTCHours()
  const hours = (utcHours % 24).toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  const endHours = ((utcHours + 1) % 24).toString().padStart(2, '0')

  return `${day}.${month}.${year} / ${hours}:${minutes}-${endHours}:${minutes}`
}
