/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
  },
  async redirects() {
    return [{ source: "/download", destination: "/", permanent: true }];
  },
};

export default nextConfig;