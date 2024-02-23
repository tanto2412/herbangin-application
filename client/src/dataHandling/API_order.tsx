import axios from 'axios'
import { OrderData, OrderDataDetails, Pagination } from './interfaces'
import { baseURL } from './Constants'

const orderDataURL = 'order'

export const fetchOrderData = async (
  searchCategory: string = 'nomor',
  searchTerm?: string | null
): Promise<Pagination<OrderData>> => {
  try {
    let params: Record<string, string | number> = {}
    if (searchTerm != null && searchTerm !== '') {
      params[searchCategory] = searchTerm
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
    console.error('Error adding order record:', error)
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
    console.error('Error updating order record:', error)
    throw error
  }
}

export const deleteOrderRecord = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${orderDataURL}/${id}`, {
      withCredentials: true,
    })
  } catch (error) {
    console.error('Error deleting order record:', error)
    throw error
  }
}
