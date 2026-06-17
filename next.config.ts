import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Enable React strict mode for better dev experience
  reactStrictMode: true,

  // Compress responses
  compress: true,

  // Production optimizations
  poweredByHeader: false,

  // Image optimization settings
  images: {
    formats: ["image/avif", "image/webp"],
  },
}

export default nextConfig
