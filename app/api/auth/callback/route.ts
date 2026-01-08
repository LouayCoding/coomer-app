import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // Exchange code for Discord access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: 'Failed to exchange code' }, { status: 400 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get Discord user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Failed to get user info' }, { status: 400 });
    }

    const discordUser = await userResponse.json();

    // Check if user exists in database
    let { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('discord_id', discordUser.id)
      .single();

    // Create or update user
    if (!user) {
      const { data: newUser, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          discord_id: discordUser.id,
          discord_username: discordUser.username,
          discord_avatar: discordUser.avatar,
          email: discordUser.email,
        })
        .select()
        .single();

      if (userError) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
      }
      user = newUser;
    } else {
      // Update user info
      await supabaseAdmin
        .from('users')
        .update({
          discord_username: discordUser.username,
          discord_avatar: discordUser.avatar,
          email: discordUser.email,
        })
        .eq('id', user.id);
    }

    // Check if user has valid subscription
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('discord_id', discordUser.id)
      .eq('status', 'active')
      .single();

    const hasAccess = subscription && new Date(subscription.expires_at) > new Date();

    // Log access attempt
    await supabaseAdmin.from('access_logs').insert({
      user_id: user.id,
      discord_id: discordUser.id,
      action: 'login',
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent'),
      success: hasAccess,
      error_message: hasAccess ? null : 'No valid subscription',
    });

    // Create session cookie
    const session = {
      user_id: user.id,
      discord_id: discordUser.id,
      discord_username: discordUser.username,
      discord_avatar: discordUser.avatar,
    };

    const response = NextResponse.json({ hasAccess, user: session });

    // Set session cookie (7 days)
    response.cookies.set('discord_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
