import axios from "axios";
import { API_URL } from "@/Utils/config";
axios.defaults.withCredentials = true; // Enable sending cookies with requests

export const getRocketShipmentsAvailabilty = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/shipment/getServiceability`,

      data
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// getOrders
export const getOrders = async (data) => {
  try {
    const response = await axios.get(`${API_URL}/shipment/getOrders`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
