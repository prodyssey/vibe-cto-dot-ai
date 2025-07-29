# Supabase Row Level Security (RLS) Audit

## Overview

This document analyzes the Supabase database usage in the vibe-cto-dot-ai project and provides recommendations for implementing proper Row Level Security (RLS) policies.

## Current State Analysis

### Tables Identified

1. **adventure_sessions** - Stores game session data including player names and emails
2. **adventure_choices** - Records player choices during the game
3. **adventure_scene_visits** - Tracks which scenes players visited
4. **adventure_analytics** - Analytics events for the adventure game
5. **ignition_waitlist** - Waitlist entries for the Ignition program
6. **launch_control_waitlist** - Waitlist entries (referenced but not in schema)
7. **ignition_qualifications** - Qualification form data (referenced but not in schema)

### Current Security Issues

🔴 **CRITICAL**: No authentication is implemented
- All database operations use the anon key without any user authentication
- No RLS policies appear to be in place (based on code analysis)
- Any client with the anon key can potentially access/modify all data

### Data Access Patterns

1. **Inserts (Public Write Access)**:
   - `adventure_sessions` - Creating/updating game sessions
   - `adventure_choices` - Recording player choices
   - `adventure_scene_visits` - Tracking scene visits
   - `adventure_analytics` - Logging analytics events
   - `ignition_waitlist` - Adding waitlist entries
   - `launch_control_waitlist` - Adding waitlist entries
   - `ignition_qualifications` - Submitting qualification data

2. **Reads (Public Read Access)**:
   - `adventure_sessions` - Reading session data by ID
   - No other explicit reads found in the codebase

3. **Updates**:
   - `adventure_sessions` - Updating email, final outcome
   
4. **Deletes**:
   - `adventure_sessions` - Deleting sessions by ID

## Recommended RLS Policies

Since this is a marketing website with anonymous users, we need to implement RLS policies that:
1. Allow anonymous users to create their own data
2. Prevent users from accessing others' data
3. Protect sensitive information like emails

### 1. adventure_sessions

```sql
-- Enable RLS
ALTER TABLE adventure_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own sessions
CREATE POLICY "Users can insert own sessions" ON adventure_sessions
FOR INSERT TO anon
WITH CHECK (true);

-- Policy: Users can only read their own sessions (using session_id from localStorage)
CREATE POLICY "Users can read own sessions" ON adventure_sessions
FOR SELECT TO anon
USING (id = current_setting('request.headers')::json->>'x-session-id');

-- Policy: Users can update their own sessions
CREATE POLICY "Users can update own sessions" ON adventure_sessions
FOR UPDATE TO anon
USING (id = current_setting('request.headers')::json->>'x-session-id');

-- Policy: Users can delete their own sessions
CREATE POLICY "Users can delete own sessions" ON adventure_sessions
FOR DELETE TO anon
USING (id = current_setting('request.headers')::json->>'x-session-id');
```

### 2. adventure_choices

```sql
-- Enable RLS
ALTER TABLE adventure_choices ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert choices for their sessions
CREATE POLICY "Users can insert choices" ON adventure_choices
FOR INSERT TO anon
WITH CHECK (
  session_id IN (
    SELECT id FROM adventure_sessions 
    WHERE id = current_setting('request.headers')::json->>'x-session-id'
  )
);
```

### 3. adventure_scene_visits

```sql
-- Enable RLS
ALTER TABLE adventure_scene_visits ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert/update visits for their sessions
CREATE POLICY "Users can manage scene visits" ON adventure_scene_visits
FOR ALL TO anon
USING (
  session_id IN (
    SELECT id FROM adventure_sessions 
    WHERE id = current_setting('request.headers')::json->>'x-session-id'
  )
);
```

### 4. adventure_analytics

```sql
-- Enable RLS
ALTER TABLE adventure_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts only (write-only table for analytics)
CREATE POLICY "Anyone can insert analytics" ON adventure_analytics
FOR INSERT TO anon
WITH CHECK (true);

-- No SELECT policy - analytics should only be read by admin
```

### 5. Waitlist Tables

```sql
-- Enable RLS on waitlist tables
ALTER TABLE ignition_waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (it's a public waitlist)
CREATE POLICY "Anyone can join waitlist" ON ignition_waitlist
FOR INSERT TO anon
WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies for public users
```

## Implementation Recommendations

### 1. Session-Based Access Control

Since the app uses anonymous users with session IDs stored in localStorage:

```typescript
// Update Supabase client to include session header
import { supabase } from '@/integrations/supabase/client';

// Add session ID to all requests
const supabaseWithSession = supabase.auth.setCustomAccessToken((token) => {
  const sessionId = localStorage.getItem('sessionId');
  return {
    ...token,
    headers: {
      ...token.headers,
      'x-session-id': sessionId || ''
    }
  };
});
```

### 2. Alternative: Use Supabase Auth

Consider implementing Supabase Anonymous Auth for better security:

```typescript
// Create anonymous user on first visit
const { data, error } = await supabase.auth.signInAnonymously();

// This provides a proper auth context for RLS policies
```

### 3. Sensitive Data Protection

- Email addresses should be write-only from the client
- Consider server-side functions for operations involving PII
- Implement rate limiting on public endpoints

### 4. Admin Access

Create separate admin policies for internal use:

```sql
-- Admin can read all data
CREATE POLICY "Admin full access" ON adventure_sessions
FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');
```

## Security Checklist

- [ ] Enable RLS on all tables
- [ ] Implement session-based access control
- [ ] Create write-only policies for sensitive data
- [ ] Set up rate limiting in Supabase
- [ ] Implement proper error handling (don't expose internal errors)
- [ ] Consider moving to authenticated users (even anonymous auth)
- [ ] Set up monitoring for suspicious activity
- [ ] Regular security audits of RLS policies

## Testing RLS Policies

After implementing RLS policies, test them:

```sql
-- Test as anon user
SET ROLE anon;
SET request.headers = '{"x-session-id": "test-session-123"}';

-- Try to read someone else's session (should fail)
SELECT * FROM adventure_sessions WHERE id = 'other-session-456';

-- Try to read own session (should succeed)
SELECT * FROM adventure_sessions WHERE id = 'test-session-123';
```

## Next Steps

1. Log into Supabase Dashboard
2. Navigate to Authentication → Policies
3. Implement the RLS policies above
4. Update the client code to pass session headers
5. Test thoroughly with different session IDs
6. Monitor for any access violations

## Important Notes

- The anon key is public by design but should only allow specific operations
- Never rely solely on client-side validation
- RLS policies are your last line of defense
- Consider implementing rate limiting at the Supabase level
- Regular security audits are essential