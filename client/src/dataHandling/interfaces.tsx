export interface Pagination<Type> {
  result: Type[]
  pages: number
}

export interface UsersData {
  id: number
  nama: string
  administrator: boolean
}

export interface SalesData {
  id: number
  nama: string
}

export interface CustomersData {
  id: number
  nama_toko: string
  sales_id: string
  alamat: string
  nomor_telepon: string
  nomor_handphone: string
  email: string
  batas_piutang: number
  nama_sales: string
}

export interface ProductsData {
  id: number
  kode_barang: string
  nama_barang: string
  satuan_terkecil: string
  harga: number
  jenis_barang: string
  batas_fast_moving: number
  stok_barang: number
}

export interface ReceivingData {
  id: number
  tanggal: number
  total: number
  items: ReceivingDataDetails[]
}

export interface ReceivingDataDetails {
  product_id: number
  nama_barang: string
  jumlah_barang: number
  satuan_terkecil: string
  harga_satuan: number
  subtotal: number
}

export interface OrderData {
  nomor_faktur: number
  tanggal_faktur: number
  customer_id: number
  nama_toko: string
  sales_id: number
  nama_sales: string
  total: number
  alamat: string
  items: OrderDataDetails[]
}

export interface OrderDataDetails {
  id: number
  product_id: number
  kode_barang: string
  nama_barang: string
  jumlah_barang: number
  satuan_terkecil: string
  harga_satuan: number
  subtotal: number
}

export interface ReturData {
  id: number
  nomor_faktur: number
  tanggal_faktur: number
  tanggal: number
  customer_id: number
  nama_toko: string
  sales_id: number
  nama_sales: string
  total: number
  items: ReturDataDetails[]
}

export interface ReturDataDetails {
  order_item_id: number
  product_id: number
  kode_barang: string
  nama_barang: string
  jumlah_barang: number
  satuan_terkecil: string
  harga_satuan: number
  subtotal: number
}

export interface PaymentData {
  id: number
  nomor_faktur: number
  tanggal: number
  customer_id: number
  nama_toko: string
  sales_id: number
  nama_sales: string
  jumlah_pembayaran: number
  jenis_pembayaran: string
  remarks: string
  nomor_giro: string
  nama_bank: string
  tanggal_jatuh_tempo: number
}

export interface GiroData {
  id: number
  nomor_giro: string
  nomor_faktur: number
  nomor_pembayaran: number
  nama_bank: string
  tanggal_jatuh_tempo: number
  tanggal_pencairan: number
  status_pembayaran: string
}
