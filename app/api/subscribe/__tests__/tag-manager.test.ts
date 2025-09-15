import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOrCreateTagId, applyTagToSubscriber, applyTagsToSubscriber } from '../tag-manager';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Get the mocked supabase client
const mockSupabaseClient = vi.mocked(supabase);

describe('tag-manager', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default Supabase mock implementations
    mockSupabaseClient.rpc.mockResolvedValue({ error: null });
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
  });

  describe('getOrCreateTagId', () => {
    it('should return cached tag ID when available', async () => {
      // Mock cache hit
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gt: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { tag_id: 5 }, error: null }),
      });

      const tagId = await getOrCreateTagId('test-secret', 'cached-tag');

      expect(tagId).toBe(5);
      // Should not call ConvertKit API when cached
      expect(mockFetch).not.toHaveBeenCalled();
      // Should call cache cleanup
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('cleanup_expired_tag_cache');
    });

    it('should return existing tag ID when tag exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tags: [
            { id: 1, name: 'existing-tag' },
            { id: 2, name: 'another-tag' },
          ],
        }),
      });

      const tagId = await getOrCreateTagId('test-secret', 'existing-tag');

      expect(tagId).toBe(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.convertkit.com/v3/tags?api_secret=test-secret'
      );
      // Should cache all fetched tags
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('upsert_tag_cache', {
        p_tag_name: 'existing-tag',
        p_tag_id: 1
      });
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('upsert_tag_cache', {
        p_tag_name: 'another-tag',
        p_tag_id: 2
      });
    });

    it('should create new tag when tag does not exist', async () => {
      // Mock tags fetch - tag doesn't exist
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tags: [
            { id: 1, name: 'existing-tag' },
          ],
        }),
      });

      // Mock tag creation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tag: { id: 3, name: 'new-tag' },
        }),
      });

      const tagId = await getOrCreateTagId('test-secret', 'new-tag');

      expect(tagId).toBe(3);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(2, 
        'https://api.convertkit.com/v3/tags',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_secret: 'test-secret',
            tag: { name: 'new-tag' }
          })
        }
      );
      // Should cache the newly created tag
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('upsert_tag_cache', {
        p_tag_name: 'new-tag',
        p_tag_id: 3
      });
    });


    it('should handle API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const tagId = await getOrCreateTagId('test-secret', 'error-tag');

      expect(tagId).toBeNull();
    });

    it('should handle failed tag creation', async () => {
      // Mock tags fetch - tag doesn't exist
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tags: [] }),
      });

      // Mock failed tag creation
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      const tagId = await getOrCreateTagId('test-secret', 'failed-tag');

      expect(tagId).toBeNull();
    });
  });

  describe('applyTagToSubscriber', () => {
    it('should successfully apply tag to subscriber', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const result = await applyTagToSubscriber('test-secret', 123, 'test@example.com', 'test-tag');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.convertkit.com/v3/tags/123/subscribe',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_secret: 'test-secret',
            email: 'test@example.com'
          })
        }
      );
    });

    it('should handle failed tag application', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad request'
      });

      const result = await applyTagToSubscriber('test-secret', 123, 'test@example.com', 'test-tag');

      expect(result).toBe(false);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await applyTagToSubscriber('test-secret', 123, 'test@example.com', 'test-tag');

      expect(result).toBe(false);
    });
  });

  describe('applyTagsToSubscriber', () => {
    it('should handle empty tag list', async () => {
      const result = await applyTagsToSubscriber('test-secret', [], 'test@example.com');

      expect(result).toEqual({ success: 0, failed: 0 });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should apply multiple tags successfully', async () => {
      // Mock fetching existing tags
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          tags: [
            { id: 1, name: 'tag1' },
            { id: 2, name: 'tag2' },
          ],
        }),
      });

      // Mock successful tag applications
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const result = await applyTagsToSubscriber('test-secret', ['tag1', 'tag2'], 'test@example.com');

      expect(result.success).toBe(2);
      expect(result.failed).toBe(0);
    });

    it('should handle partial failures', async () => {
      // Mock fetching existing tags
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tags: [{ id: 1, name: 'tag1' }],
        }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tags: [],
        }),
      });

      // Mock tag creation failure for tag2
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      // Mock successful application for tag1
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const result = await applyTagsToSubscriber('test-secret', ['tag1', 'tag2'], 'test@example.com');

      expect(result.success).toBe(1);
      expect(result.failed).toBe(1);
    });

    it('should handle all tag resolution failures', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await applyTagsToSubscriber('test-secret', ['tag1', 'tag2'], 'test@example.com');

      expect(result.success).toBe(0);
      expect(result.failed).toBe(2);
    });
  });
});