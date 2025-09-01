// This file configures the initialization of Sentry on the client side.
// The config you add here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5d634bf5030874ffb62277bda5c3d2a5@o4509945635930112.ingest.us.sentry.io/4509945636847616",

  // Optimize sampling for client performance - much lower than server
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  // Disable profiling in client to reduce bundle size and improve performance
  profilesSampleRate: 0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV !== "production",

  environment: process.env.NODE_ENV || "development",

  // Optimize for web performance
  integrations: [
    // Remove heavy integrations in production
    ...(process.env.NODE_ENV === "production"
      ? []
      : [
          Sentry.breadcrumbsIntegration({
            console: false, // Reduce console noise
          }),
        ]),
  ],

  // Aggressive filtering for client-side to improve performance
  beforeSend(event, hint) {
    // Filter out development noise
    if (process.env.NODE_ENV !== "production") {
      return event;
    }

    // Filter out common non-critical client errors
    if (event.exception) {
      const error = event.exception.values?.[0];
      const errorMessage = error?.value || "";
      const errorType = error?.type || "";

      // Filter out chunk loading errors (common with code splitting)
      if (
        errorType === "ChunkLoadError" ||
        errorMessage.includes("Loading chunk") ||
        errorMessage.includes("Loading CSS chunk") ||
        errorMessage.includes("Script error")
      ) {
        return null;
      }

      // Filter out network errors
      if (
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("Failed to fetch")
      ) {
        return null;
      }

      // Filter out ad blocker errors
      if (errorMessage.includes("blocked") && errorMessage.includes("ad")) {
        return null;
      }
    }

    // Filter out non-actionable errors
    if (
      event.message &&
      (event.message.includes("Non-Error") ||
        event.message.includes("Script error"))
    ) {
      return null;
    }

    return event;
  },

  // Optimize replay for performance (if using session replay)
  replaysSessionSampleRate: 0, // Disable in production for performance
  replaysOnErrorSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
});
