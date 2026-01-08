import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  compress: true,
  poweredByHeader: false,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coomer.st',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.coomer.st',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'n1.coomer.st',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'n2.coomer.st',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'n3.coomer.st',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'n4.coomer.st',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
};

export default nextConfig;
