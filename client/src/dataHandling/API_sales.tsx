import axios from "axios";
import { SalesData } from "./interfaces";
import { baseURL } from "./Constants";

const salesDataURL = "sales";

export const fetchSalesData = async (
  searchTerm?: string | null
): Promise<SalesData[]> => {
  try {
    let params = {};
    if (searchTerm != null) {
      params = searchTerm != "" ? { nama: searchTerm } : {};
    }
    const response = await axios.get<SalesData[]>(
      `${baseURL}/${salesDataURL}`,
      { params, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }
};

export const addSalesRecord = async (newSalesName: string) => {
  try {
    const response = await axios.post(
      `${baseURL}/${salesDataURL}`,
      { nama: newSalesName },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding sales record:", error);
    throw error;
  }
};

export const updateSalesRecord = async (
  id: number,
  updatedData: Partial<SalesData>
): Promise<SalesData> => {
  try {
    const response = await axios.put<SalesData>(
      `${baseURL}/${salesDataURL}/${id}`,
      { nama: updatedData },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating sales record:", error);
    throw error;
  }
};

export const deleteSalesRecord = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${salesDataURL}/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting sales record:", error);
    throw error;
  }
};
