# 🚀 Social Network App

A full-stack social networking platform built with **Next.js**, **Express.js**, **PostgreSQL**, and **Socket.IO**. Users can register, log in, create posts, comment, like, tag friends, manage friend requests, and chat in real-time.

## ✨ Features

### 🔐 User Auth & Profiles
- Register/Login with JWT authentication
- Profile management with image upload and bio editing
- Search users by name, city, and age

### 👥 Social Features
- Send and accept friend requests
- View and manage friend list
- Create, edit, delete, and like posts
- Comment on posts

### 💌 Messaging
- Real-time private messaging using Socket.IO
- Chat rooms based on user pairs

### 🖥️ Frontend
- Built with Next.js and Tailwind CSS
- Clean, responsive UI with MUI components and Framer Motion animations
- Context-based state management for posts

## 🛠️ Technologies Used

### Backend
- Node.js, Express.js
- PostgreSQL + pg
- bcryptjs for password hashing
- JWT for authentication
- Multer for image uploads
- Socket.IO for real-time communication

### Frontend
- Next.js 13 with App Router
- Tailwind CSS for styling
- MUI for components
- Framer Motion for animations
- React Context API
- Formik + Yup for form handling and validation

## 🧰 Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🗂️ Project Structure

```
backend/
├── routes/         # API route handlers
├── models/         # Database query logic
├── config/         # DB connection and env setup
├── middlewares/    # Express middlewares like auth
└── index.js        # Main server entry

frontend/
├── src/
│   ├── app/              # App routes (Next.js 13 routing)
│   │   ├── auth/         # Login, Register, Logout pages
│   │   ├── chat/         # Chat room pages
│   │   ├── dashboard/    # Main dashboard
│   │   └── profile/      # User profile & edit views
│   ├── components/       # UI Components
│   ├── context/          # Global state context
│   ├── hooks/            # Custom hooks
│   ├── services/         # API client utilities
├── README.md
```

## 📄 License
This project was developed as part of a university course on Frontend Development. It is intended for academic demonstration and evaluation purposes only. Redistribution or commercial use is not permitted.

---

## ✍️ Author
Łukasz Kulpaczyński

