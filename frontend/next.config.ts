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

export default nextConfig;
