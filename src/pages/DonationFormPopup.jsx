import React, { useState } from "react";
import { privateApiClient } from "../api/apiClient";
import { END_POINTS } from "../api/endPoints";

const DonationFormPopup = ({ isOpen, onClose, requestId, donor }) => {
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Keep the popup fully unmounted when it is closed so form state does not render in the background.
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // The create endpoint requires an authenticated donor id plus a valid mobile number.
    if (!donor || !donor.id) {
      setFormError("Please sign in to submit a donation request.");
      return;
    }
    if (!phone.trim()) {
      setFormError("Phone number is required.");
      return;
    }
    if (!/^07\d{8}$/.test(phone.trim())) {
      setFormError("Enter a valid phone number in the format 07XXXXXXXX.");
      return;
    }

    setLoading(true);
    try {
      // Match the backend contract for creating a donation request.
      const payload = {
        donor_id: donor.id,
        request_id: requestId,
        phone: phone.trim(),
        message: message.trim(),
      };
      await privateApiClient.post(END_POINTS.CREATE_DONATION_REQUEST, payload);
      setFormSuccess("Donation request submitted successfully.");
      setPhone("");
      setMessage("");
      // Give the donor a brief success state before closing and resetting the popup.
      setTimeout(() => {
        setFormSuccess("");
        onClose();
      }, 1000);
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Unable to submit your donation request right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInModal {
          from { opacity: 0; transform: translateY(-18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        .dpop-overlay {
          position: fixed;
          inset: 0;
          background: rgba(94, 84, 142, 0.28);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeInOverlay 0.25s ease;
          padding: 1rem;
        }

        .dpop-modal {
          background: white;
          border-radius: 28px;
          width: 460px;
          max-width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 48px -12px rgba(94, 84, 142, 0.22);
          animation: slideInModal 0.28s ease;
        }

        .dpop-modal::-webkit-scrollbar { width: 5px; }
        .dpop-modal::-webkit-scrollbar-track { background: #FDF5F7; border-radius: 10px; }
        .dpop-modal::-webkit-scrollbar-thumb { background: #E5989B; border-radius: 10px; }

        /* ── Header ── */
        .dpop-header {
          background: linear-gradient(135deg, #5E548E 0%, #4A4272 100%);
          padding: 1.5rem 2rem;
          border-radius: 28px 28px 0 0;
          position: relative;
          overflow: hidden;
        }
        .dpop-header::before {
          content: "";
          width: 110px; height: 110px;
          background: rgba(229, 152, 155, 0.18);
          border-radius: 50%;
          position: absolute;
          bottom: -35px; right: -25px;
          pointer-events: none;
        }
        .dpop-header::after {
          content: "";
          width: 60px; height: 60px;
          background: rgba(255, 255, 255, 0.07);
          border-radius: 50%;
          position: absolute;
          top: -10px; right: 65px;
          pointer-events: none;
        }

        .dpop-header-badge {
          background: rgba(255, 255, 255, 0.14);
          border-radius: 100px;
          padding: 4px 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.75rem;
          position: relative;
        }
        .dpop-header-badge-dot {
          width: 6px; height: 6px;
          background: #E5989B;
          border-radius: 50%;
        }

        .dpop-header h2 {
          color: white;
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          margin: 0;
          position: relative;
        }
        .dpop-header p {
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.82rem;
          margin: 4px 0 0;
          position: relative;
        }

        .dpop-close {
          position: absolute;
          top: 1rem; right: 1.25rem;
          background: rgba(255, 255, 255, 0.18);
          border: none;
          color: white;
          font-size: 14px;
          width: 28px; height: 28px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.18s;
        }
        .dpop-close:hover { background: rgba(255, 255, 255, 0.3); }

        /* ── Body ── */
        .dpop-body {
          padding: 1.75rem 2rem 2rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .dpop-feedback {
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 0.82rem;
          margin-bottom: 1rem;
          border-left: 3px solid;
        }
        .dpop-feedback.error  { background: #FFF1F2; color: #B25A66; border-color: #E5989B; }
        .dpop-feedback.success{ background: #F2EFFA; color: #5E548E;  border-color: #5E548E; }

        /* ── Fields ── */
        .dpop-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .dpop-field { margin-bottom: 1rem; }

        .dpop-field label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #5E548E;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .dpop-field label .req { color: #E5989B; margin-left: 2px; }

        .dpop-field input,
        .dpop-field textarea {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #F0E5E8;
          border-radius: 14px;
          font-size: 0.88rem;
          font-family: inherit;
          color: #5E548E;
          background: white;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .dpop-field input:focus,
        .dpop-field textarea:focus {
          outline: none;
          border-color: #E5989B;
          box-shadow: 0 0 0 3px rgba(229, 152, 155, 0.14);
        }
        .dpop-field input::placeholder,
        .dpop-field textarea::placeholder { color: #D1BCC1; }

        .dpop-field input:disabled,
        .dpop-field textarea:disabled {
          background: #FDF5F7;
          color: #B5838D;
          border-color: #F0E5E8;
          cursor: not-allowed;
        }
        .dpop-field textarea { resize: vertical; min-height: 72px; }

        /* ── Info strip ── */
        .dpop-info-strip {
          background: #F8F4FD;
          border-left: 3px solid #5E548E;
          border-radius: 0 10px 10px 0;
          padding: 9px 12px;
          margin-bottom: 1rem;
        }
        .dpop-info-strip .label { font-size: 0.72rem; color: #9990BB; margin-bottom: 2px; }
        .dpop-info-strip .value { font-size: 0.82rem; color: #5E548E; font-weight: 500; font-family: monospace; }

        /* ── Status pill ── */
        .dpop-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          background: rgba(229, 152, 155, 0.12);
          color: #B5666A;
          border-radius: 100px;
          font-size: 0.78rem;
          font-weight: 600;
        }
        .dpop-status-dot {
          width: 6px; height: 6px;
          background: #E5989B;
          border-radius: 50%;
        }

        /* ── Divider ── */
        .dpop-divider {
          border: none;
          border-top: 1px solid #FAF0F2;
          margin: 1.25rem 0 1rem;
        }

        /* ── Buttons ── */
        .dpop-btn-row { display: flex; gap: 10px; }

        .dpop-btn-cancel {
          flex: 1;
          padding: 12px;
          border: 1.5px solid #F0E5E8;
          border-radius: 100px;
          background: white;
          color: #5E548E;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.18s, border-color 0.18s, transform 0.15s;
        }
        .dpop-btn-cancel:hover {
          background: #FDF5F7;
          border-color: #E5989B;
          transform: translateY(-1px);
        }
        .dpop-btn-cancel:active { transform: translateY(0); }

        .dpop-btn-submit {
          flex: 2;
          padding: 12px;
          border: none;
          border-radius: 100px;
          background: #5E548E;
          color: white;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.18s, transform 0.15s;
        }
        .dpop-btn-submit:hover { background: #E5989B; transform: translateY(-1px); }
        .dpop-btn-submit:active { transform: translateY(0); }
        .dpop-btn-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* ── Footer note ── */
        .dpop-footer-note {
          font-size: 0.68rem;
          text-align: center;
          color: #C9A8B0;
          margin-top: 1rem;
        }

        @media (max-width: 520px) {
          .dpop-body { padding: 1.25rem 1.25rem 1.5rem; }
          .dpop-row2 { grid-template-columns: 1fr; gap: 0; }
        }

              /* ── Collection point notice ── */
      .dpop-notice {
        background: #FFF8E7;
        border-left: 3px solid #E9A23B;
        border-radius: 0 10px 10px 0;
        padding: 10px 14px;
        margin-bottom: 1.25rem;
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }
      .dpop-notice-icon {
        font-size: 14px;
        margin-top: 1px;
        flex-shrink: 0;
      }
      .dpop-notice-text .dpop-notice-title {
        font-size: 0.78rem;
        font-weight: 600;
        color: #8A5A0A;
        margin-bottom: 2px;
      }
      .dpop-notice-text .dpop-notice-detail {
        font-size: 0.75rem;
        color: #A0690F;
        line-height: 1.5;
      }
      `}</style>

      <div className="dpop-overlay" onClick={onClose}>
        <div className="dpop-modal" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="dpop-header">
            <button className="dpop-close" onClick={onClose}>&#x2715;</button>
            <div className="dpop-header-badge">
              <span className="dpop-header-badge-dot" />
              Donor Portal
            </div>
            <h2>Support a Patient</h2>
            <p>Your kindness makes a meaningful difference</p>
          </div>

          {/* Body */}
          <div className="dpop-body">
                          {/* Collection point notice */}
              <div className="dpop-notice">
                <span className="dpop-notice-icon">📍</span>
                <div className="dpop-notice-text">
                  <div className="dpop-notice-title">Donations collected in person</div>
                  <div className="dpop-notice-detail">
                    Apeksha Hospital Donation Point — Ground Floor, Main Entrance<br />
                    Mahela Jayawardena Mawatha, Maharagama 10280<br />
                    Mon – Fri &nbsp;·&nbsp; 8:00 AM – 4:00 PM
                  </div>
                </div>
              </div>

            <form onSubmit={handleSubmit}>
              {formError   && <div className="dpop-feedback error">{formError}</div>}
              {formSuccess && <div className="dpop-feedback success">{formSuccess}</div>}

              {/* Donor name + Phone on one row */}
              <div className="dpop-row2">
                <div className="dpop-field">
                  <label>Donor Name</label>
                  <input
                    value={donor?.full_name || donor?.first_name || ""}
                    disabled
                  />
                </div>
                <div className="dpop-field">
                  <label>Phone <span className="req">*</span></label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="077XXXXXXXX"
                    type="tel"
                    required
                  />
                </div>
              </div>

              {/* Request ID strip */}
              <div className="dpop-info-strip">
                <div className="label">Request ID</div>
                <div className="value">{requestId}</div>
              </div>

              {/* Message */}
              <div className="dpop-field">
                <label>Message</label>
                <textarea
                  placeholder="Include any notes about your donation (medicine details, expiry dates) and your preferred drop-off date/time"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Status */}
              <div className="dpop-field">
                <label>Status</label>
                <div className="dpop-status-pill">
                  <span className="dpop-status-dot" />
                  Pending Review
                </div>
              </div>

              {/* Reference Code */}
              <div className="dpop-field">
                <label>Reference Code</label>
                <input value="Assigned upon submission" disabled />
              </div>

              <hr className="dpop-divider" />

              <div className="dpop-btn-row">
                <button type="button" className="dpop-btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="dpop-btn-submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Donation"}
                </button>
              </div>

              <div className="dpop-footer-note">
                Your support is held with care and confidentiality — thank you for giving hope.
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default DonationFormPopup;
