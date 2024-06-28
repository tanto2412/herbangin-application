import axios, { AxiosResponse } from 'axios'
import { baseURL } from './Constants'

export const fetchReport = async (
  jenis: string,
  id: string,
  searchParams: URLSearchParams,
): Promise<AxiosResponse> => {
  try {
    return await axios.get(`${baseURL}/${jenis}/${id}`, {
      params: searchParams,
      withCredentials: true,
      responseType: 'arraybuffer',
    })
  } catch (error) {
    console.error('Error fetching report:', error)
    throw error
  }
}
