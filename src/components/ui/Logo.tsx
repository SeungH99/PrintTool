export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className="text-ink"
    >
      <rect x="2.5" y="2.5" width="17" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 0.5V5M11 17V21.5M0.5 11H5M17 11H21.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
