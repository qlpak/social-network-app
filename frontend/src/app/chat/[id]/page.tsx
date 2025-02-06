"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getMessages, sendMessage } from "@/services/apiClient";
import { io } from "socket.io-client";

const ChatPage = () => {
  const params = useParams();
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const socket = useRef(
    io("http://localhost:3000", { transports: ["websocket"] })
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = Number(sessionStorage.getItem("userId"));
      setMyUserId(userId);
    }
  }, []);

  const chatId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  if (!chatId) {
    console.error("error: id wrong", params?.id);
    return <p>Error: Invalid chat room.</p>;
  }

  const chatIdParts = chatId.split("_").map(Number);
  if (chatIdParts.length !== 2) {
    console.error("error: wrong id in url", chatId);
    return <p>Error: Invalid chat room.</p>;
  }

  const chatUserId = chatIdParts.find((id) => id !== myUserId);

  useEffect(() => {
    if (!myUserId || !chatUserId) return;

    const chatRoom = `chat_${Math.min(myUserId, chatUserId)}_${Math.max(myUserId, chatUserId)}`;
    socket.current.emit("joinRoom", {
      sender_id: myUserId,
      receiver_id: chatUserId,
    });

    console.log("🔗 Dołączono do pokoju:", chatRoom);

    const messageListener = (newMessage: any) => {
      if (!newMessage) return;

      setMessages((prev) => {
        const messageExists = prev.some((msg) => msg.id === newMessage.id);
        return messageExists ? prev : [...prev, newMessage];
      });
    };

    socket.current.off("receiveMessage");
    socket.current.on("receiveMessage", messageListener);

    return () => {
      socket.current.off("receiveMessage", messageListener);
    };
  }, [myUserId, chatUserId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !myUserId || !chatUserId) {
      console.error("error cant send a message - no id users");
      return;
    }

    const newMessage = {
      sender_id: myUserId,
      receiver_id: chatUserId,
      content: message,
    };

    console.log("🚀 Wysyłanie wiadomości:", newMessage);

    try {
      const response = await sendMessage(
        newMessage.receiver_id,
        newMessage.content
      );
      console.log("api response:", response.data);

      if (response.data) {
        socket.current.emit("sendMessage", response.data);
      }
    } catch (error) {
      console.error("error sending messsage: ", error);
    }

    setMessage("");
  };

  if (myUserId === null) {
    return <p>Loading chat...</p>;
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Chat with User {chatUserId}</h1>
      <div className="border bg-gray-800 p-4 w-full max-w-lg h-96 overflow-y-auto rounded-lg shadow-md flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-lg max-w-xs text-white text-sm ${
              msg.sender_id === myUserId ? "ml-auto bg-blue-500" : "bg-gray-500"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex w-full max-w-lg mt-2 gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-grow rounded-lg bg-gray-700 text-white"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
