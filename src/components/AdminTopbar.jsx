import { useAuth } from "../contexts/AuthContext";

const AdminTopbar = () => {
  const { user } = useAuth();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .topbar-root, .topbar-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .topbar-search::placeholder { color: #E8D9DE; }
        .topbar-search:focus { outline: none; border-color: #5E548E; box-shadow: 0 0 0 3px rgba(94,84,142,0.10); }
      `}</style>

      <div className="topbar-root w-full h-16 bg-white border-b border-[#F0E5E8] shadow-sm
        flex items-center justify-between px-6 gap-4">

        {/* ── Brand ── */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#5E548E] flex items-center justify-center shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h1 className="text-[17px] font-bold text-[#5E548E] leading-tight">
            HOPE<span className="text-[#B5838D]">.</span>ආදරෙයි
          </h1>
        </div>

        {/* ── Search ── */}
        <div className="flex-1 flex justify-center px-6">
          <div className="relative w-full max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B5838D] pointer-events-none">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="topbar-search w-full pl-9 pr-4 py-2 text-[12.5px] text-[#3a3248]
                bg-[#FFF9F5] border border-[#F0E5E8] rounded-xl
                transition-all duration-150"
            />
          </div>
        </div>

        {/* ── User info ── */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#5E548E] flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-[12px] font-bold text-white uppercase">
              {user?.name?.[0] || user?.email?.[0] || "A"}
            </span>
          </div>
          {/* Text */}
          <div className="text-right">
            <p className="text-[12.5px] font-semibold text-[#5E548E] leading-tight">
              Hi, {user?.email}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#B5838D] leading-tight capitalize">
              {user?.role?.replace("_", " ")}
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

export default AdminTopbar;