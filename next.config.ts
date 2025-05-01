import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Google profile images
      'avatars.githubusercontent.com',  // GitHub profile images (optional)
    ],
  },
};

export default nextConfig;
