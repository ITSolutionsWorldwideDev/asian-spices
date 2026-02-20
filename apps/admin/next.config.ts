// apps/admin/next.config.ts
import { join } from "path";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
      },
    ],
  },
  sassOptions: {
    includePaths: [join(__dirname, "styles")],
  },
  reactStrictMode: true, // recommended
  swcMinify: true,       // recommended
};

export default nextConfig;