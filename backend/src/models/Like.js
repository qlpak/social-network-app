import pool from "../config/database.js";

export const likePost = async (postId, userId, type) => {
  if (!["like", "dislike"].includes(type)) {
    throw new Error("Invalid type");
  }

  await pool.query(
    `INSERT INTO likes (post_id, user_id, type)
       VALUES ($1, $2, $3)
       ON CONFLICT (post_id, user_id)
       DO UPDATE SET type = EXCLUDED.type`,
    [postId, userId, type]
  );
};

export const unlikePost = async (postId, userId) => {
  await pool.query("DELETE FROM likes WHERE post_id = $1 AND user_id = $2", [
    postId,
    userId,
  ]);
};

export const getPostLikes = async (postId) => {
  const result = await pool.query(
    "SELECT COUNT(*)::int AS count FROM likes WHERE post_id = $1",
    [postId]
  );
  return result.rows[0]?.count || 0;
};

export const hasUserLikedPost = async (postId, userId) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM likes WHERE post_id = $1 AND user_id = $2",
    [postId, userId]
  );
  return result.rows[0].count > 0;
};
