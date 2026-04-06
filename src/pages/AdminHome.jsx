import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { privateApiClient } from "../api/apiClient";
import { END_POINTS } from "../api/endPoints";
import { ROUTES } from "../routes/path";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = "http://localhost:8000";

const formatDate = (value, options = {}) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  });
};

const getItemId = (item) => item?._id || item?.id;

const getLatestDate = (items = [], keys = []) => {
  const timestamps = items
    .map((item) => {
      const foundKey = keys.find((key) => item?.[key]);
      return foundKey ? new Date(item[foundKey]).getTime() : null;
    })
    .filter((value) => typeof value === "number" && !Number.isNaN(value));

  if (!timestamps.length) return null;
  return new Date(Math.max(...timestamps));
};

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  received: "bg-slate-100 text-slate-700 border-slate-200",
  allocated: "bg-violet-50 text-violet-700 border-violet-200",
  used: "bg-pink-50 text-pink-700 border-pink-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  open: "bg-sky-50 text-sky-700 border-sky-200",
};

const getStatusClassName = (status) =>
  statusStyles[(status || "").toLowerCase()] ||
  "bg-slate-100 text-slate-700 border-slate-200";

const MetricCard = ({ title, value, helper, accentClass }) => (
  <div className="rounded-2xl border border-[#F0E5E8] bg-white p-5 shadow-sm">
    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#B5838D]">
      {title}
    </p>
    <p className={`mt-3 text-3xl font-bold ${accentClass}`}>{value}</p>
    <p className="mt-2 text-sm text-slate-500">{helper}</p>
  </div>
);

const SectionCard = ({ title, subtitle, action, children }) => (
  <section className="rounded-3xl border border-[#F0E5E8] bg-white shadow-sm">
    <div className="flex flex-col gap-3 border-b border-[#F7ECEF] px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-lg font-bold text-[#5E548E]">{title}</h2>
        <p className="text-sm text-[#8A7F98]">{subtitle}</p>
      </div>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </section>
);

const EmptyState = ({ message }) => (
  <div className="rounded-2xl border border-dashed border-[#E8D9DE] bg-[#FFF9F5] px-4 py-8 text-center text-sm text-[#8A7F98]">
    {message}
  </div>
);

const AdminHome = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    patients: [],
    donations: [],
    donationRequests: [],
    supportRequests: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const isAdmin = user?.role === "admin";

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const requests = await Promise.allSettled([
        privateApiClient.get(END_POINTS.GET_PATIENTS),
        axios.get(`${API_BASE_URL}${END_POINTS.GET_ALL_DONATIONS}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }),
        axios.get(`${API_BASE_URL}/api/donation-requests`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }),
        axios.get(`${API_BASE_URL}/api/support-requests/all`),
      ]);

      const [patientsResult, donationsResult, donationRequestsResult, supportRequestsResult] =
        requests;

      const nextData = {
        patients:
          patientsResult.status === "fulfilled"
            ? patientsResult.value?.data?.patients || []
            : [],
        donations:
          donationsResult.status === "fulfilled"
            ? donationsResult.value?.data?.data || []
            : [],
        donationRequests:
          donationRequestsResult.status === "fulfilled"
            ? donationRequestsResult.value?.data?.data ||
              donationRequestsResult.value?.data ||
              []
            : [],
        supportRequests:
          supportRequestsResult.status === "fulfilled"
            ? supportRequestsResult.value?.data?.data || []
            : [],
      };

      setDashboardData(nextData);

      const failures = requests.filter((result) => result.status === "rejected");
      if (failures.length === requests.length) {
        setError("Failed to load dashboard data.");
      } else if (failures.length > 0) {
        setError("Some dashboard sections could not be loaded.");
      }

      setLastUpdated(new Date());
    } catch (fetchError) {
      console.error("Error fetching admin dashboard data:", fetchError);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const metrics = useMemo(() => {
    const { patients, donations, donationRequests, supportRequests } =
      dashboardData;

    const verifiedPatients = patients.filter(
      (patient) => patient.verification_status === "verified",
    ).length;
    const pendingPatients = patients.filter(
      (patient) => patient.verification_status === "pending",
    ).length;
    const pendingDonationRequests = donationRequests.filter(
      (request) => request.status === "pending",
    ).length;
    const activeSupportRequests = supportRequests.filter((request) => {
      const normalizedStatus = (request.status || "").toLowerCase();
      return !normalizedStatus || normalizedStatus === "pending" || normalizedStatus === "open";
    }).length;
    const completedDonations = donations.filter(
      (donation) => donation.donation_status === "completed",
    ).length;

    return {
      totalPatients: patients.length,
      verifiedPatients,
      pendingPatients,
      totalDonations: donations.length,
      completedDonations,
      pendingDonationRequests,
      activeSupportRequests,
    };
  }, [dashboardData]);

  const recentPatients = useMemo(
    () =>
      [...dashboardData.patients]
        .sort(
          (a, b) =>
            new Date(b.created_at || b.updated_at || 0) -
            new Date(a.created_at || a.updated_at || 0),
        )
        .slice(0, 5),
    [dashboardData.patients],
  );

  const recentSupportRequests = useMemo(
    () =>
      [...dashboardData.supportRequests]
        .sort(
          (a, b) =>
            new Date(b.created_at || b.updated_at || 0) -
            new Date(a.created_at || a.updated_at || 0),
        )
        .slice(0, 5),
    [dashboardData.supportRequests],
  );

  const donationQueue = useMemo(
    () =>
      [...dashboardData.donationRequests]
        .sort(
          (a, b) =>
            new Date(b.created_at || b.updated_at || 0) -
            new Date(a.created_at || a.updated_at || 0),
        )
        .slice(0, 5),
    [dashboardData.donationRequests],
  );

  const activityDate = useMemo(
    () =>
      getLatestDate(
        [
          ...dashboardData.patients,
          ...dashboardData.donations,
          ...dashboardData.donationRequests,
          ...dashboardData.supportRequests,
        ],
        ["updated_at", "created_at", "received_date"],
      ),
    [dashboardData],
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .admin-home-root, .admin-home-root * {
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }
      `}</style>

      <div className="admin-home-root space-y-6 bg-[#FFF9F5] text-slate-800">
        <section className="overflow-hidden rounded-[28px] border border-[#F0E5E8] bg-gradient-to-br from-[#5E548E] via-[#6D5FA9] to-[#B5838D] p-6 text-white shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">
                Admin Command Center
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight">
                Welcome back{user?.name ? `, ${user.name}` : ""}.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">
                This dashboard gives you a live view of patients, donations,
                support requests, and pending actions across the system.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/70">
                  Last refresh
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {lastUpdated
                    ? formatDate(lastUpdated, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Waiting for data"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/70">
                  Latest activity
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {activityDate ? formatDate(activityDate) : "No recent activity"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {isAdmin && (
              <>
                {/* <Link
                  to={ROUTES.ALL_PATIENTS}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#5E548E] transition hover:bg-[#FFF1F4]"
                >
                  Manage patients
                </Link> */}
                {/* <Link
                  to={ROUTES.DONATIONS}
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Review donations
                </Link> */}
                {/* <Link
                  to={ROUTES.MANAGE_DONATION_REQUESTS}
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Donation request queue
                </Link> */}
              </>
            )}

            {/* {!isAdmin && (
              <Link
                to={ROUTES.MAKE_REQUEST}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#5E548E] transition hover:bg-[#FFF1F4]"
              >
                Create support request
              </Link>
            )} */}

            {/* <button
              type="button"
              onClick={fetchDashboardData}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Refresh dashboard
            </button> */}
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Patients"
            value={loading ? "..." : metrics.totalPatients}
            helper={`${metrics.verifiedPatients} verified, ${metrics.pendingPatients} pending review`}
            accentClass="text-[#5E548E]"
          />
          <MetricCard
            title="Support Requests"
            value={loading ? "..." : metrics.activeSupportRequests}
            helper="Open and pending requests needing attention"
            accentClass="text-sky-700"
          />
          <MetricCard
            title="Donation Requests"
            value={loading ? "..." : metrics.pendingDonationRequests}
            helper="Pending donor responses awaiting admin action"
            accentClass="text-amber-700"
          />
          <MetricCard
            title="Donations"
            value={loading ? "..." : metrics.totalDonations}
            helper={`${metrics.completedDonations} marked completed`}
            accentClass="text-emerald-700"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr,0.95fr]">
          <SectionCard
            title="Recent Patients"
            subtitle="Latest patient records and verification status"
            action={
              isAdmin ? (
                <Link
                  to={ROUTES.ALL_PATIENTS}
                  className="text-sm font-semibold text-[#5E548E] hover:text-[#B5838D]"
                >
                  View all patients
                </Link>
              ) : null
            }
          >
            {loading ? (
              <p className="text-sm text-slate-500">Loading patients...</p>
            ) : recentPatients.length === 0 ? (
              <EmptyState message="No patient records are available yet." />
            ) : (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div
                    key={getItemId(patient)}
                    className="flex flex-col gap-3 rounded-2xl border border-[#F7ECEF] bg-[#FFFCFB] px-4 py-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {patient.full_name || "Unnamed patient"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {patient.medical_condition || "Medical condition not provided"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span
                        className={`rounded-full border px-3 py-1 font-medium capitalize ${getStatusClassName(patient.verification_status)}`}
                      >
                        {patient.verification_status || "pending"}
                      </span>
                      <span className="text-slate-500">
                        {formatDate(patient.created_at || patient.updated_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Quick Actions"
            subtitle="Jump straight into the most common admin tasks"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {isAdmin && (
                <>
                  <Link
                    to={ROUTES.ALL_PATIENTS}
                    className="rounded-2xl border border-[#F0E5E8] bg-[#FFF9F5] px-4 py-4 transition hover:border-[#D8C2C9] hover:bg-white"
                  >
                    <p className="font-semibold text-[#5E548E]">Patients</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Add, edit, and verify patient records.
                    </p>
                  </Link>
                  <Link
                    to={ROUTES.DONATIONS}
                    className="rounded-2xl border border-[#F0E5E8] bg-[#FFF9F5] px-4 py-4 transition hover:border-[#D8C2C9] hover:bg-white"
                  >
                    <p className="font-semibold text-[#5E548E]">Donations</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Track donations and update their lifecycle.
                    </p>
                  </Link>
                  <Link
                    to={ROUTES.RECEIVED_DONATION}
                    className="rounded-2xl border border-[#F0E5E8] bg-[#FFF9F5] px-4 py-4 transition hover:border-[#D8C2C9] hover:bg-white"
                  >
                    <p className="font-semibold text-[#5E548E]">Record Donation</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Add newly received contributions into the system.
                    </p>
                  </Link>
                  <Link
                    to={ROUTES.MANAGE_DONATION_REQUESTS}
                    className="rounded-2xl border border-[#F0E5E8] bg-[#FFF9F5] px-4 py-4 transition hover:border-[#D8C2C9] hover:bg-white"
                  >
                    <p className="font-semibold text-[#5E548E]">Request Queue</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Accept or reject donation requests from donors.
                    </p>
                  </Link>
                </>
              )}

              {!isAdmin && (
                <Link
                  to={ROUTES.MAKE_REQUEST}
                  className="rounded-2xl border border-[#F0E5E8] bg-[#FFF9F5] px-4 py-4 transition hover:border-[#D8C2C9] hover:bg-white"
                >
                  <p className="font-semibold text-[#5E548E]">New Support Request</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Submit a new request for patient support.
                  </p>
                </Link>
              )}
            </div>
          </SectionCard>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <SectionCard
            title="Support Request Watchlist"
            subtitle="Newest support requests across the system"
          >
            {loading ? (
              <p className="text-sm text-slate-500">Loading support requests...</p>
            ) : recentSupportRequests.length === 0 ? (
              <EmptyState message="No support requests found." />
            ) : (
              <div className="space-y-4">
                {recentSupportRequests.map((request) => (
                  <div
                    key={getItemId(request)}
                    className="rounded-2xl border border-[#F7ECEF] bg-[#FFFCFB] px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {request.request_type || "Support request"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {request.description || "No description available."}
                        </p>
                      </div>
                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-sm font-medium capitalize ${getStatusClassName(request.status || "open")}`}
                      >
                        {request.status || "open"}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      <span>Urgency: {request.urgency_level || "N/A"}</span>
                      <span>Needed: {formatDate(request.needed_date)}</span>
                      <span>Created: {formatDate(request.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Donation Request Queue"
            subtitle="Recent donor requests and their current status"
            action={
              isAdmin ? (
                <Link
                  to={ROUTES.MANAGE_DONATION_REQUESTS}
                  className="text-sm font-semibold text-[#5E548E] hover:text-[#B5838D]"
                >
                  Open full queue
                </Link>
              ) : null
            }
          >
            {loading ? (
              <p className="text-sm text-slate-500">Loading donation requests...</p>
            ) : donationQueue.length === 0 ? (
              <EmptyState message="No donation requests are in the queue." />
            ) : (
              <div className="space-y-4">
                {donationQueue.map((request) => (
                  <div
                    key={getItemId(request)}
                    className="rounded-2xl border border-[#F7ECEF] bg-[#FFFCFB] px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">
                          Request #{String(getItemId(request)).slice(-6)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {request.message || "No message provided by donor."}
                        </p>
                      </div>
                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-sm font-medium capitalize ${getStatusClassName(request.status)}`}
                      >
                        {request.status || "pending"}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      <span>
                        Ref: {request.reference_code || "Not generated yet"}
                      </span>
                      <span>Created: {formatDate(request.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </section>
      </div>
    </>
  );
};

export default AdminHome;
