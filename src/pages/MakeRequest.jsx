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
  white: "#FFFFFF",
  danger: "#dc2626",
  success: "#16a34a",
  shadow: "0 18px 45px rgba(94, 84, 142, 0.14)",
};

const inlineStyle = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');

  .req-root, .req-root * {
    font-family: 'DM Sans', sans-serif;
    box-sizing: border-box;
  }

  .req-input:focus, .req-select:focus, .req-textarea:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(94,84,142,0.15), 0 1px 3px rgba(94,84,142,0.08);
    border-color: #5E548E !important;
    background: #fff !important;
  }

  .req-input, .req-select, .req-textarea {
    transition: all 0.2s ease;
    background: #FDFAFD;
  }

  .req-input:hover, .req-select:hover, .req-textarea:hover {
    border-color: #B5838D !important;
    background: #fff !important;
  }

  .req-select {
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235E548E' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    background-color: #FDFAFD;
    padding-right: 40px !important;
  }

  .req-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(20, 12, 32, 0.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
  }

  .req-confirm-modal {
    width: 100%;
    max-width: 440px;
    background: white;
    border: 1px solid #F0E5E8;
    border-radius: 24px;
    box-shadow: 0 32px 64px rgba(94,84,142,0.22), 0 0 0 1px rgba(94,84,142,0.04);
    overflow: hidden;
    animation: modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1);
  }

  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.92) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .req-confirm-header {
    padding: 22px 24px 16px;
    border-bottom: 1px solid #F7ECEF;
    background: linear-gradient(135deg, #FAF7FF 0%, #FFF9F5 100%);
  }

  .req-confirm-title {
    font-size: 18px;
    font-weight: 800;
    color: #5E548E;
    margin: 0;
    letter-spacing: -0.3px;
  }

  .req-confirm-body {
    padding: 18px 24px 20px;
  }

  .req-confirm-text {
    font-size: 14.5px;
    line-height: 1.75;
    color: #7a6e8a;
    margin: 0;
  }

  .req-confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 0 24px 24px;
  }

  .req-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 5px 14px;
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .req-card {
    transition: box-shadow 0.22s ease, transform 0.18s ease;
  }

  .req-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 24px 56px rgba(94, 84, 142, 0.18) !important;
  }

  .req-filter-btn {
    transition: all 0.18s ease;
    cursor: pointer;
  }

  .req-filter-btn:hover {
    transform: translateY(-1px);
  }

  .req-action-btn {
    transition: all 0.18s ease;
    cursor: pointer;
  }

  .req-action-btn:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }

  .req-action-btn:active {
    transform: scale(0.96);
  }

  .req-create-btn {
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .req-create-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(94,84,142,0.32) !important;
  }

  .req-create-btn:active {
    transform: scale(0.97);
  }

  .req-info-tile {
    transition: all 0.18s ease;
  }

  .req-info-tile:hover {
    transform: translateY(-1px);
    background: #F7EFF5 !important;
  }

  .req-table-row {
    transition: background 0.15s ease;
  }

  .req-table-row:hover {
    background: #FDF5F7;
  }

  .req-form-modal {
    animation: modalIn 0.26s cubic-bezier(0.34,1.56,0.64,1);
  }

  .req-label {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .req-section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #F0E5E8 20%, #F0E5E8 80%, transparent);
    margin: 4px 0;
  }

  .req-stat-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 600;
  }

  .req-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }

  .req-item-row {
    transition: background 0.15s ease;
    border-radius: 16px;
  }

  .req-item-row:hover {
    background: #F7EFF5 !important;
  }

  .req-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(20, 12, 32, 0.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .req-scrollbar::-webkit-scrollbar { width: 5px; }
  .req-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .req-scrollbar::-webkit-scrollbar-thumb { background: #E5D8DF; border-radius: 99px; }
  .req-scrollbar::-webkit-scrollbar-thumb:hover { background: #B5838D; }

  .req-empty-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: linear-gradient(135deg, #F5EEF8 0%, #FDE8EC 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .req-header-glow {
    position: relative;
  }

  .req-header-glow::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -40px;
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(229,152,155,0.12) 0%, transparent 70%);
    pointer-events: none;
    border-radius: 50%;
  }

  .req-header-glow::after {
    content: '';
    position: absolute;
    top: -20px;
    left: -60px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(94,84,142,0.08) 0%, transparent 70%);
    pointer-events: none;
    border-radius: 50%;
  }
`;

const getFreshFormState = () => ({
  patient_id: "",
  request_type: "",
  description: "",
  urgency_level: "",
  status: "open",
  needed_date: "",
  items: [{ ...initialItem }],
});

const getFreshValidationState = (items = [{ ...initialItem }]) => ({
  patient_id: "",
  request_type: "",
  description: "",
  urgency_level: "",
  needed_date: "",
  items: items.map(() => ({
    item_name: "",
    quantity: "",
    unit: "",
    estimated_value: "",
  })),
});

const initialItem = {
  item_name: "",
  quantity: "",
  unit: "",
  estimated_value: "",
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
  return age === 0 ? "Infant" : age;
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

const isLettersOnly = (value) => /^[A-Za-z\s]+$/.test(value.trim());
const isNumbersOnly = (value) => /^\d+(\.\d+)?$/.test(String(value).trim());

const getTomorrowDate = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

const getStatusStyles = (status) => {
  switch (status) {
    case "open":
      return {
        backgroundColor: "#EEF2FF",
        color: "#4338CA",
        dotColor: "#6366F1",
      };
    case "pending":
      return {
        backgroundColor: "#FFF7ED",
        color: "#C2410C",
        dotColor: "#F97316",
      };
    case "fulfilled":
      return {
        backgroundColor: "#ECFDF5",
        color: "#047857",
        dotColor: "#10B981",
      };
    default:
      return {
        backgroundColor: "#FDF5F7",
        color: "#5E548E",
        dotColor: "#B5838D",
      };
  }
};

const getUrgencyStyles = (level) => {
  switch (level?.toLowerCase()) {
    case "high":
      return { color: "#B91C1C", bg: "#FEF2F2", dot: "#EF4444" };
    case "medium":
      return { color: "#B45309", bg: "#FFFBEB", dot: "#F59E0B" };
    case "low":
      return { color: "#166534", bg: "#F0FDF4", dot: "#22C55E" };
    default:
      return { color: "#5E548E", bg: "#FDF5F7", dot: "#B5838D" };
  }
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
  const [formData, setFormData] = useState(getFreshFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState(
    getFreshValidationState,
  );
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Close",
    type: "info",
    onConfirm: null,
  });

  const isEditMode = useMemo(() => !!editingRequest, [editingRequest]);

  const verifiedPatients = useMemo(() => {
    return patients.filter(
      (patient) =>
        String(patient?.verification_status || "").toLowerCase() === "verified",
    );
  }, [patients]);

  const filteredSupportRequests = useMemo(() => {
    if (activeStatusFilter === "all") return supportRequests;
    return supportRequests.filter(
      (request) => (request?.status || "").toLowerCase() === activeStatusFilter,
    );
  }, [supportRequests, activeStatusFilter]);

  const statusCounts = useMemo(
    () => ({
      open: supportRequests.filter((r) => r?.status === "open").length,
      pending: supportRequests.filter((r) => r?.status === "pending").length,
      fulfilled: supportRequests.filter((r) => r?.status === "fulfilled")
        .length,
    }),
    [supportRequests],
  );

  const openConfirmModal = ({
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Close",
    type = "info",
    onConfirm = null,
  }) => {
    setConfirmModal({
      open: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      open: false,
      title: "",
      message: "",
      confirmText: "Confirm",
      cancelText: "Close",
      type: "info",
      onConfirm: null,
    });
  };

  const resetValidationErrors = (items = [{ ...initialItem }]) => {
    setValidationErrors({
      patient_id: "",
      request_type: "",
      description: "",
      urgency_level: "",
      status: "",
      needed_date: "",
      items: items.map(() => ({
        item_name: "",
        quantity: "",
        unit: "",
        estimated_value: "",
      })),
    });
  };

  const openCreateModal = () => {
    setEditingRequest(null);
    const freshForm = getFreshFormState();
    setFormData(freshForm);
    setErrorMessage("");
    resetValidationErrors(freshForm.items);
    setIsModalOpen(true);
  };

  const openEditModal = (request) => {
    const mappedItems =
      request.items && request.items.length > 0
        ? request.items.map((item) => ({
            item_name: item.item_name || "",
            quantity: item.quantity || "",
            unit: item.unit || "",
            estimated_value: item.estimated_value || "",
          }))
        : [{ ...initialItem }];

    setEditingRequest(request);
    setFormData({
      patient_id: request.patient_id?._id || request.patient_id || "",
      request_type: request.request_type || "",
      description: request.description || "",
      urgency_level: request.urgency_level || "",
      status: request.status || "open",
      needed_date: request.needed_date
        ? new Date(request.needed_date).toISOString().split("T")[0]
        : "",
      items: mappedItems,
    });
    setErrorMessage("");
    resetValidationErrors(mappedItems);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingRequest(null);
    const freshForm = getFreshFormState();
    setFormData(freshForm);
    setErrorMessage("");
    resetValidationErrors(freshForm.items);
    setIsModalOpen(false);
  };

  const validateField = (name, value) => {
    const trimmedValue = typeof value === "string" ? value.trim() : value;
    switch (name) {
      case "patient_id":
        return trimmedValue ? "" : "Patient is required.";
      case "request_type":
        if (!trimmedValue) return "Request type is required.";
        if (!isLettersOnly(trimmedValue))
          return "Request type can contain letters only.";
        return "";
      case "description":
        return trimmedValue ? "" : "Description is required.";
      case "urgency_level":
        return trimmedValue ? "" : "Urgency level is required.";
      case "needed_date":
        if (!trimmedValue) return "Needed date is required.";
        if (trimmedValue < getTomorrowDate())
          return "Needed date must be tomorrow or a future date.";
        return "";
      default:
        return "";
    }
  };

  const validateItemField = (field, value) => {
    const trimmedValue = typeof value === "string" ? value.trim() : value;
    switch (field) {
      case "item_name":
        return trimmedValue ? "" : "Item name is required.";
      case "quantity":
        if (trimmedValue === "") return "Quantity is required.";
        if (!isNumbersOnly(trimmedValue))
          return "Quantity must be numbers only.";
        return "";
      case "unit":
        return trimmedValue ? "" : "Unit is required.";
      case "estimated_value":
        if (trimmedValue === "") return "Estimated value is required.";
        if (!isNumbersOnly(trimmedValue))
          return "Estimated value must be numbers only.";
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const nextErrors = {
      patient_id: validateField("patient_id", formData.patient_id),
      request_type: validateField("request_type", formData.request_type),
      description: validateField("description", formData.description),
      urgency_level: validateField("urgency_level", formData.urgency_level),
      needed_date: validateField("needed_date", formData.needed_date),
      items: formData.items.map((item) => ({
        item_name: validateItemField("item_name", item.item_name),
        quantity: validateItemField("quantity", item.quantity),
        unit: validateItemField(
          "unit",
          item.unit === "other" ? item.custom_unit : item.unit,
        ),
        estimated_value: validateItemField(
          "estimated_value",
          item.estimated_value,
        ),
      })),
    };
    setValidationErrors(nextErrors);
    const hasTopLevelErrors = Object.entries(nextErrors)
      .filter(([key]) => key !== "items")
      .some(([, value]) => value);
    const hasItemErrors = nextErrors.items.some((item) =>
      Object.values(item).some(Boolean),
    );
    return !(hasTopLevelErrors || hasItemErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === "request_type") {
      nextValue = value.replace(/[^A-Za-z\s]/g, "");
    }
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    setValidationErrors((prev) => ({
      ...prev,
      [name]: validateField(name, nextValue),
    }));
  };

  const handleItemChange = (index, field, value) => {
    let nextValue = value;
    if (field === "quantity" || field === "estimated_value") {
      nextValue = value.replace(/[^\d.]/g, "");
    }
    if (field === "custom_unit") {
      nextValue = value.replace(/[^A-Za-z\s]/g, "");
    }
    const updatedItems = [...formData.items];
    updatedItems[index][field] = nextValue;
    setFormData((prev) => ({ ...prev, items: updatedItems }));
    setValidationErrors((prev) => {
      const updatedItemErrors = [...prev.items];
      if (!updatedItemErrors[index]) {
        updatedItemErrors[index] = {
          item_name: "",
          quantity: "",
          unit: "",
          estimated_value: "",
        };
      }
      updatedItemErrors[index] = {
        ...updatedItemErrors[index],
        [field]: validateItemField(field, nextValue),

        unit:
          field === "custom_unit"
            ? validateItemField("unit", nextValue)
            : field === "unit"
              ? validateItemField("unit", nextValue)
              : updatedItemErrors[index].unit,
      };
      return { ...prev, items: updatedItemErrors };
    });
  };

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...initialItem }],
    }));
    setValidationErrors((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { item_name: "", quantity: "", unit: "", estimated_value: "" },
      ],
    }));
  };

  const removeItemRow = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const updatedItemErrors = validationErrors.items.filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({
      ...prev,
      items: updatedItems.length ? updatedItems : [{ ...initialItem }],
    }));
    setValidationErrors((prev) => ({
      ...prev,
      items: updatedItemErrors.length
        ? updatedItemErrors
        : [{ item_name: "", quantity: "", unit: "", estimated_value: "" }],
    }));
  };

  const submitRequest = () => {
    setErrorMessage("");
    const cleanedItems = formData.items.map((item) => ({
      item_name: item.item_name.trim(),
      quantity: Number(item.quantity),
      unit:
        item.unit === "other"
          ? (item.custom_unit || "").trim()
          : (item.unit || "").trim(),
      estimated_value: Number(item.estimated_value),
    }));
    const payload = {
      patient_id: formData.patient_id,
      request_type: formData.request_type.trim(),
      description: formData.description,
      urgency_level: formData.urgency_level,
      needed_date: formData.needed_date,
      items: cleanedItems,
    };
    if (isEditMode) {
      updateSupportRequest(
        { id: editingRequest.id || editingRequest._id, payload },
        {
          onSuccess: () => {
            closeConfirmModal();
            closeModal();
          },
          onError: (error) => {
            setErrorMessage(
              error?.response?.data?.message ||
                "Failed to update support request.",
            );
            closeConfirmModal();
          },
        },
      );
    } else {
      addSupportRequest(payload, {
        onSuccess: () => {
          closeConfirmModal();
          closeModal();
        },
        onError: (error) => {
          setErrorMessage(
            error?.response?.data?.message ||
              "Failed to create support request.",
          );
          closeConfirmModal();
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    const isValid = validateForm();
    if (!isValid) return;
    openConfirmModal({
      title: isEditMode ? "Update Support Request" : "Create Support Request",
      message: isEditMode
        ? "Are you sure you want to update this support request?"
        : "Are you sure you want to create this support request?",
      confirmText: isEditMode ? "Update Request" : "Create Request",
      cancelText: "Close",
      type: isEditMode ? "update" : "create",
      onConfirm: submitRequest,
    });
  };

  const handleDelete = (id) => {
    openConfirmModal({
      title: "Delete Support Request",
      message: "Are you sure you want to delete this support request?",
      confirmText: "Yes, Delete",
      cancelText: "No",
      type: "delete",
      onConfirm: () => {
        deleteSupportRequest(id, {
          onSuccess: () => closeConfirmModal(),
          onError: (error) => {
            alert(
              error?.response?.data?.message ||
                "Failed to delete support request.",
            );
            closeConfirmModal();
          },
        });
      },
    });
  };

  if (loadingPatients || loadingRequests) {
    return (
      <>
        <style>{inlineStyle}</style>
        <div
          className="req-root min-h-screen flex items-center justify-center"
          style={{ backgroundColor: palette.background }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                border: "3px solid #F0E5E8",
                borderTopColor: "#5E548E",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#5E548E", fontWeight: 600, fontSize: 15 }}>
              Loading support requests…
            </p>
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <style>{inlineStyle}</style>
        <div
          className="req-root min-h-screen flex items-center justify-center"
          style={{ backgroundColor: palette.background }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "32px 40px",
              border: "1px solid #FEE2E2",
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(220,38,38,0.08)",
            }}
          >
            <p style={{ color: "#dc2626", fontWeight: 700, fontSize: 16 }}>
              Failed to load support requests.
            </p>
          </div>
        </div>
      </>
    );
  }

  const inputBase = {
    width: "100%",
    borderRadius: 14,
    padding: "11px 14px",
    border: `1.5px solid ${palette.border}`,
    fontSize: 14,
    fontWeight: 500,
    color: "#3d3450",
  };

  const fieldLabel = (hasError) => ({
    ...inputBase,
    borderColor: hasError ? palette.danger : palette.border,
  });

  return (
    <>
      <style>{inlineStyle}</style>

      {/* Confirm Modal */}
      {confirmModal.open && (
        <div className="req-modal-overlay">
          <div className="req-confirm-modal">
            <div className="req-confirm-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background:
                      confirmModal.type === "delete" ? "#FEE2E2" : "#EEF2FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {confirmModal.type === "delete" ? (
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#dc2626"
                      strokeWidth="2.2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#4338CA"
                      strokeWidth="2.2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <h3 className="req-confirm-title">{confirmModal.title}</h3>
              </div>
            </div>
            <div className="req-confirm-body">
              <p className="req-confirm-text">{confirmModal.message}</p>
            </div>
            <div className="req-confirm-actions">
              <button
                type="button"
                onClick={closeConfirmModal}
                className="req-action-btn px-5 py-2.5 rounded-xl font-semibold border"
                style={{
                  borderColor: palette.border,
                  color: palette.primary,
                  backgroundColor: "#fff",
                  fontSize: 14,
                }}
              >
                {confirmModal.cancelText}
              </button>
              <button
                type="button"
                onClick={() =>
                  confirmModal.onConfirm && confirmModal.onConfirm()
                }
                className="req-action-btn px-5 py-2.5 rounded-xl font-semibold text-white"
                style={{
                  backgroundColor:
                    confirmModal.type === "delete"
                      ? palette.danger
                      : palette.primary,
                  fontSize: 14,
                  boxShadow:
                    confirmModal.type === "delete"
                      ? "0 4px 14px rgba(220,38,38,0.28)"
                      : "0 4px 14px rgba(94,84,142,0.28)",
                }}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="req-root min-h-screen"
        style={{ backgroundColor: palette.background }}
      >
        {/* === TOP HERO HEADER === */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #5E548E 0%, #7B6EA8 50%, #9D8EC4 100%)",
            padding: "40px 32px 36px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative blobs */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -60,
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              left: -40,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(229,152,155,0.18)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 200,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 999,
                    padding: "4px 14px",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#E5989B",
                    }}
                  />
                  <span
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: 11.5,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Cancer Support Fund
                  </span>
                </div>
                <h1
                  style={{
                    color: "#fff",
                    fontSize: 36,
                    fontWeight: 900,
                    margin: 0,
                    letterSpacing: "-0.8px",
                    lineHeight: 1.15,
                  }}
                >
                  Support Requests
                </h1>
                <p
                  style={{
                    color: "rgba(255,255,255,0.72)",
                    marginTop: 8,
                    fontSize: 15,
                    lineHeight: 1.6,
                  }}
                >
                  Create, manage, filter, and monitor patient support requests.
                </p>
              </div>

              <button
                onClick={openCreateModal}
                className="req-create-btn"
                style={{
                  padding: "14px 28px",
                  borderRadius: 18,
                  background: "#fff",
                  color: "#5E548E",
                  fontWeight: 800,
                  fontSize: 15,
                  border: "none",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Request
              </button>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 28,
              }}
            >
              {[
                {
                  label: "Total",
                  value: supportRequests.length,
                  color: "rgba(255,255,255,0.2)",
                  text: "#fff",
                },
                {
                  label: "Open",
                  value: statusCounts.open,
                  color: "rgba(99,102,241,0.3)",
                  text: "#E0E7FF",
                },
                {
                  label: "Pending",
                  value: statusCounts.pending,
                  color: "rgba(251,146,60,0.25)",
                  text: "#FED7AA",
                },
                {
                  label: "Fulfilled",
                  value: statusCounts.fulfilled,
                  color: "rgba(52,211,153,0.25)",
                  text: "#A7F3D0",
                },
              ].map(({ label, value, color, text }) => (
                <div
                  key={label}
                  style={{
                    background: color,
                    borderRadius: 14,
                    padding: "10px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <span
                    style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}
                  >
                    {value}
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: text,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === MAIN CONTENT === */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
          {/* Filter Tabs */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "6px",
              border: `1px solid ${palette.border}`,
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              marginBottom: 24,
              boxShadow: "0 2px 12px rgba(94,84,142,0.06)",
            }}
          >
            {[
              {
                key: "all",
                label: "All Requests",
                count: supportRequests.length,
              },
              {
                key: "open",
                label: "Open",
                count: statusCounts.open,
                dot: "#6366F1",
              },
              {
                key: "pending",
                label: "Pending",
                count: statusCounts.pending,
                dot: "#F97316",
              },
              {
                key: "fulfilled",
                label: "Fulfilled",
                count: statusCounts.fulfilled,
                dot: "#10B981",
              },
            ].map(({ key, label, count, dot }) => {
              const isActive = activeStatusFilter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveStatusFilter(key)}
                  className="req-filter-btn"
                  style={{
                    padding: "10px 20px",
                    borderRadius: 14,
                    border: "none",
                    fontWeight: 700,
                    fontSize: 13.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: isActive ? "#5E548E" : "transparent",
                    color: isActive ? "#fff" : "#9585a8",
                    boxShadow: isActive
                      ? "0 4px 14px rgba(94,84,142,0.25)"
                      : "none",
                  }}
                >
                  {dot && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: isActive ? "rgba(255,255,255,0.6)" : dot,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {label}
                  <span
                    style={{
                      background: isActive
                        ? "rgba(255,255,255,0.2)"
                        : "#F3EFF6",
                      color: isActive ? "#fff" : "#7B6EA8",
                      borderRadius: 999,
                      padding: "2px 9px",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <div
            style={{
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#B5838D"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span
              style={{
                color: palette.secondary,
                fontSize: 13.5,
                fontWeight: 600,
              }}
            >
              Showing{" "}
              <strong style={{ color: palette.primary }}>
                {filteredSupportRequests.length}
              </strong>{" "}
              request{filteredSupportRequests.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Cards */}
          <div className="grid gap-5">
            {filteredSupportRequests.length === 0 ? (
              <div
                style={{
                  borderRadius: 24,
                  padding: "64px 32px",
                  textAlign: "center",
                  background: "#fff",
                  border: `1px solid ${palette.border}`,
                  boxShadow: "0 4px 20px rgba(94,84,142,0.06)",
                }}
              >
                <div className="req-empty-icon">
                  <svg
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#B5838D"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: palette.primary,
                    margin: 0,
                  }}
                >
                  No support requests found.
                </p>
                <p
                  style={{
                    marginTop: 8,
                    color: palette.secondary,
                    fontSize: 14,
                  }}
                >
                  Try another filter or create a new request.
                </p>
                <button
                  onClick={openCreateModal}
                  className="req-action-btn"
                  style={{
                    marginTop: 20,
                    padding: "12px 28px",
                    borderRadius: 14,
                    background: palette.primary,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    border: "none",
                    boxShadow: "0 4px 14px rgba(94,84,142,0.25)",
                  }}
                >
                  Create First Request
                </button>
              </div>
            ) : (
              filteredSupportRequests.map((request) => {
                const patientDetails = getPatientDetails(request);
                const statusStyles = getStatusStyles(request.status || "open");
                const urgencyStyles = getUrgencyStyles(request.urgency_level);

                return (
                  <div
                    key={request.id || request._id}
                    className="req-card"
                    style={{
                      borderRadius: 24,
                      background: "#fff",
                      border: `1px solid ${palette.border}`,
                      boxShadow: "0 4px 20px rgba(94,84,142,0.07)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Card top accent bar */}
                    <div
                      style={{
                        height: 4,
                        background:
                          request.status === "open"
                            ? "linear-gradient(90deg, #6366F1, #818CF8)"
                            : request.status === "pending"
                              ? "linear-gradient(90deg, #F97316, #FB923C)"
                              : "linear-gradient(90deg, #10B981, #34D399)",
                      }}
                    />

                    <div style={{ padding: "22px 24px" }}>
                      {/* Header row */}
                      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-5">
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              gap: 10,
                              marginBottom: 10,
                            }}
                          >
                            <h2
                              style={{
                                fontSize: 22,
                                fontWeight: 900,
                                color: palette.primary,
                                margin: 0,
                                letterSpacing: "-0.4px",
                              }}
                            >
                              {request.request_type || "Untitled Request"}
                            </h2>
                            <span
                              className="req-badge"
                              style={{
                                backgroundColor: statusStyles.backgroundColor,
                                color: statusStyles.color,
                              }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: statusStyles.dotColor,
                                  marginRight: 5,
                                }}
                              />
                              {request.status || "N/A"}
                            </span>
                            <span
                              className="req-badge"
                              style={{
                                backgroundColor: urgencyStyles.bg,
                                color: urgencyStyles.color,
                              }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: urgencyStyles.dot,
                                  marginRight: 5,
                                }}
                              />
                              {request.urgency_level || "N/A"} urgency
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: 14,
                              lineHeight: 1.75,
                              color: "#8b7fa0",
                              margin: 0,
                              maxWidth: 640,
                            }}
                          >
                            {request.description || "No description available."}
                          </p>
                        </div>

                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                          <button
                            onClick={() => openEditModal(request)}
                            className="req-action-btn"
                            style={{
                              padding: "10px 20px",
                              borderRadius: 12,
                              border: "none",
                              background:
                                "linear-gradient(135deg, #E5989B, #f0a8ab)",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: 13.5,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              boxShadow: "0 4px 12px rgba(229,152,155,0.35)",
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(request.id || request._id)
                            }
                            disabled={isDeleting}
                            className="req-action-btn"
                            style={{
                              padding: "10px 20px",
                              borderRadius: 12,
                              border: "none",
                              background: "#FEF2F2",
                              color: "#dc2626",
                              fontWeight: 700,
                              fontSize: 13.5,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              // eslint-disable-next-line
                              border: "1px solid #FECACA",
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Meta tiles */}
                      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 mt-5">
                        {[
                          {
                            icon: (
                              <svg
                                width="15"
                                height="15"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            ),
                            label: "Urgency",
                            value: request.urgency_level || "N/A",
                            capitalize: true,
                          },
                          {
                            icon: (
                              <svg
                                width="15"
                                height="15"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            ),
                            label: "Status",
                            value: request.status || "N/A",
                            capitalize: true,
                          },
                          {
                            icon: (
                              <svg
                                width="15"
                                height="15"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            ),
                            label: "Needed Date",
                            value: request.needed_date
                              ? new Date(
                                  request.needed_date,
                                ).toLocaleDateString()
                              : "N/A",
                          },
                          {
                            icon: (
                              <svg
                                width="15"
                                height="15"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            ),
                            label: "Created At",
                            value: request.created_at
                              ? new Date(
                                  request.created_at,
                                ).toLocaleDateString()
                              : "N/A",
                          },
                        ].map(({ icon, label, value, capitalize }) => (
                          <div
                            key={label}
                            className="req-info-tile"
                            style={{
                              borderRadius: 14,
                              padding: "14px 16px",
                              background: palette.stepBg,
                              border: `1px solid ${palette.border}`,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginBottom: 6,
                                color: palette.primary,
                              }}
                            >
                              {icon}
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.08em",
                                  color: palette.primary,
                                }}
                              >
                                {label}
                              </span>
                            </div>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: 600,
                                fontSize: 14,
                                color: "#5a4e6e",
                                textTransform: capitalize
                                  ? "capitalize"
                                  : "none",
                              }}
                            >
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Patient Details */}
                      <div style={{ marginTop: 24 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              background:
                                "linear-gradient(135deg, #EDE9F8, #F5EDF0)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="#5E548E"
                              strokeWidth="2.2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <h3
                            style={{
                              fontSize: 15,
                              fontWeight: 800,
                              color: palette.primary,
                              margin: 0,
                            }}
                          >
                            Patient Details
                          </h3>
                        </div>

                        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
                          {[
                            [
                              "Patient Name",
                              patientDetails?.full_name || "N/A",
                            ],
                            [
                              "Age",
                              patientDetails?.dob
                                ? calculateAge(patientDetails.dob)
                                : patientDetails?.age === 0
                                  ? "Infant"
                                  : (patientDetails?.age ?? "N/A"),
                            ],
                            ["Gender", patientDetails?.gender || "N/A"],
                            [
                              "Medical Condition",
                              patientDetails?.medical_condition || "N/A",
                            ],
                            [
                              "Contact Number",
                              patientDetails?.contact_no || "N/A",
                            ],
                            ["Address", patientDetails?.address || "N/A"],
                            [
                              "Guardian Name",
                              patientDetails?.guardian_name || "N/A",
                            ],
                            [
                              "Guardian's Contact",
                              patientDetails?.guardian_contact || "N/A",
                            ],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              className="req-info-tile"
                              style={{
                                borderRadius: 14,
                                padding: "14px 16px",
                                background: palette.stepBg,
                                border: `1px solid ${palette.border}`,
                              }}
                            >
                              <p
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.08em",
                                  color: palette.primary,
                                  margin: "0 0 6px",
                                }}
                              >
                                {label}
                              </p>
                              <p
                                style={{
                                  margin: 0,
                                  fontWeight: 600,
                                  fontSize: 13.5,
                                  color: "#5a4e6e",
                                }}
                              >
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Items table */}
                      {request.items && request.items.length > 0 && (
                        <div style={{ marginTop: 24 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 8,
                                background:
                                  "linear-gradient(135deg, #EDE9F8, #F5EDF0)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="#5E548E"
                                strokeWidth="2.2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                              </svg>
                            </div>
                            <h3
                              style={{
                                fontSize: 15,
                                fontWeight: 800,
                                color: palette.primary,
                                margin: 0,
                              }}
                            >
                              Requested Items
                            </h3>
                            <span
                              style={{
                                background: "#EDE9F8",
                                color: "#5E548E",
                                fontSize: 11.5,
                                fontWeight: 800,
                                borderRadius: 999,
                                padding: "2px 10px",
                              }}
                            >
                              {request.items.length} item
                              {request.items.length !== 1 ? "s" : ""}
                            </span>
                          </div>

                          <div
                            style={{
                              borderRadius: 16,
                              border: `1px solid ${palette.border}`,
                              overflow: "hidden",
                            }}
                          >
                            <table
                              style={{
                                minWidth: "100%",
                                borderCollapse: "collapse",
                              }}
                            >
                              <thead>
                                <tr
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #F5EDF8, #FDF5F7)",
                                  }}
                                >
                                  {[
                                    "Item Name",
                                    "Quantity",
                                    "Unit",
                                    "Estimated Value",
                                  ].map((h) => (
                                    <th
                                      key={h}
                                      style={{
                                        textAlign: "left",
                                        padding: "12px 16px",
                                        fontSize: 11.5,
                                        fontWeight: 800,
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        color: palette.primary,
                                      }}
                                    >
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {request.items.map((item, index) => (
                                  <tr
                                    key={index}
                                    className="req-table-row"
                                    style={{
                                      borderTop: `1px solid ${palette.border}`,
                                    }}
                                  >
                                    <td
                                      style={{
                                        padding: "12px 16px",
                                        fontSize: 13.5,
                                        fontWeight: 600,
                                        color: "#3d3450",
                                      }}
                                    >
                                      {item.item_name}
                                    </td>
                                    <td
                                      style={{
                                        padding: "12px 16px",
                                        fontSize: 13.5,
                                        color: "#6b5f7a",
                                      }}
                                    >
                                      {item.quantity}
                                    </td>
                                    <td
                                      style={{
                                        padding: "12px 16px",
                                        fontSize: 13.5,
                                        color: "#6b5f7a",
                                      }}
                                    >
                                      {item.unit}
                                    </td>
                                    <td
                                      style={{
                                        padding: "12px 16px",
                                        fontSize: 13.5,
                                        fontWeight: 700,
                                        color: "#047857",
                                      }}
                                    >
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
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* === FORM MODAL === */}
        {isModalOpen && (
          <div className="req-modal-backdrop">
            <div
              className="req-form-modal req-scrollbar"
              style={{
                width: "100%",
                maxWidth: 900,
                borderRadius: 28,
                background: "#fff",
                boxShadow:
                  "0 32px 80px rgba(94,84,142,0.22), 0 0 0 1px rgba(94,84,142,0.06)",
                maxHeight: "92vh",
                overflowY: "auto",
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #5E548E 0%, #7B6EA8 100%)",
                  padding: "24px 28px 22px",
                  borderRadius: "28px 28px 0 0",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: 999,
                        padding: "3px 12px",
                        marginBottom: 10,
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {isEditMode ? "Editing" : "New Request"}
                      </span>
                    </div>
                    <h2
                      style={{
                        color: "#fff",
                        fontSize: 26,
                        fontWeight: 900,
                        margin: 0,
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {isEditMode
                        ? "Edit Support Request"
                        : "Create Support Request"}
                    </h2>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.65)",
                        marginTop: 5,
                        fontSize: 13.5,
                      }}
                    >
                      Fill all required fields and review before submitting.
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.15)",
                      border: "none",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div style={{ padding: "28px" }}>
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 24 }}
                >
                  {/* Patient & Request Type */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 16,
                        paddingBottom: 12,
                        borderBottom: `1px solid ${palette.border}`,
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 7,
                          background: "#EDE9F8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="13"
                          height="13"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="#5E548E"
                          strokeWidth="2.2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: 14,
                          color: palette.primary,
                        }}
                      >
                        Basic Information
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="req-label block mb-2"
                          style={{ color: palette.primary }}
                        >
                          Patient{" "}
                          <span style={{ color: palette.danger }}>*</span>
                        </label>
                        <select
                          name="patient_id"
                          value={formData.patient_id}
                          onChange={handleChange}
                          className="req-select"
                          style={fieldLabel(validationErrors.patient_id)}
                        >
                          <option value="">Select Verified Patient</option>
                          {verifiedPatients.map((patient) => (
                            <option
                              key={patient.id || patient._id}
                              value={patient.id || patient._id}
                            >
                              {patient.full_name}
                            </option>
                          ))}
                        </select>
                        {validationErrors.patient_id && (
                          <p
                            style={{
                              color: palette.danger,
                              fontSize: 12.5,
                              marginTop: 5,
                              fontWeight: 600,
                            }}
                          >
                            {validationErrors.patient_id}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          className="req-label block mb-2"
                          style={{ color: palette.primary }}
                        >
                          Request Type{" "}
                          <span style={{ color: palette.danger }}>*</span>
                        </label>
                        <select
                          name="request_type"
                          value={formData.request_type}
                          onChange={handleChange}
                          className="req-select"
                          style={fieldLabel(validationErrors.request_type)}
                        >
                          <option value="">Select Request Type</option>
                          <option value="Medicine">Medicine</option>
                          <option value="Nutrition">Nutrition</option>
                        </select>
                        {validationErrors.request_type && (
                          <p
                            style={{
                              color: palette.danger,
                              fontSize: 12.5,
                              marginTop: 5,
                              fontWeight: 600,
                            }}
                          >
                            {validationErrors.request_type}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      className="req-label block mb-2"
                      style={{ color: palette.primary }}
                    >
                      Description{" "}
                      <span style={{ color: palette.danger }}>*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="req-textarea"
                      style={{
                        ...fieldLabel(validationErrors.description),
                        resize: "vertical",
                        lineHeight: 1.7,
                      }}
                      placeholder="Describe the support request in detail…"
                    />
                    {validationErrors.description && (
                      <p
                        style={{
                          color: palette.danger,
                          fontSize: 12.5,
                          marginTop: 5,
                          fontWeight: 600,
                        }}
                      >
                        {validationErrors.description}
                      </p>
                    )}
                  </div>

                  {/* Urgency / Status / Date */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 16,
                        paddingBottom: 12,
                        borderBottom: `1px solid ${palette.border}`,
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 7,
                          background: "#EDE9F8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="13"
                          height="13"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="#5E548E"
                          strokeWidth="2.2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: 14,
                          color: palette.primary,
                        }}
                      >
                        Request Details
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label
                          className="req-label block mb-2"
                          style={{ color: palette.primary }}
                        >
                          Urgency Level{" "}
                          <span style={{ color: palette.danger }}>*</span>
                        </label>
                        <select
                          name="urgency_level"
                          value={formData.urgency_level}
                          onChange={handleChange}
                          className="req-select"
                          style={fieldLabel(validationErrors.urgency_level)}
                        >
                          <option value="">Select Urgency</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        {validationErrors.urgency_level && (
                          <p
                            style={{
                              color: palette.danger,
                              fontSize: 12.5,
                              marginTop: 5,
                              fontWeight: 600,
                            }}
                          >
                            {validationErrors.urgency_level}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          className="req-label block mb-2"
                          style={{ color: palette.primary }}
                        >
                          Status
                        </label>

                        <div
                          style={{
                            ...inputBase,
                            backgroundColor: "#FDF5F7",
                            color: palette.primary,
                            fontWeight: 700,
                            textTransform: "capitalize",
                            cursor: "not-allowed",
                          }}
                        >
                          {formData.status || "open"}
                        </div>
                      </div>

                      <div>
                        <label
                          className="req-label block mb-2"
                          style={{ color: palette.primary }}
                        >
                          Needed Date{" "}
                          <span style={{ color: palette.danger }}>*</span>
                        </label>
                        <input
                          type="date"
                          name="needed_date"
                          value={formData.needed_date}
                          min={getTomorrowDate()}
                          onChange={handleChange}
                          className="req-input"
                          style={fieldLabel(validationErrors.needed_date)}
                        />
                        {validationErrors.needed_date && (
                          <p
                            style={{
                              color: palette.danger,
                              fontSize: 12.5,
                              marginTop: 5,
                              fontWeight: 600,
                            }}
                          >
                            {validationErrors.needed_date}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Requested Items */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                        paddingBottom: 12,
                        borderBottom: `1px solid ${palette.border}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 7,
                            background: "#EDE9F8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="13"
                            height="13"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#5E548E"
                            strokeWidth="2.2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: 14,
                            color: palette.primary,
                          }}
                        >
                          Requested Items
                        </span>
                        <span
                          style={{
                            background: "#EDE9F8",
                            color: "#5E548E",
                            fontSize: 11.5,
                            fontWeight: 800,
                            borderRadius: 999,
                            padding: "2px 9px",
                          }}
                        >
                          {formData.items.length}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={addItemRow}
                        className="req-action-btn"
                        style={{
                          padding: "9px 18px",
                          borderRadius: 12,
                          border: "none",
                          background:
                            "linear-gradient(135deg, #E5989B, #f0a8ab)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          boxShadow: "0 4px 12px rgba(229,152,155,0.3)",
                        }}
                      >
                        <svg
                          width="13"
                          height="13"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add Item
                      </button>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      {formData.items.map((item, index) => (
                        <div
                          key={index}
                          className="req-item-row"
                          style={{
                            borderRadius: 16,
                            padding: "16px",
                            background: palette.stepBg,
                            border: `1px solid ${palette.border}`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                background: "#EDE9F8",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 800,
                                color: "#5E548E",
                                flexShrink: 0,
                              }}
                            >
                              {index + 1}
                            </div>
                            <span
                              style={{
                                fontSize: 12.5,
                                fontWeight: 700,
                                color: palette.primary,
                              }}
                            >
                              Item {index + 1}
                            </span>
                          </div>

                          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
                            <div>
                              <input
                                type="text"
                                placeholder="Item name"
                                value={item.item_name}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "item_name",
                                    e.target.value,
                                  )
                                }
                                className="req-input"
                                style={{
                                  ...inputBase,
                                  borderColor: validationErrors.items[index]
                                    ?.item_name
                                    ? palette.danger
                                    : palette.border,
                                }}
                              />
                              {validationErrors.items[index]?.item_name && (
                                <p
                                  style={{
                                    color: palette.danger,
                                    fontSize: 12,
                                    marginTop: 4,
                                    fontWeight: 600,
                                  }}
                                >
                                  {validationErrors.items[index].item_name}
                                </p>
                              )}
                            </div>

                            <div>
                              <input
                                type="text"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "quantity",
                                    e.target.value,
                                  )
                                }
                                className="req-input"
                                style={{
                                  ...inputBase,
                                  borderColor: validationErrors.items[index]
                                    ?.quantity
                                    ? palette.danger
                                    : palette.border,
                                }}
                              />
                              {validationErrors.items[index]?.quantity && (
                                <p
                                  style={{
                                    color: palette.danger,
                                    fontSize: 12,
                                    marginTop: 4,
                                    fontWeight: 600,
                                  }}
                                >
                                  {validationErrors.items[index].quantity}
                                </p>
                              )}
                            </div>

                            <div>
                              {item.unit === "other" ? (
                                <div style={{ display: "flex", gap: 8 }}>
                                  <input
                                    type="text"
                                    placeholder="Other"
                                    value={item.custom_unit || ""}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "custom_unit",
                                        e.target.value,
                                      )
                                    }
                                    className="req-input"
                                    style={{
                                      ...inputBase,
                                      flex: 1,
                                      borderColor: validationErrors.items[index]
                                        ?.unit
                                        ? palette.danger
                                        : palette.border,
                                    }}
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleItemChange(index, "unit", "")
                                    }
                                    className="req-action-btn"
                                    style={{
                                      width: 42,
                                      height: 42,
                                      borderRadius: 10,
                                      border: `1.5px solid ${palette.border}`,
                                      background: "#fff",
                                      color: palette.primary,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                    }}
                                    title="Back to unit list"
                                  >
                                    ⌄
                                  </button>
                                </div>
                              ) : (
                                <select
                                  value={item.unit}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "unit",
                                      e.target.value,
                                    )
                                  }
                                  className="req-select"
                                  style={{
                                    ...inputBase,
                                    borderColor: validationErrors.items[index]
                                      ?.unit
                                      ? palette.danger
                                      : palette.border,
                                  }}
                                >
                                  <option value="">Select Unit</option>
                                  <option value="pcs">pcs</option>
                                  <option value="boxes">boxes</option>
                                  <option value="bottles">bottles</option>
                                  <option value="packs">packs</option>
                                  <option value="strips">strips</option>
                                  <option value="tubes">tubes</option>
                                  <option value="sachets">sachets</option>
                                  <option value="kg">kg</option>
                                  <option value="g">g</option>
                                  <option value="litre">litre</option>
                                  <option value="ml">ml</option>
                                  <option value="tablets">tablets</option>
                                  <option value="other">Other</option>
                                </select>
                              )}
                              {validationErrors.items[index]?.unit && (
                                <p
                                  style={{
                                    color: palette.danger,
                                    fontSize: 12,
                                    marginTop: 4,
                                    fontWeight: 600,
                                  }}
                                >
                                  {validationErrors.items[index].unit}
                                </p>
                              )}
                            </div>

                            <div>
                              <div style={{ display: "flex", gap: 8 }}>
                                <input
                                  type="text"
                                  placeholder="Est. value (Rs.)"
                                  value={item.estimated_value}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "estimated_value",
                                      e.target.value,
                                    )
                                  }
                                  className="req-input"
                                  style={{
                                    ...inputBase,
                                    flex: 1,
                                    borderColor: validationErrors.items[index]
                                      ?.estimated_value
                                      ? palette.danger
                                      : palette.border,
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeItemRow(index)}
                                  className="req-action-btn"
                                  style={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 10,
                                    border: "none",
                                    background: "#FEF2F2",
                                    color: "#dc2626",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    cursor: "pointer",
                                    // eslint-disable-next-line
                                    border: "1px solid #FECACA",
                                  }}
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                              {validationErrors.items[index]
                                ?.estimated_value && (
                                <p
                                  style={{
                                    color: palette.danger,
                                    fontSize: 12,
                                    marginTop: 4,
                                    fontWeight: 600,
                                  }}
                                >
                                  {
                                    validationErrors.items[index]
                                      .estimated_value
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Error */}
                  {errorMessage && (
                    <div
                      style={{
                        padding: "12px 16px",
                        borderRadius: 12,
                        background: "#FEF2F2",
                        border: "1px solid #FECACA",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#dc2626"
                        strokeWidth="2.2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p
                        style={{
                          color: "#dc2626",
                          fontSize: 13.5,
                          fontWeight: 600,
                          margin: 0,
                        }}
                      >
                        {errorMessage}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 10,
                      paddingTop: 8,
                      borderTop: `1px solid ${palette.border}`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={closeModal}
                      className="req-action-btn"
                      style={{
                        padding: "12px 24px",
                        borderRadius: 14,
                        border: `1.5px solid ${palette.border}`,
                        color: palette.primary,
                        background: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAdding || isUpdating}
                      className="req-action-btn"
                      style={{
                        padding: "12px 28px",
                        borderRadius: 14,
                        border: "none",
                        background:
                          isAdding || isUpdating
                            ? "#9D8EC4"
                            : "linear-gradient(135deg, #5E548E, #7B6EA8)",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 14,
                        cursor:
                          isAdding || isUpdating ? "not-allowed" : "pointer",
                        boxShadow: "0 4px 16px rgba(94,84,142,0.3)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {isAdding || isUpdating ? (
                        <>
                          <div
                            style={{
                              width: 14,
                              height: 14,
                              border: "2px solid rgba(255,255,255,0.35)",
                              borderTopColor: "#fff",
                              borderRadius: "50%",
                              animation: "spin 0.8s linear infinite",
                            }}
                          />
                          {isEditMode ? "Updating…" : "Creating…"}
                        </>
                      ) : (
                        <>
                          <svg
                            width="15"
                            height="15"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d={
                                isEditMode
                                  ? "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                  : "M12 4v16m8-8H4"
                              }
                            />
                          </svg>
                          {isEditMode ? "Update Request" : "Create Request"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MakeRequest;
