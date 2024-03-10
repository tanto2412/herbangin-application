import axios from 'axios'
import { baseURL } from './Constants'
import { UsersData } from './interfaces'

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
