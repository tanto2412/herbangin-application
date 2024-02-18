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
  id: number
  receiving_id: number
  product_id: number
  nama_barang: string
  jumlah_barang: number
  satuan_terkecil: string
  harga_satuan: number
  subtotal: number
}
