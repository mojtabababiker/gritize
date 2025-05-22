import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "fra.cloud.appwrite.io",
      },
    ],
  },
};

export default nextConfig;
