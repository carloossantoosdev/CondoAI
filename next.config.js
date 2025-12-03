/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Desabilita requisições duplicadas em desenvolvimento
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

