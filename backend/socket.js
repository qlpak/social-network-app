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

      socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
      });

      socket.on("sendMessage", (data) => {
        console.log(`new message: ${data.content}`);
        io.to(`chat_${data.receiver_id}`).emit("receiveMessage", data);
      });

      socket.on("disconnect", () => {
        // console.log("User disconnected:", socket.id);
      });
    });

    server.io = io;
  }
};

export { io, setupSocket };
