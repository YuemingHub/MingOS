import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // V0 为纯静态站：无服务端功能，构建产物在 out/，可部署到任何静态服务器
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
