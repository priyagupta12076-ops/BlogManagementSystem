import { Navigate } from "react-router-dom";

function getUserFromStorage(token, storedUser) {
  try {
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    if (token) {
      return JSON.parse(atob(token.split(".")[1]));
    }
  } catch {
    return null;
  }
  return null;
}

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    const user = getUserFromStorage(token, storedUser);
    if (user?.role !== "admin") {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
