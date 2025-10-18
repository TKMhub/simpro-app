import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 簡潔に許可したいだけならこれでOK
    domains: ['images.unsplash.com'],
  },
  // Ensure Next.js treats this repo as the workspace root
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
