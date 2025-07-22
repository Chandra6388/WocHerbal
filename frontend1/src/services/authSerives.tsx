import axios from "axios";
import { API_URL } from "../Utils/config";
axios.defaults.withCredentials = true; 

export const registerUser = async (userData) => {
  try {
    
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserProfile = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/getUserProfile`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/logout`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await axios.put(`${API_URL}/user/profile/update`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
