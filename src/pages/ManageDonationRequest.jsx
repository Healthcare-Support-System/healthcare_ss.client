import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const ManageDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    fetchDonationRequests();
  }, []);

  const fetchDonationRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/donation-requests");
      setRequests(response.data.data || response.data);
    } catch (err) {
      console.error("Error fetching donation requests:", err);
      setError("Failed to load donation requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
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
        `Donation request accepted. Reference Code: ${updatedRequest.reference_code}`
      );
      setError("");
    } catch (err) {
      console.error("Error accepting donation request:", err);
      setError(err.response?.data?.message || "Failed to accept donation request");
      setSuccessMessage("");
    }
  };

  const handleDelete = async (requestId) => {
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
    } catch (err) {
      console.error("Error deleting request:", err);
      setError(err.response?.data?.message || "Failed to delete request");
      setSuccessMessage("");
    }
  };

  const handleReject = async (requestId) => {
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
    try {
      if (newStatus === "accepted") {
        await handleAccept(requestId);
      } else if (newStatus === "rejected") {
        await handleReject(requestId);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading donation requests...</div>;
  }

  return (
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
  );
};

export default ManageDonationRequests;