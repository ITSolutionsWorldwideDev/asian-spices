// apps/web/next.config.js

/** @type {import('next').NextConfig} */

const nextConfig = {
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
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
    ],
  },

  // ADD THIS BLOCK HERE:
  transpilePackages: [
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

/*

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
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig; */
