// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5d634bf5030874ffb62277bda5c3d2a5@o4509945635930112.ingest.us.sentry.io/4509945636847616",

  // Optimize sampling for production performance
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
  
  // Enable performance monitoring with reduced sampling
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV !== 'production',
  
  // Optimize for serverless environments like Netlify
  environment: process.env.NODE_ENV || 'development',
  
  // Reduce overhead by filtering out noise
  beforeSend(event) {
    // Filter out development noise
    if (process.env.NODE_ENV !== 'production') {
      return event;
    }
    
    // Filter out common non-critical errors
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.type === 'ChunkLoadError' || 
          error?.value?.includes('Loading chunk') ||
          error?.value?.includes('Loading CSS chunk')) {
        return null;
      }
    }
    
    return event;
  },
  
  // Optimize transport for faster cold starts
  transport: undefined, // Use default but optimized transport
});
