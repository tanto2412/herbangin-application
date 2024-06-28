// checkMiddleware

function addPdfHeaders() {
  return (req, res, next) => {
    const routeName = req.path.replace('/', '')

    // Get the current date and time in DDMMYY-hhmmss format
    const timestamp = new Date()
      .toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(/\/|,|\s|:|\./g, '') // Remove slashes, commas, spaces, and colons

    const filename = `${routeName}-${timestamp}`
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}.pdf"`,
    )
    next()
  }
}

module.exports = {
  addPdfHeaders,
}
