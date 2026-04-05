import type { NextConfig } from "next";

import { env } from "~/config/env";

const nextConfig: NextConfig = {
  allowedDevOrigins: env.DEV_ORIGINS
};

export default nextConfig;
