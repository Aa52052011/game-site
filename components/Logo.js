export default function Logo({ className = "h-8 w-auto" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 72"
      fill="none"
      className={className}
      role="img"
      aria-label="1XBET"
    >
      <text
        x="0"
        y="62"
        fontFamily='"Arial Black", "Helvetica Neue", Arial, sans-serif'
        fontSize="64"
        fontWeight="900"
        fontStyle="italic"
        letterSpacing="-4"
        fill="#FFFFFF"
      >
        1X
      </text>
    </svg>
  );
}
