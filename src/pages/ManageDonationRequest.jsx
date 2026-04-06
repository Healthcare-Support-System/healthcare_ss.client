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
    setPopup({
      open: true,
      title,
      message,
      type,
      onConfirm,
    });
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

  const fetchDonationRequests = async () => {
    try {
      // Validation: clear old messages before fetching fresh data
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
    // Validation: make sure a valid request id exists before accepting
    if (!requestId) {
      setError("Invalid donation request");
      setSuccessMessage("");
      return;
    }

    // Validation: make sure token exists before protected action
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/donation-requests/${requestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedRequest = response.data.data;

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId || request.id === requestId
            ? {
                ...request,
                ...updatedRequest,
                status: "accepted",
              }
            : request
        )
      );

      setSuccessMessage(
        `Donation request accepted. Reference Code: ${updatedRequest?.reference_code || "N/A"}`
      );
      setError("");
    } catch (err) {
      console.error("Error accepting donation request:", err);
      setError(err.response?.data?.message || "Failed to accept donation request");
      setSuccessMessage("");
    }
  };

  const performDelete = async (requestId) => {
    // Validation: make sure a valid request id exists before deleting
    if (!requestId) {
      setError("Invalid donation request");
      setSuccessMessage("");
      closePopup();
      return;
    }

    // Validation: make sure token exists before protected action
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      setSuccessMessage("");
      closePopup();
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8000/api/donation-requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests((prevRequests) =>
        prevRequests.filter(
          (request) => (request._id || request.id) !== requestId
        )
      );

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
    // Validation: make sure a valid request id exists before opening delete popup
    if (!requestId) {
      setError("Invalid donation request");
      setSuccessMessage("");
      return;
    }

    showPopup({
      title: "Delete Donation Request",
      message:
        "Are you sure you want to delete this donation request? This action cannot be undone.",
      type: "confirm",
      onConfirm: () => performDelete(requestId),
    });
  };

  const handleReject = async (requestId) => {
    // Validation: make sure a valid request id exists before rejecting
    if (!requestId) {
      setError("Invalid donation request");
      setSuccessMessage("");
      return;
    }

    // Validation: make sure token exists before protected action
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/donation-requests/${requestId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Reject response:", response.data);

      const updatedRequest = response.data.data;

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId || request.id === requestId
            ? {
                ...request,
                ...updatedRequest,
                status: "rejected",
              }
            : request
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
    // Validation: make sure a valid request id exists before changing status
    if (!requestId) {
      setError("Invalid donation request");
      setSuccessMessage("");
      return;
    }

    // Validation: allow only supported dropdown statuses
    if (!["pending", "accepted", "rejected"].includes(newStatus)) {
      setError("Invalid status selected");
      setSuccessMessage("");
      return;
    }

    try {
      if (newStatus === "accepted") {
        await handleAccept(requestId);
      } else if (newStatus === "rejected") {
        await handleReject(requestId);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update donation request status");
      setSuccessMessage("");
    }
  };

  if (loading) {
    return <div className="p-6">Loading donation requests...</div>;
  }

  return (
    <>
      <style>{`
        .custom-popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17, 24, 39, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
        }

        .custom-popup-box {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.18);
          overflow: hidden;
          border: 1px solid #f1f1f1;
        }

        .custom-popup-header {
          padding: 18px 20px 10px;
        }

        .custom-popup-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .custom-popup-body {
          padding: 0 20px 18px;
          color: #4b5563;
          font-size: 14px;
          line-height: 1.6;
        }

        .custom-popup-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 0 20px 20px;
        }

        .custom-btn-cancel {
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          background: #fff;
          color: #374151;
          font-weight: 600;
          cursor: pointer;
        }

        .custom-btn-confirm {
          padding: 10px 16px;
          border-radius: 10px;
          border: none;
          background: #dc2626;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .custom-btn-ok {
          padding: 10px 16px;
          border-radius: 10px;
          border: none;
          background: #5E548E;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>

      {popup.open && (
        <div className="custom-popup-overlay">
          <div className="custom-popup-box">
            <div className="custom-popup-header">
              <h3 className="custom-popup-title">{popup.title}</h3>
            </div>

            <div className="custom-popup-body">
              {popup.message}
            </div>

            <div className="custom-popup-actions">
              {popup.type === "confirm" ? (
                <>
                  <button className="custom-btn-cancel" onClick={closePopup}>
                    Cancel
                  </button>
                  <button
                    className="custom-btn-confirm"
                    onClick={() => popup.onConfirm && popup.onConfirm()}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button className="custom-btn-ok" onClick={closePopup}>
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Donation Requests</h1>

        {error && <div className="mb-4 text-red-600">{error}</div>}
        {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}

        {requests.length === 0 ? (
          <p>No donation requests found.</p>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <div
                key={request._id || request.id}
                className="border rounded-lg p-4 shadow bg-white"
              >
                <p>
                  <strong>Donation Request ID:</strong> {request._id || request.id}
                </p>

                <p>
                  <strong>Donor ID:</strong>{" "}
                  {request.donor_id?._id || request.donor_id || "N/A"}
                </p>

                <p>
                  <strong>Support Request ID:</strong>{" "}
                  {request.request_id?._id || request.request_id || "N/A"}
                </p>

                <p>
                  <strong>Message:</strong> {request.message || "No message"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {request.status === "pending" && "Pending"}
                  {request.status === "accepted" && "Accepted"}
                  {request.status === "rejected" && "Rejected"}
                </p>

                <p>
                  <strong>Created At:</strong>{" "}
                  {request.created_at
                    ? new Date(request.created_at).toLocaleDateString()
                    : "N/A"}
                </p>

                {request.reference_code && (
                  <p>
                    <strong>Reference Code:</strong> {request.reference_code}
                  </p>
                )}

                {request.accepted_at && (
                  <p>
                    <strong>Accepted At:</strong>{" "}
                    {new Date(request.accepted_at).toLocaleString()}
                  </p>
                )}

                {request.status === "pending" && (
                  <div className="mt-4 flex items-center gap-3">
                    <select
                      value={request.status}
                      onChange={(e) =>
                        handleStatusChange(request._id || request.id, e.target.value)
                      }
                      className="px-2 py-1 border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accept</option>
                      <option value="rejected">Reject</option>
                    </select>

                    <button
                      onClick={() => handleDelete(request._id || request.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {request.status !== "pending" && (
                  <button
                    disabled
                    className="mt-4 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  >
                    Already {request.status}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManageDonationRequests;