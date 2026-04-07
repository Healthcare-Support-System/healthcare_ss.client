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
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      label: "All Patient Details",
      path: ROUTES.ALL_PATIENTS,
      access: ["admin"],
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    // {
    //   label: "Donation Usage",
    //   path: ROUTES.DONATION_USAGE,
    //   access: ["admin"],
    //   icon: (
    //     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    //       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //       <line x1="18" y1="20" x2="18" y2="10"/>
    //       <line x1="12" y1="20" x2="12" y2="4"/>
    //       <line x1="6"  y1="20" x2="6"  y2="14"/>
    //     </svg>
    //   ),
    // },
    {
      label: "Support Request",
      path: ROUTES.MAKE_REQUEST,
      access: ["social_worker"],
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9"  y1="15" x2="15" y2="15"/>
        </svg>
      ),
    },
    {
      label: "Donation Requests",
      path: ROUTES.MANAGE_DONATION_REQUESTS,
      access: ["admin"],
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
    },
    {
      label: "Donations",
      path: ROUTES.DONATIONS,
      access: ["admin"],
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGNIN);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .sidebar-root, .sidebar-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
      `}</style>

      <div className="sidebar-root w-64 h-screen flex flex-col
        bg-white border-r border-[#F0E5E8] shadow-sm overflow-hidden">

        {/* ── Top: Logo + Nav ── */}
        <div className="flex flex-col flex-1 min-h-0">

          {/* Brand */}
          <div className="px-5 pt-6 pb-5 border-b border-[#F0E5E8] flex-shrink-0">
            {/* Ribbon accent */}
            <div className="flex items-center gap-2 mb-3">
              {/* <div className="w-7 h-7 rounded-lg bg-[#5E548E] flex items-center justify-center shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div> */}
              <div>
                {/* <p className="text-[13px] font-bold text-[#5E548E] leading-tight">සුව සවිය</p>
                <p className="text-[8px] italic font-medium tracking-[0.08em] text-[#B5838D] leading-tight">
                  Together we care, together we cure
                </p> */}
              </div>
            </div>

            {/* Dashboard label */}
            <h2 className="text-[17px] font-bold text-[#5E548E]">Dashboard</h2>
          </div>

          {/* Nav items */}
          <nav className="px-3 pt-4 pb-3 space-y-0.5 flex-1 min-h-0 overflow-y-auto">
            {menuItems.map((item) => {
              const hasAccess = item.access.includes(user?.role);

              return (
                <NavLink
                  key={item.label}
                  to={hasAccess ? item.path : "#"}
                  onClick={(e) => { if (!hasAccess) e.preventDefault(); }}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12.5px] font-medium
                    transition-all duration-150 ${
                      !hasAccess
                        ? "text-[#E8D9DE] cursor-not-allowed"
                        : isActive
                          ? "bg-[#5E548E] text-white shadow-sm"
                          : "text-[#6b6480] hover:bg-[#FDF5F7] hover:text-[#5E548E]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Icon wrapper */}
                      <span className={`flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0 transition-colors duration-150 ${
                        !hasAccess
                          ? "text-[#E8D9DE]"
                          : isActive
                            ? "text-white"
                            : "text-[#B5838D]"
                      }`}>
                        {item.icon}
                      </span>
                      <span className="leading-tight">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* ── Bottom: User + Logout ── */}
        <div className="px-3 pb-5 pt-3 border-t border-[#F0E5E8] flex-shrink-0">

          {/* User info chip */}
          {user && (
            <div className="mx-1 mb-3 px-3 py-2.5 bg-[#FDF5F7] border border-[#F0E5E8] rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#5E548E] flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-bold text-white uppercase">
                    {user.name?.[0] || user.email?.[0] || "A"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-semibold text-[#5E548E] truncate leading-tight">
                    {user.name || user.email || "Admin"}
                  </p>
                  <p className="text-[9.5px] font-medium uppercase tracking-[0.1em] text-[#B5838D] leading-tight capitalize">
                    {user.role || "admin"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5
              bg-transparent border border-[#F0E5E8] text-[#B5838D]
              text-[12.5px] font-semibold rounded-xl
              hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200
              transition-all duration-150 active:scale-95"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;