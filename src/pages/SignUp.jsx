import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const rules = {
  first_name: (v) => {
    if (!v.trim()) return "First name is required";
    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v.trim()))
      return "First name can only contain letters and spaces";
    return null;
  },
  last_name: (v) => {
    if (!v.trim()) return "Last name is required";
    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v.trim()))
      return "Last name can only contain letters and spaces";
    return null;
  },
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
      ? null
      : "Enter a valid email address",
  password: (v) =>
    v.length >= 8 ? null : "Password must be at least 8 characters long",
  nic: (v) =>
    /^(?:\d{9}[VvXx]|\d{12})$/.test(v.trim())
      ? null
      : "Enter a valid NIC (e.g. 123456789V or 200012345678)",
  phone: (v) =>
    v === "" || /^07\d{8}$/.test(v.trim())
      ? null
      : "Enter a valid phone number (e.g. 0771234567)",
  address: () => null,
};

// Maps backend error messages to their field
const backendFieldMap = {
  "Email already registered": "email",
  "NIC already registered": "nic",
  "Invalid email address": "email",
  "Invalid NIC number": "nic",
  "Invalid phone number": "phone",
  "First name can only contain letters and spaces": "first_name",
  "Last name can only contain letters and spaces": "last_name",
  "Password must be at least 8 characters long": "password",
};

const ErrorMsg = ({ message }) =>
  message ? (
    <span className="field-error">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5.5" stroke="#E24B4A" />
        <path
          d="M6 3.5v3M6 8.5v.5"
          stroke="#E24B4A"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      {message}
    </span>
  ) : (
    <span className="field-error" />
  );

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [apiErrors, setApiErrors] = useState({});

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    nic: "",
    phone: "",
    address: "",
  });

  const getError = (name) => apiErrors[name] || rules[name]?.(form[name]) || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });
    // Clear API error for this field as user corrects it
    if (apiErrors[name]) setApiErrors({ ...apiErrors, [name]: null });
  };

  const inputClass = (name) => {
    if (!touched[name]) return "";
    return getError(name) ? "input-error" : "input-valid";
  };

  const stepFields = [
    ["first_name", "last_name", "email", "password"],
    ["nic", "phone"],
    ["address"],
  ];

  const validateStep = () => {
    const fields = stepFields[step];
    const newTouched = { ...touched };
    fields.forEach((f) => (newTouched[f] = true));
    setTouched(newTouched);
    return fields.every((f) => !rules[f]?.(form[f]));
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    setApiErrors({});

    try {
      const payload = {
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        nic: form.nic,
        phone: form.phone || undefined,
        address: form.address || undefined,
      };

      await axios.post("http://localhost:8000/api/donors/register", payload, {
        headers: { "Content-Type": "application/json" },
      });

      navigate("/donate");
    } catch (err) {
      const message = err.response?.data?.message;
      const field = message ? backendFieldMap[message] : null;

      if (field) {
        // Jump back to the step containing that field and show inline error
        const fieldStep = stepFields.findIndex((arr) => arr.includes(field));
        if (fieldStep !== -1 && fieldStep !== step) setStep(fieldStep);
        setApiErrors({ [field]: message });
        setTouched((prev) => ({ ...prev, [field]: true }));
      } else {
        alert(message || "Registration failed. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        input:invalid { box-shadow: none; }

        body {
          margin: 0;
          font-family: 'Inter', 'DM Sans', system-ui, -apple-system, sans-serif;
          background: #FFF9F5;
        }
        .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }
        .left {
          background: linear-gradient(135deg, #5E548E 0%, #4A4272 100%);
          color: white;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .left::before {
          content: "🌸";
          font-size: 280px;
          position: absolute;
          bottom: -50px;
          right: -50px;
          opacity: 0.06;
          pointer-events: none;
        }
        .left::after {
          content: "💗";
          font-size: 180px;
          position: absolute;
          top: 20px;
          right: 20px;
          opacity: 0.08;
          pointer-events: none;
        }
        .left h1 {
          font-size: 3rem;
          line-height: 1.2;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
          position: relative;
        }
        .left h1 .highlight { color: #E5989B; }
        .left p {
          font-size: 1rem;
          line-height: 1.5;
          opacity: 0.85;
          margin-top: 1rem;
          max-width: 80%;
          position: relative;
        }
        .donor-badge {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(4px);
          border-radius: 100px;
          padding: 0.5rem 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          margin-top: 2rem;
          width: fit-content;
          position: relative;
        }
        .right {
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFF9F5;
        }
        .form {
          max-width: 440px;
          width: 100%;
          background: white;
          padding: 2rem 2rem 2.5rem;
          border-radius: 28px;
          box-shadow: 0 20px 35px -12px rgba(94, 84, 142, 0.08);
        }
        .form h2 {
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #5E548E;
          letter-spacing: -0.01em;
        }
        .form-subhead {
          color: #B5838D;
          font-size: 0.9rem;
          margin-bottom: 1.75rem;
          border-left: 3px solid #E5989B;
          padding-left: 0.75rem;
        }
        .field { margin-bottom: 2px; }
        input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1.5px solid #F0E5E8;
          background: white;
          font-size: 0.95rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
          font-family: inherit;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }
        input:focus {
          border-color: #E5989B;
          box-shadow: 0 0 0 3px rgba(229, 152, 155, 0.15);
        }
        input::placeholder { color: #D1BCC1; }
        input.input-valid {
          border-color: #86C06D;
          box-shadow: 0 0 0 3px rgba(134, 192, 109, 0.12);
        }
        input.input-error {
          border-color: #E24B4A;
          box-shadow: 0 0 0 3px rgba(226, 75, 74, 0.10);
        }
        .field-error {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.73rem;
          color: #E24B4A;
          min-height: 20px;
          margin: 4px 0 8px 4px;
        }
        button {
          padding: 14px 20px;
          border: none;
          border-radius: 40px;
          background: #5E548E;
          color: white;
          cursor: pointer;
          width: 100%;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        button:hover { background: #E5989B; transform: translateY(-1px); }
        button:active { transform: translateY(0); }
        button:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-row { display: flex; gap: 12px; margin-top: 8px; }
        .btn-secondary {
          background: #FDF5F7;
          color: #5E548E;
          border: 1px solid #F0E5E8;
        }
        .btn-secondary:hover { background: #FEF0F3; color: #E5989B; }
        .steps {
          margin-bottom: 28px;
          display: flex;
          gap: 8px;
          background: #FDF5F7;
          padding: 6px;
          border-radius: 60px;
          width: fit-content;
        }
        .step-dot {
          display: inline-block;
          width: 48px;
          height: 6px;
          border-radius: 3px;
          background: #E8D9DE;
          transition: all 0.25s ease;
        }
        .step-dot.active { background: #E5989B; width: 68px; }
        .small-note {
          font-size: 0.7rem;
          color: #B5838D;
          margin-bottom: 12px;
          display: block;
        }
        hr { margin: 20px 0; border: none; border-top: 1px solid #FDF5F7; }
        @media (max-width: 900px) {
          .container { grid-template-columns: 1fr; }
          .left { display: none; }
          .right { padding: 1.5rem; }
          .form { padding: 1.5rem; }
        }
      `}</style>

      <div className="container">
        <div className="left">
          <div className="donor-badge">Gentle Care & Compassion</div>
          <h1>
            Every donation{" "}
            <span className="highlight">wraps them in care</span>.<br />
            Join with kindness today.
          </h1>
          <p>
            Your tender support provides comfort, treatment, and gentle care for
            cancer patients walking their healing journey. Together, we nurture
            hope.
          </p>
        </div>

        <div className="right">
          <div className="form">
            <h2>Become a donor</h2>
            <div className="form-subhead">Join our circle of kindness</div>

            <div className="steps">
              <span className={`step-dot ${step === 0 ? "active" : ""}`} />
              <span className={`step-dot ${step === 1 ? "active" : ""}`} />
              <span className={`step-dot ${step === 2 ? "active" : ""}`} />
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {step === 0 && (
                <>
                  <div className="field">
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First name"
                      value={form.first_name}
                      onChange={handleChange}
                      className={inputClass("first_name")}
                    />
                    <ErrorMsg
                      message={touched.first_name ? getError("first_name") : null}
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last name"
                      value={form.last_name}
                      onChange={handleChange}
                      className={inputClass("last_name")}
                    />
                    <ErrorMsg
                      message={touched.last_name ? getError("last_name") : null}
                    />
                  </div>
                  <div className="field">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass("email")}
                    />
                    <ErrorMsg
                      message={touched.email ? getError("email") : null}
                    />
                  </div>
                  <div className="field">
                    <input
                      type="password"
                      name="password"
                      placeholder="Create password (min. 8 characters)"
                      value={form.password}
                      onChange={handleChange}
                      className={inputClass("password")}
                    />
                    <ErrorMsg
                      message={touched.password ? getError("password") : null}
                    />
                  </div>
                  <button type="button" onClick={nextStep}>
                    Continue →
                  </button>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="field">
                    <input
                      type="text"
                      name="nic"
                      placeholder="NIC number"
                      value={form.nic}
                      onChange={handleChange}
                      className={inputClass("nic")}
                    />
                    <ErrorMsg
                      message={touched.nic ? getError("nic") : null}
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone number (optional)"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputClass("phone")}
                    />
                    <ErrorMsg
                      message={touched.phone ? getError("phone") : null}
                    />
                  </div>
                  <span className="small-note">
                    We'll share gentle updates about your impact
                  </span>
                  <div className="btn-row">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={prevStep}
                    >
                      ← Back
                    </button>
                    <button type="button" onClick={nextStep}>
                      Continue →
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="field">
                    <input
                      type="text"
                      name="address"
                      placeholder="Address (for official records)"
                      value={form.address}
                      onChange={handleChange}
                      className={inputClass("address")}
                    />
                    <ErrorMsg
                      message={touched.address ? getError("address") : null}
                    />
                  </div>
                  <span className="small-note">
                    Your information is held with care and confidentiality
                  </span>
                  <div className="btn-row">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={prevStep}
                    >
                      ← Back
                    </button>
                    <button type="submit" disabled={loading}>
                      {loading ? "Processing..." : "Complete registration"}
                    </button>
                  </div>
                </>
              )}
            </form>

            <hr />
            <div
              style={{ fontSize: "0.7rem", textAlign: "center", color: "#B5838D" }}
            >
              By registering, you join a circle of kindness dedicated to
              bringing gentle care and hope to cancer patients. 💗
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;