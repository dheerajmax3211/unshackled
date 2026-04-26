import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hduimxljgprwmasdketl.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  /* serverActions is enabled by default in Next.js 15+, but adding it as requested */
};

export default nextConfig;
