import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { usePostContext } from "../context/PostContext";

const PostForm = () => {
  const { dispatch } = usePostContext();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(Number(sessionStorage.getItem("userId")));
    }
  }, []);
  return (
    <Formik
      initialValues={{ content: "", imageUrl: "" }}
      validationSchema={Yup.object({
        content: Yup.string().required("Post content is required"),
      })}
      onSubmit={async (values, { resetForm }) => {
        try {
          const response = await fetch("http://localhost:3000/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, ...values }),
          });

          if (!response.ok) {
            throw new Error("Failed to create post");
          }

          const newPost = await response.json();
          dispatch({ type: "ADD_POST", payload: newPost });
          resetForm({ values: { content: "", imageUrl: "" } });
        } catch (error) {
          console.error("Error creating post:", error);
        }
      }}
    >
      <Form className="bg-gray-900 text-white p-4 shadow-md rounded-lg">
        <Field
          name="content"
          as="textarea"
          placeholder="What's on your mind?"
          className="w-full p-2 border rounded bg-gray-800 text-white"
        />
        <ErrorMessage name="content" component="div" className="text-red-500" />
        <Field
          name="imageUrl"
          type="text"
          placeholder="Image URL (optional)"
          className="w-full p-2 border rounded mt-2 bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Post
        </button>
      </Form>
    </Formik>
  );
};

export default PostForm;
