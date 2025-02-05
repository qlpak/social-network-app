"use client";

import { useEffect, useState } from "react";
import {
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/services/apiClient";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const fetchProfile = async () => {
      const response = await fetch("http://localhost:3000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await response.json();
      setProfile(data);
    };

    const fetchFriends = async () => {
      const response = await fetch(
        "http://localhost:3000/api/profile/friends",
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      const data = await response.json();
      setFriends(data);
    };

    const fetchFriendRequests = async () => {
      try {
        const response = await getFriendRequests();
        setFriendRequests(response.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchProfile();
    fetchFriends();
    fetchFriendRequests();
  }, []);

  if (!profile)
    return (
      <p className="text-gray-500 text-lg text-center mt-10">Loading...</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex flex-col items-center p-6 text-white">
      <div className="bg-gray-800 shadow-2xl rounded-lg p-8 w-full max-w-lg text-center">
        <img
          src={`http://localhost:3000/uploads/${profile.profile_image}?t=${new Date().getTime()}`}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-400 shadow-md"
        />
        <h1 className="text-2xl font-bold">
          {profile.first_name} {profile.last_name}
        </h1>
        <p className="text-gray-300 text-sm">{profile.bio}</p>
        <a
          href="/profile/edit"
          className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition duration-300"
        >
          Edit Profile
        </a>
      </div>

      <div className="mt-8 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">
          My Friends
        </h2>
        {friends.length === 0 ? (
          <p className="text-gray-400 text-center">You have no friends yet.</p>
        ) : (
          <ul>
            {friends.map((friend) => (
              <li
                key={friend.friend_id}
                className="mb-4 flex items-center bg-gray-700 p-3 rounded-lg shadow"
              >
                <img
                  src={`http://localhost:3000/uploads/${friend.profile_image}`}
                  alt="Friend"
                  className="w-10 h-10 rounded-full mr-4 border border-gray-500"
                />
                <span className="text-white font-medium">
                  {friend.first_name} {friend.last_name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">
          Friend Requests
        </h2>
        {friendRequests.length === 0 ? (
          <p className="text-gray-400 text-center">No friend requests</p>
        ) : (
          <ul>
            {friendRequests.map((request) => (
              <li
                key={request.id}
                className="mb-4 flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center">
                  <img
                    src={`http://localhost:3000/uploads/${request.profile_image}`}
                    alt="Requester"
                    className="w-10 h-10 rounded-full mr-4 border border-gray-500"
                  />
                  <span className="text-white font-medium">
                    {request.first_name} {request.last_name}
                  </span>
                </div>
                <div>
                  <button
                    onClick={async () => {
                      await acceptFriendRequest(request.id);
                      setFriendRequests(
                        friendRequests.filter((r) => r.id !== request.id)
                      );
                    }}
                    className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg mr-2 shadow-md transition duration-300"
                  >
                    Accept
                  </button>
                  <button
                    onClick={async () => {
                      await rejectFriendRequest(request.id);
                      setFriendRequests(
                        friendRequests.filter((r) => r.id !== request.id)
                      );
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-300"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;
