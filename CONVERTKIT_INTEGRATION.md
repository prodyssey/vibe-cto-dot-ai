# ConvertKit Integration

This document describes the server-side ConvertKit integration implemented for email collection and tagging.

## Overview

All email collection throughout the application now goes through a centralized Next.js API route that:
1. Validates email addresses server-side
2. Subscribes users to ConvertKit with contextual tags
3. Adds custom fields based on signup context
4. Handles errors gracefully without breaking user flows

## API Route

**Endpoint:** `POST /api/subscribe`

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "source": "ignition-waitlist",
  "tags": ["ignition-interested", "high-intent"],
  "customFields": {
    "budget": "15000",
    "contact_method": "email",
    "program": "ignition"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to email list",
  "subscription": { "id": "123" }
}
```

## Environment Variables

Required environment variables:

```bash
# ConvertKit Form ID (can be public)
CONVERTKIT_FORM_ID=your-form-id
NEXT_PUBLIC_CONVERTKIT_FORM_ID=your-form-id

# ConvertKit API Secret (must be private)
CONVERTKIT_API_SECRET=your-api-secret
```

## Components Updated

### 1. EmailOptIn Component

The main newsletter signup component now supports:
- **source**: Context identifier for where the signup occurred
- **tags**: Array of tags to apply to the subscriber
- **customFields**: Additional metadata to store

**Usage:**
```tsx
<EmailOptIn 
  source="blog-post"
  tags={["blog-reader", "high-intent"]}
  customFields={{ post_title: "Getting Started with Vibe Coding" }}
/>
```

### 2. Adventure Game Forms

All adventure game forms now automatically subscribe users to ConvertKit with contextual information:

- **IgnitionWaitlistForm**: Tags with "adventure-ignition", "ignition-waitlist"
- **LaunchControlWaitlistForm**: Tags with "adventure-launch-control", "launch-control-waitlist"  
- **IgnitionContactScreen**: Tags with "adventure-ignition" when contact is provided

### 3. Qualification Forms

Both qualification forms subscribe users with full context including budget information:

- **IgnitionQualificationForm**: Includes budget category tags (high-budget, mid-budget, low-budget, exploring)
- **LaunchControlQualificationForm**: Same budget tagging plus launch-control context

## Tagging Strategy

### Contextual Tags

The system automatically applies contextual tags based on signup source:

- **adventure-game**: All adventure game signups
- **ignition-interested**: Interest in Ignition program
- **launch-control-interested**: Interest in Launch Control program
- **high-intent**: Users who provided detailed information
- **qualified-lead**: Users with budgets ≥ $15k

### Budget Category Tags

- **high-budget**: $15k+
- **mid-budget**: $5k-$14.9k  
- **low-budget**: $1-$4.9k
- **exploring**: $0

### Custom Fields

Common custom fields include:

- **source**: Where they signed up
- **signup_date**: When they signed up
- **budget**: Specific budget amount
- **budget_category**: high/mid/low/exploring
- **preferred_contact**: email/phone/text/either
- **interested_program**: ignition/launch-control
- **company**: Company name (if provided)
- **current_scale**: Current scale info (if provided)

## Error Handling

The integration includes robust error handling:

1. **Validation Errors**: Server-side email validation with user-friendly error messages
2. **ConvertKit API Errors**: Logged but don't break form submission
3. **Network Errors**: Graceful degradation with retry messaging
4. **Fallback**: Database operations continue even if ConvertKit fails

## Testing

The EmailOptIn component includes comprehensive tests covering:
- Successful subscription flow
- Error handling scenarios  
- Form validation
- Loading states
- Different variants

Run tests with:
```bash
npm run test src/components/__tests__/EmailOptIn.test.tsx
```

## Security

- API secret is stored server-side only
- Form ID can be public (it's just an identifier)
- All requests go through our controlled API route
- Input validation prevents malicious data
- No direct client-side ConvertKit API calls

## Helper Functions

The `src/lib/convertkit.ts` file provides helper functions:

- **subscribeToConvertKit()**: Main subscription function
- **getContextualTags()**: Get tags based on context
- **getCustomFields()**: Generate custom fields from data

These helpers ensure consistent tagging and data handling across all forms.