import { Navigate } from "react-router-dom";

const authGuard = () => {
  try {
    const sessionDataString = localStorage.getItem("user");
    if (sessionDataString) {
      const sessionData = JSON.parse(sessionDataString);
      // Check if session is expired
      if (new Date().getTime() > sessionData.expiry) {
        localStorage.removeItem("user");
        return false;
      }
      // Check if the token exists
      return !!sessionData.userData.token;
    }
  } catch (error) {
    // If parsing fails, treat as not authenticated
    return false;
  }
  return false;
};

const ProtectedRoute = ({ element }) => {
  return authGuard() ? element : <Navigate to="/" />;
};

export default ProtectedRoute;