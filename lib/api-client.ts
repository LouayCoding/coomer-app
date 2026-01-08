import https from 'https';
import zlib from 'zlib';
import { API_HEADERS, COOMER_API_BASE } from './constants';
import { cache, cacheKeys } from './cache';
import type { Post, Creator, PostsParams, CreatorPostsParams, Service } from '@/types/api';

export class CoomerApiClient {
  private async makeRequest<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const options = {
        headers: API_HEADERS
      };

      https.get(url, options, (res) => {
        if (res.statusCode !== 200) {
          console.error('HTTP Error:', res.statusCode, url);
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }

        const chunks: Buffer[] = [];
        const isGzipped = res.headers['content-encoding'] === 'gzip';
        const stream = isGzipped ? res.pipe(zlib.createGunzip()) : res;

        stream.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });
        stream.on('end', () => {
          try {
            const data = Buffer.concat(chunks).toString('utf8');
            const json = JSON.parse(data);
            resolve(json);
          } catch (error) {
            console.error('Parse error:', error);
            reject(error);
          }
        });
        stream.on('error', (error) => {
          console.error('Stream error:', error);
          reject(error);
        });
      }).on('error', (error) => {
        console.error('Request error:', error);
        reject(error);
      });
    });
  }

  async fetchPosts(params: PostsParams = {}): Promise<Post[]> {
    const { offset = 0, q = '', service = '' } = params;
    
    const cacheKey = cacheKeys.posts(offset, q, service);
    const cached = cache.get<Post[]>(cacheKey);
    if (cached) return cached;
    
    let url = `${COOMER_API_BASE}/posts`;
    const params_array: string[] = [];
    
    if (offset > 0) params_array.push(`o=${offset}`);
    if (q) params_array.push(`q=${encodeURIComponent(q)}`);
    if (service) params_array.push(`service=${service}`);
    
    if (params_array.length > 0) url += `?${params_array.join('&')}`;

    const result = await this.makeRequest<any>(url);
    
    let posts: Post[] = [];
    if (result && typeof result === 'object' && Array.isArray(result.posts)) {
      posts = result.posts;
    } else if (Array.isArray(result)) {
      posts = result;
    }
    
    if (posts.length > 0) {
      cache.set(cacheKey, posts, 5 * 60 * 1000);
    }
    
    return posts;
  }

  async fetchCreators(): Promise<Creator[]> {
    const url = `${COOMER_API_BASE}/creators`;
    return this.makeRequest<Creator[]>(url);
  }

  async fetchCreatorPosts(params: CreatorPostsParams): Promise<Post[]> {
    const { service, id, offset = 0 } = params;
    // Correct API endpoint: /v1/{service}/user/{creator_id}/posts
    const url = `${COOMER_API_BASE}/${service}/user/${id}/posts?o=${offset}`;
    return this.makeRequest<Post[]>(url);
  }

  async fetchPopularPosts(): Promise<Post[]> {
    const url = `${COOMER_API_BASE}/posts/popular`;
    const result = await this.makeRequest<any>(url);
    
    // API returns object with results property for popular posts
    if (result && typeof result === 'object') {
      if (Array.isArray(result.results)) {
        return result.results;
      }
      if (Array.isArray(result.posts)) {
        return result.posts;
      }
    }
    
    // Fallback if it's already an array
    if (Array.isArray(result)) {
      return result;
    }
    
    return [];
  }

  async fetchRandomPosts(): Promise<Post[]> {
    const url = `${COOMER_API_BASE}/posts/random`;
    const result = await this.makeRequest<any>(url);
    
    // API might return object with posts property
    if (result && typeof result === 'object') {
      if (Array.isArray(result.posts)) {
        return result.posts;
      }
      if (Array.isArray(result.results)) {
        return result.results;
      }
    }
    
    // Fallback if it's already an array
    if (Array.isArray(result)) {
      return result;
    }
    
    return [];
  }

  async fetchRandomCreators(): Promise<Creator[]> {
    const url = `${COOMER_API_BASE}/artists/random`;
    const result = await this.makeRequest<any>(url);
    
    // API might return object with creators/artists property
    if (result && typeof result === 'object') {
      if (Array.isArray(result.creators)) {
        return result.creators;
      }
      if (Array.isArray(result.artists)) {
        return result.artists;
      }
      if (Array.isArray(result.results)) {
        return result.results;
      }
    }
    
    // Fallback if it's already an array
    if (Array.isArray(result)) {
      return result;
    }
    
    return [];
  }

  async fetchTags(): Promise<string[]> {
    const url = `${COOMER_API_BASE}/posts/tags`;
    return this.makeRequest<string[]>(url);
  }

  async fetchAnnouncements(service: Service, creatorId: string): Promise<any[]> {
    const url = `${COOMER_API_BASE}/${service}/user/${creatorId}/announcements`;
    return this.makeRequest<any[]>(url);
  }

  async fetchLinkedAccounts(service: Service, creatorId: string): Promise<Creator[]> {
    const url = `${COOMER_API_BASE}/${service}/user/${creatorId}/links`;
    const result = await this.makeRequest<any>(url);
    
    // API returns array of linked creators
    if (Array.isArray(result)) {
      return result;
    }
    
    return [];
  }
}

export const apiClient = new CoomerApiClient();
