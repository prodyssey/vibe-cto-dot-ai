# End-to-End Testing with Playwright

This directory contains comprehensive end-to-end tests for all form submissions in the application, including database validation and automated cleanup.

## Test Structure

### Test Files
- `contact-form.spec.ts` - Tests for the main contact form
- `community-waitlist-form.spec.ts` - Tests for community waitlist submissions
- `email-optin-form.spec.ts` - Tests for email subscription forms
- `adventure-forms.spec.ts` - Tests for all adventure game forms (Ignition, Launch Control, Session Email)

### Utilities
- `utils/database.ts` - Database testing utilities with Supabase integration
- `utils/test-data.ts` - Test data factories and validation helpers
- `global-setup.ts` - Global test setup with database health checks
- `global-teardown.ts` - Global test cleanup

## Features

### Database Integration
- ✅ **Real database testing** with Supabase integration
- ✅ **Automatic cleanup** of test data after each test
- ✅ **Database health checks** before test runs
- ✅ **Data verification** to ensure form submissions are properly saved

### Form Coverage
- ✅ **Contact Form** - Full validation, database storage, Slack notifications
- ✅ **Community Waitlist** - Email validation, duplicate detection, contact methods
- ✅ **Email Opt-in** - API route testing, ConvertKit integration
- ✅ **Adventure Forms** - Session management, waitlist submissions, email capture

### Test Scenarios
- ✅ **Happy path** submissions with database validation
- ✅ **Form validation** for required fields and formats
- ✅ **Error handling** for API failures and edge cases
- ✅ **Loading states** and user feedback
- ✅ **Cross-browser compatibility** (Chromium by default)
- ✅ **Mobile responsiveness** testing

## Setup

### Prerequisites
1. **Environment Variables** - Ensure you have these set in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   # For cleanup operations, you may need:
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Development Server** - Tests expect the app to be running on `http://localhost:8080`

3. **Database Access** - Tests need read/write access to your Supabase database

### Installation
```bash
# Install Playwright and dependencies (already done)
npm install --save-dev @playwright/test @types/node

# Install Playwright browsers
npx playwright install
```

## Running Tests

### Basic Commands
```bash
# Run all E2E tests
npm run test:e2e

# Run tests in headed mode (see the browser)
npm run test:e2e:headed

# Debug tests interactively
npm run test:e2e:debug

# View test report
npm run test:e2e:report

# Generate new tests interactively
npm run test:e2e:codegen
```

### Specific Test Files
```bash
# Run only contact form tests
npx playwright test contact-form

# Run only adventure game tests
npx playwright test adventure-forms

# Run tests matching a pattern
npx playwright test --grep "validation"
```

### Development Workflow
```bash
# Start development server
npm run dev

# In another terminal, run tests
npm run test:e2e:headed
```

## Database Testing

### Test Data Management
- **Unique emails** - Each test generates unique email addresses to avoid conflicts
- **Session IDs** - Adventure game tests use real UUIDs for session tracking
- **Automatic cleanup** - All test data is cleaned up after each test
- **Isolation** - Tests run sequentially to avoid database conflicts

### Verification Methods
```typescript
// Verify contact form submission
const contact = await testDb.verifyContactSubmission(email, sessionId);
expect(contact?.name).toBe(expectedName);

// Verify waitlist submission
const waitlistEntry = await testDb.verifyIgnitionWaitlistSubmission(sessionId);
expect(waitlistEntry?.contact_method).toBe('email');

// Verify session updates
const session = await testDb.verifyAdventureSessionUpdate(sessionId, {
  email: testEmail,
  is_generated_name: false
});
```

### Manual Cleanup
If tests fail unexpectedly and don't clean up:
```typescript
// Clean up by email
await testDb.cleanupByEmail('test-email@example.com');

// Clean up by session ID  
await testDb.cleanupBySessionId('session-uuid');

// Full cleanup of tracked data
await testDb.cleanup();
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your Supabase environment variables
   - Ensure your database is accessible
   - Verify your API keys have the correct permissions

2. **Tests Timing Out**
   - Increase timeout in `playwright.config.ts`
   - Check if your development server is running
   - Verify network connectivity to external services

3. **Form Elements Not Found**
   - Check if the page structure has changed
   - Update selectors in test files
   - Use `npm run test:e2e:codegen` to record new interactions

4. **Database Cleanup Issues**
   - Check database permissions
   - Look for foreign key constraints preventing deletion
   - Manually verify test data was created correctly

### Debugging Tests
```bash
# Run with verbose output
npx playwright test --reporter=verbose

# Run single test in debug mode
npx playwright test contact-form.spec.ts:10 --debug

# Take screenshots on failure (already configured)
npx playwright test --screenshot=only-on-failure
```

## Configuration

### Playwright Config
The `playwright.config.ts` file is configured for:
- Single worker (no parallel execution) for database consistency
- Automatic dev server startup
- Screenshot and video capture on failures
- HTML and JSON reporting

### Test Environment
Tests are configured to:
- Run against `http://localhost:8080`
- Use real database connections
- Clean up all test data automatically
- Handle external service failures gracefully

## Best Practices

1. **Data Isolation** - Each test uses unique test data
2. **Database Cleanup** - Always clean up test data in `afterEach`
3. **Realistic Testing** - Use real database and API integrations
4. **Error Handling** - Test both success and failure scenarios
5. **Responsive Design** - Include mobile viewport testing
6. **Loading States** - Verify user feedback during submissions

## Adding New Tests

1. Create test data in `utils/test-data.ts`
2. Add database verification methods in `utils/database.ts`
3. Create new test file following existing patterns
4. Include proper cleanup in `afterEach` hooks
5. Test both happy path and error scenarios