import axios from "axios";
import { API_URL } from "../Utils/config";

export const getAllProducts = async (data) => {
  try {
    const response = await axios.get(`${API_URL}/products`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const Addfavorlist = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/user/favorites/add`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getfavorlist = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/user/favorites`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const removeFavorlist = async (data) => {
  try {
    const response = await axios.delete(
      `${API_URL}/user/favorites/remove/${data.productId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProductById = async (data) => {
  try {
    const response = await axios.get(`${API_URL}/products/${data.productId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createProductReview = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/products/review`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};



