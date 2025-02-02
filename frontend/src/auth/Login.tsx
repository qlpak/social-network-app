import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/login.css";

const Login = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        values
      );
      const token = response.data.token;

      localStorage.setItem("token", token);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="login-form">
          <div className="login-field">
            <label htmlFor="email" className="login-label">
              Email
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              className="login-input"
            />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <Field
              type="password"
              id="password"
              name="password"
              className="login-input"
            />
            <ErrorMessage name="password" component="div" className="error" />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </Form>
      </Formik>
      {message && (
        <div
          className={`login-message ${
            message.includes("successful") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Login;
