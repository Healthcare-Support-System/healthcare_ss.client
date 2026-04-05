import React, { useState } from "react";
import axios from "axios";

const DonationFormPopup = ({ isOpen, onClose, requestId, donor }) => {
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Only check login
  if (!donor || !donor.id) {
    alert("Please log in before making a donation request.");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      donor_id: donor.id,
      request_id: requestId,
      phone_number: phone,
      message: message,
    };

    console.log("SENDING:", payload);

    await axios.post(
      "http://localhost:8000/api/donation-requests",
      payload
    );

    alert("Donation request submitted!");
    onClose();

  } catch (err) {
    console.error(err.response?.data);
    alert(err.response?.data?.message || "Error");
  }

  setLoading(false);
};
  return (
    <>
      <style>{`
        @keyframes gentleFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes gentleSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .donation-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(94, 84, 142, 0.3);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: gentleFadeIn 0.3s ease;
        }

        .donation-popup-modal {
          background: white;
          border-radius: 28px;
          width: 480px;
          max-width: 90%;
          max-height: 85vh;
          overflow-y: auto;
          animation: gentleSlideIn 0.3s ease;
          box-shadow: 0 25px 50px -12px rgba(94, 84, 142, 0.25);
        }

        .donation-popup-modal::-webkit-scrollbar {
          width: 6px;
        }

        .donation-popup-modal::-webkit-scrollbar-track {
          background: #FDF5F7;
          border-radius: 10px;
        }

        .donation-popup-modal::-webkit-scrollbar-thumb {
          background: #E5989B;
          border-radius: 10px;
        }

        .popup-header {
          background: linear-gradient(135deg, #5E548E 0%, #4A4272 100%);
          padding: 1.5rem 2rem;
          border-radius: 28px 28px 0 0;
          position: relative;
          overflow: hidden;
        }

        .popup-header::before {
          content: "💗";
          font-size: 80px;
          position: absolute;
          bottom: -20px;
          right: -10px;
          opacity: 0.1;
          pointer-events: none;
        }

        .popup-header h2 {
          margin: 0;
          color: white;
          font-size: 1.5rem;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .popup-header p {
          margin: 0.5rem 0 0;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
        }

        .popup-body {
          padding: 2rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #5E548E;
          font-size: 0.85rem;
          letter-spacing: 0.3px;
        }

        .form-group label span {
          color: #E5989B;
          margin-left: 2px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #F0E5E8;
          border-radius: 14px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          font-family: inherit;
          box-sizing: border-box;
          background: white;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #E5989B;
          box-shadow: 0 0 0 3px rgba(229, 152, 155, 0.15);
        }

        .form-group input:disabled,
        .form-group textarea:disabled {
          background: #FDF5F7;
          color: #B5838D;
          cursor: not-allowed;
          border-color: #F0E5E8;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .info-badge {
          background: #FDF5F7;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          margin-bottom: 1.25rem;
          border-left: 3px solid #E5989B;
        }

        .info-badge p {
          margin: 0;
          font-size: 0.8rem;
          color: #B5838D;
        }

        .info-badge strong {
          color: #5E548E;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(229, 152, 155, 0.15);
          color: #E5989B;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .btn-row {
          display: flex;
          gap: 12px;
          margin-top: 1.5rem;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px 20px;
          border: 1.5px solid #F0E5E8;
          border-radius: 40px;
          background: white;
          color: #5E548E;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          background: #FDF5F7;
          border-color: #E5989B;
          transform: translateY(-1px);
        }

        .btn-submit {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 40px;
          background: #5E548E;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-submit:hover {
          background: #E5989B;
          transform: translateY(-1px);
        }

        .btn-submit:active,
        .btn-cancel:active {
          transform: translateY(0);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .close-icon {
          position: absolute;
          top: 1.25rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-icon:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        hr {
          margin: 1rem 0;
          border: none;
          border-top: 1px solid #FDF5F7;
        }
      `}</style>

      <div className="donation-popup-overlay" onClick={onClose}>
        <div className="donation-popup-modal" onClick={(e) => e.stopPropagation()}>
          <div className="popup-header">
            <button className="close-icon" onClick={onClose}>✕</button>
            <h2>🤝 Support a Patient</h2>
            <p>Your kindness makes a difference</p>
          </div>

          <div className="popup-body">
            <form onSubmit={handleSubmit}>
              {/* Donor Name */}
              <div className="form-group">
                <label>Donor Name <span>❤️</span></label>
                <input
                  value={donor?.full_name || donor?.first_name || ""}
                  disabled
                />
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="077XXXXXXX"
                  type="tel"
                />
              </div>

              {/* Request Info Badge */}
              <div className="info-badge">
                <p>
                  <strong>Request ID:</strong> {requestId}
                </p>
              </div>

              {/* Message */}
              <div className="form-group">
                <label>Your Message of Support</label>
                <textarea
                  placeholder="Write a heartfelt message to let them know they're not alone..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3"
                />
              </div>

              {/* Status */}
              <div className="form-group">
                <label>Status</label>
                <div className="status-badge">⏳ Pending Review</div>
              </div>

              {/* Reference Code */}
              <div className="form-group">
                <label>Reference Code</label>
                <input value="Generating upon submission..." disabled />
              </div>

              <hr />

              <div className="btn-row">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationFormPopup;
