import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createProfile = async (profileData) => {
  const response = await axios.post(`${API_URL}/profile`, profileData);
  return response.data;
};

export const getProfile = async (userId) => {
  return await axios.get(`${API_URL}/profile/${userId}`);
};
export const updateProfile = async (profileData) => {
  return await axios.patch(`${API_URL}/profile`, profileData);
};
