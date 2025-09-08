/**
 * ConvertKit Tag Management Utility
 * Handles tag creation and ID resolution with caching to optimize performance
 */

interface Tag {
  id: number;
  name: string;
}

type TagCache = Record<string, {
  id: number;
  timestamp: number;
}>;

// In-memory cache with 5 minute TTL
const tagCache: TagCache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Clears expired cache entries
 */
function clearExpiredCache(): void {
  const now = Date.now();
  Object.keys(tagCache).forEach(tagName => {
    if (now - tagCache[tagName].timestamp > CACHE_TTL) {
      delete tagCache[tagName];
    }
  });
}

/**
 * Gets tag ID from cache if available and not expired
 */
function getCachedTagId(tagName: string): number | null {
  clearExpiredCache();
  const cached = tagCache[tagName];
  return cached ? cached.id : null;
}

/**
 * Caches a tag ID with current timestamp
 */
function cacheTagId(tagName: string, tagId: number): void {
  tagCache[tagName] = {
    id: tagId,
    timestamp: Date.now()
  };
}

/**
 * Fetches all tags from ConvertKit API
 */
async function fetchAllTags(apiSecret: string): Promise<Tag[]> {
  const response = await fetch(`https://api.convertkit.com/v3/tags?api_secret=${apiSecret}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.tags || [];
}

/**
 * Creates a new tag in ConvertKit
 */
async function createTag(apiSecret: string, tagName: string): Promise<number | null> {
  const response = await fetch('https://api.convertkit.com/v3/tags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_secret: apiSecret,
      tag: { name: tagName }
    }),
  });

  if (!response.ok) {
    console.warn(`Failed to create tag "${tagName}":`, response.status, response.statusText);
    return null;
  }

  const data = await response.json();
  const tagId = data.tag?.id;
  
  if (tagId) {
    // Cache the newly created tag
    cacheTagId(tagName, tagId);
  }
  
  return tagId;
}

/**
 * Gets or creates a tag and returns its ID
 * Uses caching to minimize API calls
 */
export async function getOrCreateTagId(apiSecret: string, tagName: string): Promise<number | null> {
  // Check cache first
  const cachedId = getCachedTagId(tagName);
  if (cachedId) {
    return cachedId;
  }

  try {
    // Fetch all tags to check if it exists
    const tags = await fetchAllTags(apiSecret);
    
    // Cache all fetched tags to optimize future lookups
    tags.forEach(tag => {
      cacheTagId(tag.name, tag.id);
    });

    // Check if our target tag exists
    const existingTag = tags.find(tag => tag.name === tagName);
    if (existingTag) {
      return existingTag.id;
    }

    // Tag doesn't exist, create it
    return await createTag(apiSecret, tagName);
  } catch (error) {
    console.error(`Error getting or creating tag "${tagName}":`, error);
    return null;
  }
}

/**
 * Applies a tag to a subscriber using the tag ID
 */
export async function applyTagToSubscriber(
  apiSecret: string, 
  tagId: number, 
  email: string, 
  tagName: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/tags/${tagId}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_secret: apiSecret,
          email,
        }),
      }
    );

    if (!response.ok) {
      const responseText = await response.text();
      console.warn(`Failed to apply tag "${tagName}" to ${email}:`, response.status, responseText);
      return false;
    }

    console.log(`Successfully applied tag "${tagName}" to ${email}`);
    return true;
  } catch (error) {
    console.error(`Error applying tag "${tagName}" to ${email}:`, error);
    return false;
  }
}

/**
 * Applies multiple tags to a subscriber with optimized API calls
 * Uses batching and parallel processing where possible
 */
export async function applyTagsToSubscriber(
  apiSecret: string,
  tagNames: string[],
  email: string
): Promise<{ success: number; failed: number }> {
  if (!tagNames.length) {
    return { success: 0, failed: 0 };
  }

  // Get or create all tag IDs in parallel
  const tagIdPromises = tagNames.map(tagName => 
    getOrCreateTagId(apiSecret, tagName).then(id => ({ tagName, id }))
  );

  const tagResults = await Promise.allSettled(tagIdPromises);
  
  // Filter successful tag ID resolutions
  const validTags = tagResults
    .filter((result): result is PromiseFulfilledResult<{ tagName: string; id: number | null }> => 
      result.status === 'fulfilled' && result.value.id !== null
    )
    .map(result => ({ 
      tagName: result.value.tagName, 
      id: result.value.id as number 
    }));

  if (validTags.length === 0) {
    console.warn(`No valid tags could be resolved for ${email}`);
    return { success: 0, failed: tagNames.length };
  }

  // Apply tags in parallel
  const applyPromises = validTags.map(({ id, tagName }) =>
    applyTagToSubscriber(apiSecret, id, email, tagName)
  );

  const applyResults = await Promise.allSettled(applyPromises);
  
  const successCount = applyResults.filter(result => 
    result.status === 'fulfilled' && result.value === true
  ).length;

  const failedCount = tagNames.length - successCount;

  return { success: successCount, failed: failedCount };
}