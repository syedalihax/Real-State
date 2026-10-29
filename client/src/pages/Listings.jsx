
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import SEO from "../components/SEO.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import { SkeletonGrid, ErrorMessage } from "../components/Skeleton.jsx";

export default function Listings() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ properties: [], total: 0, pages: 1, page: 1 });
  const [sort, setSort] = useState(params.get("sort") || "newest");
  const [status, setStatus] = useState("loading");
  const page = Number(params.get("page") || 1);

  useEffect(() => {
    setStatus("loading");
    api.get("/properties", { params: { ...Object.fromEntries(params), sort } })
      .then((r) => { setData(r.data); setStatus("done"); })
      .catch(() => setStatus("error"));
  }, [params, sort]);

  const goToPage = (p) => {
    params.set("page", p);
    setParams(params);
    window.scrollTo(0, 0);
  };

  return (
    <div className="section container">
      <SEO
        title="Property Listings — Houses, Apartments & Land"
        description="Browse all properties for sale and rent. Filter by price, bedrooms, location and more."
        path={`/listings?${params.toString()}`}
      />
      <div className="listings-head">
        <h1 className="h1-plain">{status === "done" ? `${data.total} Properties Found` : "Properties"}</h1>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="sr-only">Sort by</span>
          <select style={{ width: "auto", margin: 0 }} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Most viewed</option>
          </select>
        </label>
      </div>
      {status === "loading" && <SkeletonGrid />}
      {status === "error" && <ErrorMessage onRetry={() => window.location.reload()} />}
      {status === "done" && (
        <>
          {data.properties.length === 0 && <p>No properties match your search. Try adjusting the filters.</p>}
          <div className="grid">{data.properties.map((p) => <PropertyCard key={p._id} p={p} />)}</div>
          {data.pages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              {Array.from({ length: data.pages }, (_, i) => (
                <button key={i} className={page === i + 1 ? "active" : ""} onClick={() => goToPage(i + 1)} aria-current={page === i + 1 ? "page" : undefined}>
                  {i + 1}
                </button>
              ))}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
