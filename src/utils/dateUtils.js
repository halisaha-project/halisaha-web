export function formatDateAndTime(dateStr) {
  const date = new Date(dateStr)

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // JavaScript'te aylar 0'dan başlar, bu yüzden +1 ekliyoruz.
  const year = date.getFullYear()
  const hours = date.getUTCHours() // UTC+3 saat dilimine göre ayarlıyoruz.
  return `${day}-${month}-${year} / ${hours}-${hours + 1}`
}
