// controllers/laporanController.js
const laporanModel = require('../models/laporanModel')
const giroModel = require('../models/giroModel')
const returModel = require('../models/returModel')
const rupiahFormatter = require('../utils/converter')
const puppeteer = require('puppeteer')
const logger = require('../../logger')

async function penerimaan(req, res) {
  try {
    const laporanPenerimaan = await laporanModel.penerimaan(req.query)

    let penerimaanMap = new Map()
    let grandTotal = 0
    laporanPenerimaan.forEach((item) => {
      grandTotal += Number(item.subtotal)
      if (penerimaanMap.has(item.receiving_id)) {
        let penerimaan = penerimaanMap.get(item.receiving_id)
        penerimaan.items.push(item)
        penerimaan.subtotal += Number(item.subtotal)
        penerimaanMap.set(item.receiving_id, penerimaan)
      } else
        penerimaanMap.set(item.receiving_id, {
          items: [item],
          subtotal: Number(item.subtotal),
        })
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

          td.subtotal {
            padding-top: 10px;
            padding-bottom: 10px;
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

          tr.foot {
            border-collapse: collapse;
            border-top: 1px solid;
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
                .map(
                  ([_, penerimaan]) =>
                    penerimaan.items
                      .map(
                        (item, index) =>
                          `<tr>
                        ${
                          index == 0
                            ? `
                          <td class="w15 center" rowspan="${penerimaan.items.length}">${item.receiving_id}</td>
                          <td class="w15 center" rowspan="${penerimaan.items.length}">${item.tanggal}</td>
                          `
                            : ''
                        }
                        <td class="w25 left">${item.nama_barang}</td>
                        <td class="w15 right">${item.jumlah_barang} ${
                            item.satuan_terkecil
                          }</td>
                        <td class="w15 right">${rupiahFormatter.format(
                          item.harga_satuan
                        )}</td>
                        <td class="w15 right">${rupiahFormatter.format(
                          item.subtotal
                        )}</td>
                      </tr>
                      `
                      )
                      .join('') +
                    `<tr>
                      <td class="right subtotal" colspan="5"><b>Subtotal :</b></td>
                      <td class="subtotal"><b>${rupiahFormatter.format(
                        penerimaan.subtotal
                      )}</b></td>
                    </tr>`
                )
                .join('')}
              <tr class="foot">
                <td class="right subtotal" colspan="5"><b>Grand Total :</b></td>
                <td class="subtotal"><b>${rupiahFormatter.format(
                  grandTotal
                )}</b></td>
              </tr>
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
    let grandTotal = 0
    laporanPenjualan.forEach((item) => {
      grandTotal += Number(item.subtotal)
      if (fakturMap.has(item.nomor_faktur)) {
        let faktur = fakturMap.get(item.nomor_faktur)
        faktur.items.push(item)
        faktur.subtotal += Number(item.subtotal)
        fakturMap.set(item.nomor_faktur, faktur)
      } else
        fakturMap.set(item.nomor_faktur, {
          items: [item],
          subtotal: Number(item.subtotal),
        })
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

          td.subtotal {
            padding-top: 10px;
            padding-bottom: 10px;
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

          tr.foot {
            border-collapse: collapse;
            border-top: 1px solid;
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
                .map(
                  ([_, faktur]) =>
                    faktur.items
                      .map(
                        (item, index) =>
                          `<tr>
                        ${
                          index == 0
                            ? `
                          <td class="w15 left" rowspan="${faktur.items.length}">${item.nama}</td>
                          <td class="w15 center" rowspan="${faktur.items.length}">${item.tanggal}</td>
                          <td class="w11 center" rowspan="${faktur.items.length}">${item.nomor_faktur}</td>
                          `
                            : ''
                        }
                        <td class="w18 left">${item.nama_barang}</td>
                        <td class="w15 right">${item.jumlah_barang} ${
                            item.satuan_terkecil
                          }</td>
                        <td class="w15 right">${rupiahFormatter.format(
                          item.harga_satuan
                        )}</td>
                        <td class="w11 center">${item.jenis_barang}</td>
                      </tr>
                      `
                      )
                      .join('') +
                    `<tr>
                      <td class="right subtotal" colspan="5"><b>Subtotal :</b></td>
                      <td class="subtotal"><b>${rupiahFormatter.format(
                        faktur.subtotal
                      )}</b></td>
                    </tr>`
                )
                .join('')}
                <tr class="foot">
                  <td class="right subtotal" colspan="5"><b>Grand Total :</b></td>
                  <td class="subtotal"><b>${rupiahFormatter.format(
                    grandTotal
                  )}</b></td>
                </tr>
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

    const orderIds = laporanPiutang.map((piutang) =>
      Number(piutang.nomor_faktur)
    )
    const returs = await returModel.getByOrderIds(orderIds)
    let returMap = new Map()
    returs.forEach((retur) => {
      if (returMap.has(retur.nomor_faktur)) {
        returMap.set(
          retur.nomor_faktur,
          returMap.get(retur.nomor_faktur) + Number(retur.total)
        )
      } else {
        returMap.set(retur.nomor_faktur, Number(retur.total))
      }
    })

    let piutangMap = new Map()
    let grandTotal = 0
    let grandTotalBelumDibayar = 0
    let grandTotalSudahDibayar = 0
    laporanPiutang.forEach((piutang) => {
      let item = piutang
      item.total -= returMap.get(Number(piutang.nomor_faktur)) | 0
      item.belum_dibayar -= returMap.get(Number(piutang.nomor_faktur)) | 0
      grandTotal += Number(item.total)
      grandTotalBelumDibayar += Number(item.belum_dibayar)
      grandTotalSudahDibayar += Number(item.sudah_dibayar)
      if (piutangMap.has(item.customer_id)) {
        let piutang = piutangMap.get(item.customer_id)
        piutang.items.push(item)
        piutang.subtotal += Number(item.total)
        piutang.belum_dibayar += Number(item.belum_dibayar)
        piutang.sudah_dibayar += Number(item.sudah_dibayar)
        piutangMap.set(item.customer_id, piutang)
      } else
        piutangMap.set(item.customer_id, {
          items: [item],
          subtotal: Number(item.total),
          belum_dibayar: Number(item.belum_dibayar),
          sudah_dibayar: Number(item.sudah_dibayar),
        })
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

          td.subtotal {
            padding-top: 10px;
            padding-bottom: 10px;
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

          tr.foot {
            border-collapse: collapse;
            border-top: 1px solid;
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
                .map(
                  ([_, piutang]) =>
                    piutang.items
                      .map(
                        (item, index) =>
                          `<tr>
                        ${
                          index == 0
                            ? `
                          <td class="w18 left" rowspan="${piutang.items.length}">${item.nama_toko}</td>
                          `
                            : ''
                        }
                        <td class="w12 center">${item.nomor_faktur}</td>
                        <td class="w15 center">${item.tanggal}</td>
                        <td class="w15 right">${rupiahFormatter.format(
                          item.total
                        )}</td>
                        <td class="w15 right">${rupiahFormatter.format(
                          item.sudah_dibayar
                        )}</td>
                        <td class="w15 right">${rupiahFormatter.format(
                          item.belum_dibayar
                        )}</td>
                      </tr>
                      `
                      )
                      .join('') +
                    `<tr>
                      <td class="right subtotal" colspan="3"><b>Subtotal :</b></td>
                      <td class="subtotal"><b>${rupiahFormatter.format(
                        piutang.subtotal
                      )}</b></td>
                      <td class="subtotal"><b>${rupiahFormatter.format(
                        piutang.sudah_dibayar
                      )}</b></td>
                      <td class="subtotal"><b>${rupiahFormatter.format(
                        piutang.belum_dibayar
                      )}</b></td>
                    </tr>`
                )
                .join('')}
                <tr class="foot">
                  <td class="right subtotal" colspan="3"><b>Grand Total :</b></td>
                  <td class="subtotal"><b>${rupiahFormatter.format(
                    grandTotal
                  )}</b></td>
                  <td class="subtotal"><b>${rupiahFormatter.format(
                    grandTotalSudahDibayar
                  )}</b></td>
                  <td class="subtotal"><b>${rupiahFormatter.format(
                    grandTotalBelumDibayar
                  )}</b></td>
                </tr>
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
    let grandTotal = 0
    laporanPembayaran.forEach((item) => {
      grandTotal += Number(item.jumlah_pembayaran)
      if (pembayaranMap.has(item.nomor_faktur)) {
        let pembayaran = pembayaranMap.get(item.nomor_faktur)
        pembayaran.items.push(item)
        pembayaran.subtotal += Number(item.jumlah_pembayaran)
        pembayaran.subtotal_lunas +=
          item.status_pembayaran === 'LUNAS'
            ? Number(item.jumlah_pembayaran)
            : 0
        pembayaranMap.set(item.nomor_faktur, pembayaran)
      } else
        pembayaranMap.set(item.nomor_faktur, {
          items: [item],
          nomor_faktur: item.nomor_faktur,
          nama_toko: item.nama_toko,
          nama: item.nama,
          tanggal_faktur: item.tanggal_faktur,
          komisi: item.komisi,
          total_faktur: item.total,
          subtotal: Number(item.jumlah_pembayaran),
          subtotal_lunas:
            item.status_pembayaran === 'LUNAS'
              ? Number(item.jumlah_pembayaran)
              : 0,
        })
    })

    const orderIds = Array.from(pembayaranMap.keys())
    const returs = await returModel.getByOrderIds(orderIds)
    let returMap = new Map()
    returs.forEach((retur) => {
      if (returMap.has(retur.nomor_faktur)) {
        returMap.set(
          retur.nomor_faktur,
          returMap.get(retur.nomor_faktur) + Number(retur.total)
        )
      } else {
        returMap.set(retur.nomor_faktur, Number(retur.total))
      }
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

          table.no-border {
            border: 0px;
          }

          td {
            border-collapse: collapse;
            padding: 5px;
            text-align: right;
            vertical-align: top;
          }

          td.p10 {
            padding: 10px;
          }

          td.w5 {
            width: 5%;
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

          td.w20 {
            width: 20%;
          }

          td.w30 {
            width: 30%;
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

          td.subtotal {
            padding-top: 10px;
            padding-bottom: 10px;
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

          tr.foot {
            border-collapse: collapse;
            border-top: 1px solid;
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
            ${Array.from(pembayaranMap)
              .map(
                ([_, pembayaran]) =>
                  `<table><td class="p10">
                    <table class="no-border">
                      <tr><td class="left" colspan="6"><b>Nama Penjual : ${
                        pembayaran.nama
                      }</b></td></tr>
                      <tr>
                        <td class="w5"></td>
                        <td class="w20 left">Nomor Faktur :</td>
                        <td class="w30 left">${pembayaran.nomor_faktur}</td>
                        <td class="w20 left">Tanggal Faktur :</td>
                        <td class="w20 left">${pembayaran.tanggal_faktur}</td>
                        <td class="w5 left"></td>
                      </tr>
                      <tr>
                        <td class="w5"></td>
                        <td class="w20 left">Nama Pelanggan :</td>
                        <td class="w30 left">${pembayaran.nama_toko}</td>
                        <td class="w20 left">Status Pembayaran :</td>
                        <td class="w20 left">${
                          Number(pembayaran.subtotal_lunas) <
                          Number(pembayaran.total_faktur) -
                            (returMap.get(Number(pembayaran.nomor_faktur)) | 0)
                            ? 'BELUM LUNAS'
                            : 'LUNAS'
                        }</td>
                        <td class="w5"></td>
                      </tr>
                      <tr>
                        <td class="w5"></td>
                        <td class="w20 left">Nama Sales :</td>
                        <td class="w30 left">${pembayaran.nama}</td>
                        <td class="w20 left">Status Komisi :</td>
                        <td class="w20 left">${
                          pembayaran.komisi ? 'DAPAT' : 'TIDAK'
                        }</td>
                        <td class="w5"></td>
                      </tr>
                    </table>
                    ` +
                  `<table>
                      <tr class="head">
                        <th class="center"><u>No Bayar</u></th>
                        <th class="left"><u>Cara Pembayaran</u></th>
                        <th class="right"><u>Besar Pembayaran</u></th>
                        <th class="center"><u>Tgl Bayar</u></th>
                        <th class="left"><u>Bank</u></th>
                        <th class="left"><u>No Giro</u></th>
                        <th class="left"><u>Keterangan</u></th>
                      </tr>
                    ` +
                  pembayaran.items
                    .map(
                      (item) =>
                        `<tr>
                            <td class="w12 center">${item.id}</td>
                            <td class="w12 left">${item.jenis_pembayaran}</td>
                            <td class="w20 right">${rupiahFormatter.format(
                              item.jumlah_pembayaran
                            )}</td>
                            <td class="w12 center">${item.tanggal}</td>
                            <td class="w12 left">${
                              item.nama_bank ? item.nama_bank : ''
                            }</td>
                            <td class="w12 left">${
                              item.nomor_giro ? item.nomor_giro : ''
                            }</td>
                            <td class="w20 left">${
                              item.remarks ? item.remarks : ''
                            }</td>
                          </tr>
                          `
                    )
                    .join('') +
                  `<tr>
                    <td class="right subtotal" colspan="2"><b>Subtotal :</b></td>
                    <td class="subtotal"><b>${rupiahFormatter.format(
                      pembayaran.subtotal
                    )}</b></td>
                  </tr></table>
                </td></table>`
              )
              .join('')}
            <table>
              <tr>
                <td class="w30 right"><b>Grand Total : </b></td>
                <td class="left"><b>${rupiahFormatter.format(
                  grandTotal
                )}</b></td>
              </tr>
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

    const grandTotal = laporanGiroDitolak.reduce(
      (a, b) => a + Number(b.jumlah_pembayaran),
      0
    )

    const htmlTemplate = await createGiroHtml(
      laporanGiroDitolak,
      giroModel.StatusPembayaran.DITOLAK,
      grandTotal
    )

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

    const grandTotal = laporanGiroBlmDibayar.reduce(
      (a, b) => a + Number(b.jumlah_pembayaran),
      0
    )

    const htmlTemplate = await createGiroHtml(
      laporanGiroBlmDibayar,
      giroModel.StatusPembayaran.BELUM_LUNAS,
      grandTotal
    )

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

async function createGiroHtml(laporanGiro, status, grandTotal) {
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

        td.subtotal {
          padding-top: 10px;
          padding-bottom: 10px;
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

        tr.foot {
          border-collapse: collapse;
          border-top: 1px solid;
        }

        h1 {
          text-align: center;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <h1>LAPORAN GIRO PENJUALAN ${
        status === giroModel.StatusPembayaran.BELUM_LUNAS
          ? 'BELUM DIBAYAR'
          : 'DITOLAK'
      }</h1>
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
                    <td class="w15 right">${rupiahFormatter.format(
                      giro.jumlah_pembayaran
                    )}</td>
                    <td class="w11 center">${giro.nomor_pembayaran}</td>
                    <td class="w11 center">${giro.nomor_faktur}</td>
                    <td class="w18 left">${giro.nama_toko}</td>
                  </tr>
                  `
              )
              .join('')}
              <tr class="foot">
                <td class="right subtotal" colspan="3"><b>Grand Total :</b></td>
                <td class="subtotal"><b>${rupiahFormatter.format(
                  grandTotal
                )}</b></td>
              </tr>
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

          td.subtotal {
            padding-top: 10px;
            padding-bottom: 10px;
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

          tr.foot {
            border-collapse: collapse;
            border-top: 1px solid;
          }

          h1 {
            text-align: center;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <h1>LAPORAN RETUR</h1>
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
