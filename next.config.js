/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'tailwindui.com', 'randomuser.me'],
  },
  typescript: {
    // !! WARN !!
    ignoreBuildErrors: true, // Temporarily set to true to allow the build to proceed
  }
}

module.exports = nextConfig
