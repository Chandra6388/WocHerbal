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

export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.post(`${API_URL}/reviews/delete`, { reviewId });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const approveReview = async (reviewId) => {
  try {
    const response = await axios.post(`${API_URL}/reviews/approve`, { reviewId });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};



