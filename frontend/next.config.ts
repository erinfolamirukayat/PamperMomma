import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pampermomma.netlify.app",
      },
      {
        protocol: "https",
        hostname: "pampermomma-backend.onrender.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "devtunnels.ms",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["pampermomma.netlify.app", "*.devtunnels.ms", "localhost:3000"],
    },
  },
};

export default nextConfig;
