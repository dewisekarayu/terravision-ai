/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled to prevent double mounting in 3D scenes which can cause memory leaks
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Remove console.logs in production
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'three', '@react-three/fiber', '@react-three/drei'],
  },
  webpack: (config, { dev, isServer }) => {
    // Optionally optimize three.js bundle
    return config;
  },
};

export default nextConfig;
