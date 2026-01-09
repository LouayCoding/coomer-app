'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrCreateFingerprint } from '@/lib/fingerprint';

export default function LoginPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    // Check if already logged in
    const session = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_session='));
    
    if (session) {
      router.push('/');
      return;
    }

    // Generate fingerprint
    getOrCreateFingerprint().then(fp => {
      setFingerprint(fp);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Voer een code in');
      return;
    }

    if (!fingerprint) {
      setError('Device verificatie mislukt. Ververs de pagina.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: code.trim().toUpperCase(),
          fingerprint 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ongeldige code');
        setLoading(false);
        return;
      }

      // Success - redirect to home
      router.push('/');
    } catch (err) {
      setError('Er is een fout opgetreden. Probeer opnieuw.');
      setLoading(false);
    }
  };

  // Format code input (uppercase, max 12 chars)
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
    setCode(value);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6b00] to-[#ff9000] flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-3xl">C</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to <span className="text-[#ff9000]">Coomer</span>
          </h1>
          <p className="text-gray-400">
            Voer je access code in om toegang te krijgen
          </p>
        </div>

        {/* Code Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
              Access Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={handleCodeChange}
              placeholder="XXXXXXXXXXXX"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-4 text-white text-center text-2xl tracking-widest font-mono placeholder-gray-600 focus:outline-none focus:border-[#ff9000] focus:ring-1 focus:ring-[#ff9000] transition-colors"
              autoComplete="off"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim() || !fingerprint}
            className="w-full bg-[#ff9000] hover:bg-[#ff9000]/90 disabled:bg-[#ff9000]/50 disabled:cursor-not-allowed text-black font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifiëren...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Toegang Krijgen
              </>
            )}
          </button>
        </form>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-[#1a1a1a]/50 rounded-lg border border-[#2a2a2a]">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#ff9000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Hoe krijg ik een code?
          </h3>
          <div className="text-gray-400 text-sm space-y-2">
            <p className="flex gap-2">
              <span className="text-[#ff9000] font-semibold">1.</span>
              <span>Neem contact op via Snapchat</span>
            </p>
            <p className="flex gap-2">
              <span className="text-[#ff9000] font-semibold">2.</span>
              <span>Voltooi de betaling</span>
            </p>
            <p className="flex gap-2">
              <span className="text-[#ff9000] font-semibold">3.</span>
              <span>Ontvang je unieke access code</span>
            </p>
            <p className="flex gap-2">
              <span className="text-[#ff9000] font-semibold">4.</span>
              <span>Voer de code hierboven in</span>
            </p>
          </div>
        </div>

        {/* Contact Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Nog geen code?{' '}
            <a 
              href="https://snapchat.com/add/YOUR_SNAPCHAT" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#ff9000] hover:text-[#ff9000]/80 transition-colors"
            >
              Contact via Snapchat
            </a>
          </p>
        </div>

        {/* Device Info (debug - remove in production) */}
        {fingerprint && (
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">
              Device ID: {fingerprint.slice(0, 8)}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
