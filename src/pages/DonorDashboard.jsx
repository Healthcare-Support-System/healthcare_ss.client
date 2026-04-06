import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { privateApiClient } from "../api/apiClient";
import { END_POINTS } from "../api/endPoints";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "../routes/path";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "history", label: "Donation History" },
];

const emptyForm = {
  email: "",
  first_name: "",
  last_name: "",
  nic: "",
  phone: "",
  address: "",
};

const statusStyles = {
  pending: "bg-[#FDF5F7] text-[#B5838D]",
  approved: "bg-[#FDF5F7] text-[#5E548E]",
  rejected: "bg-[#FDF5F7] text-[#E5989B]",
};

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildFormFromProfile(profile) {
  return {
    email: profile?.email || "",
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    nic: profile?.nic || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
  };
}

function getDisplayStatus(status) {
  if (status === "accepted") {
    return "approved";
  }

  return status || "pending";
}

const ConfirmModal = ({
  title,
  message,
  confirmLabel,
  confirmClassName,
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-[#5E548E]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-[#B5838D]">{message}</p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="rounded-full border border-[#F0E5E8] px-5 py-2.5 text-sm font-semibold text-[#5E548E] transition hover:bg-[#FDF5F7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${confirmClassName}`}
          >
            {isProcessing ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const DonorDashboard = () => {
  const navigate = useNavigate();
  const { logout, setUser, user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [donationHistory, setDonationHistory] = useState([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [historyErrorMessage, setHistoryErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const syncProfileState = useCallback((nextProfile) => {
    setProfile(nextProfile);
    setFormData(buildFormFromProfile(nextProfile));

     if (nextProfile?.id) {
      localStorage.setItem("donorId", nextProfile.id);
    }

    if (nextProfile?.full_name) {
      localStorage.setItem("donorName", nextProfile.full_name);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { data } = await privateApiClient.get(END_POINTS.GET_DONOR_PROFILE);
      syncProfileState(data);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Unable to load your donor profile right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [syncProfileState]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fetchDonationHistory = useCallback(async () => {
    if (!profile?.id) {
      setDonationHistory([]);
      return;
    }

    setIsHistoryLoading(true);
    setHistoryErrorMessage("");

    try {
      const { data } = await privateApiClient.get(
        `${END_POINTS.GET_DONOR_DONATION_REQUESTS}/${profile.id}`,
      );

      setDonationHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      setHistoryErrorMessage(
        error?.response?.data?.message ||
          "Unable to load your donation history right now.",
      );
    } finally {
      setIsHistoryLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (activeTab === "history" && profile?.id) {
      fetchDonationHistory();
    }
  }, [activeTab, fetchDonationHistory, profile?.id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleEditStart = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setFormData(buildFormFromProfile(profile));
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setFormData(buildFormFromProfile(profile));
    setIsEditing(false);
    setShowUpdateConfirm(false);
  };

  const handleUpdateRequest = (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setShowUpdateConfirm(true);
  };

  const handleConfirmedUpdate = async () => {
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        email: formData.email.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        nic: formData.nic.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      };

      const { data } = await privateApiClient.put(
        END_POINTS.UPDATE_DONOR_PROFILE,
        payload,
      );

      const updatedProfile = data?.profile || data;
      syncProfileState(updatedProfile);
      setIsEditing(false);
      setShowUpdateConfirm(false);
      setSuccessMessage(data?.message || "Profile updated successfully.");

      if (user) {
        const nextUser = {
          ...user,
          email: updatedProfile?.email || user.email,
          first_name: updatedProfile?.first_name || user.first_name,
          last_name: updatedProfile?.last_name || user.last_name,
          full_name: updatedProfile?.full_name || user.full_name,
        };

        setUser(nextUser);
        localStorage.setItem("user", JSON.stringify(nextUser));
        localStorage.setItem("donorName", updatedProfile?.full_name || "");
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Unable to update your donor profile right now.",
      );
      setShowUpdateConfirm(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmedDelete = async () => {
    setIsDeleting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await privateApiClient.delete(END_POINTS.DELETE_DONOR_PROFILE);
      logout();
      navigate(ROUTES.SIGNIN, {
        replace: true,
        state: { message: "Your donor profile has been deleted." },
      });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Unable to delete your donor profile right now.",
      );
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#FFF9F5] px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[32px] border border-[#F0E5E8] bg-white shadow-[0_24px_80px_-40px_rgba(94,84,142,0.3)]">
            <div className="bg-gradient-to-r from-[#5E548E] to-[#4A4272] px-8 py-10 text-white">
              <p className="text-sm uppercase tracking-[0.35em] text-[#FDF5F7]">
                Donor Dashboard
              </p>
              <h1 className="mt-3 text-4xl font-bold">Welcome back</h1>
              <p className="mt-3 max-w-2xl text-sm text-[#FDF5F7] sm:text-base">
                Keep your donor account details up to date and review your
                contribution activity from one place.
              </p>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <div className="flex flex-wrap gap-3 border-b border-[#F0E5E8] pb-6">
                {tabs.map((tab) => {
                  const isActive = tab.id === activeTab;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? "bg-[#5E548E] text-white shadow-lg shadow-[#E8D9DE]"
                          : "bg-[#FDF5F7] text-[#5E548E] hover:bg-[#FEF0F3]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="py-8">
                {activeTab === "profile" && (
                  <section>
                    {isLoading && (
                      <div className="rounded-3xl border border-[#F0E5E8] bg-[#FDF5F7] p-8 text-[#5E548E]">
                        Loading your donor profile...
                      </div>
                    )}

                    {!isLoading && errorMessage && (
                      <div className="rounded-3xl border border-[#E8D9DE] bg-[#FDF5F7] p-8">
                        <p className="text-[#B5838D]">{errorMessage}</p>
                        {!profile && (
                          <button
                            type="button"
                            onClick={fetchProfile}
                            className="mt-4 rounded-full bg-[#5E548E] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#4A4272]"
                          >
                            Try again
                          </button>
                        )}
                      </div>
                    )}

                    {!isLoading && successMessage && (
                      <div className="mb-6 rounded-3xl border border-[#E8D9DE] bg-[#FDF5F7] p-5 text-[#5E548E]">
                        {successMessage}
                      </div>
                    )}

                    {!isLoading && profile && (
                      <div className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h2 className="text-2xl font-bold text-[#5E548E]">
                              Profile details
                            </h2>
                            <p className="mt-1 text-sm text-[#B5838D]">
                              Review your account information or update it when
                              something changes.
                            </p>
                          </div>

                          {!isEditing ? (
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={handleEditStart}
                                className="rounded-full bg-[#5E548E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A4272]"
                              >
                                Update profile
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSuccessMessage("");
                                  setErrorMessage("");
                                  setShowDeleteConfirm(true);
                                }}
                                className="rounded-full border border-[#F0E5E8] bg-white px-5 py-2.5 text-sm font-semibold text-[#E5989B] transition hover:bg-[#FDF5F7]"
                              >
                                Delete profile
                              </button>
                            </div>
                          ) : (
                            <div className="rounded-full bg-[#FDF5F7] px-4 py-2 text-sm font-semibold text-[#B5838D]">
                              Editing mode
                            </div>
                          )}
                        </div>

                        {!isEditing ? (
                          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            <article className="rounded-3xl border border-[#F0E5E8] bg-gradient-to-br from-white to-[#FFF9F5] p-6 shadow-sm">
                              <p className="text-sm font-medium uppercase tracking-wide text-[#B5838D]">
                                Full name
                              </p>
                              <p className="mt-3 break-words text-lg font-semibold text-[#5E548E]">
                                {profile.full_name || "Not available"}
                              </p>
                            </article>
                            <article className="rounded-3xl border border-[#F0E5E8] bg-gradient-to-br from-white to-[#FFF9F5] p-6 shadow-sm">
                              <p className="text-sm font-medium uppercase tracking-wide text-[#B5838D]">
                                Email
                              </p>
                              <p className="mt-3 break-words text-lg font-semibold text-[#5E548E]">
                                {profile.email || "Not available"}
                              </p>
                            </article>
                            <article className="rounded-3xl border border-[#F0E5E8] bg-gradient-to-br from-white to-[#FFF9F5] p-6 shadow-sm">
                              <p className="text-sm font-medium uppercase tracking-wide text-[#B5838D]">
                                NIC
                              </p>
                              <p className="mt-3 break-words text-lg font-semibold text-[#5E548E]">
                                {profile.nic || "Not available"}
                              </p>
                            </article>
                            <article className="rounded-3xl border border-[#F0E5E8] bg-gradient-to-br from-white to-[#FFF9F5] p-6 shadow-sm">
                              <p className="text-sm font-medium uppercase tracking-wide text-[#B5838D]">
                                Phone number
                              </p>
                              <p className="mt-3 break-words text-lg font-semibold text-[#5E548E]">
                                {profile.phone || "Not available"}
                              </p>
                            </article>
                            <article className="rounded-3xl border border-[#F0E5E8] bg-gradient-to-br from-white to-[#FFF9F5] p-6 shadow-sm">
                              <p className="text-sm font-medium uppercase tracking-wide text-[#B5838D]">
                                Address
                              </p>
                              <p className="mt-3 break-words text-lg font-semibold text-[#5E548E]">
                                {profile.address || "Not available"}
                              </p>
                            </article>
                            <article className="rounded-3xl border border-[#F0E5E8] bg-gradient-to-br from-white to-[#FFF9F5] p-6 shadow-sm">
                              <p className="text-sm font-medium uppercase tracking-wide text-[#B5838D]">
                                Member since
                              </p>
                              <p className="mt-3 break-words text-lg font-semibold text-[#5E548E]">
                                {formatDate(profile.created_at)}
                              </p>
                            </article>
                          </div>
                        ) : (
                          <form
                            onSubmit={handleUpdateRequest}
                            className="grid gap-5 rounded-[28px] border border-[#F0E5E8] bg-[#FDF5F7] p-6 md:grid-cols-2"
                          >
                            <label className="block">
                              <span className="mb-2 block text-sm font-semibold text-[#5E548E]">
                                First name
                              </span>
                              <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                className="w-full rounded-2xl border border-[#F0E5E8] bg-white px-4 py-3 text-[#5E548E] outline-none transition focus:border-[#E5989B]"
                              />
                            </label>

                            <label className="block">
                              <span className="mb-2 block text-sm font-semibold text-[#5E548E]">
                                Last name
                              </span>
                              <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                className="w-full rounded-2xl border border-[#F0E5E8] bg-white px-4 py-3 text-[#5E548E] outline-none transition focus:border-[#E5989B]"
                              />
                            </label>

                            <label className="block">
                              <span className="mb-2 block text-sm font-semibold text-[#5E548E]">
                                Email
                              </span>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full rounded-2xl border border-[#F0E5E8] bg-white px-4 py-3 text-[#5E548E] outline-none transition focus:border-[#E5989B]"
                              />
                            </label>

                            <label className="block">
                              <span className="mb-2 block text-sm font-semibold text-[#5E548E]">
                                NIC
                              </span>
                              <input
                                type="text"
                                name="nic"
                                value={formData.nic}
                                onChange={handleInputChange}
                                className="w-full rounded-2xl border border-[#F0E5E8] bg-white px-4 py-3 text-[#5E548E] outline-none transition focus:border-[#E5989B]"
                              />
                            </label>

                            <label className="block">
                              <span className="mb-2 block text-sm font-semibold text-[#5E548E]">
                                Phone number
                              </span>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="0771234567"
                                className="w-full rounded-2xl border border-[#F0E5E8] bg-white px-4 py-3 text-[#5E548E] outline-none transition focus:border-[#E5989B]"
                              />
                            </label>

                            <label className="block md:col-span-2">
                              <span className="mb-2 block text-sm font-semibold text-[#5E548E]">
                                Address
                              </span>
                              <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full rounded-2xl border border-[#F0E5E8] bg-white px-4 py-3 text-[#5E548E] outline-none transition focus:border-[#E5989B]"
                              />
                            </label>

                            <div className="flex flex-wrap gap-3 md:col-span-2">
                              <button
                                type="submit"
                                className="rounded-full bg-[#5E548E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A4272]"
                              >
                                Save changes
                              </button>
                              <button
                                type="button"
                                onClick={handleEditCancel}
                                className="rounded-full border border-[#F0E5E8] bg-white px-5 py-2.5 text-sm font-semibold text-[#5E548E] transition hover:bg-[#FDF5F7]"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </section>
                )}

                {activeTab === "history" && (
                  <section className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-2xl font-bold text-[#5E548E]">
                          Donation history
                        </h2>
                        <p className="mt-1 text-sm text-[#B5838D]">
                          Track every donation request you have submitted. New
                          requests start as pending and show as approved once an
                          admin accepts them.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={fetchDonationHistory}
                        className="rounded-full border border-[#F0E5E8] bg-white px-5 py-2.5 text-sm font-semibold text-[#5E548E] transition hover:bg-[#FDF5F7]"
                      >
                        Refresh history
                      </button>
                    </div>

                    {isHistoryLoading && (
                      <div className="rounded-3xl border border-[#F0E5E8] bg-[#FDF5F7] p-8 text-[#5E548E]">
                        Loading your donation history...
                      </div>
                    )}

                    {!isHistoryLoading && historyErrorMessage && (
                      <div className="rounded-3xl border border-[#E8D9DE] bg-[#FDF5F7] p-8">
                        <p className="text-[#B5838D]">{historyErrorMessage}</p>
                      </div>
                    )}

                    {!isHistoryLoading &&
                      !historyErrorMessage &&
                      donationHistory.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-[#E8D9DE] bg-[#FDF5F7] p-8 text-center">
                          <p className="text-lg font-semibold text-[#5E548E]">
                            No donations tracked yet
                          </p>
                          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#B5838D] sm:text-base">
                            When you submit a donation request, it will appear
                            here with its current review status.
                          </p>
                        </div>
                      )}

                    {!isHistoryLoading &&
                      !historyErrorMessage &&
                      donationHistory.length > 0 && (
                        <div className="grid gap-5">
                          {donationHistory.map((entry) => {
                            const displayStatus = getDisplayStatus(entry?.status);
                            const badgeClassName =
                              statusStyles[displayStatus] ||
                              "bg-slate-100 text-slate-700";
                            const entryId =
                              entry?._id || `${entry?.request_id}-${entry?.created_at}`;
                            const isExpanded = expandedHistoryId === entryId;

                            return (
                              <article
                                key={entryId}
                                className="rounded-[28px] border border-[#F0E5E8] bg-white p-6 shadow-sm"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div>
                                    <p className="text-sm font-medium uppercase tracking-wide text-[#B5838D]">
                                      Support request
                                    </p>
                                    <h3 className="mt-2 text-xl font-bold text-[#5E548E]">
                                      {entry?.request_id?.request_type ||
                                        entry?.request_id?.title ||
                                        entry?.request_id?._id ||
                                        entry?.request_id ||
                                        "Request record"}
                                    </h3>
                                  </div>

                                  <span
                                    className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${badgeClassName}`}
                                  >
                                    {displayStatus}
                                  </span>
                                </div>

                                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                  <div>
                                    <p className="text-sm font-medium text-[#B5838D]">
                                      Submitted on
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-[#5E548E]">
                                      {formatDate(entry?.created_at)}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium text-[#B5838D]">
                                      Reference code
                                    </p>
                                    <p className="mt-1 break-words text-base font-semibold text-[#5E548E]">
                                      {entry?.reference_code || "Pending assignment"}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium text-[#B5838D]">
                                      Reviewed at
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-[#5E548E]">
                                      {formatDate(entry?.accepted_at)}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedHistoryId(
                                      isExpanded ? null : entryId,
                                    )
                                  }
                                  className="mt-5 text-sm font-semibold text-[#5E548E] transition hover:text-[#E5989B]"
                                >
                                  {isExpanded ? "Hide" : "View Message"}
                                </button>

                                {isExpanded && (
                                  <div className="mt-4 rounded-3xl bg-[#FDF5F7] p-4">
                                    <p className="text-sm font-medium text-[#B5838D]">
                                      Your message
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-[#5E548E]">
                                      {entry?.message || "No message was added to this donation request."}
                                    </p>
                                  </div>
                                )}
                              </article>
                            );
                          })}
                        </div>
                      )}
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showUpdateConfirm && (
        <ConfirmModal
          title="Save profile changes?"
          message="Your donor profile will be updated with the values currently entered in the form."
          confirmLabel="Confirm update"
          confirmClassName="bg-[#5E548E] hover:bg-[#4A4272]"
          onConfirm={handleConfirmedUpdate}
          onCancel={() => setShowUpdateConfirm(false)}
          isProcessing={isSaving}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete donor profile?"
          message="This will permanently remove your donor profile and account. You will be signed out immediately after deletion."
          confirmLabel="Delete permanently"
          confirmClassName="bg-[#E5989B] hover:bg-[#B5838D]"
          onConfirm={handleConfirmedDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isProcessing={isDeleting}
        />
      )}
    </>
  );
};

export default DonorDashboard;
