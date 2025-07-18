import axios from 'axios';
import { API_URL } from '@/Utils/config';


export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addNewProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/products/new`, productData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const updateNewProduct = async (productData) => {
  try {
    const response = await axios.put(`${API_URL}/products/${productData.id}`,productData.productData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteProduct = async (productData) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${productData}`, {
      data: productData.productData 
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};


export const addNewCategory = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/category/add`, productData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const getCategory = async () => {
  try {
    const response = await axios.post(`${API_URL}/category/get`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const updateCategory = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/category/update`,data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const deleteCategory = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/category/delete`, productData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

