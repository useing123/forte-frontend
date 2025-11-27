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
      {
        source: '/auth/:path*',
        destination: 'https://forte-hackathon-core-forte-hackathon-shoe.fin1.bult.app/auth/:path*',
      },
    ]
  },
}

export default nextConfig
