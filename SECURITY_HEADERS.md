# Security Headers Documentation

This document explains the security headers configured in `netlify.toml` for the VibeCTO.ai application.

## Overview

Security headers are HTTP response headers that provide an additional layer of security by instructing browsers how to behave when handling your site's content.

## Implemented Headers

### 1. X-Content-Type-Options: nosniff
- **Purpose**: Prevents browsers from MIME-sniffing a response away from the declared content-type
- **Protection**: Blocks attacks where malicious JavaScript is disguised as an image or other file type

### 2. X-Frame-Options: DENY
- **Purpose**: Prevents your site from being embedded in iframes
- **Protection**: Protects against clickjacking attacks where attackers overlay invisible elements

### 3. X-XSS-Protection: 1; mode=block
- **Purpose**: Enables XSS filtering in older browsers
- **Protection**: Blocks pages if reflected XSS attack is detected
- **Note**: Modern browsers have this built-in, but included for legacy support

### 4. Referrer-Policy: strict-origin-when-cross-origin
- **Purpose**: Controls how much referrer information is shared
- **Protection**: Prevents leaking sensitive URL parameters to external sites
- **Behavior**: Sends full URL to same-origin, only origin to cross-origin HTTPS, nothing to HTTP

### 5. Permissions-Policy
- **Purpose**: Controls which browser features can be used
- **Current Settings**:
  - `camera=()` - Blocks camera access
  - `microphone=()` - Blocks microphone access
  - `geolocation=()` - Blocks location access
  - `payment=()` - Blocks payment APIs

### 6. Content-Security-Policy (CSP)
Most important security header that controls which resources can be loaded:

```
default-src 'self';                    # Only allow resources from same origin by default
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.kit.com https://f.convertkit.com;
style-src 'self' 'unsafe-inline';      # Allow inline styles (required for React)
img-src 'self' data: https: blob:;     # Allow images from HTTPS sources and data URIs
font-src 'self' data:;                  # Allow fonts from same origin and data URIs
connect-src 'self' https://zfuokpddfofaneazfrhf.supabase.co https://app.kit.com https://api.convertkit.com wss://zfuokpddfofaneazfrhf.supabase.co;
frame-src https://savvycal.com;        # Only allow SavvyCal in iframes
frame-ancestors 'none';                 # Prevent site from being framed
base-uri 'self';                        # Restrict <base> tag URLs
form-action 'self' https://app.kit.com; # Restrict form submissions
upgrade-insecure-requests;              # Upgrade HTTP to HTTPS
```

### Cache Control Headers

- **Static Assets** (JS, CSS, images): Cached for 1 year with `immutable` flag
- **HTML Files**: Never cached to ensure users get latest version

## Testing Headers

After deployment, test your headers using:
1. Browser DevTools (Network tab → Response Headers)
2. [Security Headers Scanner](https://securityheaders.com/)
3. [Mozilla Observatory](https://observatory.mozilla.org/)

## CSP Violations

If legitimate resources are blocked by CSP:
1. Check browser console for CSP violation reports
2. Add the domain to appropriate CSP directive
3. Avoid using 'unsafe-inline' for scripts when possible

## Future Improvements

1. **Remove 'unsafe-inline' for scripts**: Migrate to CSP nonces or hashes
2. **Add CSP reporting**: Set up CSP violation reporting endpoint
3. **Implement HSTS**: Add Strict-Transport-Security header (requires HTTPS-only)
4. **Add Expect-CT**: Certificate Transparency enforcement

## Development vs Production

These headers only apply to production (Netlify deployment). Development server has different, more permissive settings configured in `vite.config.ts`.