import { useState, useEffect } from "react";
import {
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/services/apiClient";

interface FriendRequest {
  id: number;
  first_name: string;
  last_name: string;
}

const FriendRequests = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getFriendRequests();
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (requestId: number) => {
    await acceptFriendRequest(requestId);
    setRequests(requests.filter((req) => req.id !== requestId));
  };

  const handleReject = async (requestId: number) => {
    await rejectFriendRequest(requestId);
    setRequests(requests.filter((req) => req.id !== requestId));
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Friend Requests</h2>
      {requests.length === 0 ? (
        <p>No friend requests</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((request) => (
            <li
              key={request.id}
              className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
            >
              <div>
                <p className="font-bold">
                  {request.first_name} {request.last_name}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleAccept(request.id)}
                  className="bg-green-500 text-white p-2 rounded mr-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequests;
