import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DonationFormPopup from "./DonationFormPopup";
import { useAuth } from "../contexts/AuthContext";
import { privateApiClient } from "../api/apiClient";
import { END_POINTS } from "../api/endPoints";
import { ROUTES } from "../routes/path";

const ViewAllSupportRequests = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [donorProfile, setDonorProfile] = useState(null);

  const navigate = useNavigate();
  const { user, isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  useEffect(() => {
    const fetchDonorProfile = async () => {
      if (!isAuthenticated || user?.role !== "donor") {
        setDonorProfile(null);
        return;
      }

      try {
        const { data } = await privateApiClient.get(END_POINTS.GET_DONOR_PROFILE);
        const profile = data?.data || data;

        setDonorProfile(profile);

        if (profile?.id) {
          localStorage.setItem("donorId", profile.id);
        }

        const donorName =
          profile?.full_name ||
          profile?.first_name ||
          user?.full_name ||
          user?.first_name ||
          user?.name ||
          "";

        if (donorName) {
          localStorage.setItem("donorName", donorName);
        }
      } catch (profileError) {
        console.error("Unable to load donor profile", profileError);
      }
    };

    fetchDonorProfile();
  }, [isAuthenticated, user]);

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

  const donor = useMemo(
    () => ({
      id: donorProfile?.id || user?.id || localStorage.getItem("donorId") || "",
      first_name: donorProfile?.first_name || user?.first_name || "",
      full_name:
        donorProfile?.full_name ||
        user?.full_name ||
        user?.first_name ||
        user?.name ||
        localStorage.getItem("donorName") ||
        "",
    }),
    [donorProfile, user],
  );

  const handleDonateClick = (requestId) => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      alert("Please sign in before making a donation.");
      navigate(ROUTES.SIGNIN);
      return;
    }

    if (user.role !== "donor") {
      alert("Only donor accounts can submit donations.");
      return;
    }

    if (!donor.id) {
      alert("Your donor profile is still loading. Please try again in a moment.");
      return;
    }

    setSelectedRequestId(requestId);
    setIsPopupOpen(true);
  };

  if (loading) return <div className="p-4">Loading support requests...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">All Support Requests</h1>
        <p className="text-gray-600">
          Browse current needs and donate directly to a request.
          {!isAuthenticated && " Sign in to open the donation form."}
        </p>
      </div>

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

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => handleDonateClick(request.id)}
                  className="inline-flex items-center rounded-full bg-[#5E548E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A4272]"
                >
                  {isAuthenticated ? "Donate Now" : "Sign In to Donate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DonationFormPopup
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          setSelectedRequestId(null);
        }}
        requestId={selectedRequestId}
        donor={donor}
      />
    </div>
  );
};

export default ViewAllSupportRequests;
