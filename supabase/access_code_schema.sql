-- =====================================================
-- ACCESS CODE SYSTEEM - DATABASE SCHEMA
-- =====================================================
-- Dit script maakt de tabellen voor het access code systeem
-- Voer dit uit in Supabase SQL Editor
-- =====================================================

-- Drop oude tabellen als ze bestaan (optioneel - wees voorzichtig!)
-- DROP TABLE IF EXISTS devices CASCADE;
-- DROP TABLE IF EXISTS access_codes CASCADE;

-- =====================================================
-- ACCESS CODES TABEL
-- =====================================================
CREATE TABLE IF NOT EXISTS access_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    max_devices INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_by TEXT, -- Discord ID van admin
    note TEXT, -- Optionele notitie (bijv. Snapchat username)
    times_used INTEGER DEFAULT 0
);

-- Index voor snelle code lookups
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_access_codes_active ON access_codes(is_active);

-- =====================================================
-- DEVICES TABEL
-- =====================================================
CREATE TABLE IF NOT EXISTS devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code_id UUID REFERENCES access_codes(id) ON DELETE CASCADE,
    fingerprint TEXT NOT NULL,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(code_id, fingerprint)
);

-- Index voor snelle fingerprint lookups
CREATE INDEX IF NOT EXISTS idx_devices_fingerprint ON devices(fingerprint);
CREATE INDEX IF NOT EXISTS idx_devices_code_id ON devices(code_id);

-- =====================================================
-- ACCESS LOGS TABEL (optioneel - voor tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS code_access_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code_id UUID REFERENCES access_codes(id) ON DELETE SET NULL,
    code TEXT,
    fingerprint TEXT,
    ip_address TEXT,
    user_agent TEXT,
    action TEXT, -- 'login', 'verify', 'denied', 'expired'
    success BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index voor logs
CREATE INDEX IF NOT EXISTS idx_code_access_logs_code ON code_access_logs(code);
CREATE INDEX IF NOT EXISTS idx_code_access_logs_created ON code_access_logs(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_access_logs ENABLE ROW LEVEL SECURITY;

-- Policies voor service role (volledige toegang)
CREATE POLICY "Service role has full access to access_codes" ON access_codes
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to devices" ON devices
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to code_access_logs" ON code_access_logs
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Functie om een random code te genereren
CREATE OR REPLACE FUNCTION generate_access_code(length INTEGER DEFAULT 12)
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Functie om te checken of een code geldig is
CREATE OR REPLACE FUNCTION is_code_valid(check_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    code_record RECORD;
BEGIN
    SELECT * INTO code_record FROM access_codes 
    WHERE code = check_code 
    AND is_active = true 
    AND expires_at > NOW();
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VOORBEELD DATA (optioneel - voor testen)
-- =====================================================

-- Uncomment om een test code toe te voegen:
-- INSERT INTO access_codes (code, expires_at, note) 
-- VALUES ('TESTCODE123', NOW() + INTERVAL '30 days', 'Test code');

-- =====================================================
-- CLEANUP OUDE TABELLEN (optioneel)
-- =====================================================
-- Als je de oude Discord-gerelateerde tabellen wilt verwijderen:
-- DROP TABLE IF EXISTS subscriptions CASCADE;
-- DROP TABLE IF EXISTS payment_tickets CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS access_logs CASCADE;

-- =====================================================
-- DONE!
-- =====================================================
