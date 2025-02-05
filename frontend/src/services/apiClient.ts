import axios from "axios";
import { number } from "yup";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const searchUsers = async (filters: {
  name?: string;
  surname?: string;
  city?: string;
  age?: number;
}) => {
  const query = new URLSearchParams(filters as any).toString();
  const response = await fetch(
    `http://localhost:3000/api/profile/search?${query}`
  );
  return response.json();
};

export default apiClient;

const API_URL = "http://localhost:3000/api/friends";

export const sendFriendRequest = async (receiverId: number) => {
  return axios.post(
    `${API_URL}/request`,
    { receiver_id: receiverId },
    {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    }
  );
};

export const getFriendRequests = async () => {
  return await axios.get("http://localhost:3000/api/friends/requests", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const acceptFriendRequest = async (requestId: number) => {
  return axios.put(
    `${API_URL}/accept/${requestId}`,
    {},
    {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    }
  );
};

export const rejectFriendRequest = async (requestId: number) => {
  return axios.delete(`${API_URL}/reject/${requestId}`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
  });
};

export const getMessages = async (userId: number) => {
  return await axios.get(`http://localhost:3000/api/messages/${userId}`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    withCredentials: true,
  });
};

export const sendMessage = async (receiver_id: number, content: string) => {
  return await axios.post(
    "http://localhost:3000/api/messages",
    { receiver_id, content },
    {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      withCredentials: true,
    }
  );
};

const API_URL_POSTS = "http://localhost:3000/api/posts";

export const getPosts = async () => {
  const response = await axios.get(API_URL_POSTS);
  return response.data;
};

export const createPost = async (
  userId: number,
  content: string,
  imageUrl: string
) => {
  const response = await axios.post(API_URL_POSTS, {
    userId,
    content,
    imageUrl,
  });
  return response.data;
};

export const updatePost = async (
  postId: number,
  userId: number,
  newContent: string
) => {
  const response = await axios.put(`${API_URL_POSTS}/${postId}`, {
    userId,
    content: newContent,
  });
  return response.data;
};

export const deletePost = async (postId: number, userId: number) => {
  await axios.delete(`${API_URL_POSTS}/${postId}`, { data: { userId } });
};

export const addComment = async (
  postId: number,
  userId: number,
  content: string
) => {
  const response = await axios.post(`${API_URL_POSTS}/${postId}/comments`, {
    userId,
    content,
  });
  return response.data;
};

export const getComments = async (postId: number) => {
  const response = await axios.get(`${API_URL_POSTS}/${postId}/comments`);
  return response.data;
};

export const likePost = async (postId: number, userId: number) => {
  await axios.post(`${API_URL_POSTS}/${postId}/like`, { userId });
};

export const unlikePost = async (postId: number, userId: number) => {
  await axios.delete(`${API_URL_POSTS}/${postId}/unlike`, { data: { userId } });
};

export const getPostLikes = async (postId: number) => {
  const response = await axios.get(`${API_URL_POSTS}/${postId}/likes`);
  return response.data.likes;
};

export const tagUserInPost = async (postId: number, userId: number) => {
  await axios.post(`${API_URL_POSTS}/${postId}/tag`, { userId });
};

export const getTagsForPost = async (postId: number) => {
  const response = await axios.get(`${API_URL_POSTS}/${postId}/tags`);
  return response.data;
};
