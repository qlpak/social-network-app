import express from "express";
import {
  createPost,
  getAllPosts,
  deletePost,
  updatePost,
} from "../models/Post.js";
import { createComment, getCommentsByPost } from "../models/Comment.js";
import { likePost, unlikePost, getPostLikes } from "../models/Like.js";
import { tagUserInPost, getTagsForPost } from "../models/Tag.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, content, imageUrl } = req.body;
  const post = await createPost(userId, content, imageUrl);
  res.json(post);
});

router.get("/", async (req, res) => {
  const posts = await getAllPosts();
  //   console.log("Backend: posts fetched:", posts);
  res.json(posts);
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
  const { userId, content } = req.body;
  const comment = await createComment(req.params.id, userId, content);
  res.json(comment);
});

router.get("/:id/comments", async (req, res) => {
  const comments = await getCommentsByPost(req.params.id);
  res.json(comments);
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
  const likes = await getPostLikes(req.params.id);
  res.json({ likes });
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

export default router;
