import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import type { Service } from '@/types/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ service: string; id: string }> }
) {
  try {
    const { service, id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const offset = parseInt(searchParams.get('offset') || '0');

    const posts = await apiClient.fetchCreatorPosts({ service: service as Service, id, offset });

    if (!Array.isArray(posts)) {
      console.error('API returned non-array response:', posts);
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json({ data: posts });
  } catch (error) {
    console.error('Error fetching creator posts:', error);
    return NextResponse.json(
      { data: [], error: 'Failed to fetch creator posts' },
      { status: 500 }
    );
  }
}
