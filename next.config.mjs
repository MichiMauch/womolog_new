import dotenv from 'dotenv';
import withImages from 'next-images';

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = withImages({
  env: {
    NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID,
    NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME: process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME,
  },
});

export default nextConfig;
