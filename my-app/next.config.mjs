/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- ADD THIS SECTION TO THE FILE ---
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // ------------------------------------
};

export default nextConfig;