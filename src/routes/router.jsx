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
// import ProtectedRoute from "./protectedRoute";

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
          // <ProtectedRoute>
          <DonateUs />
          // </ProtectedRoute>
        ),
      },
    ],
  },
]);
