import axios from 'axios';
import { API_URL } from '@/Utils/config';


export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


