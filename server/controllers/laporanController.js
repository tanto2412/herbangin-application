// controllers/laporanController.js
const laporanModel = require('../models/laporanModel')
const giroModel = require('../models/giroModel')
const puppeteer = require('puppeteer')
const logger = require('../../logger')

async function penerimaan(req, res) {
  try {
    const laporanPenerimaan = await laporanModel.penerimaan(req.query)

    let penerimaanMap = new Map()
    laporanPenerimaan.forEach((item) => {
      if (penerimaanMap.has(item.receiving_id))
        penerimaanMap.set(item.receiving_id, [
          ...Array.from(penerimaanMap.get(item.receiving_id)),
          item,
        ])
      else penerimaanMap.set(item.receiving_id, [item])
    })

    // HTML template with placeholders for dynamic data
    const htmlTemplate = `
    <html>
      <head>
        <style>
          * {
            font-family: sans-serif, serif;
          }

          table {
            border-collapse: collapse;
            font-size: 13px;
            border: 1px solid;
            width: 100%;
          }

          td {
            border-collapse: collapse;
            padding: 5px;
            text-align: right;
            vertical-align: top;
          }

          td.w18 {
            width: 18%;
          }

          td.w15 {
            width: 15%;
          }

          td.w11 {
            width: 11%;
          }

          td.center {
            text-align: center;
          }

          td.right {
            text-align: right;
          }

          td.left {
            text-align: left;
          }

          th {
            border-collapse: collapse;
            padding: 5px;
          }

          th.center {
            text-align: center;
          }

          th.right {
            text-align: right;
          }

          th.left {
            text-align: left;
          }

          tr.head {
            border-collapse: collapse;
            border-bottom: 1px solid;
          }

          h1 {
            text-align: center;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <h1>LAPORAN PENERIMAAN</h1>
        <table>
          <td>
            <table>
              <tr class="head">
                <th class="center"><u>No Terima</u></th>
                <th class="center"><u>Tgl Terima</u></th>
                <th class="left"><u>Nama Barang</u></th>
                <th class="right"><u>Jumlah</u></th>
                <th class="right"><u>Harga</u></th>
                <th class="right"><u>Subtotal</u></th>
              </tr>
              ${Array.from(penerimaanMap)
                .map(([_, itemList]) =>
                  itemList
                    .map(
                      (item, index) =>
                        `<tr>
                        ${
                          index == 0
                            ? `
                          <td class="w15 center" rowspan="${itemList.length}">${item.receiving_id}</td>
                          <td class="w15 center" rowspan="${itemList.length}">${item.tanggal}</td>
                          `
                            : ''
                        }
                        <td class="w25 left">${item.nama_barang}</td>
                        <td class="w15 right">${item.jumlah_barang} ${
                          item.satuan_terkecil
                        }</td>
                        <td class="w15 right">${item.harga_satuan}</td>
                        <td class="w15 right">${item.subtotal}</td>
                      </tr>
                      `
                    )
                    .join('')
                )
                .join('')}
            </table>
          </td>
        </table>
      </body>
    </html>
    `

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Set content to the HTML template
    await page.setContent(htmlTemplate)

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: 'A4' })

    // Send the PDF buffer as the response
    res.send(pdfBuffer)

    // Close the browser
    await browser.close()
  } catch (error) {
    logger.error('Error generating PDF:', error)
    res.status(500).send('Internal Server Error')
  }
}

async function penjualan(req, res) {
  try {
    const laporanPenjualan = await laporanModel.penjualan(req.query)

    let fakturMap = new Map()
    laporanPenjualan.forEach((item) => {
      if (fakturMap.has(item.nomor_faktur))
        fakturMap.set(item.nomor_faktur, [
          ...Array.from(fakturMap.get(item.nomor_faktur)),
          item,
        ])
      else fakturMap.set(item.nomor_faktur, [item])
    })

    // HTML template with placeholders for dynamic data
    const htmlTemplate = `
    <html>
      <head>
        <style>
          * {
            font-family: sans-serif, serif;
          }

          table {
            border-collapse: collapse;
            font-size: 13px;
            border: 1px solid;
            width: 100%;
          }

          td {
            border-collapse: collapse;
            padding: 5px;
            text-align: right;
            vertical-align: top;
          }

          td.w18 {
            width: 18%;
          }

          td.w15 {
            width: 15%;
          }

          td.w11 {
            width: 11%;
          }

          td.center {
            text-align: center;
          }

          td.right {
            text-align: right;
          }

          td.left {
            text-align: left;
          }

          th {
            border-collapse: collapse;
            padding: 5px;
          }

          th.center {
            text-align: center;
          }

          th.right {
            text-align: right;
          }

          th.left {
            text-align: left;
          }

          tr.head {
            border-collapse: collapse;
            border-bottom: 1px solid;
          }

          h1 {
            text-align: center;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <h1>LAPORAN PENJUALAN</h1>
        <table>
          <td>
            <table>
              <tr class="head">
                <th class="left"><u>Nama Sales</u></th>
                <th class="center"><u>Tgl Faktur</u></th>
                <th class="center"><u>No Faktur</u></th>
                <th class="left"><u>Nama Barang</u></th>
                <th class="right"><u>Jumlah</u></th>
                <th class="right"><u>Harga</u></th>
                <th class="center"><u>Keterangan</u></th>
              </tr>
              ${Array.from(fakturMap)
                .map(([_, itemList]) =>
                  itemList
                    .map(
                      (item, index) =>
                        `<tr>
                        ${
                          index == 0
                            ? `
                          <td class="w15 left" rowspan="${itemList.length}">${item.nama}</td>
                          <td class="w15 center" rowspan="${itemList.length}">${item.tanggal}</td>
                          <td class="w11 center" rowspan="${itemList.length}">${item.nomor_faktur}</td>
                          `
                            : ''
                        }
                        <td class="w18 left">${item.nama_barang}</td>
                        <td class="w15 right">${item.jumlah_barang} ${
                          item.satuan_terkecil
                        }</td>
                        <td class="w15 right">${item.harga_satuan}</td>
                        <td class="w11 center">${item.jenis_barang}</td>
                      </tr>
                      `
                    )
                    .join('')
                )
                .join('')}
            </table>
          </td>
        </table>
      </body>
    </html>
    `

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Set content to the HTML template
    await page.setContent(htmlTemplate)

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: 'A4' })

    // Send the PDF buffer as the response
    res.send(pdfBuffer)

    // Close the browser
    await browser.close()
  } catch (error) {
    logger.error('Error generating PDF:', error)
    res.status(500).send('Internal Server Error')
  }
}

async function piutang(req, res) {
  try {
    const laporanPiutang = await laporanModel.piutang(req.query)

    let piutangMap = new Map()
    laporanPiutang.forEach((item) => {
      if (piutangMap.has(item.nama_toko))
        piutangMap.set(item.nama_toko, [
          ...Array.from(piutangMap.get(item.nama_toko)),
          item,
        ])
      else piutangMap.set(item.nama_toko, [item])
    })

    // HTML template with placeholders for dynamic data
    const htmlTemplate = `
    <html>
      <head>
        <style>
          * {
            font-family: sans-serif, serif;
          }

          table {
            border-collapse: collapse;
            font-size: 13px;
            border: 1px solid;
            width: 100%;
          }

          td {
            border-collapse: collapse;
            padding: 5px;
            text-align: right;
            vertical-align: top;
          }

          td.w18 {
            width: 18%;
          }

          td.w15 {
            width: 15%;
          }

          td.w12 {
            width: 12%;
          }

          td.center {
            text-align: center;
          }

          td.right {
            text-align: right;
          }

          td.left {
            text-align: left;
          }

          th {
            border-collapse: collapse;
            padding: 5px;
          }

          th.center {
            text-align: center;
          }

          th.right {
            text-align: right;
          }

          th.left {
            text-align: left;
          }

          tr.head {
            border-collapse: collapse;
            border-bottom: 1px solid;
          }

          h1 {
            text-align: center;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <h1>LAPORAN PIUTANG</h1>
        <table>
          <td>
            <table>
              <tr class="head">
                <th class="left"><u>Nama Pelanggan</u></th>
                <th class="center"><u>No Faktur</u></th>
                <th class="center"><u>Tgl Faktur</u></th>
                <th class="right"><u>Jumlah Tagihan</u></th>
                <th class="right"><u>Sudah Dibayar</u></th>
                <th class="right"><u>Belum Dibayar</u></th>
              </tr>
              ${Array.from(piutangMap)
                .map(([_, itemList]) =>
                  itemList
                    .map(
                      (item, index) =>
                        `<tr>
                        ${
                          index == 0
                            ? `
                          <td class="w18 left" rowspan="${itemList.length}">${item.nama_toko}</td>
                          `
                            : ''
                        }
                        <td class="w12 center">${item.nomor_faktur}</td>
                        <td class="w15 center">${item.tanggal}</td>
                        <td class="w15 right">${item.total}</td>
                        <td class="w15 right">${item.sudah_dibayar}</td>
                        <td class="w15 right">${item.belum_dibayar}</td>
                      </tr>
                      `
                    )
                    .join('')
                )
                .join('')}
            </table>
          </td>
        </table>
      </body>
    </html>
    `

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Set content to the HTML template
    await page.setContent(htmlTemplate)

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: 'A4' })

    // Send the PDF buffer as the response
    res.send(pdfBuffer)

    // Close the browser
    await browser.close()
  } catch (error) {
    logger.error('Error generating PDF:', error)
    res.status(500).send('Internal Server Error')
  }
}

async function pembayaran(req, res) {
  try {
    const laporanPembayaran = await laporanModel.pembayaran(req.query)

    let pembayaranMap = new Map()
    laporanPembayaran.forEach((item) => {
      if (pembayaranMap.has(item.nomor_faktur))
        pembayaranMap.set(item.nomor_faktur, [
          ...Array.from(pembayaranMap.get(item.nomor_faktur)),
          item,
        ])
      else pembayaranMap.set(item.nomor_faktur, [item])
    })

    // HTML template with placeholders for dynamic data
    const htmlTemplate = `
    <html>
      <head>
        <style>
          * {
            font-family: sans-serif, serif;
          }

          table {
            border-collapse: collapse;
            font-size: 13px;
            border: 1px solid;
            width: 100%;
          }

          td {
            border-collapse: collapse;
            padding: 5px;
            text-align: right;
            vertical-align: top;
          }

          td.w10 {
            width: 10%;
          }

          td.w11 {
            width: 11%;
          }


          td.w15 {
            width: 15%;
          }

          td.w12 {
            width: 12%;
          }

          td.center {
            text-align: center;
          }

          td.right {
            text-align: right;
          }

          td.left {
            text-align: left;
          }

          th {
            border-collapse: collapse;
            padding: 5px;
          }

          th.center {
            text-align: center;
          }

          th.right {
            text-align: right;
          }

          th.left {
            text-align: left;
          }

          tr.head {
            border-collapse: collapse;
            border-bottom: 1px solid;
          }

          h1 {
            text-align: center;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <h1>LAPORAN PEMBAYARAN</h1>
        <table>
          <td>
            <table>
              <tr class="head">
                <th class="left"><u>Sales</u></th>
                <th class="center"><u>No Faktur</u></th>
                <th class="left"><u>Pelanggan</u></th>
                <th class="center"><u>No Bayar</u></th>
                <th class="center"><u>Tanggal Bayar</u></th>
                <th class="right"><u>Besar Pembayaran</u></th>
                <th class="left"><u>Keterangan</u></th>
                <th class="center"><u>Status Komisi</u></th>
              </tr>
              ${Array.from(pembayaranMap)
                .map(([_, itemList]) =>
                  itemList
                    .map(
                      (item, index) =>
                        `<tr>
                        ${
                          index == 0
                            ? `
                          <td class="w15 left" rowspan="${itemList.length}">${item.nama}</td>
                          <td class="w12 center" rowspan="${itemList.length}">${item.nomor_faktur}</td>
                          <td class="w15 left" rowspan="${itemList.length}">${item.nama_toko}</td>
                          `
                            : ''
                        }
                        <td class="w10 center">${item.id}</td>
                        <td class="w11 center">${item.tanggal}</td>
                        <td class="w12 right">${item.jumlah_pembayaran}</td>
                        <td class="w15 left">${item.remarks}</td>
                        <td class="w10 center">${
                          item.komisi ? 'DAPAT' : 'TIDAK'
                        }</td>
                      </tr>
                      `
                    )
                    .join('')
                )
                .join('')}
            </table>
          </td>
        </table>
      </body>
    </html>
    `

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Set content to the HTML template
    await page.setContent(htmlTemplate)

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: 'A4' })

    // Send the PDF buffer as the response
    res.send(pdfBuffer)

    // Close the browser
    await browser.close()
  } catch (error) {
    logger.error('Error generating PDF:', error)
    res.status(500).send('Internal Server Error')
  }
}

async function giroDitolak(req, res) {
  try {
    const laporanGiroDitolak = await laporanModel.giro(
      req.query,
      giroModel.StatusPembayaran.DITOLAK
    )

    const htmlTemplate = await createGiroHtml(laporanGiroDitolak)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Set content to the HTML template
    await page.setContent(htmlTemplate)

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: 'A4' })

    // Send the PDF buffer as the response
    res.send(pdfBuffer)

    // Close the browser
    await browser.close()
  } catch (error) {
    logger.error('Error generating PDF:', error)
    res.status(500).send('Internal Server Error')
  }
}

async function giroBlmDibayar(req, res) {
  try {
    const laporanGiroBlmDibayar = await laporanModel.giro(
      req.query,
      giroModel.StatusPembayaran.BELUM_LUNAS
    )

    const htmlTemplate = await createGiroHtml(laporanGiroBlmDibayar)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Set content to the HTML template
    await page.setContent(htmlTemplate)

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: 'A4' })

    // Send the PDF buffer as the response
    res.send(pdfBuffer)

    // Close the browser
    await browser.close()
  } catch (error) {
    logger.error('Error generating PDF:', error)
    res.status(500).send('Internal Server Error')
  }
}

async function createGiroHtml(laporanGiro) {
  // HTML template with placeholders for dynamic data
  return `
  <html>
    <head>
      <style>
        * {
          font-family: sans-serif, serif;
        }

        table {
          border-collapse: collapse;
          font-size: 13px;
          border: 1px solid;
          width: 100%;
        }

        td {
          border-collapse: collapse;
          padding: 5px;
          text-align: right;
          vertical-align: top;
        }

        td.w18 {
          width: 18%;
        }

        td.w15 {
          width: 15%;
        }

        td.w11 {
          width: 11%;
        }

        td.center {
          text-align: center;
        }

        td.right {
          text-align: right;
        }

        td.left {
          text-align: left;
        }

        th {
          border-collapse: collapse;
          padding: 5px;
        }

        th.center {
          text-align: center;
        }

        th.right {
          text-align: right;
        }

        th.left {
          text-align: left;
        }

        tr.head {
          border-collapse: collapse;
          border-bottom: 1px solid;
        }

        h1 {
          text-align: center;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <h1>LAPORAN GIRO PENJUALAN BELUM DIBAYAR</h1>
      <table>
        <td>
          <table>
            <tr class="head">
              <th class="left"><u>No Giro</u></th>
              <th class="left"><u>Bank</u></th>
              <th class="center"><u>Tgl Jatuh Tempo</u></th>
              <th class="right"><u>Jumlah Bayar</u></th>
              <th class="center"><u>No Bayar</u></th>
              <th class="center"><u>No Faktur</u></th>
              <th class="left"><u>Pelanggan</u></th>
            </tr>
            ${laporanGiro
              .map(
                (giro) =>
                  `<tr>
                    <td class="w11 left">${giro.nomor_giro}</td>
                    <td class="w15 left">${giro.nama_bank}</td>
                    <td class="w18 center">${giro.tanggal_jatuh_tempo}</td>
                    <td class="w15 right">${giro.jumlah_pembayaran}</td>
                    <td class="w11 center">${giro.nomor_pembayaran}</td>
                    <td class="w11 center">${giro.nomor_faktur}</td>
                    <td class="w18 left">${giro.nama_toko}</td>
                  </tr>
                  `
              )
              .join('')}
          </table>
        </td>
      </table>
    </body>
  </html>
  `
}

async function retur(req, res) {
  try {
    const laporanRetur = await laporanModel.retur(req.query)

    let returMap = new Map()
    laporanRetur.forEach((item) => {
      if (returMap.has(item.retur_id))
        returMap.set(item.retur_id, [
          ...Array.from(returMap.get(item.retur_id)),
          item,
        ])
      else returMap.set(item.retur_id, [item])
    })

    // HTML template with placeholders for dynamic data
    const htmlTemplate = `
    <html>
      <head>
        <style>
          * {
            font-family: sans-serif, serif;
          }

          table {
            border-collapse: collapse;
            font-size: 13px;
            border: 1px solid;
            width: 100%;
          }

          td {
            border-collapse: collapse;
            padding: 5px;
            text-align: right;
            vertical-align: top;
          }

          td.w19 {
            width: 19%;
          }

          td.w15 {
            width: 15%;
          }

          td.w12 {
            width: 12%;
          }

          td.center {
            text-align: center;
          }

          td.right {
            text-align: right;
          }

          td.left {
            text-align: left;
          }

          th {
            border-collapse: collapse;
            padding: 5px;
          }

          th.center {
            text-align: center;
          }

          th.right {
            text-align: right;
          }

          th.left {
            text-align: left;
          }

          tr.head {
            border-collapse: collapse;
            border-bottom: 1px solid;
          }

          h1 {
            text-align: center;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <h1>LAPORAN PENERIMAAN</h1>
        <table>
          <td>
            <table>
              <tr class="head">
                <th class="center"><u>No Retur</u></th>
                <th class="center"><u>Tgl Retur</u></th>
                <th class="center"><u>No Faktur</u></th>
                <th class="left"><u>Pelanggan</u></th>
                <th class="left"><u>Sales</u></th>
                <th class="left"><u>Nama Barang</u></th>
                <th class="right"><u>Jumlah</u></th>
              </tr>
              ${Array.from(returMap)
                .map(([_, itemList]) =>
                  itemList
                    .map(
                      (item, index) =>
                        `<tr>
                        ${
                          index == 0
                            ? `
                          <td class="w12 center" rowspan="${itemList.length}">${item.retur_id}</td>
                          <td class="w12 center" rowspan="${itemList.length}">${item.tanggal}</td>
                          <td class="w12 center" rowspan="${itemList.length}">${item.nomor_faktur}</td>
                          <td class="w15 left" rowspan="${itemList.length}">${item.nama_toko}</td>
                          <td class="w15 left" rowspan="${itemList.length}">${item.nama}</td>
                          `
                            : ''
                        }
                        <td class="w19 left">${item.nama_barang}</td>
                        <td class="w15 right">${item.jumlah_barang} ${
                          item.satuan_terkecil
                        }</td>
                        
                      </tr>
                      `
                    )
                    .join('')
                )
                .join('')}
            </table>
          </td>
        </table>
      </body>
    </html>
    `

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Set content to the HTML template
    await page.setContent(htmlTemplate)

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: 'A4' })

    // Send the PDF buffer as the response
    res.send(pdfBuffer)

    // Close the browser
    await browser.close()
  } catch (error) {
    logger.error('Error generating PDF:', error)
    res.status(500).send('Internal Server Error')
  }
}

module.exports = {
  penerimaan,
  penjualan,
  pembayaran,
  giroBlmDibayar,
  giroDitolak,
  piutang,
  retur,
}
