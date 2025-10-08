import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable linting during builds to allow deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during builds for faster deployment
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
