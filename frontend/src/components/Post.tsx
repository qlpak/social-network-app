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
import TagUser from "./TagUser";

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
  const currentUserId = Number(sessionStorage.getItem("userId"));
  const [tags, setTags] = useState<any[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/posts/${post.id}/tags`
        );
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, [post.id]);

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

  const handleLikeToggle = async () => {
    const currentUserId = Number(sessionStorage.getItem("userId"));

    if (!currentUserId) {
      alert("Musisz być zalogowany, aby polubić post!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/${post.id}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Błąd: ${errorData.error || "Nie udało się zmienić lajka"}`);
        return;
      }

      const data = await response.json();
      setHasLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : Math.max(prev - 1, 0)));
    } catch (err) {
      console.error("Błąd togglowania lajka:", err);
    }
  };

  const handleDelete = async () => {
    if (post.user_id !== currentUserId) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/${post.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        }
      );

      if (response.status === 403) {
        alert("Nie masz uprawnień do usunięcia tego posta!");
        return;
      }

      dispatch({ type: "DELETE_POST", payload: post.id });
    } catch (err) {
      console.error("Błąd usuwania posta:", err);
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

      if (response.status === 403) {
        alert("Nie masz uprawnień do edycji tego posta!");
        return;
      }

      if (!response.ok) throw new Error("Błąd edycji posta");

      const updatedPost = await response.json();
      dispatch({ type: "UPDATE_POST", payload: updatedPost });
      setEditing(false);
    } catch (error) {
      console.error("Błąd podczas edycji posta:", error);
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
        {/* {tags.length > 0 && (
          <div className="mt-2">
            <Typography variant="subtitle2" sx={{ color: "#bbb" }}>
              Tagged:
            </Typography>
            {tags.map((tag) => (
              <span key={tag.id} className="text-blue-400 mx-1">
                @{tag.user_id}
              </span>
            ))}
          </div>
        )} */}
        {/* <TagUser postId={post.id} onTagAdded={() => setTags([...tags])} /> */}
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
