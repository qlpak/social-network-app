"use client";

import { useState } from "react";

const EditProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
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
      const updatedUser = await response.json();
      setMessage("Profile updated successfully!");
      setProfileImage(null);
      window.location.reload();
    } else {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <div className="mb-4">
          <label htmlFor="firstName" className="block font-bold mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block font-bold mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block font-bold mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="profileImage" className="block font-bold mb-2">
            Profile Image
          </label>
          <input
            type="file"
            id="profileImage"
            onChange={(e) => {
              if (e.target.files) {
                setProfileImage(e.target.files[0]);
              }
            }}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
        >
          Save Changes
        </button>
      </form>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
};

export default EditProfile;
