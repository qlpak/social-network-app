"use client";
import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { getPosts } from "../services/apiClient"; // Sprawdź, czy import jest poprawny

interface Comment {
  id: number;
  content: string;
}

interface Post {
  id: number;
  user_id: number;
  content: string;
  image_url?: string;
  created_at: string;
  likes: number;
  comments: { id: number; content: string }[];
}

type Action =
  | { type: "SET_POSTS"; payload: Post[] }
  | { type: "ADD_POST"; payload: Post }
  | { type: "UPDATE_POST"; payload: Post }
  | { type: "DELETE_POST"; payload: number }
  | { type: "LIKE_POST"; payload: number }
  | { type: "ADD_COMMENT"; payload: { postId: number; content: string } };

const postReducer = (state: Post[], action: Action): Post[] => {
  switch (action.type) {
    case "SET_POSTS":
      return action.payload;
    case "ADD_POST":
      return [
        {
          ...action.payload,
          image_url: action.payload.image_url || "",
          created_at: new Date().toISOString(),
          likes: 0,
          comments: [],
        },
        ...state,
      ];
    case "UPDATE_POST":
      return state.map((post) =>
        post.id === action.payload.id ? action.payload : post
      );
    case "DELETE_POST":
      return state.filter((post) => post.id !== action.payload);
    case "ADD_COMMENT":
      return state.map((post) =>
        post.id === action.payload.postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: Date.now(), content: action.payload.content },
              ],
            }
          : post
      );
    case "LIKE_POST":
      return state.map((post) =>
        post.id === action.payload ? { ...post, likes: post.likes + 1 } : post
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
        const fetchedPosts = await getPosts();
        const processedPosts = fetchedPosts.map((post: Post) => ({
          ...post,
          comments: Array.isArray(post.comments) ? post.comments : [],
        }));

        // console.log("posts after processing:", processedPosts);
        dispatch({ type: "SET_POSTS", payload: processedPosts });

        // console.log("posts after processing:", processedPosts);
        dispatch({ type: "SET_POSTS", payload: processedPosts });
      } catch (error) {
        console.error("error fetching posts:", error);
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
