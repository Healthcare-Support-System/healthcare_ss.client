import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/path";
import { useAuth } from "../contexts/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 mock login (replace with API later)
    const userData = {
      email,
      name: "Demo User",
    };

    login(userData);
    navigate(ROUTES.HOME);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sign In</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p onClick={() => navigate(ROUTES.SIGNUP)} style={{ cursor: "pointer" }}>
        Don't have an account? Sign Up
      </p>
    </div>
  );
};

export default SignIn;