/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // All API and auth requests are now proxied through app/api/[...path]/route.ts
      // This ensures consistent cookie and session handling.
    ]
  },
}

export default nextConfig
