# Security Vulnerability Fix Checklist

## 🔴 CRITICAL Severity

- [x] **Revoke Google OAuth2 Credentials** - ✅ Already completed by user
- [x] **Remove credential files from repository**
  - [x] Delete `/scripts/credentials.json`
  - [x] Delete `/scripts/token.json`
  - [x] Add `*.json` to `.gitignore` in scripts directory
  - [x] Clean git history to remove these files completely - ✅ Files were never committed!
- [ ] **Implement proper secret management for Google Analytics**
  - [ ] Use environment variables for credentials
  - [ ] Update scripts to read from env vars
- [ ] **Verify Supabase RLS policies**
  - [ ] Audit Row Level Security in Supabase dashboard
  - [ ] Consider moving keys to environment variables

## 🟠 HIGH Severity

- [ ] **Fix SQL Injection vulnerability**
  - [ ] Fix string interpolation in `/src/components/adventure/components/SessionEmailForm.tsx:81`
  - [ ] Use parameterized queries
- [ ] **Add input validation to forms**
  - [ ] `/src/components/adventure/components/SessionEmailForm.tsx`
  - [ ] `/src/components/EmailOptIn.tsx`
  - [ ] `/src/components/adventure/scenes/PlayerSetupScreen.tsx`
  - [ ] Implement Zod schemas for validation
- [ ] **Configure CORS properly**
  - [ ] Update `/vite.config.ts` with proper CORS headers
  - [ ] Restrict allowed origins

## 🟡 MEDIUM Severity

- [ ] **Remove sensitive data from console logs**
  - [ ] Search and remove all console.log statements
  - [ ] Implement proper logging library if needed
- [ ] **Add security headers to Netlify**
  - [ ] Update `/netlify.toml` with security headers
  - [ ] X-Content-Type-Options
  - [ ] X-Frame-Options
  - [ ] X-XSS-Protection
  - [ ] Referrer-Policy
  - [ ] Content-Security-Policy
- [ ] **Review localStorage usage**
  - [ ] Audit data stored in localStorage
  - [ ] Consider sessionStorage for temporary data
  - [ ] Implement data expiration

## 🟢 LOW Severity

- [ ] **Document public IDs**
  - [ ] Add comments explaining ConvertKit form IDs are public
- [ ] **Implement rate limiting**
  - [ ] Add rate limiting for form submissions
  - [ ] Consider Cloudflare or similar service

## Additional Security Tasks

- [ ] **Run npm audit**
  - [ ] Check for vulnerable dependencies
  - [ ] Update packages as needed
- [ ] **Add security.txt file**
  - [ ] Create `.well-known/security.txt` for responsible disclosure
- [ ] **Set up CI/CD security scanning**
  - [ ] Add secret scanning to GitHub Actions
  - [ ] Add dependency scanning
- [ ] **Implement CAPTCHA**
  - [ ] Add to forms to prevent automated abuse

## Progress Tracking

Total Issues: 15
- Critical: 1/4 completed ✅
- High: 0/3 completed
- Medium: 0/3 completed  
- Low: 0/2 completed
- Additional: 0/4 completed

Last Updated: 2025-07-29