import React, { lazy, Suspense } from "react";
import { usePostContext } from "@/context/PostContext";

import Post from "./Post";
import Comments from "./Comments";

const PostsList: React.FC = () => {
  const { posts } = usePostContext();

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">
          No posts yet. Be the first to post!
        </p>
      ) : (
        <Suspense fallback={<p>Loading posts...</p>}>
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-4 shadow rounded-lg">
              <Post post={post} />
              <Suspense fallback={<p>Loading comments...</p>}>
                <Comments postId={post.id} comments={post.comments || []} />
              </Suspense>
            </div>
          ))}
        </Suspense>
      )}
    </div>
  );
};

export default PostsList;
