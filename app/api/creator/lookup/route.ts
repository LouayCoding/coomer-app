import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const service = searchParams.get('service');
    const name = searchParams.get('name');

    if (!service || !name) {
      return NextResponse.json(
        { error: 'Service and name are required' },
        { status: 400 }
      );
    }

    const creators = await apiClient.fetchCreators();
    
    if (!Array.isArray(creators)) {
      return NextResponse.json({ error: 'Failed to fetch creators' }, { status: 500 });
    }

    const creator = creators.find(
      (c) => c.service === service && c.name.toLowerCase() === name.toLowerCase()
    );

    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    console.log('Found creator:', JSON.stringify(creator, null, 2));

    return NextResponse.json({ data: creator });
  } catch (error) {
    console.error('Error looking up creator:', error);
    return NextResponse.json(
      { error: 'Failed to lookup creator' },
      { status: 500 }
    );
  }
}
