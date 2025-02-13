
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

// This is a temporary auth check until we implement real authentication
const isAuthenticated = () => {
  const auth = localStorage.getItem("isLoggedIn");
  if (!auth) {
    localStorage.setItem("isLoggedIn", "true");
    return true;
  }
  return auth === "true";
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.setItem("isLoggedIn", "true");
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
