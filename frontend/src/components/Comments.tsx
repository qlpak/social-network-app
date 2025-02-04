import React, { useState } from "react";
import { usePosts } from "../hooks/usePosts";
interface Comment {
  id: number;
  content: string;
}

interface CommentsProps {
  postId: number;
  comments: Comment[];
}

const Comments: React.FC<CommentsProps> = ({ postId, comments }) => {
  const { addComment } = usePosts();
  const [comment, setComment] = useState("");

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Comments</h3>

      {(comments || []).map((c: Comment) => (
        <div key={c.id} className="bg-gray-100 p-2 rounded my-2">
          <p>{c.content}</p>
        </div>
      ))}

      <div className="mt-2 flex">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={() => addComment(postId, comment)}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Comments;
