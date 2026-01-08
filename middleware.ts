import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Public routes that don't require authentication
const publicRoutes = ['/login', '/auth/callback', '/api/auth/callback', '/no-access'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get session from cookie
  const sessionCookie = request.cookies.get('discord_session');
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    const discordId = session.discord_id;

    // Check if user has valid subscription
    const { data: subscription, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('discord_id', discordId)
      .eq('status', 'active')
      .single();

    if (error || !subscription) {
      // No valid subscription - redirect to no access page
      return NextResponse.redirect(new URL('/no-access', request.url));
    }

    // Check if subscription is expired
    const expiresAt = new Date(subscription.expires_at);
    const now = new Date();

    if (expiresAt < now) {
      // Subscription expired - update status and redirect
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('id', subscription.id);

      return NextResponse.redirect(new URL('/no-access', request.url));
    }

    // Log access
    await supabaseAdmin.from('access_logs').insert({
      user_id: subscription.user_id,
      discord_id: discordId,
      action: 'page_access',
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent'),
      success: true,
    });

    // Valid subscription - allow access
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
