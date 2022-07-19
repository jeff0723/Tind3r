/** @type {import('next').NextConfig} */
const withImages = require('next-images')

const nextConfig = withImages({
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      // https://github.com/vercel/next.js/issues/7755#issuecomment-937721514
      config.resolve.fallback.fs = false
    }
    return config
  },
  images: {
    disableStaticImages: true
  }
})

module.exports = nextConfig
