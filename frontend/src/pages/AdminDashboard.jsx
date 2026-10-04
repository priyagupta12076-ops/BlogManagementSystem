import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8080/api/blogs/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBlogs(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {
      console.log("Admin error:", error);

      if (error.response?.status === 403) {
        setMessage("Access denied. Admin only.");
      } else {
        setMessage(
          error.response?.data?.message ||
          "Unable to load blogs."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/blogs/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBlogs(
        blogs.filter((blog) => blog._id !== id)
      );

      setMessage("Blog deleted successfully.");

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to delete blog."
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-page">

      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage all blogs on BlogSphere.</p>
        </div>

        <Link to="/" className="profile-btn">
          Back to Home
        </Link>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <div className="admin-stats">

        <div className="admin-stat-card">
          <h2>{blogs.length}</h2>
          <p>Total Blogs</p>
        </div>

        <div className="admin-stat-card">
          <h2>
            {
              blogs.filter(
                (blog) => blog.status === "published"
              ).length
            }
          </h2>
          <p>Published</p>
        </div>

        <div className="admin-stat-card">
          <h2>
            {
              blogs.filter(
                (blog) => blog.status === "draft"
              ).length
            }
          </h2>
          <p>Drafts</p>
        </div>

      </div>

      <div className="admin-blog-section">

        <h2>All Blogs</h2>

        {blogs.length === 0 ? (

          <div className="empty-blogs">
            <h3>No blogs available.</h3>
            <p>
              There are currently no blogs in the system.
            </p>
          </div>

        ) : (

          <div className="blog-grid">

            {blogs.map((blog) => (

              <div
                className="blog-card"
                key={blog._id}
              >

                {/* IMAGE ONLY IF BLOG HAS IMAGE */}
                {blog.image && blog.image.trim() !== "" && (
                  <div className="admin-image-wrapper">

                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="admin-blog-image"
                      onError={(e) => {
                        e.currentTarget.parentElement.style.display = "none";
                      }}
                    />

                  </div>
                )}

                <div className="blog-card-content">

                  <span className="blog-category">
                    {blog.category}
                  </span>

                  <h2>{blog.title}</h2>

                  <p>
                    {blog.description}
                  </p>

                  <p>
                    <strong>Author:</strong>{" "}
                    {blog.author?.name || "Unknown"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {blog.status}
                  </p>

                  <div className="blog-card-actions">

                    <Link
                      to={`/blog/${blog._id}`}
                      className="read-btn"
                    >
                      View
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(blog._id)
                      }
                      className="delete-btn"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminDashboard;