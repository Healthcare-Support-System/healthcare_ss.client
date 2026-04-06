import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/path";
import { useAuth } from "../contexts/AuthContext";
import logoImg from "../assets/logo.jpeg";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName =
    user?.full_name ||
    user?.first_name ||
    user?.name ||
    localStorage.getItem("donorName") ||
    "User";

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGNIN);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#5E548E]/90 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO (replaced text with image) */}
        <div className="flex items-center">
  <div className="bg-white p-1 rounded-full shadow-lg hover:scale-105 transition duration-300">
    <img
      src={logoImg}
      alt="Logo"
      className="h-20 w-20 object-cover rounded-full"
    />
  </div>
</div>

        <div className="space-x-6">
          <Link
            to={ROUTES.HOME}
            className="text-white relative transition duration-300 hover:text-pink-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-pink-300 after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>

          <Link
            to={ROUTES.ABOUT}
            className="text-white relative transition duration-300 hover:text-pink-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-pink-300 after:transition-all after:duration-300 hover:after:w-full"
          >
            About Us
          </Link>

          <Link
            to={ROUTES.AWARENESS}
            className="text-white relative transition duration-300 hover:text-pink-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-pink-300 after:transition-all after:duration-300 hover:after:w-full"
          >
            Awareness
          </Link>

          <Link
            to={ROUTES.STORIES}
            className="text-white relative transition duration-300 hover:text-pink-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-pink-300 after:transition-all after:duration-300 hover:after:w-full"
          >
            Stories
          </Link>

          <Link
            to={ROUTES.DONATE}
            className="text-white relative transition duration-300 hover:text-pink-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-pink-300 after:transition-all after:duration-300 hover:after:w-full"
          >
            Donate Us
          </Link>

          {user?.role === "donor" && (
            <Link
              to={ROUTES.DONOR_DASHBOARD}
              className="text-white relative transition duration-300 hover:text-pink-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-pink-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="space-x-4">
          {!user ? (
            <>
              <Link
                to={ROUTES.SIGNIN}
                className="px-4 py-2 bg-white text-[#5E548E] border border-white rounded-lg hover:bg-gray-100 transition duration-300"
              >
                Sign In
              </Link>

              <Link
                to={ROUTES.SIGNUP}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span className="text-purple-800 font-medium">
                Hi, {displayName} 
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;