/**
 * Secure logging utility that sanitizes sensitive data
 * Use this instead of console.log in production code
 */

const isDevelopment = process.env.NODE_ENV === 'development';

// List of sensitive field names to redact
const SENSITIVE_FIELDS = [
  'email',
  'password',
  'token',
  'session',
  'sessionId',
  'session_id',
  'name',
  'playerName',
  'player_name',
  'phone',
  'apiKey',
  'api_key',
  'secret',
  'credentials',
  'authorization',
];

/**
 * Recursively sanitize an object by redacting sensitive fields
 */
function sanitizeData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    // Redact email addresses
    if (data.includes('@') && data.includes('.')) {
      return data.replace(/([a-zA-Z0-9._-]+)@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/gi, '$1@***');
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  if (typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      // Check if this is a sensitive field
      if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeData(value);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Development logger - only logs in development mode
 */
export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args.map(sanitizeData));
    }
  },
  
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args.map(sanitizeData));
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args.map(sanitizeData));
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args.map(sanitizeData));
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args.map(sanitizeData));
    }
  },
};

// For production error tracking (e.g., Sentry)
export const trackError = (error: Error, context?: Record<string, any>) => {
  // In production, send to error tracking service
  if (!isDevelopment) {
    // TODO: Integrate with error tracking service like Sentry
    // Ensure context is sanitized before sending
    const sanitizedContext = context ? sanitizeData(context) : undefined;
    
    // For now, just prevent the error from being logged to console
    return;
  }
  
  // In development, log to console
  logger.error('Error tracked:', error, context);
};