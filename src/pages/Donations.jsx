import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ROUTES } from "../routes/path.js";
import { END_POINTS } from "../api/endPoints.js";

const API_BASE_URL = "http://localhost:8000";

const inlineStyle = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  .don-root, .don-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

  @keyframes don-spin { to { transform: rotate(360deg); } }
  .don-spinner {
    width: 16px; height: 16px; flex-shrink: 0;
    border: 2px solid #F0E5E8;
    border-top-color: #5E548E;
    border-radius: 50%;
    animation: don-spin 0.75s linear infinite;
  }

  .don-select {
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235E548E' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    padding-right: 26px !important;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
  .don-select:focus { outline: none; box-shadow: 0 0 0 2px rgba(94,84,142,0.15); }
`;

const STATUS_MAP = {
  received:  { bg: "bg-slate-100",  text: "text-slate-600"   },
  allocated: { bg: "bg-purple-50",  text: "text-purple-700"  },
  used:      { bg: "bg-rose-50",    text: "text-rose-600"    },
  completed: { bg: "bg-emerald-50", text: "text-emerald-700" },
};

const IconPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconTrash = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
  </svg>
);

const IconHeart = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

/* Stat card — compact */
const StatCard = ({ label, value, valueClass = "text-[#5E548E]" }) => (
  <div className="flex flex-col gap-0.5 bg-white border border-[#F0E5E8] rounded-xl px-4 py-3 shadow-sm min-w-[90px]">
    <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#B5838D]">{label}</span>
    <span className={`text-xl font-bold leading-tight ${valueClass}`}>{value}</span>
  </div>
);

/* Table header cell */
const TH = ({ children, center = false }) => (
  <th className={`px-3 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5E548E]
    border-b border-[#F0E5E8] whitespace-nowrap bg-[#FDF5F7]
    ${center ? "text-center" : "text-left"}`}>
    {children}
  </th>
);

/* ════════════════════════════════════════ */
const Donations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => { fetchDonations(); }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true); setError("");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}${END_POINTS.GET_ALL_DONATIONS}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonations(response.data.data || []);
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError(err.response?.data?.message || "Failed to load donations");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}${END_POINTS.DELETE_DONATION(id)}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setDonations((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Error deleting donation:", err);
      alert(err.response?.data?.message || "Failed to delete donation");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}${END_POINTS.UPDATE_DONATION_STATUS(id)}`,
        { donation_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonations((prev) => prev.map((d) => (d._id === id ? response.data.data : d)));
    } catch (err) {
      console.error("Error updating donation status:", err);
      alert(err.response?.data?.message || "Failed to update donation status");
    }
  };

  const total     = donations.length;
  const allocated = donations.filter((d) => d.donation_status === "allocated").length;
  const completed = donations.filter((d) => d.donation_status === "completed").length;

  return (
    <>
      <style>{inlineStyle}</style>

      {/* 
        Use p-5 (20px) to match the original page padding.
        No min-h-screen width constraints — let the parent layout control width.
      */}
      <div className="don-root bg-[#FFF9F5] min-h-screen p-5">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-1 text-[#B5838D] mb-1.5">
              <IconHeart size={11} />
              <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]">
                Cancer Support Fund
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#5E548E] leading-tight">
              Donation Records
            </h1>
            <p className="text-[11.5px] text-[#B5838D] mt-0.5">
              View, manage, and track all incoming donation entries
            </p>
          </div>

          <button
            onClick={() => navigate(ROUTES.RECEIVED_DONATION)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5E548E] hover:bg-[#E5989B]
              text-white text-[12.5px] font-semibold rounded-xl shadow
              transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            <IconPlus />
            Add Received Donation
          </button>
        </div>

        {/* ── Stat Strip ── */}
        {!loading && !error && total > 0 && (
          <div className="flex items-stretch gap-2.5 mb-5">
            <StatCard label="Total Donations" value={total} />
            <StatCard label="Allocated"       value={allocated} valueClass="text-purple-700" />
            <StatCard label="Completed"       value={completed} valueClass="text-emerald-700" />
          </div>
        )}

        {/* ── Divider ── */}
        <div className="border-t border-[#F0E5E8] mb-5" />

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center gap-2.5 py-4 text-[13px] font-medium text-[#5E548E]">
            <div className="don-spinner" />
            Loading donation records…
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 border-l-4 border-l-[#B5838D]
            rounded-xl px-3.5 py-2.5 mb-4 text-rose-700 text-[12.5px]">
            {error}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && total === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2.5">
            <div className="w-12 h-12 rounded-xl bg-[#FDF5F7] border border-[#F0E5E8]
              flex items-center justify-center text-[#B5838D]">
              <IconHeart size={20} />
            </div>
            <p className="text-[13.5px] font-semibold text-[#5E548E]">No donations found</p>
            <p className="text-[12px] text-[#B5838D]">Add a received donation to get started.</p>
          </div>
        )}

        {/* ── Table ── */}
        {!loading && !error && total > 0 && (
          <div className="bg-white border border-[#F0E5E8] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px] border-collapse">
                <thead>
                  <tr>
                    <TH>#</TH>
                    <TH>Reference Code</TH>
                    <TH>Donation Type</TH>
                    <TH>Status</TH>
                    <TH>Received Date</TH>
                    <TH>Donor</TH>
                    <TH>Remarks</TH>
                    <TH center>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation, idx) => {
                    const status = donation.donation_status || "received";
                    const sc     = STATUS_MAP[status] || STATUS_MAP.received;

                    return (
                      <tr
                        key={donation._id}
                        className={`border-b border-[#F0E5E8] hover:bg-[#FFF9F5]
                          transition-colors duration-100
                          ${idx === total - 1 ? "border-b-0" : ""}`}
                      >
                        {/* # */}
                        <td className="px-3 py-2.5 text-[#B5838D] text-[11.5px] font-medium w-8">
                          {idx + 1}
                        </td>

                        {/* Reference Code */}
                        <td className="px-3 py-2.5">
                          {donation.reference_code ? (
                            <span className="inline-flex items-center bg-[#FDF5F7] border border-[#F0E5E8]
                              text-[#5E548E] text-[11px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
                              {donation.reference_code}
                            </span>
                          ) : <span className="text-[#E8D9DE]">—</span>}
                        </td>

                        {/* Donation Type */}
                        <td className="px-3 py-2.5">
                          {donation.donation_type ? (
                            <span className="inline-block bg-[#F0EBF8] text-[#5E548E]
                              text-[11.5px] font-medium px-2 py-0.5 rounded-md">
                              {donation.donation_type}
                            </span>
                          ) : <span className="text-[#E8D9DE]">—</span>}
                        </td>

                        {/* Status */}
                        <td className="px-3 py-2.5">
                          <select
                            className={`don-select text-[11.5px] font-semibold px-2.5 py-1
                              rounded-lg border border-[#F0E5E8] transition-all duration-150
                              ${sc.bg} ${sc.text}`}
                            value={status}
                            onChange={(e) => handleStatusUpdate(donation._id, e.target.value)}
                          >
                            <option value="received" disabled>received</option>
                            <option value="allocated">allocated</option>
                            <option value="used">used</option>
                            <option value="completed">completed</option>
                          </select>
                        </td>

                        {/* Date */}
                        <td className="px-3 py-2.5 text-[#6b6480] tabular-nums">
                          {donation.received_date
                            ? new Date(donation.received_date).toLocaleDateString("en-GB", {
                                day: "2-digit", month: "short", year: "numeric",
                              })
                            : <span className="text-[#E8D9DE]">—</span>}
                        </td>

                        {/* Donor */}
                        <td className="px-3 py-2.5 font-medium text-[#3a3248] max-w-[160px]">
                          <span className="block truncate">
                            {donation.donor_id?.name || donation.donor_id?._id
                              || <span className="text-[#E8D9DE]">—</span>}
                          </span>
                        </td>

                        {/* Remarks */}
                        <td className="px-3 py-2.5 max-w-[140px]">
                          <span className="block text-[#B5838D] italic text-[12px] truncate"
                            title={donation.remarks}>
                            {donation.remarks || "—"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => handleDelete(donation._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5
                              text-[11.5px] font-medium text-[#B5838D]
                              bg-transparent border border-[#F0E5E8] rounded-lg
                              hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200
                              transition-all duration-150 active:scale-95"
                          >
                            <IconTrash />
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-[#FDF5F7] border-t border-[#F0E5E8]
              flex items-center justify-between">
              <span className="text-[11px] text-[#B5838D]">
                Showing{" "}
                <span className="font-semibold text-[#5E548E]">{total}</span>{" "}
                record{total !== 1 ? "s" : ""}
              </span>
              <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#E8D9DE]">
                Cancer Support Fund
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Donations;