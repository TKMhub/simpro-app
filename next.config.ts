import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 画像の外部ホスト許可（Supabase Storage / Notion等）
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: '**.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
  // Ensure Next.js treats this repo as the workspace root
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
