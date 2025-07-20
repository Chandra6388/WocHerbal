import axios from 'axios';
import { API_URL } from '@/Utils/config';


export const getAllOrder = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/orders/admin/all`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


