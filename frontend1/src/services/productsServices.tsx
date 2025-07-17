import axios from "axios";
import { API_URL } from "../Utils/config";
axios.defaults.withCredentials = true; // Enable sending cookies with requests

export const getAllProducts = async (data) => {
  try {
    const response = await axios.get(`${API_URL}/products`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
