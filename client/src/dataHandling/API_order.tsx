import axios, { AxiosError } from 'axios'
import { OrderData, OrderDataDetails, Pagination } from './interfaces'
import { baseURL } from './Constants'

const orderDataURL = 'order'

export const fetchOrderData = async (
  searchCategory: string = 'nomor',
  searchTerm?: string | null,
  page?: number | null,
  all: boolean = true
): Promise<Pagination<OrderData>> => {
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
    const response = await axios.get<Pagination<OrderData>>(
      `${baseURL}/${orderDataURL}`,
      { params, withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching order data:', error)
    throw error
  }
}

export const fetchOutstandingOrderData = async (
  customer_id: string | undefined
): Promise<OrderData[]> => {
  try {
    const params = new URLSearchParams()
    if (customer_id) {
      params.append('customer_id', customer_id)
    }
    const response = await axios.get<OrderData[]>(
      `${baseURL}/${orderDataURL}/outstanding`,
      { params, withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching outstanding order data:', error)
    throw error
  }
}

export const fetchOrderRemainingAmount = async (
  id: number
): Promise<number> => {
  try {
    const response = await axios.get<OrderData>(
      `${baseURL}/${orderDataURL}/${id}`,
      { withCredentials: true }
    )
    return response.data.remainingAmount
  } catch (error) {
    console.error('Error fetching order data details:', error)
    throw error
  }
}

export const fetchOrderDataDetails = async (
  id: number
): Promise<OrderDataDetails[]> => {
  try {
    const response = await axios.get<OrderData>(
      `${baseURL}/${orderDataURL}/${id}`,
      { withCredentials: true }
    )
    return response.data.items
  } catch (error) {
    console.error('Error fetching order data details:', error)
    throw error
  }
}

export const addOrderRecord = async (newOrder: OrderData) => {
  try {
    const response = await axios.post(
      `${baseURL}/${orderDataURL}`,
      {
        tanggal_faktur: newOrder.tanggal_faktur,
        customer_id: newOrder.customer_id,
        items: newOrder.items,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error adding order record: ' + axiosError.response?.data)
    throw error
  }
}

export const updateOrderRecord = async (
  id: number,
  newOrder: OrderData
): Promise<OrderData> => {
  try {
    const response = await axios.put<OrderData>(
      `${baseURL}/${orderDataURL}/${id}`,
      {
        tanggal_faktur: newOrder.tanggal_faktur,
        customer_id: newOrder.customer_id,
        items: newOrder.items,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error updating order record: ' + axiosError.response?.data)
    throw error
  }
}

export const deleteOrderRecord = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${orderDataURL}/${id}`, {
      withCredentials: true,
    })
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error deleting order record: ' + axiosError.response?.data)
    throw error
  }
}
