import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  subscribeToConvertKit, 
  getContextualTags, 
  getCustomFields,
  type SubscribeOptions,
  type CustomFieldsData 
} from '../convertkit';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ConvertKit Helper Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('subscribeToConvertKit', () => {
    it('should successfully subscribe with basic options', async () => {
      const mockResponse = {
        success: true,
        message: 'Successfully subscribed',
        subscription: {
          id: 123,
          state: 'active',
          email_address: 'test@example.com',
          created_at: '2024-01-01T00:00:00Z',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const options: SubscribeOptions = {
        email: 'test@example.com',
        firstName: 'Test',
        source: 'website',
      };

      const result = await subscribeToConvertKit(options);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Successfully subscribed');
      expect(result.subscription).toEqual(mockResponse.subscription);
      expect(mockFetch).toHaveBeenCalledWith('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });
    });

    it('should handle API errors gracefully', async () => {
      const errorResponse = {
        error: 'Invalid email address',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => errorResponse,
      });

      const options: SubscribeOptions = {
        email: 'invalid@example.com',
        firstName: 'Test',
      };

      const result = await subscribeToConvertKit(options);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email address');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const options: SubscribeOptions = {
        email: 'test@example.com',
        firstName: 'Test',
      };

      const result = await subscribeToConvertKit(options);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error. Please try again.');
    });

    it('should include all optional fields in request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Success' }),
      });

      const options: SubscribeOptions = {
        email: 'test@example.com',
        firstName: 'Test',
        source: 'adventure-game',
        tags: ['tag1', 'tag2'],
        customFields: { budget: '10000', company: 'Test Corp' },
      };

      await subscribeToConvertKit(options);

      expect(mockFetch).toHaveBeenCalledWith('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });
    });
  });

  describe('getContextualTags', () => {
    it('should return correct tags for adventure game contexts', () => {
      expect(getContextualTags('adventure-ignition')).toEqual([
        'adventure-game',
        'ignition-interested',
      ]);

      expect(getContextualTags('adventure-launch-control')).toEqual([
        'adventure-game',
        'launch-control-interested',
      ]);

      expect(getContextualTags('adventure-transformation')).toEqual([
        'adventure-game',
        'transformation-interested',
      ]);
    });

    it('should return correct tags for qualification forms', () => {
      expect(getContextualTags('ignition-qualification')).toEqual([
        'ignition-qualified',
        'high-intent',
      ]);

      expect(getContextualTags('launch-control-qualification')).toEqual([
        'launch-control-qualified',
        'high-intent',
      ]);
    });

    it('should return correct tags for waitlists', () => {
      expect(getContextualTags('ignition-waitlist')).toEqual([
        'ignition-waitlist',
        'high-intent',
      ]);

      expect(getContextualTags('launch-control-waitlist')).toEqual([
        'launch-control-waitlist',
        'high-intent',
      ]);
    });

    it('should return correct tags for website interactions', () => {
      expect(getContextualTags('website-signup')).toEqual(['website-visitor']);
      expect(getContextualTags('blog-post')).toEqual(['blog-reader']);
      expect(getContextualTags('resource-download')).toEqual(['resource-interested']);
    });

    it('should return correct tags for budget levels', () => {
      expect(getContextualTags('high-budget')).toEqual(['high-budget', 'qualified-lead']);
      expect(getContextualTags('mid-budget')).toEqual(['mid-budget']);
      expect(getContextualTags('low-budget')).toEqual(['low-budget']);
      expect(getContextualTags('exploring')).toEqual(['exploring']);
    });

    it('should return empty array for unknown contexts', () => {
      expect(getContextualTags('unknown-context')).toEqual([]);
      expect(getContextualTags('')).toEqual([]);
    });
  });

  describe('getCustomFields', () => {
    it('should always include source and signup_date', () => {
      const result = getCustomFields('website-signup');

      expect(result.source).toBe('website-signup');
      expect(result.signup_date).toBeDefined();
      expect(new Date(result.signup_date)).toBeInstanceOf(Date);
    });

    it('should categorize budget correctly', () => {
      const testCases = [
        { budget: 20000, expected: 'high' },
        { budget: 15000, expected: 'high' },
        { budget: 10000, expected: 'mid' },
        { budget: 5000, expected: 'mid' },
        { budget: 2000, expected: 'low' },
        { budget: 1, expected: 'low' },
        { budget: 0, expected: 'exploring' },
      ];

      testCases.forEach(({ budget, expected }) => {
        const data: CustomFieldsData = { budget };
        const result = getCustomFields('test-context', data);
        
        expect(result.budget).toBe(String(budget));
        expect(result.budget_category).toBe(expected);
      });
    });

    it('should include contact method preference', () => {
      const data: CustomFieldsData = { contactMethod: 'email' };
      const result = getCustomFields('test-context', data);

      expect(result.preferred_contact).toBe('email');
    });

    it('should include program interest', () => {
      const data: CustomFieldsData = { program: 'ignition' };
      const result = getCustomFields('test-context', data);

      expect(result.interested_program).toBe('ignition');
    });

    it('should include company information', () => {
      const data: CustomFieldsData = { company: 'Test Corp' };
      const result = getCustomFields('test-context', data);

      expect(result.company).toBe('Test Corp');
    });

    it('should include current scale', () => {
      const data: CustomFieldsData = { currentScale: 'startup' };
      const result = getCustomFields('test-context', data);

      expect(result.current_scale).toBe('startup');
    });

    it('should handle multiple fields together', () => {
      const data: CustomFieldsData = {
        budget: 15000,
        contactMethod: 'phone',
        program: 'launch-control',
        company: 'Big Corp',
        currentScale: 'enterprise',
      };

      const result = getCustomFields('qualification-form', data);

      expect(result.source).toBe('qualification-form');
      expect(result.budget).toBe('15000');
      expect(result.budget_category).toBe('high');
      expect(result.preferred_contact).toBe('phone');
      expect(result.interested_program).toBe('launch-control');
      expect(result.company).toBe('Big Corp');
      expect(result.current_scale).toBe('enterprise');
      expect(result.signup_date).toBeDefined();
    });

    it('should handle empty data object', () => {
      const result = getCustomFields('test-context', {});

      expect(result.source).toBe('test-context');
      expect(result.signup_date).toBeDefined();
      expect(Object.keys(result)).toHaveLength(2);
    });

    it('should handle undefined data', () => {
      const result = getCustomFields('test-context');

      expect(result.source).toBe('test-context');
      expect(result.signup_date).toBeDefined();
      expect(Object.keys(result)).toHaveLength(2);
    });

    it('should handle extra fields not in interface', () => {
      const data: CustomFieldsData = {
        budget: 10000,
        extraField: 'extra value',
        anotherField: 123,
      };

      const result = getCustomFields('test-context', data);

      expect(result.source).toBe('test-context');
      expect(result.budget).toBe('10000');
      expect(result.budget_category).toBe('mid');
      expect(result.signup_date).toBeDefined();
      // Extra fields are not included in the result
      expect(result.extraField).toBeUndefined();
      expect(result.anotherField).toBeUndefined();
    });
  });
});