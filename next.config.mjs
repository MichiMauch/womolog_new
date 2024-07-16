import dotenv from 'dotenv';
import withImages from 'next-images';

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = withImages({
  env: {
    NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID,
    NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME: process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME,
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|css|js|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
});

export default nextConfig;
