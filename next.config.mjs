/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [],
  },
  experimental: {
    appDir: true,
  },
  serverRuntimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL,
  },
}

export default nextConfig
