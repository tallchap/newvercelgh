import type { NextConfig } from "next";
import { env } from "process";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [env.REPLIT_DOMAINS.split(",")[0]],
};

export default nextConfig;
