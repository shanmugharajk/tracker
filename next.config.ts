import type { NextConfig } from "next";

const devOrigins = ["tracker.local"];
if (process.env.DEV_ORIGIN) {
  devOrigins.push(process.env.DEV_ORIGIN);
}

const nextConfig: NextConfig = {
  allowedDevOrigins: devOrigins,
};

export default nextConfig;
