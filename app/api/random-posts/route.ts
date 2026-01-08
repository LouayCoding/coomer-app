import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const posts = await apiClient.fetchRandomPosts();
    
    if (!Array.isArray(posts)) {
      return NextResponse.json({ data: [] });
    }
    
    return NextResponse.json({ data: posts });
  } catch (error) {
    console.error('Error fetching random posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random posts' },
      { status: 500 }
    );
  }
}
