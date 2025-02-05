"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";

const EditProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token =
      typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    if (!token) {
      setMessage("You need to log in first.");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("bio", bio);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    const response = await fetch("http://localhost:3000/api/profile", {
      method: "PUT",
      body: formData,
      credentials: "include",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      setMessage("Profile updated successfully!");
      setProfileImage(null);
      setTimeout(() => {
        if (typeof window !== "undefined") {
          router.replace("/profile");
        }
      }, 1500);
    } else {
      setMessage("Something went wrong.");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
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
            padding: 4,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: "#1E293B",
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit Profile
          </Typography>
          <Avatar
            sx={{ width: 80, height: 80, margin: "0 auto", mb: 2 }}
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : "/default-avatar.png"
            }
          />
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                backgroundColor: "#334155",
                borderRadius: 1,
                input: { color: "white" },
                label: { color: "#CBD5E1" },
              }}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                backgroundColor: "#334155",
                borderRadius: 1,
                input: { color: "white" },
                label: { color: "#CBD5E1" },
              }}
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                backgroundColor: "#334155",
                borderRadius: 1,
                input: { color: "white" },
                label: { color: "#CBD5E1" },
              }}
            />
            <input
              type="file"
              id="profileImage"
              onChange={(e) => {
                if (e.target.files) {
                  setProfileImage(e.target.files[0]);
                }
              }}
              style={{ display: "none" }}
            />
            <label htmlFor="profileImage">
              <Button
                component="span"
                variant="contained"
                sx={{ mb: 3, backgroundColor: "#3B82F6" }}
              >
                Upload Profile Image
              </Button>
            </label>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#16A34A",
                  color: "white",
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#15803D" },
                }}
              >
                Save Changes
              </Button>
            </motion.div>
          </form>
          {message && (
            <Typography
              sx={{
                mt: 3,
                color: message.includes("successfully") ? "#4ADE80" : "#EF4444",
              }}
            >
              {message}
            </Typography>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default EditProfile;
