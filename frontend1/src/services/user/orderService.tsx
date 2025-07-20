import axios from 'axios';
import { API_URL } from '@/Utils/config';


export const getmyOrder = async (data) => {
  try {
    const response = await axios.get(`${API_URL}/orders/me`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


