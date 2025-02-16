import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/hello',
        destination: 'http://localhost:3001/hello',
      },
    ];
  },
};

module.exports = nextConfig;

