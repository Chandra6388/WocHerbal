import axios from "axios";
import { API_URL } from "@/Utils/config";

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
