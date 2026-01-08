import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const tags = await apiClient.fetchTags();
    
    if (!Array.isArray(tags)) {
      return NextResponse.json({ data: [] });
    }
    
    return NextResponse.json({ data: tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
