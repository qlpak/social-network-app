"use client";
import React, { lazy, Suspense, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { searchUsers, sendFriendRequest } from "@/services/apiClient";
import SearchBar from "@/components/SearchBar";
import { usePostContext } from "@/context/PostContext";

const PostsList = lazy(() => import("../../components/PostsList"));
import PostForm from "../../components/PostForm";

const Dashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);

  const handleSearch = useCallback(async (filters: any) => {
    const results = await searchUsers(filters);
    setUsers(results);
  }, []);

  const handleSendRequest = async (userId: number) => {
    try {
      await sendFriendRequest(userId);
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const userCards = useMemo(
    () =>
      users.map((user: any) => (
        <div
          key={user.id}
          className="bg-gray-700 text-white p-6 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 border border-gray-600"
        >
          <img
            src={`http://localhost:3000/uploads/${user.profile_image}`}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto border-4 border-gray-500 shadow-sm"
          />
          <h2 className="text-center font-semibold text-lg mt-2 text-gray-100">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-center text-gray-300 text-sm">
            {user.city}, Age: {user.age}
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => handleSendRequest(user.id)}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Add Friend
            </button>
            <button
              onClick={() => router.push(`/chat/${user.id}`)}
              className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition font-medium"
            >
              Chat
            </button>
          </div>
        </div>
      )),
    [users, router]
  );

  return (
    <div className="p-8 bg-gray-800 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <div className="w-full bg-gray-700 p-4 rounded-lg shadow-md mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="grid grid-cols-3 gap-6">
          {/* Sekcja postów */}
          <div className="col-span-2 bg-gray-700 p-6 rounded-xl shadow-md border border-gray-600">
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">Posts</h2>
            <Suspense fallback={<p>Loading posts...</p>}>
              <PostsList />
            </Suspense>
          </div>

          {/* Formularz dodawania postu */}
          <div className="bg-gray-700 p-6 rounded-xl shadow-md border border-gray-600 w-80 self-start">
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">
              Create Post
            </h2>
            <PostForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
