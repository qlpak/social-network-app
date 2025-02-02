import { useState } from "react";
import { sendFriendRequest } from "@/services/apiClient";

interface AddFriendButtonProps {
  receiverId: number;
}

const AddFriendButton = ({ receiverId }: AddFriendButtonProps) => {
  const [status, setStatus] = useState("Add Friend");

  const handleClick = async () => {
    try {
      await sendFriendRequest(receiverId);
      setStatus("Request Sent");
    } catch (error) {
      console.error("Error sending request:", error);
      setStatus("Error");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {status}
    </button>
  );
};

export default AddFriendButton;
