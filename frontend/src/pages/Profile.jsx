import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [blogCount, setBlogCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(savedUser));
    fetchMyBlogs(token);
  }, [navigate]);

  const fetchMyBlogs = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/blogs/user/my-blogs",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBlogCount(response.data.length);
    } catch (error) {
      console.log("Failed to fetch profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="profile-loading">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-avatar">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        <h1>{user.name}</h1>

        <p className="profile-email">
          {user.email}
        </p>

        <div className="profile-info">

          <div className="profile-info-item">
            <span>Full Name</span>
            <strong>{user.name}</strong>
          </div>

          <div className="profile-info-item">
            <span>Email Address</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-info-item">
            <span>Blogs Published</span>
            <strong>{blogCount}</strong>
          </div>

        </div>

        <div className="profile-actions">

          <Link
            to="/my-blogs"
            className="profile-btn primary"
          >
            My Blogs
          </Link>

          <Link
            to="/create-blog"
            className="profile-btn secondary"
          >
            Create Blog
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Profile;