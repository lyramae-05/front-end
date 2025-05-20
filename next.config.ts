import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://backend-49g6.onrender.com/'}/api/:path*`
      }
    ];
  },
  reactStrictMode: true,
  swcMinify: true
};

export default nextConfig;
