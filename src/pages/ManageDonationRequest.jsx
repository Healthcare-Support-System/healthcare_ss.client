import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const ManageDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { token } = useAuth();

  const [popup, setPopup] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  useEffect(() => {
    fetchDonationRequests();
  }, []);

  const showPopup = ({ title, message, type = "info", onConfirm = null }) => {
    setPopup({ open: true, title, message, type, onConfirm });
  };

  const closePopup = () => {
    setPopup({ open: false, title: "", message: "", type: "info", onConfirm: null });
  };

  const fetchDonationRequests = async () => {
    try {
      setError("");
      setSuccessMessage("");
      const response = await axios.get("http://localhost:8000/api/donation-requests");
      setRequests(response.data.data || response.data || []);
    } catch (err) {
      console.error("Error fetching donation requests:", err);
      setError(err.response?.data?.message || "Failed to load donation requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    if (!requestId) { setError("Invalid donation request"); setSuccessMessage(""); return; }
    if (!token) { setError("Your session has expired. Please sign in again."); setSuccessMessage(""); return; }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/donation-requests/${requestId}/accept`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedRequest = response.data.data;
      setRequests((prev) =>
        prev.map((r) =>
          r._id === requestId || r.id === requestId
            ? { ...r, ...updatedRequest, status: "accepted" } : r
        )
      );
      setSuccessMessage(`Donation request accepted. Reference Code: ${updatedRequest?.reference_code || "N/A"}`);
      setError("");
    } catch (err) {
      console.error("Error accepting donation request:", err);
      setError(err.response?.data?.message || "Failed to accept donation request");
      setSuccessMessage("");
    }
  };

  const performDelete = async (requestId) => {
    if (!requestId) { setError("Invalid donation request"); setSuccessMessage(""); closePopup(); return; }
    if (!token) { setError("Your session has expired. Please sign in again."); setSuccessMessage(""); closePopup(); return; }
    try {
      await axios.delete(`http://localhost:8000/api/donation-requests/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prev) => prev.filter((r) => (r._id || r.id) !== requestId));
      setSuccessMessage("Donation request deleted successfully");
      setError("");
      closePopup();
    } catch (err) {
      console.error("Error deleting request:", err);
      setError(err.response?.data?.message || "Failed to delete request");
      setSuccessMessage("");
      closePopup();
    }
  };

  const handleDelete = async (requestId) => {
    if (!requestId) { setError("Invalid donation request"); setSuccessMessage(""); return; }
    showPopup({
      title: "Delete Donation Request",
      message: "Are you sure you want to delete this donation request? This action cannot be undone.",
      type: "confirm",
      onConfirm: () => performDelete(requestId),
    });
  };

  const handleReject = async (requestId) => {
    if (!requestId) { setError("Invalid donation request"); setSuccessMessage(""); return; }
    if (!token) { setError("Your session has expired. Please sign in again."); setSuccessMessage(""); return; }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/donation-requests/${requestId}/reject`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Reject response:", response.data);
      const updatedRequest = response.data.data;
      setRequests((prev) =>
        prev.map((r) =>
          r._id === requestId || r.id === requestId
            ? { ...r, ...updatedRequest, status: "rejected" } : r
        )
      );
      setSuccessMessage("Donation request rejected successfully");
      setError("");
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError(err.response?.data?.message || "Failed to reject donation request");
      setSuccessMessage("");
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    if (!requestId) { setError("Invalid donation request"); setSuccessMessage(""); return; }
    if (!["pending", "accepted", "rejected"].includes(newStatus)) { setError("Invalid status selected"); setSuccessMessage(""); return; }
    try {
      if (newStatus === "accepted") await handleAccept(requestId);
      else if (newStatus === "rejected") await handleReject(requestId);
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update donation request status");
      setSuccessMessage("");
    }
  };

  /* ── helpers ── */
  const statusConfig = {
    pending:  { pill: "bg-amber-50 text-amber-700",   dot: "bg-amber-400",   label: "Pending"  },
    accepted: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", label: "Accepted" },
    rejected: { pill: "bg-rose-50 text-rose-600",     dot: "bg-rose-400",    label: "Rejected" },
  };

  const InfoField = ({ label, value }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#B5838D]">{label}</span>
      <span className="text-[12.5px] font-medium text-[#3a3248] truncate">{value || "N/A"}</span>
    </div>
  );

  /* ── loading state ── */
  if (loading) {
    return (
      <div className="bg-[#FFF9F5] min-h-screen p-5 flex items-center gap-3 text-[13px] font-medium text-[#5E548E]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500&display=swap'); @keyframes sp{to{transform:rotate(360deg)}}`}</style>
        <span style={{ width:16, height:16, border:"2px solid #F0E5E8", borderTopColor:"#5E548E", borderRadius:"50%", animation:"sp .75s linear infinite", flexShrink:0, display:"inline-block" }} />
        Loading donation requests…
      </div>
    );
  }

  return (
    <>
      {/* DM Sans + select arrow — only non-Tailwind bits */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .mdr, .mdr * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .mdr-sel {
          appearance: none; -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235E548E' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 8px center;
          padding-right: 26px !important; cursor: pointer; font-family: 'DM Sans', sans-serif;
        }
        .mdr-sel:focus { outline: none; box-shadow: 0 0 0 2px rgba(94,84,142,0.15); }
      `}</style>

      {/* ── Popup ── */}
      {popup.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(58,50,72,0.30)", backdropFilter: "blur(2px)" }}>
          <div className="bg-white rounded-2xl shadow-2xl border border-[#F0E5E8] w-full max-w-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-start gap-3 px-5 pt-5 pb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B5838D"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-[#5E548E] leading-tight">{popup.title}</h3>
                <p className="text-[12.5px] text-[#B5838D] mt-1 leading-relaxed">{popup.message}</p>
              </div>
            </div>
            {/* Actions */}
            <div className="flex justify-end gap-2 px-5 pb-5 pt-2">
              {popup.type === "confirm" ? (
                <>
                  <button onClick={closePopup}
                    className="px-4 py-2 text-[12.5px] font-semibold text-[#6b6480] border border-[#F0E5E8]
                      rounded-xl bg-white hover:bg-[#FDF5F7] transition-all duration-150 active:scale-95">
                    Cancel
                  </button>
                  <button onClick={() => popup.onConfirm && popup.onConfirm()}
                    className="px-4 py-2 text-[12.5px] font-semibold text-white bg-rose-500
                      hover:bg-rose-600 rounded-xl transition-all duration-150 active:scale-95 shadow-sm">
                    Delete
                  </button>
                </>
              ) : (
                <button onClick={closePopup}
                  className="px-4 py-2 text-[12.5px] font-semibold text-white bg-[#5E548E]
                    hover:bg-[#E5989B] rounded-xl transition-all duration-150 active:scale-95 shadow-sm">
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Page ── */}
      <div className="mdr bg-[#FFF9F5] min-h-screen p-5">

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-[#B5838D] mb-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]">Cancer Support Fund</span>
          </div>
          <h1 className="text-xl font-bold text-[#5E548E] leading-tight">Manage Donation Requests</h1>
          <p className="text-[11.5px] text-[#B5838D] mt-0.5">Review, accept, or reject incoming donation requests</p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 border-l-4 border-l-[#B5838D]
            rounded-xl px-3.5 py-2.5 mb-4 text-rose-700 text-[12.5px]">
            <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Success alert */}
        {successMessage && (
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 border-l-4 border-l-emerald-500
            rounded-xl px-3.5 py-2.5 mb-4 text-emerald-700 text-[12.5px]">
            <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {successMessage}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-[#F0E5E8] mb-5" />

        {/* Empty state */}
        {requests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2.5">
            <div className="w-12 h-12 rounded-xl bg-[#FDF5F7] border border-[#F0E5E8] flex items-center justify-center text-[#B5838D]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <p className="text-[13.5px] font-semibold text-[#5E548E]">No donation requests found</p>
            <p className="text-[12px] text-[#B5838D]">New requests will appear here once submitted.</p>
          </div>
        )}

        {/* Cards */}
        {requests.length > 0 && (
          <div className="grid gap-3">
            {requests.map((request) => {
              const id     = request._id || request.id;
              const status = request.status || "pending";
              const sc     = statusConfig[status] || statusConfig.pending;

              return (
                <div key={id}
                  className="bg-white border border-[#F0E5E8] rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-150">

                  {/* Card top bar */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0E5E8] bg-[#FDF5F7]">
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] font-bold uppercase tracking-[0.11em] text-[#B5838D]">
                        Request ID
                      </span>
                      <span className="text-[11px] font-semibold text-[#5E548E] bg-white border border-[#F0E5E8] px-2 py-0.5 rounded-full truncate max-w-[200px]">
                        {id}
                      </span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${sc.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="px-4 py-3.5">
                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-3.5">
                      <InfoField label="Donor ID"           value={request.donor_id?._id || request.donor_id} />
                      <InfoField label="Support Request ID" value={request.request_id?._id || request.request_id} />
                      <InfoField label="Created At"         value={request.created_at ? new Date(request.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"} />
                      {request.reference_code && <InfoField label="Reference Code" value={request.reference_code} />}
                      {request.accepted_at    && <InfoField label="Accepted At"    value={new Date(request.accepted_at).toLocaleString()} />}
                    </div>

                    {/* Message */}
                    {request.message && (
                      <div className="bg-[#FFF9F5] border border-[#F0E5E8] rounded-xl px-3 py-2.5 mb-3.5">
                        <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#B5838D] block mb-1">
                          Message
                        </span>
                        <p className="text-[12.5px] text-[#3a3248] leading-relaxed">{request.message}</p>
                      </div>
                    )}

                    {/* Pending actions */}
                    {status === "pending" && (
                      <div className="flex items-center gap-2.5 pt-0.5">
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(id, e.target.value)}
                          className="mdr-sel text-[12px] font-semibold px-3 py-1.5 rounded-lg
                            border border-[#F0E5E8] bg-amber-50 text-amber-700
                            transition-all duration-150"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accept</option>
                          <option value="rejected">Reject</option>
                        </select>

                        <button
                          onClick={() => handleDelete(id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium
                            text-[#B5838D] border border-[#F0E5E8] rounded-lg bg-transparent
                            hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200
                            transition-all duration-150 active:scale-95"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}

                    {/* Resolved state */}
                    {status !== "pending" && (
                      <div className="pt-0.5">
                        <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold
                          px-3 py-1.5 rounded-lg border ${
                            status === "accepted"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-500 border-rose-200"
                          }`}>
                          {status === "accepted" ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          )}
                          Already {status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ManageDonationRequests;