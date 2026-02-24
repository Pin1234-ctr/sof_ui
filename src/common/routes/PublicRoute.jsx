import { Navigate } from "react-router-dom";

const getLoggedInUser = () => {
    try {
        const sessionDataString = localStorage.getItem("user");
        if (sessionDataString) {
            const sessionData = JSON.parse(sessionDataString);
            // Check if session is expired
            if (new Date().getTime() > sessionData.expiry) {
                localStorage.removeItem("user");
                return null;
            }
            return sessionData.userData;
        }
    } catch (error) {
        return null;
    }
    return null;
};

const PublicRoute = ({ element }) => {
    const user = getLoggedInUser();

    if (user && user.token) {
        // User is logged in, redirect to their specific dashboard
        const role = user.role;
        if (role === 'parent') return <Navigate to="/parent/dashboard" />;
        if (role === 'student') return <Navigate to="/student/dashboard" />;
        if (role === 'admin') return <Navigate to="/admin/dashboard" />;
    }

    // User is not logged in, render the requested public element
    return element;
};

export default PublicRoute;