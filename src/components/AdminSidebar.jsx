import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/path";
import { useAuth } from "../contexts/AuthContext";

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Admin Home",
      path: ROUTES.ADMIN_HOME,
      access: ["admin", "social_worker"],
    },
    {
      label: "All Patient Details",
      path: ROUTES.ALL_PATIENTS,
      access: ["admin"],
    },
    {
      label: "Donation Usage",
      path: ROUTES.DONATION_USAGE,
      access: ["admin"],
    },
    {
      label: "Make Request",
      path: ROUTES.MAKE_REQUEST,
      access: ["social_worker"],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGNIN);
  };

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-pink-100 via-white to-purple-100 border-r shadow-md flex flex-col justify-between">
      <div className="p-5">
        <h2 className="text-xl font-bold text-purple-800 mb-6">Dashboard</h2>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const hasAccess = item.access.includes(user?.role);

            return (
              <NavLink
                key={item.label}
                to={hasAccess ? item.path : "#"}
                onClick={(e) => {
                  if (!hasAccess) e.preventDefault();
                }}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition-all ${
                    hasAccess
                      ? isActive
                        ? "bg-purple-200 text-purple-900 font-semibold"
                        : "text-gray-800 hover:bg-pink-100"
                      : "text-gray-400 cursor-not-allowed"
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="p-5 border-t">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;