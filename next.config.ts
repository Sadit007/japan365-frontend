import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    lightningCssFeatures: {
      // Do not transpile oklch/oklab colors — modern browsers support them
      // natively. Transpiling them causes Turbopack to emit `@layer properties;`
      // which its own CSS parser then rejects.
      exclude: ["oklab-colors"],
    },
  },
};

export default nextConfig;
