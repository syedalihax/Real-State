export function BedIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 10.5V7.5A1.5 1.5 0 0 1 4.5 6h10A2.5 2.5 0 0 1 17 8.5V10.5" />
      <path d="M3 10.5h18v5H3z" />
      <path d="M7 15.5v3M17 15.5v3" />
    </svg>
  );
}

export function BathIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 12h10a2 2 0 0 1 2 2v1.5A2.5 2.5 0 0 1 16.5 18H7.5A2.5 2.5 0 0 1 5 15.5V14a2 2 0 0 1 2-2Z" />
      <path d="M8 12V7.5A2.5 2.5 0 0 1 10.5 5h.5" />
      <path d="M5 15.5h14" />
    </svg>
  );
}

export function AreaIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 18V6h16v12" />
      <path d="M8 18v-6h8v6" />
      <path d="M8 9h8" />
    </svg>
  );
}

export function MarkerIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function HeartIcon({ filled = false, className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 20.5s-7.5-4.4-9.5-8.5C1.4 9.7 3.1 5.5 7.1 5.5c2 0 3.2 1 4.1 2.1A5.4 5.4 0 0 1 15.3 5.5c4 0 5.7 4.2 4.6 6.5-2 4.1-9.5 8.5-9.5 8.5Z" />
    </svg>
  );
}
