import express from "express";
import {
  createPost,
  getAllPosts,
  deletePost,
  updatePost,
} from "../models/Post.js";
import { createComment, getCommentsByPost } from "../models/Comment.js";
import {
  likePost,
  unlikePost,
  getPostLikes,
  hasUserLikedPost,
} from "../models/Like.js";
import { tagUserInPost, getTagsForPost } from "../models/Tag.js";
import { getUserById } from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, content, imageUrl } = req.body;
    if (!userId || !content) {
      return res
        .status(400)
        .json({ error: "User ID and content are required" });
    }

    const post = await createPost(userId, content, imageUrl);
    res.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await getAllPosts();

    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const user = await getUserById(post.user_id);
        const likes = await getPostLikes(post.id);
        return {
          ...post,
          likes,
          author: user ? `${user.first_name} ${user.last_name}` : "Unknown",
        };
      })
    );

    res.json(postsWithAuthors);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const { userId, content } = req.body;
  const updatedPost = await updatePost(req.params.id, userId, content);
  res.json(updatedPost);
});

router.delete("/:id", async (req, res) => {
  const { userId } = req.body;
  await deletePost(req.params.id, userId);
  res.sendStatus(204);
});

router.post("/:id/comments", async (req, res) => {
  try {
    const { userId, content } = req.body;
    if (!userId || !content) {
      return res.status(400).json({ error: "Missing userId or content" });
    }
    const comment = await createComment(req.params.id, userId, content);
    res.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await getCommentsByPost(req.params.id);

    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const user = await getUserById(comment.user_id);
        return {
          ...comment,
          author: user ? `${user.first_name} ${user.last_name}` : "Unknown",
        };
      })
    );

    res.json(commentsWithAuthors);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:id/like", async (req, res) => {
  const { userId } = req.body;
  const alreadyLiked = await hasUserLikedPost(req.params.id, userId);

  if (alreadyLiked) {
    return res.status(400).json({ error: "User already liked this post" });
  }

  await likePost(req.params.id, userId);
  res.sendStatus(200);
});

router.delete("/:id/unlike", async (req, res) => {
  const { userId } = req.body;
  await unlikePost(req.params.id, userId);
  res.sendStatus(200);
});

router.get("/:id/likes", async (req, res) => {
  try {
    console.log(`Received request for post likes: ${req.params.id}`);
    const likes = await getPostLikes(req.params.id);
    console.log(`Returning likes count: ${likes}`);
    res.json({ likes: likes || 0 });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:id/tag", async (req, res) => {
  const { userId } = req.body;
  await tagUserInPost(req.params.id, userId);
  res.sendStatus(200);
});

router.get("/:id/tags", async (req, res) => {
  const tags = await getTagsForPost(req.params.id);
  res.json(tags);
});

router.get("/:id/likes/:userId", async (req, res) => {
  try {
    const { id, userId } = req.params;
    const hasLiked = await hasUserLikedPost(id, userId);
    res.json({ hasLiked });
  } catch (error) {
    console.error("Error checking like status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
