// models/receivingModel.js
const knex = require('../../knexInstance')
const logger = require('../../logger')
const productModel = require('./productModel')

async function search({ nomor = null, page = 1, page_size = 20 }) {
  return await knex('receiving')
    .where((builder) => {
      if (nomor) {
        builder.where('id', nomor)
      }
    })
    .modify((queryBuilder) => {
      if (page_size > 0) queryBuilder.limit(page_size)
    })
    .offset((page - 1) * page_size)
    .orderBy('id')
    .then((rows) => {
      return rows
    })
    .catch((error) => {
      logger.error(error)
      return []
    })
}

async function count({ nomor = null, page_size = 20 }) {
  return await knex('receiving')
    .where((builder) => {
      if (nomor) {
        builder.where('id', nomor)
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
  return await knex('receiving').where('id', id).first()
}

async function getItemsById(id) {
  if (!id) return []
  return await knex('receiving_item')
    .select('receiving_item.*', 'product.nama_barang', 'product.kode_barang')
    .leftJoin('product', 'product.id', '=', 'receiving_item.product_id')
    .where('receiving_id', id)
}

async function create({ tanggal, total, items }) {
  try {
    return await knex.transaction(async (trx) => {
      let receiving = (
        await trx('receiving').insert({ tanggal, total }).returning('*')
      )[0]

      let updatedItems = items.map((item) => {
        let updatedItem = item
        updatedItem.receiving_id = receiving.id
        return updatedItem
      })

      let receivingItems = await trx('receiving_item')
        .insert(updatedItems)
        .returning('*')
      if (!receivingItems || !receivingItems.length) {
        await trx.rollback()
        return null
      }

      stockSpecs = []
      for (let item of receivingItems) {
        stockSpec = {
          product_id: item.product_id,
          stok_diff: item.jumlah_barang,
          reference_type: productModel.ReferenceType.RECEIVING,
          reference_id: item.id,
        }
        stockSpecs.push(stockSpec)
      }

      let updatedStock = await productModel.updateStock(stockSpecs, trx)
      if (!updatedStock || !updatedStock.length) {
        await trx.rollback()
        return null
      }

      receiving.items = receivingItems
      return receiving
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function edit({ id, tanggal, total, items }) {
  try {
    return await knex.transaction(async (trx) => {
      let receiving = (
        await trx('receiving')
          .update({ tanggal, total, updated_at: knex.raw('now()') })
          .where('id', id)
          .andWhere(
            knex.raw("date_trunc('month', to_timestamp(tanggal/1000.0))"),
            '>',
            knex.raw("date_trunc('month', now() - INTERVAL '2 months')")
          )
          .returning('*')
      )[0]

      if (!receiving) {
        trx.rollback()
        return null
      }

      let updatedItems = items.map((item) => {
        let updatedItem = item
        updatedItem.receiving_id = id
        return updatedItem
      })

      let deletedItems = await trx('receiving_item')
        .where('receiving_id', id)
        .del('*')
      if (!deletedItems || !deletedItems.length) {
        await trx.rollback()
        return null
      }

      let receivingItems = await trx('receiving_item')
        .insert(updatedItems)
        .returning('*')
      if (!receivingItems || !receivingItems.length) {
        await trx.rollback()
        return null
      }

      // deduct old items
      deductSpecs = []
      for (let item of deletedItems) {
        deductSpec = {
          product_id: item.product_id,
          stok_diff: -item.jumlah_barang,
          reference_type: productModel.ReferenceType.RECEIVING,
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
      for (let item of receivingItems) {
        addSpec = {
          product_id: item.product_id,
          stok_diff: item.jumlah_barang,
          reference_type: productModel.ReferenceType.RECEIVING,
          reference_id: item.id,
        }
        addSpecs.push(addSpec)
      }

      updatedStock = await productModel.updateStock(addSpecs, trx)
      if (!updatedStock || !updatedStock.length) {
        await trx.rollback()
        return null
      }

      receiving.items = receivingItems
      return receiving
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function remove(id) {
  try {
    return await knex.transaction(async (trx) => {
      let receivingItems = await trx('receiving_item')
        .where('receiving_id', id)
        .del('*')

      let receiving = (await trx('receiving').where('id', id).del('*'))[0]

      stockSpecs = []
      for (let item of receivingItems) {
        stockSpec = {
          product_id: item.product_id,
          stok_diff: -item.jumlah_barang,
          reference_type: productModel.ReferenceType.RECEIVING,
          reference_id: item.id,
        }
        stockSpecs.push(stockSpec)
      }

      let updatedStock = await productModel.updateStock(stockSpecs, trx)
      if (!updatedStock || !updatedStock.length) {
        await trx.rollback()
        return null
      }

      receiving.items = receivingItems
      return receiving
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

module.exports = {
  search,
  count,
  getById,
  getItemsById,
  create,
  edit,
  remove,
}
