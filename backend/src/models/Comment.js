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
    `SELECT comments.*, users.first_name, users.last_name 
       FROM comments 
       JOIN users ON users.id = comments.user_id
       WHERE post_id = $1 ORDER BY created_at ASC`,
    [postId]
  );
  return result.rows.map((comment) => ({
    ...comment,
    author: `${comment.first_name} ${comment.last_name}`,
  }));
};
