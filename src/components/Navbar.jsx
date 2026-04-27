import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../routes/path";
import { useAuth } from "../contexts/AuthContext";
import suwaLogo from "../assets/suwasaviya-logo.png";
import updatedLogo from "../assets/logoUpdated.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 shadow-lg transition-all duration-300 backdrop-blur-sm"
      style={{
        background:
          "linear-gradient(90deg, #7B6FA8 30%, #7B6FA8 40%, #a895c8 72%, #a895c8 72%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-7 flex justify-between items-center h-[82px]">
        {/* LOGO — enhanced glowing treatment */}
        <div className="flex items-center gap-3 flex-shrink-0 group cursor-pointer">
          <div className="relative w-[66px] h-[66px] transition-transform duration-300 group-hover:scale-105">
            {/* outer soft halo ring */}
            <div
              className="absolute inset-[-3px] rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.15) 100%)",
              }}
            />
            {/* logo image */}
            <img
              src={updatedLogo}
              alt="Logo"
              className="absolute inset-0 w-full h-full object-cover rounded-full z-10"
              style={{
                boxShadow:
                  "0 0 0 2px rgba(255,255,255,0.4), 0 4px 20px rgba(94,84,142,0.45)",
              }}
            />
            {/* inner light shimmer overlay - animated */}
            <div
              className="absolute inset-0 rounded-full z-20 pointer-events-none animate-pulse"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.45), transparent 65%)",
              }}
            />
          </div>

          <div className="flex flex-col gap-[2px]">
            <img
              src={suwaLogo}
              alt="සුව සවිය"
              className="h-[40px] object-contain transition-all duration-300 group-hover:brightness-110"
            />
            
            <span className="text-[9.5px] font-bold tracking-[2.5px] uppercase text-white/90">
              Hope · Healing · Care
            </span>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="flex items-center mx-auto px-6">
          {[
            { label: "Home", to: ROUTES.HOME },
            { label: "About Us", to: ROUTES.ABOUT },
            { label: "Awareness", to: ROUTES.AWARENESS },
            { label: "Donation Guide", to: ROUTES.STORIES },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-white/85 hover:text-white text-[13.5px] px-[15px] py-[7px] rounded-lg
              transition-all duration-200 relative font-medium
              hover:bg-white/14 hover:scale-105
              after:absolute after:bottom-[3px] after:left-[15px] after:right-[15px]
              after:h-[2px] after:bg-gradient-to-r after:from-white/80 after:to-white/40 after:rounded-full
              after:scale-x-0 hover:after:scale-x-100
              after:transition-transform after:duration-200
              ${isActive(to) ? 'text-white after:scale-x-100 bg-white/10' : ''}`}
            >
              {label}
            </Link>
          ))}

          {user?.role === "donor" && (
            <Link
              to={ROUTES.DONOR_DASHBOARD}
              className={`text-white/85 hover:text-white text-[13.5px] px-[15px] py-[7px] rounded-lg
              transition-all duration-200 relative font-medium
              hover:bg-white/14 hover:scale-105
              after:absolute after:bottom-[3px] after:left-[15px] after:right-[15px]
              after:h-[2px] after:bg-gradient-to-r after:from-white/80 after:to-white/40 after:rounded-full
              after:scale-x-0 hover:after:scale-x-100
              after:transition-transform after:duration-200
              ${isActive(ROUTES.DONOR_DASHBOARD) ? 'text-white after:scale-x-100 bg-white/10' : ''}`}
            >
              Dashboard
            </Link>
          )}

          {/* Donate pill - enhanced */}
          <Link
            to={ROUTES.DONATE}
            className="flex items-center gap-[6px] text-white font-semibold text-[13px]
            px-[18px] py-[7px] ml-3 rounded-full
            bg-white/20 border border-white/40
            hover:bg-white/30 hover:border-white/70 hover:scale-105
            transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg
              className="w-[13px] h-[13px] transition-transform duration-200 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.335 4.187 1 7.5 1c1.88 0 3.65.85 4.5 2.2C12.85 1.85 14.62 1 16.5 1 19.813 1 23 3.335 23 7.191c0 4.105-5.37 8.863-11 14.402z" />
            </svg>
            Donate Us
          </Link>
        </nav>

        {/* AUTH - enhanced */}
        <div className="flex items-center gap-[10px] flex-shrink-0">
          {!user ? (
            <>
              <Link
                to={ROUTES.SIGNIN}
                className={`text-[13.5px] px-[22px] py-[7px] rounded-full font-semibold
                bg-[#5E548E] text-white shadow-md
                hover:bg-[#4a4075] hover:shadow-lg hover:scale-105
                transition-all duration-200
                ${isActive(ROUTES.SIGNIN) ? 'ring-2 ring-white/50 scale-105' : ''}`}
              >
                Sign In
              </Link>
              <Link
                to={ROUTES.SIGNUP}
                className={`text-[13.5px] px-[22px] py-[7px] rounded-full font-semibold
                bg-transparent text-[#5E548E] 
                border-2 border-[#5E548E] bg-white/90
                hover:bg-[#5E548E] hover:text-white hover:scale-105
                transition-all duration-200
                ${isActive(ROUTES.SIGNUP) ? 'ring-2 ring-[#5E548E] ring-offset-2 scale-105' : ''}`}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5E548E] to-[#7B6FA8] flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-110 transition-transform duration-200">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium text-[14px] group-hover:text-white transition-colors duration-200">
                  Hi, {displayName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-[13px] px-[16px] py-[6px] rounded-full font-medium
                bg-red-500/10 text-red-100 border border-red-400/30
                hover:bg-red-500/30 hover:border-red-400/60 hover:scale-105
                transition-all duration-200 backdrop-blur-sm"
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