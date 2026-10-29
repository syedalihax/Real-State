
import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter, FiHome } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-200">
      <div className="container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-black text-white">
            <FiHome aria-hidden="true" className="h-5 w-5 text-brand-500" />
            Real<span className="text-brand-500">Estate</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Discover property opportunities for sale and rent across targeted markets.
          </p>
          <div className="mt-5 flex gap-3 text-lg text-slate-400">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="transition hover:text-white"><FiFacebook aria-hidden="true" /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="transition hover:text-white"><FiInstagram aria-hidden="true" /></a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="transition hover:text-white"><FiTwitter aria-hidden="true" /></a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">Explore</h4>
          <div className="space-y-2 text-sm text-slate-400">
            <Link to="/?type=sale" className="block hover:text-white">Buy</Link>
            <Link to="/?type=rent" className="block hover:text-white">Rent</Link>
            <Link to="/listings" className="block hover:text-white">All Listings</Link>
            <Link to="/favourites" className="block hover:text-white">Saved Homes</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">Company</h4>
          <div className="space-y-2 text-sm text-slate-400">
            <Link to="/" className="block hover:text-white">About</Link>
            <Link to="/listings" className="block hover:text-white">Portfolio</Link>
            <Link to="/contact" className="block hover:text-white">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">Account</h4>
          <div className="space-y-2 text-sm text-slate-400">
            <Link to="/login" className="block hover:text-white">Sign In</Link>
            <Link to="/register" className="block hover:text-white">Register</Link>
            <Link to="/admin" className="block hover:text-white">Admin Panel</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} RealEstate. All rights reserved.</div>
    </footer>
  );
}
