"use client";
import Link from "next/link";
import { Button, Container, Typography, Box, Paper } from "@mui/material";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        color: "white",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to{" "}
          <span style={{ color: "#4fc3f7" }}>Social Network App</span>
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Connect, share, and engage with your friends.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Join our social network today and start the journey!
          </Typography>

          <Box display="flex" justifyContent="center" mt={3} gap={2}>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Button
                component={Link}
                href="/auth/register"
                variant="contained"
                sx={{
                  backgroundColor: "#4fc3f7",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#039be5" },
                }}
              >
                Register
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Button
                component={Link}
                href="/auth/login"
                variant="contained"
                sx={{
                  backgroundColor: "#66bb6a",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#43a047" },
                }}
              >
                Login
              </Button>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
