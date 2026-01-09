import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { code, fingerprint } = await request.json();

    if (!code || !fingerprint) {
      return NextResponse.json(
        { error: 'Code en device fingerprint zijn vereist' },
        { status: 400 }
      );
    }

    // Normalize code (uppercase, trim)
    const normalizedCode = code.toUpperCase().trim();

    // Find the access code
    const { data: accessCode, error: codeError } = await supabaseAdmin
      .from('access_codes')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (codeError || !accessCode) {
      // Log failed attempt
      await logAccess(null, normalizedCode, fingerprint, request, 'denied', false, 'Code niet gevonden');
      
      return NextResponse.json(
        { error: 'Ongeldige code' },
        { status: 401 }
      );
    }

    // Check if code is active
    if (!accessCode.is_active) {
      await logAccess(accessCode.id, normalizedCode, fingerprint, request, 'denied', false, 'Code is gedeactiveerd');
      
      return NextResponse.json(
        { error: 'Deze code is gedeactiveerd' },
        { status: 401 }
      );
    }

    // Check if code is expired
    const expiresAt = new Date(accessCode.expires_at);
    if (expiresAt < new Date()) {
      await logAccess(accessCode.id, normalizedCode, fingerprint, request, 'expired', false, 'Code is verlopen');
      
      return NextResponse.json(
        { error: 'Deze code is verlopen' },
        { status: 401 }
      );
    }

    // Check if this device is already registered for this code
    const { data: existingDevice } = await supabaseAdmin
      .from('devices')
      .select('*')
      .eq('code_id', accessCode.id)
      .eq('fingerprint', fingerprint)
      .single();

    if (existingDevice) {
      // Device already registered - update last_seen and allow access
      await supabaseAdmin
        .from('devices')
        .update({ 
          last_seen: new Date().toISOString(),
          ip_address: request.headers.get('x-forwarded-for') || 'unknown'
        })
        .eq('id', existingDevice.id);

      await logAccess(accessCode.id, normalizedCode, fingerprint, request, 'login', true);

      // Create session
      const session = createSession(accessCode, fingerprint);
      return createSuccessResponse(session, accessCode);
    }

    // Check how many devices are registered for this code
    const { count: deviceCount } = await supabaseAdmin
      .from('devices')
      .select('*', { count: 'exact', head: true })
      .eq('code_id', accessCode.id);

    if (deviceCount !== null && deviceCount >= accessCode.max_devices) {
      await logAccess(accessCode.id, normalizedCode, fingerprint, request, 'denied', false, 'Maximum aantal devices bereikt');
      
      return NextResponse.json(
        { error: 'Deze code is al in gebruik op een ander apparaat' },
        { status: 401 }
      );
    }

    // Register new device
    const { error: deviceError } = await supabaseAdmin
      .from('devices')
      .insert({
        code_id: accessCode.id,
        fingerprint: fingerprint,
        user_agent: request.headers.get('user-agent'),
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      });

    if (deviceError) {
      console.error('Device registration error:', deviceError);
      return NextResponse.json(
        { error: 'Kon device niet registreren' },
        { status: 500 }
      );
    }

    // Update times_used counter
    await supabaseAdmin
      .from('access_codes')
      .update({ times_used: (accessCode.times_used || 0) + 1 })
      .eq('id', accessCode.id);

    await logAccess(accessCode.id, normalizedCode, fingerprint, request, 'login', true);

    // Create session
    const session = createSession(accessCode, fingerprint);
    return createSuccessResponse(session, accessCode);

  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    );
  }
}

// Helper function to create session object
function createSession(accessCode: any, fingerprint: string) {
  return {
    code_id: accessCode.id,
    code: accessCode.code,
    fingerprint: fingerprint,
    expires_at: accessCode.expires_at,
    note: accessCode.note,
  };
}

// Helper function to create success response with cookie
function createSuccessResponse(session: any, accessCode: any) {
  const response = NextResponse.json({
    success: true,
    expires_at: accessCode.expires_at,
    days_left: Math.ceil((new Date(accessCode.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  });

  // Set session cookie (valid until code expires, max 30 days)
  const maxAge = Math.min(
    Math.ceil((new Date(accessCode.expires_at).getTime() - Date.now()) / 1000),
    60 * 60 * 24 * 30 // Max 30 days
  );

  response.cookies.set('access_session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: maxAge,
    path: '/',
  });

  return response;
}

// Helper function to log access attempts
async function logAccess(
  codeId: string | null,
  code: string,
  fingerprint: string,
  request: NextRequest,
  action: string,
  success: boolean,
  errorMessage?: string
) {
  try {
    await supabaseAdmin.from('code_access_logs').insert({
      code_id: codeId,
      code: code,
      fingerprint: fingerprint,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent'),
      action: action,
      success: success,
      error_message: errorMessage,
    });
  } catch (error) {
    console.error('Failed to log access:', error);
  }
}
