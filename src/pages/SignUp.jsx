import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/path";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 mock register (replace with API)
    console.log("User Registered:", { name, email, password });

    navigate(ROUTES.SIGNIN);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <button type="submit">Register</button>
      </form>

      <p onClick={() => navigate(ROUTES.SIGNIN)} style={{ cursor: "pointer" }}>
        Already have an account? Sign In
      </p>
    </div>
  );
};

export default SignUp;
