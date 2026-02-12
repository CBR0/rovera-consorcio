import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Domínio das fotos do Google
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // Domínio das fotos do GitHub
      },
    ],
  },
};

export default nextConfig;