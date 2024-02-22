import axios from 'axios'
import { baseURL } from './Constants'

export const fetchReport = async (
  jenis: string,
  id: string,
  searchParams: URLSearchParams
): Promise<ArrayBuffer> => {
  try {
    const response = await axios.get(`${baseURL}/${jenis}/${id}`, {
      params: searchParams,
      withCredentials: true,
      responseType: 'arraybuffer',
    })
    return response.data
  } catch (error) {
    console.error('Error fetching report:', error)
    throw error
  }
}
