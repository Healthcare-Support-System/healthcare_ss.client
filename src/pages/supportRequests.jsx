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
    high:   { pill: "bg-rose-50 text-rose-600 border border-rose-200",   dot: "bg-rose-500",   label: "High"   },
    medium: { pill: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400",  label: "Medium" },
    low:    { pill: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500", label: "Low" },
  };

  const statusConfig = {
    open:       { pill: "bg-purple-50 text-purple-700", label: "Open"       },
    pending:    { pill: "bg-amber-50 text-amber-700",   label: "Pending"    },
    fulfilled:  { pill: "bg-emerald-50 text-emerald-700", label: "Fulfilled" },
    closed:     { pill: "bg-slate-100 text-slate-500",  label: "Closed"     },
  };

  const getUrgency = (u) => urgencyConfig[(u || "").toLowerCase()] || urgencyConfig.low;
  const getStatus  = (s) => statusConfig[(s  || "").toLowerCase()] || statusConfig.open;

  /* ── loading ── */
  if (loading) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap'); @keyframes sp{to{transform:rotate(360deg)}}`}</style>
        <div className="min-h-screen bg-[#FFF9F5] flex flex-col items-center justify-center gap-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ width:36, height:36, border:"3px solid #F0E5E8", borderTopColor:"#5E548E",
            borderRadius:"50%", animation:"sp .75s linear infinite" }} />
          <p className="text-[13.5px] font-medium text-[#5E548E]">Loading support requests…</p>
        </div>
      </>
    );
  }

  /* ── error ── */
  if (error) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600&display=swap');`}</style>
        <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="bg-rose-50 border border-rose-200 border-l-4 border-l-[#B5838D] rounded-2xl px-5 py-4 text-rose-700 text-[13px] max-w-sm">
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
        .vsr-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(94,84,142,0.10); }
        .vsr-btn { transition: all 0.18s ease; }
        .vsr-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(94,84,142,0.28); }
        .vsr-btn:active { transform: scale(0.97); }
      `}</style>

      <div className="vsr-root min-h-screen bg-[#FFF9F5]">

        {/* ── Hero Banner ── */}
        <div className="bg-white border-b border-[#F0E5E8] px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* eyebrow */}
            <div className="flex items-center gap-1.5 text-[#B5838D] mb-3">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em]">HOPE · Cancer Support Fund</span>
            </div>

            <h1 className="text-2xl font-bold text-[#5E548E] leading-tight mb-2">
              Support Requests
            </h1>
            <p className="text-[13.5px] text-[#B5838D] max-w-lg leading-relaxed">
              Every contribution makes a difference. Browse the requests below and donate directly to a patient in need.
              {!isAuthenticated && (
                <span className="ml-1 text-[#5E548E] font-semibold">
                  Please{" "}
                  <button onClick={() => navigate(ROUTES.SIGNIN)}
                    className="underline underline-offset-2 hover:text-[#E5989B] transition-colors duration-150">
                    sign in
                  </button>{" "}
                  to donate.
                </span>
              )}
            </p>

            {/* Summary pill */}
            {supportRequests.length > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 bg-[#FDF5F7] border border-[#F0E5E8] rounded-full px-3.5 py-1.5">
                <span className="w-2 h-2 rounded-full bg-[#5E548E]" />
                <span className="text-[12px] font-semibold text-[#5E548E]">
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
              <div className="w-14 h-14 rounded-2xl bg-[#FDF5F7] border border-[#F0E5E8] flex items-center justify-center text-[#B5838D]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-[#5E548E]">No support requests at the moment</p>
              <p className="text-[12.5px] text-[#B5838D]">Check back soon — new requests are added regularly.</p>
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
                    className={`vsr-card border border-[#F0E5E8] rounded-2xl overflow-hidden shadow-sm ${
                      isUnavailable ? "bg-gray-100 opacity-70" : "bg-white"
                    }`}
                  >

                    {/* Card top bar */}
                    <div className="flex items-center justify-between px-5 py-3 bg-[#FDF5F7] border-b border-[#F0E5E8]">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Request type icon */}
                        <div className="w-8 h-8 rounded-xl bg-[#5E548E] flex items-center justify-center flex-shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </div>
                        <h2 className="text-[14px] font-bold text-[#5E548E] truncate">
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
                        <p className="text-[13px] text-[#3a3248] leading-relaxed mb-4 border-l-2 border-[#E5989B] pl-3">
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
                              ? new Date(request.needed_date).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })
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
                              ? new Date(request.created_at).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })
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
                          <div key={label} className="bg-[#FFF9F5] border border-[#F0E5E8] rounded-xl px-3 py-2.5 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-[#B5838D]">
                              {icon}
                              <span className="text-[9.5px] font-bold uppercase tracking-[0.1em]">{label}</span>
                            </div>
                            <span className="text-[12.5px] font-semibold text-[#3a3248]">{value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Patient details */}
                      <div className="bg-[#FDF5F7] border border-[#F0E5E8] rounded-xl px-4 py-3 mb-4">
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B5838D"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                          <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#B5838D]">
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
                              <span className="text-[9.5px] font-bold uppercase tracking-[0.09em] text-[#B5838D]">{label}</span>
                              <span className="text-[12.5px] font-semibold text-[#3a3248] capitalize">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Items list */}
                      {hasItems && (
                        <div className="mb-4">
                          <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#B5838D] block mb-2">
                            Requested Items
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {request.items.map((item, index) => (
                              <div key={index}
                                className="flex items-center justify-between bg-white border border-[#F0E5E8]
                                  rounded-xl px-3.5 py-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-[#F0EBF8] flex items-center justify-center text-[10px] font-bold text-[#5E548E]">
                                    {index + 1}
                                  </span>
                                  <span className="text-[12.5px] font-medium text-[#3a3248]">{item.item_name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[11.5px] text-[#B5838D]">
                                    {item.quantity} {item.unit}
                                  </span>
                                  <span className="text-[11.5px] font-semibold text-[#5E548E] bg-[#F0EBF8] px-2 py-0.5 rounded-lg">
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
                        <p className="text-[11.5px] text-[#B5838D] italic">
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
                          className={`vsr-btn inline-flex items-center gap-2 px-5 py-2.5
                            text-[13px] font-semibold rounded-xl shadow-sm ${
                              isUnavailable
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-[#5E548E] hover:bg-[#E5989B] text-white"
                            }`}
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