// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ROUTES } from "../routes/path";
// import { useAuth } from "../contexts/AuthContext";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <nav className="bg-purple-200 shadow-md">
//       <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-purple-800">
//             HOPE<span className="text-pink-500">.</span>ආදරෙයි
//           </h1>
//           <p className="text-sm text-gray-600 italic">
//             Spreading kindness, one life at a time
//           </p>
//         </div>

//         {/* NAV LINKS */}
//         <div className="space-x-6">
//           <Link to={ROUTES.HOME} className="text-purple-800 hover:underline">
//             Home
//           </Link>

//           <Link to={ROUTES.ABOUT} className="text-purple-800 hover:underline">
//             About Us
//           </Link>

//           <Link
//             to={ROUTES.AWARENESS}
//             className="text-purple-800 hover:underline"
//           >
//             Awareness
//           </Link>

//           <Link to={ROUTES.STORIES} className="text-purple-800 hover:underline">
//             Stories
//           </Link>

//           <Link to={ROUTES.DONATE} className="text-purple-800 hover:underline">
//             Donate Us
//           </Link>
//         </div>

//         {/* AUTH BUTTONS */}
//         <div className="space-x-4">
//           {!user ? (
//             <>
//               <Link
//                 to={ROUTES.SIGNIN}
//                 className="px-4 py-2 bg-white text-purple-700 border border-purple-400 rounded-lg hover:bg-purple-100"
//               >
//                 Sign In
//               </Link>

//               <Link
//                 to={ROUTES.SIGNUP}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//               >
//                 Sign Up
//               </Link>
//             </>
//           ) : (
//             <>
//               <span className="text-purple-800 font-medium">
//                 Hi, {user.name}
//               </span>

//               <button
//                 onClick={() => {
//                   logout();
//                   navigate(ROUTES.SIGNIN);
//                 }}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/path";
import { useAuth } from "../contexts/AuthContext";

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
    <nav className="bg-purple-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-purple-800">
            HOPE<span className="text-pink-500">.</span>ආදරෙයි
          </h1>
          <p className="text-sm text-gray-600 italic">
            Spreading kindness, one life at a time
          </p>
        </div>

        <div className="space-x-6">
          <Link to={ROUTES.HOME} className="text-purple-800 hover:underline">
            Home
          </Link>

          <Link to={ROUTES.ABOUT} className="text-purple-800 hover:underline">
            About Us
          </Link>

          <Link
            to={ROUTES.AWARENESS}
            className="text-purple-800 hover:underline"
          >
            Awareness
          </Link>

          <Link to={ROUTES.STORIES} className="text-purple-800 hover:underline">
            Stories
          </Link>

          <Link to={ROUTES.DONATE} className="text-purple-800 hover:underline">
            Donate Us
          </Link>

          {user?.role === "donor" && (
            <Link
              to={ROUTES.DONOR_DASHBOARD}
              className="text-purple-900 hover:underline"
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
                className="px-4 py-2 bg-white text-purple-700 border border-purple-400 rounded-lg hover:bg-purple-100"
              >
                Sign In
              </Link>

              <Link
                to={ROUTES.SIGNUP}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
