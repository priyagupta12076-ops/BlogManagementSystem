import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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

    // Empty field validation
    if (!formData.email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!formData.password.trim()) {
      setMessage("Please enter your password.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password
        }
      );

      // Save JWT token
      localStorage.setItem(
        "token",
        response.data.token
      );

      window.dispatchEvent(new Event("authChanged"));
      
      // Save complete user information including role
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      // Tell Navbar that login information has changed
      window.dispatchEvent(
        new Event("storage")
      );

      setMessage("Login successful!");

      // Go to Home
      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Invalid email or password."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>Welcome Back</h1>

        <p>
          Login to your BlogSphere account
        </p>

        {message && (
          <div className="error-message">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <div className="password-wrapper">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword
                ? "🙈"
                : "👁️"}
            </button>

          </div>

          {/* Login Button */}
          <button type="submit">
            Login
          </button>

        </form>

        <p className="auth-link">
          Don't have an account?{" "}

          <Link to="/register">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;