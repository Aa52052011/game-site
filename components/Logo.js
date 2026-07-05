import { siteConfig } from "@/lib/config";

export default function Logo({ className = "h-8 w-8" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={siteConfig.logo}
      alt={siteConfig.name}
      className={className}
      width={512}
      height={512}
    />
  );
}
