import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateBlog() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    image: "",
    content: "",
    status: "published"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required field validation
    if (!formData.title.trim()) {
      setMessage("Please enter a blog title.");
      return;
    }

    if (!formData.description.trim()) {
      setMessage("Please enter a short description.");
      return;
    }

    if (!formData.category) {
      setMessage("Please select a blog category.");
      return;
    }

    if (!formData.content.trim()) {
      setMessage("Please write your blog content.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/blogs",
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,

          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ""),

          image: formData.image.trim(),
          content: formData.content.trim(),
          status: formData.status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("Blog published successfully!");

      setTimeout(() => {
        navigate("/my-blogs");
      }, 1000);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to publish blog."
      );
    }
  };

  return (
    <div className="create-blog-page">

      <div className="create-blog-card">

        <div className="create-blog-heading">
          <h1>Create New Blog</h1>

          <p>
            Share your ideas, knowledge and experiences
            with the BlogSphere community.
          </p>
        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* TITLE */}

          <div className="form-group">
            <label>Blog Title</label>

            <input
              type="text"
              name="title"
              placeholder="Enter an attractive blog title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}

          <div className="form-group">
            <label>Short Description</label>

            <textarea
              name="description"
              placeholder="Write a short description about your blog..."
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* CATEGORY + TAGS */}

          <div className="form-row">

            <div className="form-group">
              <label>Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">
                  Select Blog Category
                </option>

                <option value="Technology">
                  Technology
                </option>

                <option value="Programming">
                  Programming
                </option>

                <option value="Artificial Intelligence">
                  Artificial Intelligence
                </option>

                <option value="Education">
                  Education
                </option>

                <option value="Science">
                  Science
                </option>

                <option value="Travel">
                  Travel
                </option>

                <option value="Food">
                  Food
                </option>

                <option value="Lifestyle">
                  Lifestyle
                </option>

                <option value="Health & Fitness">
                  Health & Fitness
                </option>

                <option value="Business">
                  Business
                </option>

                <option value="Entertainment">
                  Entertainment
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Tags</label>

              <input
                type="text"
                name="tags"
                placeholder="Example: React, JavaScript, Web"
                value={formData.tags}
                onChange={handleChange}
              />

              <small>
                Separate multiple tags using commas.
              </small>
            </div>

          </div>

          {/* IMAGE */}

          <div className="form-group">
            <label>Featured Image URL</label>

            <input
              type="url"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
            />

            <small>
              Add an image URL for your blog cover.
            </small>
          </div>

          {/* CONTENT */}

          <div className="form-group">
            <label>Blog Content</label>

            <textarea
              name="content"
              placeholder="Start writing your blog..."
              value={formData.content}
              onChange={handleChange}
              rows="14"
            />
          </div>

          {/* STATUS */}

          <div className="form-group">
            <label>Publication Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="published">
                Publish Now
              </option>

              <option value="draft">
                Save as Draft
              </option>
            </select>
          </div>

          {/* BUTTONS */}

          <div className="blog-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/my-blogs")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="publish-btn"
            >
              {formData.status === "draft"
                ? "Save Draft"
                : "Publish Blog"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateBlog;