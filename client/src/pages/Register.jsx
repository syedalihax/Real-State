
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import api from "../api";
import SEO from "../components/SEO.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter your name");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="form-card">
      <SEO title="Create Account" description="Register a free RealEstate account to save favourite properties and contact agents." path="/register" />
      <h1 className="h1-plain" style={{ fontSize: 24 }}>Create Account</h1>
      {error && <p className="form-error" role="alert">{error}</p>}
      <form onSubmit={submit} noValidate>
        <label className="sr-only" htmlFor="reg-name">Full name</label>
        <div className="input-icon">
          <FiUser aria-hidden="true" />
          <input id="reg-name" required autoComplete="name" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <label className="sr-only" htmlFor="reg-email">Email</label>
        <div className="input-icon">
          <FiMail aria-hidden="true" />
          <input id="reg-email" required type="email" autoComplete="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <label className="sr-only" htmlFor="reg-password">Password</label>
        <div className="input-icon">
          <FiLock aria-hidden="true" />
          <input id="reg-password" required type="password" autoComplete="new-password" placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn block" disabled={loading}>{loading ? "Creating account..." : "Register"}</button>
      </form>
      <p style={{ marginTop: 14, textAlign: "center" }}>
        Have an account? <Link to="/login" style={{ color: "var(--red)" }}>Sign In</Link>
      </p>
    </div>
  );
}
