"use client";

import { useState, useCallback, useMemo } from "react";
import { searchUsers } from "@/services/apiClient";
import SearchBar from "@/components/SearchBar";

import { sendFriendRequest } from "@/services/apiClient";

const handleSendRequest = async (userId: number) => {
  try {
    await sendFriendRequest(userId);
    alert("Friend request sent!");
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
};

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  const handleSearch = useCallback(async (filters: any) => {
    const results = await searchUsers(filters);
    setUsers(results);
  }, []);

  const userCards = useMemo(
    () =>
      users.map((user: any) => (
        <div key={user.id} className="bg-white p-4 shadow rounded-lg">
          <img
            src={`http://localhost:3000/uploads/${user.profile_image}`}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto"
          />
          <h2 className="text-center font-bold">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-center text-gray-600">
            {user.city}, Age: {user.age}
          </p>
          <div key={user.id} className="bg-white p-4 shadow rounded-lg">
            <p className="font-bold">
              {user.first_name} {user.last_name}
            </p>
            <button
              onClick={() => handleSendRequest(user.id)}
              className="bg-blue-500 text-white p-2 rounded mt-2"
            >
              Add Friend
            </button>
          </div>
        </div>
      )),
    [users]
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {userCards}
      </div>
    </div>
  );
};

export default Dashboard;
