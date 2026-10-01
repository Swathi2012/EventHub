import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root:process.cwd(),
  },
};

export default nextConfig;
