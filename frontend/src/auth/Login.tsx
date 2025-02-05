"use client";

import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";

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
          elevation={10}
          sx={{
            padding: 5,
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            textAlign: "center",
            boxShadow: "0px 0px 30px rgba(255, 255, 255, 0.2)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
            Login to Your Account
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, values }) => (
              <Form>
                <Box mb={3}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={values.email}
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
                  <ErrorMessage name="email">
                    {(msg) => (
                      <Typography
                        sx={{ color: "red", fontSize: "14px", mt: 1 }}
                      >
                        {msg}
                      </Typography>
                    )}
                  </ErrorMessage>
                </Box>

                <Box mb={3}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    value={values.password}
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
                  <ErrorMessage name="password">
                    {(msg) => (
                      <Typography
                        sx={{ color: "red", fontSize: "14px", mt: 1 }}
                      >
                        {msg}
                      </Typography>
                    )}
                  </ErrorMessage>
                </Box>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#0099ff",
                      color: "white",
                      padding: "10px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      "&:hover": { backgroundColor: "#007acc" },
                    }}
                  >
                    LOGIN
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

export default Login;
