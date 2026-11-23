import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  // Hosts allowed to open the dev server from another machine, comma-separated (e.g. a LAN address).
  allowedDevOrigins: process.env.DEV_ORIGINS?.split(",").filter(Boolean) ?? [],
};

export default nextConfig;
