import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewAllSupportRequests = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSupportRequests();
  }, []);

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

  if (loading) return <div className="p-4">Loading support requests...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Support Requests</h1>

      {supportRequests.length === 0 ? (
        <p>No support requests found.</p>
      ) : (
        <div className="grid gap-4">
          {supportRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 shadow bg-white">
              <h2 className="text-lg font-semibold mb-2">
                {request.request_type || "No Request Type"}
              </h2>

              <p>
                <strong>Description:</strong> {request.description || "No description"}
              </p>

              <p>
                <strong>Urgency:</strong> {request.urgency_level || "N/A"}
              </p>

              <p>
                <strong>Status:</strong> {request.status || "N/A"}
              </p>

              <p>
                <strong>Needed Date:</strong>{" "}
                {request.needed_date
                  ? new Date(request.needed_date).toLocaleDateString()
                  : "N/A"}
              </p>

              <p>
                <strong>Created At:</strong>{" "}
                {request.created_at
                  ? new Date(request.created_at).toLocaleDateString()
                  : "N/A"}
              </p>

              <div className="mt-3">
                <strong>Patient Details:</strong>
                <p>
                  <strong>Age:</strong> {request.patient?.age ?? "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong> {request.patient?.gender || "N/A"}
                </p>
                <p>
                  <strong>Medical Condition:</strong>{" "}
                  {request.patient?.medical_condition || "N/A"}
                </p>
              </div>

              {/* <p className="mt-3">
                <strong>Created By:</strong>{" "}
                {request.created_by?.name || request.created_by?.id || "N/A"}
              </p> */}

              {request.items && request.items.length > 0 && (
                <div className="mt-3">
                  <strong>Items:</strong>
                  <ul className="list-disc ml-6 mt-1">
                    {request.items.map((item, index) => (
                      <li key={index}>
                        {item.item_name} - {item.quantity} {item.unit} - Rs.{" "}
                        {item.estimated_value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAllSupportRequests;