import React, { useState, useEffect } from "react";
import { usePostContext } from "../context/PostContext";

interface PostProps {
  post: {
    id: number;
    user_id: number;
    content: string;
    image_url?: string;
    likes: number;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { dispatch } = usePostContext();
  const [editing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState(post.content);
  const [hasLiked, setHasLiked] = useState(false);
  const currentUserId = 1;

  useEffect(() => {
    console.log(`Fetching likes for post ID: ${post.id}`);
    fetch(`http://localhost:3000/api/posts/${post.id}/likes`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Likes data:", data);
        setHasLiked(data.likes > 0);
      })
      .catch((err) => console.error("Error fetching likes:", err));
  }, [post.id]);

  const handleLikeToggle = () => {
    if (hasLiked) {
      fetch(`/api/posts/${post.id}/unlike`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      })
        .then(() => {
          dispatch({ type: "LIKE_POST", payload: post.id });
          setHasLiked(false);
        })
        .catch((err) => console.error("Error unliking post:", err));
    } else {
      fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      })
        .then(() => {
          dispatch({ type: "LIKE_POST", payload: post.id });
          setHasLiked(true);
        })
        .catch((err) => console.error("Error liking post:", err));
    }
  };

  const handleSave = () => {
    dispatch({
      type: "UPDATE_POST",
      payload: {
        id: post.id,
        user_id: post.user_id,
        content: newContent,
        image_url: post.image_url || "",
        likes: post.likes,
        comments: [],
        created_at: new Date().toISOString(),
      },
    });
    setEditing(false);
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      {editing ? (
        <>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleSave}
            className="mt-2 p-2 bg-green-500 text-white rounded"
          >
            Save
          </button>
        </>
      ) : (
        <p>{post.content ? post.content : "Brak treści"}</p>
      )}

      {post.image_url && (
        <img src={post.image_url} alt="Post" className="w-full mt-2 rounded" />
      )}

      <div className="flex space-x-4 mt-2">
        <button
          onClick={handleLikeToggle}
          className={`p-2 ${hasLiked ? "bg-red-500" : "bg-blue-500"} text-white rounded`}
        >
          👍 {hasLiked ? "Unlike" : "Like"} ({post.likes})
        </button>
        <button
          onClick={() => setEditing(!editing)}
          className="p-2 bg-yellow-500 text-white rounded"
        >
          🖍️ Edit
        </button>
        <button
          onClick={() => dispatch({ type: "DELETE_POST", payload: post.id })}
          className="p-2 bg-red-500 text-white rounded"
        >
          ❌ Delete
        </button>
      </div>
    </div>
  );
};

export default Post;
