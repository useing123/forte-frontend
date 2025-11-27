/** @type {import('next').NextConfig} */
const backendOrigin = process.env.BACKEND_ORIGIN || 'https://<your-backend-host>';

const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Proxy auth routes to backend without following redirects server-side
      { source: '/api/auth/login', destination: `${backendOrigin}/auth/login` },
      { source: '/api/auth/callback', destination: `${backendOrigin}/auth/callback` },
    ];
  },
};
``
export default nextConfig;