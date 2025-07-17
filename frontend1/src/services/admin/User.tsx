import axios from 'axios';
import { API_URL } from '@/Utils/config';


export const getAllUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const createOrder = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/orders/new`, productData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const createOrderByrazorpay = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/orders/create-payment`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
