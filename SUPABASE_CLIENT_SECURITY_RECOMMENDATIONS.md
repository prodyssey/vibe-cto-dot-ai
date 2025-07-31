# Supabase Client Security Recommendations

## Current Security Analysis

After reviewing the codebase and RLS policies, here's the current state:

### Data Access Patterns

1. **Adventure Sessions**
   - ✅ **Writes**: Creating/updating sessions with game progress
   - ⚠️ **Reads**: Currently reading ALL fields including email (potential PII exposure)
   - 📍 **Used in**: `SessionEmailForm.tsx`, `utils.ts`, `PlayerSetupScreen.tsx`

2. **Other Tables**
   - ✅ All other tables (choices, analytics, waitlists) are write-only from client
   - ✅ No sensitive data is read back

### Security Concerns

The main concern is `adventure_sessions` table access:
- The game needs to read: `id`, `player_name`, `is_generated_name` 
- The game currently CAN read: `email`, `preferences`, and all other fields
- Risk: If someone knows a session ID, they could potentially read the email

## Recommended Client Updates

### Option 1: Use the Secure View (Recommended)

Update the client to use `adventure_sessions_public` view instead of the table directly:

```typescript
// In SessionEmailForm.tsx - Update line 41-45
const { data: existingSession, error: fetchError } = await supabase
  .from('adventure_sessions_public') // Use secure view
  .select('id, player_name, is_generated_name')
  .eq('id', sessionId)
  .single();
```

### Option 2: Implement Field-Level Security in Queries

Always explicitly select only needed fields:

```typescript
// Good - Limits data exposure
.select('id, player_name, is_generated_name')

// Bad - Exposes all fields including email
.select('*')
```

### Option 3: Create Supabase Functions for Sensitive Operations

For operations involving email or other PII:

```sql
CREATE OR REPLACE FUNCTION update_session_email(
  p_session_id UUID,
  p_email TEXT,
  p_name TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE adventure_sessions 
  SET 
    email = p_email,
    player_name = COALESCE(p_name, player_name),
    updated_at = NOW()
  WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Then call from client:
```typescript
await supabase.rpc('update_session_email', {
  p_session_id: sessionId,
  p_email: email,
  p_name: name
});
```

## Implementation Priority

1. **High Priority**: Update `loadSession` in `utils.ts` to not select all fields
2. **Medium Priority**: Update `SessionEmailForm.tsx` to use secure view
3. **Low Priority**: Consider moving email updates to server-side function

## Testing the Security

After implementing changes, test with:

```typescript
// This should FAIL after implementing field restrictions
const { data, error } = await supabase
  .from('adventure_sessions')
  .select('email') // Should not be accessible
  .eq('id', 'some-session-id');

// This should SUCCEED
const { data, error } = await supabase
  .from('adventure_sessions_public')
  .select('player_name, is_generated_name')
  .eq('id', 'some-session-id');
```

## Current RLS Policy Summary

With the refined policies:

✅ **Anonymous users CAN**:
- Create new sessions
- Update their own sessions (if they know the ID)
- Read basic session info (no email/PII)
- Write analytics, choices, scene visits
- Join waitlists

❌ **Anonymous users CANNOT**:
- List all sessions
- Read emails from sessions
- Read analytics data
- Read waitlist entries
- Access other users' data without the session ID

This provides a good balance between functionality and security for an anonymous user system.