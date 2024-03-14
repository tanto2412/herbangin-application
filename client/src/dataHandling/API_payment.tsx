import axios, { AxiosError } from 'axios'
import { Pagination, PaymentData } from './interfaces'
import { baseURL } from './Constants'

const paymentDataURL = 'payment'

export const fetchPaymentData = async (
  searchCategory: string = 'nomor',
  searchTerm?: string | null,
  page?: number | null,
  all: boolean = true
): Promise<Pagination<PaymentData>> => {
  try {
    const params = new URLSearchParams()
    if (searchTerm != null && searchTerm != '') {
      params.append(searchCategory, searchTerm)
    }
    if (page != null) {
      params.append('page', page.toString())
    }
    if (all) {
      params.append('page_size', '0')
    }
    const response = await axios.get<Pagination<PaymentData>>(
      `${baseURL}/${paymentDataURL}`,
      { params, withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching payment data:', error)
    throw error
  }
}

export const addPaymentRecord = async (newPayment: PaymentData) => {
  try {
    const response = await axios.post(
      `${baseURL}/${paymentDataURL}`,
      {
        nomor_faktur: newPayment.nomor_faktur,
        tanggal: newPayment.tanggal,
        jumlah_pembayaran: newPayment.jumlah_pembayaran,
        jenis_pembayaran: newPayment.jenis_pembayaran,
        remarks: newPayment.remarks,
        nomor_giro: newPayment.nomor_giro,
        nama_bank: newPayment.nama_bank,
        tanggal_jatuh_tempo: newPayment.tanggal_jatuh_tempo,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error adding payment record: ' + axiosError.response?.data)
    throw error
  }
}

export const updatePaymentRecord = async (
  id: number,
  newPayment: PaymentData
): Promise<PaymentData> => {
  try {
    const response = await axios.put<PaymentData>(
      `${baseURL}/${paymentDataURL}/${id}`,
      {
        nomor_faktur: newPayment.nomor_faktur,
        tanggal: newPayment.tanggal,
        jumlah_pembayaran: newPayment.jumlah_pembayaran,
        jenis_pembayaran: newPayment.jenis_pembayaran,
        remarks: newPayment.remarks,
        nomor_giro: newPayment.nomor_giro,
        nama_bank: newPayment.nama_bank,
        tanggal_jatuh_tempo: newPayment.tanggal_jatuh_tempo,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error updating payment record: ' + axiosError.response?.data)
    throw error
  }
}

export const deletePaymentRecord = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${paymentDataURL}/${id}`, {
      withCredentials: true,
    })
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error deleting payment record: ' + axiosError.response?.data)
    throw error
  }
}
