// Test data factories for generating consistent test data

export interface TestUser {
  name: string;
  email: string;
  phone?: string;
}

export interface TestContactFormData extends TestUser {
  company?: string;
  inquiryType: string;
  preferredContact: 'email' | 'phone' | 'text' | 'either';
  message: string;
}

export interface TestWaitlistFormData extends TestUser {
  contactMethod: 'email' | 'phone' | 'text' | 'either';
}

// Generate unique test email
export function generateTestEmail(prefix = 'test'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${prefix}-${timestamp}-${random}@example.com`;
}

// Generate unique test phone number
export function generateTestPhone(): string {
  const randomDigits = Math.floor(Math.random() * 9000000) + 1000000; // 7 digits
  return `555${randomDigits}`;
}

// Generate test user
export function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
  return {
    name: 'Test User',
    email: generateTestEmail('user'),
    phone: generateTestPhone(),
    ...overrides
  };
}

// Generate test contact form data
export function createTestContactFormData(overrides: Partial<TestContactFormData> = {}): TestContactFormData {
  const user = createTestUser();
  return {
    ...user,
    company: 'Test Company',
    inquiryType: 'general',
    preferredContact: 'email',
    message: 'This is a test message for automated testing.',
    ...overrides
  };
}

// Generate test waitlist form data
export function createTestWaitlistFormData(overrides: Partial<TestWaitlistFormData> = {}): TestWaitlistFormData {
  const user = createTestUser();
  return {
    ...user,
    contactMethod: 'email',
    ...overrides
  };
}

// Generate test session ID
export function generateTestSessionId(): string {
  return crypto.randomUUID();
}

// Contact form inquiry types
export const INQUIRY_TYPES = [
  'ignition',
  'launch-control', 
  'transformation',
  'partnership',
  'media',
  'general',
  'other'
] as const;

// Contact methods
export const CONTACT_METHODS = [
  'email',
  'phone', 
  'text',
  'either'
] as const;

// Validation helpers
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\d{3}\d{7}$/.test(phone.replace(/\D/g, ''));
}

// Wait helpers for async operations
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test data cleanup patterns
export const TEST_EMAIL_PATTERNS = [
  /test-\d+-\w+@example\.com/,
  /playwright-\d+-\w+@example\.com/,
  /e2e-\d+-\w+@example\.com/
];

export function isTestEmail(email: string): boolean {
  return TEST_EMAIL_PATTERNS.some(pattern => pattern.test(email));
}