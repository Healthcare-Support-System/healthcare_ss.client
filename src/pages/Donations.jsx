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
    border: 2px solid #E2CDD3;
    border-top-color: #4A3F7A;
    border-radius: 50%;
    animation: don-spin 0.75s linear infinite;
  }

  .don-select {
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%234A3F7A' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    padding-right: 26px !important;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
  .don-select:focus { outline: none; box-shadow: 0 0 0 2px rgba(74,63,122,0.2); }

  .don-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(28, 20, 45, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
  }

  .don-modal {
    width: 100%;
    max-width: 420px;
    background: white;
    border: 1px solid #E2CDD3;
    border-radius: 18px;
    box-shadow: 0 20px 50px rgba(74, 63, 122, 0.22);
    overflow: hidden;
  }

  .don-modal-header {
    padding: 16px 18px 10px;
    border-bottom: 1px solid #EDD8DE;
  }

  .don-modal-body {
    padding: 14px 18px 18px;
  }

  .don-modal-title {
    font-size: 16px;
    font-weight: 700;
    color: #4A3F7A;
    margin: 0;
  }

  .don-modal-text {
    font-size: 13px;
    color: #5a5070;
    line-height: 1.6;
    margin: 0;
  }

  .don-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 0 18px 18px;
  }

  .don-btn-secondary {
    border: 1px solid #E2CDD3;
    background: white;
    color: #4A3F7A;
    border-radius: 12px;
    padding: 9px 14px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
  }

  .don-btn-secondary:hover {
    background: #F7EBF0;
  }

  .don-btn-primary {
    border: none;
    background: #4A3F7A;
    color: white;
    border-radius: 12px;
    padding: 9px 14px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
  }

  .don-btn-primary:hover {
    background: #3a3062;
  }

  .don-btn-danger {
    border: none;
    background: #C9686B;
    color: white;
    border-radius: 12px;
    padding: 9px 14px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
  }

  .don-btn-danger:hover {
    background: #b85558;
  }
`;

const STATUS_MAP = {
  received:  { bg: "bg-slate-200",   text: "text-slate-700"   },
  allocated: { bg: "bg-purple-100",  text: "text-purple-800"  },
  used:      { bg: "bg-rose-100",    text: "text-rose-700"    },
  completed: { bg: "bg-emerald-100", text: "text-emerald-800" },
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


const StatCard = ({ label, value, valueClass = "text-[#4A3F7A]" }) => (
  <div className="flex flex-col gap-0.5 bg-white border border-[#E2CDD3] rounded-xl px-4 py-3 shadow-sm min-w-[90px]">
    <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#9A5F6A]">{label}</span>
    <span className={`text-xl font-bold leading-tight ${valueClass}`}>{value}</span>
  </div>
);

/* Table header cell */
const TH = ({ children, center = false }) => (
  <th className={`px-3 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#4A3F7A]
    border-b border-[#E2CDD3] whitespace-nowrap bg-[#F7EBF0]
    ${center ? "text-center" : "text-left"}`}>
    {children}
  </th>
);


const Donations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [popup, setPopup]         = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const showPopup = ({ title, message, type = "info", onConfirm = null }) => {
    setPopup({ open: true, title, message, type, onConfirm });
  };

  const closePopup = () => {
    setPopup({
      open: false,
      title: "",
      message: "",
      type: "info",
      onConfirm: null,
    });
  };

  useEffect(() => { fetchDonations(); }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true); 
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Your session has expired. Please sign in again.");
        return;
      }

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

  const performDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showPopup({
          title: "Session Expired",
          message: "Your session has expired. Please sign in again to continue.",
          type: "error",
        });
        return;
      }

      await axios.delete(`${API_BASE_URL}${END_POINTS.DELETE_DONATION(id)}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setDonations((prev) => prev.filter((d) => d._id !== id));
      closePopup();
    } catch (err) {
      console.error("Error deleting donation:", err);
      showPopup({
        title: "Delete Failed",
        message: err.response?.data?.message || "Failed to delete donation",
        type: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      showPopup({
        title: "Invalid Donation",
        message: "The selected donation could not be identified.",
        type: "error",
      });
      return;
    }

    showPopup({
      title: "Delete Donation",
      message: "Are you sure you want to delete this donation? This action cannot be undone.",
      type: "confirm",
      onConfirm: () => performDelete(id),
    });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!id) {
      showPopup({
        title: "Invalid Donation",
        message: "The selected donation could not be identified.",
        type: "error",
      });
      return;
    }

    const allowedStatuses = ["received", "allocated", "used", "completed"];
    if (!allowedStatuses.includes(newStatus)) {
      showPopup({
        title: "Invalid Status",
        message: "The selected donation status is not valid.",
        type: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showPopup({
          title: "Session Expired",
          message: "Your session has expired. Please sign in again to continue.",
          type: "error",
        });
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}${END_POINTS.UPDATE_DONATION_STATUS(id)}`,
        { donation_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonations((prev) => prev.map((d) => (d._id === id ? response.data.data : d)));
    } catch (err) {
      console.error("Error updating donation status:", err);
      showPopup({
        title: "Update Failed",
        message: err.response?.data?.message || "Failed to update donation status",
        type: "error",
      });
    }
  };

  const total     = donations.length;
  const allocated = donations.filter((d) => d.donation_status === "allocated").length;
  const completed = donations.filter((d) => d.donation_status === "completed").length;

  return (
    <>
      <style>{inlineStyle}</style>

      {popup.open && (
        <div className="don-modal-overlay">
          <div className="don-modal">
            <div className="don-modal-header">
              <h3 className="don-modal-title">{popup.title}</h3>
            </div>
            <div className="don-modal-body">
              <p className="don-modal-text">{popup.message}</p>
            </div>
            <div className="don-modal-actions">
              {popup.type === "confirm" ? (
                <>
                  <button className="don-btn-secondary" onClick={closePopup}>
                    Cancel
                  </button>
                  <button
                    className="don-btn-danger"
                    onClick={() => popup.onConfirm && popup.onConfirm()}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button className="don-btn-primary" onClick={closePopup}>
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="don-root bg-[#FDF4F6] min-h-screen p-5">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-1 text-[#9A5F6A] mb-1.5">
              <IconHeart size={11} />
              <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]">
                Cancer Support Fund
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#4A3F7A] leading-tight">
              Donation Records
            </h1>
            <p className="text-[11.5px] text-[#9A5F6A] mt-0.5">
              View, manage, and track all incoming donation entries
            </p>
          </div>

          <button
            onClick={() => navigate(ROUTES.RECEIVED_DONATION)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#4A3F7A] hover:bg-[#D4737A]
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
            <StatCard label="Allocated"       value={allocated} valueClass="text-purple-800" />
            <StatCard label="Completed"       value={completed} valueClass="text-emerald-800" />
          </div>
        )}

        {/* ── Divider ── */}
        <div className="border-t border-[#E2CDD3] mb-5" />

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center gap-2.5 py-4 text-[13px] font-medium text-[#4A3F7A]">
            <div className="don-spinner" />
            Loading donation records…
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-rose-50 border border-rose-300 border-l-4 border-l-[#9A5F6A]
            rounded-xl px-3.5 py-2.5 mb-4 text-rose-800 text-[12.5px]">
            {error}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && total === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2.5">
            <div className="w-12 h-12 rounded-xl bg-[#F7EBF0] border border-[#E2CDD3]
              flex items-center justify-center text-[#9A5F6A]">
              <IconHeart size={20} />
            </div>
            <p className="text-[13.5px] font-semibold text-[#4A3F7A]">No donations found</p>
            <p className="text-[12px] text-[#9A5F6A]">Add a received donation to get started.</p>
          </div>
        )}

        {/* ── Table ── */}
        {!loading && !error && total > 0 && (
          <div className="bg-white border border-[#E2CDD3] rounded-2xl overflow-hidden shadow-sm">
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
                        className={`border-b border-[#E2CDD3] hover:bg-[#FDF4F6]
                          transition-colors duration-100
                          ${idx === total - 1 ? "border-b-0" : ""}`}
                      >
                        {/* # */}
                        <td className="px-3 py-2.5 text-[#9A5F6A] text-[11.5px] font-medium w-8">
                          {idx + 1}
                        </td>

                        {/* Reference Code */}
                        <td className="px-3 py-2.5">
                          {donation.reference_code ? (
                            <span className="inline-flex items-center bg-[#F7EBF0] border border-[#E2CDD3]
                              text-[#4A3F7A] text-[11px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
                              {donation.reference_code}
                            </span>
                          ) : <span className="text-[#D4B8C0]">—</span>}
                        </td>

                        {/* Donation Type */}
                        <td className="px-3 py-2.5">
                          {donation.donation_type ? (
                            <span className="inline-block bg-[#EAE3F5] text-[#4A3F7A]
                              text-[11.5px] font-medium px-2 py-0.5 rounded-md">
                              {donation.donation_type}
                            </span>
                          ) : <span className="text-[#D4B8C0]">—</span>}
                        </td>

                        {/* Status */}
                        <td className="px-3 py-2.5">
                          <select
                            className={`don-select text-[11.5px] font-semibold px-2.5 py-1
                              rounded-lg border border-[#E2CDD3] transition-all duration-150
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
                        <td className="px-3 py-2.5 text-[#5a5070] tabular-nums">
                          {donation.received_date
                            ? new Date(donation.received_date).toLocaleDateString("en-GB", {
                                day: "2-digit", month: "short", year: "numeric",
                              })
                            : <span className="text-[#D4B8C0]">—</span>}
                        </td>

                        {/* Donor */}
                        <td className="px-3 py-2.5 font-medium text-[#2e2840] max-w-[160px]">
                          <span className="block truncate">
                            {donation.donor_id?.name || donation.donor_id?._id
                              || <span className="text-[#D4B8C0]">—</span>}
                          </span>
                        </td>

                        {/* Remarks */}
                        <td className="px-3 py-2.5 max-w-[140px]">
                          <span className="block text-[#9A5F6A] italic text-[12px] truncate"
                            title={donation.remarks}>
                            {donation.remarks || "—"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => handleDelete(donation._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5
                              text-[11.5px] font-medium text-[#9A5F6A]
                              bg-transparent border border-[#E2CDD3] rounded-lg
                              hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300
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
            <div className="px-4 py-2.5 bg-[#F7EBF0] border-t border-[#E2CDD3]
              flex items-center justify-between">
              <span className="text-[11px] text-[#9A5F6A]">
                Showing{" "}
                <span className="font-semibold text-[#4A3F7A]">{total}</span>{" "}
                record{total !== 1 ? "s" : ""}
              </span>
              <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#D4B8C0]">
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