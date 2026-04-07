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
  return date.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", ...options });
};

const getItemId = (item) => item?._id || item?.id;

const getLatestDate = (items = [], keys = []) => {
  const timestamps = items
    .map((item) => { const foundKey = keys.find((key) => item?.[key]); return foundKey ? new Date(item[foundKey]).getTime() : null; })
    .filter((value) => typeof value === "number" && !Number.isNaN(value));
  if (!timestamps.length) return null;
  return new Date(Math.max(...timestamps));
};

/* ── Status styles using new palette ── */
const statusStyles = {
  pending:   "bg-[#FDF4E7] text-amber-700 border-amber-200",
  verified:  "bg-[#E8F5EF] text-emerald-700 border-emerald-200",
  rejected:  "bg-[#FDF0F1] text-rose-600 border-rose-200",
  accepted:  "bg-[#E8F5EF] text-emerald-700 border-emerald-200",
  received:  "bg-[#F0EBF8] text-[#5a5070] border-[#D4B8C0]",
  allocated: "bg-[#EDE9F8] text-[#4A3F7A] border-[#C9686B]/30",
  used:      "bg-[#FDF0F4] text-[#D4737A] border-[#D4B8C0]",
  completed: "bg-[#E8F5EF] text-emerald-700 border-emerald-200",
  open:      "bg-[#EBF4FD] text-sky-700 border-sky-200",
};

const getStatusClassName = (status) =>
  statusStyles[(status || "").toLowerCase()] || "bg-[#F7EBF0] text-[#5a5070] border-[#E2CDD3]";

/* ── Icons ── */
const IconPulse = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconInbox = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3H10l-2-3H2"/>
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
  </svg>
);
const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IconRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);
const IconArrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ────────────────────────────────────────
   Sub-components
──────────────────────────────────────── */

const MetricCard = ({ title, value, helper, icon, accentClass, loading }) => (
  <div className="bg-white border border-[#E2CDD3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentClass}`}>
        {icon}
      </div>
      <span className="text-[9.5px] font-bold uppercase tracking-[0.13em] text-[#C9686B] bg-[#FDF4F5] border border-[#E2CDD3] px-2.5 py-1 rounded-full">
        {title}
      </span>
    </div>
    <p className="text-[32px] font-bold leading-none text-[#2e2840] mb-2">
      {loading ? (
        <span className="inline-block w-10 h-8 bg-[#F7EBF0] rounded-lg animate-pulse" />
      ) : value}
    </p>
    <p className="text-[12px] leading-relaxed text-[#9A90A8]">{helper}</p>
  </div>
);

const SectionHeader = ({ icon, title, subtitle, action }) => (
  <div className="flex items-start justify-between px-6 py-5 border-b border-[#F7EBF0]">
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-[#F0EBF8] flex items-center justify-center text-[#5a5070] flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <h2 className="text-[15px] font-bold text-[#2e2840] leading-tight">{title}</h2>
        <p className="text-[12px] text-[#9A90A8] mt-0.5">{subtitle}</p>
      </div>
    </div>
    {action && (
      <div className="flex-shrink-0 ml-4">{action}</div>
    )}
  </div>
);

const ViewAllLink = ({ to, label }) => (
  <Link to={to}
    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#5a5070]
      hover:text-[#4A3F7A] transition-colors duration-150 group">
    {label}
    <span className="group-hover:translate-x-0.5 transition-transform duration-150">
      <IconArrow />
    </span>
  </Link>
);

const SectionCard = ({ title, subtitle, action, icon, children }) => (
  <section className="bg-white border border-[#E2CDD3] rounded-2xl shadow-sm overflow-hidden">
    <SectionHeader icon={icon} title={title} subtitle={subtitle} action={action} />
    <div className="px-6 py-5">{children}</div>
  </section>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-10 gap-2">
    <div className="w-10 h-10 rounded-xl bg-[#FDF4F5] border border-[#E2CDD3] flex items-center justify-center text-[#C9686B] opacity-60">
      <IconHeart />
    </div>
    <p className="text-[12.5px] text-[#9A90A8]">{message}</p>
  </div>
);

const LoadingPulse = ({ rows = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-16 bg-[#F7EBF0] rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.2 }} />
    ))}
  </div>
);

const ListItem = ({ title, subtitle, meta, badge }) => (
  <div className="flex items-start justify-between gap-4 px-4 py-3.5 bg-[#FDFAF8] border border-[#F0E5E8] rounded-xl hover:border-[#E2CDD3] transition-colors duration-150">
    <div className="min-w-0 flex-1">
      <p className="text-[13px] font-semibold text-[#2e2840] truncate">{title}</p>
      <p className="text-[11.5px] text-[#9A90A8] mt-0.5 line-clamp-2 leading-relaxed">{subtitle}</p>
      {meta && <p className="text-[11px] text-[#C9686B]/70 mt-1.5">{meta}</p>}
    </div>
    {badge && <div className="flex-shrink-0">{badge}</div>}
  </div>
);

const OverviewTile = ({ label, value, hint, loading }) => (
  <div className="bg-[#FDFAF8] border border-[#F0E5E8] rounded-xl px-4 py-4">
    <p className="text-[9.5px] font-bold uppercase tracking-[0.13em] text-[#C9686B]">{label}</p>
    <p className="mt-2 text-[26px] font-bold leading-none text-[#2e2840]">
      {loading ? <span className="inline-block w-10 h-7 bg-[#F0E5E8] rounded-lg animate-pulse" /> : value}
    </p>
    <p className="mt-2 text-[11.5px] leading-relaxed text-[#9A90A8]">{hint}</p>
  </div>
);

/* ════════════════════════════════════════
   Main Component
════════════════════════════════════════ */
const AdminHome = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    patients: [], donations: [], donationRequests: [], supportRequests: [],
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
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        }),
        axios.get(`${API_BASE_URL}/api/donation-requests`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        }),
        axios.get(`${API_BASE_URL}/api/support-requests/all`),
      ]);

      const [patientsResult, donationsResult, donationRequestsResult, supportRequestsResult] = requests;

      const nextData = {
        patients: patientsResult.status === "fulfilled" ? patientsResult.value?.data?.patients || [] : [],
        donations: donationsResult.status === "fulfilled" ? donationsResult.value?.data?.data || [] : [],
        donationRequests: donationRequestsResult.status === "fulfilled" ? donationRequestsResult.value?.data?.data || donationRequestsResult.value?.data || [] : [],
        supportRequests: supportRequestsResult.status === "fulfilled" ? supportRequestsResult.value?.data?.data || [] : [],
      };

      setDashboardData(nextData);

      const failures = requests.filter((result) => result.status === "rejected");
      if (failures.length === requests.length) setError("Failed to load dashboard data.");
      else if (failures.length > 0) setError("Some dashboard sections could not be loaded.");

      setLastUpdated(new Date());
    } catch (fetchError) {
      console.error("Error fetching admin dashboard data:", fetchError);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const metrics = useMemo(() => {
    const { patients, donations, donationRequests, supportRequests } = dashboardData;
    return {
      totalPatients: patients.length,
      verifiedPatients: patients.filter((p) => p.verification_status === "verified").length,
      pendingPatients: patients.filter((p) => p.verification_status === "pending").length,
      totalDonations: donations.length,
      completedDonations: donations.filter((d) => d.donation_status === "completed").length,
      pendingDonationRequests: donationRequests.filter((r) => r.status === "pending").length,
      activeSupportRequests: supportRequests.filter((r) => { const s = (r.status || "").toLowerCase(); return !s || s === "pending" || s === "open"; }).length,
    };
  }, [dashboardData]);

  const recentPatients         = useMemo(() => [...dashboardData.patients].sort((a, b) => new Date(b.created_at || b.updated_at || 0) - new Date(a.created_at || a.updated_at || 0)).slice(0, 5), [dashboardData.patients]);
  const recentSupportRequests  = useMemo(() => [...dashboardData.supportRequests].sort((a, b) => new Date(b.created_at || b.updated_at || 0) - new Date(a.created_at || a.updated_at || 0)).slice(0, 5), [dashboardData.supportRequests]);
  const donationQueue          = useMemo(() => [...dashboardData.donationRequests].sort((a, b) => new Date(b.created_at || b.updated_at || 0) - new Date(a.created_at || a.updated_at || 0)).slice(0, 5), [dashboardData.donationRequests]);

  const patientReviewSummary = useMemo(() => [
    { label: "Verified Profiles",    value: metrics.verifiedPatients,       hint: "Reviewed and verified records."     },
    { label: "Pending Review",        value: metrics.pendingPatients,         hint: "Records awaiting review."           },
    { label: "Completed Donations",   value: metrics.completedDonations,      hint: "Donations marked completed."        },
    { label: "Open Support Cases",    value: metrics.activeSupportRequests,   hint: "Currently active support requests." },
  ], [metrics]);

  const donationStatusSummary = useMemo(() => {
    const counts = dashboardData.donations.reduce(
      (s, d) => { const k = d.donation_status || "received"; s[k] = (s[k] || 0) + 1; return s; },
      { received: 0, allocated: 0, used: 0, completed: 0 }
    );
    return [
      { label: "Received",  value: counts.received,  tone: "received"  },
      { label: "Allocated", value: counts.allocated, tone: "allocated" },
      { label: "Used",      value: counts.used,      tone: "used"      },
      { label: "Completed", value: counts.completed, tone: "completed" },
    ];
  }, [dashboardData.donations]);

  const activityDate = useMemo(() =>
    getLatestDate([...dashboardData.patients, ...dashboardData.donations, ...dashboardData.donationRequests, ...dashboardData.supportRequests],
      ["updated_at", "created_at", "received_date"]),
    [dashboardData]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .admin-home-root, .admin-home-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.10s; }
        .fade-up-3 { animation-delay: 0.15s; }
        .fade-up-4 { animation-delay: 0.20s; }
      `}</style>

      <div className="admin-home-root bg-[#FFF9F5] min-h-screen space-y-5 p-5">

        {/* ── Hero Banner ── */}
        <div className="fade-up relative overflow-hidden rounded-2xl bg-[#4A3F7A] px-6 py-6 text-white shadow-lg">
          {/* decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-6 right-24 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <IconHeart />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                  සුව සවිය · Cancer Support Fund
                </span>
              </div>
              <h1 className="text-[22px] font-bold leading-tight">
                Welcome back{user?.name ? `, ${user.name}` : ""}
              </h1>
              <p className="text-[12.5px] text-white/60 mt-1">
                Here's what's happening across the system today.
              </p>
            </div>

            {/* Info chips */}
            <div className="flex flex-wrap gap-2.5">
              <div className="flex flex-col gap-0.5 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <span className="text-[9.5px] uppercase tracking-[0.13em] text-white/55 font-bold">Last Refresh</span>
                <span className="text-[12.5px] font-semibold text-white">
                  {lastUpdated ? formatDate(lastUpdated, { hour: "2-digit", minute: "2-digit" }) : "—"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <span className="text-[9.5px] uppercase tracking-[0.13em] text-white/55 font-bold">Latest Activity</span>
                <span className="text-[12.5px] font-semibold text-white">
                  {activityDate ? formatDate(activityDate) : "No recent activity"}
                </span>
              </div>
              <button
                type="button"
                onClick={fetchDashboardData}
                className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5
                  text-[12.5px] font-semibold text-white hover:bg-white/20 transition-all duration-150 active:scale-95"
              >
                <IconRefresh />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500
            rounded-xl px-4 py-3 text-amber-800 text-[12.5px]">
            <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* ── Metric Cards ── */}
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Patients",
              value: metrics.totalPatients,
              helper: `${metrics.verifiedPatients} verified · ${metrics.pendingPatients} pending review`,
              icon: <IconUsers />,
              accentClass: "bg-[#EDE9F8] text-[#4A3F7A]",
            },
            {
              title: "Support Requests",
              value: metrics.activeSupportRequests,
              helper: "Open and pending cases needing attention",
              icon: <IconPulse />,
              accentClass: "bg-[#EBF4FD] text-sky-700",
            },
            {
              title: "Donation Requests",
              value: metrics.pendingDonationRequests,
              helper: "Pending donor responses awaiting action",
              icon: <IconInbox />,
              accentClass: "bg-[#FDF4E7] text-amber-700",
            },
            {
              title: "Donations",
              value: metrics.totalDonations,
              helper: `${metrics.completedDonations} marked completed`,
              icon: <IconHeart />,
              accentClass: "bg-[#E8F5EF] text-emerald-700",
            },
          ].map((card, i) => (
            <div key={card.title} className={`fade-up fade-up-${i + 1}`}>
              <MetricCard {...card} loading={loading} />
            </div>
          ))}
        </div>

        {/* ── Recent Patients + Support Requests ── */}
        <div className="grid gap-5 xl:grid-cols-2 fade-up fade-up-2">
          <SectionCard
            title="Recent Patients"
            subtitle="Latest patient records added to the system"
            icon={<IconUsers />}
            action={isAdmin ? <ViewAllLink to={ROUTES.ALL_PATIENTS} label="View all" /> : null}
          >
            {loading ? <LoadingPulse rows={4} /> : recentPatients.length === 0
              ? <EmptyState message="No patient records available yet." />
              : (
                <div className="space-y-2.5">
                  {recentPatients.map((patient) => (
                    <ListItem
                      key={getItemId(patient)}
                      title={patient.full_name || "Unnamed patient"}
                      subtitle={patient.medical_condition || "Medical condition not provided."}
                      meta={`Created ${formatDate(patient.created_at || patient.updated_at)}`}
                      badge={
                        <span className={`text-[11px] font-semibold border px-2.5 py-0.5 rounded-full capitalize ${getStatusClassName(patient.verification_status)}`}>
                          {patient.verification_status || "pending"}
                        </span>
                      }
                    />
                  ))}
                </div>
              )}
          </SectionCard>

          <SectionCard
            title="Support Request Watchlist"
            subtitle="Latest support activity across all requests"
            icon={<IconPulse />}
          >
            {loading ? <LoadingPulse rows={4} /> : recentSupportRequests.length === 0
              ? <EmptyState message="No support requests found." />
              : (
                <div className="space-y-2.5">
                  {recentSupportRequests.map((request) => (
                    <ListItem
                      key={getItemId(request)}
                      title={request.request_type || "Support request"}
                      subtitle={request.description || "No description available."}
                      meta={`Urgency: ${request.urgency_level || "N/A"} · Needed: ${formatDate(request.needed_date)} · Created: ${formatDate(request.created_at)}`}
                      badge={
                        <span className={`text-[11px] font-semibold border px-2.5 py-0.5 rounded-full capitalize ${getStatusClassName(request.status || "open")}`}>
                          {request.status || "open"}
                        </span>
                      }
                    />
                  ))}
                </div>
              )}
          </SectionCard>
        </div>

        {/* ── Operational Overview + Donation Queue ── */}
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr] fade-up fade-up-3">

          {/* Operational Overview */}
          <SectionCard
            title="Operational Overview"
            subtitle="Key metrics requiring attention across patient and donation workflows"
            icon={<IconHeart />}
          >
            {/* Overview tiles */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {patientReviewSummary.map((item) => (
                <OverviewTile key={item.label} loading={loading} {...item} />
              ))}
            </div>

            {/* Donation Lifecycle sub-section */}
            <div className="border border-[#E2CDD3] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5 bg-[#F7EBF0] border-b border-[#E2CDD3]">
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.13em] text-[#C9686B]">Donation Lifecycle</p>
                  <h3 className="text-[14px] font-bold text-[#2e2840] mt-0.5">Status Breakdown</h3>
                </div>
                {isAdmin && (
                  <ViewAllLink to={ROUTES.DONATIONS} label="Open donations" />
                )}
              </div>
              <div className="grid grid-cols-4 divide-x divide-[#F0E5E8] bg-white">
                {donationStatusSummary.map((item) => (
                  <div key={item.label} className="flex flex-col items-center py-5 px-3 gap-2">
                    <span className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-full capitalize ${getStatusClassName(item.tone)}`}>
                      {item.label}
                    </span>
                    <p className="text-[26px] font-bold text-[#2e2840] leading-none">
                      {loading ? <span className="inline-block w-8 h-6 bg-[#F0E5E8] rounded-lg animate-pulse" /> : item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Donation Queue */}
          <SectionCard
            title="Donation Request Queue"
            subtitle="Most recent donor requests pending review"
            icon={<IconInbox />}
            action={isAdmin ? <ViewAllLink to={ROUTES.MANAGE_DONATION_REQUESTS} label="Full queue" /> : null}
          >
            {loading ? <LoadingPulse rows={4} /> : donationQueue.length === 0
              ? <EmptyState message="No donation requests in the queue." />
              : (
                <div className="space-y-2.5">
                  {donationQueue.map((request) => (
                    <ListItem
                      key={getItemId(request)}
                      title={`Request #${String(getItemId(request)).slice(-6)}`}
                      subtitle={request.message || "No message provided by donor."}
                      meta={`Ref: ${request.reference_code || "Not generated"} · ${formatDate(request.created_at)}`}
                      badge={
                        <span className={`text-[11px] font-semibold border px-2.5 py-0.5 rounded-full capitalize ${getStatusClassName(request.status)}`}>
                          {request.status || "pending"}
                        </span>
                      }
                    />
                  ))}
                </div>
              )}
          </SectionCard>
        </div>

      </div>
    </>
  );
};

export default AdminHome;