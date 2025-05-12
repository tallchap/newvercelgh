import type { NextConfig } from "next";
import { env } from "process";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Only include REPLIT_DOMAINS when defined (avoid undefined.split errors on Vercel)
  allowedDevOrigins: env.REPLIT_DOMAINS
    ? [env.REPLIT_DOMAINS.split(",")[0]]
    : [],
};
