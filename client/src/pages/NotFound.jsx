
import { Link } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft, FiHome } from "react-icons/fi";
import SEO from "../components/SEO.jsx";

export default function NotFound() {
  return (
    <div className="not-found">
      <SEO title="Page Not Found (404)" description="The page you are looking for does not exist." path="/404" />
      <FiAlertTriangle aria-hidden="true" size={64} color="#e4002b" />
      <h1>404 — Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
        <Link to="/" className="btn"><FiHome aria-hidden="true" style={{ verticalAlign: "-2px" }} /> Back to Home</Link>
        <button className="btn outline" onClick={() => window.history.back()}>
          <FiArrowLeft aria-hidden="true" style={{ verticalAlign: "-2px" }} /> Go Back
        </button>
      </div>
    </div>
  );
}
