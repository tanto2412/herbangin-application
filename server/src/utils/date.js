function isAlreadyTutupBuku(epochMillis) {
  let date = new Date()
  date.setMonth(date.getMonth() - 1)
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const comparedDate = new Date(Number(epochMillis))

  return comparedDate < firstDay
}

module.exports = {
  isAlreadyTutupBuku,
}
