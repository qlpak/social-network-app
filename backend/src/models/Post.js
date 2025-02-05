import pool from "../config/database.js";

export const createPost = async (userId, content, imageUrl) => {
  const result = await pool.query(
    "INSERT INTO posts (user_id, content, image_url) VALUES ($1, $2, $3) RETURNING *",
    [userId, content, imageUrl]
  );
  return result.rows[0];
};
export const getAllPosts = async () => {
  const result = await pool.query(
    `SELECT posts.*, 
              users.first_name, users.last_name, 
              COUNT(DISTINCT likes.id) AS likes, 
              COUNT(DISTINCT comments.id) AS comments 
       FROM posts
       JOIN users ON users.id = posts.user_id
       LEFT JOIN likes ON likes.post_id = posts.id
       LEFT JOIN comments ON comments.post_id = posts.id
       GROUP BY posts.id, users.first_name, users.last_name
       ORDER BY posts.created_at DESC`
  );

  return result.rows.map((post) => ({
    ...post,
    author: `${post.first_name} ${post.last_name}`,
  }));
};

export const getPostById = async (postId) => {
  const result = await pool.query("SELECT * FROM posts WHERE id = $1", [
    postId,
  ]);
  return result.rows[0];
};

export const deletePost = async (postId, userId) => {
  await pool.query("DELETE FROM posts WHERE id = $1 AND user_id = $2", [
    postId,
    userId,
  ]);
};

export const updatePost = async (postId, userId, newContent) => {
  const result = await pool.query(
    "UPDATE posts SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [newContent, postId, userId]
  );
  return result.rows[0];
};
