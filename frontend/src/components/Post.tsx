import React, { useState } from "react";
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
        <p>{post.content}</p>
      )}

      {post.image_url && (
        <img src={post.image_url} alt="Post" className="w-full mt-2 rounded" />
      )}

      <div className="flex space-x-4 mt-2">
        <button
          onClick={() => dispatch({ type: "LIKE_POST", payload: post.id })}
          className="p-2 bg-blue-500 text-white rounded"
        >
          👍 Like ({post.likes})
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
