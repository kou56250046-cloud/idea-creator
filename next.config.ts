import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // APIルート（/api/generate）がskills.mdを読み込めるようにバンドルに含める
  outputFileTracingIncludes: {
    "/api/generate": ["./skills.md"],
  },
};

export default nextConfig;
