
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiUser, FiLogOut, FiHome, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Buy" },
    { to: "/?type=rent", label: "Rent" },
    { to: "/listings", label: "All Listings" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container flex items-center justify-between py-3 md:py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-brand-600" aria-label="RealEstate home">
          <FiHome aria-hidden="true" className="h-5 w-5" />
          <span className="text-slate-900">Real<span className="text-brand-600">Estate</span></span>
        </Link>

        <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-200 text-slate-700 md:hidden" aria-label="Toggle navigation" onClick={() => setOpen((v) => !v)}>
          {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>

        <div className={`${open ? "flex" : "hidden"} absolute left-4 right-4 top-[68px] flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft md:static md:flex md:flex-row md:items-center md:gap-5 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-sm font-medium text-slate-600 hover:text-brand-600 md:text-slate-700" onClick={() => setOpen(false)}>{link.label}</Link>
          ))}

          {user && (
            <Link to="/favourites" aria-label="Saved homes" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-600" onClick={() => setOpen(false)}>
              <FiHeart aria-hidden="true" className="h-4 w-4" /> Saved
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-brand-600" onClick={() => setOpen(false)}>Admin Panel</Link>
          )}

          {user ? (
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700"><FiUser className="h-4 w-4" /> {user.name}</span>
              <button className="btn-primary btn-secondary" onClick={() => { logout(); navigate("/"); setOpen(false); }}>
                <FiLogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary w-full text-center md:w-auto" onClick={() => setOpen(false)}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
