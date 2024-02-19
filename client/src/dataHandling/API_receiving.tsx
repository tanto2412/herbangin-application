import axios from 'axios'
import { ReceivingData, ReceivingDataDetails } from './interfaces'
import { baseURL } from './Constants'

const receivingDataURL = 'receiving'

export const fetchReceivingData = async (
  searchTerm?: string | null
): Promise<ReceivingData[]> => {
  try {
    let params = {}
    if (searchTerm != null && searchTerm != '') {
      params = { nomor: searchTerm }
    }
    const response = await axios.get<ReceivingData[]>(
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
    console.error('Error adding receiving record:', error)
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
    console.error('Error updating receiving record:', error)
    throw error
  }
}

export const deleteReceivingRecord = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${receivingDataURL}/${id}`, {
      withCredentials: true,
    })
  } catch (error) {
    console.error('Error deleting receiving record:', error)
    throw error
  }
}
