import axios, { AxiosError } from 'axios'
import { Pagination, ProductsData } from './interfaces'
import { baseURL } from './Constants'

const productsDataURL = 'products'

export const fetchProductsData = async (
  searchCategory: string = 'nama_barang',
  searchTerm?: string | null,
  page?: number | null,
  all: boolean = true
): Promise<Pagination<ProductsData>> => {
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
    const response = await axios.get<Pagination<ProductsData>>(
      `${baseURL}/${productsDataURL}`,
      { params, withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching products data:', error)
    throw error
  }
}

export const fetchProductsDataByID = async (
  searchID?: string | null
): Promise<ProductsData> => {
  try {
    const response = await axios.get<ProductsData>(
      `${baseURL}/${productsDataURL}/${searchID}`,
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching products data by ID:', error)
    throw error
  }
}

export const addProductsRecord = async (newProducts: ProductsData) => {
  try {
    const response = await axios.post(
      `${baseURL}/${productsDataURL}`,
      {
        kode_barang: newProducts.kode_barang,
        nama_barang: newProducts.nama_barang,
        satuan_terkecil: newProducts.satuan_terkecil,
        harga: newProducts.harga,
        jenis_barang: newProducts.jenis_barang,
        batas_fast_moving: newProducts.batas_fast_moving,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error adding products record: ' + axiosError.response?.data)
    throw error
  }
}

export const updateProductsRecord = async (
  id: number,
  newProducts: ProductsData
): Promise<ProductsData> => {
  try {
    const response = await axios.put<ProductsData>(
      `${baseURL}/${productsDataURL}/${id}`,
      {
        kode_barang: newProducts.kode_barang,
        nama_barang: newProducts.nama_barang,
        satuan_terkecil: newProducts.satuan_terkecil,
        harga: newProducts.harga,
        jenis_barang: newProducts.jenis_barang,
        batas_fast_moving: newProducts.batas_fast_moving,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error updating products record: ' + axiosError.response?.data)
    throw error
  }
}

export const deleteProductsRecord = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${productsDataURL}/${id}`, {
      withCredentials: true,
    })
  } catch (error) {
    const axiosError = error as AxiosError
    alert('Error deleting products record: ' + axiosError.response?.data)
    throw error
  }
}
