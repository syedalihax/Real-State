
import { useEffect, useState } from "react";
import api from "../api";
import SEO from "../components/SEO.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { SkeletonGrid, ErrorMessage } from "../components/Skeleton.jsx";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api.get("/properties/featured")
      .then((r) => { setFeatured(r.data); setStatus("done"); })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <>
      <SEO
        title="Buy, Sell & Rent Property Online"
        description="Browse homes, apartments and investment properties available for sale or rent in your preferred locations."
        path="/"
      />

      <section className="bg-[radial-gradient(circle_at_top,_rgba(225,29,72,0.12),_transparent_40%),linear-gradient(135deg,#0f172a,#1e293b_42%,#334155)] py-16 text-white md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-rose-200">Property search</p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Find the right place to live or invest</h1>
            <p className="mt-4 text-base text-slate-200 sm:text-lg">Search homes, apartments, and investment listings across your preferred suburbs and price range.</p>
          </div>
          <div className="mt-8"><SearchBar /></div>
        </div>
      </section>

      <section className="container py-12 sm:py-16">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Featured</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Featured Properties</h2>
          </div>
          <a href="/listings" className="hidden text-sm font-semibold text-brand-600 hover:text-brand-700 sm:inline-flex">View all listings →</a>
        </div>

        {status === "loading" && <SkeletonGrid count={3} />}
        {status === "error" && <ErrorMessage onRetry={() => window.location.reload()} />}
        {status === "done" && (
          featured.length === 0
            ? <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-600">No featured properties right now — check <a href="/listings" className="font-semibold text-brand-600">all listings</a>.</p>
            : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{featured.map((p) => <PropertyCard key={p._id} p={p} />)}</div>
        )}
      </section>
    </>
  );
}
