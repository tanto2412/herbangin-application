import axios, { AxiosError } from 'axios'
import { Pagination, ReceivingData, ReceivingDataDetails } from './interfaces'
import { baseURL } from './Constants'

const receivingDataURL = 'receiving'

export const fetchReceivingData = async (
  searchTerm?: string | null,
  page?: number | null,
  all: boolean = true
): Promise<Pagination<ReceivingData>> => {
  try {
    const params = new URLSearchParams()
    if (searchTerm != null && searchTerm != '') {
      params.append('nomor', searchTerm)
    }
    if (page != null) {
      params.append('page', page.toString())
    }
    if (all) {
      params.append('page_size', '0')
    }
    const response = await axios.get<Pagination<ReceivingData>>(
      `${baseURL}/${receivingDataURL}`,
      { params, withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching receiving data:', error)
    throw error
  }
}

export const fetchReceivingDataDetails = async (
  id: number
): Promise<ReceivingDataDetails[]> => {
  try {
    const response = await axios.get<ReceivingData>(
      `${baseURL}/${receivingDataURL}/${id}`,
      { withCredentials: true }
    )
    return response.data.items
  } catch (error) {
    console.error('Error fetching receiving data details:', error)
    throw error
  }
}

export const addReceivingRecord = async (newReceiving: ReceivingData) => {
  try {
    const response = await axios.post(
      `${baseURL}/${receivingDataURL}`,
      {
        tanggal: newReceiving.tanggal,
        items: newReceiving.items,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error adding receiving record: ' + axiosError.response?.data)
    throw error
  }
}

export const updateReceivingRecord = async (
  id: number,
  newReceiving: ReceivingData
): Promise<ReceivingData> => {
  try {
    const response = await axios.put<ReceivingData>(
      `${baseURL}/${receivingDataURL}/${id}`,
      {
        tanggal: newReceiving.tanggal,
        items: newReceiving.items,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error updating receiving record: ' + axiosError.response?.data)
    throw error
  }
}

export const deleteReceivingRecord = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${receivingDataURL}/${id}`, {
      withCredentials: true,
    })
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error deleting receiving record: ' + axiosError.response?.data)
    throw error
  }
}
