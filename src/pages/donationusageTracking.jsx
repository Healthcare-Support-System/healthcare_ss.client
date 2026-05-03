import React, { useEffect, useMemo, useState } from "react";
import { privateApiClient } from "../api/apiClient";
import { END_POINTS } from "../api/endPoints";

const getArrayPayload = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const normalizeRef = (value) => String(value || "").trim().toLowerCase();
const normalizeId = (value) => String(value || "").trim();

const getEntityId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value._id || value.id || "";
  return "";
};

const getRequestMatchKeys = (request) => ({
  donationRequestId: normalizeId(getEntityId(request?._id || request?.id)),
  supportRequestId: normalizeId(getEntityId(request?.request_id)),
  donorId: normalizeId(getEntityId(request?.donor_id)),
  referenceCode: normalizeRef(request?.reference_code),
});

const getDonationMatchKeys = (donation) => ({
  donationRequestId: normalizeId(getEntityId(donation?.donation_request_id)),
  supportRequestId: normalizeId(getEntityId(donation?.request_id)),
  donorId: normalizeId(getEntityId(donation?.donor_id)),
  referenceCode: normalizeRef(donation?.reference_code),
});

const findMatchingDonationRecord = (request, donationRecords) => {
  const requestKeys = getRequestMatchKeys(request);

  return donationRecords.find((donation) => {
    const donationKeys = getDonationMatchKeys(donation);

    if (
      requestKeys.referenceCode &&
      donationKeys.referenceCode === requestKeys.referenceCode
    ) {
      return true;
    }

    if (
      requestKeys.donationRequestId &&
      donationKeys.donationRequestId === requestKeys.donationRequestId
    ) {
      return true;
    }

    if (
      requestKeys.supportRequestId &&
      donationKeys.supportRequestId === requestKeys.supportRequestId &&
      requestKeys.donorId &&
      donationKeys.donorId === requestKeys.donorId
    ) {
      return true;
    }

    return false;
  });
};

const DonationUsageTracking = () => {
  const [requests, setRequests] = useState([]);
  const [donationRecords, setDonationRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donationRecordsError, setDonationRecordsError] = useState("");

  useEffect(() => {
    const fetchDonationRequests = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const donorId =
        localStorage.getItem("donorId") ||
        storedUser?.id ||
        storedUser?._id;

      if (!donorId) {
        setRequests([]);
        setError("Unable to identify the current donor.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setDonationRecordsError("");

        const [requestsResponse, donationsResponse] = await Promise.allSettled([
          privateApiClient.get(`${END_POINTS.GET_DONOR_DONATION_REQUESTS}/${donorId}`),
          privateApiClient.get(END_POINTS.GET_DONOR_DONATIONS(donorId)),
        ]);

        if (requestsResponse.status === "fulfilled") {
          setRequests(getArrayPayload(requestsResponse.value));
        } else {
          throw requestsResponse.reason;
        }

        if (donationsResponse.status === "fulfilled") {
          setDonationRecords(getArrayPayload(donationsResponse.value));
        } else {
          setDonationRecords([]);
          setDonationRecordsError(
            donationsResponse.reason?.response?.data?.message ||
            "Donation record tracking is not available right now."
          );
        }
      } catch (err) {
        console.error("Error fetching donation usage data:", err);
        setError(err.response?.data?.message || "Failed to load donation usage data");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationRequests();
  }, []);

  const acceptedCount = useMemo(
    () =>
      requests.filter(
        (request) =>
          (request.status || "").toLowerCase() === "accepted" &&
          request.reference_code
      ).length,
    [requests]
  );

  const receivedCount = useMemo(
    () =>
      requests.filter((request) => {
        const matchingDonation = findMatchingDonationRecord(request, donationRecords);

        return Boolean(matchingDonation);
      }).length,
    [donationRecords, requests]
  );

  const allocatedCount = useMemo(
    () =>
      requests.filter((request) => {
        const matchingDonation = findMatchingDonationRecord(request, donationRecords);
        const donationStatus = String(matchingDonation?.donation_status || "").toLowerCase();

        return ["allocated", "used", "completed"].includes(donationStatus);
      }).length,
    [donationRecords, requests]
  );

  const formatDate = (value) => {
    if (!value) return "Awaiting approval";

    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        .du-root, .du-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        @keyframes du-spin { to { transform: rotate(360deg); } }
        .du-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #E6D6DD;
          border-top-color: #4A3F7A;
          border-radius: 50%;
          animation: du-spin 0.75s linear infinite;
          flex-shrink: 0;
        }
        .du-hero {
          background: linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(253,247,244,0.98) 55%, rgba(247,240,248,0.98) 100%);
          border: 1px solid #E8D7DD;
          box-shadow: 0 14px 34px rgba(94, 84, 142, 0.08);
        }
        .du-card {
          background: rgba(255,255,255,0.97);
          border: 1px solid #E6D5DC;
          box-shadow: 0 14px 34px rgba(94, 84, 142, 0.08);
        }
        .du-step-line {
          background: linear-gradient(180deg, #D8CCED 0%, #EFE5EA 100%);
        }
      `}</style>

      <div className="du-root min-h-screen bg-[#FFF9F5] p-5">
        <div className="du-hero rounded-[28px] px-5 py-5 md:px-6 md:py-6 mb-5">
          <div className="inline-flex items-center gap-1.5 mb-2 px-3 py-1.5 rounded-full bg-[#FAEFF3] border border-[#E8D7DD]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C9686B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#C9686B]">
              Cancer Support Fund
            </span>
          </div>

          <h1 className="text-[24px] md:text-[28px] font-bold text-[#2e2840] leading-tight">
            Donation Usage
          </h1>
          <p className="text-[12.5px] text-[#9A90A8] mt-1 leading-6 max-w-2xl">
            This sequence starts from the donation request approval stage. Once the admin accepts a request and generates the reference code, this first step is marked as completed.
          </p>
        </div>

        {!loading && !error && requests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
            <div className="du-card rounded-[24px] px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C9686B]">Total Requests</p>
              <p className="text-[28px] font-bold text-[#2e2840] mt-2">{requests.length}</p>
            </div>
            <div className="du-card rounded-[24px] px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C9686B]">Step Completed</p>
              <p className="text-[28px] font-bold text-emerald-600 mt-2">{acceptedCount}</p>
            </div>
            <div className="du-card rounded-[24px] px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C9686B]">At Collection Point</p>
              <p className="text-[28px] font-bold text-[#4A3F7A] mt-2">{receivedCount}</p>
            </div>
            <div className="du-card rounded-[24px] px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C9686B]">Allocated To Patient</p>
              <p className="text-[28px] font-bold text-purple-700 mt-2">{allocatedCount}</p>
            </div>
          </div>
        )}

        <div className="border-t border-[#E2CDD3] mb-5" />

        {loading && (
          <div className="flex items-center gap-3 text-[13px] font-medium text-[#4A3F7A]">
            <span className="du-spinner" />
            Loading donation usage sequence...
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-[#FDF0F1] border border-rose-200 border-l-4 border-l-[#D4737A] rounded-xl px-3.5 py-2.5 text-rose-700 text-[12.5px]">
            <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {!loading && !error && donationRecordsError && (
          <div className="flex items-start gap-2 bg-[#FDF4E7] border border-amber-200 border-l-4 border-l-amber-400 rounded-xl px-3.5 py-2.5 mb-4 text-amber-700 text-[12.5px]">
            <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {donationRecordsError}
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#F7EBF0] border border-[#E2CDD3] flex items-center justify-center text-[#C9686B]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <p className="text-[14px] font-bold text-[#2e2840]">No donation requests found</p>
            <p className="text-[12px] text-[#9A90A8]">The usage sequence will appear here once requests are created.</p>
          </div>
        )}

        {!loading && !error && requests.length > 0 && (
          <div className="grid gap-4">
            {requests.map((request, index) => {
              const status = (request.status || "pending").toLowerCase();
              const isAccepted = status === "accepted" && Boolean(request.reference_code);
              const matchedDonationRecord = findMatchingDonationRecord(request, donationRecords);
              const isReceivedAtCollectionPoint = Boolean(matchedDonationRecord);
              const donationStatus = String(matchedDonationRecord?.donation_status || "").toLowerCase();
              const isAllocatedToPatient = ["allocated", "used", "completed"].includes(donationStatus);
              const requestId = request._id || request.id || `request-${index + 1}`;

              return (
                <div key={requestId} className="du-card rounded-[28px] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#F0E5E8] bg-gradient-to-r from-[#FDF9F7] to-[#FCF4F7] flex items-center justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#C9686B]">Donation Request</p>
                      <p className="text-[13px] font-semibold text-[#2e2840] truncate">{requestId}</p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border ${
                        isAccepted
                          ? "bg-[#E8F5EF] text-emerald-700 border-emerald-200"
                          : "bg-[#FDF4E7] text-amber-700 border-amber-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isAccepted ? "bg-emerald-500" : "bg-amber-400"
                        }`}
                      />
                      {isAccepted ? "Accepted" : "Pending"}
                    </span>
                  </div>

                  <div className="px-4 py-4 md:px-5">
                    <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4 items-start">
                      <div className="pt-0.5 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4 items-start">
                          <div className="flex md:flex-col items-center md:items-center gap-3 md:gap-0">
                            <div
                              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isAccepted
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "bg-white border-[#D5C6DD] text-[#B8A9C4]"
                              }`}
                            >
                              {isAccepted ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              ) : (
                                <span className="block w-3 h-3 rounded-full border-2 border-current" />
                              )}
                            </div>
                            <div className="du-step-line hidden md:block w-[2px] h-16 rounded-full mt-2" />
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#C9686B]">
                              Step 1
                            </p>
                            <h2 className="text-[16px] font-bold text-[#2e2840] mt-1">
                              Donation request accepted
                            </h2>
                            <p className="text-[12.5px] text-[#8C819D] mt-1 leading-6">
                              This turns complete when the admin accepts the donation request and the reference code is generated.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                              <div className="rounded-2xl border border-[#F0E5E8] bg-[#FDFAF8] px-3.5 py-3">
                                <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#C9686B]">Reference Code</p>
                                <p className="text-[12.5px] font-semibold text-[#2e2840] mt-1">
                                  {request.reference_code || "Not generated yet"}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-[#F0E5E8] bg-[#FDFAF8] px-3.5 py-3">
                                <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#C9686B]">Accepted At</p>
                                <p className="text-[12.5px] font-semibold text-[#2e2840] mt-1">
                                  {formatDate(request.accepted_at)}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-[#F0E5E8] bg-[#FDFAF8] px-3.5 py-3">
                                <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#C9686B]">Current State</p>
                                <p className={`text-[12.5px] font-semibold mt-1 ${isAccepted ? "text-emerald-600" : "text-amber-600"}`}>
                                  {isAccepted ? "Step completed" : "Waiting for admin approval"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4 items-start">
                          <div className="flex md:flex-col items-center md:items-center gap-3 md:gap-0">
                            <div
                              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isReceivedAtCollectionPoint
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "bg-white border-[#D5C6DD] text-[#B8A9C4]"
                              }`}
                            >
                              {isReceivedAtCollectionPoint ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              ) : (
                                <span className="block w-3 h-3 rounded-full border-2 border-current" />
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#C9686B]">
                              Step 2
                            </p>
                            <h2 className="text-[16px] font-bold text-[#2e2840] mt-1">
                              Received at collection point
                            </h2>
                            <p className="text-[12.5px] text-[#8C819D] mt-1 leading-6">
                              This turns complete when a donation record is submitted using the generated reference code, confirming the donor handed over the items physically.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                              <div className="rounded-2xl border border-[#F0E5E8] bg-[#FDFAF8] px-3.5 py-3">
                                <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#C9686B]">Donation Status</p>
                                <p className="text-[12.5px] font-semibold text-[#2e2840] mt-1">
                                  {matchedDonationRecord?.donation_status || "Awaiting drop-off"}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-[#F0E5E8] bg-[#FDFAF8] px-3.5 py-3">
                                <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#C9686B]">Recorded Date</p>
                                <p className="text-[12.5px] font-semibold text-[#2e2840] mt-1">
                                  {formatDate(matchedDonationRecord?.received_date || matchedDonationRecord?.created_at)}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-[#F0E5E8] bg-[#FDFAF8] px-3.5 py-3">
                                <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#C9686B]">Current State</p>
                                <p className={`text-[12.5px] font-semibold mt-1 ${isReceivedAtCollectionPoint ? "text-emerald-600" : "text-amber-600"}`}>
                                  {isReceivedAtCollectionPoint ? "Items received physically" : "Waiting for collection point handover"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4 items-start">
                          <div className="flex md:flex-col items-center md:items-center gap-3 md:gap-0">
                            <div
                              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isAllocatedToPatient
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "bg-white border-[#D5C6DD] text-[#B8A9C4]"
                              }`}
                            >
                              {isAllocatedToPatient ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              ) : (
                                <span className="block w-3 h-3 rounded-full border-2 border-current" />
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#C9686B]">
                              Step 3
                            </p>
                            <h2 className="text-[16px] font-bold text-[#2e2840] mt-1">
                              Allocated to patient
                            </h2>
                            <p className="text-[12.5px] text-[#8C819D] mt-1 leading-6">
                              This turns complete when the donation is allocated to the patient after arriving at the collection point.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                              <div className="rounded-2xl border border-[#F0E5E8] bg-[#FDFAF8] px-3.5 py-3">
                                <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#C9686B]">Donation Status</p>
                                <p className="text-[12.5px] font-semibold text-[#2e2840] mt-1">
                                  {matchedDonationRecord?.donation_status || "Awaiting allocation"}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-[#F0E5E8] bg-[#FDFAF8] px-3.5 py-3">
                                <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#C9686B]">Allocation State</p>
                                <p className="text-[12.5px] font-semibold text-[#2e2840] mt-1">
                                  {isAllocatedToPatient ? "Allocated" : "Not allocated yet"}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-[#F0E5E8] bg-[#FDFAF8] px-3.5 py-3">
                                <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#C9686B]">Current State</p>
                                <p className={`text-[12.5px] font-semibold mt-1 ${isAllocatedToPatient ? "text-emerald-600" : "text-amber-600"}`}>
                                  {isAllocatedToPatient ? "Donation allocated to patient" : "Waiting for patient allocation"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default DonationUsageTracking;
