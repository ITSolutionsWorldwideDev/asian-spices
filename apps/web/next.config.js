// apps/web/next.config.js

/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  // eslint: {
  //   // 🟢 ADD THIS: Also skip ESLint validation checks so style errors don't break the build
  //   ignoreDuringBuilds: true,
  // },
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

  transpilePackages: [
    "@acme/db",
    // "@acme/idin",
    "@acme/auth",
    "@acme/types",
    "@repo/ui",
    "@acme/order-routing",
    "@acme/packaging-service",
  ],
};

export default nextConfig;
// module.exports = nextConfig;

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
