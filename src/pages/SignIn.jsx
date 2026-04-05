import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/path";
import { useAuth } from "../contexts/AuthContext";
import { useLogin } from "../hooks/useAuthApi";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    mutate(
      { email, password },
      {
        onSuccess: (response) => {
          login(response);

          const role = response?.user?.role;

          if (role === "donor") {
            localStorage.setItem("donorId", response?.user?.id || "");
            localStorage.setItem(
              "donorName",
              response?.user?.full_name ||
                response?.user?.first_name ||
                response?.user?.name ||
                "",
            );
            navigate(ROUTES.DONATE);
          } else if (role === "admin") {
            navigate(ROUTES.ADMIN_DASHBOARD);
          } else if (role === "social_worker") {
            navigate(ROUTES.SOCIAL_WORKER_DASHBOARD);
          } else {
            navigate(ROUTES.HOME);
          }
        },
        onError: (error) => {
          setErrorMessage(
            error?.response?.data?.message || "Login failed. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sign In</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && (
          <p style={{ color: "red", marginBottom: "12px" }}>{errorMessage}</p>
        )}

        <button type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>

      <p
        onClick={() => navigate(ROUTES.SIGNUP)}
        style={{ cursor: "pointer", marginTop: "12px" }}
      >
        Don't have an account? Sign Up
      </p>
    </div>
  );
};

export default SignIn;
