import axios from 'axios';
import { API_URL } from '@/Utils/config';

export const addBlog = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/blogs/add`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllBlogs = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/blogs/get`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBlogById = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/blogs/getBlogById`,data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteBlog = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/blogs/delete`,data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const publishBlog = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/blogs/publish`,data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateBlog = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/blogs/update`,data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

