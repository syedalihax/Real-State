
export function SkeletonCard() {
  return (
    <div className="card skeleton" aria-hidden="true">
      <div className="sk sk-img" />
      <div className="body">
        <div className="sk sk-line w40" />
        <div className="sk sk-line w80" />
        <div className="sk sk-line w60" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid" aria-label="Loading properties">
      {Array.from({ length: count }, (_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function Spinner({ label = "Loading..." }) {
  return (
    <div className="spinner-wrap" role="status">
      <span className="spinner" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <p>{message || "Something went wrong. Please try again."}</p>
      {onRetry && <button className="btn outline" onClick={onRetry}>Retry</button>}
    </div>
  );
}
