// models/productModel.js
const knex = require('../../knexInstance')
const logger = require('../../logger')
const productModel = require('./productModel')
const paymentModel = require('./paymentModel')
const returModel = require('./returModel')

async function search({
  nomor = null,
  sales = null,
  customer = null,
  page = 1,
  pageSize = 20,
}) {
  return await knex('order')
    .where((builder) => {
      if (nomor) {
        builder.where('nomor_faktur', nomor)
      }

      if (sales) {
        builder.where('sales_id', sales)
      }

      if (customer) {
        builder.where('customer_id', customer)
      }

      builder.offset((page - 1) * pageSize)
      builder.limit(pageSize)
      builder.orderBy('id')
    })
    .then((rows) => {
      return rows
    })
    .catch((error) => {
      logger.error(error)
      return []
    })
}

async function getById(id) {
  return await knex('order').where('nomor_faktur', id).first()
}

async function getItemsById(id) {
  if (!id) return []
  return await knex('order_item').where('nomor_faktur', id)
}

async function getItemsByIds(ids) {
  if (!ids) return []
  return await knex('order_item').whereIn('id', ids)
}

async function create({ tanggal_faktur, customer_id, sales_id, total, items }) {
  try {
    return await knex.transaction(async (trx) => {
      let order = (
        await trx('order')
          .insert({ tanggal_faktur, customer_id, sales_id, total })
          .returning('*')
      )[0]

      let updatedItems = items.map((item) => {
        let updatedItem = item
        updatedItem.nomor_faktur = order.nomor_faktur
        return updatedItem
      })

      let orderItems = await trx('order_item')
        .insert(updatedItems)
        .returning('*')
      if (!orderItems || !orderItems.length) {
        await trx.rollback()
        return null
      }

      stockSpecs = []
      for (let item of orderItems) {
        stockSpec = {
          product_id: item.product_id,
          stok_diff: -item.jumlah_barang,
          reference_type: productModel.ReferenceType.ORDER,
          reference_id: item.id,
        }
        stockSpecs.push(stockSpec)
      }

      let updatedStock = await productModel.updateStock(stockSpecs, trx)
      if (!updatedStock || !updatedStock.length) {
        await trx.rollback()
        return null
      }

      order.items = orderItems
      return order
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function edit({
  nomor_faktur,
  customer_id,
  sales_id,
  tanggal_faktur,
  total,
  items,
}) {
  try {
    return await knex.transaction(async (trx) => {
      let order = (
        await trx('order')
          .update({
            customer_id,
            sales_id,
            tanggal_faktur,
            total,
            updated_at: knex.raw('now()'),
          })
          .where('nomor_faktur', nomor_faktur)
          .returning('*')
      )[0]

      await paymentModel.removeByOrderId(nomor_faktur, trx)
      await returModel.removeByOrderId(nomor_faktur, trx)

      let updatedItems = items.map((item) => {
        let updatedItem = item
        updatedItem.nomor_faktur = nomor_faktur
        return updatedItem
      })

      let deletedItems = await trx('order_item')
        .where('nomor_faktur', nomor_faktur)
        .del('*')
      if (!deletedItems || !deletedItems.length) {
        await trx.rollback()
        return null
      }

      let orderItems = await trx('order_item')
        .insert(updatedItems)
        .returning('*')
      if (!orderItems || !orderItems.length) {
        await trx.rollback()
        return null
      }

      // add old items
      addSpecs = []
      for (let item of deletedItems) {
        addSpec = {
          product_id: item.product_id,
          stok_diff: item.jumlah_barang,
          reference_type: productModel.ReferenceType.ORDER,
          reference_id: item.id,
        }
        addSpecs.push(addSpec)
      }

      let updatedStock = await productModel.updateStock(addSpecs, trx)
      if (!updatedStock || !updatedStock.length) {
        await trx.rollback()
        return null
      }

      // deduct new items
      deductSpecs = []
      for (let item of orderItems) {
        deductSpec = {
          product_id: item.product_id,
          stok_diff: -item.jumlah_barang,
          reference_type: productModel.ReferenceType.ORDER,
          reference_id: item.id,
        }
        deductSpecs.push(deductSpec)
      }

      updatedStock = await productModel.updateStock(deductSpecs, trx)
      if (!updatedStock || !updatedStock.length) {
        await trx.rollback()
        return null
      }

      order.items = orderItems
      return order
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function remove(nomor_faktur) {
  try {
    return await knex.transaction(async (trx) => {
      let orderItems = await trx('order_item')
        .where('nomor_faktur', nomor_faktur)
        .del('*')

      let order = (
        await trx('order').where('nomor_faktur', nomor_faktur).del('*')
      )[0]

      await paymentModel.removeByOrderId(nomor_faktur, trx)
      await returModel.removeByOrderId(nomor_faktur, trx)

      stockSpecs = []
      for (let item of orderItems) {
        stockSpec = {
          product_id: item.product_id,
          stok_diff: item.jumlah_barang,
          reference_type: productModel.ReferenceType.ORDER,
          reference_id: item.id,
        }
        stockSpecs.push(stockSpec)
      }

      let updatedStock = await productModel.updateStock(stockSpecs, trx)
      if (!updatedStock || !updatedStock.length) {
        await trx.rollback()
        return null
      }

      order.items = orderItems
      return order
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

module.exports = {
  search,
  getById,
  getItemsById,
  getItemsByIds,
  create,
  edit,
  remove,
}
