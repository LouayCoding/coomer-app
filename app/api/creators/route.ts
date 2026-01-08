import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import { cache, cacheKeys } from '@/lib/cache';
import type { Creator } from '@/types/api';

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const query = searchParams.get('q') || '';
    
    let creators = cache.get<Creator[]>(cacheKeys.creators());
    
    if (!creators) {
      creators = await apiClient.fetchCreators();
      
      if (!Array.isArray(creators)) {
        return NextResponse.json({ data: [] });
      }
      
      cache.set(cacheKeys.creators(), creators, CACHE_TTL);
    }
    
    // Filter by search query if provided
    let filteredCreators = creators;
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredCreators = creators.filter(creator => 
        creator.name.toLowerCase().includes(lowerQuery) ||
        creator.service.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply pagination
    const paginatedCreators = filteredCreators.slice(offset, offset + limit);
    
    return NextResponse.json({ 
      data: paginatedCreators,
      total: filteredCreators.length,
      hasMore: offset + limit < filteredCreators.length
    });
  } catch (error) {
    console.error('Error fetching creators:', error);
    return NextResponse.json(
      { data: [], error: 'Failed to fetch creators' },
      { status: 500 }
    );
  }
}
