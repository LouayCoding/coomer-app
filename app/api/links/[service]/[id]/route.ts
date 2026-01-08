import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import type { Service } from '@/types/api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ service: string; id: string }> }
) {
  try {
    const { service, id } = await params;
    
    const links = await apiClient.fetchLinkedAccounts(service as Service, id);
    
    return NextResponse.json({ data: links });
  } catch (error) {
    console.error('Error fetching linked accounts:', error);
    return NextResponse.json({ data: [] });
  }
}
