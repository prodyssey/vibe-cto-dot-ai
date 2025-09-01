// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5d634bf5030874ffb62277bda5c3d2a5@o4509945635930112.ingest.us.sentry.io/4509945636847616",

  // Optimize sampling for edge runtime performance
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  // Minimal profiling for edge functions
  profilesSampleRate: 0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV !== "production",

  // Optimize for edge runtime
  environment: process.env.NODE_ENV || "development",

  // Minimal integrations for edge runtime
  integrations: [],

  // Fast error filtering for edge functions
  beforeSend(event) {
    // Skip non-critical errors in production
    if (process.env.NODE_ENV === "production" && event.level === "warning") {
      return null;
    }
    return event;
  },
});
