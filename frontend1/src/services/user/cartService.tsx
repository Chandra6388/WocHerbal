import axios from 'axios';
import { API_URL } from '@/Utils/config';


export const addToCartProduct = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/cart/add`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAddToCartProduct = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/cart`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateCartItem = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/cart/update`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const removeCartItem = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/cart/remove/${data?.id}`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

