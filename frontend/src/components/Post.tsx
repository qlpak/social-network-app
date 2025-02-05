import React, { useState, useEffect } from "react";
import { usePostContext } from "../context/PostContext";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import { Favorite, FavoriteBorder, Edit, Delete } from "@mui/icons-material";

interface Comment {
  id: number;
  postId: number;
  content: string;
}

interface PostProps {
  post: {
    id: number;
    user_id: number;
    content: string;
    image_url?: string;
    likes: number;
    created_at: string;
    comments: { id: number; content: string }[];
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { dispatch } = usePostContext();
  const [editing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState(post.content);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const currentUserId = 1;

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/posts/${post.id}/likes`
        );
        const data = await response.json();
        setLikeCount(data.likes);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [post.id]);

  const handleLikeToggle = async () => {
    try {
      if (hasLiked) {
        await fetch(`http://localhost:3000/api/posts/${post.id}/unlike`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        });
        setLikeCount((prev) => Math.max(prev - 1, 0));
      } else {
        await fetch(`http://localhost:3000/api/posts/${post.id}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        });
        setLikeCount((prev) => prev + 1);
      }
      setHasLiked(!hasLiked);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDelete = async () => {
    if (post.user_id !== currentUserId) return;
    try {
      await fetch(`http://localhost:3000/api/posts/${post.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      dispatch({ type: "DELETE_POST", payload: post.id });
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleUpdate = () => {
    if (post.user_id !== currentUserId) return;
    const updatedPost = { ...post, content: newContent };
    dispatch({ type: "UPDATE_POST", payload: updatedPost });
    setEditing(false);
  };

  return (
    <Card
      sx={{
        backgroundColor: "#1e1e1e",
        color: "#fff",
        borderRadius: 2,
        boxShadow: 3,
        mb: 2,
      }}
    >
      <CardContent>
        {editing ? (
          <>
            <TextField
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              fullWidth
              multiline
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button onClick={handleUpdate} variant="contained" color="success">
              Zapisz
            </Button>
          </>
        ) : (
          <Typography variant="body1">
            {post.content || "Brak treści"}
          </Typography>
        )}

        {post.image_url && (
          <CardMedia
            component="img"
            image={post.image_url}
            alt="Post Image"
            sx={{ mt: 2, borderRadius: 1 }}
          />
        )}

        <div className="flex space-x-4 mt-2">
          <IconButton
            onClick={handleLikeToggle}
            color={hasLiked ? "error" : "default"}
          >
            {hasLiked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            {likeCount}
          </Typography>

          {post.user_id === currentUserId && (
            <>
              <IconButton onClick={() => setEditing(!editing)} color="warning">
                <Edit />
              </IconButton>
              <IconButton onClick={handleDelete} color="error">
                <Delete />
              </IconButton>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Post;
