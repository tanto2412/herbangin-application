import axios from 'axios'
import { Pagination, GiroData } from './interfaces'
import { baseURL } from './Constants'

const giroDataURL = 'giro'

export const fetchGiroData = async (
  searchCategory: string = 'id',
  searchTerm?: string | null,
  page?: number | null,
  all: boolean = true
): Promise<Pagination<GiroData>> => {
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
    const response = await axios.get<Pagination<GiroData>>(
      `${baseURL}/${giroDataURL}`,
      { params, withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching giro data:', error)
    throw error
  }
}

export const updateGiroRecord_Lunas = async (
  id: number,
  tanggal_pencairan_param: number
): Promise<GiroData> => {
  try {
    const response = await axios.put<GiroData>(
      `${baseURL}/${giroDataURL}/${id}/lunas`,
      {
        tanggal_pencairan: tanggal_pencairan_param,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error updating giro record:', error)
    throw error
  }
}

export const updateGiroRecord_Tolak = async (id: number): Promise<GiroData> => {
  try {
    const response = await axios.put<GiroData>(
      `${baseURL}/${giroDataURL}/${id}/tolak`,
      {},
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error updating giro record:', error)
    throw error
  }
}
