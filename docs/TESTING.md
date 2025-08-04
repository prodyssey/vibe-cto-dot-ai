# Testing Documentation

## Overview

This project uses Vitest for unit and integration testing, with React Testing Library for component testing. All form submissions are tested with mocked database calls to ensure no test data pollutes the production database.

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once (for CI)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

### Test Files Location
- Component tests: `src/components/__tests__/`
- Test utilities: `src/test/`
- Mocks: `src/test/mocks/`

### Key Test Files
- `IgnitionQualificationForm.test.tsx` - Tests the Ignition program qualification form
- `LaunchControlQualificationForm.test.tsx` - Tests the Launch Control qualification form
- `EmailOptIn.test.tsx` - Tests the email subscription form

## Database Mocking

All Supabase calls are mocked in tests to prevent any test data from being written to the production database.

### Mock Setup
```typescript
// src/test/mocks/supabase.ts
export const mockSupabaseClient = {
  from: vi.fn(() => ({
    insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    // ... other methods
  })),
  // ... auth methods
}
```

### Using Mocks in Tests
```typescript
import { mockSuccessfulInsert, mockFailedInsert } from '@/test/mocks/supabase'

// Mock a successful insert
mockSuccessfulInsert('table_name')

// Mock a failed insert
mockFailedInsert('table_name', { message: 'Error message' })
```

## Form Testing Strategy

### What We Test
1. **Form Validation**
   - Required fields
   - Email format validation
   - Phone number validation when required
   - Custom validation rules

2. **User Flows**
   - Budget selection → appropriate next step
   - Navigation between form steps
   - Back button functionality

3. **Submission Handling**
   - Success states
   - Error handling
   - Loading states
   - Toast notifications

4. **Edge Cases**
   - Whitespace trimming
   - Case normalization
   - Special characters

### Example Test
```typescript
it('validates email format', async () => {
  render(<EmailOptIn />)
  
  const emailInput = screen.getByPlaceholderText('your@email.com')
  const submitButton = screen.getByRole('button', { name: /Join Waitlist/i })
  
  await user.type(emailInput, 'invalid-email')
  await user.click(submitButton)
  
  await waitFor(() => {
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument()
  })
})
```

## CI/CD Integration

### GitHub Actions Workflow
The `.github/workflows/pr-tests.yml` workflow runs on every pull request and includes:

1. **Test Job** - Runs linter, tests, and build
2. **Form Tests Job** - Specifically runs form submission tests
3. **Coverage Job** - Generates and uploads coverage reports

### Environment Variables
Tests use mock environment variables to ensure no connection to real services:
```yaml
env:
  VITE_SUPABASE_URL: https://test.supabase.co
  VITE_SUPABASE_ANON_KEY: test-anon-key
```

## Best Practices

1. **Always Mock External Services**
   - Never make real API calls in tests
   - Mock all Supabase operations
   - Mock analytics and tracking calls

2. **Use Testing Library Queries**
   - Prefer `getByRole`, `getByLabelText` over `getByTestId`
   - Use `userEvent` for user interactions
   - Wait for async operations with `waitFor`

3. **Test User Behavior**
   - Test what users see and do, not implementation details
   - Focus on accessibility (proper labels, roles)
   - Test error states and edge cases

4. **Keep Tests Maintainable**
   - Use descriptive test names
   - Group related tests with `describe` blocks
   - Reset mocks between tests
   - Keep tests focused and independent

## Debugging Tests

### Run Single Test File
```bash
npm test src/components/__tests__/EmailOptIn.test.tsx
```

### Run Tests Matching Pattern
```bash
npm test -- -t "validates email"
```

### Debug in VS Code
Add this configuration to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "autoAttachChildProcesses": true,
  "skipFiles": ["<node_internals>/**", "**/node_modules/**"],
  "program": "${workspaceRoot}/node_modules/vitest/vitest.mjs",
  "args": ["run", "${file}"],
  "smartStep": true,
  "console": "integratedTerminal"
}
```

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in specific tests: `test('name', async () => {}, 10000)`
   - Check for missing `await` statements

2. **Can't find element**
   - Use `screen.debug()` to see current DOM
   - Check if element is rendered conditionally
   - Ensure proper data-testid or accessible selectors

3. **Mock not working**
   - Verify mock is imported before component
   - Check mock is reset in `beforeEach`
   - Ensure mock matches actual API structure