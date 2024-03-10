// models/returModel.js
const knex = require('../../knexInstance')
const logger = require('../../logger')
const productModel = require('./productModel')

async function search({
  nomor_faktur = null,
  nomor_retur = null,
  customer = null,
  sales = null,
  page = 1,
  page_size = 20,
}) {
  return await knex('retur')
    .select(
      'retur.*',
      'sales.nama as nama_sales',
      'customer.nama_toko',
      'order.tanggal_faktur'
    )
    .leftJoin('order', 'order.nomor_faktur', '=', 'retur.nomor_faktur')
    .leftJoin('sales', 'sales.id', '=', 'retur.sales_id')
    .leftJoin('customer', 'customer.id', '=', 'retur.customer_id')
    .where((builder) => {
      if (nomor_faktur) {
        builder.where('retur.nomor_faktur', nomor_faktur)
      }

      if (nomor_retur) {
        builder.where('retur.id', nomor_retur)
      }

      if (sales) {
        builder.where('retur.sales_id', sales)
      }

      if (customer) {
        builder.where('retur.customer_id', customer)
      }
    })
    .modify((queryBuilder) => {
      if (page_size > 0) queryBuilder.limit(page_size)
    })
    .offset((page - 1) * page_size)
    .orderBy('retur.id')
    .then((rows) => {
      return rows
    })
    .catch((error) => {
      logger.error(error)
      return []
    })
}

async function count({
  nomor_faktur = null,
  nomor_retur = null,
  customer = null,
  sales = null,
  page_size = 20,
}) {
  return await knex('retur')
    .leftJoin('order', 'order.nomor_faktur', '=', 'retur.nomor_faktur')
    .leftJoin('sales', 'sales.id', '=', 'retur.sales_id')
    .leftJoin('customer', 'customer.id', '=', 'retur.customer_id')
    .where((builder) => {
      if (nomor_faktur) {
        builder.where('retur.nomor_faktur', nomor_faktur)
      }

      if (nomor_retur) {
        builder.where('retur.id', nomor_retur)
      }

      if (sales) {
        builder.where('retur.sales_id', sales)
      }

      if (customer) {
        builder.where('retur.customer_id', customer)
      }
    })
    .count('*')
    .then((result) => {
      return Math.ceil(parseInt(result[0].count, 10) / page_size)
    })
    .catch((error) => {
      console.error(error)
    })
}

async function getById(id) {
  return await knex('retur')
    .select(
      'retur.*',
      'sales.nama as nama_sales',
      'customer.nama_toko',
      'order.tanggal_faktur'
    )
    .leftJoin('order', 'order.nomor_faktur', '=', 'retur.nomor_faktur')
    .leftJoin('sales', 'sales.id', '=', 'retur.sales_id')
    .leftJoin('customer', 'customer.id', '=', 'retur.customer_id')
    .where('retur.id', id)
    .first()
    .catch((error) => {
      logger.error(error)
      return null
    })
}

async function getByOrderId(id, trx) {
  if (!trx) {
    trx = knex
  }
  return await trx('retur').where('nomor_faktur', id)
}

async function getByOrderIds(ids) {
  return await knex('retur').whereIn('nomor_faktur', ids)
}

async function getItemsById(id) {
  return await knex('retur_item')
    .select('retur_item.*', 'product.nama_barang', 'product.kode_barang')
    .leftJoin('product', 'product.id', '=', 'retur_item.product_id')
    .where('retur_id', id)
}

async function getItemsByIds(ids) {
  return await knex('retur_item').whereIn('retur_id', ids)
}

async function getItemsByOrderItemIds(ids) {
  return await knex('retur_item').whereIn('order_item_id', ids)
}

async function create({
  nomor_faktur,
  customer_id,
  sales_id,
  tanggal,
  total,
  items,
}) {
  try {
    return await knex.transaction(async (trx) => {
      let retur = (
        await trx('retur')
          .insert({ nomor_faktur, customer_id, sales_id, tanggal, total })
          .onConflict('id')
          .merge()
          .returning('*')
      )[0]

      let updatedItems = items.map((item) => {
        let updatedItem = item
        updatedItem.retur_id = retur.id
        return updatedItem
      })

      let returItems = await trx('retur_item')
        .insert(updatedItems)
        .onConflict('id')
        .merge()
        .returning('*')
      if (!returItems || !returItems.length) {
        await trx.rollback()
        return null
      }

      stockSpecs = []
      for (let item of returItems) {
        stockSpec = {
          product_id: item.product_id,
          stok_diff: item.jumlah_barang,
          reference_type: productModel.ReferenceType.RETUR,
          reference_id: item.id,
        }
        stockSpecs.push(stockSpec)
      }

      let updatedStock = await productModel.updateStock(stockSpecs, trx)
      if (!updatedStock || !updatedStock.length) {
        await trx.rollback()
        return null
      }

      retur.items = returItems
      return retur
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function edit({
  id,
  nomor_faktur,
  customer_id,
  sales_id,
  tanggal,
  total,
  items,
}) {
  try {
    return await knex.transaction(async (trx) => {
      let retur = (
        await trx('retur')
          .update({
            nomor_faktur,
            customer_id,
            sales_id,
            tanggal,
            total,
            updated_at: knex.raw('now()'),
          })
          .where('id', id)
          .returning('*')
      )[0]

      if (!retur) {
        trx.rollback()
        return null
      }

      let updatedItems = items.map((item) => {
        let updatedItem = item
        updatedItem.retur_id = id
        return updatedItem
      })

      let deletedItems = await trx('retur_item').where('retur_id', id).del('*')
      if (!deletedItems || !deletedItems.length) {
        await trx.rollback()
        return null
      }

      let returItems = await trx('retur_item')
        .insert(updatedItems)
        .returning('*')
      if (!returItems || !returItems.length) {
        await trx.rollback()
        return null
      }

      // deduct old items
      deductSpecs = []
      for (let item of deletedItems) {
        deductSpec = {
          product_id: item.product_id,
          stok_diff: -item.jumlah_barang,
          reference_type: productModel.ReferenceType.RETUR,
          reference_id: item.id,
        }
        deductSpecs.push(deductSpec)
      }

      let updatedStock = await productModel.updateStock(deductSpecs, trx)
      if (!updatedStock || !updatedStock.length) {
        await trx.rollback()
        return null
      }

      // add new items
      addSpecs = []
      for (let item of returItems) {
        addSpec = {
          product_id: item.product_id,
          stok_diff: item.jumlah_barang,
          reference_type: productModel.ReferenceType.RETUR,
          reference_id: item.id,
        }
        addSpecs.push(addSpec)
      }

      updatedStock = await productModel.updateStock(addSpecs, trx)
      if (!updatedStock || !updatedStock.length) {
        await trx.rollback()
        return null
      }

      retur.items = returItems
      return retur
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function remove(id) {
  try {
    return await knex.transaction(async (trx) => {
      let returItems = await trx('retur_item').where('retur_id', id).del('*')

      let retur = (await trx('retur').where('id', id).del('*'))[0]

      stockSpecs = []
      for (let item of returItems) {
        stockSpec = {
          product_id: item.product_id,
          stok_diff: -item.jumlah_barang,
          reference_type: productModel.ReferenceType.RETUR,
          reference_id: item.id,
        }
        stockSpecs.push(stockSpec)
      }

      let updatedStock = await productModel.updateStock(stockSpecs, trx)
      if (!updatedStock || !updatedStock.length) {
        await trx.rollback()
        return null
      }

      retur.items = returItems
      return retur
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function removeByOrderId(id, trx) {
  let returs = await getByOrderId(id, trx)
  if (!returs.length) return []

  let returIds = returs.map((retur) => retur.id)

  let returItems = await trx('retur_item')
    .whereIn('retur_id', returIds)
    .del('*')

  returs = await trx('retur').where('nomor_faktur', id).del('*')

  stockSpecs = []
  for (let item of returItems) {
    stockSpec = {
      product_id: item.product_id,
      stok_diff: -item.jumlah_barang,
      reference_type: productModel.ReferenceType.RETUR,
      reference_id: item.id,
    }
    stockSpecs.push(stockSpec)
  }

  let updatedStock = await productModel.updateStock(stockSpecs, trx)
  if (!updatedStock || !updatedStock.length) {
    await trx.rollback()
    return null
  }

  return returs
}

module.exports = {
  search,
  count,
  getById,
  getByOrderIds,
  getItemsById,
  getItemsByIds,
  getItemsByOrderItemIds,
  create,
  edit,
  remove,
  removeByOrderId,
}
