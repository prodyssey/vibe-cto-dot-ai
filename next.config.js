/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is STABLE and DEFAULT in Next.js 15+ - no experimental flag needed
  // appDir: true is no longer needed - App Router is the default
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zfuokpddfofaneazfrhf.supabase.co',
        port: '',
        pathname: '/**',
        search: '',
      }
    ],
    // For static export compatibility
    unoptimized: true
  },
  
  // For Netlify deployment, we don't need static export
  // output: 'export',
  // trailingSlash: true,
  
  // Next.js 15+ specific optimizations
  experimental: {
    // Enable client-side router caching with staleTimes
    staleTimes: {
      dynamic: 30,
      static: 180
    }
  },

  // Ensure React Strict Mode is enabled (default for App Router)
  reactStrictMode: true,

  // ESLint configuration
  eslint: {
    // Ensure ESLint runs during builds
    ignoreDuringBuilds: false,
  },
}

export default nextConfig