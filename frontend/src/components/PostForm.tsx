import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { usePosts } from "../hooks/usePosts";

const PostForm = () => {
  const { addPost } = usePosts();
  const userId = 1;

  return (
    <Formik
      initialValues={{ content: "", imageUrl: "" }}
      validationSchema={Yup.object({
        content: Yup.string().required("Post content is required"),
      })}
      onSubmit={(values, { resetForm }) => {
        const userId = 1;
        addPost(userId, values.content, values.imageUrl);
        resetForm({ values: { content: "", imageUrl: "" } });
      }}
    >
      <Form className="bg-white p-4 shadow-md rounded-lg">
        <Field
          name="content"
          as="textarea"
          placeholder="What's on your mind?"
          className="w-full p-2 border rounded"
        />
        <ErrorMessage name="content" component="div" className="text-red-500" />
        <Field
          name="imageUrl"
          type="text"
          placeholder="Image URL (optional)"
          className="w-full p-2 border rounded mt-2"
        />
        <button
          type="submit"
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Post
        </button>
      </Form>
    </Formik>
  );
};

export default PostForm;
