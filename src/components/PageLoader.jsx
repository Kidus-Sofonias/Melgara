export default function PageLoader({ label = "Loading" }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="page-loader-inner">
        <div className="page-loader-pick">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* pickaxe */}
            <path d="M4 20 L13 11" />
            <path d="M13 6 a6 6 0 0 1 5 5 L13 11 Z" />
            <path d="M16 3 a3 3 0 0 1 5 5 L16 3 Z" />
          </svg>
        </div>
        <div className="page-loader-bar" />
        <div className="page-loader-label">{label}</div>
      </div>
    </div>
  );
}
