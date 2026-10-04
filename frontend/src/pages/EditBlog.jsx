import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditBlog() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/blogs/${id}`
      );

      const blog = response.data;

      setFormData({
        title: blog.title || "",
        description: blog.description || "",
        category: blog.category || "",
        tags: blog.tags ? blog.tags.join(", ") : "",
        image: blog.image || "",
        content: blog.content || "",
        status: blog.status || "published"
      });

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to load blog."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/blogs/${id}`,
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ""),
          image: formData.image,
          content: formData.content,
          status: formData.status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("Blog updated successfully!");

      setTimeout(() => {
        navigate("/my-blogs");
      }, 1000);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to update blog."
      );
    }
  };

  if (loading) {
    return (
      <div className="blog-loading">
        <h2>Loading blog...</h2>
      </div>
    );
  }

  return (
    <div className="create-blog-page">

      <div className="create-blog-card">

        <div className="create-blog-heading">
          <h1>Edit Blog</h1>

          <p>
            Update your blog details and publish your changes.
          </p>
        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Blog Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-group">
            <label>Short Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>


          <div className="form-row">

            <div className="form-group">
              <label>Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Programming">Programming</option>
                <option value="Artificial Intelligence">
                  Artificial Intelligence
                </option>
                <option value="Education">Education</option>
                <option value="Science">Science</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Business">Business</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>


            <div className="form-group">
              <label>Tags</label>

              <input
                type="text"
                name="tags"
                placeholder="React, JavaScript, Web"
                value={formData.tags}
                onChange={handleChange}
              />

              <small>
                Separate multiple tags using commas.
              </small>
            </div>

          </div>


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
              Add or change the image URL for your blog.
            </small>

          </div>


          {formData.image && (
            <div className="image-preview">
              <p>Image Preview</p>

              <img
                src={formData.image}
                alt="Blog Preview"
              />
            </div>
          )}


          <div className="form-group">

            <label>Blog Content</label>

            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="14"
              required
            />

          </div>


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
              Update Blog
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditBlog;