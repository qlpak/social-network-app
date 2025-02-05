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
  author: string;
}

interface PostProps {
  post: {
    id: number;
    user_id: number;
    content: string;
    image_url?: string;
    likes: number;
    created_at: string;
    author: string;
    comments: { id: number; content: string; author: string }[];
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
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/posts/${post.id}/likes/${currentUserId}`
        );
        const data = await response.json();
        setHasLiked(data.hasLiked);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [post.id]);

  const handleLikeToggle = async (type: "like" | "dislike") => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/${post.id}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId, type }),
        }
      );

      if (!response.ok) throw new Error("Failed to update like status");

      setHasLiked(type === "like");
      setLikeCount((prev) =>
        type === "like" ? prev + 1 : Math.max(prev - 1, 0)
      );
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

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/${post.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId, content: newContent }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Błąd API:", errorData);
        alert(`error: ${errorData.error || "cant update post.."}`);
        return;
      }

      const updatedPost = await response.json();
      dispatch({ type: "UPDATE_POST", payload: updatedPost });
      setEditing(false);
    } catch (error) {
      console.error("error editing post: ", error);
      alert("server connection refused..");
    }
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
          <CardContent>
            <Typography
              variant="subtitle2"
              sx={{ color: "#bbb", fontWeight: "bold" }}
            >
              {post.author}
            </Typography>
            <Typography variant="body1">
              {post.content || "Brak treści"}
            </Typography>
          </CardContent>
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
            onClick={() => handleLikeToggle("like")}
            color={hasLiked ? "error" : "default"}
          >
            <Favorite />
          </IconButton>

          <IconButton
            onClick={() => handleLikeToggle("dislike")}
            color={!hasLiked ? "error" : "default"}
          >
            <FavoriteBorder />
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
