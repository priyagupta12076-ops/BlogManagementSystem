import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function MyBlogs() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8080/api/blogs/user/my-blogs",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBlogs(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to load blogs."
      );
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/blogs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBlogs(blogs.filter((blog) => blog._id !== id));

      setMessage("Blog deleted successfully.");

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to delete blog."
      );
    }
  };

  return (
    <div className="blogs-page">

      <div className="blogs-header">
        <div>
          <h1>My Blogs</h1>
          <p>Manage your published blogs.</p>
        </div>

        <Link
          to="/create-blog"
          className="create-blog-btn"
        >
          + Create Blog
        </Link>
      </div>

      {message && (
        <p className="blog-message">
          {message}
        </p>
      )}

      {blogs.length === 0 ? (
        <div className="empty-blogs">
          <h2>No Blogs Yet</h2>

          <p>
            Start writing your first blog!
          </p>

          <Link to="/create-blog">
            Create Your First Blog
          </Link>
        </div>
      ) : (

        <div className="blog-grid">

          {blogs.map((blog) => (

            <div
              className="blog-card"
              key={blog._id}
            >

              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="blog-card-image"
                />
              )}

              <div className="blog-card-content">

                <span className="blog-category">
                  {blog.category}
                </span>

                <h2>{blog.title}</h2>

                <p>
                  {blog.description}
                </p>

                <div className="blog-status">
                  {blog.status}
                </div>

                <div className="blog-card-actions">

                  <Link
                    to={`/blog/${blog._id}`}
                    className="read-btn"
                  >
                    Read More
                  </Link>

                  <Link
                    to={`/edit-blog/${blog._id}`}
                    className="edit-btn"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(blog._id)}
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
  );
}

export default MyBlogs;