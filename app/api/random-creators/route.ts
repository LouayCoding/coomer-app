import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const creators = await apiClient.fetchRandomCreators();
    
    if (!Array.isArray(creators)) {
      return NextResponse.json({ data: [] });
    }
    
    return NextResponse.json({ data: creators });
  } catch (error) {
    console.error('Error fetching random creators:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random creators' },
      { status: 500 }
    );
  }
}
