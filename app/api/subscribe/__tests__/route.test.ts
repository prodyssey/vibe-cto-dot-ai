import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, OPTIONS } from '../route';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock environment variables
const originalEnv = process.env;

describe('/api/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should successfully subscribe with tags and parallelize tag addition', async () => {
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

      // Mock successful tag addition responses
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
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
      // Should have 1 call for subscription + 3 calls for tags
      expect(mockFetch).toHaveBeenCalledTimes(4);

      // Verify tag addition calls are made with correct data
      const tagCalls = mockFetch.mock.calls.slice(1);
      expect(tagCalls).toHaveLength(3);
      tagCalls.forEach((call, index) => {
        expect(call[0]).toBe('https://api.convertkit.com/v3/tags');
        expect(call[1].method).toBe('POST');
        const body = JSON.parse(call[1].body);
        expect(body.tag.name).toBe(`tag${index + 1}`);
        expect(body.tag.email).toBe('test@example.com');
      });
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

      // Mock tag addition failures
      mockFetch.mockRejectedValue(new Error('Tag addition failed'));

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

      // Should still succeed even if tag addition fails
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Successfully subscribed to email list');
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