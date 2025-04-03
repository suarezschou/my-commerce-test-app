import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    CTP_PROJECT_KEY: process.env.CTP_PROJECT_KEY,
    CTP_CLIENT_ID: process.env.CTP_CLIENT_ID,
    CTP_CLIENT_SECRET: process.env.CTP_CLIENT_SECRET,
    CTP_AUTH_URL: process.env.CTP_AUTH_URL,
    CTP_API_URL: process.env.CTP_API_URL,
    CTP_SCOPES: process.env.CTP_SCOPES,
  },
};

module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}
export default nextConfig;

