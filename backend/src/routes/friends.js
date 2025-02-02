import express from "express";
import pool from "../config/database.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/request", authMiddleware, async (req, res) => {
  const { receiver_id } = req.body;
  const sender_id = req.user.id;

  try {
    const existingRequest = await pool.query(
      "SELECT * FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2",
      [sender_id, receiver_id]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({ error: "Request already sent" });
    }

    await pool.query(
      "INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2)",
      [sender_id, receiver_id]
    );

    res.status(201).json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/requests", authMiddleware, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const requests = await pool.query(
      `SELECT fr.id, u.first_name, u.last_name, u.profile_image
         FROM friend_requests fr
         JOIN users u ON fr.sender_id = u.id
         WHERE fr.receiver_id = $1 AND fr.status = 'pending'`,
      [userId]
    );

    res.json(requests.rows);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/accept/:id", authMiddleware, async (req, res) => {
  const requestId = req.params.id;
  const userId = req.user.id;

  try {
    const request = await pool.query(
      "SELECT * FROM friend_requests WHERE id = $1 AND receiver_id = $2",
      [requestId, userId]
    );

    if (request.rows.length === 0) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    const { sender_id, receiver_id } = request.rows[0];

    await pool.query(
      "UPDATE friend_requests SET status = 'accepted' WHERE id = $1",
      [requestId]
    );

    await pool.query(
      "INSERT INTO friends (user_id, friend_id) VALUES ($1, $2), ($2, $1)",
      [sender_id, receiver_id]
    );

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/reject/:id", authMiddleware, async (req, res) => {
  const requestId = req.params.id;
  const userId = req.user.id;

  try {
    const request = await pool.query(
      "SELECT * FROM friend_requests WHERE id = $1 AND receiver_id = $2",
      [requestId, userId]
    );

    if (request.rows.length === 0) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    await pool.query("DELETE FROM friend_requests WHERE id = $1", [requestId]);

    res.json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
