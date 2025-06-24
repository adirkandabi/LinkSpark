import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const createPost = async (postData) => {
  const res = await axios.post(`${BASE_URL}/posts`, postData);
  return res.data.post;
};

export const getAllPosts = async (filters = {}) => {
  const res = await axios.get(`${BASE_URL}/posts`, { params: filters });
  console.log(res);

  return res.data;
};

export const updatePost = async (post_id, updateData) => {
  await axios.put(`${BASE_URL}/posts/${post_id}`, updateData);
};

export const deletePost = async (post_id) => {
  await axios.delete(`${BASE_URL}/posts/${post_id}`);
};
