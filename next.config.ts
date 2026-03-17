import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Force webpack to avoid Turbopack multi-byte path issues on Windows */
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
