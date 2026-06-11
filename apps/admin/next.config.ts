// apps/admin/next.config.ts

import { join } from "path";
import type { NextConfig } from "next"; // Optional: if you want explicit typing

const nextConfig: NextConfig = {
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
  reactStrictMode: true, 
  // swcMinify: true,       
  
  // ADD THIS BLOCK HERE:
  transpilePackages: [
    "@acme/utils",
    "@acme/db",
    "@acme/payments",
    "@acme/idin",
    "@acme/auth",
    "@acme/types",
    "@repo/ui",
    "@acme/order-routing",
    "@acme/packaging-service"
  ],
};

export default nextConfig;

/* import { join } from "path";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        // pathname: "/f/**",
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
  reactStrictMode: true, // recommended
  swcMinify: true,       // recommended
};

export default nextConfig; */