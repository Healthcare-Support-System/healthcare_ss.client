import { useMemo, useState } from "react";
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

const AllPatients = () => {
  const { data: patients = [], isLoading, isError } = useFetchPatients();
  const { mutate: addPatient, isPending: isAdding } = useAddPatient();
  const { mutate: updatePatient, isPending: isUpdating } = useUpdatePatient();
  const { mutate: deletePatient, isPending: isDeleting } = useDeletePatient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");

  const isEditMode = useMemo(() => !!editingPatient, [editingPatient]);

  const openAddModal = () => {
    setEditingPatient(null);
    setFormData(initialFormState);
    setSelectedFiles([]);
    setErrorMessage("");
    setIsModalOpen(true);
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
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
    setFormData(initialFormState);
    setSelectedFiles([]);
    setErrorMessage("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files || []));
  };

  const buildMultipartData = () => {
    const payload = new FormData();

    payload.append("full_name", formData.full_name);
    payload.append("dob", formData.dob);
    payload.append("gender", formData.gender);
    payload.append("address", formData.address);
    payload.append("contact_no", formData.contact_no);
    payload.append("guardian_name", formData.guardian_name);
    payload.append("guardian_contact", formData.guardian_contact);
    payload.append("medical_condition", formData.medical_condition);
    payload.append("verification_status", formData.verification_status);

    if (isEditMode) {
      payload.append("replace_documents", formData.replace_documents);
    }

    selectedFiles.forEach((file) => {
      payload.append("verification_documents", file);
    });

    return payload;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

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

  if (isLoading) {
    return <div className="p-6">Loading patients...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load patients.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-purple-800">All Patient Details</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Add Patient
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-purple-100">
            <tr>
              <th className="text-left p-3">Full Name</th>
              <th className="text-left p-3">Gender</th>
              <th className="text-left p-3">Contact</th>
              <th className="text-left p-3">Guardian</th>
              <th className="text-left p-3">Condition</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Documents</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  No patients found.
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id} className="border-t">
                  <td className="p-3">{patient.full_name}</td>
                  <td className="p-3">{patient.gender || "N/A"}</td>
                  <td className="p-3">{patient.contact_no || "N/A"}</td>
                  <td className="p-3">{patient.guardian_name || "N/A"}</td>
                  <td className="p-3">{patient.medical_condition || "N/A"}</td>
                  <td className="p-3 capitalize">{patient.verification_status}</td>
                  <td className="p-3">
                    {patient.verification_documents?.length > 0 ? (
                      <div className="space-y-1">
                        {patient.verification_documents.map((doc, index) => (
                          <a
                            key={index}
                            href={doc}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-blue-600 underline"
                          >
                            View PDF {index + 1}
                          </a>
                        ))}
                      </div>
                    ) : (
                      "No documents"
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(patient)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(patient.id)}
                        disabled={isDeleting}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-purple-800">
              {isEditMode ? "Edit Patient" : "Add Patient"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="contact_no"
                  placeholder="Contact Number"
                  value={formData.contact_no}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />

                <input
                  type="text"
                  name="guardian_name"
                  placeholder="Guardian Name"
                  value={formData.guardian_name}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <input
                type="text"
                name="guardian_contact"
                placeholder="Guardian Contact"
                value={formData.guardian_contact}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

              <textarea
                name="medical_condition"
                placeholder="Medical Condition"
                value={formData.medical_condition}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                rows="3"
              />

              <select
                name="verification_status"
                value={formData.verification_status}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>

              <div>
                <label className="block mb-2 font-medium">
                  Upload Verification Documents (PDF only)
                </label>
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>

              {isEditMode && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="replace_documents"
                    checked={formData.replace_documents}
                    onChange={handleChange}
                  />
                  Replace old documents with new uploaded files
                </label>
              )}

              {errorMessage && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isAdding || isUpdating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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