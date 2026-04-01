import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./path";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to={ROUTES.SIGNIN} />;
  }

  return children;
};

export default ProtectedRoute;