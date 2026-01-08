// Simple in-memory cache implementation
// For production, consider using React Query or SWR

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 15 * 60 * 1000; // 15 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.expiresIn) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: RegExp): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    });
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const cache = new CacheManager();

// Cache key generators
export const cacheKeys = {
  posts: (offset: number, query?: string, service?: string) => 
    `posts:${offset}:${query || 'all'}:${service || 'all'}`,
  
  popularPosts: () => 'posts:popular',
  
  randomPosts: () => `posts:random:${Date.now()}`, // Always fresh
  
  creators: () => 'creators:all',
  
  randomCreators: () => `creators:random:${Date.now()}`, // Always fresh
  
  creatorPosts: (service: string, id: string, offset: number) =>
    `creator:${service}:${id}:posts:${offset}`,
  
  tags: () => 'tags:all',
  
  announcements: (service: string, id: string) =>
    `announcements:${service}:${id}`,
  
  linkedAccounts: (service: string, id: string) =>
    `links:${service}:${id}`,
};
