import dotenv from 'dotenv';
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID,
    NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME: process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME,
  },
};

export default nextConfig;
