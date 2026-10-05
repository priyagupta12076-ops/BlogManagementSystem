# 📝 BlogSphere - Blog Management System (MERN Stack)

A complete full-stack Blog Management System built with **MongoDB**, **Express.js**, **React 19**, and **Node.js** (Vite).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested with v26)
- **MongoDB**: Running locally on `mongodb://127.0.0.1:27017` (or remote MongoDB Atlas URL)

---

### 2. Start the Backend Server

Open a terminal window and run:

```bash
cd backend
npm install
npm run dev
```

> **Backend runs on:** `http://localhost:8080`  
> Connected to MongoDB database: `blogmanagement`

#### 👑 (Optional) Seed Admin Account
To create or reset the administrator account, run:
```bash
npm run seed:admin
```
- **Email:** `admin@blogsphere.com`
- **Password:** `admin123`
- **Role:** `admin`

---

### 3. Start the Frontend Application

Open a second terminal window and run:

```bash
cd frontend
npm install
npm run dev
```

> **Frontend runs on:** `http://localhost:5173`

---

## 🔄 End-to-End Application Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Admin
    participant UI as React Frontend (Vite)
    participant API as Express API (Port 8080)
    participant DB as MongoDB

    Note over User,DB: 1. Authentication Flow
    User->>UI: Register / Login
    UI->>API: POST /api/auth/login
    API->>DB: Verify credentials (bcrypt)
    DB-->>API: User details
    API-->>UI: Return JWT Token & User Info
    UI->>UI: Save Token to localStorage

    Note over User,DB: 2. Reading Blogs & Comments
    User->>UI: Browse Home Page
    UI->>API: GET /api/blogs (Public)
    API->>DB: Query { status: 'published' }
    DB-->>API: Published blogs list
    API-->>UI: Render blog grid & categories

    User->>UI: Click on a Blog
    UI->>API: GET /api/blogs/:id & GET /api/comments/:id
    API-->>UI: Blog content & comments list

    Note over User,DB: 3. Authoring & Interaction
    User->>UI: Write Blog (Draft or Publish)
    UI->>API: POST /api/blogs (with Bearer Token)
    API->>DB: Save blog post with author reference
    DB-->>API: Saved blog
    API-->>UI: Redirect to "My Blogs"

    User->>UI: Add Comment on Post
    UI->>API: POST /api/comments/:id
    API->>DB: Create comment linked to Blog & Author
    DB-->>API: Populated comment
    API-->>UI: Append to comments in real time

    Note over User,DB: 4. Administration
    User->>UI: Visit /admin (Admin role required)
    UI->>API: GET /api/blogs/admin/all
    API->>DB: Fetch all blogs (published + drafts)
    DB-->>API: All system blogs
    API-->>UI: Render admin stats & moderation tools
    User->>UI: Delete inappropriate post
    UI->>API: DELETE /api/blogs/admin/:id
    API->>DB: Remove blog
    API-->>UI: Update admin grid
```

---

## 🛠️ Environment Configuration

### Backend (`backend/.env`)
```env
PORT=8080
MONGO_URL=mongodb://127.0.0.1:27017/blogmanagement
JWT_SECRET=super_secret_jwt_key_2026_blogmanagement
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8080/api
```

---

## 📋 Features Checklist

- [x] **User Authentication**: Secure JWT-based registration & login with bcrypt password hashing.
- [x] **Role-Based Access Control**: Standard users vs Admins.
- [x] **Route Protection**: ProtectedRoute prevents unauthorized access to private and admin pages.
- [x] **Blog Creation & Management**: Publish or draft blogs, categorize across 10+ topics, add tags, and cover images.
- [x] **Live Search & Filter**: Real-time keyword search across title, description, and tags, plus category filtering.
- [x] **Commenting System**: Post comments on blogs, with owner and admin deletion capabilities.
- [x] **Author Dashboard ("My Blogs")**: Manage personal blogs, view draft/published status, edit and delete posts.
- [x] **Admin Dashboard**: System statistics (Total, Published, Drafts) and global blog deletion capabilities.
- [x] **Zero ESLint Errors & Modern Codebase**: Built with React 19, Vite, and centralized Axios interceptors.
