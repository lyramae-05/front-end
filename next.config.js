/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://backend-49g6.onrender.com'}/:path*`
      }
    ];
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;