export const epochmillisToDate = (epochMillis: number) => {
  const date: Date = new Date(Number(epochMillis))
  const formattedDate: string = new Intl.DateTimeFormat('id-ID').format(date)
  return formattedDate
}

export const epochmillisToInputDate = (epochMillis: number) => {
  const date: Date = new Date(Number(epochMillis))
  const dateString: string = new Intl.DateTimeFormat('id-ID').format(date)
  const [day, month, year] = dateString.split('/').map(Number)
  const formattedDate =
    year +
    '-' +
    String(month).padStart(2, '0') +
    '-' +
    String(day).padStart(2, '0')
  return formattedDate
}

export const dateToEpochmillis = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date: Date = new Date(year, month - 1, day) // Month is 0-based in JavaScript Date constructor
  const epochMillis: number = date.getTime()
  return epochMillis
}
