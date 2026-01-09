import { NextRequest, NextResponse } from 'next/server';

// This endpoint is deprecated - we now use /api/auth/verify-code
// Keeping this for backwards compatibility, but it just redirects

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Discord authentication is no longer supported. Please use access codes.',
      redirect: '/login'
    },
    { status: 410 } // 410 Gone
  );
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/login', request.url));
}
