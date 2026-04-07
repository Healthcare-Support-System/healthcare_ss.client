import React, { useState } from "react";
import { privateApiClient } from "../api/apiClient";
import { END_POINTS } from "../api/endPoints";

/* ─────────────────────────────────────────────
   Validation helpers
───────────────────────────────────────────── */
const SRI_LANKA_PHONE_REGEX = /^(07[0-9]{8})$/;

const validate = ({ phone, donor }) => {
  const errors = {};

  if (!donor?.id) {
    errors.auth = "You must be signed in to submit a donation request.";
  }

  if (!phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!SRI_LANKA_PHONE_REGEX.test(phone.trim())) {
    errors.phone = "Enter a valid Sri Lankan mobile number (e.g. 077 123 4567).";
  }

  return errors;
};

/* ─────────────────────────────────────────────
   Inline field-level error
───────────────────────────────────────────── */
const FieldError = ({ message }) =>
  message ? (
    <div className="dpop-field-error" role="alert" aria-live="polite">
      <span className="dpop-field-error-icon">⚠</span> {message}
    </div>
  ) : null;

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
const DonationFormPopup = ({ isOpen, onClose, requestId, donor }) => {
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation errors shown after first submit attempt
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Top-level feedback
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  if (!isOpen) return null;

  /* Live per-field validation on blur */
  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const errors = validate({ phone, donor });
    setFieldErrors(errors);
  };

  /* Re-validate on change if field has been touched */
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    if (touched.phone) {
      const errors = validate({ phone: e.target.value, donor });
      setFieldErrors((prev) => ({ ...prev, phone: errors.phone }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Mark all fields as touched so errors appear
    setTouched({ phone: true });
    const errors = validate({ phone, donor });
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Surface auth error at top level (non-field), phone inline
      if (errors.auth) setFormError(errors.auth);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        donor_id: donor.id,
        request_id: requestId,
        phone: phone.trim(),
        message: message.trim(),
      };
      await privateApiClient.post(END_POINTS.CREATE_DONATION_REQUEST, payload);

      setFormSuccess(true);
    } catch (err) {
      const status = err.response?.status;
      let msg = "Unable to submit your donation request. Please try again.";

      if (status === 409) {
        msg = "You have already submitted a donation for this request.";
      } else if (status === 404) {
        msg = "This donation request is no longer available.";
      } else if (status === 403) {
        msg = "You don't have permission to donate to this request.";
      } else if (status === 422) {
        msg =
          err.response?.data?.message ||
          "Some information is invalid. Please check your details and try again.";
      } else if (!err.response) {
        msg = "Network error — please check your connection and try again.";
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      }

      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // prevent accidental close mid-submit
    setFormError("");
    setFormSuccess(false);
    setPhone("");
    setMessage("");
    setTouched({});
    setFieldErrors({});
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideInModal {
          from { opacity: 0; transform: translateY(-18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes successPop {
          0%   { transform: scale(0.85); opacity: 0; }
          65%  { transform: scale(1.06); }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 48; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        /* Overlay */
        .dpop-overlay {
          position: fixed; inset: 0;
          background: rgba(94, 84, 142, 0.28);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
          animation: fadeInOverlay 0.25s ease;
          padding: 1rem;
        }

        /* Modal shell */
        .dpop-modal {
          background: white;
          border-radius: 28px;
          width: 460px; max-width: 100%; max-height: 90vh;
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
          position: relative; overflow: hidden;
        }
        .dpop-header::before {
          content: "";
          width: 110px; height: 110px;
          background: rgba(229, 152, 155, 0.18);
          border-radius: 50%;
          position: absolute; bottom: -35px; right: -25px;
          pointer-events: none;
        }
        .dpop-header::after {
          content: "";
          width: 60px; height: 60px;
          background: rgba(255, 255, 255, 0.07);
          border-radius: 50%;
          position: absolute; top: -10px; right: 65px;
          pointer-events: none;
        }
        .dpop-header-badge {
          background: rgba(255,255,255,0.14); border-radius: 100px;
          padding: 4px 12px; display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.75rem; color: rgba(255,255,255,0.9);
          margin-bottom: 0.75rem; position: relative;
        }
        .dpop-header-badge-dot { width: 6px; height: 6px; background: #E5989B; border-radius: 50%; }
        .dpop-header h2 {
          color: white; font-size: 1.35rem; font-weight: 600;
          letter-spacing: -0.01em; margin: 0; position: relative;
        }
        .dpop-header p {
          color: rgba(255,255,255,0.72); font-size: 0.82rem;
          margin: 4px 0 0; position: relative;
        }
        .dpop-close {
          position: absolute; top: 1rem; right: 1.25rem;
          background: rgba(255,255,255,0.18); border: none; color: white;
          font-size: 14px; width: 28px; height: 28px; border-radius: 50%;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.18s;
        }
        .dpop-close:hover { background: rgba(255,255,255,0.3); }
        .dpop-close:disabled { opacity: 0.45; cursor: not-allowed; }

        /* ── Body ── */
        .dpop-body {
          padding: 1.75rem 2rem 2rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* ── Top-level feedback banner ── */
        .dpop-banner {
          border-radius: 12px;
          padding: 11px 14px;
          font-size: 0.82rem;
          margin-bottom: 1rem;
          border-left: 3px solid;
          display: flex; align-items: flex-start; gap: 8px;
          line-height: 1.5;
        }
        .dpop-banner-icon { font-size: 15px; flex-shrink: 0; margin-top: 0px; }
        .dpop-banner.error   { background: #FFF1F2; color: #B25A66; border-color: #E5989B; }
        .dpop-banner.warning { background: #FFF8E7; color: #8A5A0A; border-color: #E9A23B; }

        /* ── Field-level inline error ── */
        .dpop-field-error {
          font-size: 0.75rem; color: #e53e3e;
          margin-top: 5px; display: flex; align-items: center; gap: 4px;
          font-weight: 500;
        }
        .dpop-field-error-icon { font-size: 11px; color: #e53e3e; }

        /* ── Fields ── */
        .dpop-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .dpop-field { margin-bottom: 1rem; }
        .dpop-field label {
          display: block; font-size: 0.75rem; font-weight: 600; color: #5E548E;
          letter-spacing: 0.4px; text-transform: uppercase; margin-bottom: 6px;
        }
        .dpop-field label .req { color: #E5989B; margin-left: 2px; }

        .dpop-field input,
        .dpop-field textarea {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid #F0E5E8; border-radius: 14px;
          font-size: 0.88rem; font-family: inherit; color: #5E548E;
          background: white; box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .dpop-field input:focus,
        .dpop-field textarea:focus {
          outline: none; border-color: #E5989B;
          box-shadow: 0 0 0 3px rgba(229,152,155,0.14);
        }
        .dpop-field input.has-error {
          border-color: #E5989B;
          box-shadow: 0 0 0 3px rgba(229, 152, 155, 0.18);
          background: #FFF8F9;
        }
        .dpop-field input::placeholder,
        .dpop-field textarea::placeholder { color: #D1BCC1; }
        .dpop-field input:disabled,
        .dpop-field textarea:disabled {
          background: #FDF5F7; color: #B5838D;
          border-color: #F0E5E8; cursor: not-allowed;
        }
        .dpop-field textarea { resize: vertical; min-height: 72px; }

        /* Character counter */
        .dpop-char-hint {
          font-size: 0.68rem; color: #C9A8B0;
          text-align: right; margin-top: 4px;
        }
        .dpop-char-hint.warn { color: #E9A23B; }

        /* ── Info strip ── */
        .dpop-info-strip {
          background: #F8F4FD; border-left: 3px solid #5E548E;
          border-radius: 0 10px 10px 0; padding: 9px 12px; margin-bottom: 1rem;
        }
        .dpop-info-strip .label { font-size: 0.72rem; color: #9990BB; margin-bottom: 2px; }
        .dpop-info-strip .value { font-size: 0.82rem; color: #5E548E; font-weight: 500; font-family: monospace; }

        /* ── Status pill ── */
        .dpop-status-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 14px;
          background: rgba(229,152,155,0.12); color: #B5666A;
          border-radius: 100px; font-size: 0.78rem; font-weight: 600;
        }
        .dpop-status-dot { width: 6px; height: 6px; background: #E5989B; border-radius: 50%; }

        /* ── Divider ── */
        .dpop-divider { border: none; border-top: 1px solid #FAF0F2; margin: 1.25rem 0 1rem; }

        /* ── Buttons ── */
        .dpop-btn-row { display: flex; gap: 10px; }
        .dpop-btn-cancel {
          flex: 1; padding: 12px;
          border: 1.5px solid #F0E5E8; border-radius: 100px;
          background: white; color: #5E548E; font-weight: 600;
          font-size: 0.88rem; cursor: pointer; font-family: inherit;
          transition: background 0.18s, border-color 0.18s, transform 0.15s;
        }
        .dpop-btn-cancel:hover:not(:disabled) { background: #FDF5F7; border-color: #E5989B; transform: translateY(-1px); }
        .dpop-btn-cancel:active { transform: translateY(0); }
        .dpop-btn-cancel:disabled { opacity: 0.4; cursor: not-allowed; }

        .dpop-btn-submit {
          flex: 2; padding: 12px; border: none; border-radius: 100px;
          background: #5E548E; color: white; font-weight: 600;
          font-size: 0.88rem; cursor: pointer; font-family: inherit;
          transition: background 0.18s, transform 0.15s;
          position: relative; overflow: hidden;
        }
        .dpop-btn-submit:hover:not(:disabled) { background: #E5989B; transform: translateY(-1px); }
        .dpop-btn-submit:active { transform: translateY(0); }
        .dpop-btn-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* Loading shimmer on button */
        .dpop-btn-submit.loading::after {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        /* ── Collection point notice ── */
        .dpop-notice {
          background: #FFF8E7; border-left: 3px solid #E9A23B;
          border-radius: 0 10px 10px 0; padding: 10px 14px; margin-bottom: 1.25rem;
          display: flex; gap: 10px; align-items: flex-start;
        }
        .dpop-notice-icon { font-size: 14px; margin-top: 1px; flex-shrink: 0; }
        .dpop-notice-text .dpop-notice-title { font-size: 0.78rem; font-weight: 600; color: #8A5A0A; margin-bottom: 2px; }
        .dpop-notice-text .dpop-notice-detail { font-size: 0.75rem; color: #A0690F; line-height: 1.5; }

        /* ── Success state ── */
        .dpop-success-body {
          padding: 2.5rem 2rem 2.5rem;
          text-align: center;
          font-family: 'Inter', system-ui, sans-serif;
          animation: successPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dpop-success-icon-wrap {
          width: 80px; height: 80px; border-radius: 50%;
          background: linear-gradient(135deg, #5E548E, #9B89C4);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 8px 24px rgba(94, 84, 142, 0.35);
        }
        .dpop-success-icon-wrap svg { width: 38px; height: 38px; }
        .dpop-success-check {
          stroke-dasharray: 48; stroke-dashoffset: 0;
          animation: checkDraw 0.55s ease 0.18s both;
        }
        .dpop-success-title {
          font-size: 1.25rem; font-weight: 700; color: #3D3466; margin: 0 0 0.5rem;
        }
        .dpop-success-sub {
          font-size: 0.84rem; color: #8880AA; line-height: 1.6; margin: 0 0 1.5rem;
        }
        .dpop-success-ref {
          background: #F8F4FD; border-radius: 12px; padding: 10px 16px;
          display: inline-block; margin-bottom: 1.5rem;
        }
        .dpop-success-ref .ref-label { font-size: 0.7rem; color: #9990BB; text-transform: uppercase; letter-spacing: 0.5px; }
        .dpop-success-ref .ref-val   { font-size: 0.88rem; color: #5E548E; font-weight: 600; font-family: monospace; margin-top: 2px; }
        .dpop-success-steps {
          text-align: left; background: #FAFAFA; border-radius: 14px;
          padding: 14px 16px; margin-bottom: 1.5rem;
        }
        .dpop-success-steps-title { font-size: 0.72rem; font-weight: 600; color: #9990BB; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .dpop-success-step {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 0.8rem; color: #5E548E; margin-bottom: 8px; line-height: 1.5;
        }
        .dpop-success-step:last-child { margin-bottom: 0; }
        .dpop-step-num {
          width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
          background: #5E548E; color: white; font-size: 0.65rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center; margin-top: 1px;
        }
        .dpop-success-close-btn {
          width: 100%; padding: 13px; border: none; border-radius: 100px;
          background: #5E548E; color: white; font-weight: 600;
          font-size: 0.9rem; cursor: pointer; font-family: inherit;
          transition: background 0.18s, transform 0.15s;
        }
        .dpop-success-close-btn:hover { background: #E5989B; transform: translateY(-1px); }

        /* ── Footer note ── */
        .dpop-footer-note {
          font-size: 0.68rem; text-align: center;
          color: #C9A8B0; margin-top: 1rem;
        }

        @media (max-width: 520px) {
          .dpop-body { padding: 1.25rem 1.25rem 1.5rem; }
          .dpop-row2 { grid-template-columns: 1fr; gap: 0; }
        }
      `}</style>

      <div className="dpop-overlay" onClick={!loading ? handleClose : undefined}>
        <div className="dpop-modal" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="dpop-header">
            <button className="dpop-close" onClick={handleClose} disabled={loading}>&#x2715;</button>
            <div className="dpop-header-badge">
              <span className="dpop-header-badge-dot" />
              Donor Portal
            </div>
            <h2>Support a Patient</h2>
            <p>Your kindness makes a meaningful difference</p>
          </div>

          {/* ── Success State ── */}
          {formSuccess ? (
            <div className="dpop-success-body">
              <div className="dpop-success-icon-wrap">
                <svg viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    className="dpop-success-check"
                    d="M9 19.5L16 26.5L29 13"
                    stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="dpop-success-title">Donation Request Submitted!</div>
              <p className="dpop-success-sub">
                Thank you, {donor?.full_name || donor?.first_name || "donor"}. Your willingness to help
                brings hope to a patient in need. We'll be in touch shortly.
              </p>

              <div className="dpop-success-ref">
                <div className="ref-label">Request ID</div>
                <div className="ref-val">{requestId}</div>
              </div>

              <div className="dpop-success-steps">
                <div className="dpop-success-steps-title">What happens next?</div>
                <div className="dpop-success-step">
                  <span className="dpop-step-num">1</span>
                  <span>Our team will review your donation details within 1–2 working days.</span>
                </div>
                <div className="dpop-success-step">
                  <span className="dpop-step-num">2</span>
                  <span>You'll receive a confirmation call on <strong>{phone}</strong> to arrange drop-off.</span>
                </div>
                <div className="dpop-success-step">
                  <span className="dpop-step-num">3</span>
                  <span>Bring your donation to Apeksha Hospital — Ground Floor, Main Entrance — Mon–Fri, 8 AM–4 PM.</span>
                </div>
              </div>

              <button className="dpop-success-close-btn" onClick={handleClose}>
                Done
              </button>
            </div>

          ) : (
            /* ── Form State ── */
            <div className="dpop-body">

              {/* Auth / network error banner */}
              {formError && (
                <div className="dpop-banner error" role="alert" aria-live="assertive">
                  <span className="dpop-banner-icon">🚫</span>
                  <span>{formError}</span>
                </div>
              )}

              {/* Not signed in warning */}
              {!donor?.id && !formError && (
                <div className="dpop-banner warning" role="status">
                  <span className="dpop-banner-icon">⚠️</span>
                  <span>You need to <strong>sign in</strong> before submitting a donation request.</span>
                </div>
              )}

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

              <form onSubmit={handleSubmit} noValidate>

                {/* Donor name + Phone */}
                <div className="dpop-row2">
                  <div className="dpop-field">
                    <label>Donor Name</label>
                    <input
                      value={donor?.full_name || donor?.first_name || ""}
                      disabled
                      aria-label="Donor name (read-only)"
                    />
                  </div>
                  <div className="dpop-field">
                    <label htmlFor="dpop-phone">
                      Phone <span className="req" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="dpop-phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      onBlur={() => handleBlur("phone")}
                      placeholder="07XXXXXXXX"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      className={touched.phone && fieldErrors.phone ? "has-error" : ""}
                      aria-required="true"
                      aria-invalid={!!(touched.phone && fieldErrors.phone)}
                      aria-describedby={fieldErrors.phone ? "dpop-phone-error" : undefined}
                      disabled={!donor?.id}
                    />
                    {touched.phone && fieldErrors.phone && (
                      <FieldError message={fieldErrors.phone} />
                    )}
                  </div>
                </div>

                {/* Request ID strip */}
                <div className="dpop-info-strip">
                  <div className="label">Request ID</div>
                  <div className="value">{requestId}</div>
                </div>

                {/* Message */}
                <div className="dpop-field">
                  <label htmlFor="dpop-message">Message</label>
                  <textarea
                    id="dpop-message"
                    placeholder="Include medicine details, expiry dates, and your preferred drop-off date/time (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    maxLength={500}
                    disabled={!donor?.id}
                  />
                  <div className={`dpop-char-hint ${message.length > 440 ? "warn" : ""}`}>
                    {message.length}/500
                  </div>
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
                  <input value="Assigned upon submission" disabled aria-label="Reference code assigned on submission" />
                </div>

                <hr className="dpop-divider" />

                <div className="dpop-btn-row">
                  <button
                    type="button"
                    className="dpop-btn-cancel"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`dpop-btn-submit${loading ? " loading" : ""}`}
                    disabled={loading || !donor?.id}
                  >
                    {loading ? "Submitting…" : "Submit Donation"}
                  </button>
                </div>

                <div className="dpop-footer-note">
                  Your support is held with care and confidentiality — thank you for giving hope.
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default DonationFormPopup;