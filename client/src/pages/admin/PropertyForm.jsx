
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext.jsx";
import api from "../../api";

const empty = {
  title: "", description: "", price: "", type: "sale", category: "house",
  beds: "", baths: "", area: "", address: "", city: "", state: "", pincode: "",
  lat: "", lng: "", features: "", status: "active", featured: false,
};

const compressImage = (file) => new Promise((resolve, reject) => {
  if (!file || !file.type.startsWith("image/")) return resolve(file);

  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSide = 1600;
      let { width, height } = image;

      if (width > maxSide || height > maxSide) {
        const ratio = Math.min(maxSide / width, maxSide / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Image compression failed"));
          const compressedFile = new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() });
          resolve(compressedFile);
        },
        "image/jpeg",
        0.75
      );
    };
    image.onerror = () => reject(new Error("Image could not be processed"));
    image.src = reader.result;
  };
  reader.onerror = () => reject(new Error("File read failed"));
  reader.readAsDataURL(file);
});

export default function PropertyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) api.get(`/properties/${id}`).then((r) => setForm({ ...empty, ...r.data, features: r.data.features?.join(", ") || "" }));
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (form.title.trim().length < 5) return "Title should be at least 5 characters";
    if (!form.price || Number(form.price) <= 0) return "Please enter a valid price greater than 0";
    if (!form.city.trim()) return "City is required";
    if (form.description && form.description.trim().length < 20) return "Description should be at least 20 characters";
    if (form.lat && (Number(form.lat) < -90 || Number(form.lat) > 90)) return "Latitude must be between -90 and 90";
    if (form.lng && (Number(form.lng) < -180 || Number(form.lng) > 180)) return "Longitude must be between -180 and 180";
    if (form.lat && !form.lng) return "Please enter both latitude and longitude (or neither)";
    if (!form.lat && form.lng) return "Please enter both latitude and longitude (or neither)";
    if (!isEdit && files.length === 0) return "Please upload at least one image";
    return "";
  };

  const handleFileChange = async (event) => {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) {
      setFiles([]);
      return;
    }

    try {
      const compressed = await Promise.all(selected.map(compressImage));
      setFiles(compressed);
    } catch {
      setError("One or more uploaded images could not be processed. Please try different files.");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") fd.append(k, v);
      });
      [...files].forEach((f) => fd.append("images", f));
      if (isEdit) await api.put(`/properties/${id}`, fd);
      else await api.post("/properties", fd);
      toast(isEdit ? "Property updated!" : "Property created!");
      navigate("/admin/properties");
    } catch {
      toast("Something went wrong", "error");
    }
    setLoading(false);
  };

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold text-slate-900">{isEdit ? "Edit" : "Add New"} Property</h1>
      <form onSubmit={submit} className="form-card max-w-4xl" noValidate>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="pf-title" className="field-label">Title *</label>
            <input id="pf-title" className="input-shell" required placeholder="Property title" value={form.title} onChange={set("title")} />
          </div>
          <div>
            <label htmlFor="pf-price" className="field-label">Price (AUD) *</label>
            <input id="pf-price" className="input-shell" required type="number" min="1" placeholder="Price" value={form.price} onChange={set("price")} />
          </div>
          <div>
            <label htmlFor="pf-type" className="field-label">Listing type</label>
            <select id="pf-type" className="input-shell" value={form.type} onChange={set("type")}>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          <div>
            <label htmlFor="pf-cat" className="field-label">Category</label>
            <select id="pf-cat" className="input-shell" value={form.category} onChange={set("category")}>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label htmlFor="pf-beds" className="field-label">Bedrooms</label>
            <input id="pf-beds" className="input-shell" type="number" min="0" placeholder="Bedrooms" value={form.beds} onChange={set("beds")} />
          </div>
          <div>
            <label htmlFor="pf-baths" className="field-label">Bathrooms</label>
            <input id="pf-baths" className="input-shell" type="number" min="0" placeholder="Bathrooms" value={form.baths} onChange={set("baths")} />
          </div>
          <div>
            <label htmlFor="pf-area" className="field-label">Area (m²)</label>
            <input id="pf-area" className="input-shell" type="number" min="0" placeholder="Area (m²)" value={form.area} onChange={set("area")} />
          </div>
          <div>
            <label htmlFor="pf-status" className="field-label">Status</label>
            <select id="pf-status" className="input-shell" value={form.status} onChange={set("status")}>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <label htmlFor="pf-address" className="field-label mt-4">Street address</label>
        <input id="pf-address" className="input-shell" placeholder="Street address" value={form.address} onChange={set("address")} />

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="pf-city" className="field-label">City / Suburb *</label>
            <input id="pf-city" className="input-shell" required placeholder="City / Suburb" value={form.city} onChange={set("city")} />
          </div>
          <div>
            <label htmlFor="pf-state" className="field-label">State</label>
            <input id="pf-state" className="input-shell" placeholder="State" value={form.state} onChange={set("state")} />
          </div>
          <div>
            <label htmlFor="pf-pin" className="field-label">Pincode</label>
            <input id="pf-pin" className="input-shell" placeholder="Pincode" value={form.pincode} onChange={set("pincode")} />
          </div>
          <div>
            <label htmlFor="pf-features" className="field-label">Features</label>
            <input id="pf-features" className="input-shell" placeholder="Features (comma separated: Pool, Garage)" value={form.features} onChange={set("features")} />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="pf-lat" className="field-label">Latitude (optional — for map)</label>
            <input id="pf-lat" className="input-shell" type="number" step="any" placeholder="e.g. -33.8688" value={form.lat || ""} onChange={set("lat")} />
          </div>
          <div>
            <label htmlFor="pf-lng" className="field-label">Longitude (optional — for map)</label>
            <input id="pf-lng" className="input-shell" type="number" step="any" placeholder="e.g. 151.2093" value={form.lng || ""} onChange={set("lng")} />
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          💡 Map coordinates ke liye Google Maps par right-click → coordinates copy karein (e.g. Sydney CBD: -33.8688, 151.2093)
        </p>

        <label htmlFor="pf-desc" className="field-label mt-5">Description</label>
        <textarea id="pf-desc" className="input-shell min-h-[120px]" rows="4" placeholder="Description" value={form.description} onChange={set("description")} />

        <label className="mt-4 flex items-center gap-3 text-sm text-slate-700">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          Feature on homepage
        </label>

        <label htmlFor="pf-images" className="field-label mt-5">Images {!isEdit && "*"}</label>
        <input id="pf-images" type="file" multiple accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100" />
        {files.length > 0 && <p className="mt-2 text-xs text-slate-500">{files.length} image(s) prepared for upload.</p>}
        {isEdit && <p className="mt-2 text-xs text-slate-500">Note: uploading new images will replace existing ones.</p>}

        <button className="btn mt-6" disabled={loading}>{loading ? "Saving..." : isEdit ? "Update" : "Create"} Property</button>
      </form>
    </>
  );
}
