import axios from 'axios';
import { API_URL } from '@/Utils/config';


export const getAllOrder = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders/admin/all`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


