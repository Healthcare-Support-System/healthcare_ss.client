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

////////////////////////////////////////////////////////////////////////////////////////////////

// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ROUTES } from "../routes/path";
// import { useAuth } from "../contexts/AuthContext";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate(ROUTES.SIGNIN);
//   };

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
//                 Hi, {user.email} ({user.role})
//               </span>

//               <button
//                 onClick={handleLogout}
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

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGNIN);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#5E548E]/90 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            HOPE<span className="text-pink-400">.</span>ආදරෙයි
          </h1>
          <p className="text-sm text-purple-200 italic">
            Spreading kindness, one life at a time
          </p>
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
              <span className="text-purple-200 font-medium">
                Hi, {user.email} ({user.role})
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