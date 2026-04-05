import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/path";
import { useAuth } from "../contexts/AuthContext";
import { useLogin } from "../hooks/useAuthApi";
import bgImage from "../assets/women-hands-ribbon.jpg";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setErrorMessage("");

  //   mutate(
  //     { email, password },
  //     {
  //       onSuccess: (response) => {
  //         login(response);

  //         const role = response?.user?.role;

  //         if (role === "donor") navigate(ROUTES.DONATE);
  //         else if (role === "admin") navigate(ROUTES.ADMIN_DASHBOARD);
  //         else if (role === "social_worker")
  //           navigate(ROUTES.SOCIAL_WORKER_DASHBOARD);
  //         else navigate(ROUTES.HOME);
  //       },
  //       onError: (error) => {
  //         setErrorMessage(
  //           error?.response?.data?.message ||
  //             "Login failed. Please try again."
  //         );
  //       },
  //     }
  //   );
  // };

  const handleSubmit = (e) => {
  e.preventDefault();
  setErrorMessage("");

  // 🔹 VALIDATION START
  if (!email || !password) {
    setErrorMessage("Please fill in all fields.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    setErrorMessage("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    setErrorMessage("Password must be at least 6 characters.");
    return;
  }
  // 🔹 VALIDATION END

  mutate(
    { email, password },
    {
      onSuccess: (response) => {
        login(response);

        const role = response?.user?.role;

        if (role === "donor") navigate(ROUTES.DONATE);
        else if (role === "admin") navigate(ROUTES.ADMIN_DASHBOARD);
        else if (role === "social_worker")
          navigate(ROUTES.SOCIAL_WORKER_DASHBOARD);
        else navigate(ROUTES.HOME);
      },
      onError: (error) => {
        setErrorMessage(
          error?.response?.data?.message ||
            "Login failed. Please try again."
        );
      },
    }
  );
};

  const colors = {
    primary: "#5E548E",
    accent: "#E5989B",
    background: "#FFF9F5",
    secondary: "#B5838D",
    border: "#F0E5E8",
    inputBg: "#FCF7F8",
    white: "#FFFFFF",
    textDark: "#3F375F",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexWrap: "wrap",
        backgroundColor: colors.background,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* LEFT SIDE (Image + overlay) */}
      <div
        style={{
          flex: "1 1 50%",
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            maxWidth: "520px",
            color: "#fff",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "10px 18px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.15)",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "24px",
            }}
          >
            Gentle Care & Compassion
          </div>

          <h1
            style={{
              fontSize: "58px",
              fontWeight: "800",
              lineHeight: "1.1",
              marginBottom: "20px",
            }}
          >
            Welcome back to
            <br />
            <span style={{ color: "#E5989B" }}>
              care that connects.
            </span>
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.7",
              opacity: 0.9,
            }}
          >
            Continue supporting lives with kindness, dignity, and care.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (Login Form) */}
      <div
        style={{
          flex: "1 1 50%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "450px",
            backgroundColor: colors.white,
            borderRadius: "26px",
            padding: "40px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            border: `1px solid ${colors.border}`,
          }}
        >
            <h2
             style={{
             color: colors.primary,
             fontSize: "36px",
             marginBottom: "8px",
             fontWeight: "600", // 👈 added
            }}
             >
             Sign In
          </h2>

          <p
            style={{
              color: colors.secondary,
              marginBottom: "24px",
              fontSize: "15px",
            }}
          >
            Access your account securely
          </p>

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.inputBg,
                marginBottom: "16px",
                fontSize: "15px",
              }}
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.inputBg,
                marginBottom: "12px",
                fontSize: "15px",
              }}
            />

            {/* OPTIONS */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "18px",
                fontSize: "14px",
                color: colors.secondary,
              }}
            >
              <label style={{ cursor: "pointer" }}>
                <input type="checkbox" /> Remember me
              </label>

              <span style={{ cursor: "pointer" }}>
                Forgot password?
              </span>
            </div>

            {/* ERROR */}
            {errorMessage && (
              <div
                style={{
                  background: "#FFF1F2",
                  color: "#B25A66",
                  padding: "12px",
                  borderRadius: "10px",
                  marginBottom: "16px",
                  fontSize: "14px",
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isPending}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                backgroundColor: colors.accent,
                color: "#fff",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? "Logging in..." : "Sign In"}
            </button>
          </form>

          {/* SIGNUP */}
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "14px",
              color: colors.secondary,
            }}
          >
            Don’t have an account?{" "}
            <span
              onClick={() => navigate(ROUTES.SIGNUP)}
              style={{
                color: colors.primary,
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;