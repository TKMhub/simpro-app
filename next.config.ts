import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 画像の外部ホスト許可（Supabase Storage / Notion等）
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: '**.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'source.unsplash.com', pathname: '/**' },
    ],
  },
  // 画像などの静的ファイルのキャッシュ設定
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=2592000',
          },
        ],
      },
    ];
  },
  // Ensure Next.js treats this repo as the workspace root
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
