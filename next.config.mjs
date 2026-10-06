/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize imports: tree-shake lucide-react and framer-motion icons
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Compress responses
  compress: true,
  // Power through all images faster
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
