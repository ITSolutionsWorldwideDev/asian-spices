// apps/admin/next.config.ts

import { join } from "path";
import type { NextConfig } from "next"; // Optional: if you want explicit typing

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh",
      },
    ],
  },
  sassOptions: {
    includePaths: [join(__dirname, "styles")],
  },

  transpilePackages: [
    "@acme/utils",
    "@acme/db",
    "@acme/auth",
    "@acme/types",
    "@repo/ui",
    "@acme/order-routing",
    "@acme/packaging-service",
  ],
};

export default nextConfig;

