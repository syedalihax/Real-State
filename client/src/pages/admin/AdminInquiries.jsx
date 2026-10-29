
import { useEffect, useState } from "react";
import { FiCheck, FiTrash2 } from "react-icons/fi";
import api from "../../api";
import { Spinner, ErrorMessage } from "../../components/Skeleton.jsx";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = () => {
    setStatus("loading");
    api.get("/inquiries").then((r) => { setInquiries(r.data); setStatus("done"); })
      .catch(() => setStatus("error"));
  };
  useEffect(() => { load(); }, []);

  const update = async (id, s) => { await api.patch(`/inquiries/${id}`, { status: s }); load(); };
  const del = async (id) => { if (confirm("Delete inquiry?")) { await api.delete(`/inquiries/${id}`); load(); } };

  return (
    <>
      <h1 className="h1-plain" style={{ marginBottom: 20, fontSize: 24 }}>Inquiries</h1>
      {status === "loading" && <Spinner />}
      {status === "error" && <ErrorMessage onRetry={load} />}
      {status === "done" && (
        inquiries.length === 0 ? <p>No inquiries yet.</p> : (
          <table>
            <thead><tr><th>Property</th><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {inquiries.map((i) => (
                <tr key={i._id}>
                  <td>{i.property?.title}</td>
                  <td>{i.name}</td>
                  <td>{i.email}</td>
                  <td>{i.phone}</td>
                  <td>{i.message}</td>
                  <td><span className={`tag ${i.status === "new" ? "active" : "draft"}`}>{i.status}</span></td>
                  <td>
                    {i.status === "new" && (
                      <button className="small-btn edit" onClick={() => update(i._id, "contacted")}>
                        <FiCheck aria-hidden="true" style={{ verticalAlign: "-2px" }} /> Contacted
                      </button>
                    )}
                    <button className="small-btn del" onClick={() => del(i._id)}>
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
