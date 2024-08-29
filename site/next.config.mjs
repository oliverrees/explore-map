import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Remove .map files processing if causing issues
    config.module.rules.push({
      test: /\.map$/,
      use: "ignore-loader",
    });

    return config;
  },
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
