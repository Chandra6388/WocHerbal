import axios from 'axios';
import { API_URL } from '@/Utils/config';


export const getAllUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/admin/users`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const updateUserStatus = async (data) => {
  try {
    const response = await axios.put(`${API_URL}/admin/users/updateUserStatus/${data?.id}`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const deletUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/admin/users/delete/${data?.id}`, data);
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


export const verifyByrazorpay = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/orders/verify-payment`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
