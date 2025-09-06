import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, OPTIONS } from '../route';
import * as tagManager from '../tag-manager';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock tag manager
vi.mock('../tag-manager', () => ({
  applyTagsToSubscriber: vi.fn(),
}));

const mockApplyTagsToSubscriber = vi.mocked(tagManager.applyTagsToSubscriber);

// Mock environment variables
const originalEnv = process.env;

describe('/api/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApplyTagsToSubscriber.mockClear();
    process.env = {
      ...originalEnv,
      CONVERTKIT_API_SECRET: 'test-secret',
      CONVERTKIT_FORM_ID: 'test-form-id',
      NODE_ENV: 'test',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('POST /api/subscribe', () => {
    it('should successfully subscribe a user with basic data', async () => {
      // Mock successful ConvertKit response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          subscription: {
            id: 123,
            state: 'active',
            email_address: 'test@example.com',
            created_at: '2024-01-01T00:00:00Z',
          },
        }),
      });

      // Mock successful Slack notification response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'Test',
          source: 'website',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Successfully subscribed to email list');
      expect(data.subscription).toBeDefined();
      // Should have 1 call for ConvertKit subscription + 1 call for Slack notification
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should successfully subscribe with tags using optimized tag manager', async () => {
      // Mock successful ConvertKit subscription response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          subscription: {
            id: 123,
            state: 'active',
            email_address: 'test@example.com',
            created_at: '2024-01-01T00:00:00Z',
          },
        }),
      });

      // Mock successful Slack notification response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      // Mock tag manager success
      mockApplyTagsToSubscriber.mockResolvedValueOnce({
        success: 3,
        failed: 0
      });

      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'Test',
          source: 'website',
          tags: ['tag1', 'tag2', 'tag3'],
          customFields: { budget: '10000' },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      
      // Should have 1 call for ConvertKit subscription + 1 call for Slack notification
      // Tag management is handled by the tag manager (mocked)
      expect(mockFetch).toHaveBeenCalledTimes(2);
      
      // Verify tag manager was called with correct parameters
      expect(mockApplyTagsToSubscriber).toHaveBeenCalledWith(
        'test-secret',
        ['tag1', 'tag2', 'tag3'],
        'test@example.com'
      );
    });

    it('should handle tag addition failures gracefully', async () => {
      // Mock successful ConvertKit subscription response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          subscription: {
            id: 123,
            state: 'active',
            email_address: 'test@example.com',
            created_at: '2024-01-01T00:00:00Z',
          },
        }),
      });

      // Mock successful Slack notification response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      // Mock tag manager partial failure
      mockApplyTagsToSubscriber.mockResolvedValueOnce({
        success: 1,
        failed: 1
      });

      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'Test',
          source: 'website',
          tags: ['tag1', 'tag2'],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should still succeed even if tag addition partially fails
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Successfully subscribed to email list');
      
      expect(mockApplyTagsToSubscriber).toHaveBeenCalledWith(
        'test-secret',
        ['tag1', 'tag2'],
        'test@example.com'
      );
    });

    it('should validate email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          firstName: 'Test',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid request data');
      expect(data.details).toBeDefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle missing environment variables', async () => {
      process.env.CONVERTKIT_API_SECRET = '';
      process.env.CONVERTKIT_FORM_ID = '';

      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'Test',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Email service configuration error');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle ConvertKit 400 errors with specific message parsing', async () => {
      const errorResponse = {
        message: 'Email address is invalid',
        error: 'INVALID_EMAIL',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => JSON.stringify(errorResponse),
      });

      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'Test',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Email address is invalid');
    });

    it('should handle ConvertKit 400 errors with malformed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => 'Invalid JSON response',
      });

      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'Test',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid email address or already subscribed');
    });

    it('should handle ConvertKit 500 errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server error',
      });

      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'Test',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to subscribe to email list');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'Test',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle malformed JSON request', async () => {
      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('OPTIONS /api/subscribe', () => {
    it('should return correct CORS headers for development', async () => {
      process.env.NODE_ENV = 'development';
      delete process.env.DEPLOY_PRIME_URL;
      delete process.env.DEPLOY_URL;

      const response = await OPTIONS();

      expect(response.status).toBe(200);
      const headers = Object.fromEntries(response.headers.entries());
      expect(headers['access-control-allow-origin']).toBe('http://localhost:8080');
      expect(headers['access-control-allow-methods']).toBe('POST, OPTIONS');
      expect(headers['access-control-allow-headers']).toBe('Content-Type');
    });

    it('should return restricted CORS headers for production', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.DEPLOY_PRIME_URL;
      delete process.env.DEPLOY_URL;

      const response = await OPTIONS();

      expect(response.status).toBe(200);
      const headers = Object.fromEntries(response.headers.entries());
      expect(headers['access-control-allow-origin']).toBe('https://vibecto.ai');
      expect(headers['access-control-allow-methods']).toBe('POST, OPTIONS');
      expect(headers['access-control-allow-headers']).toBe('Content-Type');
    });

    it('should handle Netlify deploy preview URLs', async () => {
      process.env.NODE_ENV = 'test';
      process.env.DEPLOY_PRIME_URL = 'https://deploy-preview-123--vibecto.netlify.app';
      delete process.env.DEPLOY_URL;

      const response = await OPTIONS();

      expect(response.status).toBe(200);
      const headers = Object.fromEntries(response.headers.entries());
      expect(headers['access-control-allow-origin']).toBe('https://deploy-preview-123--vibecto.netlify.app');
    });

    it('should handle Netlify branch deploy URLs', async () => {
      process.env.NODE_ENV = 'test';
      delete process.env.DEPLOY_PRIME_URL;
      process.env.DEPLOY_URL = 'https://feature-branch--vibecto.netlify.app';

      const response = await OPTIONS();

      expect(response.status).toBe(200);
      const headers = Object.fromEntries(response.headers.entries());
      expect(headers['access-control-allow-origin']).toBe('https://feature-branch--vibecto.netlify.app');
    });

    it('should fallback to wildcard for unknown environments', async () => {
      process.env.NODE_ENV = 'test';
      delete process.env.DEPLOY_PRIME_URL;
      delete process.env.DEPLOY_URL;

      const response = await OPTIONS();

      expect(response.status).toBe(200);
      const headers = Object.fromEntries(response.headers.entries());
      expect(headers['access-control-allow-origin']).toBe('*');
    });
  });
});