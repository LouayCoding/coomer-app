import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import type { Service } from '@/types/api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ service: string; id: string }> }
) {
  try {
    const { service, id } = await params;
    
    const announcements = await apiClient.fetchAnnouncements(service as Service, id);
    
    if (!Array.isArray(announcements)) {
      return NextResponse.json({ data: [] });
    }
    
    return NextResponse.json({ data: announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ data: [] });
  }
}
