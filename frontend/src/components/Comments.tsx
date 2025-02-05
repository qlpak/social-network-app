import React, { useState, useEffect } from "react";
import { usePostContext } from "../context/PostContext";
import { TextField, Button, Box, Typography } from "@mui/material";

interface Comment {
  id: number;
  content: string;
  author: string;
}

interface CommentsProps {
  postId: number;
  comments?: Comment[];
}

const Comments: React.FC<CommentsProps> = ({ postId, comments = [] }) => {
  const { dispatch } = usePostContext();
  const [comment, setComment] = useState("");
  const [loadedComments, setLoadedComments] = useState<Comment[]>(comments);

  useEffect(() => {
    if (comments.length === 0) {
      const fetchComments = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/posts/${postId}/comments`
          );
          const fetchedComments = await response.json();
          setLoadedComments(
            fetchedComments.map((comment: any) => ({
              ...comment,
              author: comment.author || "Unknown",
            }))
          );
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };
      fetchComments();
    }
  }, [postId, comments]);

  const handleAddComment = async () => {
    if (comment.trim() === "") return;

    const currentUserId = Number(sessionStorage.getItem("userId"));
    if (!currentUserId) {
      alert("tou need to be logged in to add comment");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId, content: comment }),
        }
      );

      if (response.status === 403) {
        alert("Nie możesz dodać komentarza!");
        return;
      }

      if (!response.ok) throw new Error("Failed to add comment");

      const newComment = await response.json();
      setComment("");
      setLoadedComments((prev) => [...prev, newComment]);
      dispatch({
        type: "ADD_COMMENT",
        payload: {
          postId,
          id: newComment.id,
          content: newComment.content,
          author: newComment.author || "Unknown",
        },
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <h3 className="text-lg font-bold">Comments</h3>

      {loadedComments.length > 0 ? (
        loadedComments.map((c) => (
          <Box
            key={c.id}
            sx={{
              backgroundColor: "#333",
              color: "#fff",
              p: 2,
              borderRadius: 1,
              my: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "#bbb", fontWeight: "bold" }}
            >
              {c.author}
            </Typography>
            <p>{c.content}</p>
          </Box>
        ))
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}

      <Box sx={{ mt: 2, display: "flex" }}>
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          fullWidth
          variant="outlined"
          sx={{ backgroundColor: "#fff" }}
        />
        <Button
          onClick={handleAddComment}
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Comments;
