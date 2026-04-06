import { useMemo, useState, useRef } from "react";
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
      <p className="text-sm mt-1 text-[#B5838D]">{validationErrors[field]}</p>
    ) : null;

  const renderPatientCard = (patient) => (
    <div
      key={patient.id}
      className="rounded-2xl border border-[#F0E5E8] bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-[#5E548E]">
            {patient.full_name || "N/A"}
          </h4>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-[#B5838D]">Birthdate</p>
              <p className="text-[#5E548E]">
                {patient.dob ? patient.dob.split("T")[0] : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#B5838D]">Gender</p>
              <p className="text-[#5E548E]">{patient.gender || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#B5838D]">
                Contact Number
              </p>
              <p className="text-[#5E548E]">{patient.contact_no || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#B5838D]">
                Guardian Name
              </p>
              <p className="text-[#5E548E]">{patient.guardian_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#B5838D]">
                Guardian Contact
              </p>
              <p className="text-[#5E548E]">
                {patient.guardian_contact || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#B5838D]">
                Verification Status
              </p>
              <p className="capitalize text-[#5E548E]">
                {patient.verification_status || "pending"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-[#B5838D]">Address</p>
            <p className="text-[#5E548E]">{patient.address || "N/A"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-[#B5838D]">
              Medical Condition
            </p>
            <p className="text-[#5E548E]">
              {patient.medical_condition || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-[#B5838D] mb-2">
              Verification Document (GN Certificate)
            </p>
            {patient.verification_documents?.length > 0 ? (
              <div className="space-y-1">
                {patient.verification_documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-[#E5989B] underline"
                  >
                    View Document {index + 1}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-[#5E548E]">No documents uploaded</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 self-start">
          <button
            onClick={() => openEditModal(patient)}
            className="rounded-lg bg-[#E5989B] px-4 py-2 text-white transition hover:opacity-90"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(patient.id)}
            disabled={isDeleting}
            className="rounded-lg bg-[#B5838D] px-4 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const renderSection = (title, patientsList, emptyText) => (
    <section className="rounded-2xl bg-[#FFF9F5] p-5 shadow-sm border border-[#F0E5E8]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#5E548E]">{title}</h3>
        <span className="rounded-full bg-[#FDF5F7] px-3 py-1 text-sm font-medium text-[#B5838D]">
          {patientsList.length}
        </span>
      </div>

      {patientsList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#F0E5E8] bg-white p-6 text-center text-[#B5838D]">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-4">{patientsList.map(renderPatientCard)}</div>
      )}
    </section>
  );

  if (isLoading) {
    return <div className="p-6 text-[#5E548E]">Loading patients...</div>;
  }

  if (isError) {
    return <div className="p-6 text-[#B5838D]">Failed to load patients.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-[#5E548E]">
          All Patient Details
        </h2>
        <button
          onClick={openAddModal}
          className="rounded-lg bg-[#5E548E] px-4 py-2 text-white transition hover:opacity-90"
        >
          Add Patient
        </button>
      </div>

      <div className="space-y-6">
        {renderSection(
          "To be Verified Patients (Pending)",
          groupedPatients.pending,
          "No pending patients found.",
        )}

        {renderSection(
          "Verified Patients",
          groupedPatients.verified,
          "No verified patients found.",
        )}

        {renderSection(
          "Rejected Patients",
          groupedPatients.rejected,
          "No rejected patients found.",
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-[#5E548E]">
              {isEditMode ? "Edit Patient" : "Add Patient"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#F0E5E8] p-3 outline-none focus:border-[#E5989B]"
                  required
                />
                {renderFieldError("full_name")}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <input
                    type={formData.dob ? "date" : "text"}
                    name="dob"
                    placeholder="Birthdate"
                    value={formData.dob}
                    onFocus={(e) => {
                      if (!formData.dob) e.target.type = "date";
                    }}
                    onBlur={(e) => {
                      if (!formData.dob) e.target.type = "text";
                    }}
                    onChange={handleChange}
                    max={today}
                    className="w-full rounded-lg border border-[#F0E5E8] p-3 outline-none focus:border-[#E5989B]"
                    required
                  />
                  {renderFieldError("dob")}
                </div>

                <div>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[#F0E5E8] p-3 outline-none focus:border-[#E5989B]"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {renderFieldError("gender")}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#F0E5E8] p-3 outline-none focus:border-[#E5989B]"
                  required
                />
                {renderFieldError("address")}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <input
                    type="text"
                    name="contact_no"
                    placeholder="Contact Number"
                    value={formData.contact_no}
                    onChange={handleChange}
                    maxLength={10}
                    className="w-full rounded-lg border border-[#F0E5E8] p-3 outline-none focus:border-[#E5989B]"
                    required
                  />
                  {renderFieldError("contact_no")}
                </div>

                <div>
                  <input
                    type="text"
                    name="guardian_name"
                    placeholder="Guardian Name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[#F0E5E8] p-3 outline-none focus:border-[#E5989B]"
                    required
                  />
                  {renderFieldError("guardian_name")}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="guardian_contact"
                  placeholder="Guardian Contact"
                  value={formData.guardian_contact}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full rounded-lg border border-[#F0E5E8] p-3 outline-none focus:border-[#E5989B]"
                  required
                />
                {renderFieldError("guardian_contact")}
              </div>

              <div>
                <textarea
                  name="medical_condition"
                  placeholder="Medical Condition"
                  value={formData.medical_condition}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#F0E5E8] p-3 outline-none focus:border-[#E5989B]"
                  rows="3"
                  required
                />
                {renderFieldError("medical_condition")}
              </div>

              <div>
                <select
                  name="verification_status"
                  value={formData.verification_status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#F0E5E8] p-3 outline-none focus:border-[#E5989B]"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium text-[#5E548E]">
                  Upload Verification Document (GN Certificate)
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  //   multiple
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="w-full rounded-lg border border-[#F0E5E8] p-3 text-[#5E548E]"
                />

                {isEditMode && existingDocuments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {existingDocuments.map((doc, index) => {
                      const fileName = doc.split("/").pop();

                      return (
                        <div
                          key={`${fileName}-${index}`}
                          className="flex items-center justify-between rounded-lg border border-[#F0E5E8] bg-[#FFF9F5] px-3 py-2"
                        >
                          <a
                            href={doc}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-[#5E548E] underline"
                          >
                            {fileName}
                          </a>

                          <button
                            type="button"
                            onClick={() => handleRemoveExistingDocument(index)}
                            className="rounded-md bg-[#B5838D] px-3 py-1 text-sm text-white"
                          >
                            Delete
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-lg border border-[#F0E5E8] bg-[#FFF9F5] px-3 py-2"
                      >
                        <span className="text-sm text-[#5E548E]">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedFile(index)}
                          className="rounded-md bg-[#B5838D] px-3 py-1 text-sm text-white"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errorMessage && (
                <p className="text-sm text-[#B5838D]">{errorMessage}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-[#F0E5E8] px-4 py-2 text-[#5E548E]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isAdding || isUpdating}
                  className="rounded-lg bg-[#5E548E] px-4 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
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
