import pool from "../config/database.js";
export const tagUserInPost = async (postId, userId) => {
  await pool.query(
    "INSERT INTO tags (post_id, user_id) VALUES ($1, $2) RETURNING *",
    [postId, userId]
  );
};

export const getTagsForPost = async (postId) => {
  const result = await pool.query("SELECT * FROM tags WHERE post_id = $1", [
    postId,
  ]);
  return result.rows;
};
