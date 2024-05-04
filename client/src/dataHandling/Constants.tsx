require('dotenv').config()

export const HIDE_DIMSCREEN = 'NULL'
export const ADD_DIMSCREEN = 'Add'
export const EDIT_DIMSCREEN = 'Edit'
export const DELETE_DIMSCREEN = 'Delete'

export const FAST_MOVING = 'FAST_MOVING'
export const SLOW_MOVING = 'SLOW_MOVING'

export const LUNAS = 'LUNAS'
export const DITOLAK = 'DITOLAK'
export const BELUM_LUNAS = 'BELUM_LUNAS'

export const TUNAI = 'TUNAI'
export const GIRO = 'GIRO'
export const TRANSFER = 'TRANSFER'
export const LAIN_LAIN = 'LAIN_LAIN'

export const baseURL = process.env.BE_HOSTNAME
  ? process.env.BE_HOSTNAME
  : 'http://localhost:3000/api'

export const UsersColumns = ['User ID', 'Username', 'Administrator status']
export const SalesColumns = ['Sales ID', 'Nama Sales']
export const CustomerColumns = [
  'Customer ID',
  'Nama Pelanggan',
  'Alamat',
  'Nomor Telepon',
  'Nomor Handphone',
  'Email',
  'Nama Sales',
  'Batas Maksimum Piutang',
]
export const ProductsColumns = [
  'Product ID',
  'Kode Barang',
  'Nama Barang',
  'Harga',
  'Stok Barang',
  'Barang Laku',
  'Batas Fast Moving',
]
export const ReceivingColumns = [
  'Nomor Penerimaan',
  'Tanggal Penerimaan',
  'Total Harga',
]
export const ReceivingItemsColumns = [
  'Nama Barang',
  'Jumlah Barang',
  'Harga Satuan',
  'Subtotal',
]
export const OrderColumns = [
  'Nomor Faktur',
  'Tanggal Penjualan',
  'Nama Customer',
  'Nama Sales',
  'Total Penjualan',
]
export const ReturColumns = [
  'Nomor Faktur',
  'Nomor Retur',
  'Tanggal Retur',
  'Nama Customer',
  'Nama Sales',
  'Total Retur',
]
export const OrderItemsColumns = [
  'Kode Barang',
  'Nama Barang',
  'Jumlah',
  'Harga satuan',
  'Subtotal',
]
export const ReturItemsColumns = [
  'Item Penjualan',
  'Nama Barang',
  'Jumlah',
  'Harga satuan',
  'Subtotal',
]
export const PaymentColumns = [
  'Nomor Pembayaran',
  'Nomor Faktur',
  'Tanggal Pembayaran',
  'Nama Sales',
  'Nama Customer',
  'Total pembayaran',
  'Cara pembayaran',
  'Nomor Giro',
  'Tanggal Jatuh Tempo',
  'Nama Bank',
  'Keterangan',
]
export const GiroColumns = [
  'Nomor Giro',
  'Nomor Pembayaran',
  'Nomor Faktur',
  'Nama Bank',
  'Tanggal Jatuh Tempo',
  'Tanggal Pencairan',
  'Status Pembayaran',
]
