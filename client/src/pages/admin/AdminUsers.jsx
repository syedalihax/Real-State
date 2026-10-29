
import { useEffect, useState } from "react";
import { FiShield, FiUser, FiTrash2 } from "react-icons/fi";
import api from "../../api";
import { Spinner, ErrorMessage } from "../../components/Skeleton.jsx";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = () => {
    setStatus("loading");
    api.get("/admin/users").then((r) => { setUsers(r.data); setStatus("done"); })
      .catch(() => setStatus("error"));
  };
  useEffect(() => { load(); }, []);

  const toggleRole = async (u) => {
    await api.patch(`/admin/users/${u._id}/role`, { role: u.role === "admin" ? "user" : "admin" });
    load();
  };
  const del = async (id) => { if (confirm("Delete user?")) { await api.delete(`/admin/users/${id}`); load(); } };

  return (
    <>
      <h1 className="h1-plain" style={{ marginBottom: 20, fontSize: 24 }}>Users</h1>
      {status === "loading" && <Spinner />}
      {status === "error" && <ErrorMessage onRetry={load} />}
      {status === "done" && (
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`tag ${u.role === "admin" ? "active" : "draft"}`}>{u.role}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="small-btn edit" onClick={() => toggleRole(u)}>
                    {u.role === "admin" ? <FiUser aria-hidden="true" style={{ verticalAlign: "-2px" }} /> : <FiShield aria-hidden="true" style={{ verticalAlign: "-2px" }} />}
                    {u.role === "admin" ? " Make User" : " Make Admin"}
                  </button>
                  <button className="small-btn del" onClick={() => del(u._id)}>
                    <FiTrash2 aria-hidden="true" style={{ verticalAlign: "-2px" }} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
