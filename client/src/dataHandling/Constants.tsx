export const HIDE_DIMSCREEN = "NULL";
export const ADD_DIMSCREEN = "Add";
export const EDIT_DIMSCREEN = "Edit";
export const DELETE_DIMSCREEN = "Delete";

export const FAST_MOVING = "FAST_MOVING";
export const SLOW_MOVING = "SLOW_MOVING";

export const baseURL = "http://localhost:3000/api";

export const SalesColumns = ["Sales ID", "Nama Sales"];
export const CustomerColumns = [
  "Customer ID",
  "Nama Pelanggan",
  "Alamat",
  "Nomor Telepon",
  "Nomor Handphone",
  "Email",
  "Nama Sales",
  "Batas Maksimum Piutang",
];
export const ProductsColumns = [
  "Product ID",
  "Kode Barang",
  "Nama Barang",
  "Harga",
  "Stok Barang",
  "Barang Laku",
  "Batas Fast Moving",
];
export const ReceivingColumns = [
  "Nomor Faktur",
  "Tanggal Faktur",
  "Total Harga",
];
export const ReceivingItemsColumns = [
  "Nomor Faktur",
  "Nomor Penerimaan",
  "Nama Barang",
  "Jumlah Barang",
  "Harga Satuan",
  "Subtotal"
];

export const epochmillisToDate = (epochMillis: number) => {
  const date: Date = new Date(Math.round(epochMillis));
  const formattedDate: string = new Intl.DateTimeFormat("id-ID").format(date);
  return formattedDate;
};

export const dateToEpochmillis = (dateString: string) => {
  // Parse the string date manually
  const [day, month, year] = dateString.split("/").map(Number);
  const date: Date = new Date(year, month - 1, day); // Month is 0-based in JavaScript Date constructor

  // Convert Date to epoch time (milliseconds since January 1, 1970)
  const epochMillis: number = date.getTime();
  console.log(epochMillis);
  return epochMillis;
};
