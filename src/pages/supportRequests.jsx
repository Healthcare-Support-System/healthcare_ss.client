import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DonationFormPopup from "./DonationFormPopup";
import { useAuth } from "../contexts/AuthContext";
import { privateApiClient } from "../api/apiClient";
import { END_POINTS } from "../api/endPoints";
import { ROUTES } from "../routes/path";

const supportVisuals = [
  "/assets/support/helpinghand.jpeg",
  "/assets/support/food.webp",
  "/assets/support/food.png",
];

const ViewAllSupportRequests = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [donorProfile, setDonorProfile] = useState(null);
  const [authPopup, setAuthPopup] = useState({
    open: false,
    title: "",
    message: "",
    redirectToSignIn: false,
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { user, isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  useEffect(() => {
    const fetchDonorProfile = async () => {
      if (!isAuthenticated || user?.role !== "donor") {
        setDonorProfile(null);
        return;
      }
      try {
        const { data } = await privateApiClient.get(
          END_POINTS.GET_DONOR_PROFILE,
        );
        const profile = data?.data || data;
        setDonorProfile(profile);
        if (profile?.id) localStorage.setItem("donorId", profile.id);
        const donorName =
          profile?.full_name ||
          profile?.first_name ||
          user?.full_name ||
          user?.first_name ||
          user?.name ||
          "";
        if (donorName) localStorage.setItem("donorName", donorName);
      } catch (profileError) {
        console.error("Unable to load donor profile", profileError);
      }
    };
    fetchDonorProfile();
  }, [isAuthenticated, user]);

  const fetchSupportRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/support-requests/all",
      );
      setSupportRequests(response.data.data);
    } catch (err) {
      console.error("Error fetching support requests:", err);
      setError("Failed to load support requests");
    } finally {
      setLoading(false);
    }
  };

  const donor = useMemo(
    () => ({
      id: donorProfile?.id || user?.id || localStorage.getItem("donorId") || "",
      first_name: donorProfile?.first_name || user?.first_name || "",
      full_name:
        donorProfile?.full_name ||
        user?.full_name ||
        user?.first_name ||
        user?.name ||
        localStorage.getItem("donorName") ||
        "",
    }),
    [donorProfile, user],
  );

  const showAuthPopup = ({ title, message, redirectToSignIn = false }) => {
    setAuthPopup({
      open: true,
      title,
      message,
      redirectToSignIn,
    });
  };

  const closeAuthPopup = () => {
    setAuthPopup({
      open: false,
      title: "",
      message: "",
      redirectToSignIn: false,
    });
  };

  const handleDonateClick = (requestId) => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      showAuthPopup({
        title: "Sign In Required",
        message: "Please sign in before making a donation.",
        redirectToSignIn: true,
      });
      return;
    }
    if (user.role !== "donor") {
      showAuthPopup({
        title: "Donor Account Needed",
        message: "Only donor accounts can submit donations.",
      });
      return;
    }
    if (!donor.id) {
      showAuthPopup({
        title: "Profile Still Loading",
        message: "Your donor profile is still loading. Please try again in a moment.",
      });
      return;
    }
    setSelectedRequestId(requestId);
    setIsPopupOpen(true);
  };

  /* ── urgency config ── */
  const urgencyConfig = {
    high: {
      pill: "bg-red-50 text-red-700 border border-red-200",
      dot: "bg-red-500",
      label: "High Priority",
    },
    medium: {
      pill: "bg-amber-50 text-amber-800 border border-amber-300",
      dot: "bg-amber-500",
      label: "Medium",
    },
    low: {
      pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      dot: "bg-emerald-500",
      label: "Low",
    },
  };

  const statusConfig = {
    open: {
      pill: "bg-[#ece3f7] text-[#3f356d] border border-[#cfc0e7]",
      label: "Open",
    },
    pending: {
      pill: "bg-[#fff2dd] text-[#8a5a00] border border-[#e9c07f]",
      label: "Pending",
    },
    fulfilled: {
      pill: "bg-[#e4f5ec] text-[#246244] border border-[#9fd0b5]",
      label: "Fulfilled",
    },
    closed: {
      pill: "bg-[#ebe8f1] text-[#5f5871] border border-[#cfc9dc]",
      label: "Closed",
    },
  };

  const getUrgency = (u) =>
    urgencyConfig[(u || "").toLowerCase()] || urgencyConfig.low;
  const getStatus = (s) =>
    statusConfig[(s || "").toLowerCase()] || statusConfig.open;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const visibleRequests = supportRequests.filter((request) => {
    if (!request.needed_date) return false;

    const neededDate = new Date(request.needed_date);
    neededDate.setHours(0, 0, 0, 0);

    return neededDate >= today;
  });

  const activeOpenRequests = visibleRequests.filter(
    (request) => (request.status || "").toLowerCase() === "open",
  );

  const activeSupportRequests = supportRequests.filter((request) => {
    if (!request.needed_date) return false;

    const neededDate = new Date(request.needed_date);
    neededDate.setHours(0, 0, 0, 0);

    const isNotExpired = neededDate >= today;
    const isOpen = (request.status || "").toLowerCase() === "open";

    return isNotExpired && isOpen;
  });

  // Filter requests based on selected status and search term
  const filteredRequests = visibleRequests.filter((request) => {
    const requestStatus = (request.status || "").toLowerCase();
    const matchesStatus = statusFilter === "all" || requestStatus === statusFilter;

    const query = searchTerm.trim().toLowerCase();
    if (!query) return matchesStatus;

    const searchableText = [
      request.request_type,
      request.description,
      request.patient?.medical_condition,
      request.patient?.gender,
      ...(Array.isArray(request.items)
        ? request.items.map((item) => item?.item_name).filter(Boolean)
        : []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesStatus && searchableText.includes(query);
  });

  // Count requests by status
  const statusCounts = {
    all: visibleRequests.length,
    open: visibleRequests.filter(r => (r.status || "").toLowerCase() === "open").length,
    pending: visibleRequests.filter(r => (r.status || "").toLowerCase() === "pending").length,
    fulfilled: visibleRequests.filter(r => (r.status || "").toLowerCase() === "fulfilled").length,
  };

  /* ── loading ── */
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
          @keyframes sp { to { transform: rotate(360deg); } }
        `}</style>
        <div
          className="min-h-screen flex flex-col items-center justify-center gap-4"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background:
              "linear-gradient(160deg,#f7f3ff 0%,#fff5f7 60%,#fff9f0 100%)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              border: "3px solid #e8dff7",
              borderTopColor: "#4a2999",
              borderRadius: "50%",
              animation: "sp .75s linear infinite",
            }}
          />
          <p style={{ fontSize: 13.5, fontWeight: 500, color: "#4a2999" }}>
            Loading support requests…
          </p>
        </div>
      </>
    );
  }

  /* ── error ── */
  if (error) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600&display=swap');`}</style>
        <div
          className="min-h-screen flex items-center justify-center p-6"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background:
              "linear-gradient(160deg,#f7f3ff 0%,#fff5f7 60%,#fff9f0 100%)",
          }}
        >
          <div className="bg-red-50 border border-red-200 border-l-4 border-l-red-400 rounded-2xl px-5 py-4 text-red-700 text-[13px] max-w-sm">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .vsr-root, .vsr-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .vsr-root {
          --vsr-card-border: #e5d9f2;
          --vsr-card-shadow: 0 2px 12px rgba(94, 84, 142, 0.08);
          --vsr-card-shadow-hover: 0 8px 24px rgba(94, 84, 142, 0.15);
          --vsr-surface: #f7f3ff;
          --vsr-surface-2: #f2ecfb;
          --vsr-surface-3: #efe8f8;
          --vsr-ink: #2e2350;
          --vsr-ink-soft: #5a4f82;
        }
        .vsr-hero-shell {
          background: linear-gradient(135deg, #5E548E 0%, #4A4272 62%, #7761AE 100%);
          border-bottom: 1px solid #d8cbe7;
        }
        .vsr-hero-accent {
          position: absolute;
          border-radius: 9999px;
          filter: blur(42px);
          opacity: 0.35;
          pointer-events: none;
        }
        .vsr-photo {
          border-radius: 18px;
          border: 2px solid rgba(255, 255, 255, 0.24);
          box-shadow: 0 18px 30px -20px rgba(24, 15, 52, 0.95);
          object-fit: cover;
        }
        .vsr-card { 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border: 1px solid var(--vsr-card-border);
          background: white;
          box-shadow: var(--vsr-card-shadow);
        }
        .vsr-card:hover { 
          transform: translateY(-4px); 
          box-shadow: var(--vsr-card-shadow-hover);
          border-color: #d4c4e8;
        }
        .vsr-card-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #E5989B 0%, #B5838D 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .vsr-card:hover .vsr-card-accent {
          opacity: 1;
        }
        .vsr-btn { 
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .vsr-btn:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .vsr-btn:hover:before {
          width: 300px;
          height: 300px;
        }
        .vsr-btn:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 6px 20px rgba(229, 152, 155, 0.4);
          background: linear-gradient(135deg, #E5989B 0%, #d88891 100%) !important;
        }
        .vsr-btn:active { 
          transform: translateY(0); 
          box-shadow: 0 2px 8px rgba(229, 152, 155, 0.3);
        }
        .vsr-info-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        }
        .vsr-stat-card {
          background: linear-gradient(135deg, #faf8ff 0%, #f5f1ff 100%);
          border: 1px solid #e8dff7;
          transition: all 0.2s ease;
        }
        .vsr-stat-card:hover {
          background: linear-gradient(135deg, #f5f1ff 0%, #f0ebff 100%);
          border-color: #d9cef0;
          transform: translateY(-2px);
        }
        .vsr-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #e5d9f2 50%, transparent 100%);
        }
        .vsr-item-badge {
          background: linear-gradient(135deg, #5E548E 0%, #7761AE 100%);
          color: white;
          transition: all 0.2s ease;
        }
        .vsr-item-row:hover .vsr-item-badge {
          transform: scale(1.1);
        }
        .vsr-popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(32, 17, 56, 0.52);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
        }
        .vsr-popup-card {
          width: 100%;
          max-width: 400px;
          border-radius: 18px;
          background: #fff;
          border: 1px solid #eadcf6;
          box-shadow: 0 24px 60px rgba(74, 41, 153, 0.22);
          overflow: hidden;
        }
        .vsr-popup-body {
          padding: 22px;
        }
        .vsr-popup-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 18px;
        }
        .vsr-popup-btn-secondary {
          border: 1px solid #e2d7ef;
          background: white;
          color: #6a5491;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 12.5px;
          font-weight: 600;
        }
        .vsr-popup-btn-primary {
          border: none;
          background: #4a2999;
          color: white;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 12.5px;
          font-weight: 600;
        }
      `}</style>

      {authPopup.open && (
        <div className="vsr-popup-overlay">
          <div className="vsr-popup-card">
            <div className="vsr-popup-body">
              <h3 className="text-[18px] font-bold mb-2" style={{ color: "#3d2a7a" }}>
                {authPopup.title}
              </h3>
              <p className="text-[13px] leading-6" style={{ color: "#8d73b2" }}>
                {authPopup.message}
              </p>
              <div className="vsr-popup-actions">
                <button
                  type="button"
                  className="vsr-popup-btn-secondary"
                  onClick={closeAuthPopup}
                >
                  Close
                </button>
                {authPopup.redirectToSignIn && (
                  <button
                    type="button"
                    className="vsr-popup-btn-primary"
                    onClick={() => {
                      closeAuthPopup();
                      navigate(ROUTES.SIGNIN);
                    }}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="vsr-root min-h-screen"
        style={{
          background: "linear-gradient(160deg, #fdfbff 0%, #faf7ff 100%)",
        }}
      >
        {/* ── Hero Banner ── */}
        <div className="vsr-hero-shell px-6 py-8 sm:py-10 relative overflow-hidden">
          <span
            className="vsr-hero-accent w-56 h-56 -top-10 -left-14"
            style={{ background: "#E5989B" }}
          />
          <span
            className="vsr-hero-accent w-72 h-72 -bottom-20 -right-20"
            style={{ background: "#B5838D" }}
          />
          <div className="max-w-6xl mx-auto relative z-10">
            {/* Top section with text and creative image layout */}
            <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start mb-6">
              <div>
                {/* eyebrow */}
                <div
                  className="flex items-center gap-1.5 mb-3"
                  style={{ color: "#F6DBE1" }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
                    HOPE - Cancer Support Fund
                  </span>
                </div>

                <h1
                  className="text-3xl sm:text-4xl font-bold leading-tight mb-3"
                  style={{ color: "#fff" }}
                >
                  Support Requests
                </h1>
                <p
                  className="text-[14px] max-w-xl leading-relaxed"
                  style={{ color: "#FCEFF2" }}
                >
                  Every contribution makes a difference. Browse the requests below
                  and donate directly to a patient in need.
                  {!isAuthenticated && (
                    <span
                      className="ml-1 font-semibold"
                      style={{ color: "#fff" }}
                    >
                      Please{" "}
                      <button
                        onClick={() => navigate(ROUTES.SIGNIN)}
                        className="underline underline-offset-2 transition-colors duration-150"
                        style={{ color: "#ffd7e2" }}
                        onMouseOver={(e) => (e.target.style.color = "#fff")}
                        onMouseOut={(e) => (e.target.style.color = "#ffd7e2")}
                      >
                        sign in
                      </button>{" "}
                      to donate.
                    </span>
                  )}
                </p>

                {/* Summary pill */}
                {activeSupportRequests.length > 0 && (
                  <div
                    className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2"
                    style={{
                      background: "rgba(255,255,255,0.18)",
                      border: "1px solid rgba(255,255,255,0.28)",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: "#ffd7e2" }}
                    />
                    <span
                      className="text-[12.5px] font-semibold"
                      style={{ color: "#fff" }}
                    >
                      {activeOpenRequests.length} active request
                      {activeOpenRequests.length !== 1 ? "s" : ""} • {statusCounts.pending} pending • {statusCounts.fulfilled} fulfilled
                    </span>
                  </div>
                )}
              </div>

              {/* Creative staggered image layout */}
              <div className="hidden lg:block relative h-64">
                <img
                  src={supportVisuals[0]}
                  alt="Helping hands"
                  className="vsr-photo absolute top-0 right-0 w-48 h-36 z-10"
                  style={{ transform: "rotate(2deg)" }}
                />
                <img
                  src={supportVisuals[1]}
                  alt="Food support"
                  className="vsr-photo absolute bottom-0 left-0 w-40 h-32 z-20"
                  style={{ transform: "rotate(-3deg)" }}
                />
                <img
                  src={supportVisuals[2]}
                  alt="Nutrition support"
                  className="vsr-photo absolute top-16 left-20 w-44 h-32 z-5"
                  style={{ transform: "rotate(1deg)" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Filter + Search Section */}
          <div className="mb-8 grid gap-3 sm:grid-cols-[220px_1fr]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-[12.5px] font-semibold outline-none"
              style={{
                background: "#fff",
                color: "#5E548E",
                border: "2px solid #e8dff7",
              }}
            >
              <option value="all">All Requests ({statusCounts.all})</option>
              <option value="open">Open ({statusCounts.open})</option>
              <option value="pending">Pending ({statusCounts.pending})</option>
              <option value="fulfilled">Fulfilled ({statusCounts.fulfilled})</option>
            </select>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by request type, description, condition, or item..."
              className="w-full rounded-xl px-4 py-2.5 text-[12.5px] outline-none"
              style={{
                background: "#fff",
                color: "#3d2a7a",
                border: "2px solid #e8dff7",
              }}
            />
          </div>

          {/* Empty State */}
          {filteredRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: "#f1ebff",
                  border: "1px solid #d4bff5",
                  color: "#9b6db5",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <p
                className="text-[14px] font-semibold"
                style={{ color: "#3d2a7a" }}
              >
                No {statusFilter !== "all" ? statusFilter : ""} requests found
              </p>
              <p className="text-[12.5px]" style={{ color: "#9b6db5" }}>
                {statusFilter !== "all" 
                  ? "Try selecting a different filter or check back soon."
                  : "Check back soon — new requests are added regularly."}
              </p>
            </div>
          )}

          {/* Cards Grid */}
          {filteredRequests.length > 0 && (
            <div className="grid gap-6">
              {filteredRequests.map((request) => {
                const uc = getUrgency(request.urgency_level);
                const sc = getStatus(request.status);
                const hasItems = request.items && request.items.length > 0;
                const isUnavailable =
                  (request.status || "").toLowerCase() !== "open";

                return (
                  <div
                    key={request.id}
                    className="vsr-card rounded-2xl"
                    style={{
                      opacity: isUnavailable ? 0.65 : 1,
                    }}
                  >
                    <div className="vsr-card-accent" />
                    
                    {/* Card Header */}
                    <div className="px-6 py-5 border-b border-gray-100">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "linear-gradient(135deg, #E5989B 0%, #d88891 100%)",
                            }}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <h2
                              className="text-[17px] font-bold mb-1"
                              style={{ color: "#2f2450" }}
                            >
                              {request.request_type || "Support Request"}
                            </h2>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full ${uc.pill}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${uc.dot}`}
                                />
                                {uc.label}
                              </span>
                              <span
                                className={`text-[10.5px] font-bold px-2.5 py-1 rounded-full ${sc.pill}`}
                              >
                                {sc.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {request.description && (
                        <p
                          className="text-[14px] leading-relaxed"
                          style={{ color: "#5a4f82" }}
                        >
                          {request.description}
                        </p>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="px-6 py-6">
                      {/* Key Info Grid */}
                      <div className="vsr-info-grid mb-6">
                        <div className="vsr-stat-card rounded-xl px-4 py-3">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#5E548E"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: "#7761AE" }}
                            >
                              Needed By
                            </span>
                          </div>
                          <p
                            className="text-[14px] font-semibold"
                            style={{ color: "#2e2350" }}
                          >
                            {request.needed_date
                              ? new Date(request.needed_date).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </p>
                        </div>

                        <div className="vsr-stat-card rounded-xl px-4 py-3">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#5E548E"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: "#7761AE" }}
                            >
                              Patient
                            </span>
                          </div>
                          <p
                            className="text-[14px] font-semibold capitalize"
                            style={{ color: "#2e2350" }}
                          >
                            {request.patient?.gender || "N/A"},{" "}
                            {request.patient?.age === 0
                              ? "Infant"
                              : request.patient?.age !== null &&
                                  request.patient?.age !== undefined
                                ? `${request.patient.age} yrs`
                                : "N/A"}
                          </p>
                        </div>

                        <div className="vsr-stat-card rounded-xl px-4 py-3">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#5E548E"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: "#7761AE" }}
                            >
                              Condition
                            </span>
                          </div>
                          <p
                            className="text-[14px] font-semibold capitalize truncate"
                            style={{ color: "#2e2350" }}
                          >
                            {request.patient?.medical_condition || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Items Section */}
                      {hasItems && (
                        <>
                          <div className="vsr-divider mb-5" />
                          
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-4">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#5E548E"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                              </svg>
                              <span
                                className="text-[13px] font-bold"
                                style={{ color: "#2e2350" }}
                              >
                                Requested Items ({request.items.length})
                              </span>
                            </div>
                            
                            <div className="space-y-2.5">
                              {request.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="vsr-item-row flex items-center justify-between rounded-xl px-4 py-3 border border-gray-100"
                                  style={{ background: "linear-gradient(135deg, #fdfbff 0%, #faf8ff 100%)" }}
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="vsr-item-badge w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                                      {idx + 1}
                                    </span>
                                    <span
                                      className="text-[14px] font-medium truncate"
                                      style={{ color: "#2e2350" }}
                                    >
                                      {item.item_name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 flex-shrink-0">
                                    <span
                                      className="text-[13px] font-medium"
                                      style={{ color: "#7761AE" }}
                                    >
                                      {item.quantity} {item.unit}
                                    </span>
                                    <span
                                      className="text-[14px] font-bold rounded-lg px-3 py-1.5"
                                      style={{
                                        color: "#5E548E",
                                        background: "#f1ebff",
                                      }}
                                    >
                                      Rs. {item.estimated_value}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div
                      className="px-6 py-4 flex items-center justify-between border-t"
                      style={{ 
                        background: "linear-gradient(135deg, #fdfbff 0%, #faf8ff 100%)",
                        borderColor: "#f0ebff"
                      }}
                    >
                      <p
                        className="text-[12.5px] font-medium"
                        style={{ color: "#7761AE" }}
                      >
                        {isUnavailable
                          ? "This request is no longer available"
                          : isAuthenticated
                            ? "Your donation goes directly to this patient"
                            : "Sign in to make a donation"}
                      </p>
                      <button
                        type="button"
                        onClick={() => !isUnavailable && handleDonateClick(request.id)}
                        disabled={isUnavailable}
                        className="vsr-btn inline-flex items-center gap-2 px-6 py-3 text-[13.5px] font-semibold rounded-xl text-white relative"
                        style={{
                          background: isUnavailable 
                            ? "#c4b5db" 
                            : "linear-gradient(135deg, #E5989B 0%, #d88891 100%)",
                          cursor: isUnavailable ? "not-allowed" : "pointer",
                          border: "none",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span className="relative z-10">
                          {isUnavailable
                            ? "Unavailable"
                            : isAuthenticated
                              ? "Donate Now"
                              : "Sign In to Donate"}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DonationFormPopup
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          setSelectedRequestId(null);
        }}
        requestId={selectedRequestId}
        donor={donor}
      />
    </>
  );
};

export default ViewAllSupportRequests;
