/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com', 'cdn.jsdelivr.net'],
    unoptimized: true,
  },
  // Avoid experimental features for production deployments
  // experimental: {
  //   serverActions: true,
  // }
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
