// apps/admin/next.config.ts
import { join } from "path";

const nextConfig = {
  sassOptions: {
    includePaths: [join(__dirname, "styles")],
  },
};

export default nextConfig;

// import { join } from "path";

// const nextConfig = {
//   webpack(config: any) {
//     return config;
//   },
//   sassOptions: {
//     includePaths: [join(__dirname, "styles")], // optional, if you have shared SCSS
//   },
// };

// export default nextConfig;
/* import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"], // optional
    includePaths: ["./"], // allow SCSS in workspace packages
  },
};

export default nextConfig; */