import express from "express";
import pool from "../config/database.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { io } from "../../socket.js";

const router = express.Router();

router.get("/:userId", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const chatPartnerId = req.params.userId;

  try {
    const messages = await pool.query(
      `SELECT * FROM messages 
         WHERE (sender_id = $1 AND receiver_id = $2) 
         OR (sender_id = $2 AND receiver_id = $1) 
         ORDER BY created_at ASC`,
      [userId, chatPartnerId]
    );

    res.json(messages.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { receiver_id, content } = req.body;
  const sender_id = req.user.id;

  try {
    console.log(
      "message revieced: ",
      sender_id,
      "to:",
      receiver_id,
      "conetn:",
      content
    );

    const newMessage = await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *",
      [sender_id, receiver_id, content]
    );

    const chatRoom = `chat_${Math.min(sender_id, receiver_id)}_${Math.max(sender_id, receiver_id)}`;

    console.log("emittig message: ", chatRoom);

    if (io) {
      io.to(chatRoom).emit("receiveMessage", newMessage.rows[0]);
      console.log("message sen to tje room: ", chatRoom);
    } else {
      console.error("error, socket ionot available ");
    }

    res.status(201).json(newMessage.rows[0]);
  } catch (error) {
    console.error("error sendig message: ", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
