import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import About from "../pages/About";
import Awareness from "../pages/Awareness";
import DonateUs from "../pages/DonateUs";
import Stories from "../pages/Stories";
import { ROUTES } from "./path";
import Home from "../pages/Home";
import { AuthProvider } from "../contexts/AuthContext";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ProtectedRoute from "./protectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import SocialWorkerDashboard from "../pages/SocialWorkerDashboard";
import DonorDashboard from "../pages/DonorDashboard";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      { path: ROUTES.SIGNIN, element: <SignIn /> },
      { path: ROUTES.SIGNUP, element: <SignUp /> },
      { path: ROUTES.HOME, element: <Home /> },
      { path: ROUTES.ABOUT, element: <About /> },
      { path: ROUTES.AWARENESS, element: <Awareness /> },
      { path: ROUTES.STORIES, element: <Stories /> },
      {
        path: ROUTES.DONATE,
        element: (
          <ProtectedRoute allowedRoles={["donor"]}>
            <DonateUs />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DONOR_DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={["donor"]}>
            <DonorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SOCIAL_WORKER_DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={["social_worker"]}>
            <SocialWorkerDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
