
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FiHome, FiDroplet, FiMaximize, FiEye, FiCheck, FiPhone, FiMail } from "react-icons/fi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api";
import SEO from "../components/SEO.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Spinner, ErrorMessage, SkeletonGrid } from "../components/Skeleton.jsx";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://yourdomain.com";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function PropertyDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [p, setP] = useState(null);
  const [status, setStatus] = useState("loading");
  const [mainImg, setMainImg] = useState(0);
  const [similar, setSimilar] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setStatus("loading");
    setP(null);
    api.get(`/properties/${id}`).then((r) => { setP(r.data); setStatus("done"); setMainImg(0); })
      .catch(() => setStatus("error"));
    api.get(`/properties/${id}/similar`).then((r) => setSimilar(r.data)).catch(() => {});
    window.scrollTo(0, 0);
  }, [id]);

  if (status === "loading") return <div className="section container"><Spinner /></div>;
  if (status === "error") return <div className="section container"><ErrorMessage message="Property not found or unavailable." onRetry={() => window.location.reload()} /></div>;

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/inquiries", { ...form, property: p._id });
      setSent(true);
      toast("Enquiry sent successfully!");
    } catch {
      toast("Failed to send enquiry. Please try again.", "error");
    }
  };

  const hasCoords = p.lat && p.lng;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: p.description,
    url: `${SITE_URL}/property/${p._id}`,
    image: p.images,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "AUD",
      availability: p.status === "active" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: p.address,
      addressLocality: p.city,
      addressRegion: p.state,
      postalCode: p.pincode,
      addressCountry: "AU",
    },
    numberOfRooms: p.beds,
    floorSize: { "@type": "QuantitativeValue", value: p.area, unitCode: "MTK" },
  };

  return (
    <div className="section container">
      <SEO
        title={p.title}
        description={p.description?.slice(0, 160) || `${p.beds} bed ${p.category} in ${p.city} — $${p.price.toLocaleString()}`}
        path={`/property/${p._id}`}
        image={p.images?.[0]}
        type="article"
        jsonLd={jsonLd}
      />
      <img className="detail-hero" src={p.images[mainImg]} alt={`${p.title} — photo ${mainImg + 1}`} width="1200" height="420" />
      {p.images.length > 1 && (
        <div className="thumbs">
          {p.images.map((img, i) => (
            <img key={i} src={img} onClick={() => setMainImg(i)} alt={`${p.title} — thumbnail ${i + 1}`} loading="lazy" width="110" height="80" />
          ))}
        </div>
      )}
      <div className="two-col" style={{ marginTop: 24 }}>
        <div>
          <div className="price" style={{ fontSize: 32 }}>${p.price.toLocaleString()}</div>
          <h1 style={{ margin: "10px 0", fontSize: 28 }}>{p.title}</h1>
          <p className="meta">{p.address}, {p.city}, {p.state} {p.pincode}</p>
          <p className="meta" style={{ marginTop: 8, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <span><FiHome aria-hidden="true" /> {p.beds} beds</span>
            <span><FiDroplet aria-hidden="true" /> {p.baths} baths</span>
            <span><FiMaximize aria-hidden="true" /> {p.area} m²</span>
            <span style={{ textTransform: "capitalize" }}>{p.category}</span>
            <span><FiEye aria-hidden="true" /> {p.views} views</span>
          </p>
          <h2 style={{ margin: "20px 0 8px", fontSize: 19 }}>Description</h2>
          <p style={{ lineHeight: 1.7 }}>{p.description}</p>
          {p.features?.length > 0 && (
            <>
              <h2 style={{ margin: "20px 0 8px", fontSize: 19 }}>Features</h2>
              <ul className="feature-list">
                {p.features.map((f, i) => <li key={i}><FiCheck aria-hidden="true" /> {f}</li>)}
              </ul>
            </>
          )}
          {p.agent && (
            <>
              <h2 style={{ margin: "20px 0 8px", fontSize: 19 }}>Agent</h2>
              <div className="agent-box">
                <div className="avatar" aria-hidden="true">{p.agent.name?.[0]?.toUpperCase()}</div>
                <div>
                  <b>{p.agent.name}</b>
                  <div className="meta"><FiMail aria-hidden="true" style={{ verticalAlign: "-2px" }} /> {p.agent.email}</div>
                  {p.agent.phone && <div className="meta"><FiPhone aria-hidden="true" style={{ verticalAlign: "-2px" }} /> {p.agent.phone}</div>}
                </div>
              </div>
            </>
          )}
          {hasCoords && (
            <>
              <h2 style={{ margin: "20px 0 8px", fontSize: 19 }}>Location</h2>
              <MapContainer center={[p.lat, p.lng]} zoom={15} style={{ height: 320, borderRadius: 12 }} key={p._id}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                <Marker position={[p.lat, p.lng]} icon={markerIcon}>
                  <Popup>{p.title}</Popup>
                </Marker>
              </MapContainer>
            </>
          )}
        </div>
        <div className="form-card" style={{ margin: 0, alignSelf: "start", position: "sticky", top: 84 }}>
          <h2 style={{ fontSize: 20 }}>Enquire about this property</h2>
          {sent ? (
            <p style={{ color: "green", display: "flex", gap: 8, alignItems: "center" }}>
              <FiCheck aria-hidden="true" /> Enquiry sent! The agent will contact you.
            </p>
          ) : (
            <form onSubmit={submit}>
              <label className="sr-only" htmlFor="enq-name">Your name</label>
              <input id="enq-name" required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <label className="sr-only" htmlFor="enq-email">Email</label>
              <input id="enq-email" required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <label className="sr-only" htmlFor="enq-phone">Phone</label>
              <input id="enq-phone" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <label className="sr-only" htmlFor="enq-message">Message</label>
              <textarea id="enq-message" rows="4" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <button className="btn block">Send Enquiry</button>
            </form>
          )}
        </div>
      </div>
      {similar.length > 0 && (
        <>
          <h2 style={{ margin: "40px 0 20px", fontSize: 24 }}>Similar Properties</h2>
          <div className="grid">{similar.map((s) => <PropertyCard key={s._id} p={s} />)}</div>
        </>
      )}
    </div>
  );
}
