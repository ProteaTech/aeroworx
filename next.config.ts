import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: 'aeroworx-1d7a9.kxcdn.com' }],
  },
}

export default nextConfig
