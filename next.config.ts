import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true
  },
  //compiler: {
   // removeConsole: true
  //},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: '',           // usually empty
        pathname: '/**',    // allow all paths from Unsplash
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: '',
        pathname: '/**',
      }
    ]

  }
};

export default nextConfig;
