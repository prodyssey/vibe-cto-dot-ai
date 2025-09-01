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
    // Enable optimization for better Lighthouse scores
    unoptimized: false,
    // Support modern formats
    formats: ['image/avif', 'image/webp'],
    // Enable responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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

// Injected content via Sentry wizard below

import { withSentryConfig } from "@sentry/nextjs";

export default withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "vibectoai",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
