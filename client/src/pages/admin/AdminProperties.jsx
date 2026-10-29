
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlusCircle, FiEdit, FiTrash2 } from "react-icons/fi";
import api from "../../api";
import { Spinner, ErrorMessage } from "../../components/Skeleton.jsx";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = () => {
    setStatus("loading");
    api.get("/admin/properties").then((r) => { setProperties(r.data); setStatus("done"); })
      .catch(() => setStatus("error"));
  };
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm("Delete this property?")) return;
    await api.delete(`/properties/${id}`);
    load();
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 className="h1-plain" style={{ fontSize: 24 }}>Properties</h1>
        <Link to="/admin/properties/new" className="btn"><FiPlusCircle aria-hidden="true" style={{ verticalAlign: "-2px" }} /> Add Property</Link>
      </div>
      {status === "loading" && <Spinner />}
      {status === "error" && <ErrorMessage onRetry={load} />}
      {status === "done" && (
        properties.length === 0 ? <p>No properties yet. Add your first listing!</p> : (
          <table>
            <thead><tr><th>Image</th><th>Title</th><th>Type</th><th>Price</th><th>City</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id}>
                  <td><img src={p.images?.[0] || "/images/fallback-house.svg"} alt={p.title} width="60" height="45" loading="lazy" /></td>
                  <td>{p.title}</td>
                  <td>{p.type}</td>
                  <td>${p.price.toLocaleString()}</td>
                  <td>{p.city}</td>
                  <td><span className={`tag ${p.status}`}>{p.status}</span></td>
                  <td>
                    <Link to={`/admin/properties/edit/${p._id}`} className="small-btn edit" aria-label={`Edit ${p.title}`}>
                      <FiEdit aria-hidden="true" style={{ verticalAlign: "-2px" }} /> Edit
                    </Link>
                    <button className="small-btn del" onClick={() => del(p._id)} aria-label={`Delete ${p.title}`}>
                      <FiTrash2 aria-hidden="true" style={{ verticalAlign: "-2px" }} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </>
  );
}
