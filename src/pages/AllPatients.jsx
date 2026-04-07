import { useMemo, useState, useRef, useEffect } from "react";
import {
  useAddPatient,
  useDeletePatient,
  useFetchPatients,
  useUpdatePatient,
} from "../hooks/usePatientApi";

const initialFormState = {
  full_name: "",
  dob: "",
  gender: "",
  address: "",
  contact_no: "",
  guardian_name: "",
  guardian_contact: "",
  medical_condition: "",
  verification_status: "pending",
  replace_documents: false,
};

const initialValidationErrors = {
  full_name: "",
  dob: "",
  gender: "",
  address: "",
  contact_no: "",
  guardian_name: "",
  guardian_contact: "",
  medical_condition: "",
};

const nameRegex = /^[A-Za-z ]*$/;
// eslint-disable-next-line
const addressRegex = /^[A-Za-z0-9\s,./#&()\-]*$/;
const onlyDigitsRegex = /^\d*$/;

const statusStyles = {
  pending: {
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
    cardBorder: "border-amber-100",
    glow: "from-amber-50 to-white",
  },
  verified: {
    badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    cardBorder: "border-emerald-100",
    glow: "from-emerald-50 to-white",
  },
  rejected: {
    badge: "bg-rose-100 text-rose-700 border border-rose-200",
    cardBorder: "border-rose-100",
    glow: "from-rose-50 to-white",
  },
};

const inputClassName =
  "w-full rounded-xl border border-[#E7DDE3] bg-white px-4 py-3 text-[13px] text-[#4B426F] shadow-sm outline-none transition-all duration-200 placeholder:text-[#B7A9B0] focus:border-[#C9A9B2] focus:ring-4 focus:ring-[#F6EBEE]";

const AllPatients = () => {
  const fileInputRef = useRef(null);

  const { data: patients = [], isLoading, isError } = useFetchPatients();
  const { mutate: addPatient, isPending: isAdding } = useAddPatient();
  const { mutate: updatePatient, isPending: isUpdating } = useUpdatePatient();
  const { mutate: deletePatient, isPending: isDeleting } = useDeletePatient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState(
    initialValidationErrors,
  );
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const existingLink = document.querySelector(
      'link[href*="fonts.googleapis.com/css2?family=DM+Sans"]',
    );

    if (!existingLink) {
      const link = document.createElement("link");
      link.href =
        "https://fonts.googleapis.com/css2?family=DM+Sans:300;400;500;600;700&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, []);

  const isEditMode = useMemo(() => !!editingPatient, [editingPatient]);
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const groupedPatients = useMemo(() => {
    const safePatients = Array.isArray(patients) ? patients : [];

    const sortPatients = (list) =>
      [...list].sort((a, b) =>
        (a.full_name || "").localeCompare(b.full_name || ""),
      );

    return {
      pending: sortPatients(
        safePatients.filter(
          (patient) => (patient.verification_status || "pending") === "pending",
        ),
      ),
      verified: sortPatients(
        safePatients.filter(
          (patient) => patient.verification_status === "verified",
        ),
      ),
      rejected: sortPatients(
        safePatients.filter(
          (patient) => patient.verification_status === "rejected",
        ),
      ),
    };
  }, [patients]);

  const totalPatients =
    groupedPatients.pending.length +
    groupedPatients.verified.length +
    groupedPatients.rejected.length;

  const openAddModal = () => {
    setEditingPatient(null);
    setFormData(initialFormState);
    setSelectedFiles([]);
    setExistingDocuments([]);
    setErrorMessage("");
    setValidationErrors(initialValidationErrors);
    setIsModalOpen(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openEditModal = (patient) => {
    setEditingPatient(patient);
    setFormData({
      full_name: patient.full_name || "",
      dob: patient.dob ? patient.dob.split("T")[0] : "",
      gender: patient.gender || "",
      address: patient.address || "",
      contact_no: patient.contact_no || "",
      guardian_name: patient.guardian_name || "",
      guardian_contact: patient.guardian_contact || "",
      medical_condition: patient.medical_condition || "",
      verification_status: patient.verification_status || "pending",
      replace_documents: false,
    });
    setSelectedFiles([]);
    setExistingDocuments(patient.verification_documents || []);
    setErrorMessage("");
    setValidationErrors(initialValidationErrors);
    setIsModalOpen(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
    setFormData(initialFormState);
    setSelectedFiles([]);
    setExistingDocuments([]);
    setErrorMessage("");
    setValidationErrors(initialValidationErrors);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "full_name":
        if (!value.trim()) return "Full Name is required.";
        if (!nameRegex.test(value))
          return "Full Name should contain letters only.";
        return "";

      case "dob":
        if (!value) return "Birthdate is required.";
        if (value > today) return "Birthdate cannot be a future date.";
        return "";

      case "gender":
        if (!value) return "Gender is required.";
        return "";

      case "address":
        if (!value.trim()) return "Address is required.";
        if (!addressRegex.test(value)) {
          return "Address can contain letters, numbers, spaces, commas, and common address symbols.";
        }
        return "";

      case "contact_no":
        if (!value.trim()) return "Contact Number is required.";
        if (!/^\d{10}$/.test(value))
          return "Contact Number must be exactly 10 digits.";
        return "";

      case "guardian_name":
        if (!value.trim()) return "Guardian Name is required.";
        if (!nameRegex.test(value)) {
          return "Guardian Name should contain letters only.";
        }
        return "";

      case "guardian_contact":
        if (!value.trim()) return "Guardian Contact is required.";
        if (!/^\d{10}$/.test(value)) {
          return "Guardian Contact must be exactly 10 digits.";
        }
        return "";

      case "medical_condition":
        if (!value.trim()) return "Medical Condition is required.";
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const errors = {
      full_name: validateField("full_name", formData.full_name),
      dob: validateField("dob", formData.dob),
      gender: validateField("gender", formData.gender),
      address: validateField("address", formData.address),
      contact_no: validateField("contact_no", formData.contact_no),
      guardian_name: validateField("guardian_name", formData.guardian_name),
      guardian_contact: validateField(
        "guardian_contact",
        formData.guardian_contact,
      ),
      medical_condition: validateField(
        "medical_condition",
        formData.medical_condition,
      ),
    };

    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    let nextValue = value;

    if (name === "full_name" || name === "guardian_name") {
      if (!nameRegex.test(value)) return;
    }

    if (name === "contact_no" || name === "guardian_contact") {
      if (!onlyDigitsRegex.test(value)) return;
      nextValue = value.slice(0, 10);
    }

    if (name === "address") {
      if (!addressRegex.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    setValidationErrors((prev) => ({
      ...prev,
      [name]: validateField(name, nextValue),
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    setErrorMessage("");
    setSelectedFiles(files);
  };

  const handleRemoveSelectedFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove,
    );

    setSelectedFiles(updatedFiles);

    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveExistingDocument = (indexToRemove) => {
    setExistingDocuments((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );

    setFormData((prev) => ({
      ...prev,
      replace_documents: true,
    }));
  };

  const buildMultipartData = () => {
    const payload = new FormData();

    payload.append("full_name", formData.full_name.trim());
    payload.append("dob", formData.dob);
    payload.append("gender", formData.gender);
    payload.append("address", formData.address.trim());
    payload.append("contact_no", formData.contact_no);
    payload.append("guardian_name", formData.guardian_name.trim());
    payload.append("guardian_contact", formData.guardian_contact);
    payload.append("medical_condition", formData.medical_condition.trim());
    payload.append("verification_status", formData.verification_status);

    if (isEditMode) {
      payload.append("replace_documents", formData.replace_documents);

      existingDocuments.forEach((doc) => {
        payload.append("existing_verification_documents", doc);
      });
    }

    selectedFiles.forEach((file) => {
      payload.append("verification_documents", file);
    });

    return payload;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      setErrorMessage("Please correct the highlighted fields.");
      return;
    }

    const totalDocuments = isEditMode
      ? existingDocuments.length + selectedFiles.length
      : selectedFiles.length;

    if (totalDocuments !== 0 && totalDocuments > 1) {
      setErrorMessage("Please Attached Only one Document");
      return;
    }

    const payload = buildMultipartData();

    if (isEditMode) {
      updatePatient(
        { id: editingPatient.id, formData: payload },
        {
          onSuccess: () => {
            closeModal();
          },
          onError: (error) => {
            setErrorMessage(
              error?.response?.data?.message || "Failed to update patient.",
            );
          },
        },
      );
    } else {
      addPatient(payload, {
        onSuccess: () => {
          closeModal();
        },
        onError: (error) => {
          setErrorMessage(
            error?.response?.data?.message || "Failed to add patient.",
          );
        },
      });
    }
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient record?",
    );

    if (!confirmed) return;

    deletePatient(id, {
      onError: (error) => {
        alert(error?.response?.data?.message || "Failed to delete patient.");
      },
    });
  };

  const renderFieldError = (field) =>
    validationErrors[field] ? (
      <p className="mt-2 text-[12px] font-medium text-rose-500">
        {validationErrors[field]}
      </p>
    ) : null;

  const renderStatsCard = (title, value, toneClass, filterKey) => {
    const isActive = activeFilter === filterKey;

    return (
      <button
        type="button"
        onClick={() => setActiveFilter(filterKey)}
        className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${toneClass} ${
          isActive ? "ring-2 ring-[#5E548E] ring-offset-2" : ""
        }`}
      >
        <p className="text-[12px] font-medium text-[#9A8C98]">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-[#5E548E]">{value}</h3>
      </button>
    );
  };

  const renderPatientCard = (patient) => {
    const status = patient.verification_status || "pending";
    const currentStatusStyle = statusStyles[status] || statusStyles.pending;

    return (
      <div
        key={patient.id}
        className={`overflow-hidden rounded-3xl border ${currentStatusStyle.cardBorder} bg-gradient-to-br ${currentStatusStyle.glow} shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
      >
        <div className="border-b border-white/70 bg-white/70 px-5 py-4 backdrop-blur-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-[#4B426F]">
                {patient.full_name || "N/A"}
              </h4>
              <p className="mt-1 text-[12px] text-[#9A8C98]">
                Patient information overview
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${currentStatusStyle.badge}`}
              >
                {patient.verification_status || "pending"}
              </span>

              <button
                onClick={() => openEditModal(patient)}
                className="rounded-xl bg-[#E5989B] px-4 py-2 text-[13px] font-medium text-white transition hover:scale-[1.02] hover:opacity-95"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(patient.id)}
                disabled={isDeleting}
                className="rounded-xl bg-[#B5838D] px-4 py-2 text-[13px] font-medium text-white transition hover:scale-[1.02] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#B5838D]">
                Birthdate
              </p>
              <p className="mt-1 text-[13px] font-medium text-[#5E548E]">
                {patient.dob ? patient.dob.split("T")[0] : "N/A"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#B5838D]">
                Gender
              </p>
              <p className="mt-1 text-[13px] font-medium text-[#5E548E]">
                {patient.gender || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#B5838D]">
                Contact Number
              </p>
              <p className="mt-1 text-[13px] font-medium text-[#5E548E]">
                {patient.contact_no || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#B5838D]">
                Guardian Name
              </p>
              <p className="mt-1 text-[13px] font-medium text-[#5E548E]">
                {patient.guardian_name || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#B5838D]">
                Guardian Contact
              </p>
              <p className="mt-1 text-[13px] font-medium text-[#5E548E]">
                {patient.guardian_contact || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#B5838D]">
                Verification Status
              </p>
              <p className="mt-1 text-[13px] font-medium capitalize text-[#5E548E]">
                {patient.verification_status || "pending"}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#B5838D]">
                Address
              </p>
              <p className="mt-1 text-[13px] leading-6 text-[#5E548E]">
                {patient.address || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#B5838D]">
                Medical Condition
              </p>
              <p className="mt-1 text-[13px] leading-6 text-[#5E548E]">
                {patient.medical_condition || "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white/80 p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#B5838D]">
              Verification Document (GN Certificate)
            </p>

            {patient.verification_documents?.length > 0 ? (
              <div className="mt-3 flex flex-col gap-2">
                {patient.verification_documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit rounded-lg bg-[#FDF1F3] px-3 py-2 text-[13px] font-medium text-[#D97786] transition hover:bg-[#FBE4E8]"
                  >
                    View Document {index + 1}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[13px] text-[#8A7D88]">
                No documents uploaded
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (title, patientsList, emptyText, status) => {
    const currentStatusStyle = statusStyles[status] || statusStyles.pending;

    return (
      <section className="overflow-hidden rounded-3xl border border-[#EDE3E7] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#F4ECEF] bg-[#FFFCFD] px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#5E548E]">{title}</h3>
            <p className="mt-1 text-[12px] text-[#9A8C98]">
              Easily review and manage patient records
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-[12px] font-semibold ${currentStatusStyle.badge}`}
          >
            {patientsList.length} Patients
          </span>
        </div>

        <div className="p-5">
          {patientsList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E8DDE2] bg-[#FFF9FB] px-6 py-10 text-center">
              <p className="text-[13px] font-medium text-[#B5838D]">
                {emptyText}
              </p>
            </div>
          ) : (
            <div className="space-y-5">{patientsList.map(renderPatientCard)}</div>
          )}
        </div>
      </section>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCF8FA] p-6 font-[DM_Sans]">
        <div className="rounded-3xl border border-[#EDE3E7] bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-[#5E548E]">
            Loading patients...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#FCF8FA] p-6 font-[DM_Sans]">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-rose-600">
            Failed to load patients.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF8FA] p-4 font-[DM_Sans] md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-r from-[#5E548E] via-[#7B6EA8] to-[#B5838D] p-[1px] shadow-lg">
          <div className="rounded-[27px] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,249,245,0.95))] px-6 py-6 md:px-8 md:py-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-2 inline-flex rounded-full bg-[#F8EEF1] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#B5838D]">
                  Patient Dashboard
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-[#5E548E]">
                  All Patient Details
                </h2>
                <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#8E8190]">
                  Manage, verify, and review all patient records from one clear
                  dashboard.
                </p>
              </div>

              <button
                onClick={openAddModal}
                className="rounded-2xl bg-[#5E548E] px-5 py-3 text-[13px] font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#534a81]"
              >
                + Add Patient
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {renderStatsCard(
                "Total Patients",
                totalPatients,
                "border-[#E9E1E7]",
                "all",
              )}
              {renderStatsCard(
                "To be Verified Patients",
                groupedPatients.pending.length,
                "border-amber-100",
                "pending",
              )}
              {renderStatsCard(
                "Verified Patients",
                groupedPatients.verified.length,
                "border-emerald-100",
                "verified",
              )}
              {renderStatsCard(
                "Rejected Patients",
                groupedPatients.rejected.length,
                "border-rose-100",
                "rejected",
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[13px] font-medium text-[#7C7285]">Showing:</p>
          <span className="rounded-full bg-[#F8EEF1] px-4 py-2 text-[13px] font-semibold capitalize text-[#5E548E]">
            {activeFilter === "all" ? "All Patients" : `${activeFilter} Patients`}
          </span>

          {activeFilter !== "all" && (
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="rounded-full border border-[#E7DDE3] bg-white px-4 py-2 text-[13px] font-medium text-[#5E548E] transition hover:bg-[#FAF6F8]"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="space-y-8">
          {(activeFilter === "all" || activeFilter === "pending") &&
            renderSection(
              "To be Verified Patients (Pending)",
              groupedPatients.pending,
              "No pending patients found.",
              "pending",
            )}

          {(activeFilter === "all" || activeFilter === "verified") &&
            renderSection(
              "Verified Patients",
              groupedPatients.verified,
              "No verified patients found.",
              "verified",
            )}

          {(activeFilter === "all" || activeFilter === "rejected") &&
            renderSection(
              "Rejected Patients",
              groupedPatients.rejected,
              "No rejected patients found.",
              "rejected",
            )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2347]/45 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/60 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-[#F2E9EC] bg-white/95 px-6 py-5 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-[#5E548E]">
                    {isEditMode ? "Edit Patient" : "Add Patient"}
                  </h3>
                  <p className="mt-1 text-[12px] text-[#9A8C98]">
                    Enter patient details carefully and clearly
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full bg-[#F8F1F4] px-4 py-2 text-[13px] font-medium text-[#7C6F82] transition hover:bg-[#F2E7EB]"
                >
                  Close
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-[13px] font-semibold text-[#5E548E]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Enter full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                  />
                  {renderFieldError("full_name")}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-[#5E548E]">
                    Birthdate
                  </label>
                  <input
                    type={formData.dob ? "date" : "text"}
                    name="dob"
                    placeholder="Select birthdate"
                    value={formData.dob}
                    onFocus={(e) => {
                      if (!formData.dob) e.target.type = "date";
                    }}
                    onBlur={(e) => {
                      if (!formData.dob) e.target.type = "text";
                    }}
                    onChange={handleChange}
                    max={today}
                    className={inputClassName}
                    required
                  />
                  {renderFieldError("dob")}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-[#5E548E]">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {renderFieldError("gender")}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-[13px] font-semibold text-[#5E548E]">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                  />
                  {renderFieldError("address")}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-[#5E548E]">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contact_no"
                    placeholder="Enter contact number"
                    value={formData.contact_no}
                    onChange={handleChange}
                    maxLength={10}
                    className={inputClassName}
                    required
                  />
                  {renderFieldError("contact_no")}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-[#5E548E]">
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    name="guardian_name"
                    placeholder="Enter guardian name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                  />
                  {renderFieldError("guardian_name")}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-[#5E548E]">
                    Guardian Contact
                  </label>
                  <input
                    type="text"
                    name="guardian_contact"
                    placeholder="Enter guardian contact"
                    value={formData.guardian_contact}
                    onChange={handleChange}
                    maxLength={10}
                    className={inputClassName}
                    required
                  />
                  {renderFieldError("guardian_contact")}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-[#5E548E]">
                    Verification Status
                  </label>
                  <select
                    name="verification_status"
                    value={formData.verification_status}
                    onChange={handleChange}
                    className={inputClassName}
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-[13px] font-semibold text-[#5E548E]">
                    Medical Condition
                  </label>
                  <textarea
                    name="medical_condition"
                    placeholder="Enter medical condition"
                    value={formData.medical_condition}
                    onChange={handleChange}
                    className={`${inputClassName} min-h-[120px] resize-none`}
                    rows="3"
                    required
                  />
                  {renderFieldError("medical_condition")}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-[13px] font-semibold text-[#5E548E]">
                    Upload Verification Document (GN Certificate)
                  </label>

                  <div className="rounded-2xl border border-dashed border-[#D8CAD1] bg-[#FFFBFC] p-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                      className="w-full rounded-xl border border-[#E7DDE3] bg-white p-3 text-[13px] text-[#5E548E]"
                    />
                    <p className="mt-2 text-[11px] text-[#9A8C98]">
                      Only one PDF document can be attached.
                    </p>
                  </div>

                  {isEditMode && existingDocuments.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {existingDocuments.map((doc, index) => {
                        const fileName = doc.split("/").pop();

                        return (
                          <div
                            key={`${fileName}-${index}`}
                            className="flex flex-col gap-3 rounded-2xl border border-[#EFE3E7] bg-[#FFF9FB] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <a
                              href={doc}
                              target="_blank"
                              rel="noreferrer"
                              className="break-all text-[13px] font-medium text-[#5E548E] underline"
                            >
                              {fileName}
                            </a>

                            <button
                              type="button"
                              onClick={() => handleRemoveExistingDocument(index)}
                              className="rounded-xl bg-[#B5838D] px-4 py-2 text-[13px] font-medium text-white transition hover:opacity-90"
                            >
                              Delete
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex flex-col gap-3 rounded-2xl border border-[#EFE3E7] bg-[#FFF9FB] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="break-all text-[13px] font-medium text-[#5E548E]">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSelectedFile(index)}
                            className="rounded-xl bg-[#B5838D] px-4 py-2 text-[13px] font-medium text-white transition hover:opacity-90"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <p className="text-[12px] font-medium text-rose-600">
                    {errorMessage}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-[#F2E9EC] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-[#E7DDE3] bg-white px-5 py-3 text-[13px] font-medium text-[#5E548E] transition hover:bg-[#FAF6F8]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isAdding || isUpdating}
                  className="rounded-xl bg-[#5E548E] px-5 py-3 text-[13px] font-medium text-white shadow-md transition hover:bg-[#534a81] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isEditMode
                    ? isUpdating
                      ? "Updating..."
                      : "Update Patient"
                    : isAdding
                      ? "Adding..."
                      : "Add Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPatients;