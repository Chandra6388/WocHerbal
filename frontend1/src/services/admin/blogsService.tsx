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



export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "my_unsigned_preset"); 
  formData.append("cloud_name", "dlpeqbowx");  

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/dlpeqbowx/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      console.error("Cloudinary error response: ", data);
      return null;
    }
  } catch (error) {
    console.error("Upload failed", error);
    return null;
  }
};

