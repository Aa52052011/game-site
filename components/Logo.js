export default function Logo({ className = "h-8 w-8" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      className={className}
      role="img"
      aria-label="1XBET"
    >
      <rect width="512" height="512" rx="96" fill="#2C64B0" />
      <g fill="#FFFFFF">
        <path d="M132 158L218 142L186 204V372H138V204Z" />
        <path d="M248 142H304L358 244L412 142H468L374 272L478 372H422L358 292L294 372H238L342 272Z" />
      </g>
    </svg>
  );
}
