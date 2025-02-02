import express from "express";
import multer from "multer";
import pool from "../config/database.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id, first_name, last_name, profile_image, bio FROM users WHERE id = $1",
      [userId]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve profile" });
  }
});

router.put(
  "/",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    const { firstName, lastName, bio } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    try {
      const userId = req.user.id;

      const result = await pool.query(
        `UPDATE users
       SET first_name = $1, last_name = $2, bio = $3, profile_image = COALESCE($4, profile_image)
       WHERE id = $5 RETURNING id, first_name, last_name, profile_image, bio`,
        [firstName, lastName, bio, profileImage, userId]
      );

      const updatedUser = result.rows[0];

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Could not update profile" });
    }
  }
);

router.get("/search", async (req, res) => {
  try {
    const { first_name, last_name, city, age } = req.query;

    let query = `SELECT * FROM users WHERE 1=1`;
    let values = [];

    if (first_name) {
      query += ` AND first_name ILIKE $${values.length + 1}`;
      values.push(`%${first_name}%`);
    }
    if (last_name) {
      query += ` AND last_name ILIKE $${values.length + 1}`;
      values.push(`%${last_name}%`);
    }
    if (city) {
      query += ` AND city ILIKE $${values.length + 1}`;
      values.push(`%${city}%`);
    }
    if (age) {
      query += ` AND age = $${values.length + 1}`;
      values.push(age);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error in search route:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/friends", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT f.friend_id, u.first_name, u.last_name, u.profile_image
       FROM friends f
       INNER JOIN users u ON f.friend_id = u.id
       WHERE f.user_id = $1`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve friends" });
  }
});

export default router;
