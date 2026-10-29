
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import SEO from "../components/SEO.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Please fill in all fields");
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="form-card">
      <SEO title="Sign In" description="Sign in to your RealEstate account to save homes and manage inquiries." path="/login" />
      <h1 className="h1-plain" style={{ fontSize: 24 }}>Sign In</h1>
      {error && <p className="form-error" role="alert">{error}</p>}
      <form onSubmit={submit} noValidate>
        <label className="sr-only" htmlFor="login-email">Email</label>
        <div className="input-icon">
          <FiMail aria-hidden="true" />
          <input id="login-email" required type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <label className="sr-only" htmlFor="login-password">Password</label>
        <div className="input-icon">
          <FiLock aria-hidden="true" />
          <input id="login-password" required type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn block" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
      </form>
      <p style={{ marginTop: 14, textAlign: "center" }}>
        No account? <Link to="/register" style={{ color: "var(--red)" }}>Register</Link>
      </p>
    </div>
  );
}
