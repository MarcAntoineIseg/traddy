
import { Navigate } from "react-router-dom";

// This is a temporary auth check until we implement real authentication
const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
