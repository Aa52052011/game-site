/**
 * Production site URL for metadata and SEO.
 * Vercel sets VERCEL_URL / VERCEL_PROJECT_PRODUCTION_URL automatically.
 * Override with NEXT_PUBLIC_SITE_URL=https://get1xplay.com in Vercel env vars.
 */
export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://get1xplay.com";
}
