import React, { useEffect } from "react";
import { usePostContext } from "@/context/PostContext";
import Post from "./Post";
import Comments from "./Comments";

const PostsList: React.FC = () => {
  const { posts, dispatch } = usePostContext();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        dispatch({ type: "SET_POSTS", payload: data });
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [dispatch]);

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p className="text-gray-300 text-center">
          No posts yet. Be the first to post!
        </p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-900 text-white p-4 shadow rounded-lg"
          >
            <Post post={post} />
            <Comments postId={post.id} comments={post.comments} />
          </div>
        ))
      )}
    </div>
  );
};

export default PostsList;
