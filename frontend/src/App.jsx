import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateBlog from "./pages/CreateBlog";
import MyBlogs from "./pages/MyBlogs";
import BlogDetails from "./pages/BlogDetails";
import EditBlog from "./pages/EditBlog";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/my-blogs" element={<MyBlogs />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route
  path="/edit-blog/:id"
  element={<EditBlog />}
/>
<Route
  path="/profile"
  element={<Profile />}
/>
<Route
  path="/admin"
  element={<AdminDashboard />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;