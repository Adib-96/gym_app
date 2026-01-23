import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images : {
    remotePatterns: [
      {
        protocol:"https",
        hostname: "images.unsplash.com",
        port: '',           // usually empty
        pathname: '/**',    // allow all paths from Unsplash
      },
      {protocol:"https",
        hostname: "raw.githubusercontent.com",
        port: '',           
        pathname: '/**',    
      }
    ]

  }
};

export default nextConfig;
