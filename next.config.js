/** @type {import('next').NextConfig} */
// basePath was dropped in Wave 1 so /admin/* (admin) and /dashboard/* (worker)
// can sit as sibling top-level routes inside the same app. Deployment now
// serves the static export from the hosting root — coordinate with infra
// before this lands in production.
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
