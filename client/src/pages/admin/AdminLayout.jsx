
import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiHome, FiPlusCircle, FiMail, FiUsers, FiGlobe } from "react-icons/fi";

const links = [
  { to: "/admin", end: true, icon: FiGrid, label: "Dashboard" },
  { to: "/admin/properties", icon: FiHome, label: "Properties" },
  { to: "/admin/properties/new", icon: FiPlusCircle, label: "Add Property" },
  { to: "/admin/inquiries", icon: FiMail, label: "Inquiries" },
  { to: "/admin/users", icon: FiUsers, label: "Users" },
  { to: "/", icon: FiGlobe, label: "View Website" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <aside className="bg-slate-950 text-slate-200 md:w-64">
        <div className="border-b border-slate-800 px-5 py-5 text-xl font-black text-white">
          Real<span className="text-brand-500">Estate</span>
        </div>
        <nav aria-label="Admin navigation" className="flex flex-col gap-1 p-3 md:p-4">
          {links.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? "bg-brand-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
              }
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main>
    </div>
  );
}
