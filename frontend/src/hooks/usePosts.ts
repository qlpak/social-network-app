import { useReducer, useEffect } from "react";
import apiClient, {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from "../services/apiClient";

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
  | { type: "LIKE_POST"; payload: number }
  | { type: "ADD_COMMENT"; payload: { postId: number; content: string } }
  | { type: "DELETE_POST"; payload: number };

const postReducer = (state: Post[], action: Action): Post[] => {
  switch (action.type) {
    case "SET_POSTS":
      return action.payload;
    case "ADD_POST":
      return [action.payload, ...state];
    case "UPDATE_POST":
      return state.map((post) =>
        post.id === action.payload.id ? action.payload : post
      );
    case "DELETE_POST":
      return state.filter((post) => post.id !== action.payload);
    default:
      return state;

    case "LIKE_POST":
      return state.map((post) =>
        post.id === action.payload ? { ...post, likes: post.likes + 1 } : post
      );
  }
};

export const usePosts = () => {
  const [posts, dispatch] = useReducer(postReducer, []);

  useEffect(() => {
    async function fetchPosts() {
      const response = await apiClient.get("/api/posts");
      dispatch({ type: "SET_POSTS", payload: response.data });
    }
    fetchPosts();
  }, []);

  const addPost = async (userId: number, content: string, imageUrl: string) => {
    const newPost = await createPost(userId, content, imageUrl);
    const updatedPosts = await getPosts();

    dispatch({ type: "ADD_POST", payload: newPost });
  };

  const editPost = async (postId: number, userId: number, content: string) => {
    dispatch({
      type: "UPDATE_POST",
      payload: {
        id: postId,
        user_id: userId,
        content,
        image_url: "",
        created_at: new Date().toISOString(),
        likes: 0,
        comments: [],
      },
    });
  };

  const removePost = async (postId: number, userId: number) => {
    await deletePost(postId, userId);
    dispatch({ type: "DELETE_POST", payload: postId });
  };
  const likePost = async (postId: number) => {
    dispatch({ type: "LIKE_POST", payload: postId });
  };
  const addComment = async (postId: number, content: string) => {
    dispatch({ type: "ADD_COMMENT", payload: { postId, content } });
  };

  return { posts, addPost, editPost, removePost, likePost, addComment };
};
