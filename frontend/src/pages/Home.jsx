import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/blogs"
      );

      if (Array.isArray(response.data)) {
        setBlogs(response.data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.log("Failed to fetch blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      blog.title?.toLowerCase().includes(searchText) ||
      blog.description?.toLowerCase().includes(searchText) ||
      (Array.isArray(blog.tags) &&
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchText)
        ));

    const matchesCategory =
      category === "All" || blog.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">

          <p className="hero-small">
            WELCOME TO BLOGSPHERE
          </p>

          <h1>
            Share Your Ideas.
            <br />
            Inspire Others.
          </h1>

          <p>
            Create, publish and explore interesting blogs in one simple
            platform.
          </p>

          <div className="hero-buttons">
            <Link
              to="/create-blog"
              className="btn-primary"
            >
              Start Writing
            </Link>

            <a
              href="#latest-blogs"
              className="btn-secondary"
            >
              Explore Blogs
            </a>
          </div>

        </div>
      </section>

      {/* LATEST BLOGS */}
      <section
        className="latest-blogs"
        id="latest-blogs"
      >

        <div className="section-heading">
          <h2>Latest Blogs</h2>

          <p>
            Discover the latest ideas and stories from our community.
          </p>
        </div>

        {/* SEARCH + FILTER */}
        <div className="blog-filters">

          <input
            type="text"
            placeholder="🔍 Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="blog-search"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-filter"
          >
            <option value="All">
              All Categories
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

        {/* LOADING */}
        {loading ? (
          <div className="blogs-loading">
            <p>Loading blogs...</p>
          </div>

        ) : filteredBlogs.length === 0 ? (

          /* NO BLOGS */
          <div className="no-blogs">
            <h3>No blogs found</h3>

            <p>
              Try another search keyword or select a different category.
            </p>

            <Link to="/create-blog">
              Create Your First Blog
            </Link>
          </div>

        ) : (

          /* BLOG LIST */
          <div className="home-blog-grid">

            {filteredBlogs.map((blog) => (

              <div
                className="home-blog-card"
                key={blog._id}
              >

                {blog.image ? (
  <img
    src={blog.image}
    alt={blog.title}
    className="home-blog-image"
    onError={(e) => {
      e.currentTarget.style.display = "none";
      e.currentTarget.nextElementSibling.style.display = "flex";
    }}
  />
) : null}

<div
  className="home-blog-placeholder"
  style={{
    display: blog.image ? "none" : "flex"
  }}
>
  BlogSphere
</div>s

                <div className="home-blog-content">

                  <span className="home-blog-category">
                    {blog.category || "General"}
                  </span>

                  <h3>
                    {blog.title}
                  </h3>

                  <p>
                    {blog.description}
                  </p>

                  <div className="home-blog-footer">

                    <span>
                      By {blog.author?.name || "Author"}
                    </span>

                    <Link
                      to={`/blog/${blog._id}`}
                    >
                      Read More →
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Home;