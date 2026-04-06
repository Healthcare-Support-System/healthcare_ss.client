import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { END_POINTS } from "../api/endPoints";

const ReceivedDonation = () => {
  const { token } = useAuth();

  const [referenceCode, setReferenceCode] = useState("");
  const [donationRequest, setDonationRequest] = useState(null);
  const [receivedItems, setReceivedItems] = useState([
    { item_name: "", quantity: "", unit: "", received: true }
  ]);
  const [donationType, setDonationType] = useState("item");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:8000";

  const handleFindByReference = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      setDonationRequest(null);

      const response = await axios.get(
        `${API_BASE_URL}${END_POINTS.GET_DONATION_BY_REFERENCE(referenceCode)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const foundDonationRequest = response.data.data;
      setDonationRequest(foundDonationRequest);

      const supportRequestItems = foundDonationRequest.request_id?.items || [];
      if (supportRequestItems.length > 0) {
        setReceivedItems(supportRequestItems.map((item) => ({
          item_name: item.item_name || "",
          quantity: item.quantity || "",
          unit: item.unit || "",
          received: true,
        })));
      } else {
        setReceivedItems([{ item_name: "", quantity: "", unit: "", received: true }]);
      }
    } catch (err) {
      console.error("Error finding donation request:", err);
      setError(err.response?.data?.message || "Failed to find donation request");
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...receivedItems];
    updatedItems[index][field] = value;
    setReceivedItems(updatedItems);
  };

  const addNewItemRow = () => {
    setReceivedItems([...receivedItems, { item_name: "", quantity: "", unit: "", received: true }]);
  };

  const removeItemRow = (index) => {
    if (receivedItems.length === 1) return;
    setReceivedItems(receivedItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const payload = {
        reference_code: referenceCode,
        donation_type: donationType,
        received_items: receivedItems.map((item) => ({
          item_name: item.item_name,
          quantity: Number(item.quantity),
          unit: item.unit,
          received: item.received,
        })),
        donation_status: "received",
        remarks: remarks,
      };

      await axios.post(`${API_BASE_URL}${END_POINTS.CREATE_DONATION}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Donation recorded successfully");
      setDonationRequest(null);
      setReferenceCode("");
      setReceivedItems([{ item_name: "", quantity: "", unit: "", received: true }]);
      setDonationType("item");
      setRemarks("");
    } catch (err) {
      console.error("Error saving donation:", err);
      setError(err.response?.data?.message || "Failed to record donation");
    } finally {
      setLoading(false);
    }
  };

  /* ── shared input class ── */
  const inputCls = `w-full border border-[#F0E5E8] rounded-lg px-3 py-2 text-[12.5px]
    text-[#3a3248] bg-white placeholder-[#E8D9DE]
    focus:outline-none focus:border-[#5E548E] focus:ring-2 focus:ring-[#5E548E]/10
    transition-all duration-150`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .rd-root, .rd-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        @keyframes rd-spin { to { transform: rotate(360deg); } }
        .rd-spinner {
          width: 15px; height: 15px; flex-shrink: 0;
          border: 2px solid #F0E5E8; border-top-color: #5E548E;
          border-radius: 50%; animation: rd-spin 0.75s linear infinite;
        }
        .rd-select {
          appearance: none; -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235E548E' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 8px center;
          padding-right: 26px !important; cursor: pointer; font-family: 'DM Sans', sans-serif;
        }
        .rd-select:focus { outline: none; box-shadow: 0 0 0 2px rgba(94,84,142,0.15); }
      `}</style>

      <div className="rd-root bg-[#FFF9F5] min-h-screen p-5">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-1 text-[#B5838D] mb-1.5">
              {/* heart icon */}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]">Cancer Support Fund</span>
            </div>
            <h1 className="text-xl font-bold text-[#5E548E] leading-tight">Receive Donation</h1>
            <p className="text-[11.5px] text-[#B5838D] mt-0.5">Record a new incoming donation entry</p>
          </div>
        </div>

        {/* ── Alerts ── */}
        {error && (
          <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 border-l-4 border-l-[#B5838D]
            rounded-xl px-3.5 py-2.5 mb-4 text-rose-700 text-[12.5px]">
            <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

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

        {/* ── Reference Code Lookup ── */}
        <div className="bg-white border border-[#F0E5E8] rounded-2xl p-4 mb-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#B5838D] mb-1">
            Step 1
          </p>
          <label className="block text-[13px] font-semibold text-[#5E548E] mb-2.5">
            Reference Code Lookup
          </label>
          <div className="flex gap-2.5">
            <input
              type="text"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
              placeholder="Enter reference code…"
              className={inputCls}
            />
            <button
              type="button"
              onClick={handleFindByReference}
              disabled={loading || !referenceCode.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#5E548E] hover:bg-[#E5989B]
                disabled:opacity-50 disabled:cursor-not-allowed
                text-white text-[12.5px] font-semibold rounded-xl
                transition-all duration-200 active:scale-95 whitespace-nowrap shadow-sm"
            >
              {loading ? <div className="rd-spinner" /> : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              )}
              Find
            </button>
          </div>
        </div>

        {/* ── Donation Form ── */}
        {donationRequest && (
          <form onSubmit={handleSubmit}>

            {/* Donation Details (read-only info) */}
            <div className="bg-white border border-[#F0E5E8] rounded-2xl p-4 mb-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#B5838D] mb-1">
                Step 2
              </p>
              <h2 className="text-[13px] font-semibold text-[#5E548E] mb-3">Donation Details</h2>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                {[
                  ["Reference Code",      donationRequest.reference_code],
                  ["Donation Request ID", donationRequest._id],
                  ["Support Request ID",  donationRequest.request_id?._id || donationRequest.request_id],
                  ["Donor ID",            donationRequest.donor_id?._id   || donationRequest.donor_id],
                  ["Status",              donationRequest.status],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#B5838D]">
                      {label}
                    </span>
                    <span className="text-[12.5px] font-medium text-[#3a3248] truncate">
                      {value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donation Type */}
            <div className="bg-white border border-[#F0E5E8] rounded-2xl p-4 mb-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#B5838D] mb-1">
                Step 3
              </p>
              <label className="block text-[13px] font-semibold text-[#5E548E] mb-2.5">
                Donation Type
              </label>
              <input
                type="text"
                value={donationType}
                onChange={(e) => setDonationType(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Received Items */}
            <div className="bg-white border border-[#F0E5E8] rounded-2xl p-4 mb-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#B5838D] mb-1">
                Step 4
              </p>
              <label className="block text-[13px] font-semibold text-[#5E548E] mb-3">
                Received Items
              </label>

              {/* Column labels */}
              <div className="grid grid-cols-5 gap-2.5 mb-1.5 px-0.5">
                {["Item Name", "Quantity", "Unit", "Status", ""].map((h, i) => (
                  <span key={i} className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#B5838D]">
                    {h}
                  </span>
                ))}
              </div>

              {receivedItems.map((item, index) => (
                <div key={index} className="grid grid-cols-5 gap-2.5 mb-2.5 items-center">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.item_name}
                    onChange={(e) => handleItemChange(index, "item_name", e.target.value)}
                    className={inputCls}
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className={inputCls}
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={item.unit}
                    onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                    className={inputCls}
                  />
                  <select
                    value={item.received ? "true" : "false"}
                    onChange={(e) => handleItemChange(index, "received", e.target.value === "true")}
                    className={`rd-select border border-[#F0E5E8] rounded-lg px-3 py-2 text-[12.5px]
                      text-[#5E548E] bg-[#FDF5F7] focus:border-[#5E548E] transition-all duration-150`}
                  >
                    <option value="true">Received</option>
                    <option value="false">Not Received</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeItemRow(index)}
                    disabled={receivedItems.length === 1}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-[11.5px] font-medium
                      text-[#B5838D] border border-[#F0E5E8] rounded-lg
                      hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200
                      disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all duration-150 active:scale-95"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                    </svg>
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addNewItemRow}
                className="mt-1 flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-semibold
                  text-[#5E548E] border border-[#F0E5E8] rounded-lg bg-[#FDF5F7]
                  hover:bg-[#5E548E] hover:text-white hover:border-[#5E548E]
                  transition-all duration-200 active:scale-95"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Item
              </button>
            </div>

            {/* Donation Status (read-only) */}
            <div className="bg-white border border-[#F0E5E8] rounded-2xl p-4 mb-4 shadow-sm">
              <label className="block text-[13px] font-semibold text-[#5E548E] mb-2.5">
                Donation Status
              </label>
              <input
                type="text"
                value="received"
                readOnly
                className={`${inputCls} bg-[#FDF5F7] cursor-not-allowed text-[#B5838D] font-medium`}
              />
            </div>

            {/* Remarks */}
            <div className="bg-white border border-[#F0E5E8] rounded-2xl p-4 mb-5 shadow-sm">
              <label className="block text-[13px] font-semibold text-[#5E548E] mb-2.5">
                Remarks
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder="Add any notes or remarks…"
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#5E548E] hover:bg-[#E5989B]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-white text-[13px] font-semibold rounded-xl shadow
                  transition-all duration-200 active:scale-95"
              >
                {loading && <div className="rd-spinner" />}
                {loading ? "Saving…" : "Save Donation"}
              </button>
            </div>

          </form>
        )}
      </div>
    </>
  );
};

export default ReceivedDonation;