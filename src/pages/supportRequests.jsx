import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DonationFormPopup from "./DonationFormPopup";
import { useAuth } from "../contexts/AuthContext";
import { privateApiClient } from "../api/apiClient";
import { END_POINTS } from "../api/endPoints";
import { ROUTES } from "../routes/path";

const ViewAllSupportRequests = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [donorProfile, setDonorProfile] = useState(null);

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
        const { data } = await privateApiClient.get(END_POINTS.GET_DONOR_PROFILE);
        const profile = data?.data || data;
        setDonorProfile(profile);
        if (profile?.id) localStorage.setItem("donorId", profile.id);
        const donorName =
          profile?.full_name || profile?.first_name ||
          user?.full_name || user?.first_name || user?.name || "";
        if (donorName) localStorage.setItem("donorName", donorName);
      } catch (profileError) {
        console.error("Unable to load donor profile", profileError);
      }
    };
    fetchDonorProfile();
  }, [isAuthenticated, user]);

  const fetchSupportRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/support-requests/all");
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
        donorProfile?.full_name || user?.full_name ||
        user?.first_name || user?.name ||
        localStorage.getItem("donorName") || "",
    }),
    [donorProfile, user],
  );

  const handleDonateClick = (requestId) => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      alert("Please sign in before making a donation.");
      navigate(ROUTES.SIGNIN);
      return;
    }
    if (user.role !== "donor") {
      alert("Only donor accounts can submit donations.");
      return;
    }
    if (!donor.id) {
      alert("Your donor profile is still loading. Please try again in a moment.");
      return;
    }
    setSelectedRequestId(requestId);
    setIsPopupOpen(true);
  };

  /* ── urgency config ── */
  const urgencyConfig = {
    high: {
      pill: "bg-red-50 text-red-700 border border-red-200",
      dot:  "bg-red-500",
      label: "High",
    },
    medium: {
      pill: "bg-amber-50 text-amber-800 border border-amber-300",
      dot:  "bg-amber-500",
      label: "Medium",
    },
    low: {
      pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      dot:  "bg-emerald-500",
      label: "Low",
    },
  };

  const statusConfig = {
    open:      { pill: "bg-[#eee8ff] text-[#4a2999]",   label: "Open"      },
    pending:   { pill: "bg-amber-50 text-amber-800",     label: "Pending"   },
    fulfilled: { pill: "bg-emerald-50 text-emerald-700", label: "Fulfilled" },
    closed:    { pill: "bg-slate-100 text-slate-500",    label: "Closed"    },
  };

  const getUrgency = (u) => urgencyConfig[(u || "").toLowerCase()] || urgencyConfig.low;
  const getStatus  = (s) => statusConfig[(s  || "").toLowerCase()] || statusConfig.open;

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
          style={{ fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(160deg,#f7f3ff 0%,#fff5f7 60%,#fff9f0 100%)" }}
        >
          <div style={{
            width: 36, height: 36,
            border: "3px solid #e8dff7",
            borderTopColor: "#4a2999",
            borderRadius: "50%",
            animation: "sp .75s linear infinite",
          }} />
          <p style={{ fontSize: 13.5, fontWeight: 500, color: "#4a2999" }}>Loading support requests…</p>
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
          style={{ fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(160deg,#f7f3ff 0%,#fff5f7 60%,#fff9f0 100%)" }}
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
        .vsr-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .vsr-card:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(74,41,153,0.13); }
        .vsr-btn { transition: all 0.18s ease; }
        .vsr-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(74,41,153,0.32); background: #3a1f80 !important; }
        .vsr-btn:active { transform: scale(0.97); }
      `}</style>

      <div className="vsr-root min-h-screen" style={{ background: "linear-gradient(160deg,#f7f3ff 0%,#fff5f7 60%,#fff9f0 100%)" }}>

        {/* ── Hero Banner ── */}
        <div className="bg-white px-6 py-8" style={{ borderBottom: "1px solid #ede6f7" }}>
          <div className="max-w-4xl mx-auto">
            {/* eyebrow */}
            <div className="flex items-center gap-1.5 mb-3" style={{ color: "#9b6db5" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em]">HOPE · Cancer Support Fund</span>
            </div>

            <h1 className="text-2xl font-bold leading-tight mb-2" style={{ color: "#3d2a7a" }}>
              Support Requests
            </h1>
            <p className="text-[13.5px] max-w-lg leading-relaxed" style={{ color: "#9b6db5" }}>
              Every contribution makes a difference. Browse the requests below and donate directly to a patient in need.
              {!isAuthenticated && (
                <span className="ml-1 font-semibold" style={{ color: "#4a2999" }}>
                  Please{" "}
                  <button
                    onClick={() => navigate(ROUTES.SIGNIN)}
                    className="underline underline-offset-2 transition-colors duration-150"
                    style={{ color: "#4a2999" }}
                    onMouseOver={e => e.target.style.color = "#e2789b"}
                    onMouseOut={e => e.target.style.color = "#4a2999"}
                  >
                    sign in
                  </button>{" "}
                  to donate.
                </span>
              )}
            </p>

            {/* Summary pill */}
            {supportRequests.length > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
                style={{ background: "#f1ebff", border: "1px solid #d4bff5" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: "#6d3fcf" }} />
                <span className="text-[12px] font-semibold" style={{ color: "#4a2999" }}>
                  {supportRequests.length} active request{supportRequests.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-4xl mx-auto px-6 py-7">

          {/* Empty */}
          {supportRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "#f1ebff", border: "1px solid #d4bff5", color: "#9b6db5" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <p className="text-[14px] font-semibold" style={{ color: "#3d2a7a" }}>No support requests at the moment</p>
              <p className="text-[12.5px]" style={{ color: "#9b6db5" }}>Check back soon — new requests are added regularly.</p>
            </div>
          )}

          {/* Cards */}
          {supportRequests.length > 0 && (
            <div className="grid gap-4">
              {supportRequests.map((request) => {
                const uc = getUrgency(request.urgency_level);
                const sc = getStatus(request.status);
                const hasItems = request.items && request.items.length > 0;
                const isUnavailable = (request.status || "").toLowerCase() !== "open";

                return (
                  <div
                    key={request.id}
                    className="vsr-card rounded-2xl overflow-hidden"
                    style={{
                      border: "1px solid #ede6f7",
                      boxShadow: "0 2px 10px rgba(74,41,153,0.07)",
                      background: isUnavailable ? "#f5f3fa" : "#fff",
                      opacity: isUnavailable ? 0.72 : 1,
                    }}
                  >

                    {/* Card top bar */}
                    <div
                      className="flex items-center justify-between px-5 py-3"
                      style={{
                        background: isUnavailable
                          ? "linear-gradient(90deg,#f2f0f8,#f8f5fb)"
                          : "linear-gradient(90deg,#f5eeff,#fff0f5)",
                        borderBottom: "1px solid #ede6f7",
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: isUnavailable ? "#8a7db8" : "#4a2999" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white"
                            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </div>
                        <h2 className="text-[14px] font-bold truncate" style={{ color: isUnavailable ? "#5a4f82" : "#3d2a7a" }}>
                          {request.request_type || "Support Request"}
                        </h2>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${uc.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${uc.dot}`} />
                          {uc.label} Urgency
                        </span>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.pill}`}>
                          {sc.label}
                        </span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="px-5 py-4">

                      {/* Description */}
                      {request.description && (
                        <p className="text-[13px] leading-relaxed mb-4 pl-3"
                          style={{ color: "#3d2255", borderLeft: "3px solid #e2789b" }}>
                          {request.description}
                        </p>
                      )}

                      {/* Meta grid */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                          {
                            icon: (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                              </svg>
                            ),
                            label: "Needed By",
                            value: request.needed_date
                              ? new Date(request.needed_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                              : "N/A",
                          },
                          {
                            icon: (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                              </svg>
                            ),
                            label: "Submitted",
                            value: request.created_at
                              ? new Date(request.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                              : "N/A",
                          },
                          {
                            icon: (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                              </svg>
                            ),
                            label: "Items Needed",
                            value: hasItems ? `${request.items.length} item${request.items.length !== 1 ? "s" : ""}` : "N/A",
                          },
                        ].map(({ icon, label, value }) => (
                          <div key={label} className="rounded-xl px-3 py-2.5 flex flex-col gap-1"
                            style={{ background: "#faf7ff", border: "1px solid #e8dff7" }}>
                            <div className="flex items-center gap-1.5" style={{ color: "#9b6db5" }}>
                              {icon}
                              <span className="text-[9.5px] font-bold uppercase tracking-[0.1em]">{label}</span>
                            </div>
                            <span className="text-[12.5px] font-semibold" style={{ color: "#3d2a7a" }}>{value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Patient details */}
                      <div className="rounded-xl px-4 py-3 mb-4"
                        style={{ background: "#fdf8ff", border: "1px solid #e8dff7" }}>
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9b6db5"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                          <span className="text-[9.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9b6db5" }}>
                            Patient Details
                          </span>
                        </div>
                        <div className="flex items-center gap-5">
                          {[
                            ["Age",               request.patient?.age ?? "N/A"],
                            ["Gender",            request.patient?.gender || "N/A"],
                            ["Medical Condition", request.patient?.medical_condition || "N/A"],
                          ].map(([label, value]) => (
                            <div key={label} className="flex flex-col gap-0.5">
                              <span className="text-[9.5px] font-bold uppercase tracking-[0.09em]" style={{ color: "#b08fd1" }}>{label}</span>
                              <span className="text-[12.5px] font-semibold capitalize" style={{ color: "#3d2a7a" }}>{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Items list */}
                      {hasItems && (
                        <div className="mb-4">
                          <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] block mb-2" style={{ color: "#9b6db5" }}>
                            Requested Items
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {request.items.map((item, index) => (
                              <div key={index}
                                className="flex items-center justify-between rounded-xl px-3.5 py-2"
                                style={{ background: "#fafafa", border: "1px solid #ede6f7" }}>
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                                    style={{ background: "#eee8ff", color: "#4a2999" }}>
                                    {index + 1}
                                  </span>
                                  <span className="text-[12.5px] font-medium" style={{ color: "#2e1c5e" }}>{item.item_name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[11.5px]" style={{ color: "#9b6db5" }}>
                                    {item.quantity} {item.unit}
                                  </span>
                                  <span className="text-[11.5px] font-semibold rounded-lg px-2 py-0.5"
                                    style={{ color: "#4a2999", background: "#eee8ff" }}>
                                    Rs. {item.estimated_value}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-1">
                        <p className="text-[11.5px] italic" style={{ color: "#b08fd1" }}>
                          {isUnavailable
                            ? "This request is already being handled."
                            : isAuthenticated
                              ? "Your donation goes directly to this patient."
                              : "Sign in to make a donation for this request."}
                        </p>
                        <button
                          type="button"
                          onClick={() => !isUnavailable && handleDonateClick(request.id)}
                          disabled={isUnavailable}
                          className="vsr-btn inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold rounded-xl shadow-sm text-white"
                          style={{
                            background: isUnavailable ? "#aaa" : "#4a2999",
                            cursor: isUnavailable ? "not-allowed" : "pointer",
                            border: "none",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                          {isUnavailable
                            ? "Already Taken"
                            : isAuthenticated
                              ? "Donate Now"
                              : "Sign In to Donate"}
                        </button>
                      </div>
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
        onClose={() => { setIsPopupOpen(false); setSelectedRequestId(null); }}
        requestId={selectedRequestId}
        donor={donor}
      />
    </>
  );
};

export default ViewAllSupportRequests;