import axios from "axios";

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
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getFriendRequests = async () => {
  return await axios.get("http://localhost:3000/api/friends/requests", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const rejectFriendRequest = async (requestId: number) => {
  return axios.delete(`${API_URL}/reject/${requestId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
