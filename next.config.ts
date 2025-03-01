import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/*", // Allow all images from Unsplash
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/*", // Allow all images from Cloudinary
      },
    ],
  },
};

export default nextConfig;
