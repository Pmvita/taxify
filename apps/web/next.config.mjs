/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@taxify/core'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
