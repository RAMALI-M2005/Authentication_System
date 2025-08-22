import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    eslint: {
      ignoreDuringBuilds: true, // هذا يلغي فحص ESLint أثناء build
    },
    typescript: {
      ignoreBuildErrors: true, // هذا يلغي توقف build بسبب أخطاء types
    },
};

export default nextConfig;
