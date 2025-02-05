"use client";
import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { getPosts } from "../services/apiClient";

interface Comment {
  id: number;
  content: string;
  author: string;
}

interface Post {
  id: number;
  user_id: number;
  content: string;
  image_url?: string;
  created_at: string;
  likes: number;
  comments: Comment[];
  hasLiked?: boolean;
  author: string;
}

type Action =
  | { type: "SET_POSTS"; payload: Post[] }
  | { type: "ADD_POST"; payload: Post }
  | { type: "UPDATE_POST"; payload: Post }
  | { type: "DELETE_POST"; payload: number }
  | { type: "LIKE_POST"; payload: { postId: number; likes: number } }
  | { type: "UNLIKE_POST"; payload: { postId: number; likes: number } }
  | {
      type: "ADD_COMMENT";
      payload: { postId: number; id: number; content: string; author: string };
    };

const postReducer = (state: Post[], action: Action): Post[] => {
  switch (action.type) {
    case "SET_POSTS":
      return action.payload.map((post) => ({
        ...post,
        comments: Array.isArray(post.comments)
          ? post.comments.map((comment: Comment) => ({
              ...comment,
              author: comment.author || "Unknown",
            }))
          : [],

        likes: post.likes || 0,
        hasLiked: post.hasLiked ?? false,
        author: post.author || "Unknown",
      }));

    case "ADD_POST":
      return [...state, action.payload];

    case "ADD_COMMENT":
      return state.map((post) =>
        post.id === action.payload.postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: action.payload.id || Date.now(),
                  content: action.payload.content,
                  author: action.payload.author || "Unknown",
                },
              ],
            }
          : post
      );

    case "LIKE_POST":
      return state.map((post) =>
        post.id === action.payload.postId
          ? { ...post, likes: action.payload.likes }
          : post
      );

    case "UNLIKE_POST":
      return state.map((post) =>
        post.id === action.payload.postId
          ? { ...post, likes: action.payload.likes }
          : post
      );

    default:
      return state;
  }
};

const PostContext = createContext<
  { posts: Post[]; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, dispatch] = useReducer(postReducer, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/posts");
        if (!response.ok) throw new Error("Failed to fetch posts");

        const fetchedPosts = await response.json();

        const processedPosts = await Promise.all(
          fetchedPosts.map(async (post: Post) => {
            try {
              const commentsResponse = await fetch(
                `http://localhost:3000/api/posts/${post.id}/comments`
              );
              const comments = commentsResponse.ok
                ? await commentsResponse.json()
                : [];

              const likesResponse = await fetch(
                `http://localhost:3000/api/posts/${post.id}/likes`
              );
              const likesData = likesResponse.ok
                ? await likesResponse.json()
                : { likes: 0 };

              return {
                ...post,
                comments: (comments || []).map((comment: Comment) => ({
                  ...comment,
                  author: comment.author || "Unknown",
                })),
                likes: likesData.likes || 0,
                author: post.author || "Unknown",
              };
            } catch (err) {
              console.error(
                `Error fetching comments or likes for post ${post.id}:`,
                err
              );
              return { ...post, comments: [], likes: 0, author: "Unknown" };
            }
          })
        );

        dispatch({ type: "SET_POSTS", payload: processedPosts });
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <PostContext.Provider value={{ posts, dispatch }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context)
    throw new Error("usePostContext must be used within a PostProvider");
  return context;
};
