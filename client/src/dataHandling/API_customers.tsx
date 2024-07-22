import axios, { AxiosError } from 'axios'
import { CustomersData, Pagination } from './interfaces'
import { baseURL } from './Constants'

const customerDataURL = 'customers'

export const fetchCustomersData = async (
  searchCategory: string = 'nama_toko',
  searchTerm?: string | null,
  page?: number | null,
  all: boolean = true,
): Promise<Pagination<CustomersData>> => {
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
    const response = await axios.get<Pagination<CustomersData>>(
      `${baseURL}/${customerDataURL}`,
      { params, withCredentials: true },
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
      { withCredentials: true },
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error adding customers record: ' + axiosError.response?.data)
    throw error
  }
}

export const updateCustomersRecord = async (
  id: number,
  newCustomers: CustomersData,
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
      { withCredentials: true },
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error updating customers record: ' + axiosError.response?.data)
    throw error
  }
}

export const deleteCustomersRecord = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${customerDataURL}/${id}`, {
      withCredentials: true,
    })
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error deleting customers record: ' + axiosError.response?.data)
    throw error
  }
}
