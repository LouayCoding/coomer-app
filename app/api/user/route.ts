import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get('access_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const { code_id, fingerprint } = session;

    // Get access code details
    const { data: accessCode, error: codeError } = await supabaseAdmin
      .from('access_codes')
      .select('*')
      .eq('id', code_id)
      .single();

    if (codeError || !accessCode) {
      return NextResponse.json({ error: 'Code not found' }, { status: 404 });
    }

    // Get device info
    const { data: device } = await supabaseAdmin
      .from('devices')
      .select('*')
      .eq('code_id', code_id)
      .eq('fingerprint', fingerprint)
      .single();

    // Calculate days left
    const expiresAt = new Date(accessCode.expires_at);
    const now = new Date();
    const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Get device count for this code
    const { count: deviceCount } = await supabaseAdmin
      .from('devices')
      .select('*', { count: 'exact', head: true })
      .eq('code_id', code_id);

    return NextResponse.json({
      code: accessCode.code,
      note: accessCode.note,
      subscription: {
        status: accessCode.is_active && daysLeft > 0 ? 'active' : 'expired',
        expires_at: accessCode.expires_at,
        days_left: Math.max(0, daysLeft),
      },
      device: {
        fingerprint: fingerprint.slice(0, 8) + '...',
        registered_at: device?.created_at,
        last_seen: device?.last_seen,
      },
      limits: {
        max_devices: accessCode.max_devices,
        used_devices: deviceCount || 0,
      }
    });

  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Logout endpoint
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('access_session');
  return response;
}
