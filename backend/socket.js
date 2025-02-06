import { Server } from "socket.io";

let io;

const setupSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
      //   console.log(`User connected: ${socket.id}`);

      socket.on("joinRoom", ({ sender_id, receiver_id }) => {
        const chatRoom = `chat_${Math.min(sender_id, receiver_id)}_${Math.max(sender_id, receiver_id)}`;
        socket.join(chatRoom);
        console.log(`✅ User ${sender_id} joined room: ${chatRoom}`);
      });

      socket.on("sendMessage", (data) => {
        const chatRoom = `chat_${Math.min(data.sender_id, data.receiver_id)}_${Math.max(data.sender_id, data.receiver_id)}`;
        console.log(`New message in ${chatRoom}: ${data.content}`);
        io.to(chatRoom).emit("receiveMessage", data);
      });

      socket.on("disconnect", () => {
        // console.log("User disconnected:", socket.id);
      });
    });

    server.io = io;
  }
};

export { io, setupSocket };
