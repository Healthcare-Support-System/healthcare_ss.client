import { useMemo, useState } from "react";
import { useFetchPatients } from "../hooks/usePatientApi";
import {
  useAddSupportRequest,
  useDeleteSupportRequest,
  useFetchSupportRequests,
  useUpdateSupportRequest,
} from "../hooks/useSupportRequestApi";

const palette = {
  primary: "#5E548E",
  accent: "#E5989B",
  background: "#FFF9F5",
  secondary: "#B5838D",
  border: "#F0E5E8",
  stepBg: "#FDF5F7",
  inactive: "#E8D9DE",
};

const initialItem = {
  item_name: "",
  quantity: "",
  unit: "",
  estimated_value: "",
};

const initialFormState = {
  patient_id: "",
  request_type: "",
  description: "",
  urgency_level: "",
  status: "pending",
  needed_date: "",
  items: [{ ...initialItem }],
};

const calculateAge = (dob) => {
  if (!dob) return "N/A";

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const getPatientDetails = (request) => {
  if (request?.patient_id && typeof request.patient_id === "object") {
    return request.patient_id;
  }

  if (request?.patient && typeof request.patient === "object") {
    return request.patient;
  }

  return null;
};

const MakeRequest = () => {
  const { data: patients = [], isLoading: loadingPatients } =
    useFetchPatients();
  const {
    data: supportRequests = [],
    isLoading: loadingRequests,
    isError,
  } = useFetchSupportRequests();

  const { mutate: addSupportRequest, isPending: isAdding } =
    useAddSupportRequest();
  const { mutate: updateSupportRequest, isPending: isUpdating } =
    useUpdateSupportRequest();
  const { mutate: deleteSupportRequest, isPending: isDeleting } =
    useDeleteSupportRequest();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");

  const isEditMode = useMemo(() => !!editingRequest, [editingRequest]);

  const openCreateModal = () => {
    setEditingRequest(null);
    setFormData(initialFormState);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (request) => {
    setEditingRequest(request);
    setFormData({
      patient_id: request.patient_id?._id || request.patient_id || "",
      request_type: request.request_type || "",
      description: request.description || "",
      urgency_level: request.urgency_level || "",
      status: request.status || "pending",
      needed_date: request.needed_date
        ? new Date(request.needed_date).toISOString().split("T")[0]
        : "",
      items:
        request.items && request.items.length > 0
          ? request.items.map((item) => ({
              item_name: item.item_name || "",
              quantity: item.quantity || "",
              unit: item.unit || "",
              estimated_value: item.estimated_value || "",
            }))
          : [{ ...initialItem }],
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingRequest(null);
    setFormData(initialFormState);
    setErrorMessage("");
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...initialItem }],
    }));
  };

  const removeItemRow = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems.length ? updatedItems : [{ ...initialItem }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanedItems = formData.items
      .filter(
        (item) =>
          item.item_name || item.quantity || item.unit || item.estimated_value,
      )
      .map((item) => ({
        item_name: item.item_name,
        quantity: Number(item.quantity),
        unit: item.unit,
        estimated_value: Number(item.estimated_value),
      }));

    const payload = {
      patient_id: formData.patient_id,
      request_type: formData.request_type,
      description: formData.description,
      urgency_level: formData.urgency_level,
      status: formData.status,
      needed_date: formData.needed_date,
      items: cleanedItems,
    };

    if (isEditMode) {
      updateSupportRequest(
        { id: editingRequest.id || editingRequest._id, payload },
        {
          onSuccess: () => closeModal(),
          onError: (error) => {
            setErrorMessage(
              error?.response?.data?.message ||
                "Failed to update support request.",
            );
          },
        },
      );
    } else {
      addSupportRequest(payload, {
        onSuccess: () => closeModal(),
        onError: (error) => {
          setErrorMessage(
            error?.response?.data?.message ||
              "Failed to create support request.",
          );
        },
      });
    }
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this support request?",
    );

    if (!confirmed) return;

    deleteSupportRequest(id, {
      onError: (error) => {
        alert(
          error?.response?.data?.message || "Failed to delete support request.",
        );
      },
    });
  };

  if (loadingPatients || loadingRequests) {
    return <div className="p-6">Loading support requests...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">Failed to load support requests.</div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: palette.background }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: palette.primary }}>
            Cancer Support Requests
          </h1>
          <p className="mt-1" style={{ color: palette.secondary }}>
            Create and manage request records for patient support needs.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 rounded-xl text-white font-medium shadow"
          style={{ backgroundColor: palette.primary }}
        >
          Create Request
        </button>
      </div>

      <div className="grid gap-5">
        {supportRequests.length === 0 ? (
          <div
            className="rounded-2xl p-6 text-center shadow-sm"
            style={{
              backgroundColor: "#fff",
              border: `1px solid ${palette.border}`,
            }}
          >
            <p style={{ color: palette.secondary }}>
              No support requests found.
            </p>
          </div>
        ) : (
          supportRequests.map((request) => {
            const patientDetails = getPatientDetails(request);

            return (
              <div
                key={request.id}
                className="rounded-2xl p-6 shadow-sm"
                style={{
                  backgroundColor: "#fff",
                  border: `1px solid ${palette.border}`,
                }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: palette.primary }}
                    >
                      {request.request_type || "Untitled Request"}
                    </h2>

                    <p
                      className="mt-2 text-sm"
                      style={{ color: palette.secondary }}
                    >
                      {request.description || "No description available."}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(request)}
                      className="px-4 py-2 rounded-lg text-white"
                      style={{ backgroundColor: palette.accent }}
                    >
                      Edit
                    </button>

                    <button
                     onClick={() => handleDelete(request.id || request._id)}
                      disabled={isDeleting}
                      className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mt-5">
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: palette.stepBg }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: palette.primary }}
                    >
                      Urgency
                    </p>
                    <p style={{ color: palette.secondary }}>
                      {request.urgency_level || "N/A"}
                    </p>
                  </div>

                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: palette.stepBg }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: palette.primary }}
                    >
                      Status
                    </p>
                    <p style={{ color: palette.secondary }}>
                      {request.status || "N/A"}
                    </p>
                  </div>

                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: palette.stepBg }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: palette.primary }}
                    >
                      Needed Date
                    </p>
                    <p style={{ color: palette.secondary }}>
                      {request.needed_date
                        ? new Date(request.needed_date).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: palette.stepBg }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: palette.primary }}
                    >
                      Created At
                    </p>
                    <p style={{ color: palette.secondary }}>
                      {request.created_at
                        ? new Date(request.created_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: palette.primary }}
                  >
                    Patient Details
                  </h3>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div
                      className="rounded-xl p-4"
                      style={{ backgroundColor: palette.stepBg }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: palette.primary }}
                      >
                        Patient Name
                      </p>
                      <p style={{ color: palette.secondary }}>
                        {patientDetails?.full_name || "N/A"}
                      </p>
                    </div>

                    <div
                      className="rounded-xl p-4"
                      style={{ backgroundColor: palette.stepBg }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: palette.primary }}
                      >
                        Age
                      </p>
                      <p style={{ color: palette.secondary }}>
                        {patientDetails?.dob
                          ? calculateAge(patientDetails.dob)
                          : (patientDetails?.age ?? "N/A")}
                      </p>
                    </div>

                    <div
                      className="rounded-xl p-4"
                      style={{ backgroundColor: palette.stepBg }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: palette.primary }}
                      >
                        Gender
                      </p>
                      <p style={{ color: palette.secondary }}>
                        {patientDetails?.gender || "N/A"}
                      </p>
                    </div>

                    <div
                      className="rounded-xl p-4"
                      style={{ backgroundColor: palette.stepBg }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: palette.primary }}
                      >
                        Medical Condition
                      </p>
                      <p style={{ color: palette.secondary }}>
                        {patientDetails?.medical_condition || "N/A"}
                      </p>
                    </div>

                     <div
                      className="rounded-xl p-4"
                      style={{ backgroundColor: palette.stepBg }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: palette.primary }}
                      >
                        Contact Number
                      </p>
                      <p style={{ color: palette.secondary }}>
                        {patientDetails?.contact_no || "N/A"}
                      </p>
                    </div>

                    <div
                      className="rounded-xl p-4"
                      style={{ backgroundColor: palette.stepBg }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: palette.primary }}
                      >
                        Adress
                      </p>
                      <p style={{ color: palette.secondary }}>
                        {patientDetails?.address || "N/A"}
                      </p>
                    </div>

                     <div
                      className="rounded-xl p-4"
                      style={{ backgroundColor: palette.stepBg }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: palette.primary }}
                      >
                        Guardian Name
                      </p>
                      <p style={{ color: palette.secondary }}>
                        {patientDetails?.guardian_name || "N/A"}
                      </p>
                    </div>

                    <div
                      className="rounded-xl p-4"
                      style={{ backgroundColor: palette.stepBg }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: palette.primary }}
                      >
                        Guardian's Contact No.
                      </p>
                      <p style={{ color: palette.secondary }}>
                        {patientDetails?.guardian_contact || "N/A"}
                      </p>
                    </div>

                  </div>
                </div>

                {request.items && request.items.length > 0 && (
                  <div className="mt-5">
                    <h3
                      className="font-semibold mb-3"
                      style={{ color: palette.primary }}
                    >
                      Requested Items
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="min-w-full rounded-xl overflow-hidden">
                        <thead style={{ backgroundColor: palette.stepBg }}>
                          <tr>
                            <th className="text-left px-4 py-3">Item Name</th>
                            <th className="text-left px-4 py-3">Quantity</th>
                            <th className="text-left px-4 py-3">Unit</th>
                            <th className="text-left px-4 py-3">
                              Estimated Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {request.items.map((item, index) => (
                            <tr
                              key={index}
                              className="border-t"
                              style={{ borderColor: palette.border }}
                            >
                              <td className="px-4 py-3">{item.item_name}</td>
                              <td className="px-4 py-3">{item.quantity}</td>
                              <td className="px-4 py-3">{item.unit}</td>
                              <td className="px-4 py-3">
                                Rs. {item.estimated_value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div
            className="w-full max-w-4xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: "#fff" }}
          >
            <div className="flex justify-between items-center mb-5">
              <h2
                className="text-2xl font-bold"
                style={{ color: palette.primary }}
              >
                {isEditMode ? "Edit Support Request" : "Create Support Request"}
              </h2>

              <button
                onClick={closeModal}
                className="text-sm px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: palette.inactive,
                  color: palette.primary,
                }}
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: palette.primary }}
                  >
                    Patient
                  </label>
                  <select
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleChange}
                    className="w-full rounded-xl p-3 border"
                    style={{ borderColor: palette.border }}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.full_name} 
                        {/* -{" "} {patient.medical_condition || "N/A"} */}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: palette.primary }}
                  >
                    Request Type
                  </label>
                  <input
                    type="text"
                    name="request_type"
                    value={formData.request_type}
                    onChange={handleChange}
                    className="w-full rounded-xl p-3 border"
                    style={{ borderColor: palette.border }}
                    placeholder="Ex: Medical Supplies"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className="block mb-2 font-medium"
                  style={{ color: palette.primary }}
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-xl p-3 border"
                  style={{ borderColor: palette.border }}
                  placeholder="Describe the support request"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: palette.primary }}
                  >
                    Urgency Level
                  </label>
                  <select
                    name="urgency_level"
                    value={formData.urgency_level}
                    onChange={handleChange}
                    className="w-full rounded-xl p-3 border"
                    style={{ borderColor: palette.border }}
                    required
                  >
                    <option value="">Select Urgency</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: palette.primary }}
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-xl p-3 border"
                    style={{ borderColor: palette.border }}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: palette.primary }}
                  >
                    Needed Date
                  </label>
                  <input
                    type="date"
                    name="needed_date"
                    value={formData.needed_date}
                    onChange={handleChange}
                    className="w-full rounded-xl p-3 border"
                    style={{ borderColor: palette.border }}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: palette.primary }}
                  >
                    Requested Items
                  </h3>

                  <button
                    type="button"
                    onClick={addItemRow}
                    className="px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: palette.accent }}
                  >
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid md:grid-cols-4 gap-3 rounded-xl p-4"
                      style={{ backgroundColor: palette.stepBg }}
                    >
                      <input
                        type="text"
                        placeholder="Item Name"
                        value={item.item_name}
                        onChange={(e) =>
                          handleItemChange(index, "item_name", e.target.value)
                        }
                        className="rounded-lg p-3 border"
                        style={{ borderColor: palette.border }}
                      />

                      <input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="rounded-lg p-3 border"
                        style={{ borderColor: palette.border }}
                      />

                      <input
                        type="text"
                        placeholder="Unit"
                        value={item.unit}
                        onChange={(e) =>
                          handleItemChange(index, "unit", e.target.value)
                        }
                        className="rounded-lg p-3 border"
                        style={{ borderColor: palette.border }}
                      />

                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Estimated Value"
                          value={item.estimated_value}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "estimated_value",
                              e.target.value,
                            )
                          }
                          className="rounded-lg p-3 border w-full"
                          style={{ borderColor: palette.border }}
                        />

                        <button
                          type="button"
                          onClick={() => removeItemRow(index)}
                          className="px-4 rounded-lg text-white bg-red-500 hover:bg-red-600"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-3 rounded-xl border"
                  style={{
                    borderColor: palette.border,
                    color: palette.primary,
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isAdding || isUpdating}
                  className="px-5 py-3 rounded-xl text-white font-medium"
                  style={{ backgroundColor: palette.primary }}
                >
                  {isEditMode
                    ? isUpdating
                      ? "Updating..."
                      : "Update Request"
                    : isAdding
                      ? "Creating..."
                      : "Create Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeRequest;
