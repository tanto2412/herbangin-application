import axios from 'axios'
import { Pagination, SalesData } from './interfaces'
import { baseURL } from './Constants'

const salesDataURL = 'sales'

export const fetchSalesData = async (
  searchTerm?: string | null,
  page?: number | null,
  all: boolean = true
): Promise<Pagination<SalesData>> => {
  try {
    const params = new URLSearchParams()
    if (searchTerm != null && searchTerm != '') {
      params.append('nama', searchTerm)
    }
    if (page != null) {
      params.append('page', page.toString())
    }
    if (all) {
      params.append('page_size', '0')
    }
    const response = await axios.get<Pagination<SalesData>>(
      `${baseURL}/${salesDataURL}`,
      { params, withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching sales data:', error)
    throw error
  }
}

export const addSalesRecord = async (newSalesName: string) => {
  try {
    const response = await axios.post(
      `${baseURL}/${salesDataURL}`,
      { nama: newSalesName },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error adding sales record:', error)
    throw error
  }
}

export const updateSalesRecord = async (
  id: number,
  updatedData: Partial<SalesData>
): Promise<SalesData> => {
  try {
    const response = await axios.put<SalesData>(
      `${baseURL}/${salesDataURL}/${id}`,
      { nama: updatedData },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error updating sales record:', error)
    throw error
  }
}

export const deleteSalesRecord = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${salesDataURL}/${id}`, {
      withCredentials: true,
    })
  } catch (error) {
    console.error('Error deleting sales record:', error)
    throw error
  }
}
