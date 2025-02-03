"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getMessages, sendMessage } from "@/services/apiClient";
import { io } from "socket.io-client";

const ChatPage = () => {
  const params = useParams();
  const userId = params?.id as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const socket = useRef(
    io("http://localhost:3000", { transports: ["websocket"] })
  );

  useEffect(() => {
    if (!userId) return;

    socket.current.emit("register", userId);

    socket.current.emit("joinRoom", `chat_${userId}`);

    const fetchMessages = async () => {
      const response = await getMessages(Number(userId));
      setMessages(response.data);
    };

    fetchMessages();

    socket.current.on("receiveMessage", (newMessage) => {
      if (!newMessage) return;
      console.log(
        `new message ${newMessage.content} from ${newMessage.sender_id}`
      );
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.current.off("receiveMessage");
    };
  }, [userId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      sender_id: "me",
      receiver_id: Number(userId),
      content: message,
    };

    try {
      const response = await sendMessage(
        newMessage.receiver_id,
        newMessage.content
      );
      if (response.data) {
        socket.current.emit("sendMessage", response.data);
        setMessages((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("error sending message: ", error);
    }

    setMessage("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Chat</h1>
      <div className="border bg-white p-4 w-full max-w-lg h-80 overflow-y-auto rounded-lg shadow-md">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-lg max-w-xs text-white text-sm ${
              msg.sender_id === "me" ? "ml-auto bg-blue-500" : "bg-gray-300"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full max-w-lg mt-2 rounded-lg"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 text-white p-2 mt-2 w-full max-w-lg rounded-lg hover:bg-blue-600 transition"
      >
        Send
      </button>
    </div>
  );
};
export default ChatPage;
