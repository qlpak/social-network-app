import pool from "../config/database.js";

export const createComment = async (postId, userId, content) => {
  try {
    const result = await pool.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [postId, userId, content]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting comment:", error);
    throw error;
  }
};

export const getCommentsByPost = async (postId) => {
  const result = await pool.query(
    "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC",
    [postId]
  );
  return result.rows;
};
