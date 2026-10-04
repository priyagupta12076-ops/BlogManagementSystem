import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const loadUser = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      setUser(payload);
    } catch (error) {
      console.log("Token read error");
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    window.addEventListener("authChanged", loadUser);

    return () => {
      window.removeEventListener("authChanged", loadUser);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setMenuOpen(false);

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          BlogSphere
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div
          className={`nav-links ${
            menuOpen ? "nav-open" : ""
          }`}
        >

          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/my-blogs"
                onClick={closeMenu}
              >
                My Blogs
              </Link>

              <Link
                to="/create-blog"
                onClick={closeMenu}
              >
                Create Blog
              </Link>

              <Link
                to="/profile"
                onClick={closeMenu}
              >
                Profile
              </Link>

              {user?.role === "admin" && (
  <Link
    to="/admin"
    onClick={closeMenu}
    className="admin-link"
  >
    Admin Dashboard
  </Link>
)}

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;