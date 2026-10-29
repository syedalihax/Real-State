
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { BedIcon, BathIcon, AreaIcon, MarkerIcon, HeartIcon } from "./PropertyIcons.jsx";

function PropertyMetaItem({ icon, value, label }) {
  return (
    <div className="flex items-center justify-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 sm:text-[12px]">
      <span className="flex items-center justify-center text-slate-700">{icon}</span>
      <span>{value ?? "—"}</span>
      {label && <span className="hidden sm:inline">{label}</span>}
    </div>
  );
}

export default function PropertyCard({ p, fav = false, onUnfav }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(fav);

  const toggleFav = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    try {
      const { data } = await api.post("/favourites", { propertyId: p._id });
      setIsFav(data.favourited);
      toast(data.favourited ? "Added to favourites" : "Removed from favourites");
      if (!data.favourited) onUnfav?.(p._id);
    } catch {
      toast("Could not update favourites", "error");
    }
  };

  return (
    <Link to={`/property/${p._id}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <img
          src={p.images?.[0] || "/images/fallback-house.svg"}
          alt={`${p.title} — ${p.type === "rent" ? "rental" : "for sale"} in ${p.city}`}
          className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          width="400" height="250" loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-white">{p.type === "rent" ? "FOR RENT" : "FOR SALE"}</span>
        <button
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-sm transition hover:scale-105 ${isFav ? "text-brand-600" : "text-slate-700"}`}
          onClick={toggleFav}
          aria-label={isFav ? "Remove from favourites" : "Save to favourites"}
          aria-pressed={isFav}
        >
          <HeartIcon filled={isFav} className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-end justify-between gap-2">
          <div className="text-2xl font-bold text-brand-600">
            ${p.price?.toLocaleString?.() ?? "—"}
            {p.type === "rent" && <span className="ml-1 text-sm font-medium text-slate-500">/wk</span>}
          </div>
        </div>

        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-slate-900">{p.title}</h3>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <PropertyMetaItem icon={<BedIcon className="h-3.5 w-3.5" />} value={p.beds ?? "—"} label="Beds" />
          <PropertyMetaItem icon={<BathIcon className="h-3.5 w-3.5" />} value={p.baths ?? "—"} label="Baths" />
          <PropertyMetaItem icon={<AreaIcon className="h-3.5 w-3.5" />} value={p.area ?? "—"} label="m²" />
          <PropertyMetaItem icon={<MarkerIcon className="h-3.5 w-3.5" />} value={p.city || "—"} label="" />
        </div>
      </div>
    </Link>
  );
}
