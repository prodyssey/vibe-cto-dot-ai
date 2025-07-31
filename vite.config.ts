import path from "path";

import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: mode === 'development' ? 'localhost' : '::', // Use localhost in dev for better security
    port: 8080,
    // Configure CORS for development
    cors: mode === 'development' ? {
      origin: [
        'http://localhost:8080',
        'http://localhost:5173',
        'http://127.0.0.1:8080',
        'https://zfuokpddfofaneazfrhf.supabase.co', // Supabase
        'https://app.kit.com', // ConvertKit
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-client-info', 'apikey'],
      exposedHeaders: ['content-range', 'x-content-range'],
    } : false, // Disable CORS in production (handled by Netlify)
    // Add security headers for development
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      // Basic CSP for development - will be stricter in production via Netlify
      'Content-Security-Policy': mode === 'development' 
        ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://zfuokpddfofaneazfrhf.supabase.co https://app.kit.com ws://localhost:* wss://localhost:*;"
        : '',
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer'],
  },
}));
