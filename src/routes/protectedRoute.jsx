import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "./path";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.SIGNIN} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === "donor") {
      return <Navigate to={ROUTES.DONOR_DASHBOARD} replace />;
    }

    if (user.role === "admin") {
      return <Navigate to={ROUTES.ADMIN_HOME} replace />;
    }

    if (user.role === "social_worker") {
      return <Navigate to={ROUTES.ADMIN_HOME} replace />;
    }

    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;
