
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  const [q, setQ] = useState({ type: "sale", city: "", maxPrice: "", beds: "" });
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(Object.entries(q).filter(([, v]) => v));
    navigate(`/listings?${params.toString()}`);
  };
  return (
    <form className="search-bar mx-auto max-w-5xl" onSubmit={submit} role="search">
      <label className="sr-only" htmlFor="search-type">Buy or rent</label>
      <select id="search-type" value={q.type} onChange={(e) => setQ({ ...q, type: e.target.value })}>
        <option value="sale">Buy</option>
        <option value="rent">Rent</option>
      </select>
      <label className="sr-only" htmlFor="search-city">City or suburb</label>
      <input id="search-city" placeholder="Suburb / City (e.g. Sydney)" value={q.city} onChange={(e) => setQ({ ...q, city: e.target.value })} />
      <label className="sr-only" htmlFor="search-price">Maximum price</label>
      <input id="search-price" placeholder="Max price" type="number" min="0" value={q.maxPrice} onChange={(e) => setQ({ ...q, maxPrice: e.target.value })} />
      <label className="sr-only" htmlFor="search-beds">Minimum bedrooms</label>
      <select id="search-beds" value={q.beds} onChange={(e) => setQ({ ...q, beds: e.target.value })}>
        <option value="">Any beds</option>
        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+ beds</option>)}
      </select>
      <button className="btn md:min-w-[150px]">
        <FiSearch aria-hidden="true" className="h-4 w-4" /> Search
      </button>
    </form>
  );
}
