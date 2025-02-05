"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/register.css";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";

const Register = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const initialValues: Record<string, string> = {
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
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a1f44, #1e3a8a)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Paper
          elevation={12}
          sx={{
            padding: 5,
            borderRadius: 4,
            background: "rgba(30, 58, 138, 0.9)",
            backdropFilter: "blur(12px)",
            textAlign: "center",
            boxShadow: "0px 0px 30px rgba(255, 255, 255, 0.2)",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
            Create Your Account
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, values }) => (
              <Form>
                {Object.keys(initialValues).map((field, index) => (
                  <Box mb={3} key={index}>
                    <TextField
                      fullWidth
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                      value={values[field]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "white",
                          },
                          "&:hover fieldset": {
                            borderColor: "#66bbff",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#0099ff",
                          },
                        },
                        input: { color: "white" },
                        label: { color: "white" },
                      }}
                    />
                    <ErrorMessage name={field}>
                      {(msg) => (
                        <Typography
                          sx={{ color: "#ff6666", fontSize: "14px", mt: 1 }}
                        >
                          {msg}
                        </Typography>
                      )}
                    </ErrorMessage>
                  </Box>
                ))}

                <motion.div whileHover={{ scale: 1.08 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#00ccff",
                      color: "white",
                      padding: "12px",
                      fontSize: "18px",
                      borderRadius: "10px",
                      boxShadow: "0px 5px 15px rgba(0, 204, 255, 0.5)",
                      "&:hover": {
                        backgroundColor: "#0099cc",
                      },
                    }}
                  >
                    Register
                  </Button>
                </motion.div>
              </Form>
            )}
          </Formik>

          {message && (
            <Alert
              severity={message.includes("successful") ? "success" : "error"}
              sx={{ mt: 3 }}
            >
              {message}
            </Alert>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Register;
