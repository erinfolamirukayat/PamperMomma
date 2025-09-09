import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost", "devtunnels.ms"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["*.devtunnels.ms", "localhost:3000"],
    },
  },
};
// next.config.js
module.exports = {
  reactStrictMode: true,
  // Any other Next.js configuration options
};

export default nextConfig;
