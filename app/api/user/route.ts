import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get('discord_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const discordId = session.discord_id;

    // Get user data
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('discord_id', discordId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get subscription data
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('discord_id', discordId)
      .eq('status', 'active')
      .single();

    // Calculate days left
    let daysLeft = 0;
    if (subscription) {
      const expiresAt = new Date(subscription.expires_at);
      const now = new Date();
      daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    return NextResponse.json({
      discord_id: user.discord_id,
      discord_username: user.discord_username,
      discord_avatar: user.discord_avatar,
      subscription: subscription ? {
        status: subscription.status,
        expires_at: subscription.expires_at,
        days_left: daysLeft,
      } : null,
    });
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
