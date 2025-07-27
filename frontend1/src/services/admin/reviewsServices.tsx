import axios from 'axios';
import { API_URL } from '@/Utils/config';


export const getAllReview = async () => {
  try {
    const response = await axios.get(`${API_URL}/reviews/all`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


