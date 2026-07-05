import Image from "next/image";
import { siteConfig } from "@/lib/config";

export default function Logo({ className = "h-8 w-auto" }) {
  return (
    <Image
      src={siteConfig.logo}
      alt={siteConfig.name}
      width={160}
      height={40}
      className={className}
      priority
    />
  );
}
