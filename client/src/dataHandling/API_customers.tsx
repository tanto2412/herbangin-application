import axios from 'axios'
import { CustomersData } from './interfaces'
import { baseURL } from './Constants'

const customerDataURL = 'customers'

export const fetchCustomersData = async (
  searchCategory: string = 'nama_toko',
  searchTerm?: string | null
): Promise<CustomersData[]> => {
  try {
    let params: Record<string, string | number> = {}
    if (searchTerm != null && searchTerm !== '') {
      params[searchCategory] = searchTerm
    }
    const response = await axios.get<CustomersData[]>(
      `${baseURL}/${customerDataURL}`,
      { params, withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching customers data:', error)
    throw error
  }
}

export const addCustomersRecord = async (newCustomers: CustomersData) => {
  try {
    const response = await axios.post(
      `${baseURL}/${customerDataURL}`,
      {
        nama_toko: newCustomers.nama_toko,
        sales_id: newCustomers.sales_id,
        alamat: newCustomers.alamat,
        nomor_telepon: newCustomers.nomor_telepon,
        nomor_handphone: newCustomers.nomor_handphone,
        email: newCustomers.email,
        batas_piutang: newCustomers.batas_piutang,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error adding customers record:', error)
    throw error
  }
}

export const updateCustomersRecord = async (
  id: number,
  newCustomers: CustomersData
): Promise<CustomersData> => {
  try {
    const response = await axios.put<CustomersData>(
      `${baseURL}/${customerDataURL}/${id}`,
      {
        nama_toko: newCustomers.nama_toko,
        sales_id: newCustomers.sales_id,
        alamat: newCustomers.alamat,
        nomor_telepon: newCustomers.nomor_telepon,
        nomor_handphone: newCustomers.nomor_handphone,
        email: newCustomers.email,
        batas_piutang: newCustomers.batas_piutang,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error updating customers record:', error)
    throw error
  }
}

export const deleteCustomersRecord = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${customerDataURL}/${id}`, {
      withCredentials: true,
    })
  } catch (error) {
    console.error('Error deleting customers record:', error)
    throw error
  }
}
