import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode : false,
  images : {
    remotePatterns :[
      {
        protocol : 'http',
        hostname : "res.cloudinary.com",
        port : '',
        pathname : '/**'
      },
    ]
  }
};

export default nextConfig;
