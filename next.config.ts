import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.edubacards.com",
      },
      {
        protocol: "https",
        hostname: "demo.edubacards.com",
      },
    ],
  },
};

export default nextConfig;