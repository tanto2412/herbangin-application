// models/rekapModel.js
const knex = require('../../knexInstance')
const productModel = require('./productModel')
const logger = require('../../logger')

async function penerimaan({ product = null, from = null, to = null }) {
  return await knex('receiving_item')
    .select(
      'receiving_item.receiving_id',
      knex.raw(
        "to_char(to_timestamp(receiving.tanggal / 1000), 'dd-mm-yyyy') as tanggal"
      ),
      'product.nama_barang',
      'receiving_item.jumlah_barang',
      'receiving_item.satuan_terkecil',
      'receiving_item.subtotal'
    )
    .leftJoin('receiving', 'receiving.id', '=', 'receiving_item.receiving_id')
    .leftJoin('product', 'product.id', '=', 'receiving_item.product_id')
    .where((builder) => {
      if (from && to) {
        builder.whereBetween('receiving.tanggal', [
          from,
          Number(to) + 24 * 60 * 60 * 1000 - 1,
        ])
      }

      if (product) {
        builder.andWhere(
          'receiving_item.product_id',
          knex.raw('COALESCE(?, receiving_item.product_id)', product)
        )
      }
    })
    .orderBy('receiving.id', 'asc')
    .orderBy('receiving_item.product_id', 'asc')
    .then((rows) => {
      return rows
    })
    .catch((error) => {
      logger.error(error)
      return []
    })
}

async function penjualan({
  sales = null,
  product = null,
  customer = null,
  from = null,
  to = null,
}) {
  return await knex('order_item')
    .select(
      'sales.nama',
      knex.raw(
        'to_char(to_timestamp("order".tanggal_faktur / 1000), \'dd-mm-yyyy\') as tanggal'
      ),
      knex.raw(
        'to_char("order".nomor_faktur, \'fm00000000000\') AS nomor_faktur'
      ),
      'customer.nama_toko',
      'product.nama_barang',
      'order_item.jumlah_barang',
      'order_item.satuan_terkecil',
      'order_item.subtotal'
    )
    .leftJoin('order', 'order.nomor_faktur', '=', 'order_item.nomor_faktur')
    .leftJoin('sales', 'sales.id', '=', 'order.sales_id')
    .leftJoin('product', 'product.id', '=', 'order_item.product_id')
    .leftJoin('customer', 'customer.id', '=', 'order.customer_id')
    .where((builder) => {
      if (from && to) {
        builder.whereBetween('order.tanggal_faktur', [
          from,
          Number(to) + 24 * 60 * 60 * 1000 - 1,
        ])
      }

      if (sales) {
        builder.andWhere('sales.id', knex.raw('COALESCE(?, sales.id)', sales))
      }

      if (product) {
        builder.andWhere(
          'order_item.product_id',
          knex.raw('COALESCE(?, order_item.product_id)', product)
        )
      }

      if (customer)
        builder.andWhere(
          'order.customer_id',
          knex.raw('COALESCE(?, "order".customer_id)', customer)
        )
    })
    .orderBy('order.nomor_faktur', 'asc')
    .orderBy('order_item.product_id', 'asc')
    .then((rows) => {
      return rows
    })
    .catch((error) => {
      logger.error(error)
      return []
    })
}

async function pembayaran({
  sales = null,
  product = null,
  customer = null,
  from = 0,
  to = 0,
}) {
  return await knex('payment')
    .select(
      'order.sales_id',
      'order.customer_id',
      'sales.nama',
      'payment.id',
      knex.raw(
        "to_char(payment.nomor_faktur, 'fm00000000000') AS nomor_faktur"
      ),
      'customer.nama_toko',
      knex.raw(
        "to_char(to_timestamp(payment.tanggal / 1000), 'dd-mm-yyyy') as tanggal"
      ),
      'payment.jumlah_pembayaran',
      'payment.jenis_pembayaran as remarks',
      knex.raw(
        `EXISTS(
      SELECT 1
      FROM order_item
      LEFT JOIN product ON product.id = order_item.product_id
      WHERE "order".nomor_faktur = payment.nomor_faktur AND (product.jenis_barang = ? OR (payment.tanggal < "order".tanggal_faktur + (CAST(product.batas_fast_moving AS BIGINT) * 24 * 60 * 60 * 1000)))
    ) AS komisi`,
        productModel.JenisBarang.SLOW_MOVING
      )
    )
    .leftJoin('order', 'order.nomor_faktur', '=', 'payment.nomor_faktur')
    .leftJoin('sales', 'sales.id', '=', 'order.sales_id')
    .leftJoin('customer', 'customer.id', '=', 'order.customer_id')
    .where((builder) => {
      if (product) {
        builder.whereExists(
          knex('order_item')
            .select('*')
            .where(
              'order_item.nomor_faktur',
              '=',
              knex.raw('"order".nomor_faktur')
            )
            .andWhere('order_item.product_id', '=', product)
        )
      }

      if (from && to) {
        builder.andWhereBetween('payment.tanggal', [
          from,
          Number(to) + 24 * 60 * 60 * 1000 - 1,
        ])
      }

      if (sales) {
        builder.andWhere('sales.id', knex.raw('COALESCE(?, sales.id)', sales))
      }

      if (customer)
        builder.andWhere(
          'order.customer_id',
          knex.raw('COALESCE(?, "order".customer_id)', customer)
        )
    })
    .orderBy('payment.id', 'asc')
    .orderBy('order.nomor_faktur', 'asc')
    .then((rows) => {
      return rows
    })
    .catch((error) => {
      logger.error(error)
      return []
    })
}

async function piutang({
  product = null,
  customer = null,
  sales = null,
  from = null,
  to = null,
}) {
  return await knex('order')
    .select(
      'order.customer_id',
      'order.sales_id',
      'customer.nama_toko',
      'sales.nama',
      knex.raw(
        'to_char("order".nomor_faktur, \'fm00000000000\') AS nomor_faktur'
      ),
      knex.raw(
        'to_char(to_timestamp("order".tanggal_faktur / 1000), \'dd-mm-yyyy\') as tanggal'
      ),
      'order.total',
      knex.raw('sum(payment.jumlah_pembayaran) as sudah_dibayar'),
      knex.raw(
        '"order".total - sum(payment.jumlah_pembayaran) as belum_dibayar'
      )
    )
    .leftJoin('sales', 'sales.id', '=', 'order.sales_id')
    .leftJoin('customer', 'customer.id', '=', 'order.customer_id')
    .leftJoin('payment', 'payment.nomor_faktur', '=', 'order.nomor_faktur')
    .where((builder) => {
      if (product) {
        builder.whereExists(
          knex('order_item')
            .select('*')
            .where(
              'order_item.nomor_faktur',
              '=',
              knex.raw('"order".nomor_faktur')
            )
            .andWhere('order_item.product_id', '=', product)
        )
      }

      if (from && to) {
        builder.andWhereBetween('order.tanggal_faktur', [
          from,
          Number(to) + 24 * 60 * 60 * 1000 - 1,
        ])
      }

      if (customer)
        builder.andWhere(
          'order.customer_id',
          knex.raw('COALESCE(?, "order".customer_id)', customer)
        )

      if (sales)
        builder.andWhere(
          'order.sales_id',
          knex.raw('COALESCE(?, "order".sales_id)', sales)
        )
    })
    .groupBy(
      'customer.nama_toko',
      'sales.nama',
      'order.nomor_faktur',
      'order.tanggal_faktur',
      'order.total'
    )
    .then((rows) => {
      return rows
    })
    .catch((error) => {
      logger.error(error)
      return []
    })
}

async function giro(
  { product = null, sales = null, customer = null, from = null, to = null },
  status_pembayaran
) {
  return await knex('giro')
    .select(
      'giro.nomor_giro',
      'payment.nama_bank',
      knex.raw(
        "to_char(to_timestamp(giro.tanggal_jatuh_tempo / 1000), 'dd-mm-yyyy') as tanggal_jatuh_tempo"
      ),
      'payment.jumlah_pembayaran',
      'giro.nomor_pembayaran',
      knex.raw("to_char(giro.nomor_faktur, 'fm00000000000') AS nomor_faktur"),
      'customer.nama_toko'
    )
    .leftJoin('payment', 'payment.id', '=', 'giro.nomor_pembayaran')
    .leftJoin('order', 'order.nomor_faktur', '=', 'giro.nomor_faktur')
    .leftJoin('customer', 'customer.id', '=', 'order.customer_id')
    .where((builder) => {
      if (product) {
        builder.whereExists(
          knex('order_item')
            .select('*')
            .where(
              'order_item.nomor_faktur',
              '=',
              knex.raw('"order".nomor_faktur')
            )
            .andWhere('order_item.product_id', '=', product)
        )
      }

      if (from && to) {
        builder.andWhereBetween('giro.tanggal', [
          from,
          Number(to) + 24 * 60 * 60 * 1000 - 1,
        ])
      }

      if (sales) {
        builder.andWhere('sales.id', knex.raw('COALESCE(?, sales.id)', sales))
      }

      if (customer)
        builder.andWhere(
          'customer.id',
          knex.raw('COALESCE(?, customerid)', customer)
        )

      builder.where('giro.status_pembayaran', status_pembayaran)
    })
    .orderBy('giro.nomor_pembayaran', 'asc')
    .orderBy('giro.nomor_faktur', 'asc')
    .then((rows) => {
      return rows
    })
    .catch((error) => {
      logger.error(error)
      return []
    })
}

async function retur({
  sales = null,
  product = null,
  customer = null,
  from = null,
  to = null,
}) {
  return await knex('retur_item')
    .select(
      'retur_item.retur_id',
      knex.raw(
        "to_char(to_timestamp(retur.tanggal / 1000), 'dd-mm-yyyy') as tanggal"
      ),
      knex.raw("to_char(retur.nomor_faktur, 'fm00000000000') AS nomor_faktur"),
      'customer.nama_toko',
      'sales.nama',
      'product.nama_barang',
      'retur_item.jumlah_barang',
      'retur_item.satuan_terkecil'
    )
    .leftJoin('retur', 'retur.id', '=', 'retur_item.retur_id')
    .leftJoin('product', 'product.id', '=', 'retur_item.product_id')
    .leftJoin('customer', 'customer.id', '=', 'retur.customer_id')
    .leftJoin('sales', 'sales.id', '=', 'retur.sales_id')
    .where((builder) => {
      if (from && to) {
        builder.whereBetween('retur.tanggal', [
          from,
          Number(to) + 24 * 60 * 60 * 1000 - 1,
        ])
      }

      if (sales) {
        builder.andWhere('sales.id', knex.raw('COALESCE(?, sales.id)', sales))
      }

      if (product) {
        builder.andWhere(
          'retur_item.product_id',
          knex.raw('COALESCE(?, retur_item.product_id)', product)
        )
      }

      if (customer)
        builder.andWhere(
          'retur.customer_id',
          knex.raw('COALESCE(?, retur.customer_id)', customer)
        )
    })
    .orderBy('retur.id', 'asc')
    .orderBy('retur.tanggal', 'asc')
    .orderBy('retur.nomor_faktur', 'asc')
    .orderBy('retur_item.product_id', 'asc')
    .then((rows) => {
      return rows
    })
    .catch((error) => {
      logger.error(error)
      return []
    })
}

module.exports = {
  penerimaan,
  penjualan,
  pembayaran,
  piutang,
  giro,
  retur,
}
