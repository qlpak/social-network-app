"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/register.css";

const Register = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const initialValues = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await axios.post("http://localhost:3000/api/auth/register", values);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Register</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="register-form">
          <div className="register-field">
            <label htmlFor="firstName" className="register-label">
              First Name
            </label>
            <Field
              type="text"
              id="firstName"
              name="firstName"
              className="register-input"
            />
            <ErrorMessage name="firstName" component="div" className="error" />
          </div>

          <div className="register-field">
            <label htmlFor="lastName" className="register-label">
              Last Name
            </label>
            <Field
              type="text"
              id="lastName"
              name="lastName"
              className="register-input"
            />
            <ErrorMessage name="lastName" component="div" className="error" />
          </div>

          <div className="register-field">
            <label htmlFor="username" className="register-label">
              Username
            </label>
            <Field
              type="text"
              id="username"
              name="username"
              className="register-input"
            />
            <ErrorMessage name="username" component="div" className="error" />
          </div>

          <div className="register-field">
            <label htmlFor="email" className="register-label">
              Email
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              className="register-input"
            />
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <div className="register-field">
            <label htmlFor="password" className="register-label">
              Password
            </label>
            <Field
              type="password"
              id="password"
              name="password"
              className="register-input"
            />
            <ErrorMessage name="password" component="div" className="error" />
          </div>

          <button type="submit" className="register-button">
            Register
          </button>
        </Form>
      </Formik>
      {message && (
        <div
          className={`register-message ${
            message.includes("successful") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Register;
