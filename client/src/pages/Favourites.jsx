
import { useEffect, useState } from "react";
import api from "../api";
import SEO from "../components/SEO.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import { SkeletonGrid, ErrorMessage } from "../components/Skeleton.jsx";

export default function Favourites() {
  const [properties, setProperties] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api.get("/favourites")
      .then((r) => { setProperties(r.data); setStatus("done"); })
      .catch(() => setStatus("error"));
  }, []);

  const remove = (id) => setProperties((prev) => prev.filter((p) => p._id !== id));

  return (
    <div className="section container">
      <SEO title="Saved Homes" description="Your favourite saved properties." path="/favourites" />
      <h1 className="h1-plain" style={{ marginBottom: 24 }}>My Saved Homes ({properties.length})</h1>
      {status === "loading" && <SkeletonGrid />}
      {status === "error" && <ErrorMessage onRetry={() => window.location.reload()} />}
      {status === "done" && (
        properties.length === 0
          ? <p>You haven't saved any properties yet. Tap the heart on any listing to save it here.</p>
          : <div className="grid">{properties.map((p) => <PropertyCard key={p._id} p={p} fav onUnfav={remove} />)}</div>
      )}
    </div>
  );
}
