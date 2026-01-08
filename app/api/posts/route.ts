import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import { cache, cacheKeys } from '@/lib/cache';
import type { Post } from '@/types/api';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes for posts (shorter than creators)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const offset = parseInt(searchParams.get('offset') || '0');
    const q = searchParams.get('q') || '';
    const serviceParam = searchParams.get('service') || '';
    const service = serviceParam as any;

    const cacheKey = cacheKeys.posts(offset, q, service);
    let posts = cache.get<Post[]>(cacheKey);
    
    if (!posts) {
      posts = await apiClient.fetchPosts({ offset, q, service });
      
      if (!Array.isArray(posts)) {
        return NextResponse.json({ data: [] });
      }
      
      cache.set(cacheKey, posts, CACHE_TTL);
    }

    return NextResponse.json({ data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { data: [], error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
