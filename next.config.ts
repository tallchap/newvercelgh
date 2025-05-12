import type { NextConfig } from "next";
import { env } from "process";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Only split REPLIT_DOMAINS when it’s actually defined
  allowedDevOrigins: env.REPLIT_DOMAINS
    ? [env.REPLIT_DOMAINS.split(",")[0]]
    : [],
};

export default nextConfig;
