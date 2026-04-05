import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    nic: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    if (step === 0) {
      return (
        form.first_name &&
        form.last_name &&
        form.email.includes("@") &&
        form.password.length >= 8
      );
    }
    if (step === 1) {
      return (
        /^\d{9}[Vv]$|^\d{12}$/.test(form.nic) &&
        (!form.phone || /^07\d{8}$/.test(form.phone))
      );
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
    else alert("Please fill correctly!");
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

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

    console.log("SENDING:", payload);

    const res = await axios.post(
      "http://localhost:8000/api/donors/register",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("SUCCESS:", res.data);

    localStorage.setItem("donorId", res.data._id);
    localStorage.setItem("donorName", res.data.first_name); 

    // ✅ REDIRECT to donate page
    navigate("/donate");

  } catch (err) {
    console.log("ERROR:", err.response?.data);
    alert(err.response?.data?.message || "Registration Failed");
  }

  setLoading(false);
};

  return (
    <>
      <style>{`
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

        /* LEFT PANEL - Gentle & Caring Theme */
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

        /* Decorative gentle elements */
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

        .left h1 .highlight {
          color: #E5989B;
          display: inline-block;
        }

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

        /* RIGHT PANEL */
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
          transition: transform 0.2s ease;
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

        input {
          width: 100%;
          padding: 14px 16px;
          margin-bottom: 16px;
          border-radius: 14px;
          border: 1.5px solid #F0E5E8;
          background: white;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          box-sizing: border-box;
          font-family: inherit;
        }

        input:focus {
          outline: none;
          border-color: #E5989B;
          box-shadow: 0 0 0 3px rgba(229, 152, 155, 0.15);
        }

        input::placeholder {
          color: #D1BCC1;
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

        button:hover {
          background: #E5989B;
          transform: translateY(-1px);
        }

        button:active {
          transform: translateY(0);
        }

        .btn-row {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .btn-secondary {
          background: #FDF5F7;
          color: #5E548E;
          border: 1px solid #F0E5E8;
        }

        .btn-secondary:hover {
          background: #FEF0F3;
          color: #E5989B;
          transform: translateY(-1px);
        }

        /* Step indicator */
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

        .active {
          background: #E5989B;
          width: 68px;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .container {
            grid-template-columns: 1fr;
          }
          .left {
            display: none;
          }
          .right {
            padding: 1.5rem;
          }
          .form {
            padding: 1.5rem;
          }
        }

        .small-note {
          font-size: 0.7rem;
          color: #B5838D;
          margin-top: -10px;
          margin-bottom: 12px;
          display: block;
        }

        hr {
          margin: 20px 0;
          border: none;
          border-top: 1px solid #FDF5F7;
        }

        /* Success message style (if needed) */
        .success-message {
          background: rgba(229, 152, 155, 0.1);
          border-left: 3px solid #E5989B;
          padding: 12px;
          border-radius: 8px;
          color: #5E548E;
        }
      `}</style>

      <div className="container">
        {/* LEFT PANEL - Gentle & Caring Messaging */}
        <div className="left">
          <div className="donor-badge">
            Gentle Care & Compassion
          </div>
          <h1>
            Every donation <span className="highlight">wraps them in care</span>.<br />
            Join with kindness<br />
            today.
          </h1>
          <p>
            Your tender support provides comfort, treatment, and gentle care 
            for cancer patients walking their healing journey. Together, we nurture hope.
          </p>
        </div>

        {/* RIGHT PANEL - Registration Form */}
        <div className="right">
          <div className="form">
            <h2>Become a donor</h2>
            <div className="form-subhead">
              Join our circle of kindness
            </div>

            {/* STEP INDICATOR */}
            <div className="steps">
              <span className={`step-dot ${step === 0 && "active"}`} />
              <span className={`step-dot ${step === 1 && "active"}`} />
              <span className={`step-dot ${step === 2 && "active"}`} />
            </div>

            <form onSubmit={handleSubmit}>
              {/* STEP 1 */}
              {step === 0 && (
                <>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First name"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last name"
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    onChange={handleChange}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Create password (min. 8 characters)"
                    onChange={handleChange}
                  />

                  <button type="button" onClick={nextStep}>
                    Continue →
                  </button>
                </>
              )}

              {/* STEP 2 */}
              {step === 1 && (
                <>
                  <input
                    type="text"
                    name="nic"
                    placeholder="NIC number"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone number (optional)"
                    onChange={handleChange}
                  />
                  <span className="small-note"> We'll share gentle updates about your impact</span>

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

              {/* STEP 3 */}
              {step === 2 && (
                <>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address (for official records)"
                    onChange={handleChange}
                  />
                  <span className="small-note"> Your information is held with care and confidentiality</span>

                  <div className="btn-row">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={prevStep}
                    >
                      ← Back
                    </button>
                    <button type="submit">
                      {loading ? "Processing..." : "Complete registration"}
                    </button>
                  </div>
                </>
              )}
            </form>
            <hr />
            <div style={{ fontSize: '0.7rem', textAlign: 'center', color: '#B5838D' }}>
              By registering, you join a circle of kindness dedicated to bringing gentle care and hope to cancer patients. 💗
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;