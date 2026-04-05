// import { createBrowserRouter } from "react-router-dom";
// import App from "../App";
// import About from "../pages/About";
// import Awareness from "../pages/Awareness";
// import DonateUs from "../pages/DonateUs";
// import Stories from "../pages/Stories";
// import { ROUTES } from "./path";
// import Home from "../pages/Home";
// import { AuthProvider } from "../contexts/AuthContext";
// import SignIn from "../pages/SignIn";
// import SignUp from "../pages/SignUp";
// import ProtectedRoute from "./protectedRoute";
// import AdminDashboard from "../pages/AdminDashboard";
// import ViewAllSupportRequests from "../pages/supportRequests";
// import AdminHome from "../pages/AdminHome";
// import AllPatients from "../pages/AllPatients";
// import DonationUsage from "../pages/DonationUsage";
// import MakeRequest from "../pages/MakeRequest";

// export const AppRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     ),
//     children: [
//       { path: ROUTES.SIGNIN, element: <SignIn /> },
//       { path: ROUTES.SIGNUP, element: <SignUp /> },
//       { path: ROUTES.HOME, element: <Home /> },
//       { path: ROUTES.ABOUT, element: <About /> },
//       { path: ROUTES.AWARENESS, element: <Awareness /> },
//       { path: ROUTES.STORIES, element: <Stories /> },
//       {
//         path: ROUTES.DONATE,
//         element: (
//           <ProtectedRoute allowedRoles={["donor"]}>
//             <DonateUs />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: ROUTES.ADMIN_DASHBOARD,
//         element: (
//           <ProtectedRoute allowedRoles={["admin","social_worker"]}>
//             <AdminDashboard />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: ROUTES.SUPPORT_REQUEST,
//         element: <ViewAllSupportRequests />,
//       },
//     ],
//   },
// ]);



import { createBrowserRouter, Navigate } from "react-router-dom";
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
import ViewAllSupportRequests from "../pages/supportRequests";
import AdminHome from "../pages/AdminHome";
import AllPatients from "../pages/AllPatients";
import DonationUsage from "../pages/DonationUsage";
import MakeRequest from "../pages/MakeRequest";

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
        element: <DonateUs />,
      },

      {
        path: ROUTES.SUPPORT_REQUEST,
        element: <ViewAllSupportRequests />,
      },

      {
        path: ROUTES.ADMIN_DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={["admin", "social_worker"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.ADMIN_HOME} replace />,
          },
          {
            path: "home",
            element: (
              <ProtectedRoute allowedRoles={["admin", "social_worker"]}>
                <AdminHome />
              </ProtectedRoute>
            ),
          },
          {
            path: "patients",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllPatients />
              </ProtectedRoute>
            ),
          },
          {
            path: "donation-usage",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <DonationUsage />
              </ProtectedRoute>
            ),
          },
          {
            path: "make-request",
            element: (
              <ProtectedRoute allowedRoles={["social_worker"]}>
                <MakeRequest />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);