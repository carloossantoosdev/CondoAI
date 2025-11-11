/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['brapi.dev', 'lh3.googleusercontent.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig

