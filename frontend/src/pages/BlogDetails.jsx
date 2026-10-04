import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function BlogDetails() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/blogs/${id}`
      );

      setBlog(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to load blog."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/comments/${id}`
      );

      setComments(response.data);
    } catch (error) {
      console.log("Failed to fetch comments:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to add a comment.");
      return;
    }

    if (!commentText.trim()) {
      setMessage("Please write a comment.");
      return;
    }

    setCommentLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `http://localhost:8080/api/comments/${id}`,
        {
          text: commentText
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setComments([response.data.comment, ...comments]);
      setCommentText("");
      setMessage("Comment added successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to add comment."
      );
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setComments(
        comments.filter((comment) => comment._id !== commentId)
      );

      setMessage("Comment deleted successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete comment."
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

  if (message && !blog) {
    return (
      <div className="blog-error">
        <h2>{message}</h2>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-error">
        <h2>Blog not found</h2>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  return (
    <div className="blog-details-page">

      <article className="blog-details-card">

        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="blog-cover-image"
          />
        )}

        <div className="blog-details-content">

          <span className="blog-details-category">
            {blog.category}
          </span>

          <h1>{blog.title}</h1>

          <p className="blog-description">
            {blog.description}
          </p>

          <div className="blog-meta">
            <span>
              By {blog.author?.name || "Unknown Author"}
            </span>

            <span>
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>

            <span>{blog.status}</span>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-tags">
              {blog.tags.map((tag, index) => (
                <span key={index}>#{tag}</span>
              ))}
            </div>
          )}

          <div className="blog-content">
            {blog.content}
          </div>

          <Link to="/" className="back-button">
            ← Back to Home
          </Link>

          {/* COMMENTS SECTION */}

          <div className="comments-section">

            <div className="comments-heading">
              <h2>Comments</h2>
              <span>{comments.length}</span>
            </div>

            {message && (
              <div className="comment-message">
                {message}
              </div>
            )}

            <form
              className="comment-form"
              onSubmit={handleCommentSubmit}
            >
              <textarea
                value={commentText}
                onChange={(e) =>
                  setCommentText(e.target.value)
                }
                placeholder="Write your comment..."
                rows="4"
              />

              <button
                type="submit"
                disabled={commentLoading}
              >
                {commentLoading
                  ? "Adding..."
                  : "Add Comment"}
              </button>
            </form>

            <div className="comments-list">

              {comments.length === 0 ? (
                <div className="no-comments">
                  <p>No comments yet.</p>
                  <p>Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => {

                  const isOwner =
                    currentUser &&
                    comment.author?._id === currentUser.id;

                  return (
                    <div
                      className="comment-card"
                      key={comment._id}
                    >

                      <div className="comment-header">

                        <div>
                          <strong>
                            {comment.author?.name ||
                              "User"}
                          </strong>

                          <span>
                            {new Date(
                              comment.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        {isOwner && (
                          <button
                            className="comment-delete-btn"
                            onClick={() =>
                              handleDeleteComment(
                                comment._id
                              )
                            }
                          >
                            Delete
                          </button>
                        )}

                      </div>

                      <p>{comment.text}</p>

                    </div>
                  );
                })
              )}

            </div>

          </div>

        </div>

      </article>

    </div>
  );
}

export default BlogDetails;