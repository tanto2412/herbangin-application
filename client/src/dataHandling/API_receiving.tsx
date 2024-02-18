import axios from "axios";
import { PenerimaanData } from "./interfaces";
import { baseURL } from "./Constants";

const receivingDataURL = "receiving";

export const fetchReceivingData = async (
  searchTerm?: string | null
): Promise<PenerimaanData[]> => {
  try {
    let params: Record<string, string | number> = {};
    if (searchTerm != null && searchTerm !== "") {
      params["id"] = searchTerm;
    }
    const response = await axios.get<PenerimaanData[]>(
      `${baseURL}/${receivingDataURL}`,
      { params, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching receiving data:", error);
    throw error;
  }
};

export const addReceivingRecord = async (newReceiving: PenerimaanData) => {
  try {
    const response = await axios.post(
      `${baseURL}/${receivingDataURL}`,
      {
        tanggal: newReceiving.tanggal,
        total: newReceiving.tanggal,
        items: newReceiving.items,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding receiving record:", error);
    throw error;
  }
};

export const updateReceivingRecord = async (
  id: number,
  newReceiving: PenerimaanData
): Promise<PenerimaanData> => {
  try {
    const response = await axios.put<PenerimaanData>(
      `${baseURL}/${receivingDataURL}/${id}`,
      {
        tanggal: newReceiving.tanggal,
        total: newReceiving.tanggal,
        items: newReceiving.items,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating receiving record:", error);
    throw error;
  }
};

export const deleteReceivingRecord = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${receivingDataURL}/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting receiving record:", error);
    throw error;
  }
};
