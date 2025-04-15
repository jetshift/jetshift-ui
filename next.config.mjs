/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    // Allows builds to pass even with ESLint issues
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Allows builds to pass even with TS type errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
