import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Public routes that don't require authentication
const publicRoutes = ['/login', '/api/auth/verify-code', '/no-access'];

// Initialize Supabase client for middleware
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow static files and API routes that don't need auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/posts') ||
    pathname.startsWith('/api/creators') ||
    pathname.startsWith('/api/popular') ||
    pathname.startsWith('/api/random') ||
    pathname.startsWith('/api/tags') ||
    pathname.startsWith('/api/creator') ||
    pathname.includes('.')
  ) {
    // For API routes, still check auth but don't redirect
    if (pathname.startsWith('/api/')) {
      const sessionCookie = request.cookies.get('access_session');
      if (!sessionCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    return NextResponse.next();
  }

  // Get session from cookie
  const sessionCookie = request.cookies.get('access_session');
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    const { code_id, fingerprint, expires_at } = session;

    // Quick expiry check (without database)
    if (new Date(expires_at) < new Date()) {
      // Clear expired session
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_session');
      return response;
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify code is still valid in database
    const { data: accessCode, error } = await supabase
      .from('access_codes')
      .select('*')
      .eq('id', code_id)
      .eq('is_active', true)
      .single();

    if (error || !accessCode) {
      // Code not found or inactive - clear session
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_session');
      return response;
    }

    // Check if code is expired in database
    if (new Date(accessCode.expires_at) < new Date()) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_session');
      return response;
    }

    // Verify device fingerprint is registered for this code
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('*')
      .eq('code_id', code_id)
      .eq('fingerprint', fingerprint)
      .single();

    if (deviceError || !device) {
      // Device not registered - possible code sharing attempt
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_session');
      return response;
    }

    // Update last_seen for device
    await supabase
      .from('devices')
      .update({ 
        last_seen: new Date().toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || 'unknown'
      })
      .eq('id', device.id);

    // Valid session - allow access
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('access_session');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|manifest|json)$).*)',
  ],
};
