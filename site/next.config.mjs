import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // allow cloudfront.net
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
        port: "",
      },
    ],
  },
};

export default nextConfig;
