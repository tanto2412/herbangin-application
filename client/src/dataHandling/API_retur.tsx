import axios from 'axios'
import { Pagination, ReturData, ReturDataDetails } from './interfaces'
import { baseURL } from './Constants'

const returDataURL = 'retur'

export const fetchReturData = async (
  searchCategory: string = 'nomor',
  searchTerm?: string | null,
  page?: number | null,
  all: boolean = true
): Promise<Pagination<ReturData>> => {
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
    const response = await axios.get<Pagination<ReturData>>(
      `${baseURL}/${returDataURL}`,
      { params, withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching retur data:', error)
    throw error
  }
}

export const fetchReturDataDetails = async (
  id: number
): Promise<ReturDataDetails[]> => {
  try {
    const response = await axios.get<ReturData>(
      `${baseURL}/${returDataURL}/${id}`,
      { withCredentials: true }
    )
    return response.data.items
  } catch (error) {
    console.error('Error fetching retur data details:', error)
    throw error
  }
}

export const addReturRecord = async (newRetur: ReturData) => {
  try {
    const response = await axios.post(
      `${baseURL}/${returDataURL}`,
      {
        tanggal: newRetur.tanggal,
        nomor_faktur: newRetur.nomor_faktur,
        items: newRetur.items,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error adding retur record:', error)
    throw error
  }
}

export const updateReturRecord = async (
  id: number,
  newRetur: ReturData
): Promise<ReturData> => {
  try {
    const response = await axios.put<ReturData>(
      `${baseURL}/${returDataURL}/${id}`,
      {
        tanggal: newRetur.tanggal,
        nomor_faktur: newRetur.nomor_faktur,
        items: newRetur.items,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error updating retur record:', error)
    throw error
  }
}

export const deleteReturRecord = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${returDataURL}/${id}`, {
      withCredentials: true,
    })
  } catch (error) {
    console.error('Error deleting order record:', error)
    throw error
  }
}
