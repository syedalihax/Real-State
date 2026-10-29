
import { useEffect, useState } from "react";
import api from "../../api";
import { Spinner } from "../../components/Skeleton.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => setError(true));
  }, []);
  if (error) return <p className="form-error" role="alert">Failed to load dashboard stats.</p>;
  if (!stats) return <Spinner />;
  const cards = [
    { label: "Total Properties", num: stats.totalProperties },
    { label: "Total Users", num: stats.totalUsers },
    { label: "Total Inquiries", num: stats.totalInquiries },
    { label: "Properties Sold", num: stats.sold },
    { label: "Portfolio Value", num: `$${(stats.totalValue / 1e6).toFixed(1)}M` },
  ];
  return (
    <>
      <h1 className="h1-plain" style={{ marginBottom: 20, fontSize: 24 }}>Dashboard Overview</h1>
      <div className="stats-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <h3>{c.label}</h3>
            <div className="num">{c.num}</div>
          </div>
        ))}
      </div>
    </>
  );
}
