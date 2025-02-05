"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getMessages, sendMessage } from "@/services/apiClient";
import { io } from "socket.io-client";

const ChatPage = () => {
  const params = useParams();
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const chatUserId = Number(params?.id);
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

  useEffect(() => {
    if (!myUserId || !chatUserId || myUserId === chatUserId) return;

    const chatRoom = `chat_${Math.min(myUserId, chatUserId)}_${Math.max(myUserId, chatUserId)}`;
    socket.current.emit("joinRoom", {
      sender_id: myUserId,
      receiver_id: chatUserId,
    });

    console.log("🔗 Dołączono do pokoju:", chatRoom);

    const fetchMessages = async () => {
      const response = await getMessages(chatUserId);
      setMessages(response.data);
    };

    fetchMessages();

    const messageListener = (newMessage: any) => {
      console.log("📩 Otrzymano wiadomość z Socket.io:", newMessage);
      if (!newMessage) return;
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.current.on("receiveMessage", messageListener);

    return () => {
      console.log("disonnected from the room", chatRoom);
      socket.current.off("receiveMessage", messageListener);
    };
  }, [myUserId, chatUserId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !myUserId) return;

    const newMessage = {
      sender_id: myUserId,
      receiver_id: chatUserId,
      content: message,
    };

    console.log("sending message: ", newMessage);

    try {
      const response = await sendMessage(
        newMessage.receiver_id,
        newMessage.content
      );
      console.log("api response: ", response.data);

      if (response.data) {
        socket.current.emit("sendMessage", response.data);
        console.log("sent through scoket.io: ", response.data);
        setMessages((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("errorn seindign message: ", error);
    }

    setMessage("");
  };

  if (myUserId === null) {
    return <p>Loading chat...</p>;
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Chat with User {chatUserId}</h1>
      <div className="border bg-gray-800 p-4 w-full max-w-lg h-96 overflow-y-auto rounded-lg shadow-md flex flex-col-reverse">
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
