import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import authRoutes from "./routes/auth.js";
import pool from "./config/database.js";
import profileRoutes from "./routes/profile.js";
import friendsRoutes from "./routes/friends.js";
import { setupSocket } from "../socket.js";
import messagesRoutes from "./routes/messages.js";
import postsRoutes from "./routes/posts.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  return res.status(200).end();
});
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/posts", postsRoutes);

setupSocket(server);

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Postgres database connected. Current time:", res.rows[0].now);
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
