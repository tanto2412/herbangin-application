import axios from 'axios'
import { baseURL } from './Constants'
import { Pagination, UsersData } from './interfaces'

const loginDataURL = 'auth/login'
const usersURL = 'users'

export const fetchLogin = async (
  param_username: string,
  param_password: string
): Promise<UsersData> => {
  try {
    const response = await axios.post(
      `${baseURL}/${loginDataURL}`,
      { username: param_username, password: param_password },
      { withCredentials: true } // Enable sending and receiving cookies
    )

    // Check if the response status indicates success (e.g., 2xx status codes)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      // If the response status indicates an error, throw an error
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error fetching login data:', error)
    throw error
  }
}

export const changePassword = async (
  param_password: string
): Promise<UsersData[]> => {
  try {
    const response = await axios.put(
      `${baseURL}/${usersURL}`,
      { password: param_password },
      { withCredentials: true }
    )
    // Check if the response status indicates success (e.g., 2xx status codes)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      // If the response status indicates an error, throw an error
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error fetching login data:', error)
    throw error
  }
}

export const fetchUsersData = async (): Promise<Pagination<UsersData>> => {
  try {
    const response = await axios.get<Pagination<UsersData>>(
      `${baseURL}/${usersURL}`,
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching users data:', error)
    throw error
  }
}

export const addUsersRecord = async (newUser: UsersData) => {
  try {
    const response = await axios.post(
      `${baseURL}/${usersURL}`,
      {
        nama: newUser.nama,
        password: newUser.password,
        administrator: newUser.administrator,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error adding users record:', error)
    throw error
  }
}

export const deleteUsersRecord = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${usersURL}/${id}`, {
      withCredentials: true,
    })
  } catch (error) {
    console.error('Error deleting users record:', error)
    throw error
  }
}
