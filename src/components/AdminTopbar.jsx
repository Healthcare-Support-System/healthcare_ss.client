import { useAuth } from "../contexts/AuthContext";
import logo01 from "../assets/logo01.png"; // ← your new logo image

const AdminTopbar = () => {
  const { user } = useAuth();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;600;700&display=swap');

        .topbar-root, .topbar-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

        .sinhala-font {
          font-family: 'Noto Sans Sinhala', sans-serif;
        }

        .topbar-search::placeholder { color: #E8D9DE; }
        .topbar-search:focus { outline: none; border-color: #685aad; box-shadow: 0 0 0 3px rgba(94,84,142,0.10); }
      `}</style>

      <div 
        className="topbar-root w-full h-16 flex items-center justify-between px-6 gap-4"
        style={{
          background: "linear-gradient(90deg, #7B6FA8 30%, #7B6FA8 40%, #a895c8 72%, #a895c8 72%)"
        }}
      >

        {/* ── Brand (UPDATED WITH FULL LOGO IMAGE) ── */}
        <div className="flex items-center flex-shrink-0">
          <img
            src={logo01}
            alt="සුව සවිය"
            className="h-14 object-contain"
          />
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
          <div className="w-8 h-8 rounded-full bg-[#5E548E] flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-[12px] font-bold text-white uppercase">
              {user?.name?.[0] || user?.email?.[0] || "A"}
            </span>
          </div>
          <div className="text-right">
            <p className="text-[12.5px] font-semibold text-white leading-tight">
              Hi, {user?.email}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/80 leading-tight capitalize">
              {user?.role?.replace("_", " ")}
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

export default AdminTopbar;