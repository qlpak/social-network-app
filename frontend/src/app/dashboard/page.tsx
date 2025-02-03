"use client";

import { useState, useCallback, useMemo } from "react";
import { searchUsers } from "@/services/apiClient";
import SearchBar from "@/components/SearchBar";

import { sendFriendRequest } from "@/services/apiClient";
import { useRouter } from "next/navigation";

const handleSendRequest = async (userId: number) => {
  try {
    await sendFriendRequest(userId);
    alert("Friend request sent!");
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
};

const Dashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  const handleSearch = useCallback(async (filters: any) => {
    const results = await searchUsers(filters);
    setUsers(results);
  }, []);

  const userCards = useMemo(
    () =>
      users.map((user: any) => (
        <div
          key={user.id}
          className="bg-white p-6 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
        >
          <img
            src={`http://localhost:3000/uploads/${user.profile_image}`}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto border-4 border-gray-200 shadow-sm"
          />
          <h2 className="text-center font-bold text-lg mt-2 text-gray-800">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-center text-gray-600 text-sm">
            {user.city}, Age: {user.age}
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => handleSendRequest(user.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Add Friend
            </button>
            <button
              onClick={() => router.push(`/chat/${user.id}`)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Chat
            </button>
          </div>
        </div>
      )),
    [users]
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {userCards}
      </div>
    </div>
  );
};

export default Dashboard;
