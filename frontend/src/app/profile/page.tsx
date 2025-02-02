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
    const token = localStorage.getItem("token");
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

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <img
          src={`http://localhost:3000/uploads/${profile.profile_image}?t=${new Date().getTime()}`}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <h1 className="text-xl font-bold">
          {profile.first_name} {profile.last_name}
        </h1>
        <p className="text-gray-600">{profile.bio}</p>
        <a
          href="/profile/edit"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Edit Profile
        </a>
      </div>

      <div className="mt-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">My Friends</h2>
        {friends.length === 0 ? (
          <p className="text-gray-500">You have no friends yet.</p>
        ) : (
          <ul>
            {friends.map((friend) => (
              <li key={friend.friend_id} className="mb-2">
                <div className="flex items-center">
                  <img
                    src={`http://localhost:3000/uploads/${friend.profile_image}`}
                    alt="Friend"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <span>
                    {friend.first_name} {friend.last_name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Friend Requests</h2>
        {friendRequests.length === 0 ? (
          <p className="text-gray-500">No friend requests</p>
        ) : (
          <ul>
            {friendRequests.map((request) => (
              <li
                key={request.id}
                className="mb-2 flex justify-between items-center bg-white p-4 shadow rounded-lg"
              >
                <div className="flex items-center">
                  <img
                    src={`http://localhost:3000/uploads/${request.profile_image}`}
                    alt="Requester"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <span>
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
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
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
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
