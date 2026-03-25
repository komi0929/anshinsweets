import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Force webpack to avoid Turbopack multi-byte path issues on Windows */
  turbopack: {},
  webpack: (config) => {
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
