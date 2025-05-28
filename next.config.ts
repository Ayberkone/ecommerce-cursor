// next.config.js

/** @type {import('next').NextConfig} */
import { NextConfig } from "next"

// Import the bundle analyzer plugin
import createBundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true" // The analyzer will only run if ANALYZE=true is set when building
})

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**"
      }
    ]
  }
}

module.exports = nextConfig
