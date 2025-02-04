export const createComment = async (postId, userId, content) => {
  const result = await pool.query(
    "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
    [postId, userId, content]
  );
  return result.rows[0];
};

export const getCommentsByPost = async (postId) => {
  const result = await pool.query(
    "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC",
    [postId]
  );
  return result.rows;
};
